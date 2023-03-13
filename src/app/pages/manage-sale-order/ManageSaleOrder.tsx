import { Checkbox, Modal, Tag, Tooltip } from 'antd'
import { CheckboxChangeEvent } from 'antd/es/checkbox'
import Table, { ColumnsType } from 'antd/es/table'
import HeaderInfor from 'app/components/header-infor/HeaderInfor'
import MoneyFormat from 'app/components/money/MoneyFormat'
import useDispatch from 'app/hooks/use-dispatch'
import { PaymentAction } from 'app/models/general-type'
import { SaleOrderList } from 'app/models/order'
import { PaymentModal } from 'app/models/payment'
import orderService from 'app/services/order.service'
import paymentService from 'app/services/payment.service'
import { setNoti } from 'app/slices/notification'
import CONSTANT from 'app/utils/constant'
import utilGeneral from 'app/utils/general'
import React, { useEffect, useMemo, useState } from 'react'
import CurrencyFormat from 'react-currency-format'
import { BiCommentDetail } from 'react-icons/bi'
import { MdOutlinePayments } from 'react-icons/md'
import { RiBillLine } from 'react-icons/ri'
import './style.scss'

const ManageSaleOrder: React.FC = () => {
    const dispatch = useDispatch();

    const [saleOrder, setSaleOrder] = useState<SaleOrderList[]>([]);
    const [action, setAction] = useState<PaymentModal>();
    const [amount, setAmount] = useState(0);
    const [checkFullAmount, setCheckFullAmount] = useState(false);

    useEffect(() =>{
        const init = async () =>{
            try{
                const res = await orderService.getAllSaleOrders({curPage: 1, pageSize: 20})
                setSaleOrder(res.data.saleOrderList)
            }catch{

            }
        }
        init()
    }, [])
    const handleSetAction = (orderId: string, type: PaymentAction) =>{
        const order = saleOrder.filter(x => x.id === orderId)[0]

        if(type === 'deposit' && order.status === 'ready'){
            dispatch(setNoti({type: 'info', message: 'Đơn hàng này đã thanh toán đặt cọc!!'}))
            return;
        }
        if(type === 'remaining' && order.status === 'completed'){
            dispatch(setNoti({type: 'info', message: 'Đơn hàng này đã thanh toán đủ!!'}))
            return;
        }

        setAction({orderId, type})
    }
    const Column: ColumnsType<any> = [
        {
            title: '#',
            key: '#',
            dataIndex: '#',
            align: 'center',
            render: (v, _, index) => (<span style={{color: '#00a76f'}}>{index + 1}</span>)
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
            title: 'Trạng thái',
            key: 'status',
            dataIndex: 'status',
            align: 'center',
            render: (v) => (
                <Tag color={utilGeneral.statusToColor(v)}>{utilGeneral.statusToViLanguage(v)}</Tag>
            )
        },
        {
            title: 'Tổng giá trị đơn hàng',
            key: 'totalPrice',
            dataIndex: 'totalPrice',
            align: 'center',
            render: (v) => (<MoneyFormat value={v} />)
        },
        {
            title: 'Phí vận chuyển',
            key: 'transportFee',
            dataIndex: 'transportFee',
            align: 'center',
            render: (v) => (<MoneyFormat value={v} />)
        },
        {
            title: 'Số tiền còn thiếu',
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
            title: 'Xử lý',
            key: 'actions',
            dataIndex: 'actions',
            align: 'center',
            render: (_, record) => (
                <>
                    <Tooltip title='Chi tiết đơn hàng' color='#108ee9' >
                        <BiCommentDetail size={25} color='#00a76f' cursor='pointer' onClick={() => handleSetAction(record.orderId, 'detail')} />
                    </Tooltip>
                    <Tooltip title='Thanh toán tiền cọc' color='#108ee9' >
                        <MdOutlinePayments size={25} color='#00a76f' cursor='pointer' onClick={() => handleSetAction(record.orderId, 'deposit')} />
                    </Tooltip>
                    <Tooltip title='Thanh toán đơn hàng' color='#108ee9'>
                        <RiBillLine size={25} color='#00a76f' cursor='pointer' onClick={() => handleSetAction(record.orderId, 'remaining')} />
                    </Tooltip>
                </>
            )
        },
    ]
    const DataSource = useMemo(() =>{
        return saleOrder.map((x, index) => ({
            key: String(index + 1),
            orderId: x.id,
            status: x.status,
            totalPrice: x.totalPrice,
            transportFee: x.transportFee,
            remainMoney: x.remainMoney,
            deposit: x.deposit,
            recipientAddress: x.recipientAddress,
            recipientPhone: x.recipientPhone,
            recipientName: x.recipientName
        }))
    }, [saleOrder])

    const handleCancel = () =>{
        setAction(undefined)
    }
    const handlePaymentDeposit = async () =>{
        try{
            await paymentService.depositPaymentCash(action?.orderId || '', 'sale')
            setSaleOrder(saleOrder.map(x => x.id === action?.orderId ? ({
                ...x,
                status: 'ready'
            }) : x))
            handleCancel()
            dispatch(setNoti({type: 'success', message: 'Thanh toán đặt cọc thành công'}))
        }catch{
            dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
        }
    }
    const handleChangeCheck = (e: CheckboxChangeEvent) =>{
        setCheckFullAmount(e.target.checked)
    }
    const handlePaymentCash = async () =>{
        try{
            const order = saleOrder.filter(x => x.id === action?.orderId)[0]
            let amountOrder = 0;
            if(checkFullAmount){
                amountOrder = order.remainMoney
            }else{
                amountOrder = amount
            }
            await paymentService.paymentCash(action?.orderId || '', amountOrder, 'sale')
            const res = await orderService.getAllSaleOrders({curPage: 1, pageSize: 20})
            setSaleOrder(res.data.saleOrderList)
            handleCancel()
            dispatch(setNoti({type: 'success', message: 'Cập nhật đơn hàng thành công'}))
        }catch{
            dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
        }
    }
    return (
        <div className="mso-wrapper">
            <HeaderInfor title='Quản lý đơn hàng mua' />
            <section className="mso-box default-layout">
                <Table dataSource={DataSource} columns={Column} />
            </section>
            <Modal
                title='Xác nhận thanh toán đặt cọc'
                open={action?.type === 'deposit'}
                onOk={handlePaymentDeposit}
                onCancel={handleCancel}
                width={800}
            >
                <h2>Xác nhận thanh toán đặt cọc cho đơn hàng {action?.orderId}</h2>
            </Modal>
            <Modal
                title='Thanh toán số tiền còn lại'
                open={action?.type === 'remaining'}
                onCancel={handleCancel}
                onOk={handlePaymentCash}
                width={800}
            >
                <p>Nhập số tiền cần thanh toán</p>
                <CurrencyFormat disabled={checkFullAmount} value={amount} thousandSeparator={true} suffix={' VNĐ'} onValueChange={(values) => {
                    const {formattedValue, value} = values;
                    // formattedValue = $2,223
                    // value ie, 2223
                    setAmount(Number(value))
                }}/>
                <Checkbox onChange={handleChangeCheck}>Đủ số tiền cần thanh toán</Checkbox>
            </Modal>
        </div>
    )
}

export default ManageSaleOrder