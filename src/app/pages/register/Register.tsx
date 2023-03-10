import { Button, Checkbox, Col, Form, Input, Row, Select } from 'antd';
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
}
/* eslint-disable no-useless-escape */
const schema = yup.object().shape({
  userName: yup.string().required('username is required').min(5, 'username is greater than 5 characters').max(30, 'username is less than 30 characters'),
  password: yup.string().required('password is required').min(6, 'password is greater than 6 characters').max(30, 'password is less than 30 characters'),
  fullName: yup.string().required('Full Name is required').min(5, 'Full Name is greater than 5 characters').max(50, 'Full Name is less than 50 characters'),
  address: yup.string().required('address is required').min(5, 'Address is greater than 5 characters').max(100, 'Address is less than 100 characters'),
  phone: yup.string().required('Phone is required').matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g, 'Phone is not valid'),
  favorite: yup.string().required('favorite is required'),
  mail: yup.string().required('mail is required').matches(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Email is not valid'),
  confirmPassword: yup.string().required('Confirm password is required').oneOf([yup.ref('password'), null], 'Confirm password must match with password'),
  isAgreeTerm: yup.boolean().required("The terms and conditions must be accepted.").oneOf([true], "The terms and conditions must be accepted.")
})

const Register: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [viewPassword, setViewPassword] = useState(false);
  const [viewConPassword, setViewConPassword] = useState(false);

  const { handleSubmit, formState: { errors, isSubmitting }, control, setError } = useForm<UserRegister>({
    defaultValues,
    resolver: yupResolver(schema)
  })

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
        dispatch(setNoti({type: 'success', message: 'Create account successfully'}))
        navigate('/login')
        return;
      }
      setError('userName', {
        type: 'pattern',
        message: 'Account existed'
      })
    }catch(err){
      dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE}))
    }
  }

  return (
    <div className='sign-up-container'>
        <div className='sign-up-wrapper'>
            <div className="sign-up-box">
                <div className="left">
                <h2>Sign up</h2>
                  <Form
                    layout='vertical'
                    onFinish={handleSubmit(handleSubmitForm)}
                  >
                    <Row gutter={24}>
                      <Col span={12}>
                        <Form.Item label='Full name' required validateStatus={errors.fullName ? 'error' : ''} >
                          <Controller
                            control={control}
                            name='fullName'
                            render={({ field }) => <Input {...field} />}
                          />
                          {errors.fullName && <ErrorMessage message={errors.fullName.message} />}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label='Address' required validateStatus={errors.address ? 'error' : ''}>
                          <Controller
                            control={control}
                            name='address'
                            render={({ field }) => <Input {...field} />}
                          />
                          {errors.address && <ErrorMessage message={errors.address.message} />}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={24}>
                      <Col span={12}>
                        <Form.Item label='Phone' required validateStatus={errors.phone ? 'error' : ''}>
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
                    </Row>
                    <Row gutter={24}>
                      <Col span={12}>
                        <Form.Item label='Username' required validateStatus={errors.userName ? 'error' : ''}>
                          <Controller
                            control={control}
                            name='userName'
                            render={({field}) => <Input {...field} />}
                          />
                          {errors.userName && <ErrorMessage message={errors.userName.message} />}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label='Favorite' required validateStatus={errors.favorite ? 'error' : ''}>
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
                    </Row>
                    <Row gutter={24}>
                      <Col span={12}>
                          <Form.Item label='Password' required validateStatus={errors.password ? 'error' : ''}>
                            <Controller
                              control={control}
                              name='password'
                              render={({ field }) => <Input {...field} type={viewPassword ? 'text' : 'password'} suffix={viewPassword ? <BsEyeSlashFill className='pointer' onClick={() => handleChangeViewPassword('password')} color='#000' /> : <BsEyeFill className='pointer' color='#000' onClick={() => handleChangeViewPassword('password')} />}  />}
                            />
                            {errors.password && <ErrorMessage message={errors.password.message} />}
                          </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label='Confirm password' required validateStatus={errors.confirmPassword ? 'error' : ''}>
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
                        render={({ field: { value, onChange } }) => <Checkbox checked={value} onChange={onChange} >I agree all statements in <Link to='/term-of-services' target='_blank'>Terms of services</Link></Checkbox>}
                      />
                      {errors.isAgreeTerm && (
                        <>
                          <br/>
                          <ErrorMessage message={errors.isAgreeTerm.message} />
                        </>
                      )}
                    </Form.Item>
                    <div className='btn-box'>
                      <Button loading={isSubmitting} type='primary' htmlType='submit' className='btn-submit' size='large'>Register</Button>
                      <Button type='primary' htmlType='button' className='btn-login' size='large' onClick={handleRedirectLogin}>
                        <span>Login</span>
                        <MdNavigateNext size={20} />
                      </Button>
                    </div>
                  </Form>
                </div>
                <div className="right">
                  <img src='/assets/signup-image.jpg' alt='/' />
                </div>
            </div>
            {/* <div className="sign-up-footer">
                <div className="left">

                </div>
                <div className="right">

                </div>
            </div> */}
        </div>
    </div>
  )
}

export default Register