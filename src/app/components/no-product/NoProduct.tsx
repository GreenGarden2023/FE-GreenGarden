import React from 'react'
import './style.scss';

const NoProduct: React.FC = () => {
  return (
    <div className='no-product-wrapper'>
        <img src="/assets/no-product-found.png" alt="/" />
        <h1>Hiện tại chưa có sản phẩm nào</h1>
    </div>
  )
}

export default NoProduct