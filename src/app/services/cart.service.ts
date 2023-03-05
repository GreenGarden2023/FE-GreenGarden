import { Cart } from "app/models/cart";
import { Response } from "app/models/response";
import { CartProps } from "app/slices/cart";
import golbalAxios from "../utils/http-client";

const getCart = async (): Promise<Response<Cart>> =>{
    const res = await golbalAxios.get<Response<Cart>>('/cart/get-cart')
    return res.data
}

const addToCart = async (cartProps: CartProps): Promise<Response<Cart>> =>{
    const res = await golbalAxios.post<Response<Cart>>('/cart/add-to-cart', cartProps)
    return res.data
}

const cartService = {
    getCart,
    addToCart
}

export default cartService