import { Col, Image, Input, Modal, Row } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import LandingFooter from 'app/components/footer/LandingFooter'
import HeaderInfor from 'app/components/header-infor/HeaderInfor'
import LandingHeader from 'app/components/header/LandingHeader'
import MoneyFormat from 'app/components/money/MoneyFormat'
import Description from 'app/components/renderer/description/Description'
import TreeName from 'app/components/renderer/tree-name/TreeName'
import useDispatch from 'app/hooks/use-dispatch'
import { Service } from 'app/models/service'
import serviceService from 'app/services/service.service'
import { setNoti } from 'app/slices/notification'
import utilDateTime from 'app/utils/date-time'
import React, { useEffect, useMemo, useState } from 'react'
import { AiOutlineCheck } from 'react-icons/ai'
import { useNavigate, useParams } from 'react-router-dom'
import './style.scss'

const ClientTakeCareServiceConfirm: React.FC = () => {
    const { serviceId } = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [service, setService] = useState<Service>()
    const [openModal, setOpenModal] = useState(0)

    useEffect(() =>{
        if(!serviceId) return;
        const init = async () =>{
            try{
                const res = await serviceService.getAServiceRequestDetail(serviceId)
                setService(res.data)
            }catch{

            }
        }
        init()
    }, [serviceId])

    const ColumnServiceOrder: ColumnsType<any> = [
        {
            title: '#',
            key: '#',
            dataIndex: '#',
            render:(v, _, index) => (index + 1)
        },
        {
            title: 'Tên cây',
            key: 'treeName',
            dataIndex: 'treeName',
            render: (v) => (<TreeName name={v} />)
        },
        {
            title: 'Hình ảnh',
            key: 'imgUrls',
            dataIndex: 'imgUrls',
            render: (v) => (
                <Image.PreviewGroup>
                    {
                        v.map((item, index) => (
                            <div key={index} style={{display: index === 0 ? 'initial' : 'none'}}>
                                <Image 
                                width={150}
                                height={150}
                                src={item}
                                style={{objectFit: 'cover'}}
                            />
                            </div>
                        ))
                    }
                </Image.PreviewGroup>
            )
        },
        {
            title: 'Số lượng',
            key: 'quantity',
            dataIndex: 'quantity',
        },
        {
            title: 'Mô tả của bạn',
            key: 'description',
            dataIndex: 'description',
            render: (v) => (<Description content={v} />)
        },
        {
            title: 'Mô tả của quản trị viên',
            key: 'managerDescription',
            dataIndex: 'managerDescription',
            render: (v) => (<Description content={v} />)
        },
        {
            title: 'Giá tiền',
            key: 'servicePrice',
            dataIndex: 'servicePrice',
            align: 'right',
            render: (v) => (<MoneyFormat value={v} color='Light Blue' isHighlight />)
        },
    ]
    const DataSourceServiceOrder = useMemo(() =>{
        if(!service) return
        
        return service.serviceDetailList.map((x, index) => {
            const { treeName, imgUrls, quantity, description, managerDescription, servicePrice } = x
            return {
                key: index,
                treeName, imgUrls, quantity, description, managerDescription, servicePrice
            }
        })
    }, [service])

    const handleSubmit = async () =>{
        if(!service) return;

        try{
             await serviceService.updateServiceRequestStatus(service.id, 'user approved')
            dispatch(setNoti({type: 'success', message: 'Xác nhận yêu cầu thành công'}))
            setOpenModal(0)
            navigate('/take-care-service/me')
        }catch{

        }
    }

    return (
        <div>
            <LandingHeader />
            <div className="main-content-not-home">
                <div className="container-wrapper ctcsc-wrapper">
                    <HeaderInfor title='Xác nhận thông tin chi tiết yêu cầu chăm sóc' />
                    <section className="default-layout">
                        <button className='btn btn-create' onClick={() => setOpenModal(1)}>
                            <AiOutlineCheck />
                            <span>Xác nhận thông tin</span>
                        </button>
                    </section>
                    <section className="default-layout">
                        {
                            service && 
                            <Row gutter={[24, 24]}>
                                <Col span={8}>
                                    <span className="title">Tên khách hàng: </span>
                                    <span className="content">{service.name}</span>
                                </Col>
                                <Col span={8}>
                                    <span className="title">Địa chỉ: </span>
                                    <span className="content">{service.address}</span>
                                </Col>
                                <Col span={8}>
                                    <span className="title">Số điện thoại: </span>
                                    <span className="content">{service.phone}</span>
                                </Col>
                                <Col span={8}>
                                    <span className="title">Email: </span>
                                    <span className="content">{service.email}</span>
                                </Col>
                                <Col span={8}>
                                    <span className="title">Thời gian chăm sóc cây </span>
                                    <span className="content">{utilDateTime.dateToString(service.startDate.toString())} - {utilDateTime.dateToString(service.endDate.toString())}</span>
                                </Col>
                                <Col span={8}>
                                    <span className="title">Nơi chăm sóc: </span>
                                    <span className="content">{service.isTransport ? 'Tại nhà' : 'Tại cửa hàng'}</span>
                                </Col>
                                <Col span={8}>
                                    <span className="title">Phí vận chuyển: </span>
                                    <span className="content">{service.transportFee}</span>
                                </Col>
                                <Col span={8}>
                                    <span className="title">Trạng thái yêu cầu: </span>
                                    <span className="content">{service.status}</span>
                                </Col>
                                <Col span={24}>
                                    <span className="title">Thông tin hợp đồng chăm sóc cây</span>
                                    <Input.TextArea disabled>{service.rules}</Input.TextArea>
                                </Col>
                            </Row>
                        }
                    </section>
                    <div className="default-layout">
                        <Table columns={ColumnServiceOrder} dataSource={DataSourceServiceOrder} pagination={false} />
                    </div>
                </div>
            </div>
            <LandingFooter />
            <Modal
                open={openModal === 1}
                title='Bạn đồng ý với tất cả thông tin chi tiết của yêu cầu chăm sóc này?'
                onCancel={() => setOpenModal(0)}
                onOk={handleSubmit}
            >

            </Modal>
        </div>
    )
}

export default ClientTakeCareServiceConfirm