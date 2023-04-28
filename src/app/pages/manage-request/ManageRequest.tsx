import { Popover } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import HeaderInfor from 'app/components/header-infor/HeaderInfor'
import Transport from 'app/components/renderer/transport/Transport'
import ServiceStatusComp from 'app/components/status/ServiceStatusComp'
import UserInforTable from 'app/components/user-infor/UserInforTable'
import useSelector from 'app/hooks/use-selector'
import { Paging } from 'app/models/paging'
import { PaymentControlState } from 'app/models/payment'
import { ServiceRequest } from 'app/models/service'
import serviceService from 'app/services/service.service'
import CONSTANT from 'app/utils/constant'
import utilDateTime from 'app/utils/date-time'
import pagingPath from 'app/utils/paging-path'
import React, { useEffect, useMemo, useState } from 'react'
import { BiDetail } from 'react-icons/bi'
import { GrMore } from 'react-icons/gr'
import { useNavigate, useSearchParams } from 'react-router-dom'
import './style.scss'

const ManageRequest: React.FC = () => {
    // const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { user } = useSelector(state => state.userInfor)

    const [requests, setRequests] = useState<ServiceRequest[]>([])
    const [paging, setPaging] = useState<Partial<Paging>>({curPage: 1, pageSize: CONSTANT.PAGING_ITEMS.REQUEST})

    const [loading, setLoading] = useState(false)
    const [actionMethod, setActionMethod] = useState<PaymentControlState>()

    useEffect(() =>{
        setLoading(true)
        pagingPath.scrollTop()
        const currentPage = searchParams.get('page');
        if(!pagingPath.isValidPaging(currentPage)){
            setPaging({curPage: 1, pageSize: CONSTANT.PAGING_ITEMS.REQUEST})
            return navigate('/panel/manage-request?page=1')
        }

        const init = async () =>{
            if(!user.id) return;
            const res = await serviceService.getRequestOrderByTechnician({curPage: Number(currentPage), pageSize: paging.pageSize}, user.id)
            setRequests(res.data.requestList)
            setPaging(res.data.paging)
        }
        init()
        setLoading(false)
    }, [navigate, searchParams, user, paging.pageSize])

    const ColumnServiceOrder: ColumnsType<any> = [
        {
            title: 'Mã dịch vụ',
            key: 'serviceCode',
            dataIndex: 'serviceCode',
            fixed: 'left'
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
            render: (v) => (<Transport isTransport={v} isRequest />)
        },
        {
            title: 'Tổng số cây',
            key: 'totalQuantity',
            dataIndex: 'totalQuantity',
        },
        {
            title: 'Xử lý',
            key: 'action',
            dataIndex: 'action',
            align: 'center',
            fixed: 'right',
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
                        <GrMore size={25} cursor='pointer' color='#00a76f' />
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

    return (
        <div className='mr-wrapper'>
            <HeaderInfor title='Yêu cầu chăm sóc' />
            <section className="default-layout">
                <Table
                    className='table' 
                    columns={ColumnServiceOrder} 
                    dataSource={DataSourceServiceOrder} 
                    scroll={{ y: 680, x: 2000 }}
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
        </div>
    )
}

export default ManageRequest