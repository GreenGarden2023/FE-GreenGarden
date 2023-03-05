import { OrderCreate } from "app/models/order";
import golbalAxios from "../utils/http-client";

const getAllOrders = async () =>{

}

const createOrder = async (orderCreate: OrderCreate) =>{
    const res = await golbalAxios.post('/order/create-order', orderCreate)
    return res.data
}

const orderService = {
    getAllOrders,
    createOrder
}

export default orderService