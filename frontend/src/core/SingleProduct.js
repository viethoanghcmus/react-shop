import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import { getSingleProduct, getRelatedProduct } from './apiCore'
import ShowImage from './ShowImage'
import './SingleProduct.css'
import 'antd/dist/antd.css';
import { addCartItem } from './cartHelper'
import InputNumber from './InputNumber'
import { createAction } from '@reduxjs/toolkit'
import { connect } from 'react-redux'
import TitleList from './TitleList'
import Loading from './Loading'
import CCard from './Card'
import { scrollTop } from './Utils'

const SingleProduct = (props) => {

    const [product, setProduct] = useState({});
    const [relatedProduct, setRelatedProduct] = useState([]);
    const [error, setError] = useState('');
    const [redirect, setRedirect] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);


    const loadSingleProduct = productId => {
        getSingleProduct(productId).then(data => {
            if (data.error) {
                setError(data.error);
            } else {
                setProduct(data);
                getRelatedProduct(data._id).then(data => {
                    if (data.error) {
                        setError(data.error);
                    } else {
                        setRelatedProduct(data);
                        setLoading(false)
                    }
                })

            }
        })
    }

    useEffect(() => {
        const productId = props.match.params.productId;
        loadSingleProduct(productId)
        scrollTop();
    }, [props])

    const addToCartHandler = () => {
        addCartItem(product, quantity, () => {
            setRedirect(true);
            props.cartChange();
        })
    }



    const redirectToCart = () => {
        if (redirect) {
            return <Redirect to='/cart' />
        }
    }

    const handleChange = (value) => {
        setQuantity(value);
    }

    const shippingStatus = () => {
        if (product.shipping) {
            return (<div className='shipping-available'>
                <i class="fa fa-truck" aria-hidden="true"></i> Vận chuyển khả dụng
            </div>);
        } else {
            return (<div className='shipping-unavailable'>
                <i class="fa fa-truck" aria-hidden="true"></i> Vận chuyển không khả dụng, vui lòng liên hệ người bán
            </div>);
        }
    }

    return (
        <div className='container'>
            {loading && <Loading />}
            {!loading &&
                <div>
                    <div className="row">
                        {redirectToCart()}
                        <div className="col-lg-4">
                            <ShowImage item={product} url='product' height={400} />
                        </div>
                        <div className="col-lg-8">
                            <h3>{product.name}</h3>
                            <div>
                                Giá:
                        <h3 className="product-price">
                                    {product.price}đ
                         </h3>
                            </div>
                            <div>
                                Kho:
                        <div className='product-quantity'>
                                    {product.quantity}
                                </div>
                            </div>
                            <div>
                                {shippingStatus()}
                            </div>

                            <div className="adjust-quantity row">
                                <InputNumber handleInputChange={handleChange} />
                                <button className="btn btn-outline-info ml-4"
                                    onClick={addToCartHandler}
                                >Thêm vào giỏ hàng</button>
                            </div>
                        </div>
                    </div>
                    <div>
                        <TitleList name='Mô tả sách' />
                        <p>{product.description}</p>
                    </div>
                    <div>
                        <TitleList name='Sách tương tự' />
                        <div className="row">
                            {relatedProduct.map(product => (
                                <div className="col-lg-3 col-md-4 col-xs-6 element-center">
                                    <CCard key={product._id} product={product} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            }

        </div>
    );
};

const cartChangeAction = createAction('CART_CHANGE')

const mapDispatchToProps = (dispatch) => ({
    cartChange: () => dispatch(cartChangeAction())
})

export default connect(null, mapDispatchToProps)(SingleProduct);