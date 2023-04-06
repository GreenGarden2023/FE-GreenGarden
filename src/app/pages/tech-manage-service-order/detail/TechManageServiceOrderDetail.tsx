import { Button, Col, DatePicker, DatePickerProps, Form, Image, Input, Modal, Popover, Row } from 'antd';
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
import CONSTANT from 'app/utils/constant';
import ErrorMessage from 'app/components/message.tsx/ErrorMessage';
import { CiSquareRemove } from 'react-icons/ci';
import ListImage from 'app/components/renderer/list-image/ListImage';
import Description from 'app/components/renderer/description/Description';
import TreeName from 'app/components/renderer/tree-name/TreeName';
import MoneyFormat from 'app/components/money/MoneyFormat';
import ServiceReportDetail from 'app/components/modal/service-report-detail/ServiceReportDetail';

const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY', 'DD-MM-YYYY', 'DD-MM-YY'];

const TechManageServiceOrderDetail: React.FC = () => {
    const { orderId } = useParams()
    const dispatch = useDispatch()
    const ref = useRef<HTMLInputElement>(null);
    // data
    const [serviceOrder, setServiceOrder] = useState<ServiceOrderDetail>();
    const [calendars, setCalendars] = useState<ServiceCalendar[]>([])
    const [errorImgs, setErrorImgs] = useState('')
    const [errorCalendar, setErrorCalendar] = useState('')

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
            title: 'Hình ảnh',
            key: 'images',
            dataIndex: 'images',
            render: (v) => (v && <ListImage listImgs={v} />)
        },
        {
            title: 'Mô tả ngắn gọn',
            key: 'sumary',
            dataIndex: 'sumary',
            width: 300,
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
                {
                    record.status === 'done' && 
                    <div className="item" onClick={() => {
                        setActionMethod({orderId: record.id, actionType: 'detail', orderType: 'service', openIndex: -1})
                    }}>
                        <BiCommentDetail size={25} className='icon'/>
                        <span>Chi tiết báo cáo</span>
                    </div>
                }
                {/* && !record.nextServiceDate && utilDateTime.getDiff2Days(record.serviceDate, new Date()) */}
                {/* utilDateTime.getDiff2Days(record.serviceDate, new Date()) === 0 */}
                {
                    record.status === 'pending' &&
                    <div className="item" onClick={() => {
                        setActionMethod({orderId: record.id, actionType: 'update calendar', orderType: 'service', openIndex: -1})
                    }}>
                        <BiCommentDetail size={25} className='icon'/>
                        <span>Đăng tải báo cáo</span>
                    </div>
                }
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
            render: (v) => (<MoneyFormat value={v} isHighlight color='Blue' />)
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
            const res = await serviceCalendar.createServiceCalendar({calendarInitial: {
                serviceDate: date.toDate(),
                serviceOrderId: serviceOrder.id
            }})
            dispatch(setNoti({type: 'success', message: 'Tạo mới ngày chăm sóc đầu tiên thành công'}))
            handleCloseModal()
            setCalendars([...calendars, res.data.nextCalendar])
            // set data for array right here
        }catch{

        }
    }
    const handleChangeDateRange: DatePickerProps['onChange'] = (date, dateString) => {
        setDate(date)
        console.log(date, dateString);
    };
    const handleUpdateCalendar = async () =>{
        if(!serviceOrder) return;

        let [calendar] = calendars.filter(x => x.id === actionMethod?.orderId)

        if(!update){
            setErrorImgs('Hình ảnh không được để trống')
            return;
        }

        // validate
        if(update.images.length === 0){
            setErrorImgs('Hình ảnh không được để trống')
            return;
        }
        if(utilDateTime.getDiff2Days(serviceOrder.service.endDate, new Date()) !== 0){
            if(!update.nextServiceDate){
                setErrorCalendar('Lịch chăm sóc không được để trống')
                return;
            }
        }


        try{
            const body: CalendarUpdate = {
                ...update,
                serviceCalendarId: calendar.id
            }
            // console.log({body})
            await serviceCalendar.createServiceCalendar({calendarUpdate: body})
            dispatch(setNoti({type: 'success', message: 'Cập nhật thành công'}))
            setUpdate(undefined)
            handleCloseModal()
            const res = await serviceCalendar.getServiceCalendarByServiceOrder(orderId || '')
            setCalendars(res.data)
            // truong hop ngay cuoi se update lai order
            if(utilDateTime.getDiff2Days(serviceOrder.service.endDate, new Date()) !== 0){
                const res = await orderService.getAServiceOrderDetail(orderId || '')
                setServiceOrder(res.data)
            }
            // append data
        }catch{

        }
    }
    const handleChangeDateUpdateCalendar: DatePickerProps['onChange'] = (date, dateString) =>{
        if(!date){
            setUpdate({
                ...update,
                nextServiceDate: undefined
            })
            return;
        }
        setErrorCalendar('')
        setUpdate({
            ...update,
            nextServiceDate: date ? date.toDate().toLocaleDateString() : undefined 
        })
    }
    const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) =>{
        const files = e.target.files
        if(!files) return;

        const finalFiles: File[] = []
        for (let i = 0; i < files.length; i++) {
            
            const file = files[i];

            if(!CONSTANT.SUPPORT_FORMATS.includes(file.type)){
                setErrorImgs(`Định dạng ảnh chỉ chấp nhận ${CONSTANT.SUPPORT_FORMATS.join(' - ')}`)
                return;
            }
            finalFiles.push(file)
        }
        setErrorImgs('')
        // validate File
        const res = await uploadService.uploadListFiles(finalFiles)
        if(update && update.images && update.images.length !== 0){
            setUpdate({
                ...update,
                images: [...update.images, ...res.data]
            })
        }else{
            setUpdate({
                ...update,
                images: res.data
            })
        }
    }
    const handleChangeSummary = (e) =>{
        setUpdate({
            ...update,
            sumary: e.target.value
        })
    }
    const handleRemoveImage = (index: number) =>{
        update.images.splice(index, 1)
        setUpdate({...update})
    }
    console.log({update})
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
                    {
                        (calendars.length === 0 && serviceOrder.status === 'paid') &&
                        <div className="default-layout no-calendar">
                            <h3>Bạn chưa có lịch chăm sóc nào. Hãy tạo mới 1 lịch chăm sóc</h3>
                            <button className='btn btn-create' onClick={() => setActionMethod({orderId: '', actionType: 'create calendar', openIndex: -1, orderType: 'service'})}>Tạo mới 1 lịch chăm sóc</button>
                        </div>
                    }
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
                    footer={false}
                >
                    <Form
                        layout='vertical'
                        onFinish={handleCreateNewCalendar}
                    >
                        <Form.Item label='Chọn ngày chăm sóc đầu tiên'>
                            {
                                serviceOrder &&
                                // chỉ enable khoảng ngày đc phép
                                <DatePicker
                                    locale={locale} 
                                    format={dateFormatList}
                                    disabledDate={(current) => current && current.valueOf()  < (Date.now()) && current.valueOf() > serviceOrder?.service.endDate.valueOf()}
                                    onChange={handleChangeDateRange}
                                />
                            }
                        </Form.Item>
                        <div className='btn-form-wrapper'>
                            <Button htmlType='button'  type='default' className='btn-cancel' size='large' onClick={handleCloseModal}>Hủy bỏ</Button>
                            <Button htmlType='submit'  type='primary' className='btn-update' size='large'>
                                Tạo mới
                            </Button>
                        </div>
                    </Form>
                </Modal>
            }
            {
                actionMethod?.actionType === 'update calendar' &&
                <Modal
                    open
                    title={`Cập nhật báo cáo cho ngày chăm sóc "${utilDateTime.dateToString(calendars.filter(x => x.id === actionMethod.orderId)[0].serviceDate.toString())}"`}
                    onCancel={handleCloseModal}
                    footer={false}
                    width={1000}
                >
                    <Form
                        layout='vertical'
                        onFinish={handleUpdateCalendar}
                    >
                        <input type='file' hidden ref={ref} accept='.png,.jpg,.jpeg' multiple onChange={handleUploadFile} />
                        <button type='button' onClick={() => ref.current?.click()} className='btn btn-upload'>
                            <AiOutlineCloudUpload size={30} />
                            Đăng tải hình ảnh chăm sóc
                        </button>
                        {errorImgs && <ErrorMessage message={errorImgs} />}
                        {
                            (update && update.images) && 
                            <Row style={{marginTop: '20px'}} gutter={[24, 0]}>
                                <Image.PreviewGroup>
                                    {
                                        update.images?.map((item, index) => (
                                            <Col span={6} key={index} className='preview-wrapper'>
                                                <Image 
                                                    src={item}
                                                    alt='/'
                                                    className='img-preview'
                                                />
                                                <CiSquareRemove size={30} onClick={() => handleRemoveImage(index)} className='btn-remove' />
                                            </Col>
                                        ))
                                    }
                                </Image.PreviewGroup>
                            </Row>
                        }
                        <Form.Item label='Chọn ngày chăm sóc tiếp theo'>
                            <DatePicker
                                locale={locale} 
                                format={dateFormatList}
                                disabledDate={(current) => current && current.valueOf()  < Date.now()}
                                onChange={handleChangeDateUpdateCalendar}
                            />
                            {errorCalendar && <ErrorMessage message={errorCalendar} />}
                        </Form.Item>
                        <Form.Item className='Mô tả ngắn gọn'>
                            <Input.TextArea autoSize={{minRows: 4, maxRows: 6}} value={update?.sumary} onChange={handleChangeSummary} ></Input.TextArea>
                        </Form.Item>
                        <div className='btn-form-wrapper'>
                            <Button htmlType='button'  type='default' className='btn-cancel' size='large' onClick={handleCloseModal}>Hủy bỏ</Button>
                            <Button htmlType='submit'  type='primary' className='btn-update' size='large'>
                                Tạo mới
                            </Button>
                        </div>
                    </Form>
                </Modal>
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