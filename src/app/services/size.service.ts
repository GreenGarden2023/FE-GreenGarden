import { Response } from "app/models/response"
import { Size, SizeHandle } from "app/models/size"
import golbalAxios from "../utils/http-client";

const getAllSize = async (): Promise<Response<Size[]>> =>{
    const res = await golbalAxios.get<Response<Size[]>>('/size/get-sizes');
    return res.data
}
const createSize = async (size: SizeHandle) =>{
    const res = await golbalAxios.post('/size/create-size', size)
    return res.data
}

const sizeService = {
    getAllSize,
    createSize
}

export default sizeService