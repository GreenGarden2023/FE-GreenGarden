import LandingHeader from 'app/components/header/LandingHeader';
import useDispatch from 'app/hooks/use-dispatch';
import { Category } from 'app/models/category';
import { Paging } from 'app/models/paging';
import { setNoti } from 'app/slices/notification';
import CONSTANT from 'app/utils/constant';
import pagingPath from 'app/utils/paging-path';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import categoryService from 'app/services/category.service';
import './style.scss';
import { Breadcrumb, Col, Pagination, Row } from 'antd';
import LandingFooter from 'app/components/footer/LandingFooter';

const ClientCategory: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch()

    const [categories, setCategories] = useState<Category[]>([]);
    const [paging, setPaging] = useState<Paging>();

    useEffect(() =>{
        const currentPage = searchParams.get('page');
        if(!pagingPath.isValidPaging(currentPage)) return navigate('/category?page=1')

        const init = async () =>{
            try{
                const res = await categoryService.getAllCategoryByStatus({curPage: Number(currentPage), pageSize: CONSTANT.PAGING_ITEMS.CLIENT_CATEGORY}, 'active')
                setCategories(res.data.result)
                setPaging(res.data.paging)
            }catch(err){
                dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE}))
            }
        }
        pagingPath.scrollTop()
        init();
    }, [searchParams, navigate, dispatch])

  return (
    <div>
        <LandingHeader />
        <div className="main-content-not-home">
            <div className="container-wrapper rc-wrapper">
                <section className="rc-bread">
                    <Breadcrumb>
                        <Breadcrumb.Item>
                            <Link to='/' >Store</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            Category
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </section>
                <section className="rc-product-infor default-layout">
                    <h1>Category</h1>
                </section>
                <section className="rc-box default-layout">
                    <Row align='middle' gutter={[12, 12]} >
                        {
                            categories.map((category, index) =>(
                                <Col  key={index} xs={24} xl={6} >
                                    <div className="rc-item">
                                        <Link to={`/product/${category.id}?page=1`} >
                                            <img 
                                                src={category.imgUrl} alt='/' 
                                                onError={({currentTarget }) => {
                                                    currentTarget.onerror = null
                                                    currentTarget.src = '/assets/inventory-empty.png'
                                                }}  
                                            />
                                            <span>{category.name}</span>
                                            <p className='description'>{category.description}</p>
                                        </Link>
                                    </div>
                                </Col>
                            ))
                        }
                    </Row>
                    <div className="rc-pagination">
                        <Pagination 
                            pageSize={paging?.pageSize || 1}  
                            total={paging?.recordCount || 1} 
                            current={paging?.curPage || 1}
                            onChange={
                                (page: number) =>{
                                    navigate(`/rental-category?page=${page}`)
                                    pagingPath.scrollTop()
                                }
                            }
                        />
                    </div>
                </section>
            </div>
        </div>
        <LandingFooter />
    </div>
  )
}

export default ClientCategory