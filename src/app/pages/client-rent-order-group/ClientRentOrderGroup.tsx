import { Collapse, Popover } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import LandingFooter from 'app/components/footer/LandingFooter'
import HeaderInfor from 'app/components/header-infor/HeaderInfor'
import LandingHeader from 'app/components/header/LandingHeader'
import ClientExtendOrder from 'app/components/modal/client-extend-order/ClientExtendOrder'
import ModalClientRentOrderDetai from 'app/components/modal/client-rent-order-detail/ModalClientRentOrderDetai'
import MoneyFormat from 'app/components/money/MoneyFormat'
import useDispatch from 'app/hooks/use-dispatch'
import { RentOrder } from 'app/models/order'
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
import { BiCommentDetail } from 'react-icons/bi'
import { GrMore } from 'react-icons/gr'
import { MdCancelPresentation, MdOutlinePayments } from 'react-icons/md'
import { SiGitextensions } from 'react-icons/si'
import { useNavigate, useParams } from 'react-router-dom'
import './style.scss'
import OrderStatusComp from 'app/components/status/OrderStatusComp'
import LoadingView from 'app/components/loading-view/LoadingView'
import NoProduct from 'app/components/no-product/NoProduct'
import CancelOrder from 'app/components/modal/cancel-order/CancelOrder'

