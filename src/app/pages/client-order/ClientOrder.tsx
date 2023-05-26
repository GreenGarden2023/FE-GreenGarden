import { Popover, Segmented } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import LandingFooter from 'app/components/footer/LandingFooter';
import HeaderInfor from 'app/components/header-infor/HeaderInfor';
import LandingHeader from 'app/components/header/LandingHeader';
import CancelOrder from 'app/components/modal/cancel-order/CancelOrder';
import ClientExtendOrder from 'app/components/modal/client-extend-order/ClientExtendOrder';
import ModalClientRentOrderDetai from 'app/components/modal/client-rent-order-detail/ModalClientRentOrderDetai';
import ModalClientSaleOrderDetai from 'app/components/modal/client-sale-order-detail/ModalClientSaleOrderDetai';
import MoneyFormat from 'app/components/money/MoneyFormat';
import TechnicianName from 'app/components/renderer/technician/TechnicianName';
import useDispatch from 'app/hooks/use-dispatch';
import useSelector from 'app/hooks/use-selector';
import { RentOrder, SaleOrderList } from 'app/models/order';
import { Paging } from 'app/models/paging';
import { PaymentControlState } from 'app/models/payment';
import { ServiceDetailList, ServiceOrderList } from 'app/models/service';
import { ShippingFee } from 'app/models/shipping-fee';
import orderService from 'app/services/order.service';
import paymentService from 'app/services/payment.service';
import shippingFeeService from 'app/services/shipping-fee.service';
import { setNoti } from 'app/slices/notification';
import CONSTANT from 'app/utils/constant';
import utilDateTime from 'app/utils/date-time';
import pagingPath from 'app/utils/paging-path';
import React, { useEffect, useMemo, useState } from 'react';
import { BiCommentDetail, BiDetail } from 'react-icons/bi';
import { GrMore } from 'react-icons/gr';
import { MdCancelPresentation, MdFeedback, MdOutlinePayment, MdOutlinePayments } from 'react-icons/md';
import { SiGitextensions } from 'react-icons/si';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './style.scss';
import { setTitle } from 'app/slices/window-title';
import OrderStatusComp from 'app/components/status/OrderStatusComp';
import { FaLayerGroup } from 'react-icons/fa';
import LoadingView from 'app/components/loading-view/LoadingView';
import ClientPackageOrder from 'app/components/client-package-order/ClientPackageOrder';

type OrderPage = 'rent' | 'sale' | 'service' | 'package'

