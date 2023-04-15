import { Segmented } from 'antd';
import LandingFooter from 'app/components/footer/LandingFooter';
import HeaderInfor from 'app/components/header-infor/HeaderInfor';
import LandingHeader from 'app/components/header/LandingHeader';
import { Cart, CartItemDetail, OrderPreview, OrderUserInfor } from 'app/models/cart';
import { OrderCreate } from 'app/models/order';
import { ShippingFee } from 'app/models/shipping-fee';
import cartService from 'app/services/cart.service';
import orderService from 'app/services/order.service';
import shippingFeeService from 'app/services/shipping-fee.service';
import { CartProps, setCartSlice, setEmptyRentCart, setEmptySaleCart } from 'app/slices/cart';
import { setNoti } from 'app/slices/notification';
// import utilCalculate from 'app/utils/order-calculate';
import pagingPath from 'app/utils/paging-path';
import 'dayjs/locale/vi';
import React, { useEffect, useMemo, useState } from 'react';
import useDispatch from '../../hooks/use-dispatch';
import { setTitle } from '../../slices/window-title';
import CONSTANT from '../../utils/constant';
import CartRent from './rent/CartRent';
import CartSale from './sale/CartSale';
import './style.scss';
import utilCalculate from 'app/utils/order-calculate';


// const dateFormat = 'DD/MM/YYYY';

