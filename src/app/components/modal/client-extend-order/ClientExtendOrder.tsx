import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Col, DatePicker, Form, Image, Input, Modal, Row, Select, Table } from 'antd'
import locale from 'antd/es/date-picker/locale/vi_VN'
import { ColumnsType } from 'antd/es/table'
import ErrorMessage from 'app/components/message.tsx/ErrorMessage'
import MoneyFormat from 'app/components/money/MoneyFormat'
import useDispatch from 'app/hooks/use-dispatch'
import useSelector from 'app/hooks/use-selector'
import { OrderPreview, OrderUserInfor } from 'app/models/cart'
import { OrderCreate, RentOrderList } from 'app/models/order'
import { ShippingFee } from 'app/models/shipping-fee'
import { setNoti } from 'app/slices/notification'
import CONSTANT from 'app/utils/constant'
import Dayjs from 'dayjs'
import 'dayjs/locale/vi'
import React, { useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { BiPlus } from 'react-icons/bi'
import { CiSquareRemove } from 'react-icons/ci'
import { FaMoneyBillAlt } from 'react-icons/fa'
import { GrFormSubtract } from 'react-icons/gr'
import * as yup from 'yup'
import './style.scss'
import orderService from 'app/services/order.service'

const schema = yup.object().shape({
    recipientAddress: yup.string().when("isTransport", {
        is: true,
        then: yup.string().trim().required('Địa chỉ không được để trống').max(500, 'Tối đa 500 ký tự')
    }),
    recipientName: yup.string().trim().required('Tên không được để trống').max(200, 'Tối đa 200 ký tự'),
    recipientPhone: yup.string().trim().required('Số điện thoại không được để trống').matches(CONSTANT.PHONE_REGEX, 'Số điện thoại không hợp lệ'),
    isTransport: yup.boolean(),
})

interface ClientExtendOrderProps{
    rentOrderList: RentOrderList
    shipping: ShippingFee[]
    onClose: () => void
    onExtend: () => void
}

const ClientExtendOrder: React.FC<ClientExtendOrderProps> = ({rentOrderList, shipping, onClose, onExtend}) => {
    const dispatch = useDispatch();
    const userSate = useSelector(state => state.userInfor)

    const startDate = new Date(rentOrderList.endRentDate)
    startDate.setDate(startDate.getDate() + 1);

    const endDate = new Date(rentOrderList.endRentDate)
    endDate.setDate(endDate.getDate() + 7);

    const { control, formState: { errors, isSubmitting }, handleSubmit, setValue, getValues, trigger, clearErrors, setError } = useForm<OrderUserInfor>({
        defaultValues:{
            startDateRent: startDate,
            endDateRent: endDate,
            rewardPointUsed: 0,
            rentOrderGroupID: rentOrderList.rentOrderGroupID
        },
        resolver: yupResolver(schema)
    })

    const [rentOrderListData, setRentOrderListData] = useState(rentOrderList)
    const [idRemove, setIdRemove] = useState('')
    const [historyQuantities, setHistoryQuantites] = useState<number[]>([])

    useEffect(() =>{
        if(!userSate.token) return;

        const { address, fullName, phone, districtID } = userSate.user

        setValue('recipientAddress', address)
        setValue('recipientName', fullName)
        setValue('recipientPhone', phone)
        setValue('shippingID', districtID)
        setValue('isTransport', rentOrderList.isTransport)

        trigger()
    }, [setValue, trigger, userSate, rentOrderList])
   
    useEffect(() =>{
        const historyQuantites = rentOrderList.rentOrderDetailList.map(x => x.quantity)
        setHistoryQuantites(historyQuantites)
    }, [rentOrderList])

    const Column: ColumnsType<any> = [
        {
            title: '#',
            key: '#',
            dataIndex: '#',
            align: 'center',
            render: (v, _, index) => (<span style={{color: '#00a76f'}}>{index + 1}</span>)
        },
        {
            title: 'Hình ảnh',
            key: 'imgURL',
            dataIndex: 'imgURL',
            align: 'center',
            render: (v) => (
                <Image
                    width={100}
                    height={100}
                    src={v}
                    className='img-preview'
                />
            )
        },
        {
            title: 'Tên sản phẩm',
            key: 'productItemName',
            dataIndex: 'productItemName',
            // render: (v) => (<TreeName name={v} />)
        },
        {
            title: 'Kích thước',
            key: 'sizeName',
            dataIndex: 'sizeName',
            align: 'center',
            render: (v) => (v)
        },
        {
            title: 'Đơn vị',
            key: 'sizeName',
            dataIndex: 'sizeName',
            align: 'center',
            render: () => ('Cây/ngày')
        },
        {
            title: 'Giá tiền',
            key: 'rentPricePerUnit',
            dataIndex: 'rentPricePerUnit',
            align: 'right',
            render: (v) => (<MoneyFormat value={v} color='Light Blue' />)
        },
        {
            title: 'Số lượng',
            key: 'quantity',
            dataIndex: 'quantity',
            align: 'center',
            render: (v, record) => (
                <div className="quantity-box">
                    <button className="decrease" onClick={() => controlRent(record.id, '-')} >
                        <GrFormSubtract />
                    </button>
                    <input type="number" value={record.quantity} disabled  />
                    <button className="increase" onClick={() => controlRent(record.id, '+')} >
                        <BiPlus />
                    </button>
                </div>
            )
        },
        {
            title: 'Tổng cộng',
            key: 'totalPrice',
            dataIndex: 'totalPrice',
            align: 'right',
            render: (_, record) => (<MoneyFormat value={record.rentPricePerUnit * record.quantity} color='Blue' />)
        },
        {
            title: 'Xóa',
            key: '#',
            dataIndex: '#',
            align: 'center',
            render: (_, record) => (<CiSquareRemove size={30} color='#FF3333' style={{cursor: 'pointer'}} onClick={() => setIdRemove(record.id)} />)
        }
    ]

    const DataSource = useMemo(() =>{
        return rentOrderListData.rentOrderDetailList.map((x, index) => ({
            key: String(index + 1),
            id: x.id,
            totalPrice: x.totalPrice,
            quantity: x.quantity,
            rentPricePerUnit: x.rentPricePerUnit,
            sizeName: x.sizeName,
            productItemName: x.productItemName,
            imgURL: x.imgURL,
        }))
    }, [rentOrderListData])

    const handleRemoveItem = () =>{
        const index = rentOrderListData.rentOrderDetailList.findIndex(x => x.id === idRemove)
        rentOrderListData.rentOrderDetailList.splice(index, 1)
        setRentOrderListData({...rentOrderListData})

        historyQuantities.slice(index, 1)
        setHistoryQuantites([...historyQuantities])

        handleCloseModal()
    }
    const controlRent = (id: string, common: string) =>{
        const index = rentOrderListData.rentOrderDetailList.findIndex(x => x.id === id)
        const item = rentOrderListData.rentOrderDetailList[index]

        const historyQuantitiesAtIndex = historyQuantities[index]

        if(common === '-'){
            if(item.quantity === 1) return
            rentOrderListData.rentOrderDetailList[index].quantity = rentOrderListData.rentOrderDetailList[index].quantity - 1
            setRentOrderListData({...rentOrderListData})
        }else{
            if(item.quantity === historyQuantitiesAtIndex){
                dispatch(setNoti({type: 'warning', message: 'Không thể tăng số lượng cây hơn số cây bạn đã thuê trước đó'})) 
            }else{
                rentOrderListData.rentOrderDetailList[index].quantity = rentOrderListData.rentOrderDetailList[index].quantity + 1
                setRentOrderListData({...rentOrderListData})
            }
        }
    }
    const handleSubmitForm = async (data: OrderUserInfor) =>{
        const { startDateRent, endDateRent} = data
        // validate right here
        if(!startDateRent || !endDateRent){
            setError('startDateRent', {
                type: 'pattern',
                message: 'Thời gian thuê không được để trống'
            })
            return;
        }
        const start = Dayjs(startDateRent)
        const end = Dayjs(endDateRent)
        if(start.diff(end, 'days') === 0){
            setError('startDateRent', {
                type: 'pattern',
                message: 'Chọn khoảng thời gian thuê ít nhất 1 ngày'
            })
            return;
        }

        const { isTransport, recipientAddress, recipientName, recipientPhone, rewardPointUsed, shippingID, rentOrderGroupID } = data

        const body: OrderCreate = {
            isTransport, recipientAddress, recipientName, recipientPhone, rewardPointUsed, shippingID, endDateRent, startDateRent, rentOrderGroupID,
            itemList: rentOrderListData.rentOrderDetailList.map(x => ({productItemDetailID: x.productItemDetail.id, quantity: x.quantity}))
        }
        try{
            await orderService.createOrder(body)
            dispatch(setNoti({type: 'success', message: 'Gia hạn đơn hàng thành công'}))
            onExtend()
        }catch{

        }

    }

    const handleChangeDateRange = (dates, dateStrings)=>{
        if(!dates){
            setValue('startDateRent', undefined)
            setValue('endDateRent', undefined)
        }else{
            const [start, end] = dates
            setValue('startDateRent', start.toDate())
            setValue('endDateRent', end.toDate())
            clearErrors('startDateRent')
        }
        clearPoint()
    }

    const handleCloseModal = () =>{
        setIdRemove('')
    }
    const getDiffDays = (startDate?: Date, endDate?: Date) => {
        if(!startDate || !endDate) return 0

        const start = Dayjs(startDate)
        const end = Dayjs(endDate)

        return end.diff(start, 'days')
    }

    const OrderPreview = () =>{
        const { rewardPointUsed, shippingID, isTransport, startDateRent, endDateRent } = getValues()

        const [shippingFeeTemp] = shipping.filter(x => x.districtID === shippingID)

        const totalRentDays = getDiffDays(startDateRent, endDateRent)

        let totalPriceOrder = 0
        let transportFee = 0

        for (const item of rentOrderListData.rentOrderDetailList) {
            totalPriceOrder += item.quantity * item.rentPricePerUnit * totalRentDays
            transportFee += ((shippingFeeTemp ? shippingFeeTemp.feeAmount : 0) + (rentOrderListData.transportFee * item.quantity))
        }

        if(!isTransport){
            transportFee = 0
        }
        
        const totalPricePayment = (totalPriceOrder + transportFee) - (rewardPointUsed * CONSTANT.POINT_TO_MONEY)

        const rewardPoint = Math.ceil(totalPricePayment / CONSTANT.REWARD_POINT_RATE)

        const deposit = totalPricePayment <= CONSTANT.RENT_DEPOSIT_RATE ? 0 : Math.ceil(totalPricePayment * CONSTANT.DEPOSIT_MIN_RATE)

        const data: OrderPreview = {
            rewardPoint,
            deposit,
            totalPriceOrder,
            transportFee,
            discountAmount: rewardPointUsed * CONSTANT.POINT_TO_MONEY,
            totalPricePayment: (totalPriceOrder + transportFee) - (rewardPointUsed * CONSTANT.POINT_TO_MONEY),
            pointUsed: rewardPointUsed,
            totalRentDays: totalRentDays || 0
        }
        return data
    }
    const MaxPointCanUse = () => {
        const { isTransport } = getValues()
        const { currentPoint } = userSate.user

        const { totalPriceOrder, transportFee } = OrderPreview()

        if(totalPriceOrder <= CONSTANT.MIN_ORDER) return 0

        let result = 0

        // tại nhà
        if(isTransport){
            const total = totalPriceOrder + transportFee - CONSTANT.MIN_ORDER
            result = Math.floor(total / CONSTANT.MONEY_RATE) * 10
        }else{
            const total = totalPriceOrder - 50000
            result = Math.floor(total / CONSTANT.MONEY_RATE) * 10
        }

        return currentPoint > result ? result : currentPoint
    }
    const clearPoint = () =>{
        setValue('rewardPointUsed', 0)
    }
    return (
        <>
            <Modal
                open
                title={`Gian hạn đơn hàng ${rentOrderList.orderCode}`}
                onCancel={onClose}
                width={1200}
                footer={false}
            >
                <Table dataSource={DataSource} columns={Column} pagination={false} />
                <div className="extend-rent-order">
                    <h3 className='title-form'>Thông tin gia hạn</h3>
                    <div className="left">
                        <div className="left-field">
                            <div className="label">
                                <FaMoneyBillAlt color='#00a76f' size={25} />
                                <span className='title'>Số điểm đã dùng</span>
                            </div>
                            <div className="content">
                                <span>{OrderPreview().pointUsed}</span>
                            </div>
                        </div>
                        <div className="left-field">
                            <div className="label">
                                <FaMoneyBillAlt color='#00a76f' size={25} />
                                <span className='title'>Tích điểm</span>
                            </div>
                            <div className="content">
                                <span>{OrderPreview().rewardPoint}</span>
                            </div>
                        </div>
                        <div className="left-field">
                            <div className="label">
                                <FaMoneyBillAlt color='#00a76f' size={25} />
                                <span className='title'>Tổng số ngày thuê</span>
                            </div>
                            <div className="content">
                                <span>{OrderPreview().totalRentDays}</span>
                            </div>
                        </div>
                        <div className="left-field">
                            <div className="label">
                                <FaMoneyBillAlt color='#00a76f' size={25} />
                                <span className='title'>Tổng tiền hàng</span>
                            </div>
                            <div className="content">
                                <span><MoneyFormat value={OrderPreview().totalPriceOrder} /></span>
                            </div>
                        </div>
                        <div className="left-field">
                            <div className="label">
                                <FaMoneyBillAlt color='#00a76f' size={25} />
                                <span className='title'>Phí vận chuyển</span>
                            </div>
                            <div className="content">
                                <span><MoneyFormat value={OrderPreview().transportFee} /></span>
                            </div>
                        </div>
                        <div className="left-field">
                            <div className="label">
                                <FaMoneyBillAlt color='#00a76f' size={25} />
                                <span className='title'>Tiền được giảm</span>
                            </div>
                            <div className="content">
                                <span><MoneyFormat value={OrderPreview().discountAmount} /></span>
                            </div>
                        </div>
                        <div className="left-field">
                            <div className="label">
                                <FaMoneyBillAlt color='#00a76f' size={25} />
                                <span className='title'>Tổng tiền thanh toán</span>
                            </div>
                            <div className="content">
                                <span><MoneyFormat value={OrderPreview().totalPricePayment} isHighlight color='Blue' /></span>
                            </div>
                        </div>
                        <div className="left-field">
                            <div className="label">
                                <FaMoneyBillAlt color='#00a76f' size={25} />
                                <span className='title'>Tiền cọc</span>
                            </div>
                            <div className="content">
                                <span><MoneyFormat value={OrderPreview().deposit} isHighlight color='Orange' /></span>
                            </div>
                        </div>
                    </div>
                    <div className="right">
                        <Form
                            layout='vertical'
                            onFinish={handleSubmit(handleSubmitForm)}
                        >
                            <Row gutter={[12, 12]}>
                                <Col span={12}>
                                    <Form.Item label='Tên người nhận' required>
                                        <Controller 
                                            control={control}
                                            name='recipientName'
                                            render={({ field: { value } }) => <Input value={value} onChange={(e) => {
                                                setValue('recipientName', e.target.value)
                                                trigger('recipientName')
                                            }} />}
                                        />
                                        {errors.recipientName && <ErrorMessage message={errors.recipientName.message} />}
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label='Số điện thoại' required>
                                        <Controller 
                                            control={control}
                                            name='recipientPhone'
                                            render={({ field: { value } }) => <Input value={value} onChange={(e) => {
                                                setValue('recipientPhone', e.target.value)
                                                trigger('recipientPhone')
                                            }}/>}
                                        />
                                        {errors.recipientPhone && <ErrorMessage message={errors.recipientPhone.message} />}
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label='Chọn nơi nhận cây'>
                                        <Controller 
                                            control={control}
                                            name='isTransport'
                                            render={({ field: { value } }) => (
                                                <Select value={value} onChange={(e) => {
                                                    setValue('isTransport', e)
                                                    trigger('isTransport')
                                                    clearPoint()
                                                }}>
                                                    <Select.Option value={true}>Tại nhà riêng</Select.Option>
                                                    <Select.Option value={false}>Tại cửa hàng</Select.Option>
                                                </Select>
                                            )}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label='Chọn thời gian thuê' required>
                                        <DatePicker.RangePicker 
                                            locale={locale}
                                            placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
                                            format={CONSTANT.DATE_FORMAT_LIST}
                                            disabledDate={(current) => current && current.valueOf()  < startDate.getTime()}
                                            defaultValue={[Dayjs(Dayjs(getValues('startDateRent')).format('DD/MM/YYYY'), 'DD/MM/YYYY'), Dayjs(Dayjs(getValues('endDateRent')).format('DD/MM/YYYY'), 'DD/MM/YYYY')]}
                                            onChange={handleChangeDateRange}
                                            disabled={[true, false]}
                                        />
                                        {errors.startDateRent && <ErrorMessage message={errors.startDateRent.message} />}
                                    </Form.Item>
                                </Col>
                                {
                                    getValues('isTransport') &&
                                    <>
                                        <Col span={12}>
                                            <Form.Item label='Nơi nhận' required>
                                                <Controller 
                                                    control={control}
                                                    name='shippingID'
                                                    render={({ field: { value} }) => (
                                                        <Select value={value} onChange={(e) => {
                                                            setValue('shippingID', e)
                                                            trigger()
                                                            clearPoint()
                                                        }}>
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
                                                {errors.recipientAddress && <ErrorMessage message={errors.recipientAddress.message} />}
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item label='Địa chỉ cụ thể' required>
                                                <Controller 
                                                    control={control}
                                                    name='recipientAddress'
                                                    render={({ field: { value} }) => <Input value={value} onChange={(e) => {
                                                        setValue('recipientAddress', e.target.value)
                                                        trigger('recipientAddress')
                                                    }} />}
                                                />
                                                {errors.recipientAddress && <ErrorMessage message={errors.recipientAddress.message} />}
                                            </Form.Item>  
                                        </Col>
                                    </>
                                }
                                <Col span={24}><p>Số điểm bạn đang có là ({userSate.user.currentPoint}) Số điểm bạn có thể dùng là ({MaxPointCanUse()})</p></Col>
                                <Col span={24}>
                                    <Form.Item label='Số điểm sử dụng cho đơn hàng'>
                                        <Controller 
                                            control={control}
                                            name='rewardPointUsed'
                                            render={({field: { value }}) => (<Input min={0} type='number' value={value} onChange={(e) =>{
                                                const data = Number(e.target.value || 0)
                                                if(data <= MaxPointCanUse()){
                                                    setValue('rewardPointUsed', data)
                                                }else{
                                                    setValue('rewardPointUsed', MaxPointCanUse())
                                                }
                                                trigger('rewardPointUsed')
                                            }} />)}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={24} >
                                    <div className='btn-form-wrapper'>
                                        <Button htmlType='button' disabled={isSubmitting} type='default' size='large' className='btn-cancel'>Hủy</Button>
                                        <Button htmlType='submit' loading={isSubmitting} type='primary' className='btn-update' size='large'>
                                            Gia hạn
                                        </Button>
                                    </div>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </div>
            </Modal>
            {
                idRemove &&
                <Modal
                    title={`Xác nhận xóa "${rentOrderList.rentOrderDetailList.filter(x => x.id === idRemove)[0].productItemName}" khỏi đơn hàng`}
                    open
                    onCancel={handleCloseModal}
                    onOk={handleRemoveItem}
                >
                </Modal>
            }
        </>
    )
}

export default ClientExtendOrder