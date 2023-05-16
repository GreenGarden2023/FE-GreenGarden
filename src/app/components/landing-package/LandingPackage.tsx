import React, { useEffect, useMemo, useState } from 'react'
import './style.scss'
import Table, { ColumnsType } from 'antd/es/table'
import { Button, Col, DatePicker, DatePickerProps, Form, Input, Modal, Row, Select } from 'antd'
import { useNavigate } from 'react-router-dom';
import useSelector from 'app/hooks/use-selector';
import useDispatch from 'app/hooks/use-dispatch';
import { setNoti } from 'app/slices/notification';
import GridConfig from '../grid-config/GridConfig';
import { useForm, Controller } from 'react-hook-form';
import { ShippingFee } from 'app/models/shipping-fee';
import shippingFeeService from 'app/services/shipping-fee.service';
import locale from 'antd/es/date-picker/locale/vi_VN';
import CONSTANT from 'app/utils/constant';
import utilDateTime from 'app/utils/date-time';
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup';
import ErrorMessage from '../message.tsx/ErrorMessage';
import { Package } from 'app/models/package';
import takeCareComboService from 'app/services/take-care-combo.service';

// interface Package{
//     name: string;
//     price: number;
//     description: string;
//     guarantee: string
// }
interface CreatePkgRequest{
    fullName: string;
    mail: string;
    phone: string;
    // nơi chăm sóc
    isTransport: boolean;
    districtID: number;
    address: string;
    quantity: number;
    months: number;
    startDate: string;
}

// const DATA: Package[] = [
//     {
//         name: 'Dịch vụ chăm sóc cây xanh theo yêu cầu',
//         price: 600000,
//         description: 'Cắt tỉa cây xanh, cắt cỏ, nhổ cỏ dại, tưới nước, trồng cây mới và các công việc liên quan đến cây xanh do chủ đầu tư yêu cầu.',
//         guarantee: 'Thay thế cây chết trong quá trình chăm sóc '
//     }
// ]

const schema = yup.object().shape({
    fullName: yup.string().trim().required('Họ và tên không được để trống').min(2, 'Họ và tên có ít nhất 2 ký tự').max(50, 'Họ và tên có nhiều nhất 50 ký tự'),
    address: yup.string().trim().required('Địa chỉ không được để trống').min(5, 'Địa chỉ có ít nhất 5 ký tự').max(100, 'Địa chỉ có nhiều nhất 100 ký tự'),
    phone: yup.string().trim().required('Số điện thoại không được để trống').matches(CONSTANT.PHONE_REGEX, 'Số điện thoại không hợp lệ'),
    mail: yup.string().trim().required('Email không được để trống').matches(CONSTANT.EMAIL_REGEX, 'Email không hợp lệ'),
    quantity: yup.number().required('Số lượng cây không được để trống').min(1, 'Có ít nhất 1 cây'),
    months: yup.number().required('Số tháng chăm sóc không được để trống').min(1, 'Cần ít nhất 1 tháng chăm sóc'),
})

