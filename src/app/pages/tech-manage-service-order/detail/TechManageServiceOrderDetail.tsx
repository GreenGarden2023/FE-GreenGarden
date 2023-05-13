import { Button, Col, Input, Popover, Row } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import HeaderInfor from 'app/components/header-infor/HeaderInfor';
import CreateCalendar from 'app/components/modal/handle-calendar/CreateCalendar';
import UploadCalendar from 'app/components/modal/handle-calendar/UploadCalendar';
import ServiceReportDetail from 'app/components/modal/service-report-detail/ServiceReportDetail';
import MoneyFormat from 'app/components/money/MoneyFormat';
import Description from 'app/components/renderer/description/Description';
import ListImage from 'app/components/renderer/list-image/ListImage';
import TreeName from 'app/components/renderer/tree-name/TreeName';
import OrderStatusComp from 'app/components/status/OrderStatusComp';
import TakeCareStatusComp from 'app/components/status/TakeCareStatusComp';
import { PaymentControlState } from 'app/models/payment';
import { ServiceOrderDetail } from 'app/models/service';
import { ServiceCalendar } from 'app/models/service-calendar';
import orderService from 'app/services/order.service';
import serviceCalendar from 'app/services/service-calendar.service';
import utilDateTime from 'app/utils/date-time';
import dayjs from 'dayjs';
import React, { useEffect, useMemo, useState } from 'react';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { BiDetail } from 'react-icons/bi';
import { GrMore } from 'react-icons/gr';
import { useParams } from 'react-router-dom';
import './style.scss';
import Transport from 'app/components/renderer/transport/Transport';
import { UpdateCareGuide } from 'app/models/order';
import useDispatch from 'app/hooks/use-dispatch';
import { setNoti } from 'app/slices/notification';
import CONSTANT from 'app/utils/constant';
import GridConfig from 'app/components/grid-config/GridConfig';

