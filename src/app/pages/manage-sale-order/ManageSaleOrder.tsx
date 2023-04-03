import { Checkbox, Modal, Popover } from 'antd'
import { CheckboxChangeEvent } from 'antd/es/checkbox'
import Table, { ColumnsType } from 'antd/es/table'
import HeaderInfor from 'app/components/header-infor/HeaderInfor'
import CancelOrder from 'app/components/modal/cancel-order/CancelOrder'
import ModalClientSaleOrderDetai from 'app/components/modal/client-sale-order-detail/ModalClientSaleOrderDetai'
import RefundOrder from 'app/components/modal/refundOrder.tsx/RefundOrder'
import MoneyFormat from 'app/components/money/MoneyFormat'
import Transport from 'app/components/renderer/transport/Transport'
import UserInforTable from 'app/components/user-infor/UserInforTable'
import useDispatch from 'app/hooks/use-dispatch'
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
import { BiDetail } from 'react-icons/bi'
import { GrMore } from 'react-icons/gr'
import { MdOutlinePayments } from 'react-icons/md'
import { RiBillLine } from 'react-icons/ri'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { OrderStatusToTag } from '../manage-take-care-order/ManageTakeCareOrder'
import './style.scss'

const ManageSaleOrder: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    // data
    const [saleOrders, setSaleOrders] = useState<SaleOrderList[]>([]);

    const [actionMethod, setActionMethod] = useState<PaymentControlState>()

    const [amount, setAmount] = useState(0);
    const [checkFullAmount, setCheckFullAmount] = useState(false);

    const [paging, setPaging] = useState<Partial<Paging>>({curPage: 1, pageSize: CONSTANT.PAGING_ITEMS.MANAGE_ORDER_SALE})
    const [recall, setRecall] = useState(true)

    useEffect(() =>{
        pagingPath.scrollTop()
        const currentPage = searchParams.get('page');
        if(!pagingPath.isValidPaging(currentPage)){
            setPaging({curPage: 1, pageSize: CONSTANT.PAGING_ITEMS.MANAGE_ORDER_SALE})
            return navigate('/panel/sale-order?page=1')
        }
        if(!recall) return;

        const init = async () =>{
            try{
                const res = await orderService.getAllSaleOrders({curPage: Number(currentPage), pageSize: paging.pageSize})
                setSaleOrders(res.data.saleOrderList)
                setPaging(res.data.paging)
            }catch{
                
            }
            setRecall(false)
        }
        init()
    }, [navigate, searchParams, paging.pageSize, recall])
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
            render: (v) => (OrderStatusToTag(v))
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
            render: (v) => <MoneyFormat value={v} color='Default' isHighlight />
        },
        {
            title: 'Tiền cọc',
            key: 'deposit',
            dataIndex: 'deposit',
            align: 'right',
            width: 200,
            render: (v) => <MoneyFormat value={v} color='Orange' isHighlight />
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
            title: 'Tổng tiền',
            key: 'totalPrice',
            dataIndex: 'totalPrice',
            align: 'right',
            width: 200,
            render: (v) => <MoneyFormat value={v} color='Light Blue' isHighlight />
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
                {
                    (record.status === 'unpaid') &&
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
                        <RiBillLine size={25} className='icon'/>
                        <span>Thanh toán đơn hàng</span>
                    </div>
                }
                {
                    (record.status !== 'completed' && record.status !== 'cancel') && 
                    <div className="item" onClick={() => {
                        handleSetAction({orderId: record.orderId, actionType: 'cancel', orderType: 'sale', openIndex: -1})
                    }}>
                        <RiBillLine size={25} className='icon'/>
                        <span>Hủy đơn hàng</span>
                    </div>
                }
                {
                    record.status === 'cancel' &&
                    <div className="item" onClick={() => {
                        handleSetAction({orderId: record.orderId, actionType: 'refund', orderType: 'sale', openIndex: -1})
                    }}>
                        <BiDetail size={25} className='icon'/>
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
        setCheckFullAmount(false)
    }

    const handlePaymentDeposit = async () =>{
        try{
            await paymentService.depositPaymentCash(actionMethod?.orderId || '', 'sale')
            setSaleOrders(saleOrders.map(x => x.id === actionMethod?.orderId ? ({
                ...x,
                status: 'ready',
                remainMoney: x.remainMoney - x.deposit
            }) : x))
            handleCancel()
             
        }catch{
            dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
        }
    }
    const handleChangeCheck = (e: CheckboxChangeEvent) =>{
        setCheckFullAmount(e.target.checked)
    }

    const handlePaymentCash = async () =>{
        
        if(!checkFullAmount && amount < 1000){
            dispatch(setNoti({type: 'error', message: 'Số tiền nhập vào ít nhất là 1.000 VNĐ'}))
            return;
        }
        
        const [order] = saleOrders.filter(x => x.id === actionMethod?.orderId)
        
        try{
            let amountOrder = 0;
            if(checkFullAmount){
                amountOrder = order.remainMoney
            }else{
                amountOrder = amount
            }
            await paymentService.paymentCash(actionMethod?.orderId || '', amountOrder, 'sale', order.status === 'unpaid' ? 'whole' : '')
            // recall 
            setRecall(true)
            handleCancel()
            dispatch(setNoti({type: 'success', message: 'Cập nhật đơn hàng thành công'}))
            setCheckFullAmount(false)
            setAmount(0)
        }catch{
            dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
        }
    }
    const handleCancelOrder = async () =>{
        const [order] = saleOrders.filter(x => x.id === actionMethod?.orderId)
        order.status = 'cancel'
        setSaleOrders([...saleOrders])
        handleCancel()
    }
    const handleRefundOrder = async () =>{
        handleCancel()
    }
    return (
        <div className="mso-wrapper">
            <HeaderInfor title='Quản lý đơn hàng mua' />
            <section className="mso-box default-layout">
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
                />
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
                    title='Xác nhận thanh toán đặt cọc'
                    open
                    onOk={handlePaymentDeposit}
                    onCancel={handleCancel}
                    width={800}
                >
                    <h2>Xác nhận thanh toán đặt cọc cho đơn hàng {saleOrders.filter(x => x.id === actionMethod?.orderId)[0].orderCode}</h2>
                </Modal>
            }
            {
                actionMethod?.actionType === 'remaining' &&
                <Modal
                    title={`Thanh toán tiền cho đơn hàng "${saleOrders.filter(x => x.id === actionMethod?.orderId)[0].orderCode}"`}
                    open
                    onCancel={handleCancel}
                    onOk={handlePaymentCash}
                    width={800}
                >
                    <p>Nhập số tiền cần thanh toán (VND)</p>
                    <CurrencyFormat disabled={checkFullAmount} isAllowed={(values) => {
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
                    <Checkbox checked={checkFullAmount} onChange={handleChangeCheck}>Đã thanh toán đủ</Checkbox>
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
                />
            }
            {
                actionMethod?.actionType === 'refund' &&
                <RefundOrder 
                    onClose={handleCancel}
                    onSubmit={handleRefundOrder}
                    orderCode={saleOrders.filter(x => x.id === actionMethod.orderId)[0].orderCode}
                    orderId={saleOrders.filter(x => x.id === actionMethod.orderId)[0].id}
                    orderType='sale'
                />
            }
        </div>
    )
}

export default ManageSaleOrder