import { yupResolver } from '@hookform/resolvers/yup';
import { DatePicker, Form, Image, Input, Modal } from 'antd';
import locale from 'antd/es/date-picker/locale/vi_VN';
import Table, { ColumnsType } from 'antd/es/table';
import LandingFooter from 'app/components/footer/LandingFooter';
import HeaderInfor from 'app/components/header-infor/HeaderInfor';
import LandingHeader from 'app/components/header/LandingHeader';
import ErrorMessage from 'app/components/message.tsx/ErrorMessage';
import MoneyFormat from 'app/components/money/MoneyFormat';
import useSelector from 'app/hooks/use-selector';
import { Cart, CartUserData } from 'app/models/cart';
import { OrderCalculate, OrderCreate } from 'app/models/order';
import cartService from 'app/services/cart.service';
import orderService from 'app/services/order.service';
import { CartProps, setCartSlice } from 'app/slices/cart';
import { setNoti } from 'app/slices/notification';
import pagingPath from 'app/utils/paging-path';
import { Dayjs } from "dayjs";
import 'dayjs/locale/vi';
import React, { useEffect, useMemo, useState } from 'react';
import CurrencyFormat from 'react-currency-format';
import { Controller, useForm } from 'react-hook-form';
import { BiPlus } from 'react-icons/bi';
import { CiSquareRemove } from 'react-icons/ci';
import { FaMoneyBillAlt } from 'react-icons/fa';
import { GrFormSubtract } from 'react-icons/gr';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import useDispatch from '../../hooks/use-dispatch';
import { setTitle } from '../../slices/window-title';
import CONSTANT from '../../utils/constant';
import './style.scss';

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
const schema = yup.object().shape({
    recipientAddress: yup.string().required('Địa chỉ không được để trống').max(500, 'Địa chỉ không được nhiều hơn 500 ký tự'),
    recipientName: yup.string().required('Tên không được để trống').max(200, 'Tên không được nhiều hơn 200 ký tự'),
    recipientPhone: yup.string().required('Số điện thoại không được để trống').matches(phoneRegExp, 'Số điện thoại không hợp lệ'),
})

const { RangePicker } = DatePicker;
const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY', 'DD-MM-YYYY', 'DD-MM-YY'];
// const dateFormat = 'DD/MM/YYYY';

