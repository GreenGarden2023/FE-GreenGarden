import { Col, Popover, Row, Table, Tooltip } from 'antd'
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
import useDispatch from 'app/hooks/use-dispatch'
import { setNoti } from 'app/slices/notification'
import CONSTANT from 'app/utils/constant'
import LoadingView from 'app/components/loading-view/LoadingView'
import NoProduct from 'app/components/no-product/NoProduct'
import GridConfig from 'app/components/grid-config/GridConfig'
// import CareGuide from 'app/components/care-guide/CareGuide'
import { BsFillCaretDownSquareFill, BsFillCaretRightSquareFill } from 'react-icons/bs'
import TakeCareStatusComp from 'app/components/status/TakeCareStatusComp'
import CareGuideSummary from 'app/components/care-guide-summary/CareGuideSummary'

const ClientManageTakeCareServiceDetail: React.FC = () => {
    const { orderId } = useParams()
    const dispatch = useDispatch()

    const [serviceOrder, setServiceOrder] = useState<ServiceOrderDetail>();
    const [calendars, setCalendars] = useState<ServiceCalendar[]>([])

    // action
    const [actionMethod, setActionMethod] = useState<PaymentControlState>()
    const [loading, setLoading] = useState(true)

    useEffect(() =>{
        pagingPath.scrollTop()
        if(!orderId) return;

        const init = async () =>{
            setLoading(true)
            try{
                const res = await orderService.getAServiceOrderDetail(orderId)
                setServiceOrder(res.data)
            }catch{
                dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
            }
            setLoading(false)
        }
        init()

    }, [orderId, dispatch])

    useEffect(() =>{
        if(!orderId) return;

        const init = async () =>{
            try{
                const res = await serviceCalendar.getServiceCalendarByServiceOrder(orderId)
                setCalendars(res.data)
            }catch{
                dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
            }
        }
        init()
    }, [orderId, dispatch])
    
    const ColumnServiceOrder: ColumnsType<any> = [
        {
            title: 'Tên cây',
            key: 'treeName',
            dataIndex: 'treeName',
            render: (v) => (<TreeName name={v} minWidth={120} />)
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
            render: (v) => <p style={{minWidth: 80}}>{v}</p>
        },
        {
            title: 'Mô tả của khách hàng',
            key: 'description',
            dataIndex: 'description',
            render: (v) => (<Description content={v} minWidth={150} />)
        },
        {
            title: 'Mô tả của quản trị',
            key: 'managerDescription',
            dataIndex: 'managerDescription',
            render: (v) => (<Description content={v} minWidth={150} />)
        },
        {
            title: 'Giá tiền',
            key: 'servicePrice',
            dataIndex: 'servicePrice',
            align: 'right',
            render: (v) => (<MoneyFormat value={v} color='Light Blue' isHighlight minWidth={100} />)
        },
    ]
    const DataSourceServiceOrder = useMemo(() =>{
        if(!serviceOrder) return
        
        return serviceOrder.service.serviceDetailList.map((x, index) => {
            const { treeName, imgUrls, quantity, description, managerDescription, servicePrice, careGuide } = x
            return {
                key: index,
                treeName, imgUrls, quantity, description, managerDescription, servicePrice, careGuide
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
            title: 'Mô tả',
            key: 'sumary',
            dataIndex: 'sumary',
            render: (v) => (<Description content={v} minWidth={230} />)
        },
        {
            title: 'Trạng thái',
            key: 'status',
            dataIndex: 'status',
            render:(v) => <TakeCareStatusComp status={v} />
        },
        {
            title: 'Xử lý',
            key: 'actions',
            dataIndex: 'actions',
            render: (_, record, index) => (
                <>
                    <Popover
                        content={() => contextCalendar(record)} 
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
                        <GrMore size={25} cursor='pointer' color='#00a76f' style={{minWidth: 80}} />
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
                        {
                            loading && <LoadingView loading />
                        }
                        {
                            (!loading && !serviceOrder) ? <NoProduct /> :
                            <>
                                <HeaderInfor title={`Chi tiết đơn hàng chăm sóc cây "${serviceOrder.orderCode}"`} />
                                <div className="default-layout">
                                    <h3>Thông tin của người chăm sóc</h3>
                                    <GridConfig>
                                        <Row gutter={[24, 24]} style={{marginTop: '20px'}}>
                                            <Col xs={12} sm={12} md={12} lg={8} xl={8} style={{display: 'flex', flexWrap: 'wrap'}}>
                                                <span className="label">Tên:</span>
                                                <span className="content">{serviceOrder.technician.technicianFullName}</span>
                                            </Col>
                                            <Col xs={12} sm={12} md={12} lg={8} xl={8} style={{display: 'flex', flexWrap: 'wrap'}}>
                                                <span className="label">Số điện thoại:</span>
                                                <span className="content">{serviceOrder.technician.technicianPhone}</span>
                                            </Col>
                                            <Col xs={24} sm={24} md={24} lg={8} xl={8} style={{display: 'flex', flexWrap: 'wrap'}}>
                                                <span className="label">Email:</span>
                                                <span className="content">{serviceOrder.technician.technicianMail}</span>
                                            </Col>
                                        </Row>
                                    </GridConfig>
                                </div>
                                <div className="default-layout">
                                    <h3>Thông tin đơn hàng chăm sóc cây</h3>
                                    <GridConfig>
                                        <Row gutter={[24, 24]} style={{marginTop: '20px'}}>
                                            <Col xs={12} sm={12} md={12} lg={8} xl={8}>
                                                <span className="label">Ngày bắt đầu</span>
                                                <span className="content">{utilDateTime.dateToString(serviceOrder.service.startDate.toString())}</span>
                                            </Col>
                                            <Col xs={12} sm={12} md={12} lg={8} xl={8}>
                                                <span className="label">Ngày kết thúc</span>
                                                <span className="content">{utilDateTime.dateToString(serviceOrder.service.endDate.toString())}</span>
                                            </Col>
                                            <Col xs={12} sm={12} md={12} lg={8} xl={8} style={{display: 'flex', flexWrap: 'wrap'}}>
                                                <span className="label">Trạng thái đơn hàng</span>
                                                <span className="content">
                                                    <OrderStatusComp status={serviceOrder.status} />
                                                </span>
                                            </Col>
                                            <Col xs={12} sm={12} md={12} lg={8} xl={8} style={{display: 'flex', flexWrap: 'wrap'}}>
                                                <span className="label">Tiền cọc</span>
                                                <span className="content">
                                                    <MoneyFormat value={serviceOrder.deposit} color='Orange' />
                                                </span>
                                            </Col>
                                            <Col xs={12} sm={12} md={12} lg={8} xl={8} style={{display: 'flex', flexWrap: 'wrap'}}>
                                                <span className="label">Tổng đơn hàng</span>
                                                <span className="content">
                                                    <MoneyFormat value={serviceOrder.totalPrice} color='Light Blue' />
                                                </span>
                                            </Col>
                                            <Col xs={12} sm={12} md={12} lg={8} xl={8} style={{display: 'flex', flexWrap: 'wrap'}}>
                                                <span className="label">Tiền còn thiếu</span>
                                                <span className="content">
                                                    <MoneyFormat value={serviceOrder.remainAmount} color='Blue' isHighlight />
                                                </span>
                                            </Col>
                                            {
                                                serviceOrder.nameCancelBy &&
                                                <>
                                                    <Col xs={12} sm={12} md={12} lg={8} xl={8}>
                                                        <span className="label">Người hủy đơn</span>
                                                        <span className="content">{serviceOrder.nameCancelBy}</span>
                                                    </Col>
                                                    <Col xs={12} sm={12} md={12} lg={8} xl={8}>
                                                        <span className="label">Lý do</span>
                                                        <span className="content">{serviceOrder.reason}</span>
                                                    </Col>
                                                </>
                                            }
                                        </Row>
                                    </GridConfig>
                                </div>
                                <div className="default-layout">
                                    <Table 
                                        columns={ColumnServiceOrder} 
                                        dataSource={DataSourceServiceOrder} 
                                        pagination={false} 
                                        scroll={{x: 480}}
                                        expandable={{
                                            expandedRowRender: (record) => (<CareGuideSummary careGuide={record.careGuide} />),
                                            expandIcon: ({ expanded, onExpand, record }) => 
                                            expanded ? 
                                                <Tooltip title="Đóng hướng dẫn chăm sóc" color='#0099FF' trigger='hover' >
                                                    <BsFillCaretDownSquareFill color='#0099FF' onClick={(e: any) => onExpand(record, e)} cursor='pointer' /> 
                                                </Tooltip>
                                                : 
                                                <Tooltip title="Xem hướng dẫn chăm sóc" color='#0099FF' trigger='hover' >
                                                    <BsFillCaretRightSquareFill color='#0099FF' onClick={(e: any) => onExpand(record, e)} cursor='pointer' />
                                                </Tooltip>
                                        }}
                                    />
                                </div>
                                <div className="default-layout">
                                    <Table columns={ColumnCalendar} dataSource={DataSourceCalendar} pagination={false} scroll={{x: 480}} />
                                </div>
                            </>
                        }
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