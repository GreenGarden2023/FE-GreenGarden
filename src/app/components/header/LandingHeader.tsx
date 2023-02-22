import { yupResolver } from '@hookform/resolvers/yup';
import { Badge, Button, Col, Form, Input, Modal, Row, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { AiFillCaretDown, AiOutlineShoppingCart, AiOutlineUserAdd } from 'react-icons/ai';
import { FaUserCircle } from 'react-icons/fa';
import { GiExitDoor } from 'react-icons/gi';
import { Link, useLocation } from 'react-router-dom';
import * as yup from 'yup';
import useDispatch from '../../hooks/use-dispatch';
import useSelector from '../../hooks/use-selector';
import { UserUpdate } from '../../models/user';
import { setNoti } from '../../slices/notification';
import { setEmptyUser } from '../../slices/user-infor';
import CONSTANT from '../../utils/constant';
import ErrorMessage from '../message.tsx/ErrorMessage';
import './style.scss';

/* eslint-disable no-useless-escape */
const schema = yup.object().shape({
    fullName: yup.string().required('Full Name is required').min(5, 'Full Name is greater than 5 characters').max(50, 'Full Name is less than 50 characters'),
    address: yup.string().required('Address is required').min(5, 'Address is greater than 5 characters').max(100, 'Address is less than 100 characters'),
    phone: yup.string().required('Phone is required').matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g, 'Phone is not valid'),
    favorite: yup.string().required('Favorite is required'),
    mail: yup.string().required('Email is required').matches(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Email is not valid'),
})

const LandingHeader: React.FC = () =>{
    const dispatch = useDispatch();
    const location = useLocation()

    
    const [openModalUserInfor, setOpenModalInfor] = useState(false);
    
    const userState = useSelector(state => state.userInfor);

    const { setValue, formState: { errors, isSubmitting }, control, handleSubmit, reset } = useForm<UserUpdate>({
        resolver: yupResolver(schema)
    })

    useEffect(() =>{
        if(!openModalUserInfor) {
            reset();
            return;
        }

        const { id, fullName, address, phone, mail, favorite } = userState
        setValue('id', id);
        setValue('fullName', fullName);
        setValue('address', address);
        setValue('phone', phone);
        setValue('mail', mail);
        setValue('favorite', favorite);
    }, [openModalUserInfor, userState, setValue, reset])

    const handleLogout = () =>{
        localStorage.removeItem(CONSTANT.STORAGE.ACCESS_TOKEN)
        dispatch(setEmptyUser())
    }

    const handleViewInfor = () =>{
        setOpenModalInfor(true)
    }

    const handleSubmitForm = async(data: UserUpdate) =>{
        try{
            console.log(data)
            dispatch(setNoti({type: 'success', message: 'Update infor success'}))
        }catch(err){
            dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE}))
        }
    }

    return (
        <>
            <header className='landing-header'>
                <div className='container-wrapper' >
                    <div className="left">
                        <Link to='/' >
                            <img src="/assets/logo.jpg" alt="/" />
                        </Link>
                    </div>
                    <div className="right">
                        <div className="cart-box">
                            <Link to='/cart' >
                                <Badge count={5} >
                                    <AiOutlineShoppingCart size={30} />
                                </Badge>
                            </Link>
                        </div>
                        <div className="register-login-infor-box">
                          {
                            !userState.loading && 
                            <>
                              {
                                  userState.token ? 
                                  <>
                                      <div className='user-infor-box' onClick={handleViewInfor}>
                                          <FaUserCircle size={20} />
                                          <span>{userState.fullName}</span>
                                      </div>
                                      <div className="log-out" onClick={handleLogout}>
                                          <GiExitDoor size={20} />
                                          <span>Logout</span>
                                      </div>
                                  </> :
                                  <>
                                  <Link to='/register' >
                                      <AiOutlineUserAdd size={20} />
                                      <span>Regsiter</span>
                                  </Link>
                                  <Link to='/login' state={{history: location.pathname}} >
                                      <GiExitDoor size={20} />
                                      <span>Login</span>
                                  </Link>
                                  </>
                              }
                            </>
                          }
                        </div>
                    </div>
                </div>
            </header>
            <Modal width={800} title='User information' open={openModalUserInfor} footer={null} onCancel={() => setOpenModalInfor(false)}>
                <Form
                    layout='vertical'
                    onFinish={handleSubmit(handleSubmitForm)}
                    className='form-infor-header'
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
                      <Col span={24}>
                        <Form.Item label='Favorite' required validateStatus={errors.favorite ? 'error' : ''}>
                          <Controller
                            control={control}
                            name='favorite'
                            render={({field: { onChange, value }}) => (
                              <Select suffixIcon={<AiFillCaretDown />} onChange={onChange} value={value} >
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
                    <Form.Item className='btn-box'>
                      <Button type='default' htmlType='button' className='btn-cancel' size='large' onClick={() => setOpenModalInfor(false)}>
                        Cancel
                      </Button>
                      <Button loading={isSubmitting} type='primary' htmlType='submit' className='btn-update' size='large'>Update</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}

export default LandingHeader;