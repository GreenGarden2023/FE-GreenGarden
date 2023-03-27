import {SyncOutlined} from '@ant-design/icons'
import { Modal, Popover, Tag } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import HeaderInfor from 'app/components/header-infor/HeaderInfor'
import AssignTechnician from 'app/components/modal/assign-technician/AssignTechnician'
import UpdateConfirmServiceDetail from 'app/components/modal/update-confirm-service-detail/UpdateConfirmServiceDetail'
import TechnicianName from 'app/components/renderer/technician/TechnicianName'
import UserInforTable from 'app/components/user-infor/UserInforTable'
import useDispatch from 'app/hooks/use-dispatch'
import { ServiceStatus } from 'app/models/general-type'
import { PaymentControlState } from 'app/models/payment'
import { Service, ServiceDetailList } from 'app/models/service'
import { UserGetByRole } from 'app/models/user'
import orderService from 'app/services/order.service'
import serviceService from 'app/services/service.service'
import { setNoti } from 'app/slices/notification'
import utilDateTime from 'app/utils/date-time'
import React, { useEffect, useMemo, useState } from 'react'
import { BiCommentDetail, BiDetail } from 'react-icons/bi'
import { FaCheck } from 'react-icons/fa'
import { GrMore } from 'react-icons/gr'
import { MdOutlineCancel, MdOutlineFileDownloadDone, MdOutlineKeyboardReturn } from 'react-icons/md'

export const ServiceStatusToTag = (status: ServiceStatus) =>{
    switch(status){
        case 'processing': return <Tag className='center' icon={<SyncOutlined  />} color='default' >Đang xử lý</Tag>
        case 'accepted': return <Tag className='center' icon={<FaCheck  />} color='#2db7f5' >Đã xác nhận</Tag>
        case 'rejected': return <Tag className='center' icon={<MdOutlineCancel  />} color='#f50'>Từ chối</Tag>
        case 'confirmed': return <Tag className='center' icon={<MdOutlineFileDownloadDone  />} color='#87d068'>Đã tạo đơn hàng</Tag>
        default: return <Tag className='center' icon={<MdOutlineKeyboardReturn />} color='#108ee9'>Đang xử lý lại</Tag>
    }
}

