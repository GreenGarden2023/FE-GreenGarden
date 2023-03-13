import React, { useEffect } from 'react';
import LandingHeader from '../../components/header/LandingHeader';
import './style.scss';
import LandingFooter from '../../components/footer/LandingFooter';
import useDispatch from '../../hooks/use-dispatch';
import { setTitle } from '../../slices/window-title';
import CONSTANT from '../../utils/constant';
import LandingWidget from '../../components/widget/LandingWidget';
import About from '../../components/about/About';

const LandingPage: React.FC = () =>{
    const dispatch = useDispatch();

    useEffect(() =>{
        dispatch(setTitle(CONSTANT.APP_NAME))
    }, [dispatch])
    
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
                <LandingWidget index={1} url='/category' backgroundUrl='/assets/widget-1.jpg' />
                <LandingWidget index={2} url='/take-care-service' backgroundUrl='/assets/widget-2.jpg' />
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