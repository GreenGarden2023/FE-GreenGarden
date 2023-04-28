import { Button, Modal, Popover } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import HeaderInfor from 'app/components/header-infor/HeaderInfor'
import CancelOrder from 'app/components/modal/cancel-order/CancelOrder'
import FinishOrder from 'app/components/modal/finish-order/FinishOrder'
import RefundOrder from 'app/components/modal/refundOrder.tsx/RefundOrder'
import TransactionDetail from 'app/components/modal/transaction-detail/TransactionDetail'
import UpdateConfirmServiceDetail from 'app/components/modal/update-confirm-service-detail/UpdateConfirmServiceDetail'
import MoneyFormat from 'app/components/money/MoneyFormat'
import TechnicianName from 'app/components/renderer/technician/TechnicianName'
import Transport from 'app/components/renderer/transport/Transport'
import Filtering from 'app/components/search-and-filter/filter/Filtering'
import NoResult from 'app/components/search-and-filter/no-result/NoResult'
import Searching from 'app/components/search-and-filter/search/Searching'
import OrderStatusComp from 'app/components/status/OrderStatusComp'
import UserInforTable from 'app/components/user-infor/UserInforTable'
import UserInforOrder from 'app/components/user-infor/user-infor-order/UserInforOrder'
import useDispatch from 'app/hooks/use-dispatch'
import useSelector from 'app/hooks/use-selector'
import { OrderStatus } from 'app/models/general-type'
import { Paging } from 'app/models/paging'
import { PaymentControlState } from 'app/models/payment'
import { ServiceDetailList, ServiceOrderList } from 'app/models/service'
import { ShippingFee } from 'app/models/shipping-fee'
import orderService from 'app/services/order.service'
import paymentService from 'app/services/payment.service'
import serviceService from 'app/services/service.service'
import shippingFeeService from 'app/services/shipping-fee.service'
import { setNoti } from 'app/slices/notification'
import CONSTANT from 'app/utils/constant'
import utilDateTime from 'app/utils/date-time'
import pagingPath from 'app/utils/paging-path'
import React, { useEffect, useMemo, useState } from 'react'
import CurrencyFormat from 'react-currency-format'
import { AiOutlineTransaction } from 'react-icons/ai'
import { BiDetail } from 'react-icons/bi'
import { BsCheck2All } from 'react-icons/bs'
import { GrMore } from 'react-icons/gr'
import { MdCancelPresentation, MdOutlinePayment, MdOutlinePayments } from 'react-icons/md'
import { useNavigate, useSearchParams } from 'react-router-dom'

