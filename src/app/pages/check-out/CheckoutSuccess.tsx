import LandingFooter from 'app/components/footer/LandingFooter';
import LandingHeader from 'app/components/header/LandingHeader';
import pagingPath from 'app/utils/paging-path';
import React, { useEffect } from 'react';
import { AiFillCheckCircle } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import './style.scss'

const CheckoutSuccess: React.FC = () => {
    const navigate = useNavigate();
    
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
                        <div className="btn-box">
                            <button className="btn-back" onClick={() => navigate('/')}>Back to store</button>
                            <button className="btn-view-order" onClick={() => navigate('/orders')}>View orders</button>
                        </div>
                    </div>
                </div>
            </div>
            <LandingFooter />
        </div>
    );
}

export default CheckoutSuccess;