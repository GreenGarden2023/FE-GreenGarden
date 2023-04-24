import { UploadFile } from "antd";
import golbalAxios from "../utils/http-client";
import CONSTANT from "app/utils/constant";

const getAnImage = async (imgUrl: string) =>{
    const result = await golbalAxios.get<UploadFile>(`/image/get-an-image?fileUrl=${imgUrl}`)
    return result.data
}

const isValidFile = (file: File) =>{
    return CONSTANT.SUPPORT_FORMATS.includes(file.type) && file.size <= CONSTANT.FILE_SIZE_ACCEPTED
}

const fileService = {
    getAnImage,
    isValidFile
}

export default fileService