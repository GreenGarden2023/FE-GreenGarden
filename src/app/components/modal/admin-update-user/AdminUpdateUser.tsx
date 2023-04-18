import { Col, Form, Input, Modal, Row, Select } from 'antd';
import { Role } from 'app/models/general-type';
import { ShippingFee } from 'app/models/shipping-fee';
import { CreateUserByAdmin, User } from 'app/models/user'
import React, { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup';

const schema = yup.object().shape({
    
})

const ROLES: Role[] = ['Customer', 'Manager', 'Technician']

interface AdminUpdateUserProps{
    user?: User
    shippingFees: ShippingFee[]
    onClose: () => void;
    onSubmit: () => void;
}

const AdminUpdateUser: React.FC<AdminUpdateUserProps> = ({user, shippingFees, onClose, onSubmit}) => {

    const { setValue, control } = useForm<CreateUserByAdmin>({
        resolver: yupResolver(schema)
    })

    useEffect(() =>{
        if(!user) return;
        const { address, districtID, fullName, mail, phone, roleName, userName } = user

        setValue('fullName', fullName)
        setValue('phone', phone)
        setValue('address', address)
        setValue('districtId', districtID)
        setValue('mail', mail)
        setValue('userName', userName)
        setValue('roleName', roleName)
        setValue('password', '')
    }, [user, setValue])

    return (
        <Modal
            open
            title={`${user ? 'Cập nhật' : 'Tạo mới'} thông tin người dùng`}
            onCancel={onClose}
            width={800}
        >
            <Form
                layout='vertical'
                // onFinish={}
            >
                <Row gutter={[24, 0]}>
                    <Col span={12}>
                        <Form.Item label="Họ và tên">
                            <Controller
                                control={control}
                                name='fullName'
                                render={({field}) => <Input {...field} />}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Số điện thoại">
                            <Controller
                                control={control}
                                name='phone'
                                render={({field}) => <Input {...field} />}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Địa chỉ">
                            <Controller
                                control={control}
                                name='address'
                                render={({field}) => <Input {...field} />}
                            />
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
                        <Form.Item label="Email">
                            <Controller
                                control={control}
                                name='mail'
                                render={({field}) => <Input {...field} />}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Tài khoản">
                            <Controller
                                control={control}
                                name='userName'
                                render={({field}) => <Input {...field} />}
                            />
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
                    <Col span={12}>
                        <Form.Item label="Mật khẩu">
                            <Controller
                                control={control}
                                name='password'
                                render={({field}) => <Input type='password' {...field} />}
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
}

export default AdminUpdateUser