import { Col, DatePicker, Form, Image, Input, Modal, Row, Select, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import useDispatch from 'app/hooks/use-dispatch'
import { OrderCalculate, OrderCreate, OrderExtendDetail, RentOrderList } from 'app/models/order'
import orderService from 'app/services/order.service'
import { setNoti } from 'app/slices/notification'
import React, { useEffect, useMemo, useState } from 'react'
import CurrencyFormat from 'react-currency-format'
import { BiPlus } from 'react-icons/bi'
import { CiSquareRemove } from 'react-icons/ci'
import { GrFormSubtract } from 'react-icons/gr'
import './style.scss'
import { Dayjs } from "dayjs";
import 'dayjs/locale/vi';
import { yupResolver } from '@hookform/resolvers/yup'
import useSelector from 'app/hooks/use-selector'
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { CartUserData } from 'app/models/cart'
import ErrorMessage from 'app/components/message.tsx/ErrorMessage'
import { ShippingFee } from 'app/models/shipping-fee'
import locale from 'antd/es/date-picker/locale/vi_VN';
import shippingFeeService from 'app/services/shipping-fee.service'
import CONSTANT from 'app/utils/constant'
import { useNavigate } from 'react-router-dom'

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
const schema = yup.object().shape({
    recipientAddress: yup.string().required('Địa chỉ không được để trống').max(500, 'Địa chỉ không được nhiều hơn 500 ký tự'),
    recipientName: yup.string().required('Tên không được để trống').max(200, 'Tên không được nhiều hơn 200 ký tự'),
    recipientPhone: yup.string().required('Số điện thoại không được để trống').matches(phoneRegExp, 'Số điện thoại không hợp lệ'),
})
const { RangePicker } = DatePicker;

interface ClientExtendOrderProps{
    rentOrderList: RentOrderList
    onClose?: () => void
    onExtend?: () => void
}

const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY', 'DD-MM-YYYY', 'DD-MM-YY'];

const ClientExtendOrder: React.FC<ClientExtendOrderProps> = ({rentOrderList, onClose, onExtend}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [data, setData] = useState<OrderExtendDetail>()
    const [listQuan, setLisQuan] = useState<number[]>([]) 
    const [itemDelete, setItemDelete] = useState('')
    const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>()
    const { control, formState: { errors, isValid, isSubmitted }, handleSubmit, setValue, getValues, trigger } = useForm<CartUserData>({
        resolver: yupResolver(schema)
    })
    const userSate = useSelector(state => state.userInfor)
    const [recall, setRecall] = useState(false)
    const [shipping, setShipping] = useState<ShippingFee[]>([])
    const [rentPoint, setRentPoint] = useState(0)
    const [finalRentPrice, setFinalRentPrice] = useState<OrderCalculate>();
    console.log({finalRentPrice})

    useEffect(() =>{
        if(!data || data.rentOrder.rentOrderDetailList.length === 0 || !dateRange || !dateRange[0] || !dateRange[1] || !isValid) {
            setFinalRentPrice(undefined)
            return;
        }
        const init = async () =>{
            try{
                const { recipientAddress, recipientName, recipientPhone, shippingID } = getValues()
                // const listRequestOrder: Promise<any>[] = [];
    //             productItemDetailID: string;
    // quantity: number
                const params: OrderCreate = {
                    startDateRent: dateRange ? dateRange[0].toDate() : undefined,
                    endDateRent: dateRange ? dateRange[1].toDate() : undefined,
                    shippingID: shippingID,
                    itemList: data.productItemDetailList.map((x, index) => ({productItemDetailID: x.id, quantity: listQuan[index]})),
                    rewardPointUsed: rentPoint,
                    rentOrderGroupID: null,
                    recipientAddress,
                    recipientName,
                    recipientPhone
                }
                const res = await orderService.calculateOrder(params)
                setFinalRentPrice(res.data)
            }catch{

            }
        }
        init()
    }, [data, dateRange, isValid, recall, getValues, listQuan, rentPoint])

    useEffect(() =>{
        const { address, fullName, phone, districtID } = userSate.user

        if(!address || !fullName || !phone) return;

        setValue('recipientAddress', address)
        setValue('recipientName', fullName)
        setValue('recipientPhone', phone)
        setValue('shippingID', districtID)

        trigger()
    }, [userSate, setValue, trigger])

    useEffect(() =>{
        // const rentOrderID = 'b64e42ef-07f9-40d7-a76e-93fa7c6b3f9c'
        const init = async () =>{
            try{
                const res = await orderService.getARentOrder(rentOrderList.id)
                setData(res.data)
                const listQuantity = res.data.rentOrder.rentOrderDetailList.map(x => x.quantity)
                setLisQuan(listQuantity)
            }catch{

            }
        }
        init()
    }, [rentOrderList])
   
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
            title: '#',
            key: '#',
            dataIndex: '#',
            align: 'center',
            render: (v, _, index) => (<span style={{color: '#00a76f'}}>{index + 1}</span>)
        },
        {
            title: 'Tên sản phẩm',
            key: 'productItemName',
            dataIndex: 'productItemName',
            render: (v) => (v)
        },
        {
            title: 'Hình ảnh',
            key: 'imgURL',
            dataIndex: 'imgURL',
            align: 'center',
            render: (v) => (
                <Image
                    width={150}
                    height={150}
                    src={v}
                    className='img-preview'
                />
            )
        },
        {
            title: 'Kích thước',
            key: 'sizeName',
            dataIndex: 'sizeName',
            align: 'center',
            render: (v) => (v)
        },
        {
            title: 'Số lượng',
            key: 'quantity',
            dataIndex: 'quantity',
            align: 'center',
            render: (v, record) => (
                <div className="quantity-box">
                    <button className="decrease" onClick={() => controlRent(record, '-')} >
                        <GrFormSubtract />
                    </button>
                    <input type="number" value={record.quantity} disabled  />
                    <button className="increase" onClick={() => controlRent(record, '+')} >
                        <BiPlus />
                    </button>
                </div>
            )
        },
        {
            title: 'Giá tiền',
            key: 'rentPricePerUnit',
            dataIndex: 'rentPricePerUnit',
            align: 'right',
            render: (v) => (<CurrencyFormat className='value' value={v || 0} displayType={'text'} thousandSeparator={true} suffix={'VNĐ'} />)
        },
        {
            title: 'Tổng tiền',
            key: 'totalPrice',
            dataIndex: 'totalPrice',
            align: 'right',
            render: (v) => (<CurrencyFormat className='value' value={v} displayType={'text'} thousandSeparator={true} suffix={'VNĐ'} />)
        },
        {
            title: 'Xóa',
            key: '#',
            dataIndex: '#',
            align: 'center',
            render: (_, record) => (<CiSquareRemove size={30} color='#FF3333' style={{cursor: 'pointer'}} onClick={() => setItemDelete(record.id)} />)
        }
    ]

    const DataSource = useMemo(() =>{
        if(!data) return
        return data.rentOrder.rentOrderDetailList.map((x, index) => ({
            key: String(index + 1),
            id: x.id,
            totalPrice: x.totalPrice,
            quantity: x.quantity,
            rentPricePerUnit: x.rentPricePerUnit,
            sizeName: x.sizeName,
            productItemName: x.productItemName,
            imgURL: x.imgURL,
        }))
    }, [data])

    const handleRemoveItem = () =>{
        if(!data) return;

        const index = data.rentOrder.rentOrderDetailList.findIndex(x => x.id === itemDelete)
        data.rentOrder.rentOrderDetailList.splice(index, 1)
        setData({...data})
        setItemDelete('')

        listQuan.slice(index, 1)
        setLisQuan([...listQuan])
    }
    const controlRent = (record, digit: string) =>{
        if(!data) return;
        const index = data.rentOrder.rentOrderDetailList.findIndex(x => x.id === record.id)
        // const cloneRecord = clone.rentOrderDetailList[index]
        const currentQuan = listQuan[index]
        
        // // console.log(record.quantity)

        if(digit === '-'){
            if(record.quantity === 1){
                dispatch(setNoti({type: 'warning', message: 'Không thể giảm số lượng hơn 1'}))  
            }else{
                data.rentOrder.rentOrderDetailList[index].quantity = data.rentOrder.rentOrderDetailList[index].quantity - 1
                setData({...data})
            }
        }else{
            if(record.quantity === currentQuan){
                dispatch(setNoti({type: 'warning', message: 'Không thể tăng số lượng hơn số cây bạn đã đặt'})) 
            }else{
                data.rentOrder.rentOrderDetailList[index].quantity = data.rentOrder.rentOrderDetailList[index].quantity + 1
                setData({...data})
            }
        }
    }
    const handleSubmitForm = async (dataProps: CartUserData) =>{
        if(!data) return;
        if(data.productItemDetailList.length !== 0 && !dateRange) return;

        const { recipientAddress, recipientName, recipientPhone, shippingID } = dataProps

        const dataParams: OrderCreate = {
            startDateRent: dateRange ? dateRange[0].toDate() : undefined,
            endDateRent: dateRange ? dateRange[1].toDate() : undefined,
            shippingID,
            itemList: data.productItemDetailList.map((x, index) => ({productItemDetailID: x.id, quantity: listQuan[index]})),
            rewardPointUsed: rentPoint,
            rentOrderGroupID: null,
            recipientAddress,
            recipientName,
            recipientPhone
        }
        try{
            await orderService.createOrder(dataParams)
            dispatch(setNoti({type: 'success', message: 'Gia hạn đơn hàng thanh công'}))
            navigate('/checkout-success')
        }catch{
            dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
        }
    }

    const handleChangeDateRange = (dates, dateStrings)=>{
        setDateRange(dates)
    }
    const totalItem = useMemo(() =>{
        if(!data) return 0
        let quantity = 0;
        data.rentOrder.rentOrderDetailList.forEach(item => {
            quantity += item.quantity
        })
        return quantity 
    }, [data])
    return (
        <>
            <Modal
                open
                // title={`Gian hạn đơn hàng ${rentOrderList.orderCode}`}
                onCancel={onClose}
                width={1200}
            >
                <Table dataSource={DataSource} columns={Column} pagination={false} />
                <div className="user-infor">
                    <div className="user-box">
                        <h2>Xác nhận thông tin đặt hàng</h2>
                        <Form
                                layout='vertical'
                                onFinish={handleSubmit(handleSubmitForm)}
                                style={{width: '500px', marginLeft: 'auto'}}
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
                                        <Form.Item label='Nơi nhận' required>
                                            <Controller 
                                                control={control}
                                                name='shippingID'
                                                render={({ field: { value} }) => (
                                                    <Select value={value} onChange={(e) => {
                                                        setRecall(!recall)
                                                        setValue('shippingID', e)
                                                        trigger()
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
                                    <Col span={24}><p>Số điểm của bạn là {userSate.user.currentPoint}</p></Col>
                                    <Col span={12}>
                                        <Form.Item label='Số điểm sử dụng cho đơn thuê'>
                                            <Input min={0} type='number' max={userSate.user.currentPoint} value={rentPoint} onChange={(e) => {
                                                const value = Number(e.target.value)
                                                if((userSate.user.currentPoint) > value){
                                                    setRentPoint(Number(e.target.value))
                                                }else{
                                                    setRentPoint(userSate.user.currentPoint)
                                                }
                                            }} />
                                        </Form.Item>
                                    </Col>
                                    
                                </Row>
                                <div className="box">
                                    {
                                        data?.rentOrder.rentOrderDetailList.length !== 0 &&
                                        <div className="cart-date-picker">
                                            <p>Chọn ngày thuê</p>
                                            <RangePicker
                                                locale={locale} 
                                                placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
                                                format={dateFormatList}
                                                disabledDate={(current) => current && current.valueOf()  < (Date.now() + 277600000)}
                                                defaultValue={dateRange}
                                                onChange={handleChangeDateRange}
                                                status={(isSubmitted && !dateRange) ? 'error' : ''}
                                            />
                                        </div>
                                    }
                                    <div className="total">
                                        <span>({totalItem}) </span> 
                                        <span>sản phẩm</span>
                                        <span>Tổng cộng: </span>
                                        <CurrencyFormat value={0} displayType={'text'} thousandSeparator={true} suffix={'đ'} />
                                    </div>
                                    <button className='btn-order' type='submit'>Đặt hàng</button>
                                </div>
                            </Form>
                    </div>
                </div>
            </Modal>
            {
                itemDelete &&
                <Modal
                    title={`Xác nhận xóa "${data?.rentOrder.rentOrderDetailList.filter(x => x.id === itemDelete)[0].productItemName}" khỏi đơn hàng`}
                    open
                    onCancel={() => setItemDelete('')}
                    onOk={handleRemoveItem}
                >
                </Modal>
            }
        </>
    )
}

export default ClientExtendOrder