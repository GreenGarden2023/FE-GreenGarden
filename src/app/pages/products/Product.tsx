import React from 'react';
import { useParams } from 'react-router-dom';
import LandingHeader from '../../components/header/LandingHeader';
import { Breadcrumb, Badge } from 'antd';
import { AiOutlineHome } from 'react-icons/ai';
import { SiGumtree } from 'react-icons/si';
import './style.scss'

const Product: React.FC = () =>{
    const { slug } = useParams();
    
    return (
        <div>
            <LandingHeader />
            <div className="product-content">
                <Breadcrumb>
                    <Breadcrumb.Item href="/">
                        <AiOutlineHome />
                        <span>Trang chủ</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item href=''>
                        <SiGumtree />
                        <span>{slug}</span>
                    </Breadcrumb.Item>
                </Breadcrumb>
                <p className="title">
                   {slug} 
                </p>
                <p className="product-header">
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolore illum aut repellendus earum, similique minus quidem voluptate exercitationem veniam nam eius amet est corporis ex incidunt fugit nobis? Totam, unde. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Recusandae quos perspiciatis doloribus magni fugiat error laboriosam saepe. Soluta dignissimos, harum saepe, iste deserunt excepturi ducimus debitis, velit hic optio necessitatibus.
                </p>
                <div className="--items">
                    <div className="product-detail">
                        <Badge.Ribbon  text={`-5%`} color="green">
                            <img src={`${process.env.PUBLIC_URL}/product_1.jpg`} alt="" />
                            <p className='name'>Cây Nhất Mạt Hương</p>
                            <div className="transaction-type">
                                
                            </div>
                        </Badge.Ribbon>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Product;