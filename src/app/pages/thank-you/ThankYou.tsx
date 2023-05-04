import React, { useEffect, useState } from 'react'
import './styles.scss';
import LandingHeader from 'app/components/header/LandingHeader';
import LandingFooter from 'app/components/footer/LandingFooter';
import { FaRegSadTear, FaRegSmileWink } from 'react-icons/fa';
import { IoBagCheckOutline, IoReturnDownBackSharp } from 'react-icons/io5';
import { useNavigate, useSearchParams } from 'react-router-dom';

const ThankYou: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams();

  const [paymentSuccess, setPaymentSuccess] = useState(true)

  useEffect(() =>{
    const resultCode = searchParams.get('resultCode')

    if(!resultCode) {
      setPaymentSuccess(false)
      return;
    }

    if(!isNaN(Number(resultCode)) && Number(resultCode) === 0){
      setPaymentSuccess(true)
    }else{
      setPaymentSuccess(false)
    }

  }, [searchParams])

  return (
    <div>
      <LandingHeader />
      <div className="main-content-not-home">
        <div className={`thank-wrapper ${!paymentSuccess ? 'fail' : ''}`}>
          <div className="content">
            {
              paymentSuccess ? 
              <>
                <FaRegSmileWink size={30} />
                <span>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi</span>
              </> :
              <>
                <FaRegSadTear size={30} />
                <span>Đã xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại sau</span>
              </>
            }
          </div>
          <div className="thank-buttons">
            {
              paymentSuccess &&
              <button className='btn btn-go-back' onClick={() => navigate('/')}>
                <IoReturnDownBackSharp />
                <span>Tiếp tục mua hàng</span>
              </button>
            }
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