import { Col, Input, Row, Select } from 'antd';
import useDispatch from 'app/hooks/use-dispatch';
import { setEmptyFilter, setEmptySearch, setOrderCode, setPhone, setSearch, setStatus } from 'app/slices/search-and-filter';
import React, { useEffect, useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaIoxhost } from 'react-icons/fa';
import './style.scss';
import { OrderStatus } from 'app/models/general-type';

interface SearchingProps{
    isOrderCode?: boolean;
    isPhone?: boolean;
    isStatus?: boolean;
    statusType?: 'rent' | 'sale'
    // onSearch: (data: SearchResult) => void;
    // onDefault: () => void;
}

const Searching: React.FC<SearchingProps> = ({ isOrderCode, isPhone, isStatus, statusType }) => {
    const dispatch = useDispatch()

    const [orderCodeSearch, setOrderCodeSearch] = useState('')
    const [phoneSearch, setPhoneSearch] = useState('')
    const [statusSearch, setStatusSearch] = useState<OrderStatus>('')

    useEffect(() =>{
        dispatch(setSearch(false))

        return () =>{
            dispatch(setEmptyFilter())
            dispatch(setEmptySearch())
        }
    }, [dispatch])

    const handleClickSearch = () =>{
        // -----------------
        dispatch(setOrderCode(orderCodeSearch.trim()))
        dispatch(setPhone(phoneSearch.trim()))
        dispatch(setStatus(statusSearch))
        dispatch(setSearch(true))
        dispatch(setEmptyFilter())
        // onSearch(data)
    }

    const handleClickDefault = () =>{
        setOrderCodeSearch('')
        setPhoneSearch('')
        setStatusSearch('')
        // --------------
        dispatch(setSearch(false))
    }

    return (
        <div className='default-layout'>
            <div className="searching-wrapper">
                <Row gutter={[24, 24]}>
                    {
                        isOrderCode &&
                        <Col span={6}>
                            <div className='order-code'>
                                <p className='mb-5'>Mã đơn hàng</p>
                                <Input placeholder='WS16MG56OY' value={orderCodeSearch} onChange={(e) => setOrderCodeSearch(e.target.value)} />
                            </div>
                        </Col>
                    }
                    {
                        isPhone &&
                        <Col span={6}>
                            <div className='order-code'>
                                <p className='mb-5'>Số điện thoại</p>
                                <Input placeholder='0123456789' value={phoneSearch} onChange={(e) => setPhoneSearch(e.target.value)} />
                            </div>
                        </Col>
                    }
                    {
                        isStatus &&
                        <Col span={6}>
                            <div className='order-code'>
                                <p className='mb-5'>Trạng thái đơn hàng</p>
                                <Select value={statusSearch} onChange={(e) => setStatusSearch(e)} style={{width: '100%'}} >
                                    {
                                        statusType === 'rent' ? 
                                        <>
                                            <Select.Option value='' >None</Select.Option>
                                            <Select.Option value='unpaid' >Đang xử lý</Select.Option>
                                            <Select.Option value='ready' >Đã thanh toán cọc</Select.Option>
                                            <Select.Option value='paid' >Đã thanh toán đủ</Select.Option>
                                            <Select.Option value='renting' >Đang thuê</Select.Option>
                                            <Select.Option value='completed' >Đã hoàn thành</Select.Option>
                                            <Select.Option value='cancel' >Đã hủy</Select.Option>
                                        </> :
                                        <>
                                            <Select.Option value='' >None</Select.Option>
                                            <Select.Option value='unpaid' >Đang xử lý</Select.Option>
                                            <Select.Option value='ready' >Đã thanh toán cọc</Select.Option>
                                            <Select.Option value='paid' >Đã thanh toán đủ</Select.Option>
                                            <Select.Option value='delivery' >Vận chuyển</Select.Option>
                                            <Select.Option value='completed' >Đã hoàn thành</Select.Option>
                                            <Select.Option value='cancel' >Đã hủy</Select.Option>
                                        </>
                                    }
                                </Select>
                            </div>
                        </Col>
                    }
                    <Col span={6}>
                        <div className="search-button-wrapper">
                            <button className='btn btn-searching' onClick={handleClickSearch}>
                                <AiOutlineSearch size={20} />
                                <span>Tìm kiếm</span>
                            </button>
                            <button className='btn btn-searching-clear'  onClick={handleClickDefault}>
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

export default Searching