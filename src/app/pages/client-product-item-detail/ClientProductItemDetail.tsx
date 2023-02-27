import { Breadcrumb, Col, Collapse, Divider, Image, Row } from 'antd';
import LandingFooter from 'app/components/footer/LandingFooter';
import LandingHeader from 'app/components/header/LandingHeader';
import React from 'react';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { BiPlus } from 'react-icons/bi';
import { GrFormNext, GrFormPrevious, GrFormSubtract } from 'react-icons/gr';
import { Link, useParams } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './style.scss';

const text = `Đối với các sản phẩm cây/ bao gồm cây:\n- Chỉ giao hàng tại TP HCM\nĐối với các sản phẩm chậu, phụ kiện, vật tư:\n- Có giao hàng COD toàn quốc\n- Được kiểm tra hàng khi nhận hàng`
const ClientProductItemDetail: React.FC = () => {
    const { productItemId } = useParams()

    
    
    return (
        <div>
            <LandingHeader />
            <div className="main-content-not-home">
                <div className="container-wrapper cpid-wrapper">
                    <section className="cpid-bread">
                        <Breadcrumb>
                            <Breadcrumb.Item>
                                <Link to='/' >Store</Link>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                <Link to='/category' >Category</Link>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                {/* {category?.name} */}
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </section>
                    <section className="cpid-product-infor default-layout">
                        <Row gutter={[24, 24]}>
                            <Col xs={12} xl={12}>
                                {/* <div className="left">
                                    <img src="/assets/inventory-empty.png" alt="/" className='img-main-view' />
                                </div> */}
                                <div className="left carousel-warpper">
                                    <Carousel 
                                        infiniteLoop 
                                        useKeyboardArrows 
                                        showIndicators={false}
                                        renderArrowPrev={(clickHandler) => (
                                            <div className='pre-custom' onClick={clickHandler}>
                                                <GrFormPrevious className='pre-icon' />
                                            </div>
                                        )}
                                        renderArrowNext={(clickHandler) => (
                                            <div className='next-custom' onClick={clickHandler}>
                                                <GrFormNext className='next-icon' />
                                            </div>
                                        )}
                                    >
                                        {
                                            [...Array(10)].map((_, index) => (
                                                <div key={index}>
                                                    {/* <Image src='/assets/inventory-empty.png' alt='/' /> */}
                                                    <img src="/assets/inventory-empty.png" alt='/' />
                                                </div>
                                            ))
                                        }
                                    </Carousel>
                                </div>
                            </Col>
                            <Col xs={12} xl={12}>
                                <div className="right">
                                    <div className="title">
                                        <h1>Lan Chi Chậu T1517 [Spider Plant w Pot 15cm]</h1>
                                    </div>
                                    <div className="infor-detail">
                                        <ul>
                                            <li>Kích thước chậu / Item dimensions (W x H): 15x17cm</li>
                                            <li>Chất liệu chậu / Pot Material: Men / Ceramic</li>
                                            <li>Tổng chiều cao / Total height: ~35cm</li>
                                            <li>Giá sản phẩm không bao gồm đĩa lót chậu (The saucer is not included)</li>
                                        </ul>
                                    </div>
                                    <div className="price-box">
                                        <div className="rent-price">
                                            <p className='title-price'>Rent price</p>
                                            <p className="price">
                                                200000VNĐ
                                            </p>
                                            <div className="quantity">
                                                <p>Quantity</p>
                                                <div className="quantity-box">
                                                    <button className="decrease">
                                                        <GrFormSubtract />
                                                    </button>
                                                    <input type="number" />
                                                    <button className="increase">
                                                        <BiPlus />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="atc">
                                                <button>
                                                    <AiOutlineShoppingCart size={40} />
                                                    <span>Add to cart</span>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="sale-price">
                                            <p className='title-price'>Sale price</p>
                                            <p className="price">
                                                200000VNĐ
                                            </p>
                                            <div className="quantity">
                                                <p>Quantity</p>
                                                <div className="quantity-box">
                                                    <button className="decrease">
                                                        <GrFormSubtract />
                                                    </button>
                                                    <input type="number" />
                                                    <button className="increase">
                                                        <BiPlus />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="atc">
                                                <button>
                                                    <AiOutlineShoppingCart size={40} />
                                                    <span>Add to cart</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <Divider orientation='left' plain >Policy</Divider>
                                    <div className="policy">
                                     <Collapse defaultActiveKey={['1']} ghost>
                                        <Collapse.Panel header="Delivery policy" key="1">
                                            <p className='panel-text'>
                                                {text}
                                            </p>
                                        </Collapse.Panel>
                                     </Collapse>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <Divider orientation='left'>
                            <p style={{fontSize: '36px', fontWeight: 'bold'}}>Product information</p>
                        </Divider>
                        <div dangerouslySetInnerHTML={{__html: '<p>hello world</p>'}}>

                        </div>
                    </section>
                </div>
            </div>
            <LandingFooter />
        </div>
    )
}

export default ClientProductItemDetail