const CartPage: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { rentItems, saleItems } = useSelector(state => state.CartStore)
    const [cart, setCart] = useState<Cart>()
    const [sizeProductItemSelect, setSizeProductItemSelect] = useState<string[]>([])
    const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>()
    const [submited, setSubmited] = useState(false);
    const { control, formState: { errors, isValid }, handleSubmit, setValue, getValues, trigger } = useForm<CartUserData>({
        resolver: yupResolver(schema)
    })
    const userSate = useSelector(state => state.userInfor)

    // const [finalPrice, setFinalPrice] = useState(0);
    const [finalRentPrice, setFinalRentPrice] = useState<OrderCalculate>();
    const [finalSalePrice, setFinalSalePrice] = useState<OrderCalculate>();

    const [rentPoint, setRentPoint] = useState(0)
    const [salePoint, setSalePoint] = useState(0)

    useEffect(() =>{
        if(rentItems.length !== 0 && !dateRange){
            setFinalRentPrice(undefined)
            setFinalSalePrice(undefined)
            return;
        }
        if(!isValid){
            setFinalRentPrice(undefined)
            setFinalSalePrice(undefined)
            return
        }

        const init = async () =>{
            try{
                const { recipientAddress, recipientName, recipientPhone } = getValues()
                // const listRequestOrder: Promise<any>[] = [];
                if(rentItems.length !== 0){
                    const data: OrderCreate = {
                        startDateRent: dateRange ? dateRange[0].toDate() : undefined,
                        endDateRent: dateRange ? dateRange[1].toDate() : undefined,
                        itemList: rentItems,
                        rewardPointUsed: rentPoint,
                        rentOrderGroupID: null,
                        recipientAddress,
                        recipientName,
                        recipientPhone
                    }
                    const res = await orderService.calculateOrder(data)
                    setFinalRentPrice(res.data)
                    // setFinalPrice(finalPrice + res.data.totalPrice)
                    // listRequestOrder.push(orderService.calculateOrder(data))
                }
                if(saleItems.length !== 0){
                    const data: any = {
                        itemList: saleItems,
                        rewardPointUsed: salePoint,
                        recipientAddress,
                        recipientName,
                        recipientPhone,
                        rentOrderGroupID: null,
                    }
                    const res = await orderService.calculateOrder(data)
                    setFinalSalePrice(res.data)
                    // listRequestOrder.push(orderService.calculateOrder(data))
                }
                // await Promise.all(listRequestOrder)
                // const rentCalRes = await orderService.calculateOrder()
            }catch{

            }
        }
        init()

    }, [isValid, dateRange, rentItems, getValues, saleItems, rentPoint, salePoint])

    useEffect(() =>{
        const { address, fullName, phone } = userSate

        if(!address || !fullName || !phone) return;

        setValue('recipientAddress', address)
        setValue('recipientName', fullName)
        setValue('recipientPhone', phone)

        trigger()
    }, [userSate, setValue, trigger])

    useEffect(() =>{
        pagingPath.scrollTop()
        dispatch(setTitle(`${CONSTANT.APP_NAME} | Cart`))
    }, [dispatch])

    useEffect(() =>{
        const init = async () =>{
            try{
                const result = await cartService.getCart()
                setCart(result.data)
                const cartProps: CartProps = {
                    rentItems: result.data.rentItems.map(x => ({productItemDetailID: x.productItemDetail.id, quantity: x.quantity})),
                    saleItems: result.data.saleItems.map(x => ({productItemDetailID: x.productItemDetail.id, quantity: x.quantity})),
                }
                dispatch(setCartSlice(cartProps))
            }catch{
                dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
            }
        }
        init()
    }, [dispatch])

    const ColumnSale: ColumnsType<any> = [
        {
            title: '#',
            key: '#',
            dataIndex: '#',
            align: 'center',
            render: (v, _, index) => (<span style={{color: '#00a76f'}}>{index + 1}</span>)
            // width: 200
        },
        {
            title: 'Hình ảnh',
            key: 'image',
            dataIndex: 'image',
            align: 'center',
            render:(value) => (
                <Image 
                    src={value ? value : '/assets/inventory-empty.png'}
                    width={100}
                    height={100}
                    style={{maxHeight: '100px', objectFit: 'cover'}}
                    onError={({currentTarget }) => {
                        currentTarget.onerror = null
                        currentTarget.src = '/assets/inventory-empty.png'
                    }} 
                />
            )
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
            render: () => ('Cây')
        },
        {
            title: 'Giá',
            key: 'price',
            dataIndex: 'price',
            align: 'right',
            render: (v) => (<MoneyFormat value={v} />)
        },
        {
            title: 'Số lượng',
            key: 'quantity',
            dataIndex: 'quantity',
            align: 'center',
            render: (_, record) => (
                <div className="quantity-box">
                    <button className="decrease" onClick={() => controlSale(record.sizeProductItemId, '-')} >
                        <GrFormSubtract />
                    </button>
                    <input type="number" value={record.quantity} disabled  />
                    <button className="increase" onClick={() => controlSale(record.sizeProductItemId, '+')} >
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
            render: (_, record) => (<MoneyFormat value={record.price * record.quantity} />)
        },
        {
            title: 'Xóa',
            key: 'delete',
            dataIndex: 'delete',
            align: 'center',
            render: (_, record) => (
                <CiSquareRemove size={30} color='#FF3333' style={{cursor: 'pointer'}} onClick={() => setSizeProductItemSelect(['Sale', record.sizeProductItemId])} />
            )
        }
    ]
    
    const controlSale = async (sizeProductItemId: string, common: string) =>{
        console.log({sizeProductItemId, common})
        const newCart = {...cart}

        if(!newCart) return

        const sizeProductItemIdIndex = cart?.saleItems.findIndex(x => x.productItemDetail.id === sizeProductItemId)
        
        if(sizeProductItemIdIndex === undefined || sizeProductItemIdIndex < 0) return;
        
        if(common === '+'){
            if(!newCart.saleItems) return
            newCart.saleItems[sizeProductItemIdIndex].quantity = newCart.saleItems[sizeProductItemIdIndex].quantity + 1
        }else{
            if(!newCart.saleItems) return
            if(newCart.saleItems[sizeProductItemIdIndex].quantity <= 1) return;
            newCart.saleItems[sizeProductItemIdIndex].quantity = newCart.saleItems[sizeProductItemIdIndex].quantity - 1
        }

        try{
            const cartProps: CartProps = {
                rentItems: [...newCart.rentItems?.map(x => ({productItemDetailID: x.productItemDetail.id, quantity: x.quantity})) || []],
                saleItems: [...newCart.saleItems?.map(x => ({productItemDetailID: x.productItemDetail.id, quantity: x.quantity})) || []],
            }
            const res = await cartService.addToCart(cartProps)
            setCart(res.data)
            dispatch(setCartSlice(cartProps))
            dispatch(setNoti({type: 'success', message: 'Cập nhật giỏ hàng thành công'}))
        }catch{
            dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
        }
    }
    const DataSourceSale = cart?.saleItems.map((c, index) => ({
        key: String(index + 1),
        sizeProductItemId: c.productItemDetail.id,
        image: c.productItemDetail.imgUrl[0],
        name: c.productItem.name,
        price: c.productItemDetail.salePrice,
        quantity: c.quantity,
        sizeName: c.productItemDetail.size.sizeName
    }))

    const ColumnRent: ColumnsType<any> = [
        {
            title: '#',
            key: '#',
            dataIndex: '#',
            align: 'center',
            render: (v, _, index) => (<span style={{color: '#00a76f'}}>{index + 1}</span>)
            // width: 200
        },
        {
            title: 'Hình ảnh',
            key: 'image',
            dataIndex: 'image',
            align: 'center',
            render: (_, record) => (
                <Image 
                    src={record.image ? record.image : '/assets/inventory-empty.png'}
                    width={100}
                    height={100}
                    style={{maxHeight: '100px', objectFit: 'cover'}}
                    onError={({currentTarget }) => {
                        currentTarget.onerror = null
                        currentTarget.src = '/assets/inventory-empty.png'
                    }} 
                />
            )
            // width: 200
        },
        {
            title: 'Tên sản phẩm',
            key: 'name',
            dataIndex: 'name',
        },
        {
            title: 'Kích thước',
            key: 'size',
            dataIndex: 'size',
            render: (value, record, index) => (record.sizeName)
            // width: 200
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
            render: (v) => (<MoneyFormat value={v} />)
        },
        
        {
            title: 'Số lượng',
            key: 'action',
            dataIndex: 'action',
            align: 'center',
            render: (_, record) => (
                <div className="quantity-box">
                    <button className="decrease" onClick={() => controlRent(record.sizeProductItemId, '-')} >
                        <GrFormSubtract />
                    </button>
                    <input type="number" value={record.quantity} disabled  />
                    <button className="increase" onClick={() => controlRent(record.sizeProductItemId, '+')} >
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
            render: (_, record) => (<MoneyFormat value={record.price * record.quantity} />)
        },
        {
            title: 'Xóa',
            key: 'delete',
            dataIndex: 'delete',
            align: 'center',
            render: (_, record) => (
                <CiSquareRemove size={30} color='#FF3333' style={{cursor: 'pointer'}} onClick={() => setSizeProductItemSelect(['Rent', record.sizeProductItemId])} />
            )
        }
    ]
    const controlRent = async (sizeProductItemId: string, common: string) =>{
        console.log({sizeProductItemId, common})
        const newCart = {...cart}

        if(!newCart) return

        const sizeProductItemIdIndex = cart?.rentItems.findIndex(x => x.productItemDetail.id === sizeProductItemId)
        
        if(sizeProductItemIdIndex === undefined || sizeProductItemIdIndex < 0) return;
        
        if(common === '+'){
            if(!newCart.rentItems) return
            newCart.rentItems[sizeProductItemIdIndex].quantity = newCart.rentItems[sizeProductItemIdIndex].quantity + 1
        }else{
            if(!newCart.rentItems) return
            if(newCart.rentItems[sizeProductItemIdIndex].quantity <= 1) return;
            newCart.rentItems[sizeProductItemIdIndex].quantity = newCart.rentItems[sizeProductItemIdIndex].quantity - 1
        }

        try{
            const cartProps: CartProps = {
                rentItems: [...newCart.rentItems?.map(x => ({productItemDetailID: x.productItemDetail.id, quantity: x.quantity})) || []],
                saleItems: [...newCart.saleItems?.map(x => ({productItemDetailID: x.productItemDetail.id, quantity: x.quantity})) || []],
            }
            const res = await cartService.addToCart(cartProps)
            setCart(res.data)
            dispatch(setCartSlice(cartProps))
            dispatch(setNoti({type: 'success', message: 'Cập nhật giỏ hàng thành công'}))
        }catch{
            dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
        }
    }
    const DataSourceRent = cart?.rentItems.map((c, index) => ({
        key: String(index + 1),
        sizeProductItemId: c.productItemDetail.id,
        image: c.productItemDetail.imgUrl[0],
        name: c.productItem.name,
        price: c.productItemDetail.rentPrice,
        quantity: c.quantity,
        sizeName: c.productItemDetail.size.sizeName
    }))
    
    const ModalData = useMemo(() =>{
        const [type, id] = sizeProductItemSelect
        if(type === 'Rent'){
            return cart?.rentItems.filter(x => x.productItemDetail.id === id)[0]
        }else{
            return cart?.saleItems.filter(x => x.productItemDetail.id === id)[0]
        }
        
    }, [sizeProductItemSelect, cart])

    const totalItem = useMemo(() =>{
        let quantity = 0;
        cart?.rentItems.forEach(item => {
            quantity += item.quantity
        })
        cart?.saleItems.forEach(item => {
            quantity += item.quantity
        })
        return quantity 
    }, [cart])
    const totalPrice = useMemo(() =>{
        let price = 0;
        cart?.saleItems.forEach(item => {
            console.log({item})
            price += item.unitPrice * item.quantity
        })

        // tính tổng số ngày
        let totalRentDate = 1
        if(dateRange){
            const [d1, d2] = dateRange
            totalRentDate = d2.diff(d1, 'days')
        }
        cart?.rentItems.forEach(item => {
            price += (item.unitPrice * totalRentDate * item.quantity)
        })
        return price
    }, [cart, dateRange])

    const handleRemoveItem = async () =>{
        const [type, id] = sizeProductItemSelect
        
        const cartProps: CartProps = {
            rentItems: [...cart?.rentItems?.map(x => ({productItemDetailID: x.productItemDetail.id, quantity: x.quantity})) || []],
            saleItems: [...cart?.saleItems?.map(x => ({productItemDetailID: x.productItemDetail.id, quantity: x.quantity})) || []],
        }
        if(type === 'Rent'){
            cartProps.rentItems = cartProps.rentItems.filter(x => x.productItemDetailID !== id)
        }else{
            cartProps.saleItems = cartProps.saleItems.filter(x => x.productItemDetailID !== id)
        }

        try{
            const res = await cartService.addToCart(cartProps)
            setCart(res.data)
            dispatch(setCartSlice(cartProps))
            dispatch(setNoti({type: 'success', message: 'Cập nhật giỏ hàng thành công'}))
            setSizeProductItemSelect([])
        }catch{
            dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
        }
    }
    const handleChangeDateRange = (dates, dateStrings)=>{
        setDateRange(dates)
    }
    const handleSubmitForm = async (data: CartUserData) =>{
        setSubmited(true)
        if(cart?.rentItems.length !== 0 && !dateRange) return;

        const { recipientAddress, recipientName, recipientPhone } = data

        try{
            const listRequestOrder: Promise<any>[] = [];
            if(rentItems.length !== 0){
                const data: OrderCreate = {
                    startDateRent: dateRange ? dateRange[0].toDate() : undefined,
                    endDateRent: dateRange ? dateRange[1].toDate() : undefined,
                    itemList: rentItems,
                    rewardPointUsed: rentPoint,
                    rentOrderGroupID: null,
                    recipientAddress,
                    recipientName,
                    recipientPhone
                }
                listRequestOrder.push(orderService.createOrder(data))
            }
            if(saleItems.length !== 0){
                const data: any = {
                    itemList: saleItems,
                    rewardPointUsed: salePoint,
                    recipientAddress,
                    recipientName,
                    recipientPhone,
                    rentOrderGroupID: null,
                }
                listRequestOrder.push(orderService.createOrder(data))
            }
            await Promise.all(listRequestOrder)
            dispatch(setNoti({type: 'success', message: 'Tạo đơn hàng thành công'}))
            navigate('/checkout-success')
            dispatch(setCartSlice({rentItems: [], saleItems: []}))
        }catch{
            dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
        }
    }
    return (
        <div>
            <LandingHeader />
                <div className="main-content-not-home">
                    <div className="container-wrapper cart-wrapper">
                        <HeaderInfor title='Giỏ hàng' />
                        <section className="cart-box default-layout">
                            <div className="cart-sale">
                                <p>Cây bán</p>
                                <Table className='cart-table' dataSource={DataSourceSale} columns={ColumnSale} pagination={false} />
                                {
                                    finalSalePrice && 
                                    <div className="price-infor">
                                        <div className="price-box">
                                            <div className="left">
                                                <FaMoneyBillAlt color='#00a76f' size={25} />
                                                <span>Phí vận chuyển</span>
                                            </div>
                                            <div className="right">
                                                {finalSalePrice.transportFee}
                                            </div>
                                        </div>
                                        <div className="price-box">
                                            <div className="left">
                                                <FaMoneyBillAlt color='#00a76f' size={25} />
                                                <span>Tiền được giảm</span>
                                            </div>
                                            <div className="right">
                                                {finalSalePrice.discountAmount}
                                            </div>
                                        </div>
                                        <div className="price-box">
                                            <div className="left">
                                                <FaMoneyBillAlt color='#00a76f' size={25} />
                                                <span>Số điểm đã dùng</span>
                                            </div>
                                            <div className="right">
                                                {finalSalePrice.rewardPointUsed}
                                            </div>
                                        </div>
                                        <div className="price-box">
                                            <div className="left">
                                                <FaMoneyBillAlt color='#00a76f' size={25} />
                                                <span>Tiền cọc</span>
                                            </div>
                                            <div className="right">
                                                {finalSalePrice.deposit}
                                            </div>
                                        </div>
                                        
                                        <div className="price-box">
                                            <div className="left">
                                                <FaMoneyBillAlt color='#00a76f' size={25} />
                                                <span>Tích điểm</span>
                                            </div>
                                            <div className="right">
                                                {finalSalePrice.rewardPointGain}
                                            </div>
                                        </div>
                                        <div className="price-box">
                                            <div className="left">
                                                <FaMoneyBillAlt color='#00a76f' size={25} />
                                                <span>Tổng tiền</span>
                                            </div>
                                            <div className="right">
                                                {finalSalePrice.totalPrice}
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                            <div className="cart-rent">
                                <p>Cây cho thuê</p>
                                <Table className='cart-table' dataSource={DataSourceRent} columns={ColumnRent} pagination={false} />
                                {
                                    finalRentPrice && 
                                    <div className="price-infor">
                                        <div className="price-box">
                                            <div className="left">
                                                <FaMoneyBillAlt color='#00a76f' size={25} />
                                                <span>Phí vận chuyển</span>
                                            </div>
                                            <div className="right">
                                                {finalRentPrice.transportFee}
                                            </div>
                                        </div>
                                        <div className="price-box">
                                            <div className="left">
                                                <FaMoneyBillAlt color='#00a76f' size={25} />
                                                <span>Tiền được giảm</span>
                                            </div>
                                            <div className="right">
                                                {finalRentPrice.discountAmount}
                                            </div>
                                        </div>
                                        <div className="price-box">
                                            <div className="left">
                                                <FaMoneyBillAlt color='#00a76f' size={25} />
                                                <span>Số điểm đã dùng</span>
                                            </div>
                                            <div className="right">
                                                {finalRentPrice.rewardPointUsed}
                                            </div>
                                        </div>
                                        <div className="price-box">
                                            <div className="left">
                                                <FaMoneyBillAlt color='#00a76f' size={25} />
                                                <span>Tiền cọc</span>
                                            </div>
                                            <div className="right">
                                                {finalRentPrice.deposit}
                                            </div>
                                        </div>
                                        
                                        <div className="price-box">
                                            <div className="left">
                                                <FaMoneyBillAlt color='#00a76f' size={25} />
                                                <span>Tích điểm</span>
                                            </div>
                                            <div className="right">
                                                {finalRentPrice.rewardPointGain}
                                            </div>
                                        </div>
                                        <div className="price-box">
                                            <div className="left">
                                                <FaMoneyBillAlt color='#00a76f' size={25} />
                                                <span>Tổng tiền</span>
                                            </div>
                                            <div className="right">
                                                {finalRentPrice.totalPrice}
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                        </section>
                        <section className="cart-infor default-layout">
                            <Form
                                layout='vertical'
                                onFinish={handleSubmit(handleSubmitForm)}
                                style={{width: '500px', marginLeft: 'auto'}}
                            >
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
                                <Form.Item label='Địa chỉ' required>
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
                                <p>Số điểm của bạn là {userSate.currentPoint}</p>
                                <Form.Item label='Số điểm sử dụng cho đơn thuê'>
                                    <Input min={0} type='number' max={userSate.currentPoint - salePoint} value={rentPoint} onChange={(e) => {
                                        const value = Number(e.target.value)
                                        if((userSate.currentPoint - salePoint) > value){
                                            setRentPoint(Number(e.target.value))
                                        }
                                    }} />
                                </Form.Item>
                                <Form.Item label='Số điểm sử dụng cho đơn mua'>
                                    <Input min={0} type='number' max={0} value={salePoint} onChange={(e) => {
                                        const value = Number(e.target.value)
                                        if((userSate.currentPoint - rentPoint) > value){
                                            setSalePoint(Number(e.target.value))
                                        }
                                    }} />
                                </Form.Item>
                                <div className="box">
                                    {
                                        cart?.rentItems.length !== 0 &&
                                        <div className="cart-date-picker">
                                            <p>Chọn ngày thuê</p>
                                            <RangePicker 
                                                locale={locale} 
                                                placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
                                                format={dateFormatList}
                                                disabledDate={(current) => current && current.valueOf()  < (Date.now() + 277600000)}
                                                defaultValue={dateRange}
                                                onChange={handleChangeDateRange}
                                                status={(submited && !dateRange) ? 'error' : ''}
                                            />
                                        </div>
                                    }
                                    <p className='cart-quantity'>
                                        <span>({totalItem})</span> 
                                        sản phẩm
                                    </p>
                                    <p className='cart-total'>Tổng cộng: 
                                        {
                                            (dateRange || cart?.rentItems.length === 0) && <CurrencyFormat value={totalPrice} displayType={'text'} thousandSeparator={true} suffix={'đ'} />
                                        }
                                    </p>
                                    <button className='btn-order' type='submit'>Đặt hàng</button>
                                </div>
                            </Form>
                        </section>
                    </div>
                </div>
            <LandingFooter />
            <Modal
                open={sizeProductItemSelect.length !== 0}
                title='Xóa sản phẩm'
                onCancel={() => setSizeProductItemSelect([])}
                onOk={handleRemoveItem}
            >
                {
                    ModalData &&
                    <p>Xác nhận xóa sản phẩm 
                        <span style={{color: '#FF3333'}}> {ModalData.productItem.name}</span> có kích thước là
                        <span style={{color: '#FF3333'}}> {ModalData.productItemDetail.size.sizeName}</span> khỏi giỏ hàng?
                    </p>
                }
            </Modal>
        </div>
    )
}

export default CartPage