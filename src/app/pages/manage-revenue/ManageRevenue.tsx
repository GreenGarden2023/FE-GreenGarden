import React, { useMemo, useState } from 'react'
import './style.scss'
import { BiLaptop } from 'react-icons/bi'
import { MdAlignVerticalTop } from 'react-icons/md'
import { BsGraphUp } from 'react-icons/bs'
import { VscGraph } from 'react-icons/vsc'
import { DatePicker, Divider } from 'antd'
import dayjs, { Dayjs } from 'dayjs'
import locale from 'antd/es/date-picker/locale/vi_VN';
import CONSTANT from 'app/utils/constant'
import utilDateTime from 'app/utils/date-time'
import RevenueFirst from 'app/components/revenue/RevenueFirst'
import { RevenueRenderProps } from 'app/models/revenue'
import RevenueSecond from 'app/components/revenue/RevenueSecond'
import RevenueThird from 'app/components/revenue/RevenueThird'
import RevenueFour from 'app/components/revenue/RevenueFour'

const start = new Date()
start.setMonth(start.getMonth() - 1)
const end = new Date()

const ManageRevenue: React.FC = () => {

    const [revType, setRevType] = useState(1)
    const [rangeDate, setRangeDate] = useState<[Dayjs | null, Dayjs | null]>([dayjs(start), dayjs(end)])

    const handleSetRevType = (rev: number) =>{
        setRevType(rev)
    }

    const handleChangeRangeDate = (dates, dateStrings) =>{
        const newDate = dates as [Dayjs, Dayjs]
        if(!newDate){
            setRangeDate([null, null])
        }else{
            setRangeDate([newDate[0], newDate[1]])
        }
    }

    const RevDateRange = useMemo(() =>{
        const [ start, end ] = rangeDate

        const data: RevenueRenderProps = {
            startDate: start ? utilDateTime.dayjsToLocalStringTemp(start) : undefined,
            endDate: end ? utilDateTime.dayjsToLocalStringTemp(end) : undefined,
        }

        return data
    }, [rangeDate])

    return (
        <div className='rev-wrapper'>
            <section className="default-layout">
                <div className="rev-select">
                    <div className={`rev-item ${revType === 1 ? 'active' : ''}`} onClick={() => handleSetRevType(1)}>
                        <BiLaptop className='rev-icon' />
                        <p className='rev-text'>Thống kê doanh thu theo khoảng ngày</p>
                    </div>
                    <div className={`rev-item ${revType === 2 ? 'active' : ''}`} onClick={() => handleSetRevType(2)}>
                        <MdAlignVerticalTop className='rev-icon' />
                        <p className='rev-text'>Thống kê các cây có doanh thu theo khoảng ngày</p>
                    </div>
                    <div className={`rev-item ${revType === 3 ? 'active' : ''}`} onClick={() => handleSetRevType(3)}>
                        <BsGraphUp className='rev-icon' />
                        <p className='rev-text'>Thống kê các cây cho thuê nhiều nhất theo khoảng ngày</p>
                    </div>
                    <div className={`rev-item ${revType === 4 ? 'active' : ''}`} onClick={() => handleSetRevType(4)}>
                        <VscGraph className='rev-icon' />
                        <p className='rev-text'>Thống kê các cây bán nhiều nhất theo khoảng ngày</p>
                    </div>
                </div>
                <Divider></Divider>
                <div className="rev-date-time">
                    <div className="rev-date-time-block">
                        <p>Chọn khoảng thời gian</p>
                        <DatePicker.RangePicker
                            locale={locale}
                            placeholder={["Từ ngày", "Đến ngày"]}
                            format={CONSTANT.DATE_FORMAT_LIST}
                            defaultValue={rangeDate}
                            onChange={handleChangeRangeDate}
                            className='rev-date'
                        />
                    </div>
                </div>
            </section>
            <section className="default-layout">
                {
                    revType === 1 && <RevenueFirst {...RevDateRange} />
                }
                {
                    revType === 2 && <RevenueSecond {...RevDateRange} />
                }
                {
                    revType === 3 && <RevenueThird {...RevDateRange} />
                }
                {
                    revType === 4 && <RevenueFour {...RevDateRange} />
                }
            </section>
        </div>
    )
}

export default ManageRevenue