import { Button, Form, Image, Input, Modal } from 'antd'
import useDispatch from 'app/hooks/use-dispatch'
import { CreateFeedback, UpdateFeedback } from 'app/models/feedback'
import { SaleOrderDetail } from 'app/models/order'
import feedbackService from 'app/services/feedback.service'
import uploadService from 'app/services/upload.service'
import { setNoti } from 'app/slices/notification'
import CONSTANT from 'app/utils/constant'
import React, { useEffect, useRef, useState } from 'react'
import { AiFillStar, AiOutlineClose, AiOutlineStar } from 'react-icons/ai'
import './style.scss'

interface ClientFeedbackProps{
    orderId: string;
    order: SaleOrderDetail;
    fbIndex: number;
    onSubmit: () => void
    onClose: () => void;
}

const ClientFeedback: React.FC<ClientFeedbackProps> = ({ orderId, order, fbIndex, onSubmit, onClose }) => {
    const dispatch = useDispatch()

    const ref = useRef<HTMLInputElement>(null)

    const [comment, setComment] = useState('')
    const [rating, setRating] = useState(5)
    const [imagesUrls, setImagesUrls] = useState<string[]>([])
    const [loadingAction, setLoadingAction] = useState(false)

    useEffect(() =>{
        if(fbIndex < 0) return;
        const { comment, rating, imageURL } = order.feedbackList[fbIndex]
        setComment(comment)
        setRating(rating)
        setImagesUrls(imageURL)
    }, [fbIndex, order])

    useEffect(() =>{
        if(!order.feedbackList || order.feedbackList.length === 0) return;
        setRating(order.feedbackList[0].rating)
    }, [order])

    const handleUploadFiles = async (e: React.ChangeEvent<HTMLInputElement>) =>{
        const files = e.target.files
        if(!files) return;

        const finalFiles: File[] = []
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if(!CONSTANT.SUPPORT_FORMATS.includes(file.type) || CONSTANT.FILE_SIZE_ACCEPTED < file.size ){
                dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.INVALID_FILE}))
                return;
            }
            finalFiles.push(file)
        }

        try{
            const res = await uploadService.uploadListFiles(finalFiles)
            setImagesUrls([...imagesUrls, ...res.data])
        }catch{
            dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
        }
    }

    const setRatingSelect = (stars: number) =>{
        setRating(stars)
    }

    const handleSubmitForm = async () =>{
        if(imagesUrls.length === 0){
            dispatch(setNoti({type: 'error', message: 'Cần có ít nhất 1 hình ảnh cho đánh giá này'}))
            return;
        }

        setLoadingAction(true)
        if(fbIndex < 0){
            try{
                const body: CreateFeedback = {
                    comment,
                    rating,
                    imagesUrls,
                    orderID: orderId,
                    productItemDetailID: order.productItemDetailID
                }
                await feedbackService.createFeedback(body)
                onSubmit()
                dispatch(setNoti({type: 'success', message: 'Đăng tải đánh giá thành công'}))
            }catch{
    
            }
        }else{
            const body: UpdateFeedback = {
                feedbackID: order.feedbackList[fbIndex].id,
                comment,
                rating,
                imagesUrls
            }
            await feedbackService.updateFeedback(body)
            onSubmit()
            dispatch(setNoti({type: 'success', message: 'Cập nhật đánh giá thành công'}))
        }
        setLoadingAction(false)
    }

    const removeImage = (index: number) =>{
        imagesUrls.splice(index, 1)
        setImagesUrls([...imagesUrls])
    }

    return (
        <Modal
            open
            title='Đánh giá sản phẩm'
            width={800}
            onCancel={onClose}
            footer={false}
        >
            <Form
                onFinish={handleSubmitForm}
            >
                <div className="preview-feedback-order">
                    <div className="head">
                        <div className="left">
                            <img src={order.imgURL} alt="/" />
                        </div>
                        <div className="right">
                            <p className='name'>{order.productItemName}</p>
                        </div>
                    </div>
                    <div className="rating">
                        <span>Chất lượng sản phẩm</span>
                        <div className="stars">
                            {
                                [...Array(5)].map((_, i) => (
                                    <>
                                        {
                                            (i + 1) <= rating ? <AiFillStar cursor='pointer' color='#f95441' size={25} onClick={() => setRatingSelect(i + 1)} /> : 
                                            <AiOutlineStar cursor='pointer' color='#f95441' size={25} onClick={() => setRatingSelect(i + 1)} />
                                        }
                                    </>
                                ))
                            }
                        </div>
                    </div>
                    <div className="images">
                        <Image.PreviewGroup>
                            {
                                imagesUrls.map((item, index) => (
                                    <div key={index} className='img-item'>
                                        <Image 
                                            src={item}
                                            width={100}
                                            height={100}
                                            style={{objectFit: 'cover'}}
                                        />
                                        <AiOutlineClose color='#fff' size={18} className='img-icon' onClick={() => removeImage(index)} />
                                    </div>
                                ))
                            }
                        </Image.PreviewGroup>
                    </div>
                    <div className="comment">
                        <Input.TextArea autoSize={{minRows: 4, maxRows: 6}} placeholder='Đánh giá của bạn' value={comment} onChange={(e) => setComment(e.target.value)} />
                    </div>
                    <div className="uploader">
                        <input type='file' multiple ref={ref} hidden accept='.png,.jpg,.jpeg' onChange={handleUploadFiles} />
                        <button type='button' className="btn" onClick={() => ref.current?.click()}>Thêm hình ảnh</button>
                    </div>
                </div>
                <div className='btn-form-wrapper'>
                    <Button htmlType='button' disabled={loadingAction} type='default' className='btn-cancel' size='large' onClick={onClose}>Hủy bỏ</Button>
                    <Button htmlType='submit' loading={loadingAction} type='primary' className='btn-update' size='large' >
                        {
                            fbIndex < 0 ? 'Đăng tải' : 'Cập nhật'
                        }
                    </Button>
                </div>
            </Form>
        </Modal>
    )
}

export default ClientFeedback