import React, {useEffect, useState} from 'react';
import ProductItem from "../common/ProductItem";
import '../../styles/pages/private-pages.css';
import {BUY, LOADING, MARKET_PLACE, NO_SUCH_PRODUCT, YOU_CANT_BUY_OWN_PRODUCT} from "../../constants";
import {buy_product, get_all_products} from "../../utils/near/utils";
import {notify} from "../../utils/notify";

const MarketPlacePage = () => {
    const [allProducts, setAllProducts] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(()=> {
        getAllProducts()
    }, [])

    async function getAllProducts () {
        setIsLoading(true)
        const products = await get_all_products()
        if(products !== null) {
            setAllProducts(products)
            setIsLoading(false)
        } else {
            setAllProducts([])
            setIsLoading(false)
        }
    }

    const buyProduct = (product) => {
        if(product.product_owner === window.accountId) {
            notify(YOU_CANT_BUY_OWN_PRODUCT)
            return
        }
        buy_product(product)
    }

    return (
        <div className="page__wrapper">
            <div className="mt40 flex justify-between items-center">
                <h1>{MARKET_PLACE}</h1>
            </div>
            <div className="page__products-list ml60 mt40">
                {isLoading &&  (
                    <h1>{LOADING}</h1>
                )}
                {!allProducts.length && !isLoading && (
                    <h1>{NO_SUCH_PRODUCT}</h1>
                )}
                {allProducts.length !== 0 && allProducts.map(product => (
                    <ProductItem
                        key={product.product_id}
                        buttonText={BUY}
                        product={product}
                        onClick={buyProduct}/>
                ))}
            </div>
        </div>
    );
};

export default MarketPlacePage;