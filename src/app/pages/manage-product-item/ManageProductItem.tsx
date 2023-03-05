import { Col, Row } from 'antd';
import useDispatch from 'app/hooks/use-dispatch';
import { setNoti } from 'app/slices/notification';
import CONSTANT from 'app/utils/constant';
import React, { useEffect, useState } from 'react';
import CurrencyFormat from 'react-currency-format';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import './style.scss';
import ModalProductItem from 'app/components/modal/product-item/ModalProductItem';
import { Action } from 'app/models/general-type';
import { Paging } from 'app/models/paging';
import { Product } from 'app/models/product';
import { ProductItem } from 'app/models/product-item';
import productItemService from 'app/services/product-item.service';
import pagingPath from 'app/utils/paging-path';
import { IoCreateOutline } from 'react-icons/io5';
import { MdPointOfSale } from 'react-icons/md';
import { SiConvertio } from 'react-icons/si';

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
        navigate(`/panel/manage-product-item/${product?.id}/create`)
    }

    const handleCloseModal = () =>{
        setAction('')
    }
    console.log(productItems)
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
                                    {/* <img src={pt.sizeModeList[0].} alt="/" /> */}
                                    <img src='/assets/inventory-empty.png' alt='/' />
                                    <div className="mpi-item-infor">
                                        <p className="name">{pt.name}</p>
                                        {
                                            pt.sizeModelList.map((item, indexItem) => (
                                                <div className="item-detail" key={indexItem}>
                                                    <p className="size-name">{item.size.sizeName} ({item.quantity})</p>
                                                    
                                                    <p className="sale-price">
                                                        <SiConvertio color='#00a76f' size={20} />
                                                        <span className='label'>Sale price</span>
                                                        <CurrencyFormat value={item.salePrice} displayType={'text'} thousandSeparator={true} suffix={'VNĐ'} className='price' />
                                                    </p>
                                                    <p className="rent-price">
                                                        <MdPointOfSale color='#00a76f' size={20} />
                                                        <span className="label">Rent price</span>
                                                        <CurrencyFormat value={item.rentPrice} displayType={'text'} thousandSeparator={true} suffix={'VNĐ'} className='price' />
                                                    </p>
                                                </div>
                                            ))
                                        }
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
                // action={action}
                open={action !== ''}
                onClose={handleCloseModal}
                productIdSelected={productId || ''}
            />
        </div>
    )
}

export default ManageProductItem