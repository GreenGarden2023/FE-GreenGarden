import { Popover } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import LandingFooter from 'app/components/footer/LandingFooter'
import HeaderInfor from 'app/components/header-infor/HeaderInfor'
import LandingHeader from 'app/components/header/LandingHeader'
import TechnicianName from 'app/components/renderer/technician/TechnicianName'
import { PaymentControlState } from 'app/models/payment'
import { Service, ServiceDetailList } from 'app/models/service'
import serviceService from 'app/services/service.service'
import utilDateTime from 'app/utils/date-time'
import React, { useEffect, useMemo, useState } from 'react'
import { BiCommentDetail } from 'react-icons/bi'
import { GrMore } from 'react-icons/gr'
import { MdCancelPresentation } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import CancelOrder from 'app/components/modal/cancel-order/CancelOrder'
import ServiceStatusComp from 'app/components/status/ServiceStatusComp'
import useDispatch from 'app/hooks/use-dispatch'
import { setNoti } from 'app/slices/notification'
import CONSTANT from 'app/utils/constant'
import LoadingView from 'app/components/loading-view/LoadingView'
import NoProduct from 'app/components/no-product/NoProduct'

const ClientManageTakeCareService: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [services, setServices] = useState<Service[]>([])
    const [actionMethod, setActionMethod] = useState<PaymentControlState>()
    const [loading, setLoading] = useState(true)

    useEffect(() =>{
        const init = async () =>{
            setLoading(true)
            try{
                const res = await serviceService.getUserServiceRequest()
                setServices(res.data)
            }catch{
                dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
            }
            setLoading(false)
        }
        init()
    }, [dispatch])

    const Column: ColumnsType<any> = [
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
            render: (v) => (<ServiceStatusComp status={v} />)
        },
        {
            title: 'Người chăm sóc',
            key: 'technicianName',
            dataIndex: 'technicianName',
            render: (v) => (<TechnicianName name={v} />)
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
                    // handleAction({orderId: record.id, actionType: 'detail', orderType: 'service', openIndex: -1})
                    navigate(`/take-care-service/me/${record.id}`)
                }}>
                    <BiCommentDetail size={25} className='icon'/>
                    <span>Chi tiết yêu cầu</span>
                </div>
                {
                    record.status === 'processing' &&
                    <div className="item" onClick={() => {
                        setActionMethod({orderId: record.id, actionType: 'cancel', orderType: 'service', openIndex: -1})
                    }}>
                        <MdCancelPresentation size={25} className='icon'/>
                        <span>Hủy yêu cầu</span>
                    </div>
                }
                {
                    record.serviceOrderID !== '00000000-0000-0000-0000-000000000000' &&
                    <div className="item" onClick={() => {
                        navigate(`/order/service/${record.serviceOrderID}`)
                        // handleAction({orderId: record.id, actionType: 'detail', orderType: 'service', openIndex: -1})
                    }}>
                        <BiCommentDetail size={25} className='icon'/>
                        <span>Xem đơn hàng</span>
                    </div>
                }
            </div>
        )
    }
    const calTotalQuantity = (data: ServiceDetailList[]) =>{
        let count = 0;
        for (const item of data) {
            count += item.quantity
        }
        return count
    }
    const DataSource = useMemo(() =>{
        return services.map((x, index) => ({
            key: String(index + 1),
            ...x,
            totalQuantity: calTotalQuantity(x.serviceDetailList),
        }))
    }, [services])

    const onCloseModal = () =>{
        setActionMethod(undefined)
    }

    const handleCancelRequest = (reason: string, canceledBy: string) =>{
        const [servcice] = services.filter(x => x.id === actionMethod?.orderId)

        servcice.status = 'cancel'
        servcice.reason = reason
        servcice.nameCancelBy = canceledBy
        setServices([...services])
    }

    return (
        <div>
            <LandingHeader />
                <div className="main-content-not-home">
                    <div className="container-wrapper cmtcs-wrapper">
                        <HeaderInfor title='Yêu cầu chăm sóc cây của bạn' />
                        {
                            loading ? <LoadingView loading /> :
                            <>
                                {
                                    services.length === 0 ? <NoProduct /> :
                                    <div className="default-layout">
                                        <Table columns={Column} dataSource={DataSource} scroll={{x: 1500}} />
                                    </div>
                                }
                            </>
                        }
                    </div>
                </div>
            <LandingFooter />
            {
                actionMethod?.actionType === 'cancel' &&
                <CancelOrder
                    orderId={services.filter(x => x.id === actionMethod?.orderId)[0].id}
                    orderCode={services.filter(x => x.id === actionMethod?.orderId)[0].serviceCode}
                    orderType='request'
                    onClose={onCloseModal}
                    onSubmit={handleCancelRequest}
                />
            }
        </div>
    )
}

export default ClientManageTakeCareService