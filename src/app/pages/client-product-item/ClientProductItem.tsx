import { Breadcrumb, Col, Row } from 'antd';
import LandingFooter from 'app/components/footer/LandingFooter';
import LandingHeader from 'app/components/header/LandingHeader';
import useDispatch from 'app/hooks/use-dispatch';
import { Paging } from 'app/models/paging';
import { ProductItem } from 'app/models/product-item';
import { setNoti } from 'app/slices/notification';
import CONSTANT from 'app/utils/constant';
import pagingPath from 'app/utils/paging-path';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import './style.scss';
import productItemService from 'app/services/product-item.service';
import { Product } from 'app/models/product';
import { Category } from 'app/models/category';
import utilGeneral from 'app/utils/general';
import PriceBox from 'app/components/price-box/PriceBox';

const ClientProductItem: React.FC = () => {
    const { productId } = useParams()
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useDispatch()

    const [productItems, setProductItems] = useState<ProductItem[]>([])
    const [product, setProduct] = useState<Product>()
    const [category, setCategory] = useState<Category>()
    const [paging, setPaging] = useState<Paging>();
    console.log(paging)
    useEffect(() =>{
        pagingPath.scrollTop()
        const currentPage = searchParams.get('page');
        if(!productId){
            return navigate('/category')
        }
        if(!pagingPath.isValidPaging(currentPage)){
            return navigate(`/category/${productId}/product-item?page=1`)
        }

        const init = async () =>{
            try{
                const res = await productItemService.getAllProductItem({curPage: Number(currentPage), pageSize: CONSTANT.PAGING_ITEMS.CLIENT_PRODUCT_ITEM}, {
                    productID: productId,
                    status: 'active',
                })
                setProductItems(res.data.productItems)
                setPaging(res.data.paging)
                setProduct(res.data.product)
                setCategory(res.data.category)
            }catch{
                dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE}))
            }
        }
        init();

    }, [productId, dispatch, navigate, searchParams])

    return (
        <div>
            <LandingHeader />
            <div className="main-content-not-home">
                <div className="container-wrapper cpi-wrapper">
                    <section className="cpo-bread">
                        <Breadcrumb>
                            <Breadcrumb.Item>
                                <Link to='/' >{CONSTANT.APP_NAME}</Link>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                <Link to='/category' >Category</Link>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                <Link to={`/product/${category?.id}?page=1`} >{category?.name}</Link>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                {product?.name}
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </section>
                    <section className="cpo-product-infor default-layout">
                        <h1>Reference list</h1>
                        <div className="cpo-tree-type">
                            {/* <span className={`cp-for-rent ${isRent === 'rent' ? 'active' : ''}`} onClick={() => setIsRent('rent')}>For Rent</span>
                            <span className={`cp-for-sale ${isRent === 'sale' ? 'active' : ''}`} onClick={() => setIsRent('sale')}>For Sale</span> */}
                        </div>
                    </section>
                    <section className="cpi-box default-layout">
                        <Row gutter={[10, 10]}>
                            {
                                productItems.map((proItem, index) => (
                                    <Col xs={24} xl={6} key={index} className='col-item'>
                                        <Link to={`/product-item/${proItem.id}`} className='cp-item'>
                                            <img src={proItem.imageURL} alt="/" onError={utilGeneral.setDefaultImage} />
                                            <p className='pro-name'>{proItem.name}</p>
                                            <div className="price-box">
                                                {
                                                    proItem.productItemDetail.map((pItem, i) => (
                                                        <PriceBox key={i} sizeName={pItem.size.sizeName} rentPrice={pItem.rentPrice || 0} salePrice={pItem.salePrice || 0} />
                                                    ))
                                                }
                                            </div>
                                        </Link>
                                    </Col>
                                ))
                            }
                        </Row>
                    </section>
                </div>
            </div>
            <LandingFooter />
        </div>
    )
}

export default ClientProductItem