const LandingPackage: React.FC = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { user } = useSelector(state => state.userInfor)

    // data
    const [packages, setPackages] = useState<Package[]>([])

    const [packageSelect, setPackageSelect] = useState<Package>()
    const [shipping, setShipping] = useState<ShippingFee[]>([])

    const { setValue, control, formState: {errors, isSubmitting, isSubmitted}, handleSubmit, trigger, setError, reset } = useForm<CreatePkgRequest>({
        resolver: yupResolver(schema)
    })

    useEffect(() =>{
        const init = async () =>{
            try{
                const res = await takeCareComboService.getAllTakeCareCombo('active')
                setPackages(res.data)
            }catch{
                
            }
        }
        init() 
    }, [])

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

    const Column: ColumnsType<any> = [
        {
            title: 'Gói dịch vụ',
            key: 'name',
            dataIndex: 'name'
        },
        {
            title: 'Đơn giá',
            key: 'price',
            dataIndex: 'price',
            render: (v) => (
                <div className="l-package-price">
                    <span>{v}</span>/cây/tháng
                </div>
            )
        },
        {
            title: 'Chi tiết công việc',
            key: 'description',
            dataIndex: 'description'
        },
        {
            title: 'Cam kết của cửa hàng',
            key: 'guarantee',
            dataIndex: 'guarantee'
        },
        {
            title: '',
            key: '#',
            dataIndex: '#',
            render: (_, record) => <Button className='btn btn-create l-package-button' onClick={() => handleSendRequest(record)}>Gửi yêu cầu</Button>
        },
    ]
    const DataSource = useMemo(() =>{
        return packages.map((item, index) => ({
            key: index + 1,
            ...item
        }))
    }, [packages])

    const handleSendRequest = (pkg: Package) =>{
        if(!user.id){
            return navigate('/login')
        }
        if(user.roleName !== 'Customer'){
            return dispatch(setNoti({type: 'info', message: 'Bạn không thể sử dụng chức năng này'}))
        }
        setPackageSelect(pkg)

        const { fullName, mail, phone, districtID, address } = user
        setValue('fullName', fullName)
        setValue('mail', mail)
        setValue('phone', phone)
        setValue('isTransport', true)
        setValue('districtID', districtID)
        setValue('address', address)
        setValue('quantity', 1)
        setValue('months', 1)
    }

    const handleCloseModal = () =>{
        setPackageSelect(undefined)
        reset()
    }

    const handleSubmitForm = async (data: CreatePkgRequest) =>{
        // validate startDate
        if(!data.startDate){
            setError('startDate', {
                type: 'pattern',
                message: 'Ngày bắt đầu chăm sóc không được để trống'
            })
            return;
        }
        try{
            console.log(data)
        }catch{

        }
    }

    const onChange: DatePickerProps['onChange'] = (date, dateString) => {
        if(!date){
            setValue('startDate', '')
        }else{
            setValue('startDate', utilDateTime.dayjsToLocalStringTemp(date))
        }
        isSubmitted && trigger('startDate')
        // console.log(utilDateTime.dayjsToLocalStringTemp(date));
    };

    return (
        <div className='l-package-wrapper'>
            <div className="l-package-box container-wrapper">
                <Table columns={Column}  dataSource={DataSource} bordered pagination={false} scroll={{x: 480}} />
            </div>
            {
                packageSelect && 
                <Modal
                    title={`Xác nhận thông tin`}
                    open
                    onCancel={handleCloseModal}
                    footer={false}
                    width={1000}
                    className='m-confirm-info'
                >
                    <div className="m-package-info">
                        <h1>Thông tin gói chăm sóc</h1>
                        <div className="item">
                            <span className="label-text">Tên gói:</span>
                            <span className="value-text">{packageSelect.name}</span>
                        </div>
                        <div className="item">
                            <span className="label-text">Giá:</span>
                            <span className="value-text">{packageSelect.price}/cây/tháng</span>
                        </div>
                        <div className="item">
                            <span className="label-text">Mô tả:</span>
                            <span className="value-text">{packageSelect.description}</span>
                        </div>
                        <div className="item">
                            <span className="label-text">Cam kết của cửa hàng:</span>
                            <span className="value-text">{packageSelect.guarantee}</span>
                        </div>
                    </div>
                    <Form
                        labelAlign='left'
                        layout='vertical'
                        onFinish={handleSubmit(handleSubmitForm)}
                        className='m-package-form'
                    >
                        <h1>Thông tin của bạn</h1>
                        <GridConfig>
                            <Row gutter={[24, 0]}>
                                <Col span={12}>
                                    <Form.Item label="Họ và tên" required>
                                        <Controller
                                            control={control}
                                            name='fullName'
                                            render={({ field }) => (<Input {...field} />)}
                                        />
                                        {errors.fullName && <ErrorMessage message={errors.fullName.message} />}
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="Email" required>
                                        <Controller
                                            control={control}
                                            name='mail'
                                            render={({ field }) => (<Input {...field} />)}
                                        />
                                        {errors.mail && <ErrorMessage message={errors.mail.message} />}
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="Số điện thoại" required>
                                        <Controller
                                            control={control}
                                            name='phone'
                                            render={({ field }) => (<Input {...field} />)}
                                        />
                                        {errors.phone && <ErrorMessage message={errors.phone.message} />}
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="Chọn nơi chăm sóc cây">
                                        <Controller
                                            control={control}
                                            name='isTransport'
                                            render={({ field }) => (
                                                <Select {...field}>
                                                    <Select.Option key={1} value={true} >Chăm sóc tại cửa hàng</Select.Option>
                                                    <Select.Option key={2} value={false} >Chăm sóc tại nhà</Select.Option>
                                                </Select>
                                            )}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="Nơi chăm sóc" required>
                                        <Controller
                                            control={control}
                                            name='districtID'
                                            render={({ field }) => (
                                                <Select {...field}>
                                                    {
                                                        shipping.map((item, index) => (
                                                            <Select.Option key={index} value={item.districtID}>{item.district}</Select.Option>
                                                        ))
                                                    }
                                                </Select>
                                            )}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="Địa chỉ" required>
                                        <Controller
                                            control={control}
                                            name='address'
                                            render={({ field }) => (<Input {...field} />)}
                                        />
                                        {errors.address && <ErrorMessage message={errors.address.message} />}
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="Số lượng cây" required>
                                        <Controller
                                            control={control}
                                            name='quantity'
                                            render={({ field: { value } }) => (<Input type='number' value={value} onChange={(e) =>{
                                                const value = e.target.value ? Number(e.target.value) : 0
                                                if(value > 0){
                                                    setValue('quantity', value)
                                                }else{
                                                    setValue('quantity', 0)
                                                }
                                                isSubmitted && trigger('quantity')
                                            }} />)}
                                        />
                                        {errors.quantity && <ErrorMessage message={errors.quantity.message} />}
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="Số tháng chăm sóc" required>
                                        <Controller
                                            control={control}
                                            name='months'
                                            render={({ field: { value } }) => (<Input type='number' value={value} onChange={(e) =>{
                                                const value = e.target.value ? Number(e.target.value) : 0
                                                if(value > 0){
                                                    setValue('months', value)
                                                }else{
                                                    setValue('months', 0)
                                                }
                                                isSubmitted && trigger('months')
                                            }} />)}
                                        />
                                        {errors.months && <ErrorMessage message={errors.months.message} />}
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item label="Ngày bắt đầu chăm sóc" required>
                                        <DatePicker
                                            placeholder='Chọn ngày bắt đầu chăm sóc'
                                            locale={locale}
                                            format={CONSTANT.DATE_FORMAT_LIST}
                                            disabledDate={(current) => current && current.valueOf()  < Date.now().valueOf()}
                                            style={{width: '100%'}}
                                            onChange={onChange}
                                        />
                                        {errors.startDate && <ErrorMessage message={errors.startDate.message} />}
                                    </Form.Item>
                                </Col>
                            </Row>
                        </GridConfig>
                        <div className='btn-form-wrapper'>
                            <Button htmlType='button' disabled={isSubmitting} type='default' className='btn-cancel' size='large' onClick={handleCloseModal}>Hủy bỏ</Button>
                            <Button htmlType='submit' loading={isSubmitting} type='primary' className='btn-update' size='large'>
                                Gửi yêu cầu
                            </Button>
                        </div>
                    </Form>
                </Modal>
            }
        </div>
    )
}

export default LandingPackage