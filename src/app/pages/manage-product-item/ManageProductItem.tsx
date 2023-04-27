import { Badge, Col, Pagination, Row, Switch, Tooltip } from 'antd';
import ModalProductItemDetail from 'app/components/modal/product-item-detail/ModalProductItemDetail';
import ModalProductItem from 'app/components/modal/product-item/ModalProductItem';
import useDispatch from 'app/hooks/use-dispatch';
import { Status } from 'app/models/general-type';
import { Paging } from 'app/models/paging';
import { Product } from 'app/models/product';
import { ProductItem, ProductItemDetailHandle } from 'app/models/product-item';
import productItemService from 'app/services/product-item.service';
import { setNoti } from 'app/slices/notification';
import CONSTANT from 'app/utils/constant';
import pagingPath from 'app/utils/paging-path';
import React, { useEffect, useState } from 'react';
import CurrencyFormat from 'react-currency-format';
import { AiFillEdit, AiOutlinePlusSquare } from 'react-icons/ai';
import { IoCreateOutline } from 'react-icons/io5';
import { MdPointOfSale } from 'react-icons/md';
import { SiConvertio } from 'react-icons/si';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import './style.scss';

const ManageProductItem: React.FC = () => {
    const { productId } = useParams()
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [productItems, setProductItems] = useState<ProductItem[]>([])
    const [product, setProduct] = useState<Product>()
    const [paging, setPaging] = useState<Paging>();
    const [openModal, setOpenModal] = useState(0);

    const [productIndex, setProductIndex] = useState(-1)
    const [productDetailIndex, setProductDetailIndex] = useState(-1)

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
                const res = await productItemService.getProductItemByManager({curPage: Number(currentPage), pageSize: CONSTANT.PAGING_ITEMS.PRODUCT_ITEM}, productId)
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
        setOpenModal(1)
        // setProductItemSelected(undefined)
    }

    const handleCloseModal = () =>{
        setOpenModal(0)
        setProductIndex(-1)
        setProductDetailIndex(-1)
    }

    const handleSubmitProductItem = (productItem: ProductItem) =>{
        const index = productItems.findIndex(x => x.id === productItem.id)
        if(index < 0){
            // create
            setProductItems([...productItems, productItem])
        }else{
            // update
            setProductItems(productItems.map(x => x.id === productItem.id ? productItem : x))
        }
        handleCloseModal()
    }
    const handleSubmitProductItemDetail = async (productItemDetail: ProductItemDetailHandle) =>{
        try{
            const currentPage = searchParams.get('page');
            const res = await productItemService.getAllProductItem({curPage: Number(currentPage), pageSize: CONSTANT.PAGING_ITEMS.PRODUCT_ITEM}, {productID: productId || ''})
            setProductItems(res.data.productItems)
            setPaging(res.data.paging)
            setProduct(res.data.product)
        }catch(err){
            dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE}))
        }
    }
    const handleCreateProductItemDetail = (parentIndex: number) =>{
        const productItem = productItems[parentIndex]
        const type = productItem.type
        const numOfChild = productItem.productItemDetail.length

        if(type === 'unique' && numOfChild >= 1){
            dispatch(setNoti({type: 'info', message: 'Không thể tạo thêm thông tin chi tiết cho loại cây "duy nhất"'}))
            return
        }

        setOpenModal(2)
        setProductIndex(parentIndex)
        // setProductItemIdSelected(productItemId)
    }

    const handleChangeStatus = async (pIndex: number, Cindex: number, checked: boolean) =>{
        try{
            const productItemDetailId = productItems[pIndex].productItemDetail[Cindex].id
            const status: Status = checked ? 'active' : 'disable'
            await productItemService.changeStatusProductDetail(productItemDetailId, status)
            dispatch(setNoti({type: 'success', message: 'Cập nhật trạng thái thành công'}))
            productItems[pIndex].productItemDetail[Cindex].status = status
            setProductItems([...productItems])
        }catch{
            dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
        }
    }
    return (
        <div className="mpi-wrapper">
            <section className="mpi-product-infor default-layout">
                <h1>{product?.name}</h1>
            </section>
            <section className="mpi-search-wrapper default-layout">
                {/* <FilterBox sizeFilter /> */}
                <div className="mpi-btn-wrapper">
                    <button onClick={handleCreateProduct} className='btn-create'>
                        <IoCreateOutline size={20} />
                        Tạo mới một sản phẩm
                    </button>
                </div>
            </section>
            <section className="mpi-box default-layout">
                <Row gutter={[12, 12]}>
                    {
                        productItems.map((pt, index) => (
                            <Col xs={24} xl={4} key={index}>
                                <Badge.Ribbon color={pt.type === 'normal' ? 'blue' : 'green'} placement='start' text={pt.type === 'normal' ? 'Số lượng lớn' : 'Duy nhất'} >
                                    <div className="mpi-item">
                                        <img src={pt.imageURL} alt='/' />
                                        <div className="mpi-item-infor">
                                            <p className="name">{pt.name}</p>
                                            {
                                                pt.productItemDetail.map((item, indexItem) => (
                                                    <div className="item-detail" key={indexItem}>
                                                        <p className="size-name">{item.size.sizeName} ({item.quantity})</p>
                                                        {
                                                            (item.salePrice && item.salePrice !== 0) ?
                                                            <>
                                                                <p className="sale-price">
                                                                    <SiConvertio color='#00a76f' size={20} />
                                                                    <span className='label'>Giá bán</span>
                                                                    <CurrencyFormat value={item.salePrice} displayType={'text'} thousandSeparator={true} suffix={'VNĐ'} className='price' />
                                                                </p>
                                                            </> : ''
                                                        }
                                                        {
                                                            (item.rentPrice && item.rentPrice !== 0) ?
                                                            <p className="rent-price">
                                                                <MdPointOfSale color='#00a76f' size={20} />
                                                                <span className="label">Giá thuê</span>
                                                                <CurrencyFormat value={item.rentPrice} displayType={'text'} thousandSeparator={true} suffix={'VNĐ'} className='price' />
                                                            </p> : ''
                                                        }
                                                        <div className="actions-wrapper">
                                                            <Switch onChange={(e) => handleChangeStatus(index, indexItem, e)} checked={item.status === 'active'} className="status" />
                                                            <button className='btn btn-update' onClick={() => {
                                                                setOpenModal(2)
                                                                setProductIndex(index)
                                                                setProductDetailIndex(indexItem)
                                                                // setProductItemIdSelected(pt.id)
                                                                // setProductItemDetailSelected(item)
                                                            }}>
                                                                Chỉnh sửa
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                        <div className="mpi-actions">
                                            <div className="mpi-box">
                                                <Tooltip title="Chỉnh sửa thông tin sản phẩm" color='#108ee9'>
                                                    <AiFillEdit color='#5cb9d8' size={20} cursor='pointer' style={{marginRight: '5px'}} onClick={() => {
                                                        setOpenModal(1)
                                                        setProductIndex(index)
                                                        // setProductItemSelected(pt)
                                                    }} />
                                                </Tooltip>
                                                <Tooltip title="Tạo mới thông tin chi tiết" color='#108ee9'>
                                                    <AiOutlinePlusSquare color='#5cb9d8' size={20} cursor='pointer' onClick={() => handleCreateProductItemDetail(index)} />
                                                </Tooltip>
                                            </div>
                                        </div>
                                    </div>
                                </Badge.Ribbon>
                            </Col>
                        ))
                    }
                </Row>
                <div style={{marginTop: '10px', textAlign: 'center'}}>
                    <Pagination
                        pageSize={paging?.pageSize || 1}
                        current={paging?.curPage || 1}
                        total={paging?.recordCount || 1}
                        onChange={(page: number) =>{navigate(`/panel/manage-product-item/${product?.id}?page=${page}`)}}
                    />
                </div>
            </section>
            {
                openModal === 1 && 
                <ModalProductItem 
                    productId={product?.id || ''}
                    productItem={productItems[productIndex]}
                    onClose={handleCloseModal}
                    onSubmit={handleSubmitProductItem}
                />
            }
            {
                openModal === 2 &&
                <ModalProductItemDetail
                    productItem={productItems[productIndex]}
                    productDetailIndex={productDetailIndex}
                    isRent={product?.isForRent || false}
                    isSale={product?.isForSale || false}
                    onClose={handleCloseModal}
                    onSubmit={handleSubmitProductItemDetail}
                />
            }
        </div>
    )
}

export default ManageProductItem