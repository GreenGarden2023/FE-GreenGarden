import { Button, Form, Image, Input, Modal } from 'antd'
import ErrorMessage from 'app/components/message.tsx/ErrorMessage'
import useDispatch from 'app/hooks/use-dispatch'
import { CreateFeedback, UpdateFeedback } from 'app/models/feedback'
import { SaleOrderDetail } from 'app/models/order'
import feedbackService from 'app/services/feedback.service'
import uploadService from 'app/services/upload.service'
import { setNoti } from 'app/slices/notification'
import CONSTANT from 'app/utils/constant'
import React, { useEffect, useRef, useState } from 'react'
import { AiFillStar, AiOutlineStar } from 'react-icons/ai'
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

    const [erorrUpload, setErrorUpload] = useState('')

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
            if(!CONSTANT.SUPPORT_FORMATS.includes(file.type)){
                setErrorUpload('File không đúng định dạng')
                return;
            }
            finalFiles.push(file)
        }

        setErrorUpload('')
        try{
            const res = await uploadService.uploadListFiles(finalFiles)
            setImagesUrls([...imagesUrls, ...res.data])
        }catch{
            // dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
        }
    }

    const setRatingSelect = (stars: number) =>{
        setRating(stars)
    }

    const handleSubmitForm = async () =>{
        if(imagesUrls.length === 0){
            setErrorUpload('Có ít nhất 1 ảnh cho phần đánh giá này')
            return;
        }
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
                                    <Image 
                                        key={index}
                                        src={item}
                                        width={100}
                                        height={100}
                                        style={{objectFit: 'cover'}}
                                    />
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
                        {erorrUpload && <ErrorMessage message={erorrUpload} />}
                    </div>
                </div>
                <div className='btn-form-wrapper'>
                    <Button htmlType='button' type='default' className='btn-cancel' size='large' onClick={onClose}>Hủy bỏ</Button>
                    <Button htmlType='submit'  type='primary' className='btn-update' size='large' >
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