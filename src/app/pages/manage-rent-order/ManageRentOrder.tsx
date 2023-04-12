import { Popover } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import HeaderInfor from 'app/components/header-infor/HeaderInfor'
import CancelOrder from 'app/components/modal/cancel-order/CancelOrder'
import ModalClientRentOrderDetai from 'app/components/modal/client-rent-order-detail/ModalClientRentOrderDetai'
import RefundOrder from 'app/components/modal/refundOrder.tsx/RefundOrder'
import RentOrderPaymentCash from 'app/components/modal/rent-oder-payment-cash/RentOrderPaymentCash'
import RentOrderPaymentDeposit from 'app/components/modal/rent-order-payment-deposit/RentOrderPaymentDeposit'
import ReturnDepositRentOrder from 'app/components/modal/return-deposit-rent-order/ReturnDepositRentOrder'
import TransactionDetail from 'app/components/modal/transaction-detail/TransactionDetail'
import MoneyFormat from 'app/components/money/MoneyFormat'
import Filtering from 'app/components/search-and-filter/filter/Filtering'
import NoResult from 'app/components/search-and-filter/no-result/NoResult'
import Searching from 'app/components/search-and-filter/search/Searching'
import UserInforTable from 'app/components/user-infor/UserInforTable'
import useDispatch from 'app/hooks/use-dispatch'
import useSelector from 'app/hooks/use-selector'
import { RentOrder } from 'app/models/order'
import { Paging } from 'app/models/paging'
import { PaymentControlState } from 'app/models/payment'
import { ShippingFee } from 'app/models/shipping-fee'
import orderService from 'app/services/order.service'
import paymentService from 'app/services/payment.service'
import shippingFeeService from 'app/services/shipping-fee.service'
import { setNoti } from 'app/slices/notification'
import CONSTANT from 'app/utils/constant'
import utilDateTime from 'app/utils/date-time'
import pagingPath from 'app/utils/paging-path'
import React, { useEffect, useMemo, useState } from 'react'
import { BiDetail } from 'react-icons/bi'
import { FaLayerGroup } from 'react-icons/fa'
import { GiReturnArrow } from 'react-icons/gi'
import { GrMore } from 'react-icons/gr'
import { MdOutlinePayments } from 'react-icons/md'
import { RiBillLine } from 'react-icons/ri'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { OrderStatusToTag } from '../manage-take-care-order/ManageTakeCareOrder'
import ExtendRentOrderManager from './extend-rent-order-manager/ExtendRentOrderManager'
import './style.scss'

