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

const Routers: React.FC = () =>{
    const windowTitle = useSelector(state => state.windowTitle);
    const notiState = useSelector(state => state.notification);
    const [api, contextHolder] = notification.useNotification();

    useEffect(() =>{
        if(!windowTitle) return;
        document.title = windowTitle
    }, [windowTitle])

    useEffect(() =>{
        if(!notiState.description) return;
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
                <Route path="/:slug" element={<Product />} />
            </Routes>
        </>
    );
}

export default Routers;