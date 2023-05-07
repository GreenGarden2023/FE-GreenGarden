import { Popover } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import HeaderInfor from 'app/components/header-infor/HeaderInfor'
import MoneyFormat from 'app/components/money/MoneyFormat'
import Filtering from 'app/components/search-and-filter/filter/Filtering'
import OrderStatusComp from 'app/components/status/OrderStatusComp'
import UserInforTable from 'app/components/user-infor/UserInforTable'
import useSelector from 'app/hooks/use-selector'
import { Paging } from 'app/models/paging'
import { PaymentControlState } from 'app/models/payment'
import { ServiceDetailList, ServiceOrderList } from 'app/models/service'
import orderService from 'app/services/order.service'
import CONSTANT from 'app/utils/constant'
import utilDateTime from 'app/utils/date-time'
import pagingPath from 'app/utils/paging-path'
import React, { useEffect, useMemo, useState } from 'react'
import { BiCommentDetail } from 'react-icons/bi'
import { GrMore } from 'react-icons/gr'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'

const TechManageServiceOrder: React.FC = () => {
    // const dispatch = useDispatch()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams();
    const {user} = useSelector(state => state.userInfor)
    const { filter } = useSelector(state => state.SearchFilter)

    // data
    const [serviceOrders, setServiceOrders] = useState<ServiceOrderList[]>([])
    const [paging, setPaging] = useState<Partial<Paging>>({curPage: 1, pageSize: CONSTANT.PAGING_ITEMS.REQUEST})

    // action
    const [loading, setLoading] = useState(false)
    const [actionMethod, setActionMethod] = useState<PaymentControlState>()

    useEffect(() =>{
        
        pagingPath.scrollTop()
        const currentPage = searchParams.get('page');
        if(!pagingPath.isValidPaging(currentPage)){
            setPaging({curPage: 1, pageSize: CONSTANT.PAGING_ITEMS.REQUEST})
            return navigate('/panel/take-care-order-assigned?page=1', { replace: true })
        }

        if(filter.isFiltering && filter.takeCareStatus){
            const init = async () =>{
                try{
                    if(!user.id || !filter.takeCareStatus) return;
    
                    setLoading(true)
                    const res = await orderService.getServiceOrdersByTechnicianToday(user.id, filter.takeCareStatus, {curPage: Number(currentPage), pageSize: paging.pageSize})
                    setServiceOrders(res.data.serviceOrderList)
                    setPaging(res.data.paging)
                }catch{
    
                }
                setLoading(false)
            }
            init()
        }else{
            const init = async () =>{
                try{
                    if(!user.id) return;
    
                    setLoading(true)
                    const res = await orderService.getServiceOrdersByTechnician(user.id, {curPage: Number(currentPage), pageSize: paging.pageSize})
                    setServiceOrders(res.data.serviceOrderList)
                    setPaging(res.data.paging)
                }catch{
    
                }
                setLoading(false)
            }
            init()
        }

    }, [user.id, paging.pageSize, navigate, searchParams, filter])

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
            title: 'Trạng thái',
            key: 'status',
            dataIndex: 'status',
            width: 200,
            render: (v) => (<OrderStatusComp status={v} />)
        },
        {
            title: 'Số lượng cây',
            key: 'totalQuantity',
            dataIndex: 'totalQuantity',
            render: (v) => <p style={{minWidth: 80}}>{v}</p>
        },
        {
            title: 'Tổng tiền',
            key: 'totalPrice',
            dataIndex: 'totalPrice',
            align: 'right',
            render: (v) => <MoneyFormat value={v} color='Blue' isHighlight />
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
                        <GrMore size={25} cursor='pointer' color='#00a76f' style={{minWidth: 80}} />
                    </Popover>
            )
        },
    ]
    const contextService = (record) =>{
        return (
            <div className='context-menu-wrapper'>
                <Link to={`/panel/take-care-order-assigned/${record.orderId}`} target='_blank' >
                    <div className="item" onClick={() => {
                        setActionMethod(undefined)
                        // handleAction({orderId: record.orderId, actionType: 'detail', orderType: 'service', openIndex: -1})
                        // navigate(`/panel/take-care-order-assigned/${record.orderId}`)
                    }}>
                        <BiCommentDetail size={25} className='icon'/>
                        <span>Chi tiết đơn hàng</span>
                    </div>
                    {/* <BiCommentDetail size={25} className='icon'/>
                    <span>Chi tiết đơn hàng</span> */}
                </Link>
                {/* <div className="item" onClick={() => {
                    // handleAction({orderId: record.orderId, actionType: 'detail', orderType: 'service', openIndex: -1})
                    navigate(`/panel/take-care-order-assigned/${record.orderId}`)
                }}>
                    <BiCommentDetail size={25} className='icon'/>
                    <span>Chi tiết đơn hàng</span>
                </div> */}
            </div>
        )
    }
    // const handleAction = (data: PaymentControlState) =>{
    //     const { actionType, orderId } = data
    //     console.log(orderId)
    //     const [order] = serviceOrders.filter(x => x.id === orderId)

    //     if(actionType === 'deposit'){
    //         switch(order.status){
    //             case 'cancel': return dispatch(setNoti({type: 'info', message: 'Không thể thanh toán tiền cọc cho đơn hàng đã bị hủy'}))
    //             case 'completed': 
    //             case 'paid': 
    //             case 'ready': return dispatch(setNoti({type: 'info', message: 'Không thể thanh toán tiền cọc cho đơn hàng đã thanh toán'}))
    //         }
    //     }
    //     if(actionType === 'remaining'){
    //         switch(order.status){
    //             case 'cancel': return dispatch(setNoti({type: 'info', message: 'Không thể thanh toán tổng tiền cho đơn hàng đã bị hủy'}))
    //             case 'completed': 
    //             case 'paid': return dispatch(setNoti({type: 'info', message: 'Không thể thanh toán tổng tiền cho đơn hàng đã thanh toán'}))
    //         }
    //     }
    //     setActionMethod(data)
    // }
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

    return (
        <div className='tmso-wrapper'>
            <HeaderInfor title='Quản lý những yêu cầu chăm sóc cây của bạn' />
            <Filtering 
                isOrderToDay
            />
            <section className="default-layout">
                <Table
                    className='table' 
                    columns={ColumnServiceOrder} 
                    dataSource={DataSourceServiceOrder} 
                    scroll={{ x: 480 }}
                    loading={loading}
                    pagination={{
                        current: paging.curPage,
                        pageSize: paging.pageSize,
                        total: paging.recordCount,
                        onChange: (page: number) =>{
                            navigate(`/panel/take-care-order-assigned?page=${page}`)
                        }
                    }}
                />
            </section>
        </div>
    )
}

export default TechManageServiceOrder