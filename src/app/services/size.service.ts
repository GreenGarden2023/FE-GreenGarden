import { Response } from "app/models/response"
import { Size, SizeHandle } from "app/models/size"
import golbalAxios from "../utils/http-client";

const getAllSize = async (): Promise<Response<Size[]>> =>{
    const res = await golbalAxios.get<Response<Size[]>>('/size/get-sizes');
    return res.data
}
const createSize = async (size: SizeHandle): Promise<Response<Size>> =>{
    const createProps = {
        sizeName: size.sizeName,
        sizeType: size.sizeType
    }
    const res = await golbalAxios.post<Response<Size>>('/size/create-size', createProps)
    return res.data
}
const updateSize = async (size: SizeHandle): Promise<Response<Size>> =>{
    const updateProps = {
        sizeID: size.id,
        sizeName: size.sizeName,
        sizeType: size.sizeType
    }
    const res = await golbalAxios.post<Response<Size>>('/size/update-size', updateProps)
    return res.data
}   

const sizeService = {
    getAllSize,
    createSize,
    updateSize
}

export default sizeService