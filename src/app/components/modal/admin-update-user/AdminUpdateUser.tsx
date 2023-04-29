import { Button, Col, Form, Input, Modal, Row, Select } from 'antd';
import { Role } from 'app/models/general-type';
import { ShippingFee } from 'app/models/shipping-fee';
import { CreateUserByAdmin, User } from 'app/models/user'
import React, { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup';
import CONSTANT from 'app/utils/constant';
import userService from 'app/services/user.service';
import useDispatch from 'app/hooks/use-dispatch';
import { setNoti } from 'app/slices/notification';
import { BsEyeFill, BsEyeSlashFill } from 'react-icons/bs';
import ErrorMessage from 'app/components/message.tsx/ErrorMessage';

const ROLES: Role[] = ['Customer', 'Manager', 'Technician']

interface AdminUpdateUserProps{
    user?: User
    shippingFees: ShippingFee[]
    onClose: () => void;
    onSubmit: (user: User) => void;
}

const AdminUpdateUser: React.FC<AdminUpdateUserProps> = ({user, shippingFees, onClose, onSubmit}) => {
    const schema = yup.object().shape({
        userName: !user ? yup.string().trim().required('Tài khoản không được để trống').min(5, 'Tài khoản có ít nhất 5 ký tự').max(30, 'Tài khoản có nhiều nhất 30 ký tự') : yup.string(),
        password: !user ? yup.string().trim().required('Mật khẩu không được để trống').min(6, 'Mật khẩu có ít nhất 6 ký tự').max(30, 'Mật khẩu có nhiều nhất 30 ký tự') : yup.string(),
        fullName: yup.string().trim().required('Họ và tên không được để trống').min(5, 'Họ và tên có ít nhất 5 ký tự').max(50, 'Họ và tên có nhiều nhất 50 ký tự'),
        address: yup.string().trim().required('Địa chỉ không được để trống').min(5, 'Địa chỉ có ít nhất 5 ký tự').max(100, 'Địa chỉ có nhiều nhất 100 ký tự'),
        phone: yup.string().trim().required('Số điện thoại không được để trống').matches(CONSTANT.PHONE_REGEX, 'Số điện thoại không hợp lệ'),
        mail: yup.string().trim().required('Email không được để trống').matches(CONSTANT.EMAIL_REGEX, 'Email không hợp lệ'),
    })
    const dispatch = useDispatch();

    const [isViewPass, setIsViewPass] = useState(false)

    const { setValue, control, handleSubmit, formState: { errors, isSubmitting } } = useForm<CreateUserByAdmin>({
        defaultValues: {
            roleName: 'Customer',
            districtId: 1,
        },
        resolver: yupResolver(schema)
    })

    useEffect(() =>{
        if(!user) return;
        const { address, districtID, fullName, mail, phone, roleName, userName, id, favorite } = user

        setValue('userID', id)
        setValue('fullName', fullName)
        setValue('phone', phone)
        setValue('address', address)
        setValue('districtId', districtID)
        setValue('mail', mail)
        setValue('userName', userName)
        setValue('roleName', roleName)
        setValue('password', '')
        setValue('favorite', favorite)

    }, [user, setValue])

    const handleSubmitForm = async (data: CreateUserByAdmin) =>{
        if(user){
            const res = await userService.updateUserByAdmin(data)
            if(res.isSuccess){
                dispatch(setNoti({type: 'success', message: 'Cập nhật tài khoản thành công'}))
                onSubmit(res.data)
                return;
            }
            dispatch(setNoti({type: 'error', message: res.message}))
        }else{
            const res = await userService.createUserByAdmin(data)
            if(res.isSuccess){
                dispatch(setNoti({type: 'success', message: 'Tạo mới tài khoản thành công'}))
                onSubmit(res.data)
                return;
            }
            dispatch(setNoti({type: 'error', message: res.message}))
        }
    }

    const togglePassword = () =>{
        setIsViewPass(!isViewPass)
    }

    return (
        <Modal
            open
            title={`${user ? 'Cập nhật' : 'Tạo mới'} thông tin người dùng`}
            onCancel={onClose}
            width={800}
            footer={false}
        >
            <Form
                layout='vertical'
                onFinish={handleSubmit(handleSubmitForm)}
            >
                <Row gutter={[24, 0]}>
                    <Col span={12}>
                        <Form.Item label="Họ và tên" required>
                            <Controller
                                control={control}
                                name='fullName'
                                render={({field}) => <Input {...field} />}
                            />
                            {errors.fullName && <ErrorMessage message={errors.fullName.message} />}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Số điện thoại" required>
                            <Controller
                                control={control}
                                name='phone'
                                render={({field}) => <Input {...field} />}
                            />
                            {errors.phone && <ErrorMessage message={errors.phone.message} />}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Địa chỉ" required>
                            <Controller
                                control={control}
                                name='address'
                                render={({field}) => <Input {...field} />}
                            />
                            {errors.address && <ErrorMessage message={errors.address.message} />}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Vị trí nhận hàng">
                            <Controller
                                control={control}
                                name='districtId'
                                render={({field}) => (
                                    <Select {...field}>
                                        {
                                            shippingFees.map((item, index) => (
                                                <Select.Option value={item.districtID} key={index}>{item.district}</Select.Option>
                                            ))
                                        }
                                    </Select>
                                )}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Email" required>
                            <Controller
                                control={control}
                                name='mail'
                                render={({field}) => <Input {...field} />}
                            />
                            {errors.mail && <ErrorMessage message={errors.mail.message} />}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Vai trò">
                            <Controller
                                control={control}
                                name='roleName'
                                render={({field}) => (
                                    <Select {...field}>
                                        {
                                            ROLES.map((item, index) => (
                                                <Select.Option value={item} key={index}>{item}</Select.Option>
                                            ))
                                        }
                                    </Select>
                                )}
                            />
                        </Form.Item>
                    </Col>
                    {
                        user?.roleName === 'Customer' &&
                        <Col span={24}>
                            <Form.Item label='Sở thích'>
                                <Controller 
                                    control={control}
                                    name='favorite'
                                    render={({field}) => (
                                        <Select {...field}>
                                            {
                                                CONSTANT.FAVORITES.map((item, index) => (
                                                    <Select.Option key={index} value={item} >{item}</Select.Option>
                                                ))
                                            }
                                        </Select>
                                    )}
                                />
                            </Form.Item>
                        </Col>
                    }
                    {
                        !user &&
                        <>
                            <Col span={12}>
                                <Form.Item label="Tên đăng nhập">
                                    <Controller
                                        control={control}
                                        name='userName'
                                        render={({field}) => <Input {...field} />}
                                    />
                                    {errors.userName && <ErrorMessage message={errors.userName.message} />}
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Mật khẩu">
                                    <Controller
                                        control={control}
                                        name='password'
                                        render={({field}) => <Input type={isViewPass ? 'text' : 'password'} {...field}  suffix={isViewPass ? <BsEyeSlashFill className='pointer' onClick={togglePassword} color='#000' /> : <BsEyeFill color='#000' className='pointer' onClick={togglePassword} />} />}
                                    />
                                    {errors.password && <ErrorMessage message={errors.password.message} />}
                                </Form.Item>
                            </Col>
                        </>
                    }
                    <Col span={24}>
                        <div className='btn-form-wrapper'>
                            <Button htmlType='button' disabled={isSubmitting} type='default' className='btn-cancel' size='large' onClick={onClose} >Hủy bỏ</Button>
                            <Button htmlType='submit' loading={isSubmitting} type='primary' className='btn-update' size='large'>
                                {user ? 'Cập nhật' : 'Tạo mới'}
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
}

export default AdminUpdateUser