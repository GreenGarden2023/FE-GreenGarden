import { Response } from "app/models/response";
import golbalAxios from "../utils/http-client";

const uploadListFiles = async (files: File[]) =>{
    const formData = new FormData();
    for (const file of files) {
        formData.append('files', file)
    }
    const res = await golbalAxios.post<Response<string[]>>('/image/upload-images', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    return res.data
}

const uploadService = {
    uploadListFiles
}

export default uploadService