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
                <p className='short-desc'>
                    Green Garden ra đời năm 2023, xét về tuổi đời là khá trẻ trong thị trường cây cảnh. Nhưng với đội ngũ trẻ đầy nhiệt huyết, Green Garden đã tạo ra rất nhiều điểm khác biệt của một business trẻ, tích cực và năng động trong một ngành hàng thực sự già nua. 
                </p>
                <p className='short-desc'>
                Ở Green Garden, tôn chỉ kinh doanh là “luôn đúng hẹn, đúng cam kết”. Với một ngành hàng lâu đời, khi mà các chuẩn mực kinh doanh dần bị quên lãng thay vào bằng các thói quen, những lời hứa miệng hay nói một đằng làm một nẻo thì những điều đơn giản như “đúng hẹn, đúng cam kết” của Green Garden lại rất đáng quý.
                </p>
                <p className='short-desc'>
                Về phong cách thiết kế, chất lượng sản phẩm & dịch vụ thật khó để trình bày trong một vài dòng. Quý khách hàng đã quan tâm đọc đến đây, hãy bớt chút thời gian tham khảo chi tiết các sản phẩm, dịch vụ, tác phẩm thực tế đã hoàn thiện để hiểu rõ hơn.
                </p>
                <p className='short-desc'>
                    Và, nếu quý khách có nhu cầu hay cần tư vấn thêm, hãy để lại thông tin liên hệ cho Joy trong form bên dưới, hoặc gọi hotline 0833 449 449. Luôn sẵn sàng phục vụ. 
                </p>
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