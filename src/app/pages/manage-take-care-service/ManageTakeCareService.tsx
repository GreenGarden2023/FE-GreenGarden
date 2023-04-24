import { Modal, Popover } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import HeaderInfor from 'app/components/header-infor/HeaderInfor'
import AssignTechnician from 'app/components/modal/assign-technician/AssignTechnician'
import UpdateConfirmServiceDetail from 'app/components/modal/update-confirm-service-detail/UpdateConfirmServiceDetail'
import TechnicianName from 'app/components/renderer/technician/TechnicianName'
import Transport from 'app/components/renderer/transport/Transport'
import ServiceStatusComp from 'app/components/status/ServiceStatusComp'
import UserInforTable from 'app/components/user-infor/UserInforTable'
import useDispatch from 'app/hooks/use-dispatch'
import { PaymentControlState } from 'app/models/payment'
import { Service, ServiceDetailList } from 'app/models/service'
import { ShippingFee } from 'app/models/shipping-fee'
import { UserGetByRole } from 'app/models/user'
import orderService from 'app/services/order.service'
import serviceService from 'app/services/service.service'
import shippingFeeService from 'app/services/shipping-fee.service'
import { setNoti } from 'app/slices/notification'
import utilDateTime from 'app/utils/date-time'
import React, { useEffect, useMemo, useState } from 'react'
import { BiCommentDetail, BiDetail } from 'react-icons/bi'
import { GrMore } from 'react-icons/gr'

const ManageTakeCareService: React.FC = () => {
    const dispatch = useDispatch();

    const [serviceOrders, setServiceOrders] = useState<Service[]>([])
    const [shipping, setShipping] = useState<ShippingFee[]>([])

    const [actionMethod, setActionMethod] = useState<PaymentControlState>()

    useEffect(() =>{
        const init = async () =>{
            try{
                const res = await shippingFeeService.getList()
                setShipping(res.data)
            }catch{

            }
        }
        init()
    }, [])

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

   

    const contextService = (record) =>{
        return (
            <div className='context-menu-wrapper'>
                <div className="item" onClick={() => {
                    setActionMethod({orderId: record.id, actionType: 'detail', orderType: 'service', openIndex: -1})
                }}>
                    <BiCommentDetail size={25} className='icon'/>
                    <span>Chi tiết dịch vụ</span>
                </div>
                {
                    (record.status === 'processing' || record.status === 'reprocess') && 
                    <div className="item" onClick={() => {
                        setActionMethod({orderId: record.id, actionType: 'accept service', orderType: 'service', openIndex: -1})
                    }}>
                        <BiCommentDetail size={25} className='icon'/>
                        <span>Xác nhận yêu cầu</span>
                    </div>
                }
                {
                    (record.status === 'processing' || record.status === 'reprocess' || record.status === 'accepted') &&
                    <div className="item" onClick={() => {
                        setActionMethod({orderId: record.id, actionType: 'reject service', orderType: 'service', openIndex: -1})
                    }}>
                        <BiCommentDetail size={25} className='icon'/>
                        <span>Từ chối yêu cầu</span>
                    </div>
                }
                {
                    (record.status === 'accepted') &&
                    <div className="item" 
                        onClick={() => {
                            setActionMethod({orderId: record.id, actionType: 'assign', orderType: 'service', openIndex: -1})
                        }}
                    >
                        <BiDetail size={25} className='icon'/>
                        <span>Chọn người chăm sóc</span>
                    </div>
                }
                {
                    (record.status === 'accepted' && record.technicianID) &&
                    <div className="item" 
                        onClick={() => {
                            setActionMethod({orderId: record.id, actionType: 'update infor', orderType: 'service', openIndex: -1})
                        }}
                    >
                        <BiDetail size={25} className='icon'/>
                        <span>Cập nhật thông tin dịch vụ</span>
                    </div>
                }
                {
                    record.status === 'user approved' &&
                    <div className="item" 
                        onClick={() => {
                            setActionMethod({orderId: record.id, actionType: 'create order', orderType: 'service', openIndex: -1})
                        }}
                    >
                        <BiDetail size={25} className='icon'/>
                        <span>Tạo đơn hàng</span>
                    </div>
                }
            </div>
        )
    }

    const ColumnServiceOrder: ColumnsType<any> = [
        {
            title: 'Mã dịch vụ',
            key: 'serviceCode',
            dataIndex: 'serviceCode',
            fixed: 'left'
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
            render: (v) => (<ServiceStatusComp status={v} />)
        },
        {
            title: 'Nơi chăm sóc',
            key: 'isTransport',
            dataIndex: 'isTransport',
            render: (v) => (<Transport isTransport={v} isRequest />)
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

        serviceService.updateServiceRequestStatus(serviceId, 'accepted')
        const serviceIndex = serviceOrders.findIndex(x => x.id === serviceId)
        serviceOrders[serviceIndex].status = 'accepted'
        setServiceOrders([...serviceOrders])
        dispatch(setNoti({type: 'success', message: 'Cập nhật trạng thái yêu cầu chăm sóc thành công'}))
        handleClose()
    }

    const handleRejectService = async () =>{
        const serviceId = actionMethod?.orderId || ''
        serviceService.updateServiceRequestStatus(serviceId, 'rejected')
        const [service] = serviceOrders.filter(x => x.id === serviceId)
        service.status = 'rejected'
        setServiceOrders([...serviceOrders])
        dispatch(setNoti({type: 'success', message: 'Cập nhật trạng thái yêu cầu chăm sóc thành công'}))
        handleClose()
    }

    const handleUpdateService = (service: Service) =>{
        console.log({service})
        const index = serviceOrders.findIndex(x => x.id === service.id)
        serviceOrders[index] = service
        setServiceOrders([...serviceOrders])
        handleClose()
    }
    const handleCreateServiceOrder = async() =>{
        const [service] = serviceOrders.filter(x => x.id === actionMethod?.orderId)
        try{
            await orderService.createServiceOrder(service.id)
            dispatch(setNoti({type: 'success', message: `Tạo mới đơn hàng thành công cho dịch vụ ${service.serviceCode}`}))
            service.status = 'confirmed'
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
                    scroll={{ y: 680, x: 2000 }}
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
                (actionMethod?.actionType === 'accept service') &&
                <Modal
                    title={`Chấp nhận yêu cầu "${serviceOrders.filter(x => x.id === actionMethod.orderId)[0].serviceCode}"`}
                    open
                    onCancel={handleClose}
                    onOk={handleConfirmService}
                >

                </Modal>
            }
            {
                (actionMethod?.actionType === 'reject service') &&
                <Modal
                    title={`Từ chối yêu cầu "${serviceOrders.filter(x => x.id === actionMethod.orderId)[0].serviceCode}"`}
                    open
                    onCancel={handleClose}
                    onOk={handleRejectService}
                >

                </Modal>
            }
            {
                (actionMethod?.actionType === 'update infor' || actionMethod?.actionType === 'detail') &&
                <UpdateConfirmServiceDetail
                    service={serviceOrders.filter(x => x.id === actionMethod.orderId)[0]}
                    shipping={shipping}
                    isOnlyView={actionMethod?.actionType === 'detail'}
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