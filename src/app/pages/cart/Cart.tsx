import { DatePicker, Image, Modal } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import LandingFooter from 'app/components/footer/LandingFooter';
import HeaderInfor from 'app/components/header-infor/HeaderInfor';
import LandingHeader from 'app/components/header/LandingHeader';
import { Cart } from 'app/models/cart';
import cartService from 'app/services/cart.service';
import { CartProps, setCartSlice } from 'app/slices/cart';
import { setNoti } from 'app/slices/notification';
import React, { useEffect, useMemo, useState } from 'react';
import { BiPlus } from 'react-icons/bi';
import { GrFormSubtract } from 'react-icons/gr';
import useDispatch from '../../hooks/use-dispatch';
import { setTitle } from '../../slices/window-title';
import CONSTANT from '../../utils/constant';
import './style.scss';
import 'dayjs/locale/vi';
import locale from 'antd/es/date-picker/locale/vi_VN';
import { CiSquareRemove } from 'react-icons/ci'
import pagingPath from 'app/utils/paging-path';
import CurrencyFormat from 'react-currency-format';
import { Dayjs } from "dayjs";
import orderService from 'app/services/order.service';
import { OrderCreate } from 'app/models/order';
import useSelector from 'app/hooks/use-selector';
import { useNavigate } from 'react-router-dom';

const { RangePicker } = DatePicker;
const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY', 'DD-MM-YYYY', 'DD-MM-YY'];
const dateFormat = 'DD/MM/YYYY';

const CartPage: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { rentItems, saleItems } = useSelector(state => state.CartStore)
    const [cart, setCart] = useState<Cart>()
    const [sizeProductItemSelect, setSizeProductItemSelect] = useState<string[]>([])
    const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>()
    const [submited, setSubmited] = useState(false);

    useEffect(() =>{
        pagingPath.scrollTop()
        dispatch(setTitle(`${CONSTANT.APP_NAME} | Cart`))
    }, [dispatch])

    useEffect(() =>{
        const init = async () =>{
            try{
                const result = await cartService.getCart()
                setCart(result.data)
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
                    src={value}
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
            align: 'center',
        },
        {
            title: 'Kích thước',
            key: 'sizeName',
            dataIndex: 'sizeName',
            align: 'center',
            
        },
        {
            title: 'Giá',
            key: 'price',
            dataIndex: 'price',
            align: 'center',
        },
        {
            title: 'Đơn vị',
            key: 'unit',
            dataIndex: 'unit',
            align: 'center',
            render: () => ('Cây')
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
            title: 'Xóa',
            key: 'delete',
            dataIndex: 'delete',
            align: 'center',
            render: (_, record) => (
                <CiSquareRemove size={30} color='#FF3333' style={{cursor: 'pointer'}} onClick={() => setSizeProductItemSelect(['Sale', record.sizeProductItemId])} />
            )
        }
    ]
    console.log(sizeProductItemSelect)
    const controlSale = async (sizeProductItemId: string, common: string) =>{
        console.log({sizeProductItemId, common})
        const newCart = {...cart}

        if(!newCart) return

        const sizeProductItemIdIndex = cart?.saleItems.findIndex(x => x.sizeProductItem.id === sizeProductItemId)
        
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
                rentItems: [...newCart.rentItems?.map(x => ({sizeProductItemID: x.sizeProductItem.id, quantity: x.quantity})) || []],
                saleItems: [...newCart.saleItems?.map(x => ({sizeProductItemID: x.sizeProductItem.id, quantity: x.quantity})) || []],
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
        sizeProductItemId: c.sizeProductItem.id,
        image: c.sizeProductItem.imgUrl[0],
        name: c.productItem.name,
        price: c.sizeProductItem.salePrice,
        quantity: c.quantity,
        sizeName: c.sizeProductItem.size.sizeName
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
            align: 'center',
            // width: 200
        },
        {
            title: 'Kích thước',
            key: 'size',
            dataIndex: 'size',
            align: 'center',
            render: (value, record, index) => (record.sizeName)
            // width: 200
        },
        {
            title: 'Giá',
            key: 'price',
            dataIndex: 'price',
            align: 'center',
            // width: 200
        },
        {
            title: 'Đơn vị',
            key: 'unit',
            dataIndex: 'unit',
            align: 'center',
            render: () => ('Ngày')
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

        const sizeProductItemIdIndex = cart?.rentItems.findIndex(x => x.sizeProductItem.id === sizeProductItemId)
        
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
                rentItems: [...newCart.rentItems?.map(x => ({sizeProductItemID: x.sizeProductItem.id, quantity: x.quantity})) || []],
                saleItems: [...newCart.saleItems?.map(x => ({sizeProductItemID: x.sizeProductItem.id, quantity: x.quantity})) || []],
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
        sizeProductItemId: c.sizeProductItem.id,
        image: c.sizeProductItem.imgUrl[0],
        name: c.productItem.name,
        price: c.sizeProductItem.rentPrice,
        quantity: c.quantity,
        sizeName: c.sizeProductItem.size.sizeName
    }))
    
    const ModalData = useMemo(() =>{
        const [type, id] = sizeProductItemSelect
        if(type === 'Rent'){
            return cart?.rentItems.filter(x => x.sizeProductItem.id === id)[0]
        }else{
            return cart?.saleItems.filter(x => x.sizeProductItem.id === id)[0]
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
    console.log({totalPrice})

    const handleRemoveItem = async () =>{
        const [type, id] = sizeProductItemSelect
        
        const cartProps: CartProps = {
            rentItems: [...cart?.rentItems?.map(x => ({sizeProductItemID: x.sizeProductItem.id, quantity: x.quantity})) || []],
            saleItems: [...cart?.saleItems?.map(x => ({sizeProductItemID: x.sizeProductItem.id, quantity: x.quantity})) || []],
        }
        if(type === 'Rent'){
            cartProps.rentItems = cartProps.rentItems.filter(x => x.sizeProductItemID !== id)
        }else{
            cartProps.saleItems = cartProps.saleItems.filter(x => x.sizeProductItemID !== id)
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
    const handleCreateOrder = async () =>{
        setSubmited(true)
        if(cart?.rentItems.length !== 0 && !dateRange) return;
        try{
            const orderProps: OrderCreate = {
                rentItems,
                saleItems,
                startRentDate: dateRange ? dateRange[0].format(dateFormat) : '',
                endRentDate: dateRange ? dateRange[1].format(dateFormat) : '',
            }
            await orderService.createOrder(orderProps)
            dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
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
                            </div>
                            <div className="cart-rent">
                                <p>Cây cho thuê</p>
                                <Table className='cart-table' dataSource={DataSourceRent} columns={ColumnRent} pagination={false} />
                            </div>
                        </section>
                        <section className="cart-infor default-layout">
                            <div className="box">
                                {
                                    cart?.rentItems.length !== 0 &&
                                    <div className="cart-date-picker">
                                        <p>Chọn ngày thuê</p>
                                        <RangePicker 
                                            locale={locale} 
                                            placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
                                            format={dateFormatList}
                                            disabledDate={(current) => current && current.valueOf() < Date.now()}
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
                                <button className='btn-order' onClick={handleCreateOrder}>Đặt hàng</button>
                            </div>
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
                        <span style={{color: '#FF3333'}}> {ModalData.sizeProductItem.size.sizeName}</span> khỏi giỏ hàng?
                    </p>
                }
            </Modal>
        </div>
    )
}

export default CartPage