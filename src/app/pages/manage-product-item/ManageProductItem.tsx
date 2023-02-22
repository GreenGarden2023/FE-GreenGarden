import { Col, Row } from 'antd';
// import useDispatch from 'app/hooks/use-dispatch';
import React from 'react'
// import { useNavigate, useSearchParams } from 'react-router-dom';
import CurrencyFormat from 'react-currency-format';
import './style.scss';
// import { Product } from 'app/models/product';
// import { setNoti } from 'app/slices/notification';
// import CONSTANT from 'app/utils/constant';
// import productServcie from 'app/services/product.service';

const ManageProductItem: React.FC = () => {
    // const dispatch = useDispatch();
    // const navigate = useNavigate();
    // const [searchParams] = useSearchParams();

    // const [products, setProducts] = useState<Product[]>([])

    // useEffect(() =>{
    //     const init = async () =>{
    //         try{
    //             const res = await productServcie.getAllProduct()
    //         }catch(err){
    //             dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE}))
    //         }
    //     }
    //     init();
    // }, [dispatch])

    return (
        <div className="mpi-wrapper">
            <section className="mpi-product-infor">
                <h1>Hoa giấy</h1>
            </section>
            <section className="mpi-search-wrapper">

            </section>
            <section className="mpi-box">
                <Row gutter={[12, 12]}>
                    {
                        [...Array(8)].map((_, index) => (
                            <Col xs={24} xl={6} key={index}>
                                <div className="mpi-item">
                                    <img src="/assets/inventory-empty.png" alt="/" />
                                    <div className="mpi-item-infor">
                                        <p className="name">Hoa giấy {index + 1}</p>
                                        <div className="size-quantiy-box">
                                            <div className='size'>
                                                <span>Size:</span>
                                                <span>Small</span>
                                            </div>
                                            <div className="quantity">
                                                <span>Quantity:</span>
                                                <span>300</span>
                                            </div>
                                        </div>
                                        <div className="price-box">
                                            <span>Price:</span>
                                            <span>
                                                <CurrencyFormat value={500000} displayType={'text'} thousandSeparator={true} suffix={'VNĐ'} />
                                                {/* {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(100000000)} */}
                                            </span>
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
        </div>
    )
}

export default ManageProductItem