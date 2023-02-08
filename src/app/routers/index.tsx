import { notification } from 'antd';
import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import useSelector from '../hooks/use-selector';
import LandingPage from '../pages/landing-page/LandingPage';
import Product from '../pages/products/Product';
import { AiFillCheckCircle } from 'react-icons/ai';
import Register from '../pages/register/Register';
import Login from '../pages/login/Login';
import TermOfService from '../pages/term-of-services/TermOfServices';
import Cart from '../pages/cart/Cart';
import CONSTANT from '../utils/constant';
import useDispatch from '../hooks/use-dispatch';
import { setNoti } from '../slices/notification';
import authService from '../services/auth.service';
import { setUser } from '../slices/user-infor';
import ThankYou from '../pages/thank-you/ThankYou';

/* eslint-disable react-hooks/exhaustive-deps */
const Routers: React.FC = () =>{
    const dispatch = useDispatch();

    const windowTitle = useSelector(state => state.windowTitle);
    const notiState = useSelector(state => state.notification);

    const [api, contextHolder] = notification.useNotification();
    useEffect(() =>{
        const tokenInLocal = localStorage.getItem(CONSTANT.STORAGE.ACCESS_TOKEN)
        if(!tokenInLocal) return;

        const getUserDetailInit = async () =>{
            try{
                const res = await authService.getUserDetail();
                const resData = {
                    ...res.data,
                    token: tokenInLocal
                }
                dispatch(setUser(resData))
            }catch(err: any){
                if(err.response.status){
                    localStorage.removeItem(CONSTANT.STORAGE.ACCESS_TOKEN)
                    return;
                }
                dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE})) 
            }
        }
        getUserDetailInit();
    }, [])

    useEffect(() =>{
        if(!windowTitle) return;
        document.title = windowTitle
    }, [windowTitle])

    useEffect(() =>{
        if(!notiState.message) return;
        const { type, message, description } = notiState
        api[type]({
            message,
            description,
            icon: <AiFillCheckCircle style={{fill: '#33CC00'}} />
        })
    }, [notiState, api])

    return (
        <>
            {contextHolder}
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path='/register' element={<Register />} />
                <Route path='/login' element={<Login />} />
                <Route path='/term-of-services' element={<TermOfService />} />
                <Route path='/cart' element={<Cart />} />
                <Route path='/thankyou' element={<ThankYou />} />
                <Route path="/:slug" element={<Product />} />
            </Routes>
        </>
    );
}

export default Routers;