import { Popover } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import LandingFooter from 'app/components/footer/LandingFooter'
import HeaderInfor from 'app/components/header-infor/HeaderInfor'
import LandingHeader from 'app/components/header/LandingHeader'
import TechnicianName from 'app/components/renderer/technician/TechnicianName'
import { PaymentControlState } from 'app/models/payment'
import { Service, ServiceDetailList } from 'app/models/service'
import serviceService from 'app/services/service.service'
import utilDateTime from 'app/utils/date-time'
import React, { useEffect, useMemo, useState } from 'react'
import { BiCommentDetail } from 'react-icons/bi'
import { GrMore } from 'react-icons/gr'
import { useNavigate } from 'react-router-dom'
import { ServiceStatusToTag } from '../manage-take-care-service/ManageTakeCareService'

const ClientManageTakeCareService: React.FC = () => {
    const navigate = useNavigate();

    const [services, setServices] = useState<Service[]>([])
    const [actionMethod, setActionMethod] = useState<PaymentControlState>()
    useEffect(() =>{
        const init = async () =>{
            try{
                const res = await serviceService.getUserServiceRequest()
                setServices(res.data)
            }catch{

            }
        }
        init()
    }, [])

    const Column: ColumnsType<any> = [
        {
            title: 'Mã dịch vụ',
            key: 'serviceCode',
            dataIndex: 'serviceCode',
        },
        {
            title: 'Ngày tạo đơn hàng',
            key: 'createDate',
            dataIndex: 'createDate',
            render: (v) => (utilDateTime.dateToString(v))
        },
        {
            title: 'Ngày bắt đầu chăm sóc',
            key: 'startDate',
            dataIndex: 'startDate',
            render: (v) => (utilDateTime.dateToString(v))
        },
        {
            title: 'Ngày kết thúc chăm sóc',
            key: 'endDate',
            dataIndex: 'endDate',
            render: (v) => (utilDateTime.dateToString(v))
        },
        {
            title: 'Trạng thái',
            key: 'status',
            dataIndex: 'status',
            width: 200,
            render: (v) => (ServiceStatusToTag(v))
        },
        {
            title: 'Người chăm sóc',
            key: 'technicianName',
            dataIndex: 'technicianName',
            render: (v) => (<TechnicianName name={v} />)
        },
        {
            title: 'Tổng số cây',
            key: 'totalQuantity',
            dataIndex: 'totalQuantity',
        },
        {
            title: 'Xử lý',
            key: 'action',
            dataIndex: 'action',
            align: 'center',
            fixed: 'right',
            render: (_, record, index) => (
                    <Popover
                        content={() => contextService(record)} 
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
            )
        },
    ]
    const contextService = (record) =>{
        return (
            <div className='context-menu-wrapper'>
                <div className="item" onClick={() => {
                    // handleAction({orderId: record.id, actionType: 'detail', orderType: 'service', openIndex: -1})
                    navigate(`/take-care-service/me/${record.id}`)
                }}>
                    <BiCommentDetail size={25} className='icon'/>
                    <span>Chi tiết dịch vụ</span>
                </div>
                {
                    record.serviceOrderID &&
                    <div className="item" onClick={() => {
                        navigate(`/order/service/${record.serviceOrderID}`)
                        // handleAction({orderId: record.id, actionType: 'detail', orderType: 'service', openIndex: -1})
                    }}>
                        <BiCommentDetail size={25} className='icon'/>
                        <span>Xem đơn hàng</span>
                    </div>
                }
                {/* <div className="item" onClick={() => {
                    handleAction({orderId: record.id, actionType: 'accept service', orderType: 'service', openIndex: -1})
                }}>
                    <BiCommentDetail size={25} className='icon'/>
                    <span>Xác nhận yêu cầu</span>
                </div>
                <div className="item" onClick={() => {
                    handleAction({orderId: record.id, actionType: 'reject service', orderType: 'service', openIndex: -1})
                }}>
                    <BiCommentDetail size={25} className='icon'/>
                    <span>Từ chối yêu cầu</span>
                </div>
                <div className="item" 
                    onClick={() => {
                        handleAction({orderId: record.id, actionType: 'assign', orderType: 'service', openIndex: -1})
                    }}
                 >
                    <BiDetail size={25} className='icon'/>
                    <span>Chọn người chăm sóc</span>
                </div>
                <div className="item" 
                    onClick={() => {
                        handleAction({orderId: record.id, actionType: 'update infor', orderType: 'service', openIndex: -1})
                    }}
                 >
                    <BiDetail size={25} className='icon'/>
                    <span>Cập nhật thông tin dịch vụ</span>
                </div>
                <div className="item" 
                    onClick={() => {
                        handleAction({orderId: record.id, actionType: 'create order', orderType: 'service', openIndex: -1})
                    }}
                 >
                    <BiDetail size={25} className='icon'/>
                    <span>Tạo đơn hàng</span>
                </div> */}
            </div>
        )
    }
    const calTotalQuantity = (data: ServiceDetailList[]) =>{
        let count = 0;
        for (const item of data) {
            count += item.quantity
        }
        return count
    }
    const DataSource = useMemo(() =>{
        return services.map((x, index) => ({
            key: String(index + 1),
            ...x,
            totalQuantity: calTotalQuantity(x.serviceDetailList),
        }))
    }, [services])

    

    return (
        <div>
            <LandingHeader />
                <div className="main-content-not-home">
                    <div className="container-wrapper cmtcs-wrapper">
                        <HeaderInfor title='Yêu cầu chăm sóc cây của bạn' />
                        <div className="default-layout">
                            <Table columns={Column} dataSource={DataSource} scroll={{x: 1500}} />
                        </div>
                    </div>
                </div>
            <LandingFooter />
        </div>
    )
}

export default ClientManageTakeCareService