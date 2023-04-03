import { Button, Col, DatePicker, Form, Input, Modal, Row, Select } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import useDispatch from 'app/hooks/use-dispatch';
import { Service, ServiceUpdate, UpdateServiceDetail } from 'app/models/service';
import serviceService from 'app/services/service.service';
import { setNoti } from 'app/slices/notification';
import React, { useEffect, useState } from 'react';
import CurrencyFormat from 'react-currency-format';
import { Controller, useForm } from 'react-hook-form';
import locale from 'antd/es/date-picker/locale/vi_VN'
import Dayjs from 'dayjs'
import { AiOutlinePlusSquare } from 'react-icons/ai';
import './style.scss'
import Description from 'app/components/renderer/description/Description';
import TreeName from 'app/components/renderer/tree-name/TreeName';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import CONSTANT from 'app/utils/constant';
import ErrorMessage from 'app/components/message.tsx/ErrorMessage';
import ListImage from 'app/components/renderer/list-image/ListImage';
import CurrencyInput from 'app/components/renderer/currency-input/CurrencyInput';
import utilGeneral from 'app/utils/general';
import utilDateTime from 'app/utils/date-time';

const schema = yup.object().shape({
    name: yup.string().trim().required('Tên không được để trống').max(50, 'Tối đa 50 ký tự'),
    phone: yup.string().trim().required('Số điện thoại không được để trống').matches(CONSTANT.PHONE_REGEX, 'Số điện thoại không hợp lệ'),
    email: yup.string().trim().required('Email không được để trống').matches(CONSTANT.EMAIL_REGEX, 'Email không hợp lệ'),
    address: yup.string().trim().required('Địa chỉ không được để trống').max(200, 'Tối đa 200 ký tự'),
    rules: yup.string().trim().required('Thông tin hợp đồng không được để trống').max(2000, 'Tối đa 2000 ký tự')
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
    onClose: () => void;
    onSubmit: (service: Service) => void;
}

const UpdateConfirmServiceDetail: React.FC<UpdateConfirmServiceDetailProps> = ({service, onClose, onSubmit}) => {
    const dispatch = useDispatch()

    const { setValue, formState: {errors, isSubmitting, isSubmitted}, control, trigger, handleSubmit, setError, clearErrors, getValues } = useForm<ServiceUpdate>({
        resolver: yupResolver(schema)
    })

    // const [transport, setTransport] = useState(false)

    const [serviceDetail, setServiceDetail] = useState(service)
    const [listQuan, setListQuan] = useState<string[]>([])
    const [listPrice, setListPrice] = useState<string[]>([])

    useEffect(() =>{
        const { id, name, phone, email, address, rewardPointUsed, startDate, endDate, isTransport, rules } = service
        setValue('serviceID', id)
        setValue('name', name)
        setValue('phone', phone)
        setValue('email', email)
        setValue('address', address)
        setValue('transportFee', 0)
        setValue('rewardPointUsed', rewardPointUsed)
        setValue('startDate', startDate)
        setValue('endDate', endDate)

        setValue('rules', rules)
        setValue('isTranSport', isTransport)

        // setTransport(isTransport)

        trigger('startDate')
        trigger('endDate')

    }, [service, setValue, trigger])

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
                <CurrencyFormat value={v} style={{border: listQuan.includes(record.id) ? '1px solid red' : '1px solid #6cdce7'}} 
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
            title: 'Mô tả của bạn',
            key: 'managerDescription',
            dataIndex: 'managerDescription',
            render: (v, record) => (<Input.TextArea value={v} onChange={(e) => {
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
                <CurrencyFormat value={v} style={{border: listPrice.includes(record.id) ? '1px solid red' : '1px solid #6cdce7'}} 
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
            servicePrice: x.servicePrice
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
        const { startDate, endDate, rewardPointUsed, isTranSport } = data
        if(!startDate || !endDate){
            setError('startDate', {
                type: 'pattern',
                message: 'Thời gian chăm sóc không được để trống'
            })
            return;
        }
        if(utilDateTime.getDiff2Days(startDate, endDate) < 7){
            setError('startDate', {
                type: 'pattern',
                message: 'Thời gian chăm sóc không được ít hơn 7 ngày'
            })
            return;
        }

        let totalPrice = 0
        // let transportFee = 0
        for (const item of serviceDetail.serviceDetailList) {
            totalPrice += item.servicePrice
        }
        if(totalPrice - (rewardPointUsed * 10000) < 50000){
            setError('rewardPointUsed', {
                type: 'pattern',
                message: `Số điểm tối đa có thể dùng là ${Math.round(totalPrice - 50000) / 10000}`
            })
            return
        }
        console.log({data})
        
        const body: UpdateServiceDetail = {
            serviceUpdate: data,
            serviceDetailUpdate: serviceDetail.serviceDetailList.map(x => ({
                serviceDetailID: x.id,
                quantity: x.quantity,
                servicePrice: x.servicePrice,
                managerDescription: x.managerDescription
            }))
        }
        try{
            await serviceService.updateServiceDetail(body)
            dispatch(setNoti({type: 'success', message: `Cập nhật thông tin dịch vụ chăm sóc cho đơn hàng "${service.serviceCode}" thành công`}))
            const { name, phone, email, address } = data
            const newService = {
                ...serviceDetail,
                name, phone, email, address
            }
            onSubmit(newService)
        }catch{

        }
    }
    const handleChangeDateRange = (dates, dateStrings) =>{
        if(!dates){
            setValue('startDate', undefined)
            setValue('endDate', undefined)
            return
        }
        const [start, end] = dates
        setValue('startDate', start.toDate())
        setValue('endDate', end.toDate())
        clearErrors('startDate')
    }
    const setPolicy = (item: string) =>{
        const data = getValues('rules') ? (getValues('rules') + `\n- ${item}`) : `- ${item}`
        setValue('rules', data)
        trigger('rules')
    }
    return (
        <Modal
            open
            title={`Cập nhật thông tin dịch vụ chăm sóc cho đơn hàng "${service.serviceCode}"`}
            width='100%'
            onCancel={onClose}
            bodyStyle={{maxHeight: '650px', overflow: 'hidden auto'}}
            footer={null}
        >
            <Table columns={ColumnTree} dataSource={DataSourceTree} pagination={false} />
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
                                    render={({field}) => (<Input {...field} />)}
                                />
                                {errors.name && <ErrorMessage message={errors.name.message} />}
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label='Số điện thoại' required>
                                <Controller
                                    control={control}
                                    name='phone'
                                    render={({field}) => (<Input {...field} />)}
                                />
                                {errors.phone && <ErrorMessage message={errors.phone.message} />}
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label='Email' required>
                                <Controller
                                    control={control}
                                    name='email'
                                    render={({field}) => (<Input {...field} />)}
                                />
                                {errors.email && <ErrorMessage message={errors.email.message} />}
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label='Địa chỉ' required>
                                <Controller
                                    control={control}
                                    name='address'
                                    render={({field}) => (<Input {...field} />)}
                                />
                                {errors.address && <ErrorMessage message={errors.address.message} />}
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label='Phí vận chuyển (VND)'>
                                <Controller
                                    control={control}
                                    name='transportFee'
                                    render={({ field: { value } }) => <CurrencyInput disbaled={getValues('isTranSport')} value={value} min={0} onChange={(e) => utilGeneral.setCurrency(setValue, 'transportFee', e)}/>}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label={`Sử dụng điểm thưởng (Số điểm đang có là ${service.userCurrentPoint})`}>
                                <Controller
                                    control={control}
                                    name='rewardPointUsed'
                                    render={({field: { value }}) => (<Input type='number' min={0} value={value} onChange={(e) =>{
                                        const data = Number(e.target.value || 0) < service.userCurrentPoint ? Number(e.target.value || 0) : service.userCurrentPoint
                                        setValue('rewardPointUsed', data)
                                    }} />)}
                                />
                                {errors.rewardPointUsed && <ErrorMessage message={errors.rewardPointUsed.message} />}
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label='Nơi chăm sóc cây' >
                                <Controller
                                    control={control}
                                    name='isTranSport'
                                    render={({field: { value }}) => (
                                        <Select value={value} onChange={(e) => {
                                            setValue('transportFee', 0)
                                            setValue('isTranSport', e)
                                            trigger('isTranSport')
                                        }}>
                                            <Select.Option value={true}>Chăm sóc tại nhà</Select.Option>
                                            <Select.Option value={false}>Chăm sóc tại cửa hàng</Select.Option>
                                        </Select>
                                    )}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label='Chọn ngày chăm sóc'>
                                <DatePicker.RangePicker 
                                    locale={locale} 
                                    placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
                                    format={dateFormatList}
                                    disabledDate={(current) => current && current.valueOf()  < Date.now()}
                                    onChange={handleChangeDateRange}
                                    style={{width: '100%'}}
                                    defaultValue={[Dayjs(Dayjs(getValues('startDate')).format('DD/MM/YYYY'), 'DD/MM/YYYY'), Dayjs(Dayjs(getValues('endDate')).format('DD/MM/YYYY'), 'DD/MM/YYYY')]}
                                    // clearIcon={null}
                                />
                                {errors.startDate && <ErrorMessage message={errors.startDate.message} />}
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label='Thông tin hợp đồng' required>
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
                                        <Input.TextArea {...field} autoSize={{minRows: 4, maxRows: 10}}></Input.TextArea>
                                    )}
                                />
                                {errors.rules && <ErrorMessage message={errors.rules.message} />}
                            </Form.Item>
                        </Col>
                        <Col span={24} >
                            <div className='btn-form-wrapper'>
                                <Button htmlType='button' disabled={isSubmitting} type='default' className='btn-cancel' size='large' onClick={onClose}>Hủy bỏ</Button>
                                <Button htmlType='submit' loading={isSubmitting} type='primary' className='btn-update' size='large'>
                                    Cập nhật thông tin
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </Form>
            </div>
        </Modal>
    )
}

export default UpdateConfirmServiceDetail