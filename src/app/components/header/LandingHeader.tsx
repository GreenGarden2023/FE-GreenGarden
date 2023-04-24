import { yupResolver } from '@hookform/resolvers/yup';
import { Badge, Button, Col, Form, Input, Modal, Row, Select } from 'antd';
import { Role } from 'app/models/general-type';
import { ShippingFee } from 'app/models/shipping-fee';
import cartService from 'app/services/cart.service';
import shippingFeeService from 'app/services/shipping-fee.service';
import userService from 'app/services/user.service';
import { CartProps, setCartSlice } from 'app/slices/cart';
import React, { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { AiFillCaretDown, AiOutlineShoppingCart, AiOutlineUserAdd } from 'react-icons/ai';
import { BiGitPullRequest } from 'react-icons/bi';
import { BsBagCheckFill } from 'react-icons/bs';
import { FaUserCircle } from 'react-icons/fa';
import { GiExitDoor } from 'react-icons/gi';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import useDispatch from '../../hooks/use-dispatch';
import useSelector from '../../hooks/use-selector';
import { UserUpdate } from '../../models/user';
import { setNoti } from '../../slices/notification';
import { setApartUser, setEmptyUser } from '../../slices/user-infor';
import CONSTANT from '../../utils/constant';
import ErrorMessage from '../message.tsx/ErrorMessage';
import './style.scss';

/* eslint-disable no-useless-escape */
const schema = yup.object().shape({
    fullName: yup.string().trim().required('Họ và tên không được để trống').min(5, 'Họ và tên có ít nhất 5 ký tự').max(50, 'Họ và tên có nhiều nhất 50 ký tự'),
    address: yup.string().trim().required('Địa chỉ không được để trống').min(5, 'Địa chỉ có ít nhất 5 ký tự').max(100, 'Địa chỉ có nhiều nhất 100 ký tự'),
    phone: yup.string().trim().required('Số điện thoại không được để trống').matches(CONSTANT.PHONE_REGEX, 'Số điện thoại không hợp lệ'),
})

const LandingHeader: React.FC = () =>{
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const location = useLocation()
    const userState = useSelector(state => state.userInfor);

    const [openModalUserInfor, setOpenModalInfor] = useState(false);
    const [shipping, setShipping] = useState<ShippingFee[]>([])

    const { setValue, formState: { errors, isSubmitting }, control, handleSubmit, reset } = useForm<UserUpdate>({
        resolver: yupResolver(schema)
    })

    useEffect(() =>{
      if(!openModalUserInfor) return;
      const init = async () =>{
        try{
          const res = await shippingFeeService.getList()
          setShipping(res.data)
        }catch{

        }
      }
      init()
    }, [openModalUserInfor])

    useEffect(() =>{
        if(!openModalUserInfor) {
            reset();
            return;
        }

        const { id, fullName, address, phone, mail, favorite, districtID } = userState.user
        setValue('id', id);
        setValue('fullName', fullName);
        setValue('address', address);
        setValue('phone', phone);
        setValue('mail', mail);
        setValue('favorite', favorite);
        setValue('districtID', districtID);

    }, [openModalUserInfor, userState, setValue, reset])

    useEffect(() =>{
      if(location.pathname === '/cart') return;
      if(!userState.user.id) return;
      const init = async () =>{
        try{
          const result = await cartService.getCart()
          const cartProps: CartProps = {
            rentItems: [...result.data.rentItems?.map(x => ({productItemDetailID: x.productItemDetail.id, quantity: x.quantity})) || []],
            saleItems: [...result.data.saleItems?.map(x => ({productItemDetailID: x.productItemDetail.id, quantity: x.quantity})) || []],
        }
          dispatch(setCartSlice(cartProps))
        }catch{
          // console.log('asdsa')
          // dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
        }
      }
      init()
    }, [dispatch, location, userState])

    const handleLogout = () =>{
        localStorage.removeItem(CONSTANT.STORAGE.ACCESS_TOKEN)
        dispatch(setEmptyUser())
        dispatch(setCartSlice({rentItems: [], saleItems: []}))
        navigate('/login')
    }

    const handleViewInfor = () =>{
        setOpenModalInfor(true)
    }

    const handleSubmitForm = async(data: UserUpdate) =>{
        try{
            const res = await userService.updateUser(data)
            if(res.isSuccess){
              dispatch(setApartUser(data))
              dispatch(setNoti({type: 'success', message: 'Cập nhật thông tin thành công'}))
              return;
            }
            dispatch(setNoti({type: 'error', message: res.message}))
        }catch(err){
            dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE}))
        }
    }
    const { rentItems, saleItems } = useSelector(state => state.CartStore)
    const cartQuantity = useMemo(() =>{
      let quantity = 0
      for (let i = 0; i < rentItems.length; i++) {
        const element = rentItems[i];
          quantity += element.quantity
      }
      for (let i = 0; i < saleItems.length; i++) {
        const element = saleItems[i];
          quantity += element.quantity
      }
      return quantity
    }, [rentItems, saleItems])

    const navigateToPanel = () =>{
      const roleName = userState.user.roleName as Role
      switch(roleName){
        case 'Admin': navigate('/panel/manage-shipping-fee')
          break;
        case 'Manager': navigate('/panel/manage-category')
          break;
        case 'Technician': navigate('/panel/take-care-order-assigned')
          break;
      }
    }
    return (
        <>
            <header className='landing-header'>
                <div className='container-wrapper' >
                    <div className="left">
                        <Link to='/' >
                            <img src="/assets/logo.png" alt="/" />
                        </Link>
                    </div>
                    <div className="right">
                        <div className="cart-box">
                            <Link to='/cart' >
                                <Badge count={cartQuantity} >
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
                                  {
                                    userState.user.roleName !== 'Customer' &&
                                    <div className='user-infor-box' onClick={navigateToPanel}>
                                      <BiGitPullRequest size={20} />
                                      <span>Bảng điều khiển</span>
                                    </div>
                                  }
                                      <div className='user-infor-box' onClick={() => navigate('/take-care-service/me')}>
                                          <BiGitPullRequest size={20} />
                                          <span>Yêu cầu của bạn</span>
                                      </div>
                                      <div className='user-infor-box' onClick={() => navigate('/orders')}>
                                          <BsBagCheckFill size={20} />
                                          <span>Đơn hàng của bạn</span>
                                      </div>
                                      <div className='user-infor-box' onClick={handleViewInfor}>
                                          <FaUserCircle size={20} />
                                          <span>{userState.user.fullName}</span>
                                      </div>
                                      <div className="log-out" onClick={handleLogout}>
                                          <GiExitDoor size={20} />
                                          <span>Đăng xuất</span>
                                      </div>
                                  </> :
                                  <>
                                  <Link to='/register' >
                                      <AiOutlineUserAdd size={20} />
                                      <span>Đăng ký</span>
                                  </Link>
                                  <Link to='/login' state={{history: location.pathname}} >
                                      <GiExitDoor size={20} />
                                      <span>Đăng nhập</span>
                                  </Link>
                                  </>
                              }
                            </>
                          }
                        </div>
                    </div>
                </div>
            </header>
            <Modal width={800} title='Thông tin của bạn' open={openModalUserInfor} footer={null} onCancel={() => setOpenModalInfor(false)}>
                <Form
                    layout='vertical'
                    onFinish={handleSubmit(handleSubmitForm)}
                    className='form-infor-header'
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
                        <Form.Item label='Địa chỉ nhận hàng'>
                          <Controller 
                            control={control}
                            name='districtID'
                            render={({field}) => (
                              <Select {...field}>
                                {
                                  shipping.map((item, index) => (
                                    <Select.Option value={item.districtID} key={index} >{item.district}</Select.Option>
                                  ))
                                }
                              </Select>
                            )}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label='Địa chỉ cụ thể' required validateStatus={errors.address ? 'error' : ''}>
                          <Controller
                            control={control}
                            name='address'
                            render={({ field }) => <Input {...field} />}
                          />
                          {errors.address && <ErrorMessage message={errors.address.message} />}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label='Email'>
                          <Controller
                            control={control}
                            name='mail'
                            render={({ field }) => <Input disabled {...field} />}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label='Sở thích' >
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
                        </Form.Item>
                      </Col>
                    </Row>
                    <Form.Item className='btn-box'>
                      <Button type='default' htmlType='button' className='btn-cancel' size='large' onClick={() => setOpenModalInfor(false)}>
                        Hủy bỏ
                      </Button>
                      <Button loading={isSubmitting} type='primary' htmlType='submit' className='btn-update' size='large'>Cập nhật</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}

export default LandingHeader;