const ManageTakeCareOrder: React.FC = () => {
    const dispatch = useDispatch()
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { search, filter } = useSelector(state => state.SearchFilter)

    const [serviceOrders, setServiceOrders] = useState<ServiceOrderList[]>([])
    const [paging, setPaging] = useState<Partial<Paging>>({curPage: 1, pageSize: CONSTANT.PAGING_ITEMS.MANAGE_ORDER_RENT})

    const [amount, setAmount] = useState(0);
    const [shipping, setShipping] = useState<ShippingFee[]>([])

    const [actionMethod, setActionMethod] = useState<PaymentControlState>()
    const [loadingAction, setLoadingAction] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() =>{
        const init = async () =>{
            try{
                const res = await shippingFeeService.getList()
                setShipping(res.data)
            }catch{
                dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
            }
        }
        init()
    }, [dispatch])

    useEffect(() =>{
        pagingPath.scrollTop()
        const currentPage = searchParams.get('page');
        
        if(!pagingPath.isValidPaging(currentPage)){
            setPaging({curPage: 1, pageSize: CONSTANT.PAGING_ITEMS.MANAGE_ORDER_RENT})
            return navigate('/panel/take-care-order?page=1')
        }
        
        const { isSearching, orderCode, phone, status } = search
        if(isSearching && (orderCode || phone || status)){
            const initSearch = async () =>{
                setLoading(true)
                try{
                    const res = await orderService.getServiceOrderDetailByOrderCode({curPage: Number(currentPage), pageSize: paging.pageSize}, {orderCode, phone, status})
                    setServiceOrders(res.data.serviceOrderList)
                    setPaging(res.data.paging)
                }catch{
                    dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
                }
                setLoading(false)
            }
            initSearch()
        }else if(filter.isFiltering && filter.startDate && filter.endDate){
            const init = async () =>{
                setLoading(true)
                try{
                    const res = await orderService.getSerivceOrderDetailByRangeDate({curPage: Number(currentPage), pageSize: paging.pageSize}, filter.startDate || '', filter.endDate || '')
                    setServiceOrders(res.data.serviceOrderList)
                    setPaging(res.data.paging)
                }catch{
                    dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
                }
                setLoading(false)
            }
            init()
        }else{
            const init = async () =>{
                setLoading(true)
                try{
                    const res = await orderService.getAllServiceOrders({curPage: Number(currentPage), pageSize: paging.pageSize})
                    setServiceOrders(res.data.serviceOrderList)
                    setPaging(res.data.paging)
                }catch{
                    dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
                }
                setLoading(false)
            }
            init()
        }
    }, [navigate, searchParams, paging.pageSize, search, filter, dispatch])

    const contextService = (record) =>{
        return (
            <div className='context-menu-wrapper'>
                <div className="item" onClick={() => {
                    setActionMethod({orderId: record.orderId, actionType: 'detail', orderType: 'service', openIndex: -1})
                }}>
                    <BiDetail size={25} className='icon'/>
                    <span>Chi tiết đơn hàng</span>
                </div>
                <div className="item" onClick={() => {
                    setActionMethod({orderId: record.orderId, actionType: 'view transaction', orderType: 'service', openIndex: -1})
                }}>
                    <AiOutlineTransaction size={25} className='icon'/>
                    <span>Xem giao dịch</span>
                </div>
                {
                    (record.status === 'unpaid') && 
                    <div className="item" onClick={() => {
                        setActionMethod({orderId: record.orderId, actionType: 'deposit', orderType: 'service', openIndex: -1})
                    }}>
                        <MdOutlinePayments size={25} className='icon'/>
                        <span>Thanh toán tiền cọc</span>
                    </div>
                }
                {
                    (record.status === 'ready') &&
                    <div className="item" onClick={() => {
                        setActionMethod({orderId: record.orderId, actionType: 'remaining', orderType: 'service', openIndex: -1})
                    }}>
                        <MdOutlinePayment size={25} className='icon'/>
                        <span>Thanh toán đơn hàng</span>
                    </div>
                }
                {
                    ((record.status === 'paid' && !record.isTransport) || record.status === 'delivery') && 
                    <div className="item" onClick={() => {
                        setActionMethod({orderId: record.orderId, actionType: 'finished', orderType: 'sale', openIndex: -1})
                    }}>
                        <BsCheck2All size={25} className='icon'/>
                        <span>Hoàn thành</span>
                    </div>
                }
                {
                    record.status === 'cancel' &&
                    <div className="item" onClick={() => {
                        setActionMethod({orderId: record.orderId, actionType: 'refund', orderType: 'service', openIndex: -1})
                    }}>
                        <BsCheck2All size={25} className='icon'/>
                        <span>Hoàn tiền</span>
                    </div>
                }
                {
                    (record.status !== 'completed' && record.status !== 'cancel') &&
                    <div className="item" onClick={() => {
                        setActionMethod({orderId: record.orderId, actionType: 'cancel', orderType: 'service', openIndex: -1})
                    }}>
                        <MdCancelPresentation size={25} className='icon'/>
                        <span>Hủy đơn hàng</span>
                    </div>
                }
            </div>
        )
    }

    const ColumnServiceOrder: ColumnsType<any> = [
        {
            title: 'Mã đơn hàng',
            key: 'orderCode',
            dataIndex: 'orderCode',
            fixed: 'left'
        },
        {
            title: 'Mã dịch vụ',
            key: 'serviceCode',
            dataIndex: 'serviceCode',
            width: 220
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
            title: 'Người chăm sóc',
            key: 'technicianName',
            dataIndex: 'technicianName',
            render: (v) => <TechnicianName name={v} />
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
            render: (v) => (<OrderStatusComp status={v} />)
        },
        {
            title: 'Nơi chăm sóc',
            key: 'isTransport',
            dataIndex: 'isTransport',
            render: (v) => (<Transport isTransport={v} isRequest />)
        },
        {
            title: 'Phí vận chuyển',
            key: 'transportFee',
            dataIndex: 'transportFee',
            align:'right',
            width: 200,
            render: (v) => <MoneyFormat value={v} color='Default'  />
        },
        {
            title: 'Tiền cọc',
            key: 'deposit',
            dataIndex: 'deposit',
            align:'right',
            width: 200,
            render: (v) => <MoneyFormat value={v} color='Orange'  />
        },
        
        {
            title: 'Tiền được giảm',
            key: 'discountAmount',
            dataIndex: 'discountAmount',
            align:'right',
            width: 200,
            render: (v) => <MoneyFormat value={v} color='Yellow'  />
        },
        {
            title: 'Tổng tiền',
            key: 'totalPrice',
            dataIndex: 'totalPrice',
            align:'right',
            width: 200,
            render: (v) => <MoneyFormat value={v} color='Light Blue'  />
        },
        {
            title: 'Tiền còn thiếu',
            key: 'remainAmount',
            dataIndex: 'remainAmount',
            align:'right',
            width: 200,
            fixed: 'right',
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
            technicianName: x.technician.technicianFullName,
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
    const handleClose = () =>{
        setAmount(0)
        setActionMethod(undefined)
    }
    const handlePaymentDeposit = async () =>{
        setLoadingAction(true)
        try{
            await paymentService.depositPaymentCash(actionMethod?.orderId || '', 'service')
            setServiceOrders(serviceOrders.map(x => x.id === actionMethod?.orderId ? ({
                ...x,
                status: 'ready',
                remainAmount: x.remainAmount - x.deposit
            }) : x))
            handleClose()
            dispatch(setNoti({type: 'success', message: 'Thanh toán đặt cọc thành công'}))
        }catch{
            dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
        }
        setLoadingAction(false)
    }
    const handlePaymentCash = async () =>{
        const [order] = serviceOrders.filter(x => x.id === actionMethod?.orderId)
        const total = order.remainAmount - amount

        if(amount < 1000 && (total < 1000 || total === 0)){
            dispatch(setNoti({type: 'error', message: CONSTANT.PAYMENT_MESSAGE.MIN_AMOUNT_PAYMENT}))
            return;
        }
        setLoadingAction(true)
        try{
            await paymentService.paymentCash(actionMethod?.orderId || '', amount, 'service', total === 0 ? 'whole' : '')
            if(total === 0){
                order.status = 'paid'

                // update status for request is 'taking care'
                await serviceService.updateServiceRequestStatus(order.service.id, 'taking care')
            }
            order.remainAmount = total
            setServiceOrders([...serviceOrders])
            dispatch(setNoti({type: 'success', message: 'Cập nhật đơn hàng thành công'}))
            handleClose()
        }catch{
            dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
        }
        setLoadingAction(false)
    }
    
    const handleCancelOrder = () =>{
        const [order] = serviceOrders.filter(x => x.id === actionMethod?.orderId)

        order.status = 'cancel'
        setServiceOrders([...serviceOrders])
        handleClose()
    }
    const handleRefund = () =>{
        handleClose()
    }
    const OrderTakeCareDetail = useMemo(() =>{
        if(!actionMethod) return {}

        const [order] = serviceOrders.filter(x => x.id === actionMethod.orderId)
        if(!order) return {};

        const { service, createDate, status, deposit, transportFee, totalPrice, remainAmount, reason, nameCancelBy } = order
        const { name, phone, address } = service

        return {
            name,
            phone,
            address,
            createOrderDate: utilDateTime.dateToString(createDate.toString()),
            status: status,
            transportFee,
            totalOrder: totalPrice,
            remainMoney: remainAmount,
            deposit, reason, nameCancelBy
        }

    }, [actionMethod, serviceOrders])

    useEffect(() =>{
        if(!actionMethod) return;

        const [order] = serviceOrders.filter(x => x.id === actionMethod.orderId)

        if(!order) return;

        setAmount(order.remainAmount)
    }, [actionMethod, serviceOrders])

    const OrderDetail = useMemo(() =>{
        const data = serviceOrders.filter(x => x.id === actionMethod?.orderId)[0]
        if(!data) return {}
    
        const { createDate, status, deposit, transportFee, totalPrice, remainAmount, reason, cancelBy } = data
        const { name, phone, address } = data.service

        return {
            name,
            phone,
            address,
            createOrderDate: utilDateTime.dateToString(createDate.toString()),
            status: status,
            transportFee,
            totalOrder: totalPrice,
            remainMoney: remainAmount,
            deposit, reason, cancelBy
        }
    }, [actionMethod, serviceOrders])

    const updateOrderStatus = (orderStatus: OrderStatus) =>{
        const [order] = serviceOrders.filter(x => x.id === actionMethod?.orderId)
        order.status = orderStatus
        setServiceOrders([...serviceOrders])
        handleClose()
    }

    return (
        <div className="mtko-wrapper">
            <HeaderInfor title='Quản lý đơn hàng chăm sóc' />
            <Searching
                isOrderCode
                isPhone
                isStatus
                statusType='service'
            />
            <Filtering 
                isRangeDate
            />
            <section className="mtko-box default-layout">
                {
                    (search.isSearching && serviceOrders.length === 0) ? <NoResult /> :
                    <Table
                        className='table' 
                        columns={ColumnServiceOrder} 
                        dataSource={DataSourceServiceOrder} 
                        scroll={{ y: 680, x: 3000 }}
                        loading={loading}
                        pagination={{
                            current: paging.curPage,
                            pageSize: paging.pageSize,
                            total: paging.recordCount,
                            onChange: (page: number) =>{
                                navigate(`/panel/take-care-order?page=${page}`)
                            }
                        }}
                    />
                }
            </section>
            {
                (actionMethod?.actionType === 'deposit') &&
                <Modal
                    title='Thanh toán tiền đặt cọc'
                    open
                    onCancel={handleClose}
                    onOk={handlePaymentDeposit}
                    width={1000}
                    footer={false}
                >
                    <p>Xác nhận thanh toán tiền cọc cho đơn hàng ${serviceOrders.filter(x => x.id === actionMethod.orderId)[0].orderCode}</p>
                    <UserInforOrder {...OrderDetail} />
                    <div className='btn-form-wrapper mt-10'>
                        <Button htmlType='button' disabled={loadingAction} type='default' className='btn-cancel' size='large' onClick={handleClose} >Hủy bỏ</Button>
                        <Button htmlType='submit' loading={loadingAction} type='primary' className='btn-update' size='large' onClick={handlePaymentDeposit}>
                            Thanh toán
                        </Button>
                    </div>
                </Modal>
            }
            {
                actionMethod?.actionType === 'remaining' &&
                <Modal
                    title={`Thanh toán tiền cho đơn hàng "${serviceOrders.filter(x => x.id === actionMethod.orderId)[0].orderCode}"`}
                    open
                    onCancel={handleClose}
                    onOk={handlePaymentCash}
                    width={1000}
                    footer={false}
                >
                    <p>Nhập số tiền cần thanh toán (VND)</p>
                    <CurrencyFormat isAllowed={(values) => {
                        const value = values.floatValue || 0
                        const remain = serviceOrders.filter(x => x.id === actionMethod.orderId)[0].remainAmount
                        if(value >= remain) {
                            setAmount(remain)
                        }else{
                            setAmount(Number(value))
                        }
                        return value <= remain
                    }}
                    className='currency-input'
                    value={amount} 
                    max={serviceOrders.filter(x => x.id === actionMethod.orderId)[0].remainAmount} thousandSeparator/>
                    <UserInforOrder {...OrderDetail} />
                    <div className='btn-form-wrapper mt-10'>
                        <Button htmlType='button' disabled={loadingAction} type='default' className='btn-cancel' size='large' onClick={handleClose} >Hủy bỏ</Button>
                        <Button htmlType='submit' loading={loadingAction} type='primary' className='btn-update' size='large' onClick={handlePaymentCash}>
                            Thanh toán
                        </Button>
                    </div>
                </Modal>
            }
            {
                actionMethod?.actionType === 'cancel' && 
                <CancelOrder 
                    onClose={handleClose}
                    onSubmit={handleCancelOrder}
                    orderCode={serviceOrders.filter(x => x.id === actionMethod.orderId)[0].orderCode}
                    orderId={serviceOrders.filter(x => x.id === actionMethod.orderId)[0].id}
                    orderType='service'
                />
            }
            {
                actionMethod?.actionType === 'refund' &&
                <RefundOrder 
                    onClose={handleClose}
                    onSubmit={handleRefund}
                    orderCode={serviceOrders.filter(x => x.id === actionMethod.orderId)[0].orderCode}
                    orderId={serviceOrders.filter(x => x.id === actionMethod.orderId)[0].id}
                    userInforOrder={OrderTakeCareDetail}
                    orderType='service'
                    transactionType='service refund'
                />
            }
            {
                actionMethod?.actionType === 'view transaction' &&
                <TransactionDetail
                    orderId={serviceOrders.filter(x => x.id === actionMethod.orderId)[0].id}
                    orderCode={serviceOrders.filter(x => x.id === actionMethod.orderId)[0].orderCode}
                    orderType='service'
                    onClose={handleClose}
                />
            }
            {
                actionMethod?.actionType === 'detail' &&
                <UpdateConfirmServiceDetail
                    isOnlyView
                    onClose={handleClose}
                    onSubmit={handleClose}
                    service={serviceOrders.filter(x => x.id === actionMethod.orderId)[0].service}
                    shipping={shipping}
                />
            }
            {
                actionMethod?.actionType === 'finished' &&
                <FinishOrder
                    orderId={serviceOrders.filter(x => x.id === actionMethod.orderId)[0].id}
                    orderCode={serviceOrders.filter(x => x.id === actionMethod.orderId)[0].orderCode}
                    serviceId={serviceOrders.filter(x => x.id === actionMethod.orderId)[0].service.id}
                    type='service'
                    onClose={handleClose}
                    onSubmit={() => updateOrderStatus('completed')}
                />
            }
        </div>
    )
}

export default ManageTakeCareOrder