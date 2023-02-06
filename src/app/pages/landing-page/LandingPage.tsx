import React from 'react';
import LandingHeader from '../../components/header/LandingHeader';
import SliderLanding from '../../components/slider/SliderLanding';
import './style.scss';
import { Divider, Carousel, Image } from 'antd';
import LandingFooter from '../../components/footer/LandingFooter';

const LandingPage: React.FC = () =>{
    const onChange = (currentSlide: number) => {
        console.log(currentSlide);
    };
    return (
        <div>
            <LandingHeader />
            <div className="main-content">
                <SliderLanding />
                <div className="body-content">
                    <div className="introduce">
                        <p className="title">Welcome!</p>
                        <p className="short-desc">Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam vero non quam dignissimos qui quo minima! Magnam alias exercitationem voluptates, harum dicta repudiandae porro voluptatem illo dignissimos ab ea! Expedita.</p>
                        <p className="description">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quibusdam nulla blanditiis non, adipisci obcaecati necessitatibus, ea recusandae, doloribus atque deserunt officiis aspernatur consequuntur eaque est? Maxime exercitationem similique tempore impedit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum odio sit veniam totam sapiente magni, saepe omnis, explicabo nobis blanditiis in commodi, corporis officia perspiciatis obcaecati ipsum accusantium laudantium eos.</p>
                        <p className="author">Some one else</p>
                    </div>
                </div>
                <Divider className='divider-custom'>Recent Works</Divider>
                <div className="category">
                    {
                        Array.from(Array(3), (_, i) => (
                            <div className="--item" key={i}>
                                <img src={`${process.env.PUBLIC_URL}/category_1.jpg`} alt="" />
                                <p className='title'>Cây cảnh để bàn</p>
                                <button className="detail-btn">Chi tiết</button>
                            </div>
                        ))
                    }
                </div>
                <div className="background-feedback-divider">
                    <p className="title">
                        Cửa hàng của chúng tôi đặt tại TP Hồ Chí Minh
                    </p>
                    <p className="address">
                        Số 1, đường gì đó, quận 9
                    </p>
                    <p className="phone">
                        0123 456 789
                    </p>
                </div>
                <Divider className='divider-custom'>Feedbacks</Divider>
                <div className="feedback">
                    <Carousel afterChange={onChange}>
                        {
                            Array.from(Array(3), (_, i) => (
                                <div className="slider__item" key={i}>
                                    <Image.PreviewGroup>
                                        <Image width={200} src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" />
                                        <Image
                                        width={200}
                                        src="https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg"
                                        />
                                        <Image width={200} src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" />
                                        <Image
                                        width={200}
                                        src="https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg"
                                        />
                                        <Image width={200} src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" />
                                        <Image
                                        width={200}
                                        src="https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg"
                                        />
                                        <Image width={200} src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" />
                                        <Image
                                        width={200}
                                        src="https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg"
                                        />
                                    </Image.PreviewGroup>
                                </div>
                            ))
                        }
                    </Carousel>
                </div>
                {/* <Divider className='divider-custom'>Posts</Divider>
                <div className="post">
                    <div className="--item">
                        <img src={} alt="" />
                    </div>
                </div> */}
            </div>
            <LandingFooter />
        </div>
    );
}

export default LandingPage;