const CartPage: React.FC = () => {
    const dispatch = useDispatch();

    const [cart, setCart] = useState<Cart>()

    const [shipping, setShipping] = useState<ShippingFee[]>([])

    const [pageType, setPageType] = useState('sale')

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
                const { saleItems, rentItems } = cartProps
                if(saleItems && saleItems.length !== 0 && rentItems && rentItems.length !== 0) return;

                if(rentItems && rentItems.length !== 0) {
                    console.log('asds')
                    setPageType('rent')
                }
            }catch{
                setCart({rentItems: [], saleItems: [], totalPrice: 0, totalRentPrice: 0, totalSalePrice: 0})
                dispatch(setCartSlice({rentItems: [], saleItems: []}))
            }
        }
        init()
    }, [dispatch])
    
    
    const handleChangeSegment = (value: string | number) =>{
        setPageType(`${value}`)
        
    }
    const handleCartChange = async (type: string, common: string, items: CartItemDetail[], id: string) =>{
        if(!cart) return;
        
        let cartProps: CartProps

        if(type === 'sale'){
            cartProps = {
                saleItems: items.map(x => ({productItemDetailID: x.productItemDetail.id, quantity: x.quantity})),
                rentItems: cart.rentItems.map(x => ({productItemDetailID: x.productItemDetail.id, quantity: x.quantity}))
            }
        }else{
            cartProps = {
                saleItems: cart.saleItems.map(x => ({productItemDetailID: x.productItemDetail.id, quantity: x.quantity})),
                rentItems: items.map(x => ({productItemDetailID: x.productItemDetail.id, quantity: x.quantity}))
            }
        }

        try{
            const res = await cartService.addToCart(cartProps)
            setCart(res.data)
            dispatch(setCartSlice(cartProps))
            dispatch(setNoti({type: 'success', message: 'Cập nhật giỏ hàng thành công'}))
        }catch(err: any){

            const code_101 = err.response.data.code

            if(code_101 === 101){
                if(type === 'sale' && common === '+'){
                    const [item] = cart.saleItems.filter(x => x.productItemDetail.id === id)
                    item.quantity = item.quantity - 1
                }else if(type === 'rent' && common === '+'){
                    const [item] = cart.rentItems.filter(x => x.productItemDetail.id === id)
                    item.quantity = item.quantity - 1
                }else if(type === 'sale' && common === '-'){
                    const [item] = cart.saleItems.filter(x => x.productItemDetail.id === id)
                    item.quantity = item.quantity + 1
                }else if(type === 'rent' && common === '-'){
                    const [item] = cart.rentItems.filter(x => x.productItemDetail.id === id)
                    item.quantity = item.quantity + 1
                }
                setCart({...cart})
                dispatch(setNoti({type: 'warning', message: 'Số lượng hàng trong kho không đủ'}))
                return;
            }
            dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
        }
    }
    const handleSubmitCart = async (type: string, data: OrderUserInfor, orderPreview: OrderPreview) =>{
        if(!cart) return;
        if(type === 'sale'){
            try{
                const { itemList, shippingID, rewardPointUsed, recipientAddress, isTransport, recipientName, recipientPhone } = data
                const body: OrderCreate = {itemList, shippingID, rewardPointUsed, recipientAddress, recipientName, recipientPhone, isTransport}
                const calculatorSale = await orderService.calculateOrder(body)
                console.log('sale---------', calculatorSale.data)
                console.log('sale---------',orderPreview)
                if(utilCalculate.compare2Orders(calculatorSale.data, orderPreview)){
                    await orderService.createOrder(body)
                    dispatch(setNoti({type: 'success', message: 'Tạo đơn hàng mua thành công. Vui lòng kiểm tra đơn hàng và thanh toán để nhận cây'}))
                    cart.saleItems = []
                    setCart({...cart})
                    dispatch(setEmptySaleCart())
                    console.log(true)
                }else{
                    dispatch(setNoti({type: 'info', message: 'Đã có sự thay đổi về giá. Quý khách vui lòng tải lại trang để đặt hàng'}))
                }
            }catch{
                dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
            }
        }else{
            try{
                const { startDateRent, endDateRent, shippingID, itemList, rewardPointUsed, recipientAddress, recipientName, recipientPhone, isTransport } = data
                const body: OrderCreate = {startDateRent, endDateRent, shippingID, itemList, rewardPointUsed, recipientAddress, recipientName, recipientPhone, isTransport}
                const calculatorRent = await orderService.calculateOrder(body)
                console.log('rent------', calculatorRent.data)
                console.log('rent------', orderPreview)
                if(utilCalculate.compare2Orders(calculatorRent.data, orderPreview)){
                    await orderService.createOrder(body)
                    dispatch(setNoti({type: 'success', message: 'Tạo đơn hàng thuê thành công. Vui lòng kiểm tra đơn hàng và thanh toán để nhận cây'}))
                    cart.rentItems = []
                    setCart({...cart})
                    dispatch(setEmptyRentCart())
                }else{
                    dispatch(setNoti({type: 'info', message: 'Đã có sự thay đổi về giá. Quý khách vui lòng tải lại trang để đặt hàng'}))
                }
            }catch{
                dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
            }
        }
    }

    const SaleQuantity = useMemo(() =>{
        let total = 0
        if(!cart) return 0;

        for (const item of cart.saleItems) {
            total += item.quantity
        }

        return total
    }, [cart])
    const RentQuantity = useMemo(() =>{
        let total = 0
        if(!cart) return 0;

        for (const item of cart.rentItems) {
            total += item.quantity
        }

        return total
    }, [cart])

    

    const SegmentedOptions = [
        {
            label: <div className='segmented-option'>
                <span className='title'>Cây bán</span>
                <span className='segmented-quantity'>({SaleQuantity})</span>
            </div>,
            value: 'sale'
        },
        {
            label: <div className='segmented-option'>
                <span className='title'>Cây thuê</span>
                <span className='segmented-quantity'>({RentQuantity})</span>
            </div>,
            value: 'rent'
        },
    ]

    return (
        <div>
            <LandingHeader />
                <div className="main-content-not-home">
                    <div className="container-wrapper cart-wrapper">
                        <HeaderInfor title='Giỏ hàng' />
                        <section className="default-layout">
                            <h3>Loại cây</h3>
                            <Segmented size="large" value={pageType} onChange={handleChangeSegment} options={SegmentedOptions} />
                        </section>
                        {
                            (pageType === 'sale' && cart) &&
                            <CartSale
                                items={cart.saleItems}
                                shipping={shipping}
                                onChange={handleCartChange}
                                onSubmit={handleSubmitCart}
                            />
                        }
                        {
                            (pageType === 'rent' && cart) &&
                            <CartRent
                                items={cart.rentItems}
                                shipping={shipping}
                                onChange={handleCartChange}
                                onSubmit={handleSubmitCart}
                            />
                        }
                    </div>
                </div>
            <LandingFooter />
        </div>
    )
}

export default CartPage