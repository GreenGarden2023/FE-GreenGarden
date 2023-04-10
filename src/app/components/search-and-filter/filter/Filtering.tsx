import { Col, DatePicker, Row } from 'antd';
import locale from 'antd/es/date-picker/locale/vi_VN';
import useDispatch from 'app/hooks/use-dispatch';
import { FilterResult } from 'app/models/search-and-filter';
import { setEmptyFilter, setEmptySearch, setFilter, setRangeDate } from 'app/slices/search-and-filter';
import CONSTANT from 'app/utils/constant';
import { Dayjs } from 'dayjs';
import React, { useEffect, useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaIoxhost } from 'react-icons/fa';
import './style.scss';

interface FilteringProps{
    isRangeDate?: boolean;
}

const Filtering: React.FC<FilteringProps> = ({ isRangeDate }) => {
    const dispatch = useDispatch()

    const [rangeDateFilter, setRangeDateFilter] = useState<[Dayjs, Dayjs]>()

    useEffect(() =>{
        dispatch(setFilter(false))

        return () =>{
            dispatch(setEmptyFilter())
            dispatch(setEmptySearch())
        }
    }, [dispatch])

    const handleClickFilter = () =>{
        let data: FilterResult = {}

        if(isRangeDate && rangeDateFilter){
            const [start, end] = rangeDateFilter
            data.startDate = start.format('DD/MM/YYYY')
            data.endDate = end.format('DD/MM/YYYY')
            dispatch(setRangeDate({start: start.format('DD/MM/YYYY'), end: end.format('DD/MM/YYYY')}))
        }else{
            dispatch(setRangeDate({start: '', end: ''}))
        }
        
        // ----------------------
        dispatch(setFilter(true))
        dispatch(setEmptySearch())
    }

    const handleClickDefault = () =>{
        setRangeDateFilter(undefined)
        // ----------------------
        dispatch(setFilter(false))
    }

    const handleChangeDateRange = (dates, dateStrings) =>{
        setRangeDateFilter(dates)
    }


    return (
        <div className='default-layout'>
            <div className="filtering-wrapper">
                <Row gutter={[24, 24]}>
                    {
                        isRangeDate && 
                        <Col span={6}>
                            <div className='range-date'>
                                <p className='mb-5'>Chọn khoảng ngày</p>
                                <DatePicker.RangePicker 
                                    locale={locale}
                                    placeholder={["Từ ngày", "Đến ngày"]}
                                    format={CONSTANT.DATE_FORMAT_LIST}
                                    onChange={handleChangeDateRange}
                                    value={rangeDateFilter}
                                    style={{width: '100%'}}
                                />
                                {/* <Input placeholder='WS16MG56OY' value={orderCode} onChange={(e) => setOrderCode(e.target.value)} /> */}
                            </div>
                        </Col>
                    }
                    <Col span={6}>
                        <div className="filter-button-wrapper">
                            <button className='btn btn-filtering' onClick={handleClickFilter}>
                                <AiOutlineSearch size={20} />
                                <span>Lọc</span>
                            </button>
                            <button className='btn btn-filtering-clear'  onClick={handleClickDefault}>
                                <FaIoxhost size={20} />
                                <span>Mặc định</span>
                            </button>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export default Filtering