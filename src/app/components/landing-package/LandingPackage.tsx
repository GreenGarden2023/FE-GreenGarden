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
import locale from 'antd/es/date-picker/locale/vi_VN';
import CONSTANT from 'app/utils/constant';
import utilDateTime from 'app/utils/date-time';
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup';
import ErrorMessage from '../message.tsx/ErrorMessage';
import { Package, PackageServiceHandle } from 'app/models/package';
import takeCareComboService from 'app/services/take-care-combo.service';
import PackageDetail from '../package-detail/PackageDetail';
import MoneyFormat from '../money/MoneyFormat';
import dayjs from 'dayjs'

const schema = yup.object().shape({
    name: yup.string().trim().required('Họ và tên không được để trống').min(2, 'Họ và tên có ít nhất 2 ký tự').max(50, 'Họ và tên có nhiều nhất 50 ký tự'),
    address: yup.string().trim().required('Địa chỉ không được để trống').min(5, 'Địa chỉ có ít nhất 5 ký tự').max(100, 'Địa chỉ có nhiều nhất 100 ký tự'),
    phone: yup.string().trim().required('Số điện thoại không được để trống').matches(CONSTANT.PHONE_REGEX, 'Số điện thoại không hợp lệ'),
    email: yup.string().trim().required('Email không được để trống').matches(CONSTANT.EMAIL_REGEX, 'Email không hợp lệ'),
    treeQuantity: yup.number().required('Số lượng cây không được để trống').min(1, 'Có ít nhất 1 cây').max(20, 'Số cây tối đa là 20 cây'),
    numOfMonth: yup.number().required('Số tháng chăm sóc không được để trống').min(1, 'Cần ít nhất 1 tháng chăm sóc').max(24, 'Số tháng chăm sóc tối đa là 24'),
})

const LandingPackage: React.FC = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { user } = useSelector(state => state.userInfor)

    // data
    const [packages, setPackages] = useState<Package[]>([])

    const [packageSelect, setPackageSelect] = useState<Package>()

    const { setValue, control, formState: {errors, isSubmitting, isSubmitted}, handleSubmit, trigger, setError, reset, getValues } = useForm<PackageServiceHandle>({
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
                    <MoneyFormat value={v} color='Light Blue' />/cây/tháng
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
            dataIndex: 'guarantee',
            render: (v) => <p className='manage-guarantee'>{v}</p>
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

        const { fullName, mail, phone, address } = user
        setValue('name', fullName)
        setValue('email', mail)
        setValue('phone', phone)
        setValue('isAtShop', true)
        setValue('address', address)
        setValue('treeQuantity', 1)
        setValue('numOfMonth', 1)
        setValue('takecareComboId', pkg.id)

        const dateNow = new Date()
        dateNow.setDate(dateNow.getDate() + 3)
        setValue('startDate', utilDateTime.dayjsToLocalStringTemp(dayjs(dateNow)))
    }

    const handleCloseModal = () =>{
        setPackageSelect(undefined)
        reset()
    }

    const handleSubmitForm = async (data: PackageServiceHandle) =>{
        // validate startDate
        if(!data.startDate){
            setError('startDate', {
                type: 'pattern',
                message: 'Ngày bắt đầu chăm sóc không được để trống'
            })
            return;
        }
        try{
            await takeCareComboService.createTakeCareComboService(data)
            dispatch(setNoti({type: 'success', message: `Đã gửi yêu cầu chăm sóc cây cho gói chăm sóc "${packageSelect?.name}" thành công`}))
            handleCloseModal()
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

    const disabledDate = (current: dayjs.Dayjs) =>{
        const dateNow = new Date()
        dateNow.setDate(dateNow.getDate() + 2)

        return current && current.valueOf() < dateNow.valueOf()
    }

    const DateRecommend = useMemo(() =>{
        const dateNow = new Date()
        dateNow.setDate(dateNow.getDate() + 3)

        return dayjs(dateNow)
    }, [])

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
                    <PackageDetail pkg={packageSelect} price={(getValues('numOfMonth') * getValues('treeQuantity')) * (packageSelect ? packageSelect.price : 0)} />
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
                                            name='name'
                                            render={({ field }) => (<Input {...field} />)}
                                        />
                                        {errors.name && <ErrorMessage message={errors.name.message} />}
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="Email" required>
                                        <Controller
                                            control={control}
                                            name='email'
                                            render={({ field }) => (<Input {...field} />)}
                                        />
                                        {errors.email && <ErrorMessage message={errors.email.message} />}
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
                                            name='isAtShop'
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
                                            name='treeQuantity'
                                            render={({ field: { value } }) => (<Input type='number' value={value} onChange={(e) =>{
                                                const value = e.target.value ? Number(e.target.value) : 0
                                                if(value > 0){
                                                    setValue('treeQuantity', value)
                                                }else{
                                                    setValue('treeQuantity', 0)
                                                }
                                                trigger('treeQuantity')
                                            }} />)}
                                        />
                                        {errors.treeQuantity && <ErrorMessage message={errors.treeQuantity.message} />}
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="Số tháng chăm sóc" required>
                                        <Controller
                                            control={control}
                                            name='numOfMonth'
                                            render={({ field: { value } }) => (<Input type='number' value={value} onChange={(e) =>{
                                                const value = e.target.value ? Number(e.target.value) : 0
                                                if(value > 0){
                                                    setValue('numOfMonth', value)
                                                }else{
                                                    setValue('numOfMonth', 0)
                                                }
                                                trigger('numOfMonth')
                                            }} />)}
                                        />
                                        {errors.numOfMonth && <ErrorMessage message={errors.numOfMonth.message} />}
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="Ngày bắt đầu chăm sóc" required>
                                        <DatePicker
                                            placeholder='Chọn ngày bắt đầu chăm sóc'
                                            locale={locale}
                                            format={CONSTANT.DATE_FORMAT_LIST}
                                            disabledDate={disabledDate}
                                            style={{width: '100%'}}
                                            onChange={onChange}
                                            defaultValue={DateRecommend}
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