import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Col, DatePicker, Form, Input, Modal, Row, Select } from 'antd';
import locale from 'antd/es/date-picker/locale/vi_VN';
import Table, { ColumnsType } from 'antd/es/table';
import ErrorMessage from 'app/components/message.tsx/ErrorMessage';
import MoneyFormat from 'app/components/money/MoneyFormat';
import CurrencyInput from 'app/components/renderer/currency-input/CurrencyInput';
import Description from 'app/components/renderer/description/Description';
import ListImage from 'app/components/renderer/list-image/ListImage';
import TreeName from 'app/components/renderer/tree-name/TreeName';
import ServiceStatusComp from 'app/components/status/ServiceStatusComp';
import useDispatch from 'app/hooks/use-dispatch';
import { OrderPreview } from 'app/models/cart';
import { Service, ServiceUpdate, UpdateServiceDetail } from 'app/models/service';
import { ShippingFee } from 'app/models/shipping-fee';
import serviceService from 'app/services/service.service';
import { setNoti } from 'app/slices/notification';
import CONSTANT from 'app/utils/constant';
import utilDateTime from 'app/utils/date-time';
import utilGeneral from 'app/utils/general';
import Dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import CurrencyFormat from 'react-currency-format';
import { Controller, useForm } from 'react-hook-form';
import { AiOutlinePlusSquare } from 'react-icons/ai';
import { FaSortAmountUp } from 'react-icons/fa';
import { GiSevenPointedStar } from 'react-icons/gi';
import { GrStatusCriticalSmall } from 'react-icons/gr';
import { MdCreditScore, MdMore, MdSummarize } from 'react-icons/md';
import { SiVirustotal } from 'react-icons/si';
import { TbDiscount, TbTruckDelivery } from 'react-icons/tb';
import * as yup from 'yup';
import './style.scss';

const schema = yup.object().shape({
    name: yup.string().trim().required('Tên không được để trống').max(50, 'Tối đa 50 ký tự'),
    phone: yup.string().trim().required('Số điện thoại không được để trống').matches(CONSTANT.PHONE_REGEX, 'Số điện thoại không hợp lệ'),
    email: yup.string().trim().required('Email không được để trống').matches(CONSTANT.EMAIL_REGEX, 'Email không hợp lệ'),
    address: yup.string().trim().required('Địa chỉ không được để trống').max(200, 'Tối đa 200 ký tự'),
    rules: yup.string().trim().required('Thông tin hợp đồng không được để trống').max(2000, 'Tối đa 2000 ký tự'),
})

const POLICY = [
    'Khi cây chăm sóc tại cửa hàng bị chết, héo, úa, nhiễm bệnh,... Cửa hàng sẽ chịu trách nhiệm hoàn toàn',
    'Khi cây được chăm sóc tại nhà của khách hàng hoặc công ty,... Nếu cây có vấn đề thì cửa hàng chỉ chịu trách nhiệm 20% nếu như k tìm rõ nguyên nhân từ đâu',
    'Cửa hàng sẽ đảm bảo cây ra hoa đúng thời gian bàn giao, nếu như không cửa hàng sẽ đền bù 50% số tiền chăm sóc',
    'Trong quá trình chăm sóc nếu có bất cứ chi phí nào phát sinh thì sẽ báo cho khách hàng biết và 2 bên sẽ cùng nhau bàn bạc giải quyết',
    'Nếu tình trạng cây có vấn đề thì khách hàng phải thông báo cho cửa hàng biết sớm nhất có thể để kịp thời xử lí',
    'Bảo đảm đầy đủ số nhân công, có lý lịch rõ ràng, đảm bảo hoàn thành theo yêu cầu công việc',
    'Trường hợp cửa hàng không thường xuyên hoàn thành khối lượng, chất lượng công việc, không chăm sóc cây phát triển tốt thì khách hàng có quyền chấm dứt hợp đồng trước thời hạn và được hoàn lại 50% giá trị đơn hàng.'
]

const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY', 'DD-MM-YYYY', 'DD-MM-YY'];

