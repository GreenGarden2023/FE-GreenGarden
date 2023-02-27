import { UploadFile } from "antd";
import golbalAxios from "../utils/http-client";

const getAnImage = async (imgUrl: string) =>{
    const result = await golbalAxios.get<UploadFile>(`/image/get-an-image?fileUrl=${imgUrl}`)
    return result.data
}

const fileService = {
    getAnImage
}

export default fileService