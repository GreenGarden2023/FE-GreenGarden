import React from 'react';
import CurrencyFormat from 'react-currency-format';
import './style.scss'

interface PriceBoxProps{
    sizeName: string;
    rentPrice: number;
    salePrice: number;
}

const PriceBox: React.FC<PriceBoxProps> = ({ sizeName, rentPrice, salePrice }) =>{
    return (
        <div className='pb-wrapper'>
            <div className="pb-box">
                <p className="name">{sizeName}</p>
                {
                    (salePrice !== 0) && 
                    <div className="sale-price">
                        <span className='title'>Giá bán</span>
                        <CurrencyFormat className='value' value={salePrice} displayType={'text'} thousandSeparator={true} suffix={'đ'} />
                    </div>
                }
                {
                    (rentPrice !== 0) && 
                    <div className="rent-price">
                        <span className='title'>Giá thuê</span>
                        <CurrencyFormat className='value' value={rentPrice} displayType={'text'} thousandSeparator={true} suffix={'đ/ngày'} />
                    </div>
                }
            </div>
        </div>
    );
}

export default PriceBox;