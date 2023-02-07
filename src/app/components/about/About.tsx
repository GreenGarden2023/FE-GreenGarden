import React from 'react'
import { AiOutlineCheckSquare, AiOutlineShop } from 'react-icons/ai';
import { FaUsers } from 'react-icons/fa';
import './style.scss';

const About: React.FC = () => {
  return (
    <section className='about-wrapper'>
        <div className="about-box container-wrapper">
            <div className="left">
                <h3 className="title">Về Green Garden</h3>
                <p className='short-desc'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo consectetur neque, nam architecto nobis quas fugiat voluptates! Odio asperiores ad, facilis impedit delectus voluptas natus voluptate dolorum ex similique ducimus.</p>
                <p className='short-desc'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo consectetur neque, nam architecto nobis quas fugiat voluptates! Odio asperiores ad, facilis impedit delectus voluptas natus voluptate dolorum ex similique ducimus.</p>
                <p className='short-desc'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo consectetur neque, nam architecto nobis quas fugiat voluptates! Odio asperiores ad, facilis impedit delectus voluptas natus voluptate dolorum ex similique ducimus.</p>
                <p className='short-desc'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo consectetur neque, nam architecto nobis quas fugiat voluptates! Odio asperiores ad, facilis impedit delectus voluptas natus voluptate dolorum ex similique ducimus.</p>
                <div className="description">
                    <div className="icon-box">
                        <AiOutlineShop size={50} />
                        <span>Cửa hàng</span>
                    </div>
                    <p>03 cửa hàng bán lẻ tại trung tâm TP Hồ Chí Minh, xử lý hơn 200 đơn hàng mỗi ngày</p>
                </div>
                <div className="description">
                    <div className="icon-box">
                        <AiOutlineCheckSquare size={50} />
                        <span>Vườn dưỡng</span>
                    </div>
                    <p>Showroom và vườn dưỡng cây công trình hơn 5000m2 tại Đảo Kim Cương, Quận 2 </p>
                </div>
                <div className="description">
                    <div className="icon-box">
                        <FaUsers size={50} />
                        <span>Nhân sự</span>
                    </div>
                    <p>+25 chuyên viên chăm sóc cây xanh, 02 xe tải và 04 xe bán tải phục vụ giao hàng, đổi cây mọi lúc</p>
                </div>
            </div>
            <div className="right">
                <img src="/assets/about.jpg" alt="/" />
            </div>
        </div>
    </section>
  )
}

export default About