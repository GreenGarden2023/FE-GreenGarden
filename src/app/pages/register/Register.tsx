import { Button, Checkbox, Col, Form, Input, Modal, Row, Select } from 'antd';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { MdNavigateNext } from 'react-icons/md';
import { useNavigate } from "react-router-dom";
import ErrorMessage from '../../components/message.tsx/ErrorMessage';
import './style.scss';
import { BsEyeFill, BsEyeSlashFill } from 'react-icons/bs';
import { useForm, Controller } from 'react-hook-form';
import { UserRegister } from '../../models/register';
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup';
import { AiFillCaretDown } from 'react-icons/ai';
import CONSTANT from '../../utils/constant';
import useDispatch from '../../hooks/use-dispatch';
import { setTitle } from '../../slices/window-title';
import authService from '../../services/auth.service';
import { setNoti } from '../../slices/notification';
import { ShippingFee } from 'app/models/shipping-fee';
import shippingFeeService from 'app/services/shipping-fee.service';

const defaultValues: UserRegister = {
  userName: '',
  password: '',
  fullName: '',
  address: '',
  phone: '',
  favorite: '',
  mail: '',
  confirmPassword: '',
  isAgreeTerm: false,
  districtID: 1,
  roleName: 'Customer'
}
/* eslint-disable no-useless-escape */
const schema = yup.object().shape({
  userName: yup.string().trim().required('Tài khoản không được để trống').min(5, 'Tài khoản có ít nhất 5 ký tự').max(30, 'Tài khoản có nhiều nhất 30 ký tự'),
  password: yup.string().trim().required('Mật khẩu không được để trống').min(6, 'Mật khẩu có ít nhất 6 ký tự').max(30, 'Mật khẩu có nhiều nhất 30 ký tự'),
  fullName: yup.string().trim().required('Họ và tên không được để trống').min(5, 'Họ và tên có ít nhất 5 ký tự').max(50, 'Họ và tên có nhiều nhất 50 ký tự'),
  address: yup.string().trim().required('Địa chỉ không được để trống').min(5, 'Địa chỉ có ít nhất 5 ký tự').max(100, 'Địa chỉ có nhiều nhất 100 ký tự'),
  phone: yup.string().trim().required('Số điện thoại không được để trống').matches(/(0[3|5|7|8|9])+([0-9]{8})\b/g, 'Số điện thoại không hợp lệ'),
  mail: yup.string().trim().required('Email không được để trống').matches(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Email không hợp lệ'),
  confirmPassword: yup.string().required('Xác thực mật khẩu được để trống').oneOf([yup.ref('password'), null], 'Xác thực mật khẩu không trùng khớp'),
  isAgreeTerm: yup.boolean().required("Bạn phải đồng ý với các điều khoản trước khi đăng ký tài khoản").oneOf([true], "Bạn phải đồng ý với các điều khoản trước khi đăng ký tài khoản")
})

const Register: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [viewPassword, setViewPassword] = useState(false);
  const [viewConPassword, setViewConPassword] = useState(false);

  const [shipping, setShipping] = useState<ShippingFee[]>([])

  const [openModalConfirm, setOpenModalConfirm] = useState(false)
  const [confirmCode, setConfirmCode] = useState('')

  const { handleSubmit, formState: { errors, isSubmitting }, control, setError } = useForm<UserRegister>({
    defaultValues,
    resolver: yupResolver(schema)
  })

  useEffect(() =>{
    const init = async () =>{
      try{
        const res = await shippingFeeService.getList()
        setShipping(res.data)
      }catch{

      }
    }
    init()
  }, [])

  useEffect(() =>{
    dispatch(setTitle(`${CONSTANT.APP_NAME} | Register`))
  }, [dispatch])

  const handleRedirectLogin = () =>{
    navigate('/login')
  }

  const handleChangeViewPassword = (type: string) =>{
    if(type === 'password'){
      setViewPassword(pre => !pre);
      return;
    }
    setViewConPassword(pre => !pre)
  }
  
  const handleSubmitForm = async (data: UserRegister) =>{
    try{
      const res = await authService.register(data)
      if(res.isSuccess){
        await authService.sendEmailCode(data.mail)
        setOpenModalConfirm(true)
        dispatch(setNoti({type: 'success', message: `Mã xác thực đăng ký đã gửi tới email ${data.mail}. Vui lòng kiểm tra email của bạn.`}))
        return;
      }
      setError('userName', {
        type: 'pattern',
        message: 'Tài khoản này đã tồn tại'
      })
    }catch(err){
      dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
    }
  }

  const handleCloseModal = () =>{
    setOpenModalConfirm(false)
    setConfirmCode('')
  }

  return (
    <div className='sign-up-container'>
        <div className='sign-up-wrapper'>
            <div className="sign-up-box">
                <div className="left">
                <h2>Đăng ký</h2>
                  <Form
                    layout='vertical'
                    onFinish={handleSubmit(handleSubmitForm)}
                  >
                    <Row gutter={24}>
                      <Col span={12}>
                        <Form.Item label='Họ và tên' required validateStatus={errors.fullName ? 'error' : ''} >
                          <Controller
                            control={control}
                            name='fullName'
                            render={({ field }) => <Input {...field} />}
                          />
                          {errors.fullName && <ErrorMessage message={errors.fullName.message} />}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label='Địa chỉ' required validateStatus={errors.address ? 'error' : ''}>
                          <Controller
                            control={control}
                            name='address'
                            render={({ field }) => <Input {...field} />}
                          />
                          {errors.address && <ErrorMessage message={errors.address.message} />}
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <Form.Item label='Vị trí nhận hàng' required validateStatus={errors.address ? 'error' : ''}>
                          <Controller
                            control={control}
                            name='districtID'
                            render={({ field }) => (
                              <Select showSearch {...field}>
                                {
                                  shipping.map((item, index) => (
                                    <Select.Option value={item.districtID} key={index} >
                                      {item.district}
                                    </Select.Option>
                                  ))
                                }
                              </Select>
                            )}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label='Số điện thoại' required validateStatus={errors.phone ? 'error' : ''}>
                          <Controller
                            control={control}
                            name='phone'
                            render={({ field }) => <Input {...field} />}
                          />
                          {errors.phone && <ErrorMessage message={errors.phone.message} />}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label='Email' required validateStatus={errors.mail ? 'error' : ''}>
                          <Controller
                            control={control}
                            name='mail'
                            render={({ field }) => <Input {...field} />}
                          />
                          {errors.mail && <ErrorMessage message={errors.mail.message} />}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label='Tài khoản' required validateStatus={errors.userName ? 'error' : ''}>
                          <Controller
                            control={control}
                            name='userName'
                            render={({field}) => <Input {...field} />}
                          />
                          {errors.userName && <ErrorMessage message={errors.userName.message} />}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label='Sở thích' required validateStatus={errors.favorite ? 'error' : ''}>
                          <Controller
                            control={control}
                            name='favorite'
                            render={({field: { onChange }}) => (
                              <Select suffixIcon={<AiFillCaretDown />} onChange={onChange} >
                                {
                                  CONSTANT.FAVORITES.map((favorite, index) => (
                                    <Select.Option key={index} value={favorite}>{favorite}</Select.Option>
                                  ))
                                }
                              </Select>
                            )}
                          />
                          {errors.favorite && <ErrorMessage message={errors.favorite.message} />}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                          <Form.Item label='Mật khẩu' required validateStatus={errors.password ? 'error' : ''}>
                            <Controller
                              control={control}
                              name='password'
                              render={({ field }) => <Input {...field} type={viewPassword ? 'text' : 'password'} suffix={viewPassword ? <BsEyeSlashFill className='pointer' onClick={() => handleChangeViewPassword('password')} color='#000' /> : <BsEyeFill className='pointer' color='#000' onClick={() => handleChangeViewPassword('password')} />}  />}
                            />
                            {errors.password && <ErrorMessage message={errors.password.message} />}
                          </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label='Nhập lại mật khẩu' required validateStatus={errors.confirmPassword ? 'error' : ''}>
                          <Controller
                            control={control}
                            name='confirmPassword'
                            render={({ field }) => <Input {...field} type={viewConPassword ? 'text' : 'password'} suffix={viewConPassword ? <BsEyeSlashFill className='pointer' onClick={() => handleChangeViewPassword('con-password')} color='#000' /> : <BsEyeFill color='#000' className='pointer' onClick={() => handleChangeViewPassword('con-password')} />}  />}
                          />
                          {errors.confirmPassword && <ErrorMessage message={errors.confirmPassword.message} />}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Form.Item>
                      <Controller
                        control={control}
                        name='isAgreeTerm'
                        render={({ field: { value, onChange } }) => <Checkbox checked={value} onChange={onChange} >Đồng ý với tất cả các điều khoản <Link to='/term-of-services' target='_blank'>Xem điều khoản</Link></Checkbox>}
                      />
                      {errors.isAgreeTerm && (
                        <>
                          <br/>
                          <ErrorMessage message={errors.isAgreeTerm.message} />
                        </>
                      )}
                    </Form.Item>
                    <div className='btn-box'>
                      <Button loading={isSubmitting} type='primary' htmlType='submit' className='btn-submit' size='large'>Đăng ký</Button>
                      <Button disabled={isSubmitting} type='primary' htmlType='button' className='btn-login' size='large' onClick={handleRedirectLogin}>
                        <span>Đăng nhập</span>
                        <MdNavigateNext size={20} />
                      </Button>
                    </div>
                  </Form>
                </div>
                <div className="right">
                  <img src='/assets/signup-image.jpg' alt='/' />
                </div>
            </div>
        </div>
        {
          openModalConfirm &&
          <Modal
            open
            title={`Nhập mã xác thực email`}
            onCancel={handleCloseModal}
          >
            <Form
              
            >
              <Form.Item label="Mã xác thức" required>
                <Input value={confirmCode} onChange={(e) => setConfirmCode(e.target.value)} />
              </Form.Item>
              <div className='btn-form-wrapper'>
                <Button htmlType='button' type='default' className='btn-cancel' size='large' >Hủy bỏ</Button>
                <Button htmlType='submit' type='primary' className='btn-update' size='large'>
                    Xác nhận
                </Button>
              </div>
            </Form>
          </Modal>
        }
    </div>
  )
}

export default Register