import React, { useEffect } from 'react'
import './styles.scss';
import LandingHeader from 'app/components/header/LandingHeader';
import LandingFooter from 'app/components/footer/LandingFooter';
import { FaRegSmileWink } from 'react-icons/fa';
import { IoBagCheckOutline, IoReturnDownBackSharp } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

const ThankYou: React.FC = () => {
  const navigate = useNavigate()

  useEffect(() =>{
    
  }, [])

  return (
    <div>
      <LandingHeader />
      <div className="main-content-not-home">
        <div className='thank-wrapper' >
          <div className="content">
            <FaRegSmileWink size={30} />
            <span>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi</span>
          </div>
          <div className="thank-buttons">
            <button className='btn btn-go-back' onClick={() => navigate('/')}>
              <IoReturnDownBackSharp />
              <span>Tiếp tục mua hàng</span>
            </button>
            <button className="btn btn-view-order" onClick={() => navigate('/orders?page=1')} >
              <IoBagCheckOutline />
              <span>Xem đơn hàng</span>
            </button>
          </div>
        </div>
      </div>
      <LandingFooter />
    </div>
  )
}

export default ThankYou