import { Button, Form, Input } from 'antd';
import React from 'react';
import './style.scss';

const LandingFooter: React.FC = () =>{
    return (
        <footer className='footer-wrapper'>
            <div className="background-overlay"></div>
            <div className="footer-box container-wrapper">
                <div className="footer-spacing">
                    <div className="left">
                        <div className="infor">
                            <p className='infor-p'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Explicabo exercitationem quos, omnis vitae expedita consequuntur similique esse fugit recusandae, nam molestias cum voluptatibus voluptate ab illum error, nostrum quod repudiandae?</p>
                            <p className='phone-number'>0123 456 789</p>
                            <p className='zalo-connect'>Zalo: 0123 456 789</p>
                        </div>
                        <div className="img">
                            <img src="/assets/footer-image.png" alt="/" />
                        </div>
                    </div>
                    <div className="right">
                        <div className="header">
                            <p>Hoặc vui lòng để lại thông tin liên lạc, Green Garden sẽ phản hồi trong thời gian sớm nhất</p>
                        </div>
                        <Form
                            layout='vertical'
                        >
                            <Form.Item label='Tên khách hàng'>
                                <Input placeholder='Nhập tên của bạn' />
                            </Form.Item>
                            <Form.Item label='Số điện thoại'>
                                <Input placeholder='Nhập số điện thoại' />
                            </Form.Item>
                            <Form.Item style={{textAlign: 'center'}} >
                                <Button className='btn-send'>Gửi thông tin</Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default LandingFooter;