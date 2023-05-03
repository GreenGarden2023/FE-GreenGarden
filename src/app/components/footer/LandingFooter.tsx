import { Button, Form, Input } from 'antd';
import React, { useState } from 'react';
import './style.scss';
import useDispatch from 'app/hooks/use-dispatch';
import { setNoti } from 'app/slices/notification';
import CONSTANT from 'app/utils/constant';
import authService from 'app/services/auth.service';

const LandingFooter: React.FC = () =>{
    const dispatch = useDispatch();

    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [loadingAction, setLoadingAction] = useState(false)
    
    const handleSubmitTakeCare = async () =>{
        if(!phone.trim()){
            return dispatch(setNoti({type: 'error', message: 'Số điện thoại không được để trống'}))
        }

        if(!CONSTANT.PHONE_REGEX.test(phone)){
            return dispatch(setNoti({type: 'error', message: 'Số điện thoại không hợp lệ'}))
        }

        setLoadingAction(true)
        try{
            const res = await authService.userSupport(name, phone)
            if(res.code === 200){
                dispatch(setNoti({type: 'success', message: 'Đã gửi thông tin yêu cầu tư vấn cho quản trị viên'}))
                setName('')
                setPhone('')
                return;
            }
            dispatch(setNoti({type: 'warning', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
        }catch{
            dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
        }
        setLoadingAction(false)
    }
    
    return (
        <footer className='footer-wrapper'>
            <div className="background-overlay"></div>
            <div className="footer-box container-wrapper">
                <div className="footer-spacing">
                    <div className="left">
                        <div className="infor">
                            <p className='infor-p'>
                                Để được tư vấn về các sản phẩm cây cảnh, chậu, dịch vụ thuê cây & thi công sân vườn.. quý khách vui lòng gọi hotline của Green Garden
                            </p>
                            <p className='phone-number'>0833 449 449</p>
                            <p className='zalo-connect'>Zalo: 0833 449 449</p>
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
                                <Input placeholder='Nhập tên của bạn' value={name} onChange={(e) => setName(e.target.value)} />
                            </Form.Item>
                            <Form.Item label='Số điện thoại'>
                                <Input placeholder='Nhập số điện thoại' value={phone} onChange={(e) => setPhone(e.target.value)} />
                            </Form.Item>
                            <Form.Item style={{textAlign: 'center'}} >
                                <Button className='btn-send' loading={loadingAction} onClick={handleSubmitTakeCare} >Gửi thông tin</Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default LandingFooter;