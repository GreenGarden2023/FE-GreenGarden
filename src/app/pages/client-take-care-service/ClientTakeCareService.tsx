import { Col, Row } from 'antd'
import LandingFooter from 'app/components/footer/LandingFooter'
import HeaderInfor from 'app/components/header-infor/HeaderInfor'
import LandingHeader from 'app/components/header/LandingHeader'
import pagingPath from 'app/utils/paging-path'
import React, { useEffect, useState } from 'react'
import { AiOutlinePlusSquare } from 'react-icons/ai'
import './style.scss'

const ClientTakeCareService: React.FC = () => {

    const [openModal, setOpenModal] = useState(0);
    console.log(openModal)

    useEffect(() =>{
        pagingPath.scrollTop()
    }, [])

    const handleCreateNewTree = () =>{
        setOpenModal(1)
    }
    
    return (
        <div>
            <LandingHeader />
            <div className="main-content-not-home">
                <div className="container-wrapper ts-wrapper">
                    <HeaderInfor title='Dịch vụ chăm sóc cây cảnh' />
                    <section className="ts-box default-layout">
                        <button className="ts-btn-create btn btn-create" onClick={handleCreateNewTree}>
                            <AiOutlinePlusSquare size={25} />
                            Tạo mới cây của bạn
                        </button>
                    </section>
                    <section className="ts-infor default-layout">
                        {/* no product before */}
                        <div className="empty-tree">
                            <h1>Hiện tại bạn chưa có cây nào. Hãy tạo mới 1 cây</h1>
                            <button className='btn btn-create' onClick={handleCreateNewTree}>Tạo mới</button>
                        </div>
                        <Row gutter={[12, 12]}>
                            {
                                [...Array(5)].map(x => (
                                    <Col key={x} span={6}>
                                        <div className="item-detail">
                                            <img src="/assets/inventory-empty.png" alt="/" />
                                            <div className="item-infor">
                                                <h1>Hoa hồng</h1>
                                                <p className='quantity'>
                                                    Số lượng 
                                                    <span>2</span>
                                                </p>
                                                <p className='description'>
                                                    Mô tả 
                                                    <span>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Veritatis, architecto exercitationem amet aut assumenda ut deserunt cumque mollitia delectus quisquam esse repellat ea eligendi recusandae accusantium ipsa laboriosam odio quidem?</span>
                                                </p>
                                            </div>
                                        </div>
                                    </Col>
                                ))
                            }
                        </Row>
                    </section>
                </div>
            </div>
            <LandingFooter />
        </div>
    )
}

export default ClientTakeCareService