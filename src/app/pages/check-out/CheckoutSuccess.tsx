import LandingFooter from 'app/components/footer/LandingFooter';
import LandingHeader from 'app/components/header/LandingHeader';
import pagingPath from 'app/utils/paging-path';
import React, { useEffect } from 'react';
import { AiFillCheckCircle } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import './style.scss'
import { MdOutlineInventory2 } from 'react-icons/md';
import { IoBagCheckOutline, IoReturnDownBackSharp } from 'react-icons/io5';
import useSelector from 'app/hooks/use-selector';

const CheckoutSuccess: React.FC = () => {
    const navigate = useNavigate();
    const { rentItems, saleItems } = useSelector(state => state.CartStore)

    useEffect(() =>{
        pagingPath.scrollTop()
    }, [])

    return (
        <div>
            <LandingHeader />
            <div className="main-content-not-home">
                <div className="container-wrapper cos-wrapper">
                    <div className="cos-box">
                        <AiFillCheckCircle size={50} color='#fff' />
                        <p className="cos-notify">Tạo mới đơn hàng thành công</p>
                        <p className="cos-content">Đơn hàng của bạn đang được xử lý. Cảm ơn đã sử dụng dịch vụ của chúng tôi.</p>
                        <p className="cos-content">Vui lòng thanh toán cọc để nhận được cây</p>
                        <div className="btn-box">
                            <button className="btn btn-view-order" onClick={() => navigate('/orders')}>
                                <MdOutlineInventory2 size={20} />
                                <span>Xem đơn hàng</span>
                            </button>
                            {
                                ((rentItems && rentItems.length !== 0) || (saleItems && saleItems.length !== 0)) &&
                                <button className="btn btn-continue-payment" onClick={() => navigate('/cart')}>
                                    <IoBagCheckOutline size={20} />
                                    <span>Tiếp tục thanh toán</span>
                                </button>
                            }
                        </div>
                        <div className="btn-back-to-store">
                            <button className="btn btn-back" onClick={() => navigate('/')}>
                                <IoReturnDownBackSharp size={20} />
                                <span>Tiếp tục mua hàng</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <LandingFooter />
        </div>
    );
}

export default CheckoutSuccess;