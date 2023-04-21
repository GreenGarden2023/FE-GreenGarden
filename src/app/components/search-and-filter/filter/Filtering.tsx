import { Col, Input, Row, Select } from 'antd';
import useDispatch from 'app/hooks/use-dispatch';
import { Role } from 'app/models/general-type';
import { setEmptyFilter, setEmptySearch, setFilter, setRangeDate, setRole } from 'app/slices/search-and-filter';
import CONSTANT from 'app/utils/constant';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaIoxhost } from 'react-icons/fa';
import './style.scss';

interface FilteringProps{
    isRangeDate?: boolean;
    isRole?: boolean;
}

const Filtering: React.FC<FilteringProps> = ({ isRangeDate, isRole }) => {
    const dispatch = useDispatch()

    const [rangeDateNew, setRangeDateNew] = useState<number>()
    // const [rangeDateFilter, setRangeDateFilter] = useState<[Dayjs, Dayjs]>()
    const [roleFilter, setRoleFilter] = useState<Role>()

    useEffect(() =>{
        dispatch(setFilter(false))

        return () =>{
            dispatch(setEmptyFilter())
            dispatch(setEmptySearch())
        }
    }, [dispatch])

    const handleClickFilter = () =>{

        if(isRangeDate && rangeDateNew){
            const current = new Date()
            const start = dayjs(current).format('DD/MM/YYYY')
            current.setDate(current.getDate() + rangeDateNew)
            const end = dayjs(current).format('DD/MM/YYYY')
            dispatch(setRangeDate({start, end}))
        }

        // if(isRangeDate && rangeDateFilter){
        //     const [start, end] = rangeDateFilter
        //     data.startDate = start.format('DD/MM/YYYY')
        //     data.endDate = end.format('DD/MM/YYYY')
        //     dispatch(setRangeDate({start: start.format('DD/MM/YYYY'), end: end.format('DD/MM/YYYY')}))
        // }else{
        //     dispatch(setRangeDate({start: '', end: ''}))
        // }
        
        if(isRole && roleFilter){
            dispatch(setRole(roleFilter))
        }

        // ----------------------
        dispatch(setFilter(true))
        dispatch(setEmptySearch())
    }

    const handleClickDefault = () =>{
        setRangeDateNew(undefined)
        // setRangeDateFilter(undefined)
        setRoleFilter(undefined)
        // ----------------------
        dispatch(setFilter(false))
    }

    // const handleChangeDateRange = (dates, dateStrings) =>{
    //     // setRangeDateFilter(dates)
    // }

    const handleSelectRole = (value: Role) =>{
        setRoleFilter(value)
    }

    return (
        <div className='default-layout'>
            <div className="filtering-wrapper">
                <Row gutter={[24, 24]}>
                    {
                        isRangeDate && 
                        <Col span={6}>
                            <div className='range-date'>
                                <p className='mb-5'>Chọn khoảng ngày từ hôm này</p>
                                <Input type='number'min={1} value={rangeDateNew} onChange={(e) => setRangeDateNew(Number(e.target.value))} />
                                {/* <DatePicker.RangePicker 
                                    locale={locale}
                                    placeholder={["Từ ngày", "Đến ngày"]}
                                    format={CONSTANT.DATE_FORMAT_LIST}
                                    onChange={handleChangeDateRange}
                                    value={rangeDateFilter}
                                    style={{width: '100%'}}
                                /> */}
                                {/* <Input placeholder='WS16MG56OY' value={orderCode} onChange={(e) => setOrderCode(e.target.value)} /> */}
                            </div>
                        </Col>
                    }
                    {
                        isRole &&
                        <Col span={6}>
                            <div className="role">
                                <p className='mb-5'>Chọn vai trò</p>
                                <Select value={roleFilter} onChange={handleSelectRole} style={{ width: '100%' }} placeholder='Customer' >
                                    {
                                        CONSTANT.ROLES_DECLARE.map((item, index) => (
                                            <Select.Option value={item} key={index} >{item}</Select.Option>
                                        ))
                                    }
                                </Select>
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