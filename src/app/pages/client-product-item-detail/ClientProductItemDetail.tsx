import { Breadcrumb, Col, Collapse, Divider, Row, Tag } from 'antd';
import LandingFooter from 'app/components/footer/LandingFooter';
import LandingHeader from 'app/components/header/LandingHeader';
import React, { useEffect, useMemo, useState } from 'react';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { BiPlus } from 'react-icons/bi';
import { GrFormNext, GrFormPrevious, GrFormSubtract } from 'react-icons/gr';
import { Link, useParams } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './style.scss';
import CONSTANT from 'app/utils/constant';
import CurrencyFormat from 'react-currency-format';
import productItemService from 'app/services/product-item.service';
import { ProductItem } from 'app/models/product-item';
import useDispatch from 'app/hooks/use-dispatch';
import { CartProps, setCartSlice } from 'app/slices/cart';
import { CartType } from 'app/models/general-type';
import cartService from 'app/services/cart.service';
import useSelector from 'app/hooks/use-selector';
import { setNoti } from 'app/slices/notification';
import { Product } from 'app/models/product';
import { Category } from 'app/models/category';
import pagingPath from 'app/utils/paging-path';

const text = `Đối với các sản phẩm cây/ bao gồm cây:\n- Chỉ giao hàng tại TP HCM\nĐối với các sản phẩm chậu, phụ kiện, vật tư:\n- Có giao hàng COD toàn quốc\n- Được kiểm tra hàng khi nhận hàng`
const ClientProductItemDetail: React.FC = () => {
    const { productItemId } = useParams()
    const dispatch = useDispatch()
    const cartState = useSelector(state => state.CartStore)

    const [proItem, setProItem] = useState<ProductItem>();
    const [product, setproduct] = useState<Product>();
    const [category, setCategory] = useState<Category>();
    const [sizeSelect, setSizeSelect] = useState('');
    const [quanRent, setQuanRent] = useState(1)
    const [quanSale, setQuanSale] = useState(1)


    useEffect(() =>{
        pagingPath.scrollTop()
        if(!productItemId) return;
        const init = async () =>{
            try{
                const res = await productItemService.getProductItemDetail(productItemId, 'active')
                setProItem(res.data.productItem)
                setproduct(res.data.product)
                setCategory(res.data.category)
                setSizeSelect(res.data.productItem.sizeModelList[0].size.id)
            }catch{
                dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
            }
        }
        init()
    }, [productItemId, dispatch])
    
    const handleSelectSize = (sizeId: string) =>{
        setSizeSelect(sizeId)
        setQuanRent(1)
        setQuanSale(1)
    }
    const controlRent = (common: string) =>{
        if(common === '+'){
            setQuanRent(pre => Number(pre) + 1)
        }else{
            if(quanRent <= 1){
                return
            }
            setQuanRent(pre => Number(pre) - 1)
        }
    }
    const handleChangeRent = (event: any) =>{
        const value = event.target.value
        if(value <= 1){
            setQuanRent(1)
            return
        }
        if(value > 100){
            return
        }
        setQuanRent(value)
    }
    
    const controlSale = (common: string) =>{
        if(common === '+'){
            setQuanSale(pre => Number(pre) + 1)
        }else{
            if(quanSale <= 1){
                return
            }
            setQuanSale(pre => Number(pre) - 1)
        }
    }

    const handleChangeSale = (event: any) =>{
        const value = event.target.value
        if(value <= 1){
            setQuanSale(1)
            return
        }
        if(value > 100){
            return
        }
        setQuanSale(value)
    }
    
    const proItemSelectBySize = useMemo(() =>{
        if(!proItem) return
        return proItem.sizeModelList.filter(x => x.size.id === sizeSelect)[0]
    }, [proItem, sizeSelect])


    const handleAddCart = async (cartType: CartType, sizeProductItemId: string) =>{
        const newData = {...cartState}

        if(cartType === 'Sale'){
            try{
                const index = newData.saleItems.findIndex(x => x.sizeProductItemID === sizeProductItemId)
                if(index >= 0){
                    let data = [...newData.saleItems]
                    let nest = {...data[index]}
                    nest.quantity = nest.quantity + 1
                    data[index] = nest
                    newData.saleItems = data
                }else{
                    newData.saleItems = [...newData.saleItems, { sizeProductItemID: sizeProductItemId, quantity: quanSale}]
                }
                console.log({newData})
                const res = await cartService.addToCart(newData)
                const cartProps: CartProps = {
                    rentItems: [...res.data.rentItems?.map(x => ({sizeProductItemID: x.sizeProductItem.id, quantity: x.quantity})) || []],
                    saleItems: [...res.data.saleItems?.map(x => ({sizeProductItemID: x.sizeProductItem.id, quantity: x.quantity})) || []],
                }
                dispatch(setCartSlice(cartProps))
                dispatch(setNoti({type: 'success', message: 'Thêm vào giỏ hàng thành công'}))
            }catch(err){
                dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
            }
        }else{
            try{
                const index = newData.rentItems.findIndex(x => x.sizeProductItemID === sizeProductItemId)
                if(index >= 0){
                    let data = [...newData.rentItems]
                    let nest = {...data[index]}
                    nest.quantity = nest.quantity + 1
                    data[index] = nest
                    newData.rentItems = data
                }else{
                    newData.rentItems = [...newData.rentItems, { sizeProductItemID: sizeProductItemId, quantity: quanSale}]
                }
                console.log({newData})
                const res = await cartService.addToCart(newData)
                const cartProps: CartProps = {
                    rentItems: [...res.data.rentItems?.map(x => ({sizeProductItemID: x.sizeProductItem.id, quantity: x.quantity})) || []],
                    saleItems: [...res.data.saleItems?.map(x => ({sizeProductItemID: x.sizeProductItem.id, quantity: x.quantity})) || []],
                }
                // dispatch(addToCart({cartType: 'Sale', item: {sizeProductItemID: id, quantity: quanSale}}))
                dispatch(setCartSlice(cartProps))
                dispatch(setNoti({type: 'success', message: 'Thêm vào giỏ hàng thành công'}))
            }catch{
                dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
            }
        }
    }
    return (
        <div>
            <LandingHeader />
            <div className="main-content-not-home">
                <div className="container-wrapper cpid-wrapper">
                    <section className="cpid-bread">
                        <Breadcrumb>
                            <Breadcrumb.Item>
                                <Link to='/' >{CONSTANT.APP_NAME}</Link>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                <Link to='/category' >Category</Link>
                            </Breadcrumb.Item>
                            {
                                category && 
                                <Breadcrumb.Item>
                                    <Link to={`/product/${category.id}?page=1`} >{category.name}</Link>
                                </Breadcrumb.Item> 
                            }
                            {
                                product && 
                                <Breadcrumb.Item>
                                    <Link to={`/product/${product.id}?page=1`} >{product.name}</Link>
                                </Breadcrumb.Item> 
                            }
                            {
                                proItem &&
                                <Breadcrumb.Item>
                                    {proItem.name}
                                </Breadcrumb.Item>
                            }
                        </Breadcrumb>
                    </section>
                    {
                        proItem && 
                        <section className="cpid-product-infor default-layout">
                            <Row gutter={[24, 24]}>
                                <Col xs={12} xl={12}>
                                    {/* <div className="left">
                                        <img src="/assets/inventory-empty.png" alt="/" className='img-main-view' />
                                    </div> */}
                                    <div className="left carousel-warpper">
                                        <Carousel 
                                            infiniteLoop 
                                            useKeyboardArrows 
                                            showIndicators={false}
                                            renderArrowPrev={(clickHandler) => (
                                                <div className='pre-custom' onClick={clickHandler}>
                                                    <GrFormPrevious className='pre-icon' />
                                                </div>
                                            )}
                                            renderArrowNext={(clickHandler) => (
                                                <div className='next-custom' onClick={clickHandler}>
                                                    <GrFormNext className='next-icon' />
                                                </div>
                                            )}
                                        >
                                            {
                                                [...Array(10)].map((_, index) => (
                                                    <div key={index}>
                                                        {/* <Image src='/assets/inventory-empty.png' alt='/' /> */}
                                                        <img src="/assets/inventory-empty.png" alt='/' />
                                                    </div>
                                                ))
                                            }
                                        </Carousel>
                                    </div>
                                </Col>
                                <Col xs={12} xl={12}>
                                    <div className="right">
                                        <div className="title">
                                            <h1>{proItem.name}</h1>
                                        </div>
                                        <div className="infor-detail">
                                            {/* proItem.description */}
                                            <ul>
                                                <li>Kích thước chậu / Item dimensions (W x H): 15x17cm</li>
                                                <li>Chất liệu chậu / Pot Material: Men / Ceramic</li>
                                                <li>Tổng chiều cao / Total height: ~35cm</li>
                                                <li>Giá sản phẩm không bao gồm đĩa lót chậu (The saucer is not included)</li>
                                            </ul>
                                        </div>
                                        <div className="size-wrapper">
                                            <span className='title'>Kích thước</span>
                                            {
                                                proItem.sizeModelList.map((proItemDe, i) => (
                                                    <Tag style={{cursor: 'pointer'}} color={proItemDe.size.id === sizeSelect ? '#00a76f' : ''} key={i} onClick={() => handleSelectSize(proItemDe.size.id)} >{proItemDe.size.sizeName}</Tag>
                                                ))
                                            }
                                        </div>
                                        <div className="num-tree">
                                            <span className='title'>Số lượng cây còn lại</span>
                                            <span className='result'>{proItemSelectBySize?.quantity}</span>
                                        </div>
                                        {
                                            proItemSelectBySize && 
                                            <div className="price-box">
                                                <div className="rent-price">
                                                    <p className='title-price'>Rent price</p>
                                                    <p className="price">
                                                        <CurrencyFormat value={proItemSelectBySize.rentPrice} displayType={'text'} thousandSeparator={true} suffix={'VNĐ'} />
                                                    </p>
                                                    <div className="quantity">
                                                        <p>Quantity</p>
                                                        <div className="quantity-box">
                                                            <button className="decrease" onClick={() => controlRent('-')}>
                                                                <GrFormSubtract />
                                                            </button>
                                                            <input type="number" value={quanRent} onChange={handleChangeRent} />
                                                            <button className="increase" onClick={() => controlRent('+')}>
                                                                <BiPlus />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="atc">
                                                        <button onClick={() => handleAddCart('Rent', proItemSelectBySize.id)}>
                                                            <AiOutlineShoppingCart size={40} />
                                                            <span>Add to cart</span>
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="sale-price">
                                                    <p className='title-price'>Sale price</p>
                                                    <p className="price">
                                                        <CurrencyFormat value={proItemSelectBySize.salePrice} displayType={'text'} thousandSeparator={true} suffix={'VNĐ'} />
                                                    </p>
                                                    <div className="quantity">
                                                        <p>Quantity</p>
                                                        <div className="quantity-box">
                                                            <button className="decrease" onClick={() => controlSale('-')}>
                                                                <GrFormSubtract  />
                                                            </button>
                                                            <input type="number" value={quanSale} onChange={handleChangeSale} />
                                                            <button className="increase" onClick={() => controlSale('+')}>
                                                                <BiPlus  />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="atc">
                                                        <button onClick={() => handleAddCart('Sale', proItemSelectBySize.id)}>
                                                            <AiOutlineShoppingCart size={40} />
                                                            <span>Add to cart</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        <Divider orientation='left' plain >Policy</Divider>
                                        <div className="policy">
                                        <Collapse defaultActiveKey={['1']} ghost>
                                            <Collapse.Panel header="Delivery policy" key="1">
                                                <p className='panel-text'>
                                                    {text}
                                                </p>
                                            </Collapse.Panel>
                                        </Collapse>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            {
                                proItemSelectBySize && 
                                <>
                                    <Divider orientation='left'>
                                        <p style={{fontSize: '36px', fontWeight: 'bold'}}>Product information</p>
                                    </Divider>
                                    <div dangerouslySetInnerHTML={{__html: proItemSelectBySize.content}} />
                                </>
                            }
                        </section>
                    }
                </div>
            </div>
            <LandingFooter />
        </div>
    )
}

export default ClientProductItemDetail