import { Button, Col, Form, Input, Modal, Row } from 'antd';
import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup';
import CONSTANT from 'app/utils/constant';
import useDispatch from 'app/hooks/use-dispatch';
import authService from 'app/services/auth.service';
import { setNoti } from 'app/slices/notification';

interface ForgotPasswordProps{
    onClose: () => void;
}

const schema = yup.object().shape({
    email: yup.string().trim().required('Email không được để trống').matches(CONSTANT.EMAIL_REGEX, 'Email không hợp lệ'),
    newPassword: yup.string().required('Mật khẩu mới không được để trống').min(6, 'Mật khẩu mới có ít nhất 6 ký tự').max(30, 'Mật khẩu mới có nhiều nhất 30 ký tự'),
})

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onClose }) => {
    const dispatch = useDispatch();

    const { control, formState: { isSubmitting, errors }, handleSubmit, getValues } = useForm<ResetPassword>({
        resolver: yupResolver(schema)
    })

    console.log(errors)

    const [sentCode, setSentCode] = useState(false)

    const handleSubmitForm = async (data: ResetPassword) =>{
        if(sentCode){
            // call api send email code
            try{
                const res = await authService.resetPassword(data)
                if(res.isSuccess){
                    dispatch(setNoti({type: 'success', message: `Lấy lại mật khẩu thành công`}))
                    onClose()
                }else{
                    dispatch(setNoti({type: 'error', message: 'Mã OTP không hợp lệ'}))
                }
            }catch{
                dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
            }
        }else{
            // call api reset password
            try{
                const res = await authService.sendEmailCode(data.email)
                if(res.isSuccess){
                    dispatch(setNoti({type: 'success', message: `Vui lòng kiểm tra Email của bạn để lấy mã OTP`}))
                    setSentCode(true)
                }else{
                    dispatch(setNoti({type: 'error', message: 'Email chưa tồn tại trong hệ thống'}))
                }
            }catch{
                dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
            }
        }
    }

    const resendOtpCode = async () =>{
        try{
            const res = await authService.sendEmailCode(getValues('email'))
            if(res.isSuccess){
                dispatch(setNoti({type: 'success', message: `Vui lòng kiểm tra Email của bạn để lấy mã OTP`}))
                setSentCode(true)
            }else{
                dispatch(setNoti({type: 'error', message: 'Email chưa tồn tại trong hệ thống'}))
            }
        }catch{
            dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
        }
    }

    return (
        <Modal
            open
            title='Lấy lại mật khẩu'
            onCancel={onClose}
            footer={false}
        >
            <Form
                layout='vertical'
                onFinish={handleSubmit(handleSubmitForm)}
            >
                <Row gutter={[24, 0]}>
                    <Col span={12}>
                        <Form.Item label='Email' required>
                            <Controller 
                                control={control}
                                name='email'
                                render={({field}) => <Input {...field} />}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='Mật khẩu mới' required>
                            <Controller 
                                control={control}
                                name='newPassword'
                                render={({field}) => <Input type='password' {...field} />}
                            />
                        </Form.Item>
                    </Col>
                    {
                        sentCode &&
                        <Col span={24}>
                            <Form.Item label='Mã OTP' required>
                                <Controller 
                                    control={control}
                                    name='otpCode'
                                    render={({field}) => <Input {...field} />}
                                />
                            </Form.Item>
                        </Col>
                    }
                    <Col span={24} >
                        <div className='btn-form-wrapper'>
                            <Button htmlType='button' disabled={isSubmitting} type='default' size='large' className='btn-cancel' onClick={onClose}>Hủy bỏ</Button>
                            <Button htmlType='submit' loading={isSubmitting} type='primary' className='btn-update' size='large'>
                                Xác nhận
                            </Button>
                            {
                                sentCode &&
                                <Button htmlType='button' loading={isSubmitting} type='primary' className='btn-update' size='large' style={{marginLeft: '10px'}} onClick={resendOtpCode}>
                                    Gửi lại mã OTP
                                </Button>
                            }
                        </div>
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
}

export interface ResetPassword{
    email: string;
    newPassword: string;
    otpCode: string;
}

export default ForgotPassword