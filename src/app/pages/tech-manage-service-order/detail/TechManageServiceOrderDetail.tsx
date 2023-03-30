import { Col, DatePicker, DatePickerProps, Image, Input, Modal, Popover, Row } from 'antd';
import locale from 'antd/es/date-picker/locale/vi_VN';
import Table, { ColumnsType } from 'antd/es/table';
import HeaderInfor from 'app/components/header-infor/HeaderInfor';
import useDispatch from 'app/hooks/use-dispatch';
import { PaymentControlState } from 'app/models/payment';
import { ServiceOrderDetail } from 'app/models/service';
import { CalendarUpdate, ServiceCalendar } from 'app/models/service-calendar';
import { OrderStatusToTag } from 'app/pages/manage-take-care-order/ManageTakeCareOrder';
import orderService from 'app/services/order.service';
import serviceCalendar from 'app/services/service-calendar.service';
import uploadService from 'app/services/upload.service';
import { setNoti } from 'app/slices/notification';
import utilDateTime from 'app/utils/date-time';
import { Dayjs } from "dayjs";
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { BiCommentDetail } from 'react-icons/bi';
import { GrMore } from 'react-icons/gr';
import { useParams } from 'react-router-dom';
import './style.scss';

const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY', 'DD-MM-YYYY', 'DD-MM-YY'];

