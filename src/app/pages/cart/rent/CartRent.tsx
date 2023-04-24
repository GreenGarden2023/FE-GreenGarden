import { Button, Checkbox, Col, DatePicker, Form, Input, Modal, Row, Select, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import MoneyFormat from 'app/components/money/MoneyFormat'
import ListImage from 'app/components/renderer/list-image/ListImage'
import useSelector from 'app/hooks/use-selector'
import { CartItemDetail, OrderPreview, OrderUserInfor } from 'app/models/cart'
import { ShippingFee } from 'app/models/shipping-fee'
import React, { useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { BiPlus } from 'react-icons/bi'
import { CiSquareRemove } from 'react-icons/ci'
import { FaMoneyBillAlt } from 'react-icons/fa'
import { GrFormSubtract } from 'react-icons/gr'
import './style.scss'
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import CONSTANT from 'app/utils/constant'
import ErrorMessage from 'app/components/message.tsx/ErrorMessage'
import locale from 'antd/es/date-picker/locale/vi_VN';
import dayjs, { Dayjs } from 'dayjs'
import { MdNavigateNext } from 'react-icons/md'
import useDispatch from 'app/hooks/use-dispatch'
import { setNoti } from 'app/slices/notification'
import RentPolicy from 'app/components/modal/rent-policy/RentPolicy'
import utilDateTime from 'app/utils/date-time'

const schema = yup.object().shape({
    recipientAddress: yup.string().when("isTransport", {
        is: true,
        then: yup.string().trim().required('Địa chỉ không được để trống').max(500, 'Tối đa 500 ký tự')
    }),
    recipientName: yup.string().trim().required('Tên không được để trống').max(200, 'Tối đa 200 ký tự'),
    recipientPhone: yup.string().trim().required('Số điện thoại không được để trống').matches(CONSTANT.PHONE_REGEX, 'Số điện thoại không hợp lệ'),
    isTransport: yup.boolean(),
})

interface CartRentProps{
    items: CartItemDetail[]
    shipping: ShippingFee[]
    onChange: (type: string, common: string, items: CartItemDetail[], id: string) => void
    onSubmit: (type: string, data: OrderUserInfor, orderPreview: OrderPreview) => void
}

const CartRent: React.FC<CartRentProps> = ({items, shipping, onChange, onSubmit}) => {
    const dispatch = useDispatch()
    const userState = useSelector(state => state.userInfor)

    const [idRemove, setIdRemove] = useState('')

    const startDate = new Date()
    startDate.setDate(startDate.getDate() + 1);

    const endDate = new Date()
    endDate.setDate(endDate.getDate() + 7);

    const { setValue, getValues, trigger, formState: { errors, isSubmitting }, handleSubmit, control, setError, clearErrors } = useForm<OrderUserInfor>({
        defaultValues: {
            rewardPointUsed: 0,
            isTransport: false,
            itemList: items.map(x => ({productItemDetailID: x.productItemDetail.id, quantity: x.quantity})),
            startDateRent: startDate,
            endDateRent: endDate
        },
        resolver: yupResolver(schema)
    })

    const [isConfirm, setIsConfirm] = useState(false)
    const [isViewPolicy, setIsViewPolicy] = useState(false)
    
    useEffect(() =>{
        if(!userState.token) return;

        const { fullName, address, districtID, phone } = userState.user

        setValue('recipientName', fullName)
        setValue('recipientPhone', phone)
        setValue('recipientAddress', address)
        setValue('shippingID', districtID)
        
        trigger()
    }, [userState, setValue, trigger])

    const ColumnRent: ColumnsType<any> = [
        {
            title: '#',
            key: '#',
            dataIndex: '#',
            align: 'center',
            render: (v, _, index) => (<span style={{color: '#00a76f'}}>{index + 1}</span>)
        },
        {
            title: 'Hình ảnh',
            key: 'imgUrl',
            dataIndex: 'imgUrl',
            align: 'center',
            render: (v) => (<ListImage listImgs={v} />)
        },
        {
            title: 'Tên sản phẩm',
            key: 'name',
            dataIndex: 'name',
        },
        {
            title: 'Kích thước',
            key: 'sizeName',
            dataIndex: 'sizeName',
            
        },
        {
            title: 'Đơn vị',
            key: 'unit',
            dataIndex: 'unit',
            render: () => ('Cây/ngày')
        },
        {
            title: 'Giá',
            key: 'price',
            dataIndex: 'price',
            align: 'right',
            render: (v) => (<MoneyFormat value={v} color='Light Blue' />)
        },
        {
            title: 'Số lượng',
            key: 'quantity',
            dataIndex: 'quantity',
            align: 'center',
            render: (_, record) => (
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
            key: 'total',
            dataIndex: 'total',
            align: 'right',
            render: (_, record) => (<MoneyFormat value={record.price * record.quantity} color='Blue' />)
        },
        {
            title: 'Xóa',
            key: 'delete',
            dataIndex: 'delete',
            align: 'center',
            render: (_, record) => (
                <CiSquareRemove size={30} color='#FF3333' style={{cursor: 'pointer'}}
                 onClick={() => setIdRemove(record.id)} 
                />
            )
        }
    ]
    const controlRent = async (id: string, common: string) => {
        const [item] = items.filter(x => x.productItemDetail.id === id)
        
        if(common === '+'){
            item.quantity = item.quantity + 1
        }else{
            if(item.quantity === 1) return;
            item.quantity = item.quantity - 1
        }
        clearPoint()
        onChange('rent', common,items, item.productItemDetail.id)
    }
    const DataSourceRent = useMemo(() => {
        return items.map((c, index) => ({
            key: String(index + 1),
            id: c.productItemDetail.id,
            imgUrl: c.productItemDetail.imgUrl,
            name: c.productItem.name,
            price: c.productItemDetail.rentPrice,
            quantity: c.quantity,
            sizeName: c.productItemDetail.size.sizeName
        }))
    }, [items])

    const handleClose = () =>{
        setIdRemove('')
    }

    const handleRemoveItem = () =>{
        const itemsRemoved = items.filter(x => x.productItemDetail.id !== idRemove)
        clearPoint()
        onChange('rent', 'remove', itemsRemoved, idRemove)
        handleClose()
    }

    const handleChangeDateRange = (dates, dateStrings)=>{
        const newDate = dates as [Dayjs, Dayjs]
        console.log(newDate)
        if(!newDate){
            setValue('startDateRent', undefined)
            setValue('endDateRent', undefined)
        }else{
            const [start, end] = newDate
            setValue('startDateRent', utilDateTime.dayjsToLocalString(start))
            setValue('endDateRent', utilDateTime.dayjsToLocalString(end))
            clearErrors('startDateRent')
        }
    }

    const onSubmitForm = (data: OrderUserInfor) =>{
        const { startDateRent, endDateRent} = data
        // validate right here
        if(!startDateRent || !endDateRent){
            setError('startDateRent', {
                type: 'pattern',
                message: 'Thời gian thuê không được để trống'
            })
            return;
        }
        const start = dayjs(startDateRent)
        const end = dayjs(endDateRent)
        if(start.diff(end, 'days') === 0){
            setError('startDateRent', {
                type: 'pattern',
                message: 'Chọn khoảng thời gian thuê ít nhất 1 ngày'
            })
            return;
        }

        if(!isConfirm){
            dispatch(setNoti({type: 'info', message: 'Bạn hãy đồng ý với các điều khoản của chúng tôi trước khi thuê cây'}))
            return
        }
        
        data.itemList = items.map(x => ({productItemDetailID: x.productItemDetail.id, quantity: x.quantity}))
        onSubmit('rent', data, OrderPreview())
    }

    const clearPoint = () =>{
        setValue('rewardPointUsed', 0)
    }

    const getDiffDays = (startDate?: Date, endDate?: Date) => {
        if(!startDate || !endDate) return 0

        const start = dayjs(startDate)
        const end = dayjs(endDate)

        return end.diff(start, 'days')
    }

    const OrderPreview = () =>{
        const { rewardPointUsed, shippingID, isTransport, startDateRent, endDateRent } = getValues()

        const [shippingFeeTemp] = shipping.filter(x => x.districtID === shippingID)

        const totalRentDays = getDiffDays(startDateRent, endDateRent)

        let totalPriceOrder = 0
        let transportFee = shippingFeeTemp ? shippingFeeTemp.feeAmount : 0

        for (const item of items) {
            totalPriceOrder += item.quantity * item.productItemDetail.rentPrice * totalRentDays
            transportFee += (item.productItemDetail.transportFee * item.quantity)
        }

        if(!isTransport){
            transportFee = 0
        }
        
        const totalPricePayment = (totalPriceOrder + transportFee) - (rewardPointUsed * CONSTANT.POINT_TO_MONEY)

        const rewardPoint = Math.ceil(totalPricePayment / CONSTANT.REWARD_POINT_RATE)

        const deposit = totalPricePayment < CONSTANT.RENT_DEPOSIT_RATE ? 0 : Math.ceil(totalPricePayment * CONSTANT.DEPOSIT_MIN_RATE)

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
        const { currentPoint } = userState.user
        
        const { totalPriceOrder, transportFee } = OrderPreview()

        if(totalPriceOrder <= CONSTANT.MIN_ORDER) return 0

        let result = 0

        // tại nhà + phí ship
        if(isTransport){
            const total = totalPriceOrder + transportFee - CONSTANT.MIN_ORDER
            result = Math.floor(total / CONSTANT.MONEY_RATE) * 10
        }else{
            const total = totalPriceOrder - CONSTANT.MIN_ORDER
            result = Math.floor(total / CONSTANT.MONEY_RATE) * 10
        }

        return currentPoint > result ? result : currentPoint
    }
    const onClosePolicy = () =>{
        setIsViewPolicy(false)
    }

    return (
        <div className='cart-rent-wrapper'>
            <div className='default-layout'>
                <div className="cart-rent-layout">
                    <h3 className="title-cart">Cây thuê</h3>
                    <Table className='cart-table' dataSource={DataSourceRent} columns={ColumnRent} pagination={false} />
                </div>
            </div>
            {
                items.length !== 0 &&
                <div className="default-layout">
                    <div className="rent-order-detail-wrapper">
                        <h3 className='title-name'>Thông tin đơn hàng</h3>
                        <div className="rent-order-infor">
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
                                        <span className='title'>Số điểm nhận được</span>
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
                                    onFinish={handleSubmit(onSubmitForm)}
                                >
                                    <Row gutter={[24, 0]}>
                                        <Col span={12}>
                                            <Form.Item label='Tên người nhận' required>
                                                <Controller 
                                                    control={control}
                                                    name='recipientName'
                                                    render={({field}) => (<Input {...field} />)}
                                                />
                                                {errors.recipientName && <ErrorMessage message={errors.recipientName.message} />}
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item label='Số điện thoại' required>
                                                <Controller 
                                                    control={control}
                                                    name='recipientPhone'
                                                    render={({field}) => (<Input {...field} />)}
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
                                                    disabledDate={(current) => current && current.valueOf()  < Date.now()}
                                                    defaultValue={[dayjs(dayjs(getValues('startDateRent')).format('DD/MM/YYYY'), 'DD/MM/YYYY'), dayjs(dayjs(getValues('endDateRent')).format('DD/MM/YYYY'), 'DD/MM/YYYY')]}
                                                    onChange={handleChangeDateRange}
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
                                                            render={({ field: { value } }) => (
                                                                <Select value={value} onChange={(e) => {
                                                                    setValue('shippingID', e)
                                                                    trigger('shippingID')
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
                                                    </Form.Item>
                                                </Col>
                                                <Col span={12}>
                                                    <Form.Item label='Địa chỉ cụ thể' required>
                                                        <Controller 
                                                            control={control}
                                                            name='recipientAddress'
                                                            render={({field}) => (<Input {...field} />)}
                                                        />
                                                        {errors.recipientAddress && <ErrorMessage message={errors.recipientAddress.message} />}
                                                    </Form.Item>
                                                </Col>
                                            </>
                                        }
                                        <Col span={24}>
                                            <div className="point-infor">
                                                <span>Số điểm bạn đang có là ({userState.user.currentPoint})</span>
                                                <span>Số điểm bạn có thể dùng là ({MaxPointCanUse()})</span>
                                            </div>
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
                                        <Col span={24}>
                                            <Checkbox checked={isConfirm} onChange={(e) => setIsConfirm(e.target.checked)} >Đồng ý với tất cả điều khoản khi thuê cây</Checkbox>
                                            <div className="rent-policy">
                                                <div className='view-policy' onClick={() => setIsViewPolicy(true)}>
                                                    <span>Xem điều khoản thuê cây</span>
                                                    <MdNavigateNext size={20} />
                                                </div>
                                            </div>
                                        </Col>
                                        <Col span={24} >
                                            <div className='btn-form-wrapper'>
                                                <Button htmlType='submit' loading={isSubmitting} type='primary' className='btn-update' size='large'>
                                                    Đặt hàng
                                                </Button>
                                            </div>
                                        </Col>
                                    </Row>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            }
            {
                idRemove &&
                <Modal
                    open
                    title={`Xác nhận xóa "${items.filter(x => x.productItemDetail.id)[0].productItem.name}" khỏi giỏ hàng ?`}
                    onCancel={handleClose}
                    onOk={handleRemoveItem}
                >
                    
                </Modal>
            }
            {
                isViewPolicy &&
                <RentPolicy
                    checked={isConfirm}
                    items={items}
                    onConfirm={onClosePolicy}
                />
            }
        </div>
    )
}

export default CartRent