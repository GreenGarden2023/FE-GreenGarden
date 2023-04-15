import { CreateFeedback } from "app/models/feedback";
import golbalAxios from "../utils/http-client";

const createFeedback = async (data: CreateFeedback) => {
    const res = await golbalAxios.post('/feedback/create-feedback', data)
    return res.data
}

const feedbackService = {
    createFeedback
}

export default feedbackService