const ManageTakeCareService: React.FC = () => {
    const dispatch = useDispatch();

    const [serviceOrders, setServiceOrders] = useState<Service[]>([])

    const [actionMethod, setActionMethod] = useState<PaymentControlState>()

    useEffect(() =>{
        const init = async () =>{
            try{
                const res = await serviceService.getAllServiceRequest()
                setServiceOrders(res.data)
            }catch{

            }
        }
        init()
    }, [])

    const handleAction = (data: PaymentControlState) =>{
        const { actionType, orderId } = data
        const [service] = serviceOrders.filter(x => x.id === orderId)

        if(actionType === 'assign'){
            switch(service.status){
                case 'rejected':  return dispatch(setNoti({type: 'info', message: 'Không thể chọn người chăm sóc cho dịch vụ đã bị từ chối'}))
                case 'confirmed':  return dispatch(setNoti({type: 'info', message: 'Không thể chọn người chăm sóc cho dịch vụ đang hoạt động'}))
                case 'processing':  return dispatch(setNoti({type: 'info', message: 'Không thể chọn người chăm sóc cho dịch vụ chưa được xác nhận'}))
            }
        }
        if(actionType === 'accept service' && (service.status !== 'processing')){
            return dispatch(setNoti({type: 'info', message: 'Không thể xác nhận dịch vụ đang xử lý hoặc bị hủy'}))
        }
        if(actionType === 'reject service' && (service.status !== 'processing')){
           
            return dispatch(setNoti({type: 'info', message: 'Không thể từ chối dịch vụ đã được xử lý'}))
        }
        if(actionType === 'update infor') {
            switch(service.status){
                case 'processing':  return dispatch(setNoti({type: 'info', message: 'Không thể cập nhật thông tin cho dịch vụ chưa được xác nhận'}))
                case 'rejected':  return dispatch(setNoti({type: 'info', message: 'Không thể cập nhật thông tin cho dịch vụ đã bị từ chối'}))
                case 'confirmed':  return dispatch(setNoti({type: 'info', message: 'Không thể cập nhật thông tin cho dịch vụ đang hoạt động'}))
            }
        }
        if(actionType === 'create order'){
            switch(service.status){
                case 'processing':  return dispatch(setNoti({type: 'info', message: 'Không thể tạo đơn hàng cho dịch vụ chưa được xác nhận'}))
                case 'rejected':  return dispatch(setNoti({type: 'info', message: 'Không thể tạo đơn hàng cho dịch vụ đã bị từ chối'}))
                case 'confirmed':  return dispatch(setNoti({type: 'info', message: 'Không thể tạo đơn hàng cho dịch vụ đang hoạt động'}))
            }
        }

        setActionMethod(data)
    }

    const contextService = (record) =>{
        return (
            <div className='context-menu-wrapper'>
                <div className="item" onClick={() => {
                    handleAction({orderId: record.id, actionType: 'detail', orderType: 'service', openIndex: -1})
                }}>
                    <BiCommentDetail size={25} className='icon'/>
                    <span>Chi tiết dịch vụ</span>
                </div>
                <div className="item" onClick={() => {
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
                </div>
            </div>
        )
    }

    const ColumnServiceOrder: ColumnsType<any> = [
        {
            title: 'Mã dịch vụ',
            key: 'serviceCode',
            dataIndex: 'serviceCode',
        },
        {
            title: 'Thông tin khách hàng',
            key: 'userInfor',
            dataIndex: 'userInfor',
            width: 400,
            render: (_, record) => (<UserInforTable name={record.name} phone={record.phone} address={record.address} email={record.email} />)
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
            render: (v) => <TechnicianName name={v} />
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
    const calTotalQuantity = (data: ServiceDetailList[]) =>{
        let count = 0;
        for (const item of data) {
            count += item.quantity
        }
        return count
    }
    const DataSourceServiceOrder = useMemo(() =>{
        return serviceOrders.map((x, index) => ({
            key: String(index + 1),
            ...x,
            totalQuantity: calTotalQuantity(x.serviceDetailList),
        }))
    }, [serviceOrders])

    const handleClose = () =>{
        setActionMethod(undefined)
    }
    const handleAssigned = (serviveId: string, user: UserGetByRole) =>{
        const serviceIndex = serviceOrders.findIndex(x => x.id === serviveId)
       
        serviceOrders[serviceIndex].technicianID = user.id
        serviceOrders[serviceIndex].technicianName = user.fullName

        setServiceOrders([...serviceOrders])

        handleClose()
    }
    const handleConfirmService = async() =>{
        const serviceId = actionMethod?.orderId || ''
        const status = actionMethod?.actionType === 'accept service' ? 'accepted' : 'rejected'

        serviceService.updateServiceRequestStatus(serviceId, status)
        const serviceIndex = serviceOrders.findIndex(x => x.id === serviceId)
        serviceOrders[serviceIndex].status = status
        setServiceOrders([...serviceOrders])
        dispatch(setNoti({type: 'success', message: 'Cập nhật trạng thái dịch vụ thành công'}))
        handleClose()
    }
    const handleUpdateService = (service: Service) =>{
        const index = serviceOrders.findIndex(x => x.id === service.id)
        serviceOrders[index] = service
        setServiceOrders([...serviceOrders])
        handleClose()
    }
    const handleCreateServiceOrder = async() =>{
        const serviceIndex = serviceOrders.findIndex(x => x.id === actionMethod?.orderId)
        const service = serviceOrders[serviceIndex]
        try{
            await orderService.createServiceOrder(service.id)
            dispatch(setNoti({type: 'success', message: `Tạo mới đơn hàng thành công cho dịch vụ ${service.serviceCode}`}))
            serviceOrders[serviceIndex].status = 'confirmed'
            setServiceOrders([...serviceOrders])
            handleClose()
        }catch{

        }
    }
    return (
        <div className="mtko-wrapper">
            <HeaderInfor title='Quản lý yêu cầu chăm sóc' />
            <section className="mtko-box default-layout">
                <Table
                    className='table' 
                    columns={ColumnServiceOrder} 
                    dataSource={DataSourceServiceOrder} 
                    scroll={{ y: 680, x: 1500 }}
                />
            </section>
            {
                actionMethod?.actionType === 'assign' &&
                <AssignTechnician
                    service={serviceOrders.filter(x => x.id === actionMethod.orderId)[0]}
                    onClose={handleClose}
                    onSubmit={handleAssigned}
                />
            }
            {
                (actionMethod?.actionType === 'accept service' || actionMethod?.actionType === 'reject service') &&
                <Modal
                    title={`${actionMethod?.actionType === 'accept service' ? 'Xác nhận' : 'Từ chối'} dịch vụ ${serviceOrders.filter(x => x.id === actionMethod.orderId)[0].serviceCode}`}
                    open
                    onCancel={handleClose}
                    onOk={handleConfirmService}
                >

                </Modal>
            }
            {
                actionMethod?.actionType === 'update infor' &&
                <UpdateConfirmServiceDetail
                    service={serviceOrders.filter(x => x.id === actionMethod.orderId)[0]}
                    onClose={handleClose}
                    onSubmit={handleUpdateService}
                />
            }
            {
                (actionMethod?.actionType === 'create order') &&
                <Modal
                    title={`Tạo đơn hàng cho dịch vụ chăm sóc "${serviceOrders.filter(x => x.id === actionMethod.orderId)[0].serviceCode}"`}
                    open
                    onCancel={handleClose}
                    onOk={handleCreateServiceOrder}
                >

                </Modal>
            }
        </div>
    )
}

export default ManageTakeCareService