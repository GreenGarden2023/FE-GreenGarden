import React from 'react'
import { useNavigate } from 'react-router-dom';
import './style.scss';
import LandingHeader from 'app/components/header/LandingHeader';
import LandingFooter from 'app/components/footer/LandingFooter';

const FileNotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <LandingHeader />
      <div className="main-content-not-home" style={{backgroundColor: '#9be4e4'}}>
        <div className="container-wrapper fnf-wrapper">
          <div className="left">
            <h1 className='fnf-code'>404</h1>
            <p className='fnf-message'>Đã có lỗi trong quá trình tìm kiếm</p>
            <button onClick={() => navigate('/')}>Quay lại cửa hàng</button>
          </div>
          <div className="right">
            <img src='/assets/page-not-found.jpg' alt='/' />
          </div>
        </div>
      </div>
      <LandingFooter />
    </div>
  )
}

export default FileNotFound