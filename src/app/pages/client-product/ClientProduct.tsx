import { Breadcrumb, Col, Pagination, Row, Tag } from 'antd';
import LandingFooter from 'app/components/footer/LandingFooter';
import LandingHeader from 'app/components/header/LandingHeader';
import useDispatch from 'app/hooks/use-dispatch';
import { Category } from 'app/models/category';
import { TypeOfSale } from 'app/models/general-type';
import { Paging } from 'app/models/paging';
import { Product } from 'app/models/product';
import productServcie from 'app/services/product.service';
import { setNoti } from 'app/slices/notification';
import CONSTANT from 'app/utils/constant';
import utilGeneral from 'app/utils/general';
import pagingPath from 'app/utils/paging-path';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import './style.scss';

const ClientProduct: React.FC = () => {
    const { categoryId } = useParams()
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useDispatch()

    const [products, setProducts] = useState<Product[]>([])
    const [paging, setPaging] = useState<Paging>();
    const [category, setCategory] = useState<Category>();
    const [isRent, setIsRent] = useState<TypeOfSale>('rent')

    useEffect(() =>{
      pagingPath.scrollTop()
      const currentPage = searchParams.get('page');
  
      if(!categoryId || !currentPage || !pagingPath.isValidPaging(currentPage)) {
        return navigate(`/category?page=1`)
      };

      const init = async () =>{
        try{
          const res = await productServcie.getAllProduct({curPage: Number(currentPage), pageSize: CONSTANT.PAGING_ITEMS.CLIENT_PRODUCT}, categoryId, 'active', isRent)
          setProducts(res.data.result)
          setPaging(res.data.paging)
          setCategory(res.data.category)
        }catch(err){
          dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE}))
        }
      }
      init();
    }, [searchParams, navigate, categoryId, dispatch, isRent])
    
    return (
      <div>
        <LandingHeader />
        <div className="main-content-not-home">
          <div className="container-wrapper cp-wrapper">
            <section className="cp-bread">
              <Breadcrumb>
                <Breadcrumb.Item>
                  <Link to='/' >{CONSTANT.APP_NAME}</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                  <Link to='/category' >Category</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                  {category?.name}
                </Breadcrumb.Item>
              </Breadcrumb>
            </section>
            <section className="cp-product-infor">
              <h1>Reference list</h1>
              <div className="cp-tree-type">
                <span className={`cp-for-rent ${isRent === 'rent' ? 'active' : ''}`} onClick={() => setIsRent('rent')}>For Rent</span>
                <span className={`cp-for-sale ${isRent === 'sale' ? 'active' : ''}`} onClick={() => setIsRent('sale')}>For Sale</span>
              </div>
            </section>
            <section className="cp-box">
              <Row gutter={[10, 10]}>
                {
                  products.map((product, index) => (
                    <Col xs={24} xl={12} key={index}>
                      {/* <div className='cp-item'> */}
                        <Link to={`/product/${product.id}?page=1`} className='cp-item'>
                          <div className="left">
                            <img src={product.imgUrl} alt="/" onError={utilGeneral.setDefaultImage}  />
                          </div>
                          <div className="right">
                            <h3 className='name'>{product.name}</h3>
                            <p className="description">
                              {product.description}
                            </p>
                            <div className="tags-box">
                              {
                                product.isForRent && <Tag color='#87d068' >For Rent</Tag>
                              }
                              {
                                product.isForSale && <Tag color='#108ee9' >For Sale</Tag>
                              }
                            </div>
                          </div>
                        </Link>
                      {/* </div> */}
                    </Col>
                  ))
                }
              </Row>
              <div className="cp-pagination">
                <Pagination 
                  pageSize={paging?.pageSize || 1} 
                  current={paging?.curPage || 1}
                  total={paging?.recordCount || 1}
                  onChange={(page: number) =>{
                    navigate(`/category/${categoryId}?page=${page}`)
                  }}
                />
              </div>
            </section>
          </div>
        </div>
        <LandingFooter />
      </div>
    )
}

export default ClientProduct