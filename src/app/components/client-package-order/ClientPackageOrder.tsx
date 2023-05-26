import Table, { ColumnsType } from 'antd/es/table'
import { PackageOrder } from 'app/models/package'
import { Paging } from 'app/models/paging'
import takeComboOrderService from 'app/services/take-combo-order.service'
import CONSTANT from 'app/utils/constant'
import utilDateTime from 'app/utils/date-time'
import pagingPath from 'app/utils/paging-path'
import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import TechnicianName from '../renderer/technician/TechnicianName'
import MoneyFormat from '../money/MoneyFormat'
import { Popover } from 'antd'
import { GrMore } from 'react-icons/gr'
import { PaymentControlState } from 'app/models/payment'
import { BiDetail } from 'react-icons/bi'
import { MdCancelPresentation, MdOutlinePayment, MdOutlinePayments } from 'react-icons/md'
import PackageServiceOrderStatusComp from '../status/PackageServiceOrderStatusComp'
import ClientCancelPackageOrder from './ClientCancelPackageOrder'

const ClientPackageOrder: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // data
    const [pkgOrders, setPkgOrders] = useState<PackageOrder[]>([])
    const [paging, setPaging] = useState<Partial<Paging>>({curPage: 1, pageSize: CONSTANT.PAGING_ITEMS.CLIENT_ORDER_RENT})

    const [actionMethod, setActionMethod] = useState<PaymentControlState>()

    useEffect(() =>{
        pagingPath.scrollTop()
        const currentPage = searchParams.get('page');

        if(!pagingPath.isValidPaging(currentPage)){
            setPaging({curPage: 1, pageSize: CONSTANT.PAGING_ITEMS.CLIENT_ORDER_RENT})
            return navigate('/orders?page=1')
        }

        const init = async () =>{
            try{
                const res = await takeComboOrderService.getAllOrders({curPage: Number(currentPage), pageSize: paging.pageSize}, 'all')
                setPkgOrders(res.data.takecareComboOrderList)
                setPaging(res.data.paging)
            }catch{

            }
        }
        init()
    }, [searchParams, navigate, paging.pageSize])

    const ColumnPackageOrder: ColumnsType<any> = [
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
            key: 'serviceStartDate',
            dataIndex: 'serviceStartDate',
            render: (v) => (utilDateTime.dateToString(v))
        },
        {
            title: 'Ngày kết thúc chăm sóc',
            key: 'serviceEndDate',
            dataIndex: 'serviceEndDate',
            render: (v) => (utilDateTime.dateToString(v))
        },
        {
            title: 'Trạng thái',
            key: 'status',
            dataIndex: 'status',
            width: 200,
            render: (v) => (<PackageServiceOrderStatusComp status={v} />)
        },
        {
            title: 'Người chăm sóc',
            key: 'technicianName',
            dataIndex: 'technicianName',
            render: (v) => <TechnicianName name={v} minWidth={100} />
        },
        {
            title: 'Tổng số cây',
            key: 'treeQuantity',
            dataIndex: 'treeQuantity',
            render: (v) => <p style={{minWidth: '70px'}}>{v}</p>
        },
        {
            title: 'Tiền cọc',
            key: 'deposit',
            dataIndex: 'deposit',
            align: 'right',
            render: (v) => (<MoneyFormat value={v} color='Orange' minWidth={130} />)
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

    const DataSourcePackageOrder = useMemo(() =>{
        return pkgOrders.map((item, index) => {
            const { id, orderCode, createDate, serviceStartDate, serviceEndDate, status, deposit, totalPrice, remainAmount } = item
            const { code, technicianName, treeQuantity } = item.takecareComboService

            const data = {
                key: index + 1,
                orderId: id,
                orderCode,
                serviceCode: code, createDate, serviceStartDate, 
                serviceEndDate, status, technicianName, treeQuantity,
                deposit, totalPrice, remainAmount 
            }

            return data
        })
    }, [pkgOrders])

    const contextService = (record) =>{
        return (
            <div className='context-menu-wrapper'>
                <div className="item" onClick={() => {
                    // setActionMethod({orderId: record.orderId, actionType: 'detail', orderType: 'service', openIndex: -1})
                    navigate(`/order/package/${record.orderId}`)
                }}>
                    <BiDetail size={25} className='icon'/>
                    <span>Chi tiết đơn hàng</span>
                </div>
                {
                    record.status === 'unpaid' &&
                    <div className="item" onClick={() => {
                        handlePaymentMomo({orderId: record.orderId, actionType: 'deposit', orderType: 'service', openIndex: -1})
                    }} >
                        <MdOutlinePayments size={25} className='icon'/>
                        <span>Thanh toán cọc bằng Momo</span>
                    </div>
                }
                {
                    (record.status === 'unpaid' || record.status === 'ready') && 
                    <div className="item" onClick={() => {
                        handlePaymentMomo({orderId: record.orderId, actionType: 'remaining', orderType: 'service', openIndex: -1})
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

    const PkgSelect = useMemo(() =>{
        const [order] = pkgOrders.filter(x => x.id === actionMethod?.orderId)

        return order
    }, [pkgOrders, actionMethod])

    const handlePaymentMomo = async (data: PaymentControlState) =>{
        const [order] = pkgOrders.filter(x => x.id === data.orderId)
        
        try{
            if(data.actionType === 'deposit'){
                const res = await takeComboOrderService.depositPaymentMomo(data.orderId)
                window.open(res.data.payUrl, '_blank')
            }else{
                const res = await takeComboOrderService.orderPaymentMomo(data.orderId, order.remainAmount, 'whole')
                window.open(res.data.payUrl, '_blank')
            }
        }catch{

        }
        setActionMethod(data)
    }

    const handleCloseModal = () =>{
        setActionMethod(undefined)
    }

    const handleCancelOrder = (pkgOrder: PackageOrder) =>{
        const index = pkgOrders.findIndex(x => x.id === pkgOrder.id)

        pkgOrders[index] = pkgOrder
        setPkgOrders([...pkgOrders])
    }

    return (
        <section className='default-layout'>
            <Table
                columns={ColumnPackageOrder} 
                dataSource={DataSourcePackageOrder} 
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
            {
                (actionMethod?.actionType === 'cancel' && PkgSelect) &&
                <ClientCancelPackageOrder pkgOrder={PkgSelect} onClose={handleCloseModal} onSubmit={handleCancelOrder} />
            }
        </section>
    )
}

export default ClientPackageOrder