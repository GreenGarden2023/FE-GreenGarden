import { Order, OrderCreate } from "app/models/order";
import { Response } from "app/models/response";
import { User } from "app/models/user";
import golbalAxios from "../utils/http-client";

interface GetData{
    orders: Order[];
    user: User
}

const getAllOrdersCustomer = async (): Promise<Response<GetData>> =>{
    const result = await golbalAxios.get<Response<GetData>>('/order/get-list-order-by-customer')
    return result.data
}
const getAllOrdersManager = async (): Promise<Response<GetData>> =>{
    const result = await golbalAxios.get<Response<GetData>>('/order/get-list-order-by-manager')
    return result.data
}

const createOrder = async (orderCreate: OrderCreate) =>{
    const res = await golbalAxios.post('/order/create-order', orderCreate)
    return res.data
}

const orderService = {
    getAllOrdersCustomer,
    getAllOrdersManager,
    createOrder
}

export default orderService