const ClientRentOrderGroup: React.FC = () => {
    const { groupId, orderId } = useParams()
    const dispatch = useDispatch();
    const navigate = useNavigate()

    const [rentOrderGroup, setRentOrderGroup] = useState<RentOrder>()
    const [actionMethod, setActionMethod] = useState<PaymentControlState>()
    const [shipping, setShipping] = useState<ShippingFee[]>([])
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
        if(!groupId || !orderId) return;

        const init = async () =>{
            setLoading(true)
            try{
                const res = await orderService.getRentOrderGroup(groupId)
                res.data.rentOrderList.reverse()
                setRentOrderGroup(res.data)
            }catch{
                dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
            }
            setLoading(false)
        }
        init()
    }, [groupId, dispatch, orderId])
    const ColumnRentOrder: ColumnsType<any> = [
        {
            title: 'Mã đơn hàng',
            key: 'orderCode',
            dataIndex: 'orderCode',
            align: 'center',
            width: 170,
            fixed: 'left',
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
            align: 'center',
            width: 200,
            render: (v) => (<OrderStatusComp status={v} />)
        },
        {
            title: 'Phí vận chuyển',
            key: 'transportFee',
            dataIndex: 'transportFee',
            align: 'right',
            width: 200,
            render: (v) => (<MoneyFormat value={v} color='Default' />)
        },
        {
            title: 'Tiền cọc',
            key: 'deposit',
            dataIndex: 'deposit',
            align: 'right',
            width: 200,
            render: (v) => (<MoneyFormat value={v} color='Orange' />)
        },
        {
            title: 'Tiền được giảm',
            key: 'discountAmount',
            dataIndex: 'discountAmount',
            align: 'right',
            width: 200,
            render: (v) => (<MoneyFormat value={v} color='Yellow' />)
        },
        {
            title: 'Giá trị đơn hàng',
            key: 'totalPrice',
            dataIndex: 'totalPrice',
            align: 'right',
            width: 200,
            render: (v) => (<MoneyFormat value={v} color='Light Blue' />)
        },
        {
            title: 'Số tiền cần trả',
            key: 'remainMoney',
            dataIndex: 'remainMoney',
            align: 'right',
            width: 200,
            render: (v) => (<MoneyFormat value={v} color='Blue' />)
        },
        {
            title: 'Xử lý',
            key: 'action',
            dataIndex: 'action',
            align: 'center',
            fixed:'right',
            render: (_, record, index) => (
                <Popover
                content={() => contextRent(record, index)} 
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
    const contextRent = (record, index: number) => {
        return (
            <div className='context-menu-wrapper'>
                <div className="item" onClick={() => {
                    setActionMethod({orderId: record.orderId, actionType: 'detail', orderType: 'rent', openIndex: -1})
                }}>
                    <BiCommentDetail size={25} className='icon'/>
                    <span>Chi tiết đơn hàng</span>
                </div>
                {
                    record.status === 'unpaid' && 
                    <div className="item" onClick={() => {
                        handleSetAction({orderId: record.orderId, actionType: 'deposit', orderType: 'rent', openIndex: -1})
                    }} >
                        <MdOutlinePayments size={25} className='icon'/>
                        <span>Thanh toán cọc bằng Momo</span>
                    </div>
                }
                {
                    (record.status === 'unpaid' || record.status === 'ready') &&
                    <div className="item" onClick={() => {
                        handleSetAction({orderId: record.orderId, actionType: 'remaining', orderType: 'rent', openIndex: -1})
                    }} >
                        <MdOutlinePayments size={25} className='icon'/>
                        <span>Thanh toán đơn hàng bằng Momo</span>
                    </div>
                }
                {
                    (record.status === 'paid' && utilDateTime.isDisplayExtendRentOrder(record.endDateRent) && index === 0) && 
                    <div className="item" onClick={() => {
                        setActionMethod({orderId: record.orderId, actionType: 'extend', orderType: 'rent', openIndex: -1})
                    }}>
                        <SiGitextensions size={25} className='icon'/>
                        <span>Gia hạn đơn hàng</span>
                    </div>
                }
                {
                    record.status === 'unpaid' && 
                    <div className="item" onClick={() => {
                        setActionMethod({orderId: record.orderId, actionType: 'cancel', orderType: 'rent', openIndex: -1})
                    }} >
                        <MdCancelPresentation size={25} className='icon'/>
                        <span>Hủy đơn hàng</span>
                    </div>
                }
            </div>
        )
    }
    const DataSourceRentOrder = useMemo(() =>{
        if(!rentOrderGroup) return ([{}] as any);

        const [x] = rentOrderGroup.rentOrderList.filter(x => x.id === orderId)

        if(!x) return ([{}] as any);

        return [{
            key: String(1),
            orderId: x.id,
            orderCode: x.orderCode,
            totalPrice: x.totalPrice,
            startDateRent: x.startRentDate,
            endDateRent: x.endRentDate,
            status: x.status,
            remainMoney: x.status === 'unpaid' ? x.remainMoney + x.deposit : x.remainMoney,
            deposit: x.deposit,
            transportFee: x.transportFee,
            discountAmount: x.discountAmount,
        }]
    }, [rentOrderGroup, orderId])
    const handleSetAction = async (data: PaymentControlState) =>{
        const { orderId, actionType } = data

        if(!rentOrderGroup) return;

        const [order] = rentOrderGroup?.rentOrderList.filter(x => x.id === orderId)

        if(actionType === 'deposit' && order.status !== 'unpaid'){
            return dispatch(setNoti({type: 'info', message: CONSTANT.PAYMENT_MESSAGE.PAID_DEPOSIT}))
        }
        if(actionType === 'remaining' && (order.status === 'paid' || order.status === 'completed')){
            return dispatch(setNoti({type: 'info', message: CONSTANT.PAYMENT_MESSAGE.PAID_REMAINING}))
        }
        
        if(actionType === 'deposit'){
            try{
                const res = await paymentService.depositPaymentMomo(orderId, 'rent')
                window.open(res.data.payUrl, '_blank')
            }catch{

            }
        }else if(actionType === 'remaining'){
            try{
                const res = await paymentService.paymentMomo(orderId, order.remainMoney, 'rent', order.status === 'unpaid' ? 'whole' : '')
                window.open(res.data.payUrl, '_blank')
            }catch{
                
            }
        }
    }
    const handleCancel = () =>{
        setActionMethod(undefined)
    }

    const handleCancelRentOrder = (reason: string, canceledBy: string) =>{
        if(!rentOrderGroup) return;

        const [order] = rentOrderGroup?.rentOrderList.filter(x => x.id === orderId)

        order.status = 'cancel'
        order.reason = reason
        order.nameCancelBy = canceledBy

        setRentOrderGroup({...rentOrderGroup})
    }

    const handleExtendOrder = (newOrderId: string) =>{
        navigate(`/order-group/${groupId}/${newOrderId}`, { replace: true })
    }

    return (
        <div>
            <LandingHeader />
            <div className="main-content-not-home">
                <div className="container-wrapper crog-wrapper">
                    {
                        loading && <LoadingView loading />
                    }
                    {
                        (!loading && !rentOrderGroup && DataSourceRentOrder.length !== 0) ? <NoProduct /> :
                        rentOrderGroup && 
                        <>
                            <HeaderInfor title={`Nhóm đơn hàng thuê`} />
                            <section className="crog-box default-layout">
                                <Table 
                                    className='cart-table' 
                                    dataSource={DataSourceRentOrder} 
                                    columns={ColumnRentOrder} 
                                    pagination={false} 
                                    scroll={{x: 2000}}
                                    rowClassName={(record, index) => {
                                        if(record.orderId === rentOrderGroup.rentOrderList[0].id) return 'parent-order-group'
                                        return 'current-order-group'
                                    }}
                                />
                            </section>
                            {
                                (orderId && rentOrderGroup.numberOfOrder !== 1) &&
                                <ClientViewAllOrderGroup 
                                    orderId={orderId}
                                    rentOrderGroup={rentOrderGroup}
                                />
                            }
                        </>
                    }
                </div>
            </div>
            <LandingFooter />
            {
                (actionMethod?.actionType === 'detail' && rentOrderGroup) && 
                <ModalClientRentOrderDetai
                    rentOrderList={rentOrderGroup.rentOrderList.filter(x => x.id === actionMethod.orderId)[0]}
                    onClose={handleCancel}
                />
            }
            {
                (actionMethod?.actionType === 'extend' && rentOrderGroup) &&
                <ClientExtendOrder
                    rentOrderList={rentOrderGroup.rentOrderList.filter(x => x.id === actionMethod.orderId)[0]}
                    shipping={shipping}
                    onClose={handleCancel}
                    onExtend={handleExtendOrder}
                /> 
            }
            {
                (actionMethod?.actionType === 'cancel' && rentOrderGroup) &&
                <CancelOrder 
                    orderId={rentOrderGroup.rentOrderList.filter(x => x.id === actionMethod.orderId)[0].id}
                    orderCode={rentOrderGroup.rentOrderList.filter(x => x.id === actionMethod.orderId)[0].orderCode}
                    onClose={handleCancel}
                    onSubmit={handleCancelRentOrder}
                    orderType='rent'
                />
            }
        </div>
    )
}

interface ClientViewAllOrderGroupProps{
    orderId: string;
    rentOrderGroup: RentOrder
}

const ClientViewAllOrderGroup: React.FC<ClientViewAllOrderGroupProps> = ({ orderId, rentOrderGroup }) =>{

    const [actionMethod, setActionMethod] = useState<PaymentControlState>()

    const ColumnRentOrder: ColumnsType<any> = [
        {
            title: 'Mã đơn hàng',
            key: 'orderCode',
            dataIndex: 'orderCode',
            align: 'center',
            width: 170,
            fixed: 'left',
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
            align: 'center',
            width: 200,
            render: (v) => (<OrderStatusComp status={v} />)
        },
        {
            title: 'Phí vận chuyển',
            key: 'transportFee',
            dataIndex: 'transportFee',
            align: 'right',
            width: 200,
            render: (v) => (<MoneyFormat value={v} color='Default' />)
        },
        {
            title: 'Tiền cọc',
            key: 'deposit',
            dataIndex: 'deposit',
            align: 'right',
            width: 200,
            render: (v) => (<MoneyFormat value={v} color='Orange' />)
        },
        {
            title: 'Tiền được giảm',
            key: 'discountAmount',
            dataIndex: 'discountAmount',
            align: 'right',
            width: 200,
            render: (v) => (<MoneyFormat value={v} color='Yellow' />)
        },
        {
            title: 'Giá trị đơn hàng',
            key: 'totalPrice',
            dataIndex: 'totalPrice',
            align: 'right',
            width: 200,
            render: (v) => (<MoneyFormat value={v} color='Light Blue' />)
        },
        {
            title: 'Số tiền cần trả',
            key: 'remainMoney',
            dataIndex: 'remainMoney',
            align: 'right',
            width: 200,
            render: (v) => (<MoneyFormat value={v} color='Blue' />)
        },
        {
            title: 'Xử lý',
            key: 'action',
            dataIndex: 'action',
            align: 'center',
            fixed:'right',
            render: (_, record, index) => (
                <Popover
                content={() => contextRent(record, index)} 
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
    const contextRent = (record, index: number) => {
        return (
            <div className='context-menu-wrapper'>
                <div className="item" onClick={() => {
                    setActionMethod({orderId: record.orderId, actionType: 'detail', orderType: 'rent', openIndex: -1})
                }}>
                    <BiCommentDetail size={25} className='icon'/>
                    <span>Chi tiết đơn hàng</span>
                </div>
            </div>
        )
    }
    const DataSourceRentOrder = useMemo(() =>{
        return rentOrderGroup.rentOrderList.map((x, index) => ({
            key: String(index + 1),
            orderId: x.id,
            orderCode: x.orderCode,
            totalPrice: x.totalPrice,
            startDateRent: x.startRentDate,
            endDateRent: x.endRentDate,
            status: x.status,
            remainMoney: x.status === 'unpaid' ? x.remainMoney + x.deposit : x.remainMoney,
            deposit: x.deposit,
            transportFee: x.transportFee,
            discountAmount: x.discountAmount,
        }))
    }, [rentOrderGroup])

    const handleClose = () =>{
        setActionMethod(undefined)
    }

    return (
        <>
            <section className="default-layout">
                <Collapse defaultActiveKey={['']}>
                    <Collapse.Panel header="Xem đơn hàng gốc" key="1">
                    <Table
                        rowClassName={(record, index) => {
                        if(index === 0) return 'parent-order-group'
                        if(record.orderId === orderId) return 'current-order-group'
                        return ''
                        }}
                        dataSource={DataSourceRentOrder}
                        columns={ColumnRentOrder}
                        pagination={false}
                        scroll={{ x: 2000, y: 680 }}
                    />
                    </Collapse.Panel>
                </Collapse>
            </section>
            {
                actionMethod?.actionType === "detail" && rentOrderGroup && (
                    <ModalClientRentOrderDetai
                    onClose={handleClose}
                    rentOrderList={rentOrderGroup.rentOrderList.filter(x => x.id === actionMethod.orderId)[0]}
                    />
                )
            }
        </>
    )
}

export default ClientRentOrderGroup