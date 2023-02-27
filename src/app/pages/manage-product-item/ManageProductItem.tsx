import { Col, Row, Tag } from 'antd';
import useDispatch from 'app/hooks/use-dispatch';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import CurrencyFormat from 'react-currency-format';
import './style.scss';
import { setNoti } from 'app/slices/notification';
import CONSTANT from 'app/utils/constant';
// import productServcie from 'app/services/product.service';
import { ProductItem } from 'app/models/product-item';
import productItemService from 'app/services/product-item.service';
import pagingPath from 'app/utils/paging-path';
import { Paging } from 'app/models/paging';
import { IoCreateOutline } from 'react-icons/io5';
import ModalProductItem from 'app/components/modal/product-item/ModalProductItem';
import { Action } from 'app/models/general-type';
import { Product } from 'app/models/product';

const ManageProductItem: React.FC = () => {
    const { productId } = useParams()
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [productItems, setProductItems] = useState<ProductItem[]>([])
    const [product, setProduct] = useState<Product>()
    const [paging, setPaging] = useState<Paging>();
    const [action, setAction] = useState<Action>('');
    console.log(paging)
    useEffect(() =>{
        const currentPage = searchParams.get('page');
        if(!productId){
            return navigate('/panel/manage-product')
        }
        if(!pagingPath.isValidPaging(currentPage) || !productId){
            navigate(`/panel/manage-product-item/${productId}?page=1`)
            return;
        }

        const init = async () =>{
            try{
                const res = await productItemService.getAllProductItem({curPage: Number(currentPage), pageSize: CONSTANT.PAGING_ITEMS.PRODUCT_ITEM}, {productID: productId})
                setProductItems(res.data.productItems)
                setPaging(res.data.paging)
                setProduct(res.data.product)
            }catch(err){
                dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE}))
            }
        }
        init();
    }, [dispatch, navigate, searchParams, productId])

    const handleCreateProduct = () =>{
        setAction('Create')
    }

    const handleCloseModal = () =>{
        setAction('')
    }

    return (
        <div className="mpi-wrapper">
            <section className="mpi-product-infor default-layout">
                <h1>{product?.name}</h1>
            </section>
            <section className="mpi-search-wrapper default-layout">
                <div className="mpi-btn-wrapper">
                    <button onClick={handleCreateProduct} className='btn-create'>
                        <IoCreateOutline size={20} />
                        Create a product item
                    </button>
                </div>
            </section>
            <section className="mpi-box default-layout">
                <Row gutter={[12, 12]}>
                    {
                        productItems.map((pt, index) => (
                            <Col xs={24} xl={6} key={index}>
                                <div className="mpi-item">
                                    <img src={pt.imgURLs[0]} alt="/" />
                                    <div className="mpi-item-infor">
                                        <p className="name">{pt.name}</p>
                                        <div className="size-quantiy-box">
                                            <div className='size'>
                                                <span>Size:</span>
                                                <Tag color='#108ee9' title='Small' >Small</Tag>
                                            </div>
                                            <div className="quantity">
                                                <span>Quantity:</span>
                                                <Tag color='#108ee9' title='Small' >{pt.quantity}</Tag>
                                            </div>
                                        </div>
                                        <div className="price-box">
                                            <div className="sale-price">
                                                <span>Sale price:</span>
                                                <span>
                                                    <CurrencyFormat value={pt.salePrice} displayType={'text'} thousandSeparator={true} suffix={'VNĐ'} />
                                                </span>
                                            </div>
                                            <div className="rent-price">
                                                <span>Rent price:</span>
                                                <span>
                                                    <CurrencyFormat value={pt.rentPrice} displayType={'text'} thousandSeparator={true} suffix={'VNĐ'} />
                                                </span>
                                            </div>
                                        </div>
                                        <div className="btn-box">
                                            <button className='btn-detail'>Detail</button>
                                            <button className='btn-edit'>Edit</button>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        ))
                    }
                </Row>
            </section>
            <ModalProductItem 
                action={action}
                open={action !== ''}
                onClose={handleCloseModal}
                productIdSelected={productId || ''}
            />
        </div>
    )
}

export default ManageProductItem