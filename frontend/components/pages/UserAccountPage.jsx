import React, {useEffect, useState} from 'react';
import ProductItem from "../common/ProductItem";
import '../../styles/pages/private-pages.css';
import {
    ADD,
    ADD_PRODUCT,
    DELETE,
    IMAGE, IT_MIGHT_TAKE_SOME_TIME,
    LOADING, MAX_PRICE_WARNING, MIN_PRICE_WARNING, NO_IMAGE, PRICE_LIMIT, SHORT_TITLE,
    TITLE,
    YOU_DO_NOT_HAVE_PRODUCTS,
    YOUR_PRODUCTS
} from "../../constants";
import Modal from "../common/Modal";
import {get_user_products, remove_user_product, add_user_product, toFixed} from "../../utils/near/utils";
import {notify} from "../../utils/notify";

const NEAR_TYPE = 1000000000000000000000000

const UserAccountPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [userProducts, setUserProducts] = useState([])
    const [imageSrc, setImageSrc] = useState('')
    const [title, setTitle] = useState('')
    const [price, setPrice] = useState(0)

    useEffect(()=> {
        getUserProducts()
    }, [])

    async function getUserProducts() {
        setIsLoading(true)
        const products = await get_user_products()
        if(products !== null) {
            setUserProducts(products)
            setIsLoading(false)
        } else {
            setUserProducts([])
            setIsLoading(false)
        }
    }

    const closeModal = () => setIsModalOpen(false)
    const openModal = () => setIsModalOpen(true)

    const setProductTitle = (e) => {
        setTitle(e.target.value)
    }
    const setProductPrice= (e) => {
        setPrice(e.target.value)
    }

    const setProductImage = (e) => {
        const file = e.target.files[0]

        const reader = new FileReader()
        reader.onload = (e) => {
            setImageSrc(e.target.result)
        }

        reader.readAsDataURL(file)
    }

    const addUserProduct = () => {
        if(title.trim().length < 3) {
            notify(SHORT_TITLE)
            return
        }
        if(+price < 1) {
            notify(MIN_PRICE_WARNING)
            return
        }
        if(+price > 10) {
            notify(MAX_PRICE_WARNING)
            return
        }
        if(imageSrc === '') {
            notify(NO_IMAGE)
            return
        }
        notify(IT_MIGHT_TAKE_SOME_TIME)
        const multipliedPrice = +price * NEAR_TYPE
        const strNearPrice = toFixed(multipliedPrice).toString()
        add_user_product(imageSrc, title, strNearPrice).then(() => {
            getUserProducts()
        })
        setIsModalOpen(false)
        setTitle('')
        setPrice(0)
        }

    const deleteProduct = (product) => {
        notify(IT_MIGHT_TAKE_SOME_TIME)
        remove_user_product(product.product_id).then(() => {
            getUserProducts()
        })
    }

    return (
        <div className="page__wrapper">
            <div className="mt40 flex justify-between items-center">
                <h2>{YOUR_PRODUCTS}</h2>
                <button className="button" onClick={openModal}>{ADD_PRODUCT}</button>
            </div>
            <div className="page__products-list ml60 mt40">
                {isLoading &&  (
                    <h1>{LOADING}</h1>
                )}
                {!userProducts.length && !isLoading && (
                    <h1>{YOU_DO_NOT_HAVE_PRODUCTS}</h1>
                )}
                {userProducts.length !== 0 && !isLoading && userProducts.map(product => (
                    <ProductItem
                        key={product.product_id}
                        buttonText={DELETE}
                        product={product}
                        onClick={deleteProduct}/>
                ))}
            </div>
            <Modal isOpen={isModalOpen} closeModal={closeModal}>
                <div>
                    <h2>{ADD_PRODUCT}</h2>
                    <div className="mt20 flex column">
                        <label className="label" htmlFor="product-title">{TITLE}</label>
                        <input id="product-title" type="text" className="input" value={title} onChange={setProductTitle}/>
                    </div>
                    <div className="mt20 flex column">
                        <label className="label" htmlFor="product-price">{PRICE_LIMIT}</label>
                        <input id="product-price" value={price} onChange={setProductPrice} type="number" className="input" max={10} min={1}/>
                    </div>
                    <div className="mt20 flex column">
                        <label className="label" htmlFor="product-image">{IMAGE}</label>
                        <input id="product-image" type="file" accept="image/png, image/jpeg, image/jpg" onChange={setProductImage}/>
                    </div>
                    <div className="mt40">
                        <button className="button" onClick={addUserProduct}>{ADD}</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default UserAccountPage;