const ClientOrder: React.FC = () =>{
    const userState = useSelector(state => state.userInfor)
    const { id } = userState.user
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
    const [serviceOrders, setServiceOrders] = useState<ServiceOrderList[]>([])

    const [paging, setPaging] = useState<Partial<Paging>>({curPage: 1, pageSize: CONSTANT.PAGING_ITEMS.CLIENT_ORDER_RENT})

    const [shipping, setShipping] = useState<ShippingFee[]>([])

    const [loading, setLoading] = useState(false)

    const [isMobile, setIsMobile] = useState(true)

    useEffect(() =>{
        const handler = () =>{
            if(window.innerWidth <= 480){
                setIsMobile(true)
            }else{
                setIsMobile(false)
            }
        }
        handler()
        window.addEventListener('resize', handler)

        return () => window.removeEventListener('resize', handler)
    }, [])

    useEffect(() =>{
        dispatch(setTitle(`${CONSTANT.APP_NAME} | Đơn hàng`))

        const orderType = localStorage.getItem('order-type') as OrderPage
        if(!orderType) {
            localStorage.setItem('order-type', 'rent')
            return;
        }
        setPageType(orderType)
    }, [dispatch])

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

        if(!pagingPath.isValidPaging(currentPage)) return;

        const init = async () =>{
            setLoading(true)
            try{
                const res = await orderService.getSaleOrders({curPage: Number(currentPage), pageSize: paging.pageSize})
                setSaleOrders(res.data.saleOrderList)
                setPaging(res.data.paging)
            }catch{
                dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
            }
            setLoading(false)
        }
        init()
    }, [id, dispatch, pageType, searchParams, paging.pageSize])

    useEffect(() =>{
        if(pageType !== 'service') return;
        const currentPage = searchParams.get('page');

        if(!pagingPath.isValidPaging(currentPage)) return;
        
        const init = async () =>{
            setLoading(true)
            try{
                const res = await orderService.getServiceOrders({curPage: Number(currentPage), pageSize: CONSTANT.PAGING_ITEMS.CLIENT_ORDER_RENT})
                setServiceOrders(res.data.serviceOrderList)
                setPaging(res.data.paging)
            }catch{
                dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
            }
            setLoading(false)
        }
        init()
    }, [pageType, searchParams, dispatch])

    useEffect(() =>{
        if(!id) return;
        if(pageType !== 'rent') return;
        const currentPage = searchParams.get('page');
        if(!Number(currentPage)) return;

        const init = async () =>{
            setLoading(true)
            try{
                const res = await orderService.getRentOrders({curPage: Number(currentPage), pageSize: paging.pageSize})
                setRentOrders(res.data.rentOrderGroups)
                setPaging(res.data.paging)
            }catch{
                dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
            }
            setLoading(false)
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
            width: 200,
            render: (v) => (<OrderStatusComp status={v} />)
        },
        {
            title: 'Phí vận chuyển',
            key: 'transportFee',
            dataIndex: 'transportFee',
            align: 'right',
            render: (v) => (<MoneyFormat value={v} color='Default' minWidth={130} />)
        },
        {
            title: 'Tiền cọc',
            key: 'deposit',
            dataIndex: 'deposit',
            align: 'right',
            render: (v) => (<MoneyFormat value={v} color='Orange' minWidth={130} />)
        },
        {
            title: 'Tiền được giảm',
            key: 'discountAmount',
            dataIndex: 'discountAmount',
            align: 'right',
            render: (v) => (<MoneyFormat value={v} color='Yellow' minWidth={130} />)
        },
        {
            title: 'Tổng đơn hàng',
            key: 'totalPrice',
            dataIndex: 'totalPrice',
            align: 'right',
            render: (v) => (<MoneyFormat value={v} color='Light Blue' minWidth={130} />)
        },
        {
            title: 'Số tiền cần trả',
            key: 'remainMoney',
            dataIndex: 'remainMoney',
            align: 'right',
            render: (v) => (<MoneyFormat value={v} color='Blue' minWidth={130} />)
        },
        {
            title: 'Xử lý',
            key: 'actions',
            dataIndex: 'actions',
            align: 'center',
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
                    <GrMore size={25} cursor='pointer' color='#00a76f' style={{minWidth: '100px'}} />
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
                    <BiDetail size={25} className='icon'/>
                    <span>Chi tiết đơn hàng</span>
                </div>
                {
                    (record.status === 'unpaid' && record.deposit !== 0) &&
                    <div className="item" onClick={() => {
                        handlePaymentSale({orderId: record.orderId, actionType: 'deposit', orderType: 'sale', openIndex: -1})
                    }} >
                        <MdOutlinePayments size={25} className='icon'/>
                        <span>Thanh toán cọc bằng Momo</span>
                    </div>
                }
                {
                    (record.status === 'unpaid' || record.status === 'ready') &&
                    <div className="item" onClick={() => {
                        handlePaymentSale({orderId: record.orderId, actionType: 'remaining', orderType: 'sale', openIndex: -1})
                    }} >
                        <MdOutlinePayment size={25} className='icon'/>
                        <span>Thanh toán đơn hàng bằng Momo</span>
                    </div>
                }
                {
                    record.status === 'completed' &&
                    <div className="item" onClick={() => navigate(`/order/sale/feedback/${record.orderId}`)} >
                        <MdFeedback size={25} className='icon'/>
                        <span>Đánh giá</span>
                    </div>
                }
                {
                    record.status === 'unpaid' &&
                    <div className="item" onClick={() => {
                        setActionMethod({orderId: record.orderId, actionType: 'cancel', orderType: 'sale', openIndex: -1})
                    }} >
                        <MdCancelPresentation size={25} className='icon'/>
                        <span>Hủy đơn hàng</span>
                    </div>
                }
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
            orderCode: x.orderCode,
            discountAmount: x.discountAmount
        }))
    }, [saleOrders])
    const ColumnRentOrder: ColumnsType<any> = [
        {
            title: 'Mã đơn hàng',
            key: 'orderCode',
            dataIndex: 'orderCode',
            align: 'center',
            width: 170,
            render: (v) => (v)
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
            render: (v) => (<OrderStatusComp status={v} />)
        },
        {
            title: "Số lượng đơn hàng",
            key: "numberOfOrder",
            dataIndex: "numberOfOrder",
            render: (v) => <p style={{minWidth: '70px'}}>{v}</p>
        },
        {
            title: 'Phí vận chuyển',
            key: 'transportFee',
            dataIndex: 'transportFee',
            align: 'right',
            render: (v) => (<MoneyFormat value={v} color='Default' minWidth={130} />)
        },
        {
            title: 'Tiền cọc',
            key: 'deposit',
            dataIndex: 'deposit',
            align: 'right',
            render: (v) => (<MoneyFormat value={v} color='Orange' minWidth={130} />)
        },
        {
            title: 'Tiền được giảm',
            key: 'discountAmount',
            dataIndex: 'discountAmount',
            align: 'right',
            render: (v) => (<MoneyFormat value={v} color='Yellow' minWidth={130} />)
        },
        {
            title: 'Giá trị đơn hàng',
            key: 'totalPrice',
            dataIndex: 'totalPrice',
            align: 'right',
            render: (v) => (<MoneyFormat value={v} color='Light Blue' minWidth={130} />)
        },
        {
            title: 'Số tiền cần trả',
            key: 'remainMoney',
            dataIndex: 'remainMoney',
            align: 'right',
            render: (v) => (<MoneyFormat value={v} color='Blue' minWidth={130} />)
        },
        {
            title: 'Xử lý',
            key: 'action',
            dataIndex: 'action',
            align: 'center',
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
                        <GrMore size={25} cursor='pointer' color='#00a76f' style={{minWidth: '100px'}} />
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
                <div className="item" onClick={() => navigate(`/order-group/${record.groupID}/${record.orderId}`)}>
                    <FaLayerGroup size={25} className='icon'/>
                    <span>Xem nhóm đơn hàng</span>
                </div>
                {
                    ((record.status === 'paid' || record.status === 'renting') && utilDateTime.isDisplayExtendRentOrder(record.endDateRent)) && 
                    <div className="item" onClick={() => {
                        setActionMethod({orderId: record.orderId, actionType: 'extend', orderType: 'rent', openIndex: -1})
                    }}>
                        <SiGitextensions size={25} className='icon'/>
                        <span>Gia hạn đơn hàng</span>
                    </div>
                }
                {
                    ((record.status === 'unpaid' && record.deposit !== 0)) &&
                    <div className="item" onClick={() => {
                        handlePaymentRent({orderId: record.orderId, actionType: 'deposit', orderType: 'rent', openIndex: -1})
                    }} >
                        <MdOutlinePayments size={25} className='icon'/>
                        <span>Thanh toán cọc bằng Momo</span>
                    </div>
                }
                {
                    (record.status === 'ready' || record.status === 'unpaid') &&
                    <div className="item" onClick={() => {
                        handlePaymentRent({orderId: record.orderId, actionType: 'remaining', orderType: 'rent', openIndex: -1})
                    }} >
                        <MdOutlinePayment size={25} className='icon'/>
                        <span>Thanh toán đơn hàng bằng Momo</span>
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
        return rentOrders.map((x, index) => ({
            key: String(index + 1),
            orderId: x.rentOrderList[0].id,
            groupID: x.id,
            totalPrice: x.rentOrderList[0].totalPrice,
            startDateRent: x.rentOrderList[0].startRentDate,
            endDateRent: x.rentOrderList[0].endRentDate,
            status: x.rentOrderList[0].status,
            remainMoney: x.rentOrderList[0].status === 'unpaid' ? x.rentOrderList[0].remainMoney + x.rentOrderList[0].deposit : x.rentOrderList[0].remainMoney,
            deposit: x.rentOrderList[0].deposit,
            orderCode: x.rentOrderList[0].orderCode,
            transportFee: x.rentOrderList[0].transportFee,
            discountAmount: x.rentOrderList[0].discountAmount,
            numberOfOrder: x.numberOfOrder
        }))
    }, [rentOrders])

    const handleChangeSegment = (value: string | number) =>{
        navigate('/orders?page=1')
        switch(value){
            case 'rent': 
                localStorage.setItem('order-type', 'rent')
                return setPageType('rent')
            case 'sale': 
                localStorage.setItem('order-type', 'sale')
                return setPageType('sale')
            case 'service':
                localStorage.setItem('order-type', 'service')
                return setPageType('service')
            default: 
                localStorage.setItem('order-type', 'package')
                return setPageType('package')
        }
    }
    const handlePaymentService = async (data: PaymentControlState) =>{
        const { orderId, actionType } = data
        const [order] = serviceOrders.filter(x => x.id === orderId)

        if(actionType === 'deposit' && order.status !== 'unpaid'){
            return dispatch(setNoti({type: 'info', message: CONSTANT.PAYMENT_MESSAGE.PAID_DEPOSIT}))
        }
        if(actionType === 'remaining' && (order.status === 'paid' || order.status === 'completed')){
            return dispatch(setNoti({type: 'info', message: CONSTANT.PAYMENT_MESSAGE.PAID_REMAINING}))
        }

        if(actionType === 'deposit'){
            try{
                const res = await paymentService.depositPaymentMomo(orderId, 'service')
                window.open(res.data.payUrl, '_blank')
            }catch{

            }
        }else if(actionType === 'remaining'){
            try{
                const res = await paymentService.paymentMomo(orderId, order.remainAmount, 'service', order.status === 'unpaid' ? 'whole' : '')
                window.open(res.data.payUrl, '_blank')
            }catch{

            }
        }
    }
    
    const contextService = (record) =>{
        return (
            <div className='context-menu-wrapper'>
                <div className="item" onClick={() => {
                    // setActionMethod({orderId: record.orderId, actionType: 'detail', orderType: 'service', openIndex: -1})
                    navigate(`/order/service/${record.orderId}`)
                }}>
                    <BiDetail size={25} className='icon'/>
                    <span>Chi tiết đơn hàng</span>
                </div>
                {
                    record.status === 'unpaid' &&
                    <div className="item" onClick={() => {
                        handlePaymentService({orderId: record.orderId, actionType: 'deposit', orderType: 'service', openIndex: -1})
                    }} >
                        <MdOutlinePayments size={25} className='icon'/>
                        <span>Thanh toán cọc bằng Momo</span>
                    </div>
                }
                {
                    (record.status === 'unpaid' || record.status === 'ready') && 
                    <div className="item" onClick={() => {
                        handlePaymentService({orderId: record.orderId, actionType: 'remaining', orderType: 'service', openIndex: -1})
                    }} >
                        <MdOutlinePayment size={25} className='icon'/>
                        <span>Thanh toán đơn hàng bằng Momo</span>
                    </div> 
                }
                {
                    record.status === 'unpaid' &&
                    <div className="item" onClick={() => {
                        setActionMethod({orderId: record.orderId, actionType: 'cancel', orderType: 'service', openIndex: -1})
                    }} >
                        <MdCancelPresentation size={25} className='icon'/>
                        <span>Hủy đơn hàng</span>
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
            title: 'Ngày tạo đơn hàng',
            key: 'createDate',
            dataIndex: 'createDate',
            render: (v) => (utilDateTime.dateToString(v))
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
            title: 'Trạng thái',
            key: 'status',
            dataIndex: 'status',
            width: 200,
            render: (v) => (<OrderStatusComp status={v} />)
        },
        {
            title: 'Người chăm sóc',
            key: 'technicianName',
            dataIndex: 'technicianName',
            render: (v) => <TechnicianName name={v} minWidth={100} />
        },
        {
            title: 'Tổng số cây',
            key: 'totalQuantity',
            dataIndex: 'totalQuantity',
            render: (v) => <p style={{minWidth: '70px'}}>{v}</p>
        },
        {
            title: 'Phí vận chuyển',
            key: 'transportFee',
            dataIndex: 'transportFee',
            align: 'right',
            render: (v) => (<MoneyFormat value={v} color='Default' minWidth={130} />)
        },
        {
            title: 'Tiền cọc',
            key: 'deposit',
            dataIndex: 'deposit',
            align: 'right',
            render: (v) => (<MoneyFormat value={v} color='Orange' minWidth={130} />)
        },
        {
            title: 'Tiền được giảm',
            key: 'discountAmount',
            dataIndex: 'discountAmount',
            align: 'right',
            render: (v) => (<MoneyFormat value={v} color='Yellow' minWidth={130} />)
        },
        {
            title: 'Tổng đơn hàng',
            key: 'totalPrice',
            dataIndex: 'totalPrice',
            align: 'right',
            render: (v) => (<MoneyFormat value={v} color='Light Blue' minWidth={130} />)
        },
        {
            title: 'Số tiền cần trả',
            key: 'remainAmount',
            dataIndex: 'remainAmount',
            align: 'right',
            render: (v) => (<MoneyFormat value={v} color='Blue' minWidth={130} />)
        },
        {
            title: 'Xử lý',
            key: 'action',
            dataIndex: 'action',
            align: 'center',
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
                        <GrMore size={25} cursor='pointer' color='#00a76f' style={{minWidth: '100px'}} />
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
        return serviceOrders.map((x, index) => {
            const { id, orderCode, createDate, serviceStartDate, serviceEndDate, technician, transportFee, deposit, remainAmount, totalPrice, discountAmount } = x
            return {
                key: String(index + 1),
                orderId: id,
                orderCode,
                serviceCode: x.service.serviceCode,
                createDate: createDate,
                startDate: serviceStartDate,
                endDate: serviceEndDate,
                status: x.status,
                technicianName: technician.technicianFullName,
                totalQuantity: calTotalQuantity(x.service.serviceDetailList),
                transportFee,
                deposit,
                remainAmount,
                totalPrice,
                discountAmount
            }
        })
    }, [serviceOrders])

    

    const handleCancel = () =>{
        setActionMethod(undefined)
    }
    const handleCancelRentOrder = (reason: string, canceledBy: string) =>{
        const [order] = rentOrders.filter(x => x.rentOrderList[0].id === actionMethod?.orderId)[0].rentOrderList
        order.status = 'cancel'
        order.reason = reason
        order.nameCancelBy = canceledBy
        setRentOrders([...rentOrders])
        handleCancel()
    }
    const handleCancelSaleOrder = (reason: string, canceledBy: string) =>{
        const [order] = saleOrders.filter(x => x.id === actionMethod?.orderId)
        order.status = 'cancel'
        order.reason = reason
        order.nameCancelBy = canceledBy
        setSaleOrders([...saleOrders])
        handleCancel()
    }
    const handleCancelServiceOrder = (reason: string, canceledBy: string) =>{
        const [order] = serviceOrders.filter(x => x.id === actionMethod?.orderId)
        order.status = 'cancel'
        order.reason = reason
        order.nameCancelBy = canceledBy
        setServiceOrders([...serviceOrders])
        handleCancel()
    }
    const handleExtendRentOrder = async () =>{
        handleCancel()
        const currentPage = searchParams.get('page');
        if(!Number(currentPage)) return;

        try{
            const res = await orderService.getRentOrders({curPage: Number(currentPage), pageSize: paging.pageSize})
            setRentOrders(res.data.rentOrderGroups)
            setPaging(res.data.paging)
        }catch{
            dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
        }
    }
    return (
        <div>
            <LandingHeader />
            <div className="main-content-not-home">
                <div className="container-wrapper co-wrapper">
                    <HeaderInfor title='Quản lý đơn hàng của bạn' />
                    <section className="default-layout">
                        <h3 style={{marginBottom: '5px'}}>Loại đơn hàng</h3>
                        <Segmented size="large" value={pageType} onChange={handleChangeSegment} options={[
                            {
                                icon: undefined,
                                value: 'rent',
                                label: 'Thuê'
                            },
                            {
                                icon: undefined,
                                value: 'sale',
                                label: 'Mua'
                            },
                            {
                                icon: undefined,
                                value: 'service',
                                label: isMobile ? 'DV tự chọn' : 'Dịch vụ tự chọn'
                            },
                            {
                                icon: undefined,
                                value: 'package',
                                label: isMobile ? 'DV theo gói' : 'Dịch vụ theo gói'
                            },
                        ]} />
                    </section>
                    {
                        loading ?  <LoadingView loading /> : 
                        <>
                            {
                                pageType === 'rent' &&
                                <section className="co-box default-layout">
                                    <Table 
                                        className='cart-table' 
                                        columns={ColumnRentOrder} 
                                        dataSource={DataSourceRentOrder} 
                                        scroll={{x: 480}}
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
                                        columns={ColumnSaleOrder} 
                                        dataSource={DataSourceSaleOrder} 
                                        scroll={{x: 480}}
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
                                pageType === 'service' &&
                                <section className="co-box default-layout">
                                    <Table 
                                        className='cart-table' 
                                        columns={ColumnServiceOrder} 
                                        dataSource={DataSourceServiceOrder} 
                                        scroll={{x: 480}}
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
                                pageType === 'package' &&
                                <ClientPackageOrder />
                            }
                        </>
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
            {/* {
                (actionMethod?.actionType === 'detail' && actionMethod.orderType === 'service') && 
                <ClientServiceOrderDetail
                    onClose={handleCancel}
                    serviceDetailList={serviceOrders.filter(x => x.id === actionMethod.orderId)[0].serviceDetailList}
                />
            } */}
            {
                (actionMethod?.actionType === 'extend') &&
                <ClientExtendOrder
                    rentOrderList={rentOrders.filter(x => x.rentOrderList[0].id === actionMethod.orderId)[0].rentOrderList[0]}
                    shipping={shipping}
                    onClose={handleCancel}
                    onExtend={handleExtendRentOrder}
                /> 
            }
            {
                (actionMethod?.actionType === 'cancel' && actionMethod.orderType === 'rent') &&
                <CancelOrder 
                    onClose={handleCancel}
                    onSubmit={handleCancelRentOrder}
                    orderCode={rentOrders.filter(x => x.rentOrderList[0].id === actionMethod.orderId)[0].rentOrderList[0].orderCode}
                    orderId={rentOrders.filter(x => x.rentOrderList[0].id === actionMethod.orderId)[0].rentOrderList[0].id}
                    orderType='rent'
                />
            }
            {
                (actionMethod?.actionType === 'cancel' && actionMethod.orderType === 'sale') && 
                <CancelOrder 
                    onClose={handleCancel}
                    onSubmit={handleCancelSaleOrder}
                    orderCode={saleOrders.filter(x => x.id === actionMethod.orderId)[0].orderCode}
                    orderId={saleOrders.filter(x => x.id === actionMethod.orderId)[0].id}
                    orderType='sale'
                />
            }
            {
                (actionMethod?.actionType === 'cancel' && actionMethod.orderType === 'service') && 
                <CancelOrder 
                    onClose={handleCancel}
                    onSubmit={handleCancelServiceOrder}
                    orderCode={serviceOrders.filter(x => x.id === actionMethod.orderId)[0].orderCode}
                    orderId={serviceOrders.filter(x => x.id === actionMethod.orderId)[0].id}
                    orderType='service'
                />
            }
        </div>
    );
}

export default ClientOrder;