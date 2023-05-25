import { FRevenue, RevenueRenderProps } from 'app/models/revenue'
import revenueService from 'app/services/revenue.service'
import React, { useEffect, useState } from 'react'
import './style.scss'
import { BsFlower2 } from 'react-icons/bs'
import MoneyFormat from '../money/MoneyFormat'
import LoadingView from '../loading-view/LoadingView'

const RevenueFirst: React.FC<RevenueRenderProps> = ({ startDate, endDate }) => {

    const [data, setData] = useState<FRevenue>()
    const [loading, setLoading] = useState(false)
    const [oldDate, setOldDate] = useState<[string, string]>(['', ''])

    useEffect(() =>{
        if(!startDate || !endDate) return;

        const init = async () =>{
            setLoading(true)
            try{
                const res = await revenueService.getRevenueFirst(startDate, endDate)
                setData(res.data)
                setOldDate([startDate, endDate])
            }catch{

            }
            setLoading(false)
        }
        init()
    }, [startDate, endDate])

    return (
        <div className='rev-first'>
            {
                loading ? <LoadingView loading /> : 
                <>
                    <h1>Thống kê doanh thu theo khoảng ngày ({oldDate[0]} - {oldDate[1]})</h1>
                    {
                        data ?
                        <div className='rev-f-wrapper'>
                            <div className="rev-f-item bg-purple">
                                <BsFlower2 className='rev-f-icon' />
                                <p className='rev-f-text'>Cây bán</p>
                                <p>
                                    <MoneyFormat value={data.saleRevenue} isHighlight color='White' />
                                </p>
                            </div>
                            <div className="rev-f-item bg-purple">
                                <BsFlower2 className='rev-f-icon' />
                                <p className='rev-f-text'>Cây thuê</p>
                                <p>
                                    <MoneyFormat value={data.rentRevenue} isHighlight color='White' />
                                </p>
                            </div>
                            <div className="rev-f-item bg-purple">
                                <BsFlower2 className='rev-f-icon' />
                                <p className='rev-f-text'>Chăm sóc tự chọn</p>
                                <p>
                                    <MoneyFormat value={data.serviceRevenue} isHighlight color='White' />
                                </p>
                            </div>
                            <div className="rev-f-item bg-purple">
                                <BsFlower2 className='rev-f-icon' />
                                <p className='rev-f-text'>Chăm sóc theo gói</p>
                                <p>
                                    <MoneyFormat value={data.serviceComboRevenue} isHighlight color='White' />
                                </p>
                            </div>
                            <div className="rev-f-item bg-purple">
                                <BsFlower2 className='rev-f-icon' />
                                <p className='rev-f-text'>Tổng tiền</p>
                                <p>
                                    <MoneyFormat value={data.totalRevenue} isHighlight color='White' />
                                </p>
                            </div>
                        </div> : 'Không có data ?? :D ??'
                    }
                </>
            }
        </div>
    )
}

export default RevenueFirst