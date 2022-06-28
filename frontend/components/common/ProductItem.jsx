import React from 'react';
import '../../styles/components/product-item.css'
import {PRICE} from "../../constants";
import {getPrice} from "../../utils/near/utils";

const ProductItem = ({buttonText, onClick, product}) => {

    const productPrice = getPrice(product.product_price)

    return (
        <div className="product__wrapper flex justify-between items-center">
            <div className="flex items-center">
                <div className="product__img">
                    <img src={product.product_image} alt="product"/>
                </div>
                <p className="ml60">{product.product_title}</p>
                <p className="ml60">{PRICE} {productPrice} near</p>
            </div>
            <button className="button" onClick={() => onClick(product)}>{buttonText}</button>
        </div>
    );
};

export default ProductItem;