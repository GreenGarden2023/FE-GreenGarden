import { Tag, Tooltip } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import HeaderInfor from 'app/components/header-infor/HeaderInfor'
import MoneyFormat from 'app/components/money/MoneyFormat'
import useDispatch from 'app/hooks/use-dispatch'
import { PaymentAction } from 'app/models/general-type'
import { RentOrder } from 'app/models/order'
import { PaymentModal } from 'app/models/payment'
import orderService from 'app/services/order.service'
import { setNoti } from 'app/slices/notification'
import utilDateTime from 'app/utils/date-time'
import utilGeneral from 'app/utils/general'
import React, { useEffect, useMemo, useState } from 'react'
import { BiDetail } from 'react-icons/bi'
import { MdOutlinePayments } from 'react-icons/md'
import { RiBillLine } from 'react-icons/ri'
import { useNavigate } from 'react-router-dom'
import './style.scss'

const ManageRentOrder:React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [action, setAction] = useState<PaymentModal>();

    const [rentOrders, setRentOrders] = useState<RentOrder[]>([])

    useEffect(() =>{
        const init = async () =>{
            try{
                const res = await orderService.getAllRentOrders({curPage: 1, pageSize: 20});
                setRentOrders(res.data.rentOrderGroups)
            }catch{

            }
        }
        init()
    }, [])

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
            title: 'Tên khách hàng',
            key: 'recipientName',
            dataIndex: 'recipientName',
            align: 'center',
            // render: (v) => (v)
        },
        {
            title: 'Số điện thoại',
            key: 'recipientPhone',
            dataIndex: 'recipientPhone',
            align: 'center',
            // render: (v) => (v)
        },
        {
            title: 'Địa chỉ',
            key: 'recipientAddress',
            dataIndex: 'recipientAddress',
            align: 'center',
            // render: (v) => (v)
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
                    <Tooltip title="Chi tiết đơn hàng" color='#108ee9'>
                        <BiDetail size={25} cursor='pointer' color='#00a76f' onClick={() => navigate(`/panel/rent-order/${record.groupID}`)} />
                    </Tooltip>
                    <Tooltip title='Thanh toán tiền cọc' color='#108ee9' >
                        <MdOutlinePayments size={25} color='#00a76f' cursor='pointer' onClick={() => handleSetAction(record.orderID, 'deposit')} />
                    </Tooltip>
                    <Tooltip title='Thanh toán đơn hàng' color='#108ee9'>
                        <RiBillLine size={25} color='#00a76f' cursor='pointer' onClick={() => handleSetAction(record.orderID, 'remaining')} />
                    </Tooltip>
                </>
            )
        },
    ]
    const handleSetAction = async (orderId: string, type: PaymentAction) =>{
        const order = rentOrders.filter(x => x.id === orderId)[0]

        if(type === 'deposit' && order[0].status === 'ready'){
            dispatch(setNoti({type: 'info', message: 'Đơn hàng này đã thanh toán đặt cọc!!'}))
            return;
        }
        if(type === 'remaining' && order[0].status === 'completed'){
            dispatch(setNoti({type: 'info', message: 'Đơn hàng này đã thanh toán đủ!!'}))
            return;
        }

        setAction({orderId, type})
    }
    const DataSourceRentOrder = useMemo(() =>{
        return rentOrders.map((x, index) => ({
            key: String(index + 1),
            orderID: x.rentOrderList[0].id,
            groupID: x.id,
            totalPrice: x.totalGroupAmount,
            startDateRent: x.rentOrderList[0].startDateRent,
            endDateRent: x.rentOrderList[0].endDateRent,
            status: x.rentOrderList[0].status,
            remainMoney: x.rentOrderList[0].remainMoney,
            deposit: x.rentOrderList[0].deposit,
            recipientName: x.rentOrderList[0].recipientName,
            recipientPhone: x.rentOrderList[0].recipientPhone,
            recipientAddress: x.rentOrderList[0].recipientAddress
        }))
    }, [rentOrders])

    return (
        <div className="mro-wrapper">
            <HeaderInfor title='Quản lý đơn hàng thuê' />
            <section className="mso-box default-layout">
                <Table dataSource={DataSourceRentOrder} columns={ColumnRentOrder} />
            </section>
        </div>
    )
}

export default ManageRentOrder