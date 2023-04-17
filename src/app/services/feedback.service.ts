import { CreateFeedback, UpdateFeedback } from "app/models/feedback";
import golbalAxios from "../utils/http-client";

const createFeedback = async (data: CreateFeedback) => {
    const res = await golbalAxios.post('/feedback/create-feedback', data)
    return res.data
}
const updateFeedback = async (data: UpdateFeedback) => {
    const res = await golbalAxios.post('/feedback/update-feedback', data)
    return res.data
}

const feedbackService = {
    createFeedback,
    updateFeedback
}

export default feedbackService