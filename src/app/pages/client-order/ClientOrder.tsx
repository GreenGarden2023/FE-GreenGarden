import { Collapse, Tag, Tooltip } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import LandingFooter from 'app/components/footer/LandingFooter';
import HeaderInfor from 'app/components/header-infor/HeaderInfor';
import LandingHeader from 'app/components/header/LandingHeader';
import MoneyFormat from 'app/components/money/MoneyFormat';
import useDispatch from 'app/hooks/use-dispatch';
import useSelector from 'app/hooks/use-selector';
import { PaymentAction } from 'app/models/general-type';
import { RentOrder, SaleOrderList } from 'app/models/order';
import { PaymentModal } from 'app/models/payment';
import orderService from 'app/services/order.service';
import paymentService from 'app/services/payment.service';
import { setNoti } from 'app/slices/notification';
import CONSTANT from 'app/utils/constant';
import utilDateTime from 'app/utils/date-time';
import utilGeneral from 'app/utils/general';
import React, { useEffect, useMemo, useState } from 'react';
import { BiCommentDetail, BiDetail } from 'react-icons/bi';
import { MdOutlinePayments } from 'react-icons/md';
import { RiBillLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import './style.scss';

// interface OrderViewModel{
//     orderID: string;
//     totalPrice: string;
//     createDate: string;
//     status: OrderStatus;
//     isForRent: boolean;
//     addendums: Addendum[]
// }

const ClientOrder: React.FC = () =>{
    const { id } = useSelector(state => state.userInfor)
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [saleOrders, setSaleOrders] = useState<SaleOrderList[]>([])
    const [rentOrders, setRentOrders] = useState<RentOrder[]>([])
    const [action, setAction] = useState<PaymentModal>();
    console.log(action)
    useEffect(() =>{
        if(!id) return;

        const init = async () =>{
            try{
                const res = await orderService.getSaleOrders()
                setSaleOrders(res.data.saleOrderList)
            }catch{
                dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
            }
        }
        init()
    }, [id, dispatch])
    useEffect(() =>{
        if(!id) return;

        const init = async () =>{
            try{
                const res = await orderService.getRentOrders()
                setRentOrders(res.data.rentOrderGroups)
            }catch{
                dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
            }
        }
        init()
    }, [id, dispatch])

    const handleSetAction = async (orderId: string, type: PaymentAction) =>{
        setAction({orderId, type})
        if(type === 'deposit'){
            try{
                const res = await paymentService.depositPaymentMomo(orderId, 'sale')
                window.open(res.data.payUrl, '_blank')
            }catch{

            }
        }else if(type === 'remaining'){
            try{
                const amount = saleOrders.filter(x => x.id === orderId)[0].remainMoney
                const res = await paymentService.paymentMomo(orderId, amount, 'sale')
                window.open(res.data.payUrl, '_blank')
            }catch{

            }
        }
    }

    const ColumnSaleOrder: ColumnsType<any> = [
        {
            title: '#',
            key: '#',
            dataIndex: '#',
            align: 'center',
            render: (v, _, index) => (<span style={{color: '#00a76f'}}>{index + 1}</span>)
        },
        {
            title: 'Ngày tạo đơn hàng',
            key: 'createDate',
            dataIndex: 'createDate',
            align: 'center',
            render: (v) => (utilDateTime.dateToString(v))
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
                    <Tooltip title='Thanh toán cọc bằng Momo' color='#108ee9' >
                        <MdOutlinePayments size={25} color='#00a76f' cursor='pointer' onClick={() => handleSetAction(record.orderId, 'deposit')} />
                    </Tooltip>
                    <Tooltip title='Thanh toán bằng Momo' color='#108ee9'>
                        <RiBillLine size={25} color='#00a76f' cursor='pointer' onClick={() => handleSetAction(record.orderId, 'remaining')} />
                    </Tooltip>
                </>
            )
        },
    ]
    const DataSourceSaleOrder = useMemo(() =>{
        return saleOrders.map((x, index) => ({
            key: String(index + 1),
            orderId: x.id,
            createDate: x.createDate,
            status: x.status,
            totalPrice: x.totalPrice,
            transportFee: x.transportFee,
            remainMoney: x.remainMoney,
            deposit: x.deposit,
        }))
    }, [saleOrders])

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
                    <Tooltip title="Chi tiết đơn hàng" color='#108ee9'>
                        <BiDetail size={25} cursor='pointer' color='#00a76f' onClick={() => navigate(`/order-group/${record.groupID}`)} />
                    </Tooltip>
                </>
            )
        },
    ]
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
            deposit: x.rentOrderList[0].deposit
        }))
    }, [rentOrders])

    return (
        <div>
            <LandingHeader />
            <div className="main-content-not-home">
                <div className="container-wrapper co-wrapper">
                    <HeaderInfor title='Quản lý đơn hàng của bạn' />
                    <section className="co-box default-layout">
                        <Collapse defaultActiveKey={['1']}>
                            <Collapse.Panel header="Đơn hàng cho thuê" key="1">
                                <Table className='cart-table' dataSource={DataSourceRentOrder} columns={ColumnRentOrder} pagination={false} />
                            </Collapse.Panel>
                        </Collapse>
                    </section>
                    <section className="co-box default-layout">
                        <Collapse defaultActiveKey={['1']}>
                            <Collapse.Panel header="Đơn hàng bán" key="1">
                                <Table className='cart-table' dataSource={DataSourceSaleOrder} columns={ColumnSaleOrder} pagination={false} />
                            </Collapse.Panel>
                        </Collapse>
                    </section>
                </div>
            </div>
            <LandingFooter />
        </div>
    );
}

export default ClientOrder;