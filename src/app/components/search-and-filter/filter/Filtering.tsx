import { Col, Input, Row, Select } from 'antd';
import GridConfig from 'app/components/grid-config/GridConfig';
import useDispatch from 'app/hooks/use-dispatch';
import { Role, TakeCareStatus } from 'app/models/general-type';
import { setEmptyFilter, setEmptySearch, setFilter, setFilterValues } from 'app/slices/search-and-filter';
import CONSTANT from 'app/utils/constant';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaIoxhost } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './style.scss';

interface FilteringProps{
    isRangeDate?: boolean;
    isOrderToDay?: boolean;
    isRole?: boolean;
    isNextDay?: boolean;
    defaultUrl: string;
}

const Filtering: React.FC<FilteringProps> = ({ isRangeDate, isOrderToDay, isRole, isNextDay, defaultUrl }) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [rangeDateNew, setRangeDateNew] = useState<number>()
    // const [rangeDateFilter, setRangeDateFilter] = useState<[Dayjs, Dayjs]>()
    const [roleFilter, setRoleFilter] = useState<Role>()
    const [statusRequest, setStatusRequest] = useState<TakeCareStatus>('pending')
    const [nextDayFilter, setNextDayFilter] = useState<boolean>(false)

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
            
            dispatch(setFilterValues({
                isFiltering: true,
                startDate: start,
                endDate: end,
                nextDay: nextDayFilter,
                role: roleFilter,
                takeCareStatus: statusRequest
            }))

            return;
        }

        dispatch(setFilterValues({
            isFiltering: true,
            nextDay: nextDayFilter,
            role: roleFilter,
            takeCareStatus: statusRequest
        }))
    }

    const handleClickDefault = () =>{
        setRangeDateNew(undefined)
        // setRangeDateFilter(undefined)
        setRoleFilter(undefined)
        setStatusRequest('pending')
        setNextDayFilter(false)
        // ----------------------
        dispatch(setFilter(false))
        navigate(defaultUrl)
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
                <GridConfig>
                    <Row gutter={[24, 24]}>
                        {
                            isRangeDate && 
                            <Col span={6}>
                                <div className='range-date'>
                                    <p className='mb-5'>Chọn khoảng ngày từ hôm nay</p>
                                    <Input type='number'min={1} value={rangeDateNew} onChange={(e) => {
                                        if(!e.target.value || Number(e.target.value) < 0){
                                            setRangeDateNew(0)
                                        }else{
                                            setRangeDateNew(Number(e.target.value))
                                        }
                                    }} />
                                </div>
                            </Col>
                        }
                        {
                            isOrderToDay &&
                            <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={6}>
                                <div className='order-today'>
                                    <p className='mb-5'>Chọn trạng thái chăm sóc hôm nay</p>
                                    <Select value={statusRequest} onChange={(e) => setStatusRequest(e)} style={{ width: '100%' }} placeholder='Đã chăm sóc' >
                                        <Select.Option value='pending'>
                                            Chưa chăm sóc
                                        </Select.Option>
                                        <Select.Option value='done'>
                                            Đã chăm sóc
                                        </Select.Option>
                                    </Select>
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
                        {
                            isNextDay &&
                            <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={6}>
                                <div className='next-day'>
                                    <p className='mb-5'>Thời gian chăm sóc</p>
                                    <Select value={nextDayFilter} onChange={(e) => setNextDayFilter(e)} style={{ width: '100%' }} placeholder='Ngày hiện tại' >
                                        <Select.Option value={false} key={2}>
                                            Ngày hiện tại
                                        </Select.Option>
                                        <Select.Option value={true} key={3}>
                                            Ngày tiếp theo
                                        </Select.Option>
                                    </Select>
                                </div>
                            </Col>
                        }
                        <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={6}>
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
                </GridConfig>
            </div>
        </div>
    )
}

export default Filtering