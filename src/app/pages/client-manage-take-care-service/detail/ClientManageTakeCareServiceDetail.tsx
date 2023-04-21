import { Col, Popover, Row, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import LandingFooter from 'app/components/footer/LandingFooter'
import HeaderInfor from 'app/components/header-infor/HeaderInfor'
import LandingHeader from 'app/components/header/LandingHeader'
import MoneyFormat from 'app/components/money/MoneyFormat'
import Description from 'app/components/renderer/description/Description'
import ListImage from 'app/components/renderer/list-image/ListImage'
import TreeName from 'app/components/renderer/tree-name/TreeName'
import { PaymentControlState } from 'app/models/payment'
import { ServiceOrderDetail } from 'app/models/service'
import { ServiceCalendar } from 'app/models/service-calendar'
import orderService from 'app/services/order.service'
import serviceCalendar from 'app/services/service-calendar.service'
import utilDateTime from 'app/utils/date-time'
import React, { useEffect, useMemo, useState } from 'react'
import { BiCommentDetail } from 'react-icons/bi'
import { GrMore } from 'react-icons/gr'
import { useParams } from 'react-router-dom'
import './style.scss'
import pagingPath from 'app/utils/paging-path'
import ServiceReportDetail from 'app/components/modal/service-report-detail/ServiceReportDetail'
import OrderStatusComp from 'app/components/status/OrderStatusComp'

const ClientManageTakeCareServiceDetail: React.FC = () => {
    const { orderId } = useParams()

    const [serviceOrder, setServiceOrder] = useState<ServiceOrderDetail>();
    const [calendars, setCalendars] = useState<ServiceCalendar[]>([])

    // action
    const [actionMethod, setActionMethod] = useState<PaymentControlState>()

    useEffect(() =>{
        pagingPath.scrollTop()
        if(!orderId) return;

        const init = async () =>{
            try{
                const res = await orderService.getAServiceOrderDetail(orderId)
                setServiceOrder(res.data)
            }catch{

            }
        }
        init()

    }, [orderId])

    useEffect(() =>{
        if(!orderId) return;

        const init = async () =>{
            try{
                const res = await serviceCalendar.getServiceCalendarByServiceOrder(orderId)
                setCalendars(res.data)
            }catch{

            }
        }
        init()
    }, [orderId])
    
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
            render: (v) => (<ListImage listImgs={v} />)
        },
        {
            title: 'Số lượng',
            key: 'quantity',
            dataIndex: 'quantity',
        },
        {
            title: 'Mô tả của khách hàng',
            key: 'description',
            dataIndex: 'description',
            render: (v) => (<Description content={v} />)
        },
        {
            title: 'Mô tả của quản trị',
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
        if(!serviceOrder) return
        
        return serviceOrder.service.serviceDetailList.map((x, index) => {
            const { treeName, imgUrls, quantity, description, managerDescription, servicePrice } = x
            return {
                key: index,
                treeName, imgUrls, quantity, description, managerDescription, servicePrice
            }
        })
    }, [serviceOrder])

    const ColumnCalendar: ColumnsType<any> = [
        {
            title: '#',
            key: '#',
            dataIndex: '#',
            render:(v, _, index) => (index + 1)
        },
        {
            title: 'Ngày chăm sóc',
            key: 'serviceDate',
            dataIndex: 'serviceDate',
            render:(v) => (utilDateTime.dateToString(v))
        },
        {
            title: 'Hình ảnh',
            key: 'images',
            dataIndex: 'images',
            render: (v) => (v && <ListImage listImgs={v} />)
        },
        {
            title: 'Mô tả ngắn gọn',
            key: 'sumary',
            dataIndex: 'sumary',
            render: (v) => (<Description content={v} />)
        },
        {
            title: 'Trạng thái',
            key: 'status',
            dataIndex: 'status',
        },
        {
            title: 'Xử lý',
            key: 'actions',
            dataIndex: 'actions',
            render: (_, record, index) => (
                <>
                    <Popover
                        content={() => contextCalendar(record)} 
                        placement='bottom' 
                        trigger="click"
                        open={index === actionMethod?.openIndex} 
                        onOpenChange={(open: boolean) => {
                            if(open){
                                setActionMethod({orderId: '', actionType: '', orderType: '', openIndex: index})
                            }else{
                                setActionMethod({orderId: '', actionType: '', orderType: '', openIndex: -1})
                            }
                        }}
                    >
                        <GrMore size={25} cursor='pointer' color='#00a76f' />
                    </Popover>
                </>
            )
        }
    ]
    const contextCalendar = (record) =>{
        return (
            <div className='context-menu-wrapper'>
                <div className="item" onClick={() => {
                    setActionMethod({orderId: record.id, actionType: 'detail', orderType: 'service', openIndex: -1})
                }}>
                    <BiCommentDetail size={25} className='icon'/>
                    <span>Chi tiết báo cáo</span>
                </div>
            </div>
        )
    }
    const DataSourceCalendar = useMemo(() =>{
        return calendars.map((x, index) => ({
            key: index,
            ...x
        }))
    }, [calendars])

    const handleClose = () =>{
        setActionMethod(undefined)
    }

    return (
        <div>
            <LandingHeader />
            {
                serviceOrder &&
                <div className="main-content-not-home">
                    <div className="container-wrapper cmtcs-wrapper">
                        <HeaderInfor title={`Chi tiết đơn hàng chăm sóc cây "${serviceOrder.orderCode}"`} />
                        <div className="default-layout">
                            <h3>Thông tin của người chăm sóc</h3>
                            <Row gutter={[24, 24]} style={{marginTop: '20px'}}>
                                <Col span={8}>
                                    <span className="label">Tên:</span>
                                    <span className="content">{serviceOrder.technician.technicianFullName}</span>
                                </Col>
                                <Col span={8}>
                                    <span className="label">Số điện thoại:</span>
                                    <span className="content">{serviceOrder.technician.technicianPhone}</span>
                                </Col>
                                <Col span={8}>
                                    <span className="label">Email:</span>
                                    <span className="content">{serviceOrder.technician.technicianMail}</span>
                                </Col>
                                <Col span={8} style={{display: 'flex'}}>
                                    <span className="label">Trạng thái đơn hàng</span>
                                    <span className="content">
                                        <OrderStatusComp status={serviceOrder.status} />
                                    </span>
                                </Col>
                            </Row>
                        </div>
                        <div className="default-layout">
                            <Table columns={ColumnServiceOrder} dataSource={DataSourceServiceOrder} pagination={false} />
                        </div>
                        <div className="default-layout">
                            <Table columns={ColumnCalendar} dataSource={DataSourceCalendar} pagination={false} />
                        </div>
                    </div>
                </div>
            }
            {
                (actionMethod?.actionType === 'detail' && serviceOrder) &&
                <ServiceReportDetail
                    orderCode={serviceOrder.orderCode}
                    serviceCalendar={calendars.filter(x => x.id === actionMethod.orderId)[0]}
                    onClose={handleClose}
                />
            }
            <LandingFooter />
        </div>
    )
}

export default ClientManageTakeCareServiceDetail