import { Button, Modal, Popover } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import HeaderInfor from 'app/components/header-infor/HeaderInfor'
import CancelOrder from 'app/components/modal/cancel-order/CancelOrder'
import ModalClientSaleOrderDetai from 'app/components/modal/client-sale-order-detail/ModalClientSaleOrderDetai'
import SaleDelivery from 'app/components/modal/delivery/sale-delivery/SaleDelivery'
import FinishOrder from 'app/components/modal/finish-order/FinishOrder'
import RefundOrder from 'app/components/modal/refundOrder.tsx/RefundOrder'
import TransactionDetail from 'app/components/modal/transaction-detail/TransactionDetail'
import MoneyFormat from 'app/components/money/MoneyFormat'
import Transport from 'app/components/renderer/transport/Transport'
import NoResult from 'app/components/search-and-filter/no-result/NoResult'
import Searching from 'app/components/search-and-filter/search/Searching'
import OrderStatusComp from 'app/components/status/OrderStatusComp'
import UserInforTable from 'app/components/user-infor/UserInforTable'
import UserInforOrder from 'app/components/user-infor/user-infor-order/UserInforOrder'
import useDispatch from 'app/hooks/use-dispatch'
import useSelector from 'app/hooks/use-selector'
import { OrderStatus } from 'app/models/general-type'
import { SaleOrderList } from 'app/models/order'
import { Paging } from 'app/models/paging'
import { PaymentControlState } from 'app/models/payment'
import orderService from 'app/services/order.service'
import paymentService from 'app/services/payment.service'
import { setNoti } from 'app/slices/notification'
import CONSTANT from 'app/utils/constant'
import utilDateTime from 'app/utils/date-time'
import pagingPath from 'app/utils/paging-path'
import React, { useEffect, useMemo, useState } from 'react'
import CurrencyFormat from 'react-currency-format'
import { AiOutlineTransaction } from 'react-icons/ai'
import { BiDetail } from 'react-icons/bi'
import { BsCheck2All } from 'react-icons/bs'
import { CiDeliveryTruck } from 'react-icons/ci'
import { GiReturnArrow } from 'react-icons/gi'
import { GrMore } from 'react-icons/gr'
import { MdCancelPresentation, MdOutlinePayment, MdOutlinePayments } from 'react-icons/md'
import { useNavigate, useSearchParams } from 'react-router-dom'
import './style.scss'

