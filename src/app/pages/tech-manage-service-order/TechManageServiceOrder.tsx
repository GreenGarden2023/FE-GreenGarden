import { Popover } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import HeaderInfor from 'app/components/header-infor/HeaderInfor'
import MoneyFormat from 'app/components/money/MoneyFormat'
import UserInforTable from 'app/components/user-infor/UserInforTable'
import useSelector from 'app/hooks/use-selector'
import { PaymentControlState } from 'app/models/payment'
import { ServiceDetailList, ServiceOrderList } from 'app/models/service'
import orderService from 'app/services/order.service'
import utilDateTime from 'app/utils/date-time'
import React, { useEffect, useMemo, useState } from 'react'
import { BiCommentDetail } from 'react-icons/bi'
import { GrMore } from 'react-icons/gr'
import { useNavigate } from 'react-router-dom'
import { OrderStatusToTag } from '../manage-take-care-order/ManageTakeCareOrder'

const TechManageServiceOrder: React.FC = () => {
    // const dispatch = useDispatch()
    const navigate = useNavigate()
    const userState = useSelector(state => state.userInfor)

    // data
    const [serviceOrders, setServiceOrders] = useState<ServiceOrderList[]>([])

    // action
    const [actionMethod, setActionMethod] = useState<PaymentControlState>()

    useEffect(() =>{
        const {id} = userState.user
        if(!id) return;

        const init = async () =>{
            try{
                const res = await orderService.getServiceOrdersByTechnician(id, {curPage: 1, pageCount: 10})
                setServiceOrders(res.data.serviceOrderList)
            }catch{

            }
        }
        init()
    }, [userState])

    const ColumnServiceOrder: ColumnsType<any> = [
        {
            title: 'Mã đơn hàng',
            key: 'orderCode',
            dataIndex: 'orderCode',
        },
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
            title: 'Số lượng cây',
            key: 'totalQuantity',
            dataIndex: 'totalQuantity',
        },
        {
            title: 'Trạng thái',
            key: 'status',
            dataIndex: 'status',
            width: 200,
            render: (v) => OrderStatusToTag(v)
        },
        {
            title: 'Tổng tiền',
            key: 'totalPrice',
            dataIndex: 'totalPrice',
            align: 'right',
            render: (v) => <MoneyFormat value={v} color='Blue' isHighlight />
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
                    // handleAction({orderId: record.orderId, actionType: 'detail', orderType: 'service', openIndex: -1})
                    navigate(`/panel/take-care-order-assigned/${record.orderId}`)
                }}>
                    <BiCommentDetail size={25} className='icon'/>
                    <span>Chi tiết đơn hàng</span>
                </div>
            </div>
        )
    }
    // const handleAction = (data: PaymentControlState) =>{
    //     const { actionType, orderId } = data
    //     console.log(orderId)
    //     const [order] = serviceOrders.filter(x => x.id === orderId)

    //     if(actionType === 'deposit'){
    //         switch(order.status){
    //             case 'cancel': return dispatch(setNoti({type: 'info', message: 'Không thể thanh toán tiền cọc cho đơn hàng đã bị hủy'}))
    //             case 'completed': 
    //             case 'paid': 
    //             case 'ready': return dispatch(setNoti({type: 'info', message: 'Không thể thanh toán tiền cọc cho đơn hàng đã thanh toán'}))
    //         }
    //     }
    //     if(actionType === 'remaining'){
    //         switch(order.status){
    //             case 'cancel': return dispatch(setNoti({type: 'info', message: 'Không thể thanh toán tổng tiền cho đơn hàng đã bị hủy'}))
    //             case 'completed': 
    //             case 'paid': return dispatch(setNoti({type: 'info', message: 'Không thể thanh toán tổng tiền cho đơn hàng đã thanh toán'}))
    //         }
    //     }
    //     setActionMethod(data)
    // }
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
            orderId: x.id,
            orderCode: x.orderCode,
            serviceCode: x.service.serviceCode,
            createDate: x.createDate,
            startDate: x.service.startDate,
            endDate: x.service.endDate,
            status: x.status,
            totalQuantity: calTotalQuantity(x.service.serviceDetailList),
            transportFee: x.transportFee,
            deposit: x.deposit,
            remainAmount: x.remainAmount,
            discountAmount: x.discountAmount,
            totalPrice: x.totalPrice,
            name: x.service.name,
            address: x.service.address,
            phone: x.service.phone,
            email: x.service.email
        }))
    }, [serviceOrders])

    return (
        <div className='tmso-wrapper'>
            <HeaderInfor title='Quản lý những yêu cầu chăm sóc cây của bạn' />
            <section className="default-layout">
                <Table
                    className='table' 
                    columns={ColumnServiceOrder} 
                    dataSource={DataSourceServiceOrder} 
                    scroll={{ y: 680, x: 2200 }}
                    // pagination={{
                    //     current: paging.curPage,
                    //     pageSize: paging.pageSize,
                    //     total: paging.recordCount,
                    //     onChange: (page: number) =>{
                    //         setRecall(true)
                    //         navigate(`/panel/sale-order?page=${page}`)
                    //     }
                    // }}
                />
            </section>
        </div>
    )
}

export default TechManageServiceOrder