const ManageRentOrder:React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { search, filter } = useSelector(state => state.SearchFilter)

    const [actionMethod, setActionMethod] = useState<PaymentControlState>()
    
    // data
    const [rentOrders, setRentOrders] = useState<RentOrder[]>([])

    const [paging, setPaging] = useState<Partial<Paging>>({curPage: 1, pageSize: CONSTANT.PAGING_ITEMS.MANAGE_ORDER_RENT})
    const [recall, setRecall] = useState(true)
    const [shipping, setShipping] = useState<ShippingFee[]>([])

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
        const currentPage = searchParams.get('page');
        if(!pagingPath.isValidPaging(currentPage)){
            setPaging({curPage: 1, pageSize: CONSTANT.PAGING_ITEMS.MANAGE_ORDER_RENT})
            return navigate('/panel/rent-order?page=1')
        }

        
        // if(!recall) return;

        if(search.isSearching && search.orderCode){
            const initSearch = async () =>{
                const res = await orderService.getRentOrderDetailByOrderCode(search.orderCode || '')
                setRentOrders(res.data ? [res.data] : [])
                setPaging({curPage: 1, pageSize: CONSTANT.PAGING_ITEMS.MANAGE_ORDER_RENT})
            }
            initSearch()
        }else if(filter.isFiltering && filter.startDate && filter.endDate){
            const initFilter = async () =>{
                const res = await orderService.getRentOrderDetailByRangeDate({curPage: Number(currentPage), pageSize: paging.pageSize}, filter.startDate || '', filter.endDate || '')
                console.log(res.data)
                setRentOrders(res.data.rentOrderGroups)
                setPaging(res.data.paging)
            }
            initFilter();
        }else{
            const init = async () =>{
                const res = await orderService.getAllRentOrders({curPage: Number(currentPage), pageSize: paging.pageSize});
                setRentOrders(res.data.rentOrderGroups)
                setPaging(res.data.paging)
            }
            init()
        }
        // setRecall(false)

    }, [filter, search, recall, navigate, paging.pageSize, searchParams])

    // useEffect(() =>{
    //     pagingPath.scrollTop()
    //     const currentPage = searchParams.get('page');

    //     if(!pagingPath.isValidPaging(currentPage)){
    //         setPaging({curPage: 1, pageSize: CONSTANT.PAGING_ITEMS.MANAGE_ORDER_RENT})
    //         return navigate('/panel/rent-order?page=1')
    //     }
    //     if(!recall) return;

    //     const init = async () =>{
    //         try{
    //             const res = await orderService.getAllRentOrders({curPage: Number(currentPage), pageSize: paging.pageSize});
    //             setRentOrders(res.data.rentOrderGroups)
    //             setPaging(res.data.paging)
    //         }catch{

    //         }
    //         setRecall(false)
    //     }
    //     init()
    // }, [searchParams, navigate, paging.pageSize, recall])

    const ColumnRentOrder: ColumnsType<any> = [
        {
            title: 'Mã đơn hàng',
            key: 'orderCode',
            dataIndex: 'orderCode',
            align: 'center',
            fixed: 'left',
            width: 170,
            render: (v) => (<span className='order-code'>{v}</span>)
        },
        {
            title: 'Thông tin khách hàng',
            key: 'recipientName',
            dataIndex: 'recipientName',
            width: 300,
            render: (_, record) => (<UserInforTable name={record.recipientName} phone={record.recipientPhone} address={record.recipientAddress}  />)
            // render: (v) => (v)
        },
        {
            title: 'Ngày bắt đầu thuê',
            key: 'startDateRent',
            dataIndex: 'startDateRent',
            render: (v) => (utilDateTime.dateToString(v))
        },
        {
            title: 'Ngày kết thúc thuê',
            key: 'endDateRent',
            dataIndex: 'endDateRent',
            render: (v) => (utilDateTime.dateToString(v))
        },
        {
            title: 'Trạng thái',
            key: 'status',
            dataIndex: 'status',
            width: 200,
            render: (v) => (OrderStatusToTag(v))
        },
        {
            title: 'Phí vận chuyển',
            key: 'transportFee',
            dataIndex: 'transportFee',
            align: 'right',
            width: 200,
            render: (v) => (<MoneyFormat value={v} color='Default' isHighlight />)
        },
        {
            title: 'Tiền cọc',
            key: 'deposit',
            dataIndex: 'deposit',
            align: 'right',
            width: 200,
            render: (v) => (<MoneyFormat value={v} color='Orange' isHighlight />)
        },
        {
            title: 'Tiền được giảm',
            key: 'discountAmount',
            dataIndex: 'discountAmount',
            align: 'right',
            width: 200,
            render: (v) => <MoneyFormat value={v} color='Yellow' isHighlight />
        },
        {
            title: 'Tổng tất cả đơn hàng',
            key: 'totalPrice',
            dataIndex: 'totalPrice',
            align: 'right',
            width: 200,
            render: (v) => (<MoneyFormat value={v} color='Light Blue' isHighlight />)
        },
        {
            title: 'Tiền còn thiếu',
            key: 'remainMoney',
            dataIndex: 'remainMoney',
            align: 'right',
            width: 200,
            fixed: 'right',
            render: (v) => (<MoneyFormat value={v} color='Blue' isHighlight />)
        },
        {
            title: 'Xử lý',
            key: 'action',
            dataIndex: 'action',
            align: 'center',
            fixed: 'right',
            render: (_, record, index) => (
                <Popover 
                    content={() => contextRent(record)} 
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
    const contextRent = (record) =>{
        return(
            <div className='context-menu-wrapper'>
                <div className="item" onClick={() => {
                    setActionMethod({orderId: record.orderId, actionType: 'detail', orderType: 'rent', openIndex: -1})
                }}>
                    <BiDetail size={25} className='icon'/>
                    <span>Chi tiết đơn hàng</span>
                </div>
                <div className="item" onClick={() => {
                    handleSetAction({orderId: record.orderId, actionType: 'view transaction', orderType: 'rent', openIndex: -1})
                }}>
                    <BiDetail size={25} className='icon'/>
                    <span>Xem giao dịch</span>
                </div>
                <div className="item" onClick={() => navigate(`/panel/rent-order/${record.groupID}`)}>
                    <FaLayerGroup size={25} className='icon'/>
                    <span>Xem nhóm đơn hàng</span>
                </div>
                {
                    (record.status === 'unpaid') &&
                    <div className="item" onClick={() => {
                        handleSetAction({orderId: record.orderId, actionType: 'deposit', orderType: 'rent', openIndex: -1})
                    }}>
                        <MdOutlinePayments size={25} className='icon'/>
                        <span>Thanh toán tiền cọc</span>
                    </div>
                }
                {
                    (record.status === 'ready' || record.status === 'unpaid') && 
                    <div className="item" onClick={() => {
                        handleSetAction({orderId: record.orderId, actionType: 'remaining', orderType: 'rent', openIndex: -1})
                    }}>
                        <RiBillLine size={25} className='icon'/>
                        <span>Thanh toán đơn hàng</span>
                    </div>
                }
                {
                    record.status === 'paid' && 
                    <div className="item" onClick={() => {
                        handleSetAction({orderId: record.orderId, actionType: 'return deposit', orderType: 'rent', openIndex: -1})
                    }}>
                        <GiReturnArrow size={25} className='icon'/>
                        <span>Xác nhận tất toán</span>
                    </div>
                }
                {
                    (record.status !== 'completed' && record.status !== 'cancel') && 
                    <div className="item" onClick={() => {
                        handleSetAction({orderId: record.orderId, actionType: 'cancel', orderType: 'rent', openIndex: -1})
                    }}>
                        <RiBillLine size={25} className='icon'/>
                        <span>Hủy đơn hàng</span>
                    </div>
                }
                {
                    record.status === 'cancel' &&
                    <div className="item" onClick={() => {
                        handleSetAction({orderId: record.orderId, actionType: 'refund', orderType: 'rent', openIndex: -1})
                    }}>
                        <BiDetail size={25} className='icon'/>
                        <span>Hoàn tiền</span>
                    </div>
                }
                {/* <div className="item" onClick={() => {
                    handleSetAction({orderId: record.orderId, actionType: 'extend', orderType: 'rent', openIndex: -1})
                }}>
                    <BiDetail size={25} className='icon'/>
                    <span>Gia hạn đơn hàng</span>
                </div> */}
            </div>
        )
    }
    const handleSetAction = async (data: PaymentControlState) =>{
        const { orderId, actionType } = data
        const [order] = rentOrders.filter(x => x.rentOrderList[0].id === orderId)[0].rentOrderList
        
        if(actionType === 'deposit' && order.status !== 'unpaid'){
            return dispatch(setNoti({type: 'info', message: CONSTANT.PAYMENT_MESSAGE.PAID_DEPOSIT}))
        }
        if(actionType === 'remaining' && (order.status === 'paid' || order.status === 'completed')){
            return dispatch(setNoti({type: 'info', message: CONSTANT.PAYMENT_MESSAGE.PAID_REMAINING}))
        }

        setActionMethod(data)
    }
    const DataSourceRentOrder = useMemo(() =>{
        return rentOrders.map((x, index) => ({
            key: String(index + 1),
            orderId: x.rentOrderList[0].id,
            orderCode: x.rentOrderList[0].orderCode,
            groupID: x.id,
            totalPrice: x.totalGroupAmount,
            startDateRent: x.rentOrderList[0].startRentDate,
            endDateRent: x.rentOrderList[0].endRentDate,
            status: x.rentOrderList[0].status,
            remainMoney: x.rentOrderList[0].remainMoney,
            deposit: x.rentOrderList[0].deposit,
            recipientName: x.rentOrderList[0].recipientName,
            recipientPhone: x.rentOrderList[0].recipientPhone,
            recipientAddress: x.rentOrderList[0].recipientAddress,
            transportFee: x.rentOrderList[0].transportFee,
            discountAmount: x.rentOrderList[0].discountAmount
        }))
    }, [rentOrders])
    const handleClose = () =>{
        setActionMethod(undefined)
    }
    const handlePaymentDeposit = async (orderId: string) =>{
        try{
            await paymentService.depositPaymentCash(orderId, 'rent')
            dispatch(setNoti({type: 'success', message: 'Thanh toán cọc thành công'}))
            setRecall(!recall)
            handleClose()
        }catch{

        }
    }
    const handlePaymentCash = async (orderId: string, amount: number, isFull: boolean) =>{
        console.log(amount)
        if(!isFull && amount < 1000){
            dispatch(setNoti({type: 'error', message: 'Số tiền nhập vào ít nhất là 1.000 VNĐ'}))
            return;
        }
        
        const [order] = rentOrders.filter(x => x.rentOrderList[0].id === orderId)[0].rentOrderList

        try{
            let amountOrder = 0;
            if(isFull){
                amountOrder = order.remainMoney
            }else{
                amountOrder = amount
            }
            await paymentService.paymentCash(orderId, amountOrder, 'rent', order.status === 'unpaid' ? 'whole' : '')
            dispatch(setNoti({type: 'success', message: 'Thanh toán đơn hàng thành công'}))
            setRecall(!recall)
            handleClose()
        }catch{

        }
    }
    const handleReturnDeposit = (rentOrderListId: string) =>{
        const index = rentOrders.findIndex(x => x.rentOrderList[0].id === rentOrderListId)
        console.log(index)
        rentOrders[index].rentOrderList[0].status = 'completed'
        setRentOrders([...rentOrders])
        setActionMethod(undefined)
    }
    const handleCancelOrder = () =>{
        const [order] = rentOrders.filter(x => x.rentOrderList[0].id === actionMethod?.orderId)[0].rentOrderList

        order.status = 'cancel'
        setRentOrders([...rentOrders])
        handleClose()
    }
    const handleRefundOrder = () =>{
        handleClose()
    }
    const handleExtendOrder = async () =>{
        handleClose()
        setRecall(!recall)
    }
    return (
        <div className="mro-wrapper">
            <HeaderInfor title='Quản lý đơn hàng thuê' />
            <Searching
                isOrderCode
            />
            <Filtering
                isRangeDate
            />
            <section className="mso-box default-layout">
                {
                    ((search.isSearching || filter.isFiltering) && (!rentOrders || rentOrders.length === 0)) ? <NoResult /> : 
                    <Table 
                        dataSource={DataSourceRentOrder} 
                        columns={ColumnRentOrder} 
                        scroll={{ y: 680, x: 2200 }}
                        pagination={{
                            current: paging.curPage || 1,
                            pageSize: paging.pageSize || 1,
                            total: paging.recordCount || 1,
                            onChange: (page: number) =>{
                                setRecall(true)
                                navigate(`/panel/rent-order?page=${page}`)
                            }
                        }}
                    />
                }
            </section>
            {
                actionMethod?.actionType === 'detail' && 
                <ModalClientRentOrderDetai
                    onClose={handleClose}
                    rentOrderList={rentOrders.filter(x => x.rentOrderList[0].id === actionMethod.orderId)[0].rentOrderList[0]}
                />
            }
            {
                actionMethod?.actionType === 'deposit' && 
                <RentOrderPaymentDeposit
                    rentOrderList={rentOrders.filter(x => x.rentOrderList[0].id === actionMethod.orderId)[0].rentOrderList[0]}
                    onClose={handleClose}
                    onSubmit={handlePaymentDeposit}
                />
            }
            {
                actionMethod?.actionType === 'remaining' &&
                <RentOrderPaymentCash 
                    rentOrderList={rentOrders.filter(x => x.rentOrderList[0].id === actionMethod.orderId)[0].rentOrderList[0]}
                    onClose={handleClose}
                    onSubmit={handlePaymentCash}
                />
            }
            {
                actionMethod?.actionType === 'return deposit' &&
                <ReturnDepositRentOrder 
                    rentOrderList={rentOrders.filter(x => x.rentOrderList[0].id === actionMethod.orderId)[0].rentOrderList[0]}
                    onClose={handleClose}
                    onSubmit={handleReturnDeposit}
                />
            }
            {
                actionMethod?.actionType === 'cancel' &&
                <CancelOrder
                    onClose={handleClose}
                    onSubmit={handleCancelOrder}
                    orderCode={rentOrders.filter(x => x.rentOrderList[0].id === actionMethod.orderId)[0].rentOrderList[0].orderCode}
                    orderId={rentOrders.filter(x => x.rentOrderList[0].id === actionMethod.orderId)[0].rentOrderList[0].id}
                    orderType='rent'
                />
            }
            {
                actionMethod?.actionType === 'refund' &&
                <RefundOrder
                    onClose={handleClose}
                    onSubmit={handleRefundOrder}
                    orderCode={rentOrders.filter(x => x.rentOrderList[0].id === actionMethod.orderId)[0].rentOrderList[0].orderCode}
                    orderId={rentOrders.filter(x => x.rentOrderList[0].id === actionMethod.orderId)[0].rentOrderList[0].id}
                    orderType='rent'
                    transactionType='rent refund'
                />
            }
            {
                actionMethod?.actionType === 'extend' &&
                <ExtendRentOrderManager
                    rentOrderList={rentOrders.filter(x => x.rentOrderList[0].id === actionMethod.orderId)[0].rentOrderList[0]}
                    shipping={shipping}
                    onClose={handleClose}
                    onExtend={handleExtendOrder}
                />
            }
            {
                actionMethod?.actionType === 'view transaction' &&
                <TransactionDetail
                    orderId={rentOrders.filter(x => x.rentOrderList[0].id === actionMethod.orderId)[0].rentOrderList[0].id}
                    orderCode={rentOrders.filter(x => x.rentOrderList[0].id === actionMethod.orderId)[0].rentOrderList[0].orderCode}
                    orderType='rent'
                    onClose={handleClose}
                />
            }
        </div>
    )
}

export default ManageRentOrder