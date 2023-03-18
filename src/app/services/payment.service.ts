import { OrderType } from "app/models/general-type";
import { Payment } from "app/models/payment";
import { Response } from "app/models/response";
import golbalAxios from "../utils/http-client";

const depositPaymentMomo = async (orderId: string, orderType: OrderType) =>{
    const res = await golbalAxios.post<Response<Payment>>('/payment/deposit-payment-momo', { orderId, orderType })
    return res.data
}
const depositPaymentCash = async (orderId: string, orderType: OrderType) =>{
    const res = await golbalAxios.post('/payment/deposit-payment-cash', { orderId, orderType })
    return res.data
}
const paymentCash = async (orderId: string, amount: number, orderType: OrderType, paymentType?: string) =>{
    const res = await golbalAxios.post('/payment/payment-cash', { orderId, amount, orderType, paymentType })
    return res.data
}
const paymentMomo = async (orderId: string, amount: number, orderType: OrderType, paymentType?: string) =>{
    const res = await golbalAxios.post<Response<Payment>>('/payment/payment-momo', { orderId, amount, orderType, paymentType })
    return res.data
}

const paymentService = {
    depositPaymentMomo,
    depositPaymentCash,
    paymentCash,
    paymentMomo
}

export default paymentService