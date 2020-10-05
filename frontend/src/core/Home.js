import React, { useState, useEffect } from 'react';
import { getProducts, searchProduct } from './apiCore'
import ShowImage from '../core/ShowImage'
import CCard from './Card'
import './Home.css'
import TitleList from './TitleList';

export default function Home(props) {
    const [productBySell, setProductBySell] = useState([]);
    const [productByArrival, setProductByArrival] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [searched, setSearched] = useState(false);
    const [error, setError] = useState('');
    const loadProductBySell = () => {
        getProducts('sold').then(data => {
            if (data.error) {
                setError(data.error);
            } else {
                setError('');
                setProductBySell(data);
            }
        })
    }

    const loadProductByArrival = () => {
        getProducts('createdAt').then(data => {
            if (data.error) {
                setError(data.error);
            } else {
                setError('');
                setProductByArrival(data);
            }
        })
    }


    const loadSearchResult = () => {
        setSearchResults(props.search.searchResult);
        setSearched(props.search.searched)
    };

    useEffect(() => {
        loadProductBySell();
        loadProductByArrival();
        setSearched(false)
    }, []);

    useEffect(() => {
        loadSearchResult();
    }, [props.search])

    const searchMessage = (result = []) => {
        let message = '';
        if (searched && result.length > 1) {
            message = `Found ${result.length} products`
        }
        if (searched && result.length === 1) {
            message = `Found ${result.length} product`;
        }
        if (searched && result.length === 0) {
            message = 'No products found';
        }

        return (message &&
            <h3 className="title-top5">
                <i className="fa fa-fire" aria-hidden="true"></i>
                {message}
                <hr />
            </h3>);
    }


    return (
        <div className='home'>
            {!searched &&
                <div className='products-home'>
                    <TitleList name='Sản phẩm mới' />
                    <div className="row">
                        {productByArrival.map((product, i) => (
                            <div className="col-lg-3 col-md-4 col-xs-6 element-center">
                                <CCard key={i} product={product} />
                            </div>
                        ))}

                    </div>
                    <TitleList name='Sản phẩm bán chạy' />
                    <div className='row mt-4'>
                        {productByArrival.map((product, i) => (
                            <div className="col-md-3 col-sm-4 col-xs-2 element-center">
                                <CCard key={i} product={product} />
                            </div>
                        ))}
                    </div>
                </div>
            }
            {searched &&
                <div className="">
                    <TitleList name={`Tìm thấy ${searchResults.length} kết quả`} />
                    <div className="row">
                        {searchResults && searchResults.map((product, i) => (
                            <div className="col-lg-3 col-md-4 col-xs-6 element-center">
                                <CCard key={i} product={product} />
                            </div>
                        ))}
                    </div>
                </div>
            }
        </div>


    );
}