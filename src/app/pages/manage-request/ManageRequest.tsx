import { Popover } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import HeaderInfor from 'app/components/header-infor/HeaderInfor'
import Transport from 'app/components/renderer/transport/Transport'
import ServiceStatusComp from 'app/components/status/ServiceStatusComp'
import UserInforTable from 'app/components/user-infor/UserInforTable'
import useSelector from 'app/hooks/use-selector'
import { Paging } from 'app/models/paging'
import { PaymentControlState } from 'app/models/payment'
import { Service, ServiceRequest } from 'app/models/service'
import serviceService from 'app/services/service.service'
import CONSTANT from 'app/utils/constant'
import utilDateTime from 'app/utils/date-time'
import pagingPath from 'app/utils/paging-path'
import React, { useEffect, useMemo, useState } from 'react'
import { BiDetail } from 'react-icons/bi'
import { GrMore } from 'react-icons/gr'
import { useNavigate, useSearchParams } from 'react-router-dom'
import './style.scss'
import UpdateConfirmServiceDetail from 'app/components/modal/update-confirm-service-detail/UpdateConfirmServiceDetail'
import { ShippingFee } from 'app/models/shipping-fee'
import useDispatch from 'app/hooks/use-dispatch'
import shippingFeeService from 'app/services/shipping-fee.service'
import { setNoti } from 'app/slices/notification'
import Searching from 'app/components/search-and-filter/search/Searching'

const ManageRequest: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { user } = useSelector(state => state.userInfor)
    const { search } = useSelector(state => state.SearchFilter)

    const [requests, setRequests] = useState<ServiceRequest[]>([])
    const [paging, setPaging] = useState<Partial<Paging>>({curPage: 1, pageSize: CONSTANT.PAGING_ITEMS.REQUEST})

    const [loading, setLoading] = useState(false)
    const [actionMethod, setActionMethod] = useState<PaymentControlState>()
    const [shipping, setShipping] = useState<ShippingFee[]>([])

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
            setPaging({curPage: 1, pageSize: CONSTANT.PAGING_ITEMS.REQUEST})
            return navigate('/panel/manage-request?page=1', { replace: true })
        }
        
        if(search.isSearching && search.orderCode){
            const init = async () =>{
                setLoading(true)
                try{
                    const res = await serviceService.getRequestOrderByServiceCode({curPage: Number(currentPage), pageSize: paging.pageSize}, user.id, search.orderCode || '')
                    setRequests(res.data.requestList)
                    setPaging(res.data.paging)
                }catch{

                }
                setLoading(false)
            }
            init();
        }else{
            const init = async () =>{
                if(!user.id) return;

                setLoading(true)

                const res = await serviceService.getRequestOrderByTechnician({curPage: Number(currentPage), pageSize: paging.pageSize}, user.id)
                setRequests(res.data.requestList)
                setPaging(res.data.paging)
                
                setLoading(false)
            }
            init()
        }

    }, [navigate, searchParams, user, paging.pageSize, search.isSearching, search.orderCode])

    const ColumnServiceOrder: ColumnsType<any> = [
        {
            title: 'Mã đơn hàng',
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
            render: (v) => (<ServiceStatusComp status={v} />)
        },
        {
            title: 'Nơi chăm sóc',
            key: 'isTransport',
            dataIndex: 'isTransport',
            render: (v) => (<Transport isTransport={v} isRequest minWidth={130} />)
        },
        {
            title: 'Tổng số cây',
            key: 'totalQuantity',
            dataIndex: 'totalQuantity',
            render: (v) => <p style={{minWidth: 80}}>{v}</p>
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
                <div className="item" onClick={() => {
                    setActionMethod({orderId: record.id, actionType: 'detail', orderType: 'service', openIndex: -1})
                }}>
                    <BiDetail size={25} className='icon'/>
                    <span>Chi tiết dịch vụ</span>
                </div>
            </div>
        )
    }

    const calTotalQuantity = (data: ServiceRequest) =>{
        let count = 0;
        for (const item of data.serviceDetailList) {
            count += item.quantity
        }
        return count
    }

    const DataSourceServiceOrder = useMemo(() =>{
        return requests.map((x, index) => ({
            key: String(index + 1),
            ...x,
            totalQuantity: calTotalQuantity(x),
        }))
    }, [requests])

    const ServiceSelect = useMemo(() =>{
        const [request] = requests.filter(x => x.id === actionMethod?.orderId)
        if(!request) return;

        const { id, address, createDate, districtID, email, endDate, isTransport, name, phone,
        rewardPointUsed, rules, serviceCode, serviceDetailList, startDate, status, technician, technicianName,
        transportFee, user, userCurrentPoint, cancelBy, nameCancelBy, reason, serviceOrderID, takecareComboOrder } = request

        const data: Service = {
            address, cancelBy, createDate, districtID, email, endDate, id, isTransport, name, nameCancelBy,
            phone, reason, rewardPointUsed, rules, serviceCode, serviceDetailList, serviceOrderID, startDate,
            status, technicianID: technician.technicianID, technicianName, transportFee, userCurrentPoint, userId: user.id,
            takecareComboOrder
        }

        return data

    }, [actionMethod?.orderId, requests])
    
    const handleClose = () =>{
        setActionMethod(undefined)
    }

    return (
        <div className='mr-wrapper'>
            <HeaderInfor title='Yêu cầu chăm sóc cây tự chọn' />
            <Searching 
                isOrderCode
                defaultUrl={`/panel/manage-request?page=1`}
            />
            <section className="default-layout">
                <Table
                    className='table' 
                    columns={ColumnServiceOrder} 
                    dataSource={DataSourceServiceOrder} 
                    scroll={{x: 480 }}
                    pagination={{
                        current: paging.curPage,
                        pageSize: paging.pageSize,
                        total: paging.recordCount,
                        onChange: (page: number) =>{
                            navigate(`/panel/manage-request?page=${page}`)
                        }
                    }}
                    loading={loading}
                />
            </section>
            {
                (actionMethod?.actionType === 'detail' && ServiceSelect) &&
                <UpdateConfirmServiceDetail
                    service={ServiceSelect}
                    shipping={shipping}
                    isOnlyView
                    onClose={handleClose}
                    onSubmit={handleClose}
                />
            }
        </div>
    )
}

export default ManageRequest