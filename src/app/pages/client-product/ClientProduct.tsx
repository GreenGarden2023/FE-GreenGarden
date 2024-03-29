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
import LoadingView from 'app/components/loading-view/LoadingView';
import NoProduct from 'app/components/no-product/NoProduct';
import Searching from 'app/components/search-and-filter/search/Searching';
import useSelector from 'app/hooks/use-selector';
import GridConfig from 'app/components/grid-config/GridConfig';

const ClientProduct: React.FC = () => {
    const { categoryId } = useParams()
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { search } = useSelector(state => state.SearchFilter)

    const [products, setProducts] = useState<Product[]>([])
    const [paging, setPaging] = useState<Partial<Paging>>({curPage: 1, pageSize: CONSTANT.PAGING_ITEMS.CLIENT_PRODUCT});
    const [category, setCategory] = useState<Category>();
    const [isRent, setIsRent] = useState<TypeOfSale>('rent')
    const [loading, setLoading] = useState(true)

    useEffect(() =>{
      pagingPath.scrollTop()
      const currentPage = searchParams.get('page');
  
      if(!categoryId || !currentPage || !pagingPath.isValidPaging(currentPage)) {
        return navigate(`/category/${categoryId}?page=1`, { replace: true })
      };

      if(search.isSearching && search.productName){
        const init = async () =>{
          setLoading(true)
          try{
            const res = await productServcie.getProductsBySearchText({curPage: Number(currentPage), pageSize: paging.pageSize || 20, searchText: search.productName || ''}, categoryId)
            setProducts(res.data.result)
            setPaging(res.data.paging)
            setCategory(res.data.category)
          }catch{
            dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
          }
          setLoading(false)
        }
        init()
      }else{
        const init = async () =>{
          setLoading(true)
          try{
            const res = await productServcie.getAllProduct({curPage: Number(currentPage), pageSize: paging.pageSize}, categoryId, 'active', isRent)
            setProducts(res.data.result)
            setPaging(res.data.paging)
            setCategory(res.data.category)
          }catch(err){
            dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
          }
          setLoading(false)
        }
        init();
      }
    }, [searchParams, navigate, categoryId, dispatch, isRent, paging.pageSize, search])
    
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
                  {category?.name}
                </Breadcrumb.Item>
              </Breadcrumb>
            </section>
            <section className="cp-product-infor">
              <h1>Danh sách cây tham khảo</h1>
              <div className="cp-tree-type">
                <span className={`cp-for-rent ${isRent === 'rent' ? 'active' : ''}`} onClick={() => setIsRent('rent')}>Thuê</span>
                <span className={`cp-for-sale ${isRent === 'sale' ? 'active' : ''}`} onClick={() => setIsRent('sale')}>Bán</span>
              </div>
            </section>
            <Searching 
              isProductName
              defaultUrl={`/category/${categoryId}?page=1`}
            />
            <section className="cp-box">
              {
                loading ? <LoadingView loading /> :
                <>
                  {
                    products.length === 0 ? <NoProduct /> :
                    <>
                    <GridConfig>
                      <Row gutter={[10, 10]}>
                        {
                          products.map((product, index) => (
                            <Col xs={24} sm={12} lg={24} xl={12} key={index}>
                              {/* <div className='cp-item'> */}
                                <Link to={`/product/${product.id}`} className='cp-item'>
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
                                        product.isForRent && <Tag color='#87d068' >Thuê</Tag>
                                      }
                                      {
                                        product.isForSale && <Tag color='#108ee9' >Bán</Tag>
                                      }
                                    </div>
                                  </div>
                                </Link>
                              {/* </div> */}
                            </Col>
                          ))
                        }
                      </Row>
                    </GridConfig>
                      <div className="cp-pagination">
                        <Pagination 
                          pageSize={paging?.pageSize || 1} 
                          current={paging?.curPage || 1}
                          total={paging?.recordCount || 1}
                          onChange={(page: number) =>{
                            navigate(`/category/${categoryId}?page=${page}`)
                          }}
                          hideOnSinglePage
                        />
                      </div>
                    </>
                  }
                </>
              }
            </section>
          </div>
        </div>
        <LandingFooter />
      </div>
    )
}

export default ClientProduct