const TechManageServiceOrderDetail: React.FC = () => {
    const { orderId } = useParams()
    const dispatch = useDispatch()
    const ref = useRef<HTMLInputElement>(null);
    // data
    const [serviceOrder, setServiceOrder] = useState<ServiceOrderDetail>();
    const [calendars, setCalendars] = useState<ServiceCalendar[]>([])

    // action
    const [actionMethod, setActionMethod] = useState<PaymentControlState>()

    const [date, setDate] = useState<Dayjs | null>(null)
    // CalendarUpdate type
    const [update, setUpdate] = useState<any>()

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
            title: 'File',
            key: 'reportFileURL',
            dataIndex: 'reportFileURL',
        },
        {
            title: 'Mô tả ngắn gọn',
            key: 'sumary',
            dataIndex: 'sumary',
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
                    setActionMethod({orderId: record.id, actionType: 'update calendar', orderType: 'service', openIndex: -1})
                    // handleAction({orderId: record.orderId, actionType: 'detail', orderType: 'service', openIndex: -1})
                    // navigate(`/panel/take-care-order-assigned/${record.orderId}`)
                }}>
                    <BiCommentDetail size={25} className='icon'/>
                    <span>Chi tiết báo cáo</span>
                </div>
            </div>
        )
    }
    const DataSourceCalendar = useMemo(() =>{
        return calendars.map(x => ({
            ...x
        }))
    }, [calendars])

    const ColumnServiceOrder: ColumnsType<any> = [
        {
            title: 'Tên cây',
            key: 'treeName',
            dataIndex: 'treeName',
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
            title: 'Mô tả của khách hàng',
            key: 'description',
            dataIndex: 'description',
        },
        {
            title: 'Mô tả của quản trị',
            key: 'managerDescription',
            dataIndex: 'managerDescription',
        },
        {
            title: 'Giá tiền',
            key: 'servicePrice',
            dataIndex: 'servicePrice',
        },
    ]
    const DataSourceServiceOrder = useMemo(() =>{
        if(!serviceOrder) return
        
        return serviceOrder.service.serviceDetailList.map(x => {
            const { treeName, imgUrls, quantity, description, managerDescription, servicePrice } = x
            return {
                treeName, imgUrls, quantity, description, managerDescription, servicePrice
            }
        })
    }, [serviceOrder])
    const handleCloseModal = () =>{
        setActionMethod(undefined)
    }
    const handleCreateNewCalendar = async () =>{
        if(!date){
            return dispatch(setNoti({type: 'warning', message: ' Không được để trống ngày chăm sóc'}))
        }
        if(!serviceOrder) return;
        try{
            await serviceCalendar.createServiceCalendar({calendarInitial: {
                serviceDate: date.toDate(),
                serviceOrderId: serviceOrder.id
            }})
            dispatch(setNoti({type: 'success', message: 'Tạo mới ngày chăm sóc đầu tiên thành công'}))
            // set data for array right here
        }catch{

        }
    }
    const handleChangeDateRange: DatePickerProps['onChange'] = (date, dateString) => {
        setDate(date)
        console.log(date, dateString);
    };
    const handleUpdateCalendar = async () =>{
        const [calendar] = calendars.filter(x => x.id === actionMethod?.orderId)
        
        // validate
        if(!update) return;

        try{
            const body: CalendarUpdate = {
                ...update,
                serviceCalendarId: calendar.id
            }
            await serviceCalendar.createServiceCalendar({calendarUpdate: body})
            dispatch(setNoti({type: 'success', message: 'Cập nhật thành công'}))
            setUpdate(undefined)
            // append data
        }catch{

        }
    }
    const handleChangeDateUpdateCalendar: DatePickerProps['onChange'] = (date, dateString) =>{
        setUpdate({
            ...update,
            nextServiceDate: date ? date.toDate() : undefined 
        })
    }
    const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) =>{
        if(!e.target.files) return;
        const file = e.target.files[0]

        // validate File
        const res = await uploadService.uploadListFiles([file])
        setUpdate({
            ...update,
            reportFileURL: res.data[0]
        })
    }
    const handleChangeSummary = (e) =>{
        setUpdate({
            ...update,
            sumary: e.target.value
        })
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
                            <Row gutter={[24, 24]}>
                                <Col span={8}>
                                    <div className="item">
                                        <span className="label">Tên khách hàng</span>
                                        <span className="content">{serviceOrder.service.name}</span>
                                    </div>
                                </Col>
                                <Col span={8}>
                                    <div className="item">
                                        <span className="label">Địa chỉ</span>
                                        <span className="content">{serviceOrder.service.address}</span>
                                    </div>
                                </Col>
                                <Col span={8}>
                                    <div className="item">
                                        <span className="label">Số điện thoại</span>
                                        <span className="content">{serviceOrder.service.phone}</span>
                                    </div>
                                </Col>
                                <Col span={8}>
                                    <div className="item">
                                        <span className="label">Email</span>
                                        <span className="content">{serviceOrder.service.email}</span>
                                    </div>
                                </Col>
                                <Col span={8}>
                                    <div className="item">
                                        <span className="label">Thời gian chăm sóc</span>
                                        <span className="content">{utilDateTime.dateToString(serviceOrder.service.startDate.toString())} - {utilDateTime.dateToString(serviceOrder.service.endDate.toString())}</span>
                                    </div>
                                </Col>
                                <Col span={8}>
                                    <div className="item">
                                        <span className="label">Nơi chăm sóc</span>
                                        <span className="content">{serviceOrder.service.isTransport ? 'Tại vườn' : 'Tại nhà'}</span>
                                    </div>
                                </Col>
                                <Col span={8}>
                                    <div className="item">
                                        <span className="label">Trạng thái đơn hàng</span>
                                        <span className="content">{OrderStatusToTag(serviceOrder.status)}</span>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </div>
                    <div className="default-layout">
                        <h3>Thông tin của các cây cần chăm sóc</h3>
                        <Table style={{marginTop: '20px'}} columns={ColumnServiceOrder} dataSource={DataSourceServiceOrder} pagination={false} />
                    </div>
                    <div className="default-layout">
                        <h3>Bạn chưa có lịch chăm sóc nào. Hãy tạo mới 1 lịch chăm sóc</h3>
                        <button onClick={() => setActionMethod({orderId: '', actionType: 'create calendar', openIndex: -1, orderType: 'service'})}>Tạo mới 1 lịch chăm sóc</button>
                    </div>
                    <div className="default-layout">
                        <h3>Thông tin báo cáo</h3>
                        <Table style={{marginTop: '20px'}} columns={ColumnCalendar} dataSource={DataSourceCalendar} pagination={false} />
                    </div>
                </>
            }
            {
                actionMethod?.actionType === 'create calendar' &&
                <Modal
                    title={`Tạo mới 1 lịch chăm sóc cho đơn hàng ${serviceOrder?.orderCode}`}
                    open
                    onCancel={handleCloseModal}
                    onOk={handleCreateNewCalendar}
                >
                    <p>Chọn ngày chăm sóc đầu tiên</p>
                    <DatePicker
                        locale={locale} 
                        format={dateFormatList}
                        disabledDate={(current) => current && current.valueOf()  < (Date.now())}
                        onChange={handleChangeDateRange}
                    />
                </Modal>
            }
            {
                actionMethod?.actionType === 'update calendar' &&
                <Modal
                    open
                    title={`Cập nhật báo cáo cho ngày chăm sóc "${utilDateTime.dateToString(calendars.filter(x => x.id === actionMethod.orderId)[0].serviceDate.toString())}"`}
                    onCancel={handleCloseModal}
                    onOk={handleUpdateCalendar}
                >
                    <input type='file' hidden ref={ref} accept='.doc,.docx,.pdf' onChange={handleUploadFile} />
                    <button type='button' onClick={() => ref.current?.click()}>
                        <AiOutlineCloudUpload size={30} />
                        <span>
                            {
                                update?.reportFileURL ? update.reportFileURL : 'Chọn file báo cáo'
                            }
                        </span>
                    </button>
                    <div>
                        <div className="update-item">
                            <p>Chọn ngày tiếp theo chăm sóc</p>
                            <DatePicker
                                locale={locale} 
                                format={dateFormatList}
                                disabledDate={(current) => current && current.valueOf()  < Date.now()}
                                onChange={handleChangeDateUpdateCalendar}
                            />
                        </div>
                        <div className="update-item">
                            <p>Mô tả ngắn gọn</p>
                            <Input.TextArea value={update?.sumary} onChange={handleChangeSummary} ></Input.TextArea>
                        </div>
                    </div>
                </Modal>
            }
        </div>
    )
}

export default TechManageServiceOrderDetail