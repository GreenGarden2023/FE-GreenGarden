import { User } from "./user"

export interface Feedback{
    id: string
    rating: number
    comment: string
    createDate: Date
    updateDate: Date
    status: string
    imageURL: string[]
}

export interface CreateFeedback{
    productItemDetailID: string
    rating: number
    comment: string
    imagesUrls: string[]
    orderID: string
}

export interface UpdateFeedback{
    feedbackID: string
    rating: number
    comment: string
    imagesUrls: string[]
}

export interface FeedbackGet extends Feedback{
    user: User
}