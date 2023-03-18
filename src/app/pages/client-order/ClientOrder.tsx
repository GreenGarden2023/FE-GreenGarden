import { Popover, Segmented, Tag } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import LandingFooter from 'app/components/footer/LandingFooter';
import HeaderInfor from 'app/components/header-infor/HeaderInfor';
import LandingHeader from 'app/components/header/LandingHeader';
import ModalClientRentOrderDetai from 'app/components/modal/client-rent-order-detail/ModalClientRentOrderDetai';
import ModalClientSaleOrderDetai from 'app/components/modal/client-sale-order-detail/ModalClientSaleOrderDetai';
import MoneyFormat from 'app/components/money/MoneyFormat';
import useDispatch from 'app/hooks/use-dispatch';
import useSelector from 'app/hooks/use-selector';
import { RentOrder, SaleOrderList } from 'app/models/order';
import { Paging } from 'app/models/paging';
import { PaymentControlState } from 'app/models/payment';
import orderService from 'app/services/order.service';
import paymentService from 'app/services/payment.service';
import { setNoti } from 'app/slices/notification';
import CONSTANT from 'app/utils/constant';
import utilDateTime from 'app/utils/date-time';
import utilGeneral from 'app/utils/general';
import pagingPath from 'app/utils/paging-path';
import React, { useEffect, useMemo, useState } from 'react';
import { BiCommentDetail, BiDetail } from 'react-icons/bi';
import { GrMore } from 'react-icons/gr';
import { MdOutlinePayments } from 'react-icons/md';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './style.scss';

type OrderPage = 'rent' | 'sale' | 'service'

