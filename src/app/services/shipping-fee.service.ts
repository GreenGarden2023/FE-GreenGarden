import { Response } from "app/models/response";
import { ShippingFee } from "app/models/shipping-fee";
import golbalAxios from "../utils/http-client";

const getList = async () =>{
    const res = await golbalAxios.get<Response<ShippingFee[]>>('/shipping-fee/get-list')
    return res.data
}
const updateShippingFee = async (data: Partial<ShippingFee>) =>{
    const res = await golbalAxios.post('/shipping-fee/update-shipping-fee', data)
    return res.data
}

const shippingFeeService = {
    getList,
    updateShippingFee
}

export default shippingFeeService