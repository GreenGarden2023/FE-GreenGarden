import { CreateFeedback, FeedbackGet, UpdateFeedback } from "app/models/feedback";
import golbalAxios from "../utils/http-client";
import { Response } from "app/models/response";

const createFeedback = async (data: CreateFeedback) => {
    const res = await golbalAxios.post('/feedback/create-feedback', data)
    return res.data
}
const updateFeedback = async (data: UpdateFeedback) => {
    const res = await golbalAxios.post('/feedback/update-feedback', data)
    return res.data
}
const getListFeedbackByProductItemDetail = async (productItemDetailId: string) =>{
    const res = await golbalAxios.get<Response<FeedbackGet[]>>(`/feedback/get-list-feedback-by-product-item-detail?productItemDetailId=${productItemDetailId}`)
    return res.data
}

const getListFeedbackByProductItem = async (productItemId: string) =>{
    const res = await golbalAxios.get<Response<FeedbackGet[]>>(`/feedback/get-list-feedback-by-product-item?productItemId=${productItemId}`)
    return res.data
}


const feedbackService = {
    createFeedback,
    updateFeedback,
    getListFeedbackByProductItemDetail,
    getListFeedbackByProductItem
}

export default feedbackService