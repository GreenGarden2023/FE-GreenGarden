import { Tag, Tooltip } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import LandingFooter from 'app/components/footer/LandingFooter'
import HeaderInfor from 'app/components/header-infor/HeaderInfor'
import LandingHeader from 'app/components/header/LandingHeader'
import MoneyFormat from 'app/components/money/MoneyFormat'
import { PaymentAction } from 'app/models/general-type'
import { RentOrder } from 'app/models/order'
import orderService from 'app/services/order.service'
import paymentService from 'app/services/payment.service'
import utilDateTime from 'app/utils/date-time'
import utilGeneral from 'app/utils/general'
import React, { useEffect, useMemo, useState } from 'react'
import { BiCommentDetail } from 'react-icons/bi'
import { MdOutlinePayments } from 'react-icons/md'
import { RiBillLine } from 'react-icons/ri'
import { useParams } from 'react-router-dom'
import './style.scss'

const ClientRentOrderGroup: React.FC = () => {
    const { orderId } = useParams()

    const [rentOrderGroup, setRentOrderGroup] = useState<RentOrder>()

    useEffect(() =>{
        if(!orderId) return;

        const init = async () =>{
            try{
                const res = await orderService.getRentOrderGroup(orderId)
                setRentOrderGroup(res.data)
            }catch{

            }
        }
        init()
    }, [orderId])
    const ColumnRentOrder: ColumnsType<any> = [
        {
            title: '#',
            key: '#',
            dataIndex: '#',
            align: 'center',
            render: (v, _, index) => (<span style={{color: '#00a76f'}}>{index + 1}</span>)
        },
        {
            title: 'Mã đơn hàng',
            key: 'orderID',
            dataIndex: 'orderID',
            align: 'center',
            render: (v) => (v.slice(0, 5))
        },
        {
            title: 'Ngày bắt đầu thuê',
            key: 'startDateRent',
            dataIndex: 'startDateRent',
            align: 'center',
            render: (v) => (utilDateTime.dateToString(v))
        },
        {
            title: 'Ngày kết thúc thuê',
            key: 'endDateRent',
            dataIndex: 'endDateRent',
            align: 'center',
            render: (v) => (utilDateTime.dateToString(v))
        },
        {
            title: 'Giá tiền',
            key: 'totalPrice',
            dataIndex: 'totalPrice',
            align: 'center',
            render: (v) => (<MoneyFormat value={v} />)
        },
        {
            title: 'Số tiền cần trả',
            key: 'remainMoney',
            dataIndex: 'remainMoney',
            align: 'center',
            render: (v) => (<MoneyFormat value={v} />)
        },
        {
            title: 'Số tiền cọc',
            key: 'deposit',
            dataIndex: 'deposit',
            align: 'center',
            render: (v) => (<MoneyFormat value={v} />)
        },
        {
            title: 'Trạng thái',
            key: 'status',
            dataIndex: 'status',
            align: 'center',
            render: (v) => (<Tag color={utilGeneral.statusToColor(v)}>{utilGeneral.statusToViLanguage(v)}</Tag>)
        },
        {
            title: 'Xử lý',
            key: 'action',
            dataIndex: 'action',
            align: 'center',
            render: (_, record) => (
                <>
                    <Tooltip title='Chi tiết đơn hàng' color='#108ee9' >
                        <BiCommentDetail size={25} color='#00a76f' cursor='pointer' onClick={() => handleSetAction(record.orderID, 'detail')} />
                    </Tooltip>
                    <Tooltip title='Thanh toán cọc bằng Momo' color='#108ee9' >
                        <MdOutlinePayments size={25} color='#00a76f' cursor='pointer' onClick={() => handleSetAction(record.orderID, 'deposit')} />
                    </Tooltip>
                    <Tooltip title='Thanh toán bằng Momo' color='#108ee9'>
                        <RiBillLine size={25} color='#00a76f' cursor='pointer' onClick={() => handleSetAction(record.orderID, 'remaining')} />
                    </Tooltip>
                </>
            )
        },
    ]
    const DataSourceRentOrder = useMemo(() =>{
        return rentOrderGroup?.rentOrderList.map((x, index) => ({
            key: String(index + 1),
            orderID: x.id,
            totalPrice: x.totalPrice,
            startDateRent: x.startDateRent,
            endDateRent: x.endDateRent,
            status: x.status,
            remainMoney: x.remainMoney,
            deposit: x.deposit
        }))
    }, [rentOrderGroup])
    const handleSetAction = async (orderId: string, type: PaymentAction) =>{
        console.log(orderId)
        if(type === 'deposit'){
            try{
                const res = await paymentService.depositPaymentMomo(orderId, 'rent')
                window.open(res.data.payUrl, '_blank')
            }catch{

            }
        }else if(type === 'remaining'){
            try{
                const amount = rentOrderGroup?.rentOrderList.filter(x => x.id === orderId)[0].remainMoney || 0
                const res = await paymentService.paymentMomo(orderId, amount, 'rent')
                window.open(res.data.payUrl, '_blank')
            }catch{
                
            }
        }
    }
    return (
        <div>
            <LandingHeader />
            <div className="main-content-not-home">
                <div className="container-wrapper crog-wrapper">
                    <HeaderInfor title={`Nhóm đơn hàng thuê ${rentOrderGroup?.id}`} />
                    <section className="crog-box default-layout">
                        <Table className='cart-table' dataSource={DataSourceRentOrder} columns={ColumnRentOrder} pagination={false} />
                    </section>
                </div>
            </div>
            <LandingFooter />
        </div>
    )
}

export default ClientRentOrderGroup