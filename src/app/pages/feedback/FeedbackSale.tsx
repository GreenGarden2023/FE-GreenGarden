import { Divider, Image } from 'antd';
import LandingFooter from 'app/components/footer/LandingFooter';
import HeaderInfor from 'app/components/header-infor/HeaderInfor';
import LandingHeader from 'app/components/header/LandingHeader';
import ClientFeedback from 'app/components/modal/client-feedback/ClientFeedback';
import MoneyFormat from 'app/components/money/MoneyFormat';
import useSelector from 'app/hooks/use-selector';
import { SaleOrderDetail } from 'app/models/order';
import orderService from 'app/services/order.service';
import utilDateTime from 'app/utils/date-time';
import React, { useEffect, useState } from 'react';
import { AiFillStar } from 'react-icons/ai';
import { RxAvatar } from 'react-icons/rx';
import { useParams } from 'react-router-dom';
import './style.scss';
import useDispatch from 'app/hooks/use-dispatch';
import { setNoti } from 'app/slices/notification';
import CONSTANT from 'app/utils/constant';
import LoadingView from 'app/components/loading-view/LoadingView';
import NoProduct from 'app/components/no-product/NoProduct';

const FeedbackSale: React.FC = () => {
    const { orderId } = useParams()
    const dispatch = useDispatch()
    const userState = useSelector(state => state.userInfor)

    const [orders, setOrders] = useState<SaleOrderDetail[]>([])
    const [orderIndex, setOrderIndex] = useState(-1)
    const [fbIndex, setFbIndex] = useState(-1)
    const [loading, setLoading] = useState(true)

    useEffect(() =>{
        if(!orderId) return;

        const init = async () =>{
            setLoading(true)
            try{
                const res = await orderService.getSaleOrderDetail(orderId)
                setOrders(res.data)
            }catch{
                dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
            }
            setLoading(false)
        }
        init()
    }, [orderId, dispatch])

    const handleCloseModal = () =>{
        setOrderIndex(-1)
        setFbIndex(-1)
    }

    const handleSubmitFeedback = async () =>{
        const res = await orderService.getSaleOrderDetail(orderId || '')
        setOrders(res.data)
        handleCloseModal()
    }

    return (
        <div>
            <LandingHeader />
            <div className="main-content-not-home">
                <div className="container-wrapper feedback-sale-wrapper">
                    {
                        loading ? <LoadingView loading /> : 
                        <>
                            {
                                orders.length === 0 ? <NoProduct /> : 
                                <>
                                    <HeaderInfor title={`Đánh giá sản phẩm`} />
                                    <div className="default-layout">
                                        {
                                            orders.map((item, index) => (
                                                <div className="feedback-item" key={index}>
                                                    <div className="product">
                                                        <div className="left">
                                                            <img src={item.imgURL} alt="/" />
                                                        </div>
                                                        <div className="right">
                                                            <p className="name">{item.productItemName}</p>
                                                            <div className="right-item">
                                                                <p className="label">Số lượng</p>
                                                                <p className="content">{item.quantity}</p>
                                                            </div>
                                                            <div className="right-item">
                                                                <p className="label">Giá tiền</p>
                                                                <MoneyFormat value={item.totalPrice} color='Blue' isHighlight />
                                                            </div>
                                                            {
                                                                (!item.feedbackList || item.feedbackList.length === 0) &&
                                                                <button className='btn btn-create-feedback' onClick={() => setOrderIndex(index)} >Đánh giá</button>
                                                            }
                                                        </div>
                                                    </div>
                                                    <Divider orientation='left' >Đánh giá</Divider>
                                                    <div className="feedback">
                                                        {
                                                            item.feedbackList?.map((fb, indexFB) => (
                                                                <div className="feedback-detail" key={indexFB}>
                                                                    <div className="left-feedback">
                                                                        <RxAvatar size={50} color='#707070' />
                                                                    </div>
                                                                    <div className="right-feedback">
                                                                        <p className="user-name">{userState.user.fullName}</p>
                                                                        <p className="rating">
                                                                            {
                                                                                [...Array(fb.rating)].map((_, i) => (<AiFillStar key={i} color='#f95441' />))
                                                                            }
                                                                        </p>
                                                                        <div className="images">
                                                                            <Image.PreviewGroup>
                                                                                {
                                                                                    fb.imageURL.map((image, j) => (
                                                                                        <Image 
                                                                                            key={j}
                                                                                            src={image}
                                                                                            width={100}
                                                                                            height={100}
                                                                                            style={{objectFit: 'cover', borderRadius: '5px'}}
                                                                                        />
                                                                                    ))
                                                                                }
                                                                            </Image.PreviewGroup>
                                                                        </div>
                                                                        <p className="comment">{fb.comment}</p>
                                                                        <p className="time">
                                                                            {utilDateTime.dateTimeToString(fb.updateDate ? fb.updateDate : fb.createDate)}
                                                                        </p>
                                                                        {
                                                                            !fb.updateDate &&
                                                                            <button onClick={() => {setOrderIndex(index); setFbIndex(indexFB)}} className={`btn btn-edit-feedback`}>Chỉnh sửa</button>
                                                                        }
                                                                    </div>
                                                                </div>
                                                            ))
                                                        }
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </>
                            }
                        </>
                    }
                </div>
            </div>
            <LandingFooter />
            {
                (orderIndex !== -1) &&
                <ClientFeedback
                    orderId={orderId || ''}
                    order={orders[orderIndex]}
                    fbIndex={fbIndex}
                    onSubmit={handleSubmitFeedback}
                    onClose={handleCloseModal}
                />
            }
        </div>
    )
}

export default FeedbackSale