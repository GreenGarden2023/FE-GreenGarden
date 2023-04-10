import { Col, Input, Row } from 'antd';
import useDispatch from 'app/hooks/use-dispatch';
import { setEmptyFilter, setEmptySearch, setOrderCode, setSearch } from 'app/slices/search-and-filter';
import React, { useEffect, useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaIoxhost } from 'react-icons/fa';
import './style.scss';

interface SearchingProps{
    isOrderCode?: boolean;
    // onSearch: (data: SearchResult) => void;
    // onDefault: () => void;
}

const Searching: React.FC<SearchingProps> = ({ isOrderCode }) => {
    const dispatch = useDispatch()

    const [orderCodeSearch, setOrderCodeSearch] = useState('')

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
        dispatch(setSearch(true))
        dispatch(setEmptyFilter())
        // onSearch(data)
    }

    const handleClickDefault = () =>{
        setOrderCodeSearch('')
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