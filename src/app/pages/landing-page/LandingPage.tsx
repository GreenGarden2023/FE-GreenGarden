import React, { useEffect, useState } from 'react';
import LandingHeader from '../../components/header/LandingHeader';
import './style.scss';
import LandingFooter from '../../components/footer/LandingFooter';
import useDispatch from '../../hooks/use-dispatch';
import { setTitle } from '../../slices/window-title';
import CONSTANT from '../../utils/constant';
import LandingWidget from '../../components/widget/LandingWidget';
import About from '../../components/about/About';
import Slider from "react-slick";
import { Category } from 'app/models/category';
import categoryService from 'app/services/category.service';
import { setNoti } from 'app/slices/notification';
import { Link } from 'react-router-dom';
import { Divider } from 'antd';
import { AiFillStar } from 'react-icons/ai';
import { GrFormNext, GrFormPrevious } from 'react-icons/gr';
import LoadingView from 'app/components/loading-view/LoadingView';

const LandingPage: React.FC = () =>{
    const dispatch = useDispatch();
    
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false)

    useEffect(() =>{
        dispatch(setTitle(CONSTANT.APP_NAME))
    }, [dispatch])
    
    useEffect(() =>{
        const init = async () =>{
            setLoading(true)
            try{
                const res = await categoryService.getAllCategoryByStatus({curPage: 1, pageSize: CONSTANT.PAGING_ITEMS.CLIENT_CATEGORY}, 'active')
                setCategories(res.data.result)
            }catch(err){
                dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
            }
            setLoading(false)
        }
        init()
    }, [dispatch])

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        nextArrow: <GrFormNext />,
        prevArrow: <GrFormPrevious />
    };
    return (
        <div>
            <LandingHeader />
            <div className="main-content">
                <section className="banner-content">
                    <div className="content">
                        <div className="title">
                            <h1>Green Expert</h1>
                            <h3>Green Garden</h3>
                        </div>
                    </div>
                </section>
                <section className="category-wrapper">
                    <div className="container-wrapper">
                        {
                            loading ? <LoadingView loading /> : 
                            <>
                                <Divider >
                                    <div className='divider-item'>
                                        <AiFillStar color='#b06c67' size={30} />
                                        <span>Các loại cây ở cửa hàng</span>
                                    </div>
                                </Divider>
                                <Slider {...settings}>
                                    {
                                        categories.map((item, index) => (
                                            <div key={index} className='category-item'>
                                                <Link to={`/category/${item.id}?page=1`}>
                                                    <img src={item.imgUrl} alt="/" className='category-image' />
                                                    <div className="category-infor">
                                                        <p>{item.name}</p>
                                                    </div>
                                                </Link>
                                            </div>
                                        ))
                                    }
                                </Slider>
                            </>
                        }
                    </div>
                </section>
                <LandingWidget index={1} url='take-care-service' backgroundUrl='/assets/widget-1.jpg' />
                {/* <LandingWidget index={2} url='/take-care-service' backgroundUrl='/assets/widget-2.jpg' /> */}
                <About />
                {/* <Divider className='divider-custom'>Posts</Divider>
                <div className="post">
                    <div className="--item">
                        <img src={} alt="" />
                    </div>
                </div> */}
            </div>
            <LandingFooter />
        </div>
    );
}

export default LandingPage;