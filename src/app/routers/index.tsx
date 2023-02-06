import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from '../pages/landing-page/LandingPage';
import Product from '../pages/products/Product';

const Routers: React.FC = () =>{
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/:slug" element={<Product />} />
        </Routes>
    );
}

export default Routers;