const ClientOrder: React.FC = () =>{
    const { id } = useSelector(state => state.userInfor)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // change segment page
    const [pageType, setPageType] = useState<OrderPage>('rent')

    // check action of type payment
    const [actionMethod, setActionMethod] = useState<PaymentControlState>()

    // data
    const [saleOrders, setSaleOrders] = useState<SaleOrderList[]>([])
    const [rentOrders, setRentOrders] = useState<RentOrder[]>([])

    const [paging, setPaging] = useState<Partial<Paging>>({curPage: 1, pageSize: CONSTANT.PAGING_ITEMS.CLIENT_ORDER_RENT})

    useEffect(() =>{
        pagingPath.scrollTop()
        const currentPage = searchParams.get('page');

        if(!pagingPath.isValidPaging(currentPage)){
            setPaging({curPage: 1, pageSize: CONSTANT.PAGING_ITEMS.CLIENT_ORDER_RENT})
            return navigate('/orders?page=1')
        }

    }, [searchParams, navigate])

    useEffect(() =>{
        if(!id) return;
        if(pageType !== 'sale') return;
        const currentPage = searchParams.get('page');

        const init = async () =>{
            try{
                const res = await orderService.getSaleOrders({curPage: Number(currentPage), pageSize: paging.pageSize})
                setSaleOrders(res.data.saleOrderList)
                setPaging(res.data.paging)
            }catch{
                dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
            }
        }
        init()
    }, [id, dispatch, pageType, searchParams, paging.pageSize])

    useEffect(() =>{
        if(!id) return;
        if(pageType !== 'rent') return;
        const currentPage = searchParams.get('page');

        const init = async () =>{
            try{
                const res = await orderService.getRentOrders({curPage: Number(currentPage), pageSize: paging.pageSize})
                setRentOrders(res.data.rentOrderGroups)
                setPaging(res.data.paging)
            }catch{
                dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
            }
        }
        init()
    }, [id, dispatch, pageType, searchParams, paging.pageSize])

    const handlePaymentSale = async (data: PaymentControlState) =>{
        const { orderId, actionType } = data
        const [order] = saleOrders.filter(x => x.id === orderId)

        if(actionType === 'deposit' && order.status !== 'unpaid'){
            return dispatch(setNoti({type: 'info', message: CONSTANT.PAYMENT_MESSAGE.PAID_DEPOSIT}))
        }
        if(actionType === 'remaining' && (order.status === 'paid' || order.status === 'completed')){
            return dispatch(setNoti({type: 'info', message: CONSTANT.PAYMENT_MESSAGE.PAID_REMAINING}))
        }

        if(actionType === 'deposit'){
            try{
                const res = await paymentService.depositPaymentMomo(orderId, 'sale')
                window.open(res.data.payUrl, '_blank')
            }catch{

            }
        }else if(actionType === 'remaining'){
            try{
                const order = saleOrders.filter(x => x.id === orderId)[0]
                const res = await paymentService.paymentMomo(orderId, order.remainMoney, 'sale', order.status === 'unpaid' ? 'whole' : '')
                window.open(res.data.payUrl, '_blank')
            }catch{

            }
        }
    }

    const handlePaymentRent = async (data: PaymentControlState) =>{
        const { orderId, actionType } = data
        const [order] = rentOrders.filter(x => x.rentOrderList[0].id === orderId)[0].rentOrderList

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

    const ColumnSaleOrder: ColumnsType<any> = [
        {
            title: 'Mã đơn hàng',
            key: 'orderCode',
            dataIndex: 'orderCode',
            align: 'center',
            width: 170,
            fixed: 'left',
            render: (v) => (v)
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
            align: 'center',
            render: (v) => (
                <Tag color={utilGeneral.statusToColor(v)}>{utilGeneral.statusToViLanguage(v)}</Tag>
            )
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
            title: 'Số tiền cần trả',
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
            key: 'actions',
            dataIndex: 'actions',
            align: 'center',
            fixed:'right',
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
    
    const contextSale = (record) => {
        return (
            <div className='context-menu-wrapper'>
                <div className="item" onClick={() => {
                    setActionMethod({orderId: record.orderId, actionType: 'detail', orderType: 'sale', openIndex: -1})
                }}>
                    <BiCommentDetail size={25} className='icon'/>
                    <span>Chi tiết đơn hàng</span>
                </div>
                <div className="item" onClick={() => {
                    handlePaymentSale({orderId: record.orderId, actionType: 'deposit', orderType: 'sale', openIndex: -1})
                }} >
                    <MdOutlinePayments size={25} className='icon'/>
                    <span>Thanh toán cọc bằng Momo</span>
                </div>
                <div className="item" onClick={() => {
                    handlePaymentSale({orderId: record.orderId, actionType: 'remaining', orderType: 'sale', openIndex: -1})
                }} >
                    <MdOutlinePayments size={25} className='icon'/>
                    <span>Thanh toán đơn hàng bằng Momo</span>
                </div>
            </div>
        )
    }
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
            orderCode: x.orderCode
        }))
    }, [saleOrders])
    const ColumnRentOrder: ColumnsType<any> = [
        {
            title: 'Mã đơn hàng',
            key: 'orderCode',
            dataIndex: 'orderCode',
            align: 'center',
            fixed: 'left',
            width: 170,
            render: (v) => (v)
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
            align: 'center',
            render: (v) => (<MoneyFormat value={v} />)
        },
        {
            title: 'Tiền cọc',
            key: 'deposit',
            dataIndex: 'deposit',
            align: 'center',
            render: (v) => (<MoneyFormat value={v} />)
        },
        {
            title: 'Tiền cần trả',
            key: 'remainMoney',
            dataIndex: 'remainMoney',
            align: 'center',
            render: (v) => (<MoneyFormat value={v} />)
        },
        {
            title: 'Tổng đơn hàng',
            key: 'totalPrice',
            dataIndex: 'totalPrice',
            align: 'center',
            render: (v) => (<MoneyFormat value={v} />)
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
    const contextRent = (record) => {
        return (
            <div className='context-menu-wrapper'>
                <div className="item" onClick={() => {
                    setActionMethod({orderId: record.orderId, actionType: 'detail', orderType: 'rent', openIndex: -1})
                }}>
                    <BiCommentDetail size={25} className='icon'/>
                    <span>Chi tiết đơn hàng</span>
                </div>
                <div className="item" onClick={() => navigate(`/order-group/${record.groupID}`)}>
                    <BiDetail size={25} className='icon'/>
                    <span>Xem nhóm đơn hàng</span>
                </div>
                <div className="item" onClick={() => {
                    handlePaymentRent({orderId: record.orderId, actionType: 'deposit', orderType: 'rent', openIndex: -1})
                }} >
                    <MdOutlinePayments size={25} className='icon'/>
                    <span>Thanh toán cọc bằng Momo</span>
                </div>
                <div className="item" onClick={() => {
                    handlePaymentRent({orderId: record.orderId, actionType: 'remaining', orderType: 'rent', openIndex: -1})
                }} >
                    <MdOutlinePayments size={25} className='icon'/>
                    <span>Thanh toán đơn hàng bằng Momo</span>
                </div>
            </div>
        )
    }
    const DataSourceRentOrder = useMemo(() =>{
        return rentOrders.map((x, index) => ({
            key: String(index + 1),
            orderId: x.rentOrderList[0].id,
            groupID: x.id,
            totalPrice: x.totalGroupAmount,
            startDateRent: x.rentOrderList[0].startDateRent,
            endDateRent: x.rentOrderList[0].endDateRent,
            status: x.rentOrderList[0].status,
            remainMoney: x.rentOrderList[0].remainMoney,
            deposit: x.rentOrderList[0].deposit,
            orderCode: x.rentOrderList[0].orderCode,
            transportFee: x.rentOrderList[0].transportFee
        }))
    }, [rentOrders])

    const handleChangeSegment = (value: string | number) =>{
        navigate('/orders?page=1')
        switch(value){
            case 'Thuê': return setPageType('rent')
            case 'Bán': return setPageType('sale')
            default: setPageType('service')
        }
    }

    const handleCancel = () =>{
        setActionMethod(undefined)
    }
    return (
        <div>
            <LandingHeader />
            <div className="main-content-not-home">
                <div className="container-wrapper co-wrapper">
                    <HeaderInfor title='Quản lý đơn hàng của bạn' />
                    <section className="default-layout">
                        <h3 style={{marginBottom: '5px'}}>Loại đơn hàng</h3>
                        <Segmented size="large" onChange={handleChangeSegment} options={['Thuê', 'Bán', 'Dịch vụ']} />
                    </section>
                    {
                        pageType === 'rent' &&
                        <section className="co-box default-layout">
                            <Table 
                                className='cart-table' 
                                dataSource={DataSourceRentOrder} 
                                columns={ColumnRentOrder} 
                                scroll={{x: 1500}}
                                pagination={{
                                    current: paging.curPage,
                                    pageSize: paging.pageSize,
                                    total: paging.recordCount,
                                    onChange: (page: number) =>{
                                        navigate(`/orders?page=${page}`)
                                    }
                                }}
                            />
                        </section>
                    }
                    {
                        pageType === 'sale' &&
                        <section className="co-box default-layout">
                            <Table 
                                className='cart-table' 
                                dataSource={DataSourceSaleOrder} 
                                columns={ColumnSaleOrder} 
                                scroll={{x: 1500}}
                                pagination={{
                                    current: paging.curPage,
                                    pageSize: paging.pageSize,
                                    total: paging.recordCount,
                                    onChange: (page: number) =>{
                                        navigate(`/orders?page=${page}`)
                                    }
                                }}
                            />
                        </section>
                    }
                </div>
            </div>
            <LandingFooter />
            {
                (actionMethod?.actionType === 'detail' && actionMethod.orderType === 'sale') && 
                <ModalClientSaleOrderDetai
                    saleOrderList={saleOrders.filter(x => x.id === actionMethod.orderId)[0]}
                    onClose={handleCancel}
                />
            }
            {
                (actionMethod?.actionType === 'detail' && actionMethod.orderType === 'rent') &&
                <ModalClientRentOrderDetai
                    onClose={handleCancel}
                    rentOrderList={rentOrders.filter(x => x.rentOrderList[0].id === actionMethod.orderId)[0].rentOrderList[0]}
                />
            }
        </div>
    );
}

export default ClientOrder;