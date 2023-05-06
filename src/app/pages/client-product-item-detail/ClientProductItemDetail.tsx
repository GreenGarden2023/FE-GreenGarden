import { Breadcrumb, Col, Collapse, Divider, Image, Row, Tag } from 'antd';
import LandingFooter from 'app/components/footer/LandingFooter';
import LandingHeader from 'app/components/header/LandingHeader';
import React, { useEffect, useMemo, useState } from 'react';
import { AiFillStar, AiOutlineShoppingCart } from 'react-icons/ai';
import { BiPlus } from 'react-icons/bi';
import { GrFormNext, GrFormPrevious, GrFormSubtract } from 'react-icons/gr';
import { Link, useNavigate, useParams } from 'react-router-dom';
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
import { IoFlowerOutline } from 'react-icons/io5';
import { FaRegSmileBeam, FaVoteYea } from 'react-icons/fa';
import { RxAvatar } from 'react-icons/rx';
import { FeedbackGet } from 'app/models/feedback';
import feedbackService from 'app/services/feedback.service';
import utilDateTime from 'app/utils/date-time';
import LoadingView from 'app/components/loading-view/LoadingView';
import NoProduct from 'app/components/no-product/NoProduct';
import GridConfig from 'app/components/grid-config/GridConfig';

const text = `Đối với các sản phẩm cây/ bao gồm cây:\n- Chỉ giao hàng tại TP HCM`
const ClientProductItemDetail: React.FC = () => {
    const { productItemId } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const cartState = useSelector(state => state.CartStore)
    const { id, roleName } = useSelector(state => state.userInfor.user)

    const [proItem, setProItem] = useState<ProductItem>();
    const [product, setproduct] = useState<Product>();
    const [category, setCategory] = useState<Category>();
    const [sizeSelect, setSizeSelect] = useState('');
    const [quanRent, setQuanRent] = useState(1)
    const [quanSale, setQuanSale] = useState(1)
    const [feedback, setFeedback] = useState<FeedbackGet[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() =>{
        if(!productItemId || !sizeSelect || !proItem) return;

        
        const init = async () =>{
            try{
                const id = proItem.productItemDetail.filter(x => x.size.id === sizeSelect)[0].id 
                const res = await feedbackService.getListFeedbackByProductItemDetail(id)
                setFeedback(res.data)
            }catch{
                dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
            }
        }
        init()
    }, [productItemId, dispatch, sizeSelect, proItem])

    useEffect(() =>{
        pagingPath.scrollTop()
        if(!productItemId) return;

        const init = async () =>{
            setLoading(true)
            try{
                const res = await productItemService.getProductItemDetail(productItemId, 'active')
                setProItem(res.data.productItem)
                setproduct(res.data.product)
                setCategory(res.data.category)
                if(res.data.productItem){
                    if(res.data.productItem.productItemDetail.length === 0){
                        setProItem(undefined)
                    }
                    setSizeSelect(res.data.productItem.productItemDetail[0].size.id)
                }
            }catch{
                // dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
            }
            setLoading(false)
        }
        init()
    }, [productItemId, dispatch])
    
    const handleSelectSize = (sizeId: string) =>{
        setSizeSelect(sizeId)
        setQuanRent(1)
        setQuanSale(1)
    }
    const controlRent = (common: string) =>{
        if(proItem?.type === 'unique') return;

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
        if(proItem?.type === 'unique') return;

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
        return proItem.productItemDetail.filter(x => x.size.id === sizeSelect)[0]
    }, [proItem, sizeSelect])


    const handleAddCart = async (cartType: CartType, productItemDetailID: string) =>{
        // no user before
        if(!id){
            return navigate('/login', {
                state: {
                    history: `/product-item/${productItemId}`
                }
            })
        }
        const currentItem = proItem?.productItemDetail.filter(x => x.id === productItemDetailID)[0].quantity || 0
        const newData = {...cartState}
        newData.status = ''

        let finalQuantity = 0
        const indexRent = newData.rentItems.findIndex(x => x.productItemDetailID === productItemDetailID)
        const indexSale = newData.saleItems.findIndex(x => x.productItemDetailID === productItemDetailID)
        if(indexRent >= 0){
            finalQuantity += newData.rentItems[indexRent].quantity
        }
        if(indexSale >= 0){
            finalQuantity += newData.saleItems[indexSale].quantity
        }
        if(cartType === 'Rent'){
            finalQuantity += quanRent
        }
        if(cartType === 'Sale'){
            finalQuantity += quanSale
        }
        if(finalQuantity > currentItem){
            dispatch(setNoti({type: 'warning', message: 'Không thể thêm vào giỏ hàng nhiều hơn số lượng cây đang có'}))
            return
        }


        

        if(cartType === 'Sale'){
            try{
                const index = newData.saleItems.findIndex(x => x.productItemDetailID === productItemDetailID)
                if(index >= 0){
                    let data = [...newData.saleItems]
                    let nest = {...data[index]}
                    nest.quantity = nest.quantity + 1
                    data[index] = nest
                    newData.saleItems = data
                }else{
                    newData.saleItems = [...newData.saleItems, { productItemDetailID: productItemDetailID, quantity: quanSale}]
                }
                const res = await cartService.addToCart(newData)
                const cartProps: CartProps = {
                    rentItems: [...res.data.rentItems?.map(x => ({productItemDetailID: x.productItemDetail.id, quantity: x.quantity})) || []],
                    saleItems: [...res.data.saleItems?.map(x => ({productItemDetailID: x.productItemDetail.id, quantity: x.quantity})) || []],
                }
                dispatch(setCartSlice(cartProps))
                dispatch(setNoti({type: 'success', message: 'Thêm vào giỏ hàng thành công'}))
            }catch(err){
                dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
            }
        }else{
            try{
                const index = newData.rentItems.findIndex(x => x.productItemDetailID === productItemDetailID)
                if(index >= 0){
                    let data = [...newData.rentItems]
                    let nest = {...data[index]}
                    nest.quantity = nest.quantity + 1
                    data[index] = nest
                    newData.rentItems = data
                }else{
                    newData.rentItems = [...newData.rentItems, { productItemDetailID: productItemDetailID, quantity: quanRent}]
                }
                console.log({newData})
                const res = await cartService.addToCart(newData)
                const cartProps: CartProps = {
                    rentItems: [...res.data.rentItems?.map(x => ({productItemDetailID: x.productItemDetail.id, quantity: x.quantity})) || []],
                    saleItems: [...res.data.saleItems?.map(x => ({productItemDetailID: x.productItemDetail.id, quantity: x.quantity})) || []],
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
                    {
                        loading ? <LoadingView loading /> :
                        <>
                            {
                                !proItem ? <NoProduct /> : 
                                <>
                                    <section className="cpid-bread">
                                        <Breadcrumb>
                                            <Breadcrumb.Item>
                                                <Link to='/' >{CONSTANT.APP_NAME}</Link>
                                            </Breadcrumb.Item>
                                            {
                                                category && 
                                                <Breadcrumb.Item>
                                                    <Link to={`/category/${category.id}?page=1`} >{category.name}</Link>
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
                                            <GridConfig>
                                                <Row gutter={[24, 24]}>
                                                    <Col xs={24} lg={12} xl={12} sm={24} >
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
                                                                    proItem.productItemDetail.filter(x => x.size.id === sizeSelect)[0].imagesURL.map((detail, index) => (
                                                                        <div key={index} className='root-image'>
                                                                            {/* <Image src='/assets/inventory-empty.png' alt='/' /> */}
                                                                            <img src={detail} alt='/' />
                                                                        </div>
                                                                    ))
                                                                }
                                                            </Carousel>
                                                        </div>
                                                    </Col>
                                                    <Col xs={24} lg={12} xl={12} sm={24}>
                                                        <div className="right">
                                                            <div className="title title-name-wrapper">
                                                                <IoFlowerOutline size={30} color='#e91e63' />
                                                                <h1>{proItem.name}</h1>
                                                            </div>
                                                            <div className="infor-detail">
                                                                {/* proItem.description */}
                                                                <ul>
                                                                    {
                                                                        proItem?.description?.split('\n').map((item, index) => (
                                                                            <li key={index}>
                                                                                {item}
                                                                            </li>
                                                                        ))
                                                                    }
                                                                </ul>
                                                            </div>
                                                            <div className="size-wrapper">
                                                                <span className='title'>Thể loại</span>
                                                                {
                                                                    proItem.productItemDetail.map((proItemDe, i) => (
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
                                                                    {
                                                                        proItemSelectBySize.rentPrice ?
                                                                        <div className="rent-price" style={{flex: !proItemSelectBySize.salePrice ? '1' : 'initial'}}>
                                                                            <p className='title-price'>Giá thuê / ngày</p>
                                                                            <p className="price">
                                                                                <CurrencyFormat value={proItemSelectBySize.rentPrice} displayType={'text'} thousandSeparator={true} suffix={'VNĐ'} />
                                                                            </p>
                                                                            {
                                                                                (!roleName || roleName === 'Customer') &&
                                                                                <>
                                                                                    <div className="quantity">
                                                                                        <p>Số lượng</p>
                                                                                        <div className="quantity-box">
                                                                                            <button className="decrease" onClick={() => controlRent('-')}>
                                                                                                <GrFormSubtract />
                                                                                            </button>
                                                                                            <input type="number" value={quanRent} onChange={handleChangeRent} disabled={proItem.type === 'unique'} />
                                                                                            <button className="increase" onClick={() => controlRent('+')}>
                                                                                                <BiPlus />
                                                                                            </button>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="atc">
                                                                                        <button onClick={() => handleAddCart('Rent', proItemSelectBySize.id)}>
                                                                                            <AiOutlineShoppingCart size={40} />
                                                                                            <span>Thêm vào giỏ hàng</span>
                                                                                        </button>
                                                                                    </div>
                                                                                </>
                                                                            }
                                                                        </div> : undefined
                                                                    }
                                                                    {
                                                                        proItemSelectBySize.salePrice ? 
                                                                        <div className="sale-price">
                                                                            <p className='title-price'>Giá bán</p>
                                                                            <p className="price">
                                                                                <CurrencyFormat value={proItemSelectBySize.salePrice} displayType={'text'} thousandSeparator={true} suffix={'VNĐ'} />
                                                                            </p>
                                                                            {
                                                                                (!roleName || roleName === 'Customer') &&
                                                                                <>
                                                                                    <div className="quantity">
                                                                                        <p>Số lượng</p>
                                                                                        <div className="quantity-box">
                                                                                            <button className="decrease" onClick={() => controlSale('-')}>
                                                                                                <GrFormSubtract  />
                                                                                            </button>
                                                                                            <input type="number" value={quanSale} onChange={handleChangeSale} disabled={proItem.type === 'unique'} />
                                                                                            <button className="increase" onClick={() => controlSale('+')}>
                                                                                                <BiPlus  />
                                                                                            </button>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="atc">
                                                                                        <button onClick={() => handleAddCart('Sale', proItemSelectBySize.id)}>
                                                                                            <AiOutlineShoppingCart size={40} />
                                                                                            <span>Thêm vào giỏ hàng</span>
                                                                                        </button>
                                                                                    </div>
                                                                                </>
                                                                            }
                                                                        </div> : undefined
                                                                    }
                                                                </div>
                                                            }
                                                            <Divider orientation='left' plain >Chính sách</Divider>
                                                            <div className="policy">
                                                            <Collapse defaultActiveKey={['1']} ghost>
                                                                <Collapse.Panel header="Chính sách vận chuyển" key="1">
                                                                    <p className='panel-text'>
                                                                        {text}
                                                                    </p>
                                                                </Collapse.Panel>
                                                            </Collapse>
                                                            </div>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </GridConfig>
                                            {
                                                proItem && 
                                                <>
                                                    <Divider orientation='left'>
                                                        <p style={{fontSize: '36px', fontWeight: 'bold'}}>Thông tin</p>
                                                    </Divider>
                                                    <div className='product-info' dangerouslySetInnerHTML={{__html: proItem.content}} />
                                                </>
                                            }
                                        </section>
                                    }
                                    <section className="feedback-wrapper default-layout">
                                            <Divider orientation='left' >
                                                <div className='feedback-divider'>
                                                    <FaVoteYea color='#00a76f' size={25} />
                                                    <span>Đánh giá của khách hàng</span>
                                                </div>
                                            </Divider>
                                            {
                                                feedback.length === 0 ?
                                                <div className="no-feedback">
                                                    <FaRegSmileBeam color='#00a76f' size={25} />
                                                    <span>Chưa có đánh giá nào cho sản phẩm này</span>
                                                </div> : 
                                                feedback.map((fb, index) => (
                                                    <>
                                                        <div className="feedback-item" key={index}>
                                                            <div className="feedback-detail" >
                                                                <div className="left-feedback">
                                                                    <RxAvatar size={50} color='#707070' />
                                                                </div>
                                                                <div className="right-feedback">
                                                                    <p className="user-name">{fb.user.fullName}</p>
                                                                    <p className="rating">
                                                                        {
                                                                            [...Array(fb.rating)].map((_, i) => (<AiFillStar key={i} color='#f95441' />))
                                                                        }
                                                                    </p>
                                                                    <div className="images">
                                                                        <Image.PreviewGroup>
                                                                            {
                                                                                fb.imageURL.map((image, j) => (
                                                                                    <Image 
                                                                                        key={j}
                                                                                        src={image}
                                                                                        width={100}
                                                                                        height={100}
                                                                                        style={{objectFit: 'cover', borderRadius: '5px'}}
                                                                                    />
                                                                                ))
                                                                            }
                                                                        </Image.PreviewGroup>
                                                                    </div>
                                                                    <p className="comment">{fb.comment}</p>
                                                                    <p className="time">
                                                                        {utilDateTime.dateTimeToString(fb.updateDate ? fb.updateDate : fb.createDate)}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {
                                                            index !== feedback.length - 1 && <Divider ></Divider>
                                                        }
                                                    </>
                                                ))
                                            }
                                    </section>
                                </>
                            }
                        </>
                    }
                </div>
            </div>
            <LandingFooter />
        </div>
    )
}

export default ClientProductItemDetail