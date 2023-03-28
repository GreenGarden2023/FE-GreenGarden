import { Divider } from 'antd';
import React from 'react'
import { AiOutlineStar } from 'react-icons/ai';
import { MdNavigateNext } from 'react-icons/md';
import { Link } from 'react-router-dom';
import './style.scss';

interface LandingWidgetProps{
    index: number;
    url: string;
    backgroundUrl: string;
}

const LandingWidget: React.FC<LandingWidgetProps> = ({ index, url, backgroundUrl }) => {
  return (
    <section className='widget-wrapper'>
        <div className="widget-box container-wrapper" >
            {
                index === 1 &&
                <Divider >
                    <div className='divider-item'>
                        <AiOutlineStar color='#b06c67' size={30} />
                        <span>Dịch vụ chăm sóc cây</span>
                    </div>
                </Divider>
            }
            <div className="content-box" style={{backgroundImage: `url(${backgroundUrl})`}}>
                <div className="content">
                    <h1>Dịch vụ cho thuê cây</h1>
                    <div className="divider"></div>
                    <Link to={url}>
                        <span>Xem Thêm</span>
                        <MdNavigateNext size={20} />
                    </Link>
                </div>
            </div>
        </div>
        <div className="widget-intro container-wrapper">
            <div className="left">
                <span className="index-number">{index}</span>
                <span className="service-name">Plant Rental</span>
            </div>
            <div className="center">
                <p>Cây xanh tăng năng suất làm việc <br/>Đa dạng các loại cây để sàn, cây để bàn</p>
            </div>
            <div className="right">
                <ul>
                    <li><p>Tiết kiệm hơn mua cây</p></li>
                    <li><p>Bảo dưỡng & chăm sóc mỗi tuần</p></li>
                </ul>
            </div>
        </div>
    </section>
  )
}

export default LandingWidget