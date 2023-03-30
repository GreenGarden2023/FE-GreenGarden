import { SyncOutlined } from '@ant-design/icons'
import { Checkbox, Modal, Popover, Tag } from 'antd'
import { CheckboxChangeEvent } from 'antd/es/checkbox'
import Table, { ColumnsType } from 'antd/es/table'
import HeaderInfor from 'app/components/header-infor/HeaderInfor'
import CancelOrder from 'app/components/modal/cancel-order/CancelOrder'
import RefundOrder from 'app/components/modal/refundOrder.tsx/RefundOrder'
import MoneyFormat from 'app/components/money/MoneyFormat'
import TechnicianName from 'app/components/renderer/technician/TechnicianName'
import UserInforTable from 'app/components/user-infor/UserInforTable'
import useDispatch from 'app/hooks/use-dispatch'
import { OrderStatus } from 'app/models/general-type'
import { Paging } from 'app/models/paging'
import { PaymentControlState } from 'app/models/payment'
import { ServiceDetailList, ServiceOrderList } from 'app/models/service'
import orderService from 'app/services/order.service'
import paymentService from 'app/services/payment.service'
import { setNoti } from 'app/slices/notification'
import CONSTANT from 'app/utils/constant'
import utilDateTime from 'app/utils/date-time'
import pagingPath from 'app/utils/paging-path'
import React, { useEffect, useMemo, useState } from 'react'
import CurrencyFormat from 'react-currency-format'
import { BiCommentDetail, BiDetail } from 'react-icons/bi'
import { FaCheck } from 'react-icons/fa'
import { GrMore } from 'react-icons/gr'
import { MdAttachMoney, MdDoneAll, MdOutlineCancel } from 'react-icons/md'
import { useNavigate, useSearchParams } from 'react-router-dom'

export const OrderStatusToTag = (status: OrderStatus) =>{
    switch(status){
        case 'unpaid': return <Tag className='center' color='#AAAAAA' icon={<SyncOutlined />} >Đang xử lý</Tag>
        case 'ready': return <Tag className='center' color='#108ee9' icon={<MdAttachMoney />} >Đã thanh toán cọc</Tag>
        case 'paid': return <Tag className='center' color='#87d068' icon={<FaCheck />} >Đã thanh toán đủ</Tag>
        case 'completed': return <Tag className='center' color='#2db7f5' icon={<MdDoneAll />} >Đã hoàn thành</Tag>
        case 'cancel': return <Tag className='center' color='#528B8B' icon={<MdOutlineCancel />} >Đã bị hủy</Tag>
    }
}