const ManageSaleOrder: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { search } = useSelector(state => state.SearchFilter)

    const [loading, setLoading] = useState(true)
    const [loadingAction, setLoadingAction] = useState(false)

    // data
    const [saleOrders, setSaleOrders] = useState<SaleOrderList[]>([]);

    const [actionMethod, setActionMethod] = useState<PaymentControlState>()

    const [amount, setAmount] = useState(0);

    const [paging, setPaging] = useState<Partial<Paging>>({curPage: 1, pageSize: CONSTANT.PAGING_ITEMS.MANAGE_ORDER_SALE})
    const [recall, setRecall] = useState(true)

    useEffect(() =>{
        pagingPath.scrollTop()
        const currentPage = searchParams.get('page');
        if(!pagingPath.isValidPaging(currentPage)){
            setPaging({curPage: 1, pageSize: CONSTANT.PAGING_ITEMS.MANAGE_ORDER_SALE})
            return navigate('/panel/sale-order?page=1')
        }
        
        const { isSearching, orderCode, phone, status } = search
        if(isSearching && (orderCode || phone || status)){
            const initSearch = async () =>{
                setLoading(true)
                try{
                    const res = await orderService.getSaleOrderDetailByOrderCode({curPage: Number(currentPage), pageSize: paging.pageSize}, {orderCode, phone, status})
                    setSaleOrders(res.data.saleOrderList)
                    setPaging(res.data.paging)
                }catch{
                    dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
                }
                setLoading(false)
            }
            initSearch()
        }else{
            const init = async () =>{
                setLoading(true)
                try{
                    const res = await orderService.getAllSaleOrders({curPage: Number(currentPage), pageSize: paging.pageSize})
                    setSaleOrders(res.data.saleOrderList)
                    setPaging(res.data.paging)
                }catch{
                    dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
                }
                setLoading(false)
            }
            init()
        }
    }, [navigate, searchParams, paging.pageSize, recall, search, dispatch])
    const handleSetAction = (data: PaymentControlState) =>{
        const { orderId, actionType } = data
        const [order] = saleOrders.filter(x => x.id === orderId)

        if(actionType === 'deposit' && order.status !== 'unpaid'){
            return dispatch(setNoti({type: 'info', message: CONSTANT.PAYMENT_MESSAGE.PAID_DEPOSIT}))
        }
        if(actionType === 'remaining' && (order.status === 'paid' || order.status === 'completed')){
            return dispatch(setNoti({type: 'info', message: CONSTANT.PAYMENT_MESSAGE.PAID_REMAINING}))
        }
        setActionMethod(data)
    }
    const Column: ColumnsType<any> = [
        {
            title: 'Mã đơn hàng',
            key: 'orderCode',
            dataIndex: 'orderCode',
            width: 180,
            fixed:'left',
            render: (v) => (<span className='order-code'>{v}</span>)
        },
        {
            title: 'Thông tin khách hàng',
            key: 'userInfor',
            dataIndex: 'userInfor',
            width: 300,
            render: (_, record) => (<UserInforTable name={record.recipientName} address={record.recipientAddress} phone={record.recipientPhone}  />)
        },
        {
            title: 'Ngày tạo đơn hàng',
            key: 'createDate',
            dataIndex: 'createDate',
            render: (v) => (utilDateTime.dateToString(v))
        },
        {
            title: 'Trạng thái',
            key: 'status',
            dataIndex: 'status',
            width: 200,
            render: (v) => (<OrderStatusComp status={v} />)
        },
        {
            title: 'Nơi nhận cây',
            key: 'isTransport',
            dataIndex: 'isTransport',
            render: (v) => (<Transport isTransport={v} />)
        },
        {
            title: 'Phí vận chuyển',
            key: 'transportFee',
            dataIndex: 'transportFee',
            align: 'right',
            width: 200,
            render: (v) => <MoneyFormat value={v} color='Default' />
        },
        {
            title: 'Tiền cọc',
            key: 'deposit',
            dataIndex: 'deposit',
            align: 'right',
            width: 200,
            render: (v) => <MoneyFormat value={v} color='Orange' />
        },
        {
            title: 'Tiền được giảm',
            key: 'discountAmount',
            dataIndex: 'discountAmount',
            align: 'right',
            width: 200,
            render: (v) => <MoneyFormat value={v} color='Yellow' />
        },
        {
            title: 'Tổng tiền',
            key: 'totalPrice',
            dataIndex: 'totalPrice',
            align: 'right',
            width: 200,
            render: (v) => <MoneyFormat value={v} color='Light Blue' />
        },
        {
            title: 'Tiền còn thiếu',
            key: 'remainMoney',
            dataIndex: 'remainMoney',
            align: 'right',
            width: 200,
            fixed: 'right',
            render: (v) => <MoneyFormat value={v} color='Blue' isHighlight />
        },
        {
            title: 'Xử lý',
            key: 'actions',
            dataIndex: 'actions',
            align: 'center',
            fixed: 'right',
            render: (_, record, index) => (
                <Popover 
                    content={() => contextSale(record)} 
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
    const contextSale = (record) =>{
        return(
            <div className='context-menu-wrapper'>
                <div className="item" onClick={() => {
                    setActionMethod({orderId: record.orderId, actionType: 'detail', orderType: 'sale', openIndex: -1})
                }}>
                    <BiDetail size={25} className='icon'/>
                    <span>Chi tiết đơn hàng</span>
                </div>
                <div className="item" onClick={() => {
                    handleSetAction({orderId: record.orderId, actionType: 'view transaction', orderType: 'sale', openIndex: -1})
                }}>
                    <AiOutlineTransaction size={25} className='icon'/>
                    <span>Xem giao dịch</span>
                </div>
                {
                    (record.status === 'unpaid' && record.deposit !== 0 && record.remainMoney === record.totalPrice) &&
                    <div className="item" onClick={() => {
                        handleSetAction({orderId: record.orderId, actionType: 'deposit', orderType: 'sale', openIndex: -1})
                    }}>
                        <MdOutlinePayments size={25} className='icon'/>
                        <span>Thanh toán tiền cọc</span>
                    </div>
                }
                {
                    (record.status === 'ready' || record.status === 'unpaid') &&
                    <div className="item" onClick={() => {
                        handleSetAction({orderId: record.orderId, actionType: 'remaining', orderType: 'sale', openIndex: -1})
                    }}>
                        <MdOutlinePayment size={25} className='icon'/>
                        <span>Thanh toán đơn hàng</span>
                    </div>
                }
                {
                    ((record.status === 'ready' || record.status === 'paid') && record.isTransport) && 
                    <div className="item" onClick={() => {
                        handleSetAction({orderId: record.orderId, actionType: 'delivery', orderType: 'sale', openIndex: -1})
                    }}>
                        <CiDeliveryTruck size={25} className='icon'/>
                        <span>Vận chuyển</span>
                    </div>
                }
                {
                    ((record.status === 'paid' && !record.isTransport) || record.status === 'delivery') && 
                    <div className="item" onClick={() => {
                        handleSetAction({orderId: record.orderId, actionType: 'finished', orderType: 'sale', openIndex: -1})
                    }}>
                        <BsCheck2All size={25} className='icon'/>
                        <span>Hoàn thành</span>
                    </div>
                }
                {
                    (record.status !== 'completed' && record.status !== 'cancel') && 
                    <div className="item" onClick={() => {
                        handleSetAction({orderId: record.orderId, actionType: 'cancel', orderType: 'sale', openIndex: -1})
                    }}>
                        <MdCancelPresentation size={25} className='icon'/>
                        <span>Hủy đơn hàng</span>
                    </div>
                }
                {
                    record.status === 'cancel' &&
                    <div className="item" onClick={() => {
                        handleSetAction({orderId: record.orderId, actionType: 'refund', orderType: 'sale', openIndex: -1})
                    }}>
                        <GiReturnArrow size={25} className='icon'/>
                        <span>Hoàn tiền</span>
                    </div>
                }
            </div>
        )
    }
    const DataSource = useMemo(() =>{
        return saleOrders.map((x, index) => ({
            key: String(index + 1),
            orderId: x.id,
            orderCode: x.orderCode,
            status: x.status,
            totalPrice: x.totalPrice,
            transportFee: x.transportFee,
            remainMoney: x.remainMoney,
            deposit: x.deposit,
            recipientAddress: x.recipientAddress,
            recipientPhone: x.recipientPhone,
            recipientName: x.recipientName,
            createDate: x.createDate,
            discountAmount: x.discountAmount,
            isTransport: x.isTransport,
        }))
    }, [saleOrders])

    const handleCancel = () =>{
        setActionMethod(undefined)
        setAmount(0)
    }

    const handlePaymentDeposit = async () =>{
        setLoadingAction(true)
        try{
            await paymentService.depositPaymentCash(actionMethod?.orderId || '', 'sale')
            setSaleOrders(saleOrders.map(x => x.id === actionMethod?.orderId ? ({
                ...x,
                status: 'ready',
                remainMoney: x.remainMoney - x.deposit
            }) : x))

            dispatch(setNoti({type: 'success', message: 'Thanh toán cọc thành công'}))
            handleCancel()
        }catch{
            dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
        }
        setLoadingAction(false)
    }
    

    const handlePaymentCash = async () =>{
        setLoadingAction(true)
        if(amount < 1000){
            dispatch(setNoti({type: 'error', message: 'Số tiền nhập vào ít nhất là 1.000 VNĐ'}))
            return;
        }
        
        const [order] = saleOrders.filter(x => x.id === actionMethod?.orderId)
        const total = order.remainMoney - amount
        
        try{
            await paymentService.paymentCash(actionMethod?.orderId || '', amount, 'sale', total === 0 ? 'whole' : '')
            if(total === 0){
                order.status = 'paid'
            }
            order.remainMoney = total
            setSaleOrders([...saleOrders])

            dispatch(setNoti({type: 'success', message: 'Cập nhật đơn hàng thành công'}))
            handleCancel()
        }catch{
            dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
        }
        setLoadingAction(false)
    }
    const handleCancelOrder = async (reason: string, canceledBy: string) =>{
        const [order] = saleOrders.filter(x => x.id === actionMethod?.orderId)
        order.status = 'cancel'
        order.reason = reason
        order.nameCancelBy = canceledBy
        setSaleOrders([...saleOrders])
        handleCancel()
    }
    const handleRefundOrder = async () =>{
        handleCancel()
    }

    const OrderDetail = useMemo(() =>{
        const data = saleOrders.filter(x => x.id === actionMethod?.orderId)[0]
        if(!data) return {}
    
        const { recipientName, recipientPhone, recipientAddress, createDate, status, deposit, transportFee, totalPrice, remainMoney, reason, nameCancelBy } = data

        return {
            name: recipientName,
            phone: recipientPhone,
            address: recipientAddress,
            createOrderDate: utilDateTime.dateToString(createDate.toString()),
            status: status,
            transportFee,
            totalOrder: totalPrice,
            remainMoney,
            deposit, reason, nameCancelBy
        }
    }, [actionMethod, saleOrders])

    useEffect(() =>{
        const [order] = saleOrders.filter(x => x.id === actionMethod?.orderId)
        if(!order) return;
        setAmount(order.remainMoney)
    }, [actionMethod, saleOrders])

    const updateOrderStatus = (orderStatus: OrderStatus) =>{
        const [order] = saleOrders.filter(x => x.id === actionMethod?.orderId)
        order.status = orderStatus
        setSaleOrders([...saleOrders])
        handleCancel()
    }

    return (
        <div className="mso-wrapper">
            <HeaderInfor title='Quản lý đơn hàng mua' />
            <Searching
                isOrderCode
                isPhone
                isStatus
            />
            <section className="mso-box default-layout">
            {
                (search.isSearching && saleOrders && saleOrders.length === 0) ? <NoResult /> : 
                <Table 
                    className='table' 
                    dataSource={DataSource} 
                    columns={Column} 
                    scroll={{ y: 680, x: 2200 }}
                    pagination={{
                        current: paging.curPage,
                        pageSize: paging.pageSize,
                        total: paging.recordCount,
                        onChange: (page: number) =>{
                            setRecall(true)
                            navigate(`/panel/sale-order?page=${page}`)
                        }
                    }}
                    loading={loading}
                />
            }
            </section>
            {
                actionMethod?.actionType === 'detail' &&
                <ModalClientSaleOrderDetai 
                    saleOrderList={saleOrders.filter(x => x.id === actionMethod?.orderId)[0]}
                    onClose={handleCancel}
                />
            }
            {
                actionMethod?.actionType === 'deposit' && 
                <Modal
                    title='Thanh toán tiền đặt cọc'
                    open
                    onCancel={handleCancel}
                    width={1000}
                    footer={false}
                >
                    <h3>Xác nhận thanh toán đặt cọc cho đơn hàng {saleOrders.filter(x => x.id === actionMethod?.orderId)[0].orderCode}</h3>
                    <UserInforOrder {...OrderDetail} />
                    <div className='btn-form-wrapper mt-10'>
                        <Button htmlType='button' disabled={loadingAction} type='default' className='btn-cancel' size='large' onClick={handleCancel} >Hủy bỏ</Button>
                        <Button htmlType='submit' loading={loadingAction} type='primary' className='btn-update' size='large' onClick={handlePaymentDeposit}>
                            Thanh toán
                        </Button>
                    </div>
                </Modal>
            }
            {
                actionMethod?.actionType === 'remaining' &&
                <Modal
                    title={`Thanh toán tiền cho đơn hàng "${saleOrders.filter(x => x.id === actionMethod?.orderId)[0].orderCode}"`}
                    open
                    onCancel={handleCancel}
                    width={1000}
                    footer={false}
                >
                    <p>Nhập số tiền cần thanh toán (VND)</p>
                    <CurrencyFormat isAllowed={(values) => {
                        const value = values.floatValue || 0
                        const remain = saleOrders.filter(x => x.id === actionMethod?.orderId)[0].remainMoney
                        if(value >= remain) {
                            setAmount(remain)
                        }else{
                            setAmount(Number(value))
                        }
                        return value <= remain
                    }}
                    className='currency-input'
                    value={amount} 
                    max={saleOrders.filter(x => x.id === actionMethod?.orderId)[0].remainMoney} thousandSeparator={true}/>
                    <UserInforOrder {...OrderDetail} />
                    <div className='btn-form-wrapper mt-10'>
                        <Button htmlType='button' disabled={loadingAction} type='default' className='btn-cancel' size='large' onClick={handleCancel} >Hủy bỏ</Button>
                        <Button htmlType='submit' loading={loadingAction} type='primary' className='btn-update' size='large' onClick={handlePaymentCash}>
                            Thanh toán
                        </Button>
                    </div>
                </Modal>
            }
            {
                actionMethod?.actionType === 'cancel' &&
                <CancelOrder
                    onClose={handleCancel}
                    onSubmit={handleCancelOrder}
                    orderCode={saleOrders.filter(x => x.id === actionMethod?.orderId)[0].orderCode}
                    orderId={saleOrders.filter(x => x.id === actionMethod?.orderId)[0].id}
                    orderType='sale'
                    userInforOrder={OrderDetail}
                />
            }
            {
                actionMethod?.actionType === 'refund' &&
                <RefundOrder 
                    onClose={handleCancel}
                    onSubmit={handleRefundOrder}
                    orderCode={saleOrders.filter(x => x.id === actionMethod.orderId)[0].orderCode}
                    orderId={saleOrders.filter(x => x.id === actionMethod.orderId)[0].id}
                    userInforOrder={OrderDetail}
                    orderType='sale'
                    transactionType='sale refund'
                />
            }
            {
                actionMethod?.actionType === 'view transaction' &&
                <TransactionDetail 
                    orderId={saleOrders.filter(x => x.id === actionMethod.orderId)[0].id}
                    orderCode={saleOrders.filter(x => x.id === actionMethod.orderId)[0].orderCode}
                    orderType='sale'
                    onClose={handleCancel}
                />
            }
            {
                actionMethod?.actionType === 'delivery' &&
                <SaleDelivery
                    orderId={saleOrders.filter(x => x.id === actionMethod.orderId)[0].id}
                    orderCode={saleOrders.filter(x => x.id === actionMethod.orderId)[0].orderCode}
                    type='sale'
                    onClose={handleCancel}
                    onSubmit={() => updateOrderStatus('delivery')}
                />
            }
            {
                actionMethod?.actionType === 'finished' &&
                <FinishOrder
                    orderId={saleOrders.filter(x => x.id === actionMethod.orderId)[0].id}
                    orderCode={saleOrders.filter(x => x.id === actionMethod.orderId)[0].orderCode}
                    type='sale'
                    onClose={handleCancel}
                    onSubmit={() => updateOrderStatus('completed')}
                />
            }
        </div>
    )
}

export default ManageSaleOrder