import Table, { ColumnsType } from 'antd/es/table'
import { ServiceCalendar } from 'app/models/service-calendar'
import utilDateTime from 'app/utils/date-time'
import React, { useMemo, useState } from 'react'
import ListImage from '../renderer/list-image/ListImage'
import Description from '../renderer/description/Description'
import TakeCareStatusComp from '../status/TakeCareStatusComp'
import { Popover } from 'antd'
import { GrMore } from 'react-icons/gr'
import { PaymentControlState } from 'app/models/payment'
import { BiDetail } from 'react-icons/bi'
import { AiOutlineCloudUpload } from 'react-icons/ai'
import { PackageOrder } from 'app/models/package'
import UploadPackageCalendar from './UploadPackageCalendar'
import ServiceReportDetail from '../modal/service-report-detail/ServiceReportDetail'
import dayjs from 'dayjs'

interface TablePackageCalendarProps{
    pkgOrder: PackageOrder
    serviceCalendars: ServiceCalendar[]
    isClient?: boolean
}

const TablePackageCalendar: React.FC<TablePackageCalendarProps> = ({ pkgOrder, serviceCalendars, isClient }) => {
    console.log(serviceCalendars)
    const [calendars, setCalendars] = useState<ServiceCalendar[]>(serviceCalendars)
    console.log(calendars)

    const [actionMethod, setActionMethod] = useState<PaymentControlState>()

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
                <div className="item" onClick={() => {
                    setActionMethod({orderId: record.id, actionType: 'detail', orderType: 'service', openIndex: -1})
                }}>
                    <BiDetail size={25} className='icon'/>
                    <span>Chi tiết báo cáo</span>
                </div>
                {
                    (record.status === 'pending' && dayjs(new Date()).valueOf() >= dayjs(record.serviceDate).valueOf() && !isClient) &&
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

    const ServiceCalSelect = useMemo(() =>{
        const [item] = calendars.filter(x => x.id === actionMethod?.orderId)
        return item
    }, [actionMethod, calendars])

    const handleCloseModal = () =>{
        setActionMethod(undefined)
    }

    const handleUploadCalendar = (prev: ServiceCalendar, next?: ServiceCalendar) =>{
        const index = calendars.findIndex(x => x.id === prev.id)
        calendars[index] = prev

        if(next){
            setCalendars([next, ...calendars])
            return;
        }
        setCalendars([...calendars])
    }

    return (
        <>
            <h3>Thông tin báo cáo</h3>
            <Table
                style={{marginTop: '20px'}} 
                columns={ColumnCalendar} 
                dataSource={DataSourceCalendar} 
                pagination={false}
                scroll={{x: 480}}
            />
            {
                (actionMethod?.actionType === 'update calendar' && ServiceCalSelect) &&
                <UploadPackageCalendar pkgOrder={pkgOrder} serviceCalendar={ServiceCalSelect} onClose={handleCloseModal} onSubmit={handleUploadCalendar} />
            }
            {
                (actionMethod?.actionType === 'detail' && ServiceCalSelect) &&
                <ServiceReportDetail orderCode={pkgOrder.orderCode} serviceCalendar={ServiceCalSelect} onClose={handleCloseModal} />
            }
        </>
    )
}

export default TablePackageCalendar