const ManageTakeCareOrder: React.FC = () => {
    const dispatch = useDispatch()
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [serviceOrders, setServiceOrders] = useState<ServiceOrderList[]>([])
    const [paging, setPaging] = useState<Partial<Paging>>({curPage: 1, pageSize: CONSTANT.PAGING_ITEMS.MANAGE_ORDER_RENT})

    const [amount, setAmount] = useState(0);
    const [checkFullAmount, setCheckFullAmount] = useState(false);
    const [recall, setRecall] = useState(true)


    const [actionMethod, setActionMethod] = useState<PaymentControlState>()

    useEffect(() =>{
        pagingPath.scrollTop()
        const currentPage = searchParams.get('page');

        if(!pagingPath.isValidPaging(currentPage)){
            setPaging({curPage: 1, pageSize: CONSTANT.PAGING_ITEMS.MANAGE_ORDER_RENT})
            return navigate('/panel/take-care-order?page=1')
        }
        
        if(!recall) return;

        const init = async () =>{
            try{
                const res = await orderService.getAllServiceOrders({curPage: Number(currentPage), pageSize: paging.pageSize})
                setServiceOrders(res.data.serviceOrderList)
                setPaging(res.data.paging)
            }catch{

            }
            setRecall(false)
        }
        init()
    }, [recall, navigate, searchParams, paging])

    const handleAction = (data: PaymentControlState) =>{
        const { actionType, orderId } = data
        console.log(orderId)
        const [order] = serviceOrders.filter(x => x.id === orderId)

        if(actionType === 'deposit'){
            switch(order.status){
                case 'cancel': return dispatch(setNoti({type: 'info', message: 'Không thể thanh toán tiền cọc cho đơn hàng đã bị hủy'}))
                case 'completed': 
                case 'paid': 
                case 'ready': return dispatch(setNoti({type: 'info', message: 'Không thể thanh toán tiền cọc cho đơn hàng đã thanh toán'}))
            }
        }
        if(actionType === 'remaining'){
            switch(order.status){
                case 'cancel': return dispatch(setNoti({type: 'info', message: 'Không thể thanh toán tổng tiền cho đơn hàng đã bị hủy'}))
                case 'completed': 
                case 'paid': return dispatch(setNoti({type: 'info', message: 'Không thể thanh toán tổng tiền cho đơn hàng đã thanh toán'}))
            }
        }
        setActionMethod(data)
    }

    const contextService = (record) =>{
        return (
            <div className='context-menu-wrapper'>
                <div className="item" onClick={() => {
                    handleAction({orderId: record.orderId, actionType: 'detail', orderType: 'service', openIndex: -1})
                }}>
                    <BiCommentDetail size={25} className='icon'/>
                    <span>Chi tiết đơn hàng</span>
                </div>
                {
                    (record.status === 'unpaid') && 
                    <div className="item" onClick={() => {
                        handleAction({orderId: record.orderId, actionType: 'deposit', orderType: 'service', openIndex: -1})
                    }}>
                        <BiDetail size={25} className='icon'/>
                        <span>Thanh toán tiền cọc</span>
                    </div>
                }
                {
                    (record.status === 'ready' || record.status === 'unpaid') &&
                    <div className="item" onClick={() => {
                        handleAction({orderId: record.orderId, actionType: 'remaining', orderType: 'service', openIndex: -1})
                    }}>
                        <BiDetail size={25} className='icon'/>
                        <span>Thanh toán đơn hàng</span>
                    </div>
                }
                {
                    (record.status !== 'completed' && record.status !== 'cancel') &&
                    <div className="item" onClick={() => {
                        handleAction({orderId: record.orderId, actionType: 'cancel', orderType: 'service', openIndex: -1})
                    }}>
                        <BiDetail size={25} className='icon'/>
                        <span>Hủy đơn hàng</span>
                    </div>
                }
                {
                    record.status === 'cancel' &&
                    <div className="item" onClick={() => {
                        handleAction({orderId: record.orderId, actionType: 'refund', orderType: 'service', openIndex: -1})
                    }}>
                        <BiDetail size={25} className='icon'/>
                        <span>Hoàn tiền</span>
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
            render: (v) => (OrderStatusToTag(v))
        },
        {
            title: 'Phí vận chuyển',
            key: 'transportFee',
            dataIndex: 'transportFee',
            align:'right',
            width: 200,
            render: (v) => <MoneyFormat value={v} color='Default' isHighlight />
        },
        {
            title: 'Tiền cọc',
            key: 'deposit',
            dataIndex: 'deposit',
            align:'right',
            width: 200,
            render: (v) => <MoneyFormat value={v} color='Orange' isHighlight />
        },
        
        {
            title: 'Tiền được giảm',
            key: 'discountAmount',
            dataIndex: 'discountAmount',
            align:'right',
            width: 200,
            render: (v) => <MoneyFormat value={v} color='Yellow' isHighlight />
        },
        {
            title: 'Tổng tiền',
            key: 'totalPrice',
            dataIndex: 'totalPrice',
            align:'right',
            width: 200,
            render: (v) => <MoneyFormat value={v} color='Light Blue' isHighlight />
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
        setActionMethod(undefined)
    }
    const handlePaymentDeposit = async () =>{
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

        }
    }
    const handlePaymentCash = async () =>{
        if(!checkFullAmount && amount < 1000){
            dispatch(setNoti({type: 'error', message: 'Số tiền nhập vào ít nhất là 1.000 VNĐ'}))
            return;
        }
        
        const [order] = serviceOrders.filter(x => x.id === actionMethod?.orderId)
        
        try{
            let amountOrder = 0;
            if(checkFullAmount){
                amountOrder = order.remainAmount
            }else{
                amountOrder = amount
            }
            await paymentService.paymentCash(actionMethod?.orderId || '', amountOrder, 'service', checkFullAmount ? 'whole' : '')
            // recall 
            setRecall(true)
            handleClose()
            dispatch(setNoti({type: 'success', message: 'Cập nhật đơn hàng thành công'}))
            setCheckFullAmount(false)
            setAmount(0)
        }catch{
            dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
        }
    }
    const handleChangeCheck = (e: CheckboxChangeEvent) =>{
        setCheckFullAmount(e.target.checked)
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
    return (
        <div className="mtko-wrapper">
            <HeaderInfor title='Quản lý đơn hàng chăm sóc' />
            <section className="mtko-box default-layout">
                <Table
                    className='table' 
                    columns={ColumnServiceOrder} 
                    dataSource={DataSourceServiceOrder} 
                    scroll={{ y: 680, x: 3000 }}
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
            {
                (actionMethod?.actionType === 'deposit') &&
                <Modal
                    title={`Xác nhận thanh toán tiền cọc cho đơn hàng ${serviceOrders.filter(x => x.id === actionMethod.orderId)[0].orderCode}`}
                    open
                    onCancel={handleClose}
                    onOk={handlePaymentDeposit}
                >
                </Modal>
            }
            {
                actionMethod?.actionType === 'remaining' &&
                <Modal
                    title={`Thanh toán tiền cho đơn hàng "${serviceOrders.filter(x => x.id === actionMethod.orderId)[0].orderCode}"`}
                    open
                    onCancel={handleClose}
                    onOk={handlePaymentCash}
                    width={800}
                >
                    <p>Nhập số tiền cần thanh toán</p>
                    <CurrencyFormat disabled={checkFullAmount} isAllowed={(values) => {
                        const value = values.floatValue || 0
                        const remain = serviceOrders.filter(x => x.id === actionMethod.orderId)[0].remainAmount
                        if(value >= remain) {
                            setAmount(remain)
                        }else{
                            setAmount(Number(value))
                        }
                        return value <= remain
                    }}
                    value={amount} 
                    max={serviceOrders.filter(x => x.id === actionMethod.orderId)[0].remainAmount} thousandSeparator={true} suffix={' VNĐ'}/>
                    <Checkbox checked={checkFullAmount} onChange={handleChangeCheck}>Đủ số tiền cần thanh toán</Checkbox>
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
                    orderType='service'
                />
            }
        </div>
    )
}

export default ManageTakeCareOrder