interface UpdateConfirmServiceDetailProps{
    service: Service;
    shipping: ShippingFee[]
    isOnlyView: boolean;
    onClose: () => void;
    onSubmit: (service: Service) => void;
}

const UpdateConfirmServiceDetail: React.FC<UpdateConfirmServiceDetailProps> = ({service, shipping, isOnlyView, onClose, onSubmit}) => {
    const dispatch = useDispatch()

    const { setValue, formState: {errors, isSubmitting}, control, trigger, handleSubmit, setError, clearErrors, getValues } = useForm<ServiceUpdate>({
        defaultValues: {
            startDate: service.startDate,
            endDate: service.endDate
        },
        resolver: yupResolver(schema)
    })

    // const [transport, setTransport] = useState(false)

    const [serviceDetail, setServiceDetail] = useState(service)
    const [listQuan, setListQuan] = useState<string[]>([])
    const [listPrice, setListPrice] = useState<string[]>([])

    useEffect(() =>{
        const { id, name, phone, email, address, rewardPointUsed, startDate, endDate, isTransport, rules, districtID, transportFee } = service
        setValue('serviceID', id)
        setValue('name', name)
        setValue('phone', phone)
        setValue('email', email)
        setValue('address', address)
        setValue('transportFee', transportFee || 0)
        setValue('rewardPointUsed', rewardPointUsed || 0)

        setValue('rules', rules || '')
        setValue('isTranSport', isTransport || false)

        setValue('districtID', districtID)
        setValue('startDate', startDate)
        setValue('endDate', endDate)

        // setTransport(isTransport)

        trigger()

    }, [service, setValue, trigger, isOnlyView])

    const ColumnTree: ColumnsType<any> = [
        {
            title: 'Tên cây',
            key: 'treeName',
            dataIndex: 'treeName',
            render: (v) => (<TreeName name={v} />)
        },
        {
            title: 'Số lượng',
            key: 'quantity',
            dataIndex: 'quantity',
            render: (v, record) => (
                <CurrencyFormat disabled={isOnlyView} value={v} style={{border: listQuan.includes(record.id) ? '1px solid red' : '1px solid #6cdce7'}} 
                    onValueChange={(values) => handleChangeTree(values, record.id, 'quantity')} className='currency-input-field'
                />
            )
        },
        {
            title: 'Hình ảnh',
            key: 'imgUrls',
            dataIndex: 'imgUrls',
            align: 'center',
            render: (v) => (<ListImage listImgs={v} />)
        },
        {
            title: 'Mô tả của khách hàng',
            key: 'description',
            dataIndex: 'description',
            render: (v) => (<Description content={v}  />)
        },
        {
            title: 'Mô tả của kỹ thuật viên',
            key: 'managerDescription',
            dataIndex: 'managerDescription',
            render: (v, record) => (<Input.TextArea disabled={isOnlyView} value={v} onChange={(e) => {
                const value = e.target.value
                const index = serviceDetail.serviceDetailList.findIndex(x => x.id === record.id)
                serviceDetail.serviceDetailList[index].managerDescription = value
                setServiceDetail({...serviceDetail}) 
            }} autoSize={{minRows: 4, maxRows: 6}} ></Input.TextArea>)
        },
        {
            title: 'Thành tiền (VND)',
            key: 'servicePrice',
            dataIndex: 'servicePrice',
            render: (v, record) => (
                <CurrencyFormat value={v} disabled={isOnlyView} style={{border: listPrice.includes(record.id) ? '1px solid red' : '1px solid #6cdce7'}} 
                onValueChange={(values) => handleChangeTree(values, record.id, 'price')} className='currency-input-field' thousandSeparator
                />
            )
        },
    ]
    const handleChangeTree = (values: CurrencyFormat.Values, serviceId: string, type: 'quantity' | 'price') =>{
        const { value } = values
        const index = serviceDetail.serviceDetailList.findIndex(x => x.id === serviceId)
        if(type === 'quantity'){
            serviceDetail.serviceDetailList[index].quantity = value ? Number(value) : 0
        }else if(type === 'price'){
            serviceDetail.serviceDetailList[index].servicePrice = value ? Number(value) : 0
        }
        setServiceDetail({...serviceDetail})
        isValidDataTree()
    }
    const DataSourceTree = serviceDetail.serviceDetailList.map((x, index) => ({
            key: String(index + 1),
            id: x.id,
            treeName: x.treeName,
            quantity: x.quantity,
            imgUrls: x.imgUrls,
            description: x.description,
            managerDescription: x.managerDescription,
            servicePrice: x.servicePrice,
        }))
    
    
    const isValidDataTree = () =>{
        let result = true;
        const quan: string[] = []
        const price: string[] = []

        for (const item of serviceDetail.serviceDetailList) {
            const quantity = item.quantity
            const servicePrice = item.servicePrice

            if(quantity === 0){
                quan.push(item.id)
                result = false
            }
            if(servicePrice < 1000){
                price.push(item.id)
                result = false
            }
        }
        setListQuan(quan)
        setListPrice(price)

        return result
    }
    const handleSubmitForm = async (data: ServiceUpdate) =>{
        if(!isValidDataTree()){
            dispatch(setNoti({type: 'warning', message: 'Vui lòng điền đầy đủ thông tin của cây cần chăm sóc. Số lượng, giá tiền...'}))
            return;
        }

        const { rewardPointUsed } = data
        if(!data.startDate || !data.endDate){
            setError('startDate', {
                type: 'pattern',
                message: 'Thời gian chăm sóc không được để trống'
            })
            return;
        }
        if(utilDateTime.getDiff2Days(data.startDate, data.endDate) < 7){
            setError('startDate', {
                type: 'pattern',
                message: 'Thời gian chăm sóc không được ít hơn 7 ngày'
            })
            return;
        }
        if(utilDateTime.getDiff2Days(new Date(), data.startDate) > 14){
            setError('startDate', {
                message: 'Thời gian đặt trước lịch chăm sóc tối đa 14 ngày',
                type: 'pattern'
            })
            return;
        }

        const { transportFee, totalPriceOrder } = OrderPreview()
        
        // console.log({totalPrice})
        // console.log(totalPrice < 50000)
        if((transportFee + totalPriceOrder) - (rewardPointUsed * 10000) < 50000){
            setError('rewardPointUsed', {
                type: 'pattern',
                message: `Số điểm tối đa có thể dùng là ${Math.round((transportFee + totalPriceOrder) - 50000) / 10000}`
            })
            return
        }
        
        const body: UpdateServiceDetail = {
            serviceUpdate: data,
            serviceDetailUpdate: serviceDetail.serviceDetailList.map(x => ({
                serviceDetailID: x.id,
                quantity: x.quantity,
                servicePrice: x.servicePrice,
                managerDescription: x.managerDescription,
            }))
        }
        try{
            await serviceService.updateServiceDetail(body)
            dispatch(setNoti({type: 'success', message: `Cập nhật thông tin dịch vụ chăm sóc cho đơn hàng "${service.serviceCode}" thành công`}))
            const { name, phone, email, address, isTranSport, transportFee, districtID, startDate, endDate, rewardPointUsed, rules } = data
            
            const serviceSubmit: Service = {
                ...service,
                name, phone, email, address, isTransport: isTranSport, transportFee, districtID, startDate, endDate, rewardPointUsed, rules
            }
            onSubmit(serviceSubmit)
        }catch{
            dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
        }
    }
    const handleChangeDateRange = (dates, dateStrings) =>{
        clearPoint()
        if(!dates){
            setValue('startDate', undefined)
            setValue('endDate', undefined)
            return
        }
        const [start, end] = dates
        setValue('startDate', utilDateTime.dayjsToLocalString(start))
        setValue('endDate', utilDateTime.dayjsToLocalString(end))
        clearErrors('startDate')
    }
    const setPolicy = (item: string) =>{
        if(isOnlyView) return;
        const data = getValues('rules') ? (getValues('rules') + `\n- ${item}`) : `- ${item}`
        setValue('rules', data)
        trigger('rules')
    }
    const clearPoint = () =>{
        setValue('rewardPointUsed', 0)
        trigger('rewardPointUsed')
    }

    const OrderPreview = () =>{
        const { startDate, endDate, transportFee, rewardPointUsed } = getValues()
        // console.log(getValues())
        let diff = 0

        if(!startDate || !endDate) {
            diff = 0
        }else{
            diff = utilDateTime.getDiff2Days(startDate, endDate)
        }

        let totalPriceOrder = 0

        for (const item of serviceDetail.serviceDetailList) {
            totalPriceOrder += item.servicePrice
        }
        
        // totalPriceOrder = totalPriceOrder * diff

        const totalPricePayment = (totalPriceOrder + transportFee) - (rewardPointUsed * CONSTANT.POINT_TO_MONEY)

        const deposit = totalPricePayment * 0.5

        const data: OrderPreview = {
            rewardPoint: Math.ceil(totalPriceOrder / 100000),
            deposit,
            totalPriceOrder,
            transportFee,
            discountAmount: rewardPointUsed * CONSTANT.POINT_TO_MONEY,
            totalPricePayment: (totalPriceOrder + transportFee) - (rewardPointUsed * CONSTANT.POINT_TO_MONEY),
            pointUsed: rewardPointUsed,
            totalRentDays: diff
        }
        return data
    }
    const MaxPointCanUse = () =>{
        const { totalPriceOrder, transportFee } = OrderPreview()

        // console.log({ totalPriceOrder, transportFee, totalRentDays })

        const totalPricePayment = totalPriceOrder + transportFee

        const result = Math.floor((totalPricePayment - 50000) / 10000) * 10

        return result >= 0 ? result : 0
    }

    return (
        <Modal
            open
            title={`Cập nhật thông tin dịch vụ chăm sóc cho đơn hàng "${service.serviceCode}"`}
            width='100%'
            onCancel={onClose}
            bodyStyle={{maxHeight: '750px', overflow: 'hidden auto'}}
            footer={null}
        >
            <Table columns={ColumnTree} dataSource={DataSourceTree} pagination={false} />
            <div className="order-infor">
                <h3 className='order-infor-title'>Thông tin yêu cầu</h3>
                <Row gutter={[24, 24]}>
                    <Col span={6}>
                        <div className='order-infor-item'>
                            <div className="left">
                                <GrStatusCriticalSmall size={25} color='#00a76f' /> 
                                <span>Trạng thái yêu cầu</span>
                            </div>
                            <div className="right">
                                <span className='right-content'>
                                    <ServiceStatusComp status={service.status} />
                                </span>
                            </div>
                        </div>
                    </Col>
                    <Col span={6}>
                        <div className='order-infor-item'>
                            <div className="left">
                                <MdSummarize size={25} color='#00a76f' /> 
                                <span>Tổng số ngày chăm sóc</span>
                            </div>
                            <div className="right">
                                <span className='right-content'>{OrderPreview().totalRentDays}</span>
                            </div>
                        </div>
                    </Col>
                    <Col span={6}>
                        <div className='order-infor-item'>
                            <div className="left">
                                <MdCreditScore size={25} color='#00a76f' />
                                <span>Số điểm đã dùng</span>
                            </div>
                            <div className="right">
                                <span className='right-content'>{OrderPreview().pointUsed}</span>
                            </div>
                        </div>
                    </Col>
                    <Col span={6}>
                        <div className='order-infor-item'>
                            <div className="left">
                                <MdMore size={25} color='#00a76f' />
                                <span>Tích điểm</span>
                            </div>
                            <div className="right">
                                <span className='right-content'>{OrderPreview().rewardPoint}</span>
                            </div>
                        </div>
                    </Col>
                    <Col span={6}>
                        <div className='order-infor-item'>
                            <div className="left">
                                <SiVirustotal size={25} color='#00a76f' />
                                <span>Tổng tiền hàng</span>
                            </div>
                            <div className="right">
                                <MoneyFormat value={OrderPreview().totalPriceOrder} isHighlight color='Light Blue' />
                            </div>
                        </div>
                    </Col>
                    <Col span={6}>
                        <div className='order-infor-item'>
                            <div className="left">
                                <TbTruckDelivery size={25} color='#00a76f' />
                                <span>Phí vận chuyển</span>
                            </div>
                            <div className="right">
                                <MoneyFormat value={OrderPreview().transportFee || 0} isHighlight color='Default' />
                            </div>
                        </div>
                    </Col>
                    <Col span={6}>
                        <div className='order-infor-item'>
                            <div className="left">
                                <TbDiscount size={25} color='#00a76f' />
                                <span>Tiền được giảm</span>
                            </div>
                            <div className="right">
                                <MoneyFormat value={OrderPreview().discountAmount || 0} isHighlight color='Green' />
                            </div>
                        </div>
                    </Col>
                    <Col span={6}>
                        <div className='order-infor-item'>
                            <div className="left">
                                <FaSortAmountUp size={25} color='#00a76f' />
                                <span>Tổng tiền thanh toán</span>
                            </div>
                            <div className="right">
                                <MoneyFormat value={(OrderPreview().totalPricePayment && OrderPreview().totalPricePayment > 0) ? OrderPreview().totalPricePayment : 0} isHighlight color='Blue' />
                            </div>
                        </div>
                    </Col>
                    <Col span={6}>
                        <div className='order-infor-item'>
                            <div className="left">
                                <GiSevenPointedStar size={25} color='#00a76f' />
                                <span>Tiền cọc</span>
                            </div>
                            <div className="right">
                                <MoneyFormat value={(OrderPreview().deposit && OrderPreview().deposit > 0) ? OrderPreview().deposit : 0} isHighlight color='Orange' />
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
            <div className="user-infor-form">
                <h3 className='form-title'>Xác nhận thông tin của khách hàng</h3>
                <Form
                    layout='vertical'
                    onFinish={handleSubmit(handleSubmitForm)}
                >
                    <Row gutter={[24, 24]}>
                        <Col span={8}>
                            <Form.Item label='Tên' required>
                                <Controller
                                    control={control}
                                    name='name'
                                    render={({field}) => (<Input disabled={isOnlyView} {...field} />)}
                                />
                                {(errors.name && !isOnlyView) && <ErrorMessage message={errors.name.message} />}
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label='Số điện thoại' required>
                                <Controller
                                    control={control}
                                    name='phone'
                                    render={({field}) => (<Input disabled={isOnlyView} {...field} />)}
                                />
                                {(errors.phone && !isOnlyView) && <ErrorMessage message={errors.phone.message} />}
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label='Email' required>
                                <Controller
                                    control={control}
                                    name='email'
                                    render={({field}) => (<Input disabled={isOnlyView} {...field} />)}
                                />
                                {(errors.email && !isOnlyView) && <ErrorMessage message={errors.email.message} />}
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label='Nơi chăm sóc cây' >
                                <Controller
                                    control={control}
                                    name='isTranSport'
                                    render={({field: { value }}) => (
                                        <Select disabled={isOnlyView} value={value} onChange={(e) => {
                                            setValue('isTranSport', e)
                                            trigger('isTranSport')
                                            clearPoint()
                                        }}>
                                            <Select.Option value={true}>Chăm sóc tại nhà</Select.Option>
                                            <Select.Option value={false}>Chăm sóc tại cửa hàng</Select.Option>
                                        </Select>
                                    )}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label='Vị trí' required>
                                <Controller
                                    control={control}
                                    name='districtID'
                                    render={({field}) => (
                                        <Select disabled={isOnlyView} {...field}>
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
                        <Col span={8}>
                            <Form.Item label='Địa chỉ' required>
                                <Controller
                                    control={control}
                                    name='address'
                                    render={({field}) => (<Input disabled={isOnlyView} {...field} />)}
                                />
                                {(errors.address && !isOnlyView) && <ErrorMessage message={errors.address.message} />}
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label='Phí vận chuyển (VND)'>
                                <Controller
                                    control={control}
                                    name='transportFee'
                                    render={({ field: { value } }) => <CurrencyInput disbaled={isOnlyView} value={value} min={0} onChange={(e) => {
                                        clearPoint()
                                        utilGeneral.setCurrency(setValue, 'transportFee', e)
                                    }}/>}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label='Chọn ngày chăm sóc'>
                                <DatePicker.RangePicker 
                                    locale={locale} 
                                    placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
                                    format={dateFormatList}
                                    // disabledDate={(current) => current && current.valueOf()  < Date.now()}
                                    onChange={handleChangeDateRange}
                                    style={{width: '100%'}}
                                    defaultValue={[Dayjs(Dayjs(getValues('startDate')).format('DD/MM/YYYY'), 'DD/MM/YYYY'), Dayjs(Dayjs(getValues('endDate')).format('DD/MM/YYYY'), 'DD/MM/YYYY')]}
                                    // clearIcon={null}
                                    disabled={isOnlyView}
                                />
                                {(errors.startDate && !isOnlyView) && <ErrorMessage message={errors.startDate.message} />}
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label={isOnlyView ? 'Số điểm sử dụng' : `(Số điểm hiện tại ${service.userCurrentPoint}). Điểm có thể dùng (${MaxPointCanUse() > service.userCurrentPoint ? service.userCurrentPoint : MaxPointCanUse()}). Điểm khách hàng đã dùng (${service.rewardPointUsed})`}>
                                <Controller
                                    control={control}
                                    name='rewardPointUsed'
                                    render={({field: { value }}) => (<Input disabled={isOnlyView} type='number' min={0} value={value} onChange={(e) =>{
                                        const data = Number(e.target.value || 0) < service.userCurrentPoint ? Number(e.target.value || 0) : service.userCurrentPoint
                                        if(data <= MaxPointCanUse()){
                                            setValue('rewardPointUsed', data >= 0 ? data : 0)
                                        }else{
                                            setValue('rewardPointUsed', MaxPointCanUse())
                                        }
                                        trigger('rewardPointUsed')
                                    }} />)}
                                />
                                {(errors.rewardPointUsed && !isOnlyView) && <ErrorMessage message={errors.rewardPointUsed.message} />}
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label='Thông tin cam kết hai bên' required>
                                <div className='policy-wrapper'>
                                    {
                                        POLICY.map((item, index) => (
                                            <div className="policy-item" key={index}>
                                                <AiOutlinePlusSquare size={28} color='#0099FF' className='icon' onClick={() => setPolicy(item)} />
                                                <span>{item}</span>
                                            </div>
                                        ))
                                    }
                                </div>
                                <Controller
                                    control={control}
                                    name='rules'
                                    render={({field}) => (
                                        <Input.TextArea disabled={isOnlyView} {...field} autoSize={{minRows: 4, maxRows: 10}}></Input.TextArea>
                                    )}
                                />
                                {(errors.rules && !isOnlyView) && <ErrorMessage message={errors.rules.message} />}
                            </Form.Item>
                        </Col>
                        <Col span={24} >
                            <div className='btn-form-wrapper'>
                                <Button htmlType='button' disabled={isSubmitting} type='default' className='btn-cancel' size='large' onClick={onClose}>Hủy bỏ</Button>
                                {
                                    isOnlyView ? 
                                    <Button htmlType='button' loading={isSubmitting} type='primary' className='btn-update' size='large' onClick={onClose}>
                                        Đóng
                                    </Button> : 
                                    <Button htmlType='submit' loading={isSubmitting} type='primary' className='btn-update' size='large'>
                                        Cập nhật thông tin
                                    </Button>
                                }
                            </div>
                        </Col>
                    </Row>
                </Form>
            </div>
        </Modal>
    )
}

export default UpdateConfirmServiceDetail