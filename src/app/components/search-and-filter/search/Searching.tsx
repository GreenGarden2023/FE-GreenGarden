import { Col, Input, Row, Select } from 'antd';
import useDispatch from 'app/hooks/use-dispatch';
import { OrderStatus } from 'app/models/general-type';
import { setEmptyFilter, setEmptySearch, setSearch, setSearchValues } from 'app/slices/search-and-filter';
// import CONSTANT from 'app/utils/constant';
import React, { useEffect, useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaIoxhost } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './style.scss';
import GridConfig from 'app/components/grid-config/GridConfig';

interface SearchingProps{
    isOrderCode?: boolean;
    isPhone?: boolean;
    isStatus?: boolean;
    statusType?: 'rent' | 'sale' | 'service'
    isProductName?: boolean;
    isEmail?: boolean;
    defaultUrl: string;
    // onSearch: (data: SearchResult) => void;
    // onDefault: () => void;
}

const Searching: React.FC<SearchingProps> = ({ isOrderCode, isPhone, isStatus, statusType, isProductName, isEmail, defaultUrl }) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [orderCodeSearch, setOrderCodeSearch] = useState('')
    const [phoneSearch, setPhoneSearch] = useState('')
    const [statusSearch, setStatusSearch] = useState<OrderStatus>('')
    const [productNameSearch, setProductNameSearch] = useState('')
    const [emailSearch, setEmailSearch] = useState('')

    useEffect(() =>{
        dispatch(setSearch(false))

        return () =>{
            dispatch(setEmptyFilter())
            dispatch(setEmptySearch())
        }
    }, [dispatch])

    const handleClickSearch = () =>{
        dispatch(setSearchValues({
            isSearching: true,
            orderCode: orderCodeSearch.trim(),
            phone: phoneSearch.trim(),
            productName: productNameSearch.trim(),
            status: statusSearch,
            email: emailSearch
        }))
    }

    const handleClickDefault = () =>{
        // set default current value
        setOrderCodeSearch('')
        setPhoneSearch('')
        setStatusSearch('')
        setProductNameSearch('')
        setEmailSearch('')
        // clear store and navigate to defaultUrl
        dispatch(setSearch(false))
        navigate(defaultUrl)
    }

    return (
        <div className='default-layout'>
            <div className="searching-wrapper">
                <GridConfig>
                    <Row gutter={[24, 24]}>
                        {
                            isOrderCode &&
                            <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={6}>
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
                                            statusType === 'rent' &&
                                            <>
                                                <Select.Option value='' >None</Select.Option>
                                                <Select.Option value='unpaid' >Đang xử lý</Select.Option>
                                                <Select.Option value='ready' >Đã thanh toán cọc</Select.Option>
                                                <Select.Option value='paid' >Đã thanh toán đủ</Select.Option>
                                                <Select.Option value='renting' >Đang thuê</Select.Option>
                                                <Select.Option value='completed' >Đã hoàn thành</Select.Option>
                                                <Select.Option value='cancel' >Đã hủy</Select.Option>
                                            </>
                                        }
                                        {
                                            statusType === 'sale' &&
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
                                        {
                                            statusType === 'service' &&
                                            <>
                                                <Select.Option value='' >None</Select.Option>
                                                <Select.Option value='unpaid' >Đang xử lý</Select.Option>
                                                <Select.Option value='ready' >Đã thanh toán cọc</Select.Option>
                                                <Select.Option value='paid' >Đã thanh toán đủ</Select.Option>
                                                <Select.Option value='completed' >Đã hoàn thành</Select.Option>
                                                <Select.Option value='cancel' >Đã hủy</Select.Option>
                                            </>
                                        }
                                    </Select>
                                </div>
                            </Col>
                        }
                        {
                            isProductName &&
                            <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={6}>
                                <div className='product-name'>
                                    <p className='mb-5'>Tìm kiếm theo tên</p>
                                    <Input placeholder='Cây thiết mộc lan' value={productNameSearch} onChange={(e) => setProductNameSearch(e.target.value)} />
                                </div>
                            </Col>
                        }
                         {
                            isEmail &&
                            <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={6}>
                                <div className='product-name'>
                                    <p className='mb-5'>Tìm kiếm theo email</p>
                                    <Input placeholder='manager@gmail.com' value={emailSearch} onChange={(e) => setEmailSearch(e.target.value)} />
                                </div>
                            </Col>
                        }
                        <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={6}>
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
                </GridConfig>
            </div>
        </div>
    )
}

export default Searching