const TechManageServiceOrderDetail: React.FC = () => {
    const { orderId } = useParams()
    const dispatch = useDispatch()
    // data
    const [serviceOrder, setServiceOrder] = useState<ServiceOrderDetail>();
    const [calendars, setCalendars] = useState<ServiceCalendar[]>([])


    // action
    const [actionMethod, setActionMethod] = useState<PaymentControlState>()
    const [actionLoading, setActionLoading] = useState(false)

    // CalendarUpdate type

    useEffect(() =>{
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

    const ColumnCalendar: ColumnsType<any> = [
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
            width: 300,
            render: (v) => (<Description content={v} minWidth={180} />)
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
                        <GrMore size={25} cursor='pointer' color='#00a76f' style={{minWidth: 80}} />
                    </Popover>
                </>
            )
        }
    ]
    const contextCalendar = (record) =>{
        return (
            <div className='context-menu-wrapper'>
                {
                    <div className="item" onClick={() => {
                        setActionMethod({orderId: record.id, actionType: 'detail', orderType: 'service', openIndex: -1})
                    }}>
                        <BiDetail size={25} className='icon'/>
                        <span>Chi tiết báo cáo</span>
                    </div>
                }
                {
                    // 
                    (record.status === 'pending' && dayjs(new Date()).valueOf() >= dayjs(record.serviceDate).valueOf()) &&
                    <div className="item" onClick={() => {
                        setActionMethod({orderId: record.id, actionType: 'update calendar', orderType: 'service', openIndex: -1})
                    }}>
                        <AiOutlineCloudUpload size={25} className='icon'/>
                        <span>Đăng tải báo cáo</span>
                    </div>
                }
            </div>
        )
    }
    const DataSourceCalendar = useMemo(() =>{
        return calendars.map((x, i)=> ({
            key: String(i + 1),
            ...x
        }))
    }, [calendars])

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
            render: (v) => (<Description content={v} minWidth={180} />)
        },
        {
            title: 'Mô tả của quản trị',
            key: 'managerDescription',
            dataIndex: 'managerDescription',
            render: (v) => (<Description content={v} minWidth={180} />)
        },
        {
            title: 'Hướng dẫn chăm sóc',
            key: 'careGuide',
            dataIndex: 'careGuide',
            render: (v, _, index) => (<Input.TextArea style={Styled} value={v} onChange={(e) => {
                if(!serviceOrder) return;
                const value = e.target.value
                serviceOrder.service.serviceDetailList[index].careGuide = value
                setServiceOrder({...serviceOrder})
            }} 
            autoSize={{minRows: 4, maxRows: 4}}></Input.TextArea>)
        },
        {
            title: 'Giá tiền',
            key: 'servicePrice',
            dataIndex: 'servicePrice',
            align: 'right',
            render: (v) => (<MoneyFormat value={v} color='Blue'  />)
        },
    ]

    const Styled: React.CSSProperties = {
        display: 'inline-block',
        minWidth: '180px'
    }

    const DataSourceServiceOrder = useMemo(() =>{
        if(!serviceOrder) return
        
        return serviceOrder.service.serviceDetailList.map((x, i) => {
            const { treeName, imgUrls, quantity, description, managerDescription, servicePrice, careGuide } = x
            return {
                key: String(i + 1),
                treeName, imgUrls, quantity, description, managerDescription, servicePrice, careGuide
            }
        })
    }, [serviceOrder])
    const handleCloseModal = () =>{
        setActionMethod(undefined)
    }
    const onSubmitCreateCalendar = async (serviceCalendar: ServiceCalendar) =>{
        setCalendars([...calendars, serviceCalendar])
    }
    
    const handleUploadCalendar = (prev: ServiceCalendar, next?: ServiceCalendar) =>{
        if(!serviceOrder) return;
        
        const index = calendars.findIndex(x => x.id === prev.id)
        calendars[index] = prev

        if(next){
            setCalendars([next, ...calendars])
            return;
        }
        setCalendars([...calendars])
    }
    const handleUpdateCareGuide = async () =>{
        if(!serviceOrder || !orderId) return;

        setActionLoading(true)
        try{
            const body: UpdateCareGuide = {
                orderID: orderId,
                listCareGuide: serviceOrder.service.serviceDetailList.map(x => ({userTreeID: x.userTreeID, careGuide: x.careGuide}))
            }
            await orderService.updateCareGuideByTechnician(body)
            dispatch(setNoti({type: 'success', message: 'Cập nhật hướng dẫn chăm sóc thành công'}))
        }catch{
            dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
        }
        setActionLoading(false)
    }
    return (
        <div className='tmsod-wrapper'>
            {
                serviceOrder && 
                <>
                <HeaderInfor title={`Quản lý yêu cầu chăm sóc cho đơn hàng "${serviceOrder.orderCode}"`} />
                    <div className="default-layout">
                        <h3>Thông tin đơn hàng</h3>
                        <div className="order-infor-wrapper">
                            <GridConfig>
                                <Row gutter={[24, 24]}>
                                    <Col xs={12} sm={12} md={12} lg={8} xl={8}>
                                        <div className="item">
                                            <span className="label">Tên khách hàng</span>
                                            <span className="content">{serviceOrder.service.name}</span>
                                        </div>
                                    </Col>
                                    <Col xs={12} sm={12} md={12} lg={8} xl={8}>
                                        <div className="item">
                                            <span className="label">Địa chỉ</span>
                                            <span className="content">{serviceOrder.service.address}</span>
                                        </div>
                                    </Col>
                                    <Col xs={12} sm={12} md={12} lg={8} xl={8}>
                                        <div className="item">
                                            <span className="label">Số điện thoại</span>
                                            <span className="content">{serviceOrder.service.phone}</span>
                                        </div>
                                    </Col>
                                    <Col xs={12} sm={12} md={12} lg={8} xl={8}>
                                        <div className="item">
                                            <span className="label">Email</span>
                                            <span className="content">{serviceOrder.service.email}</span>
                                        </div>
                                    </Col>
                                    <Col xs={12} sm={12} md={12} lg={8} xl={8}>
                                        <div className="item">
                                            <span className="label">Thời gian chăm sóc</span>
                                            <span className="content">{utilDateTime.dateToString(serviceOrder.service.startDate.toString())} - {utilDateTime.dateToString(serviceOrder.service.endDate.toString())}</span>
                                        </div>
                                    </Col>
                                    <Col xs={12} sm={12} md={12} lg={8} xl={8}>
                                        <div className="item">
                                            <span className="label">Nơi chăm sóc</span>
                                            <span className="content">
                                                <Transport isTransport={serviceOrder.service.isTransport} isRequest />
                                            </span>
                                        </div>
                                    </Col>
                                    <Col xs={12} sm={12} md={12} lg={8} xl={8}>
                                        <div className="item">
                                            <span className="label">Trạng thái đơn hàng</span>
                                            <span className="content">
                                                <OrderStatusComp status={serviceOrder.status} />
                                            </span>
                                        </div>
                                    </Col>
                                </Row>
                            </GridConfig>
                        </div>
                    </div>
                    <div className="default-layout">
                        <h3>Thông tin của các cây cần chăm sóc</h3>
                        <Table 
                            style={{marginTop: '20px'}} 
                            columns={ColumnServiceOrder} 
                            dataSource={DataSourceServiceOrder} 
                            pagination={false}
                            scroll={{x: 480}}
                         />
                        <Button loading={actionLoading} className='btn btn-create btn-update-care-guide' onClick={handleUpdateCareGuide} >Cập nhật hướng dẫn</Button>
                    </div>
                    {
                        (calendars.length === 0 && (serviceOrder.status === 'paid' || serviceOrder.status === 'ready')) &&
                        <div className="default-layout no-calendar">
                            <h3>Bạn chưa có lịch chăm sóc nào. Hãy tạo mới 1 lịch chăm sóc</h3>
                            <button className='btn btn-create' onClick={() => setActionMethod({orderId: '', actionType: 'create calendar', openIndex: -1, orderType: 'service'})}>Tạo mới 1 lịch chăm sóc</button>
                        </div>
                    }
                    <div className="default-layout">
                        <h3>Thông tin báo cáo</h3>
                        <Table
                            style={{marginTop: '20px'}} 
                            columns={ColumnCalendar} 
                            dataSource={DataSourceCalendar} 
                            pagination={false}
                            scroll={{x: 480}}
                        />
                    </div>
                </>
            }
            {
                (actionMethod?.actionType === 'create calendar' && serviceOrder) &&
                <CreateCalendar
                    serviceOrderDetail={serviceOrder}
                    onClose={handleCloseModal}
                    onSubmit={onSubmitCreateCalendar}
                />
            }
            {
                (actionMethod?.actionType === 'update calendar' && serviceOrder) &&
                <UploadCalendar 
                    serviceCalendarDetail={calendars.filter(x => x.id === actionMethod.orderId)[0]}
                    serviceOrderDetail={serviceOrder}
                    onClose={handleCloseModal}
                    onSubmit={handleUploadCalendar}
                />
            }
            {
                actionMethod?.actionType === 'detail' &&
                <ServiceReportDetail
                    orderCode={serviceOrder?.orderCode || ''}
                    serviceCalendar={calendars.filter(x => x.id === actionMethod.orderId)[0]}
                    onClose={handleCloseModal}
                
                />
            }
        </div>
    )
}

export default TechManageServiceOrderDetail