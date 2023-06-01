import { RevenueRenderProps, TRevenue } from 'app/models/revenue'
import revenueService from 'app/services/revenue.service'
import React, { useEffect, useState } from 'react'
import { BsFlower2 } from 'react-icons/bs'
import LoadingView from '../loading-view/LoadingView'
import MoneyFormat from '../money/MoneyFormat'
import './style.scss'

const RevenueThird: React.FC<RevenueRenderProps> = ({ startDate, endDate }) => {

    const [data, setData] = useState<TRevenue>()
    const [loading, setLoading] = useState(false)
    const [oldDate, setOldDate] = useState<[string, string]>(['', ''])

    useEffect(() =>{
        if(!startDate || !endDate) return;

        const init = async () =>{
            setLoading(true)
            try{
                const res = await revenueService.getRevenueThird(startDate, endDate)
                setData(res.data)
                setOldDate([startDate, endDate])
            }catch{

            }
            setLoading(false)
        }
        init()
    }, [startDate, endDate])

    return (
        <div className='rev-second'>
            {
                loading ? <LoadingView loading /> : 
                <>
                    <h1>Thống kê các cây cho thuê nhiều nhất theo khoảng ngày ({oldDate[0]} - {oldDate[1]})</h1>
                    <div className="rev-s-wrapper">
                        {
                            data?.itemDetailRevenue.map((item, index) => (
                                <div className="rev-s-item" key={index}>
                                    <div className="rev-s-img">
                                        <img src={item.productItemDetail.product.imageURL} alt="/" />
                                    </div>
                                    <div className="rev-s-content">
                                        <p className="rev-s-name">{item.productItemDetail.product.productItem.productItemName} - {item.productItemDetail.size.sizeName}</p>
                                        <p className="rev-s-quantity">
                                            Số lượng thuê: {item.quantity} cây
                                        </p>
                                        <p className="rev-s-total">
                                            <span className='rev-s-title-total'>Doanh thu</span>
                                            <MoneyFormat value={item.revenueProductItemDetail} color='Blue' isHighlight />
                                        </p>
                                    </div>
                                </div>
                            ))
                        }
                        <div className="rev-s-item rev-s-sumary">
                            <BsFlower2 className='rev-s-icon' />
                            <p className='rev-s-sum-title'>Tổng doanh thu</p>
                            <p><MoneyFormat value={data?.rentRevenue || 0} color='White' isHighlight /></p>
                        </div>
                    </div>
                </>
            }
        </div>
    )
}

export default RevenueThird