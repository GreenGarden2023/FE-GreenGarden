import { Col, Input, Row, Select } from 'antd';
import useDispatch from 'app/hooks/use-dispatch';
import { Role, TakeCareStatus } from 'app/models/general-type';
import { setEmptyFilter, setEmptySearch, setFilter, setOrderToday, setRangeDate, setRole } from 'app/slices/search-and-filter';
import CONSTANT from 'app/utils/constant';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaIoxhost } from 'react-icons/fa';
import './style.scss';
import GridConfig from 'app/components/grid-config/GridConfig';

interface FilteringProps{
    isRangeDate?: boolean;
    isOrderToDay?: boolean;
    isRole?: boolean;
}

const Filtering: React.FC<FilteringProps> = ({ isRangeDate, isOrderToDay, isRole }) => {
    const dispatch = useDispatch()

    const [rangeDateNew, setRangeDateNew] = useState<number>()
    // const [rangeDateFilter, setRangeDateFilter] = useState<[Dayjs, Dayjs]>()
    const [roleFilter, setRoleFilter] = useState<Role>()
    const [statusRequest, setStatusRequest] = useState<TakeCareStatus>('')

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
        
        if(isRole && roleFilter){
            dispatch(setRole(roleFilter))
        }

        if(isOrderToDay && statusRequest){
            dispatch(setOrderToday(statusRequest))
        }

        // ----------------------
        dispatch(setFilter(true))
        dispatch(setEmptySearch())
    }

    const handleClickDefault = () =>{
        setRangeDateNew(undefined)
        // setRangeDateFilter(undefined)
        setRoleFilter(undefined)
        setStatusRequest('')
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
                                        <Select.Option value=''>
                                            None
                                        </Select.Option>
                                        <Select.Option value='done'>
                                            Đã chăm sóc
                                        </Select.Option>
                                        <Select.Option value='pending'>
                                            Chưa chăm sóc
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