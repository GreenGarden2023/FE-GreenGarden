import { Popover, Tag } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import LandingFooter from 'app/components/footer/LandingFooter'
import HeaderInfor from 'app/components/header-infor/HeaderInfor'
import LandingHeader from 'app/components/header/LandingHeader'
import ModalClientRentOrderDetai from 'app/components/modal/client-rent-order-detail/ModalClientRentOrderDetai'
import MoneyFormat from 'app/components/money/MoneyFormat'
import useDispatch from 'app/hooks/use-dispatch'
import { RentOrder } from 'app/models/order'
import { PaymentControlState } from 'app/models/payment'
import orderService from 'app/services/order.service'
import paymentService from 'app/services/payment.service'
import { setNoti } from 'app/slices/notification'
import CONSTANT from 'app/utils/constant'
import utilDateTime from 'app/utils/date-time'
import utilGeneral from 'app/utils/general'
import React, { useEffect, useMemo, useState } from 'react'
import { BiCommentDetail } from 'react-icons/bi'
import { GrMore } from 'react-icons/gr'
import { MdOutlinePayments } from 'react-icons/md'
import { useParams } from 'react-router-dom'
import './style.scss'

const ClientRentOrderGroup: React.FC = () => {
    const { groupId } = useParams()
    const dispatch = useDispatch();

    const [rentOrderGroup, setRentOrderGroup] = useState<RentOrder>()
    const [actionMethod, setActionMethod] = useState<PaymentControlState>()

    useEffect(() =>{
        if(!groupId) return;

        const init = async () =>{
            try{
                const res = await orderService.getRentOrderGroup(groupId)
                setRentOrderGroup(res.data)
            }catch{

            }
        }
        init()
    }, [groupId])
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
            render: (v) => (<Tag color={utilGeneral.statusToColor(v)}>{utilGeneral.statusToViLanguage(v)}</Tag>)
        },
        {
            title: 'Phí vận chuyển',
            key: 'transportFee',
            dataIndex: 'transportFee',
            align: 'right',
            render: (v) => (<MoneyFormat value={v} />)
        },
        {
            title: 'Tiền cọc',
            key: 'deposit',
            dataIndex: 'deposit',
            align: 'right',
            render: (v) => (<MoneyFormat value={v} />)
        },
        {
            title: 'Tiền cần trả',
            key: 'remainMoney',
            dataIndex: 'remainMoney',
            align: 'right',
            render: (v) => (<MoneyFormat value={v} />)
        },
        {
            title: 'Tổng đơn hàng',
            key: 'totalPrice',
            dataIndex: 'totalPrice',
            align: 'right',
            render: (v) => (<MoneyFormat value={v} />)
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
                <div className="item" onClick={() => {
                    handleSetAction({orderId: record.orderId, actionType: 'deposit', orderType: 'rent', openIndex: -1})
                }} >
                    <MdOutlinePayments size={25} className='icon'/>
                    <span>Thanh toán cọc bằng Momo</span>
                </div>
                <div className="item" onClick={() => {
                    handleSetAction({orderId: record.orderId, actionType: 'remaining', orderType: 'rent', openIndex: -1})
                }} >
                    <MdOutlinePayments size={25} className='icon'/>
                    <span>Thanh toán đơn hàng bằng Momo</span>
                </div>
            </div>
        )
    }
    const DataSourceRentOrder = useMemo(() =>{
        return rentOrderGroup?.rentOrderList.map((x, index) => ({
            key: String(index + 1),
            orderId: x.id,
            orderCode: x.orderCode,
            totalPrice: x.totalPrice,
            startDateRent: x.startDateRent,
            endDateRent: x.endDateRent,
            status: x.status,
            remainMoney: x.remainMoney,
            deposit: x.deposit,
            transportFee: x.transportFee
        }))
    }, [rentOrderGroup])
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
    return (
        <div>
            <LandingHeader />
            <div className="main-content-not-home">
                <div className="container-wrapper crog-wrapper">
                    <HeaderInfor title={`Nhóm đơn hàng thuê ${rentOrderGroup?.id}`} />
                    <section className="crog-box default-layout">
                        <Table className='cart-table' dataSource={DataSourceRentOrder} columns={ColumnRentOrder} pagination={false} scroll={{x: 1500}} />
                    </section>
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
        </div>
    )
}

export default ClientRentOrderGroup