import { Popover, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import CancelPackageOrder from 'app/components/handle-package-order/CancelPackageOrder'
import CompletePackageOrder from 'app/components/handle-package-order/CompletePackageOrder'
import DepositPackageOrder from 'app/components/handle-package-order/DepositPackageOrder'
import DetailPackageOrder from 'app/components/handle-package-order/DetailPackageOrder'
import PaymentPackageOrder from 'app/components/handle-package-order/PaymentPackageOrder'
import RefundPackageOrder from 'app/components/handle-package-order/RefundPackageOrder'
import HeaderInfor from 'app/components/header-infor/HeaderInfor'
import TransactionDetail from 'app/components/modal/transaction-detail/TransactionDetail'
import MoneyFormat from 'app/components/money/MoneyFormat'
import TechnicianName from 'app/components/renderer/technician/TechnicianName'
import Transport from 'app/components/renderer/transport/Transport'
import Searching from 'app/components/search-and-filter/search/Searching'
import PackageServiceOrderStatusComp from 'app/components/status/PackageServiceOrderStatusComp'
import UserInforTable from 'app/components/user-infor/UserInforTable'
import useSelector from 'app/hooks/use-selector'
import { PackageOrder } from 'app/models/package'
import { Paging } from 'app/models/paging'
import { PaymentControlState } from 'app/models/payment'
import takeComboOrderService from 'app/services/take-combo-order.service'
import CONSTANT from 'app/utils/constant'
import utilDateTime from 'app/utils/date-time'
import pagingPath from 'app/utils/paging-path'
import React, { useEffect, useMemo, useState } from 'react'
import { AiOutlineTransaction } from 'react-icons/ai'
import { BiDetail } from 'react-icons/bi'
import { BsCheck2All } from 'react-icons/bs'
import { GrMore } from 'react-icons/gr'
import { MdCancelPresentation, MdOutlinePayment, MdOutlinePayments } from 'react-icons/md'
import { useNavigate, useSearchParams } from 'react-router-dom'

const TakeCareOrderPackage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { search } = useSelector(state => state.SearchFilter)

    // data
    const [pkgOrders, setPkgOrders] = useState<PackageOrder[]>([])
    
    const [actionMethod, setActionMethod] = useState<PaymentControlState>()
    const [paging, setPaging] = useState<Partial<Paging>>({curPage: 1, pageSize: CONSTANT.PAGING_ITEMS.MANAGE_ORDER_RENT})

    useEffect(() =>{
        pagingPath.scrollTop()
        const currentPage = searchParams.get('page');
        
        if(!pagingPath.isValidPaging(currentPage)){
            setPaging({curPage: 1, pageSize: CONSTANT.PAGING_ITEMS.MANAGE_ORDER_RENT})
            return navigate('/panel/take-care-order-package?page=1', { replace: true })
        }

        if(search.isSearching && search.orderCode){
            const init = async () =>{
                try{
                    const res = await takeComboOrderService.getOrderByOrderCode(search.orderCode || '')
                    setPkgOrders([res.data])
                }catch{
    
                }
            }
            init()
        }else{
            const init = async () =>{
                try{
                    const res = await takeComboOrderService.getAllOrders({curPage: Number(currentPage), pageSize: paging.pageSize}, 'all')
                    setPkgOrders(res.data.takecareComboOrderList)
                    setPaging(res.data.paging)
                }catch{
    
                }
            }
            init()
        }

    }, [navigate, paging.pageSize, searchParams, search.isSearching, search.orderCode])

    const ColumnServiceOrder: ColumnsType<any> = [
        {
            title: 'Mã đơn hàng',
            key: 'orderCode',
            dataIndex: 'orderCode',
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
            title: 'Người chăm sóc',
            key: 'technicianName',
            dataIndex: 'technicianName',
            render: (v) => <TechnicianName name={v} />
        },
        {
            title: 'Số lượng cây',
            key: 'treeQuantity',
            dataIndex: 'treeQuantity',
        },
        {
            title: 'Trạng thái',
            key: 'status',
            dataIndex: 'status',
            width: 200,
            render: (v) => (<PackageServiceOrderStatusComp status={v} />)
        },
        {
            title: 'Nơi chăm sóc',
            key: 'isAtShop',
            dataIndex: 'isAtShop',
            render: (v) => (<Transport isTransport={v} isRequest />)
        },
        {
            title: 'Tiền cọc',
            key: 'deposit',
            dataIndex: 'deposit',
            align:'right',
            width: 180,
            render: (v) => <MoneyFormat value={v} color='Orange'  />
        },
        {
            title: 'Tổng tiền',
            key: 'totalPrice',
            dataIndex: 'totalPrice',
            align:'right',
            width: 180,
            render: (v) => <MoneyFormat value={v} color='Light Blue'  />
        },
        {
            title: 'Tiền còn thiếu',
            key: 'remainAmount',
            dataIndex: 'remainAmount',
            align:'right',
            width: 200,
            fixed: 'right',
            render: (v) => <MoneyFormat value={v} color='Blue' isHighlight />
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
                    <span>Chi tiết đơn hàng</span>
                </div>
                <div className="item" onClick={() => {
                    setActionMethod({orderId: record.id, actionType: 'view transaction', orderType: 'service', openIndex: -1})
                }}>
                    <AiOutlineTransaction size={25} className='icon'/>
                    <span>Xem giao dịch</span>
                </div>
                {
                    (record.status === 'unpaid') && 
                    <div className="item" onClick={() => {
                        setActionMethod({orderId: record.id, actionType: 'deposit', orderType: 'service', openIndex: -1})
                        console.log(record)
                    }}>
                        <MdOutlinePayments size={25} className='icon'/>
                        <span>Thanh toán tiền cọc</span>
                    </div>
                }
                {
                    (record.status === 'ready') &&
                    <div className="item" onClick={() => {
                        setActionMethod({orderId: record.id, actionType: 'remaining', orderType: 'service', openIndex: -1})
                    }}>
                        <MdOutlinePayment size={25} className='icon'/>
                        <span>Thanh toán đơn hàng</span>
                    </div>
                }
                {
                    ((record.status === 'paid' && !record.isTransport) || record.status === 'delivery') && 
                    <div className="item" onClick={() => {
                        setActionMethod({orderId: record.id, actionType: 'finished', orderType: 'sale', openIndex: -1})
                    }}>
                        <BsCheck2All size={25} className='icon'/>
                        <span>Hoàn thành</span>
                    </div>
                }
                {
                    record.status === 'cancel' &&
                    <div className="item" onClick={() => {
                        setActionMethod({orderId: record.id, actionType: 'refund', orderType: 'service', openIndex: -1})
                    }}>
                        <BsCheck2All size={25} className='icon'/>
                        <span>Hoàn tiền</span>
                    </div>
                }
                {
                    (record.status !== 'completed' && record.status !== 'cancel') &&
                    <div className="item" onClick={() => {
                        setActionMethod({orderId: record.id, actionType: 'cancel', orderType: 'service', openIndex: -1})
                    }}>
                        <MdCancelPresentation size={25} className='icon'/>
                        <span>Hủy đơn hàng</span>
                    </div>
                }
            </div>
        )
    }

    const DataSourceServiceOrder = useMemo(() =>{
        return pkgOrders.map((item, index) => {
            const { takecareComboService, ...rest } = item
            const { status, id, ...rest2 } = takecareComboService
            return {
                key: index + 1,
                ...rest,
                ...rest2
            }
        })
    }, [pkgOrders])

    const PkgOrderSelect = useMemo(() =>{
        const [item] =  pkgOrders.filter(x => x.id === actionMethod?.orderId)
        console.log(actionMethod?.orderId, item, pkgOrders[0])
        return item
    }, [pkgOrders, actionMethod])

    const handleCloseModal = () =>{
        setActionMethod(undefined)
    }

    const updatePackageOrder = (pkgOrder: PackageOrder) =>{
        const index = pkgOrders.findIndex(x => x.id === pkgOrder.id)

        pkgOrders[index] = pkgOrder
        setPkgOrders([...pkgOrders])
    }

    return (
        <div className='tcop-wrapper'>
            <HeaderInfor title='Quản lý đơn hàng chăm sóc theo gói' />
            <Searching
                isOrderCode
                defaultUrl='/panel/take-care-order-package?page=1'
            />
            <section className="default-layout">
                <Table 
                    columns={ColumnServiceOrder} 
                    dataSource={DataSourceServiceOrder} 
                    scroll={{ y: 680, x: 2200 }}
                    pagination={{
                        current: paging.curPage,
                        pageSize: paging.pageSize,
                        total: paging.recordCount,
                        onChange: (page: number) =>{
                            navigate(`/panel/take-care-order-package?page=${page}`)
                        }
                    }}
                />
            </section>
            {
                (actionMethod?.actionType === 'detail' && PkgOrderSelect) &&
                <DetailPackageOrder pkgOrder={PkgOrderSelect} onClose={handleCloseModal} />
            }
            {
                (actionMethod?.actionType === 'view transaction' && PkgOrderSelect) &&
                <TransactionDetail orderId={PkgOrderSelect.id} orderCode={PkgOrderSelect.orderCode} orderType='combo' onClose={handleCloseModal} />
            }
            {
                (actionMethod?.actionType === 'deposit' && PkgOrderSelect) &&
                <DepositPackageOrder pkgOrder={PkgOrderSelect} onClose={handleCloseModal} onSubmit={updatePackageOrder} />
            }
            {
                (actionMethod?.actionType === 'remaining' && PkgOrderSelect) &&
                <PaymentPackageOrder pkgOrder={PkgOrderSelect} onClose={handleCloseModal} onSubmit={updatePackageOrder} />
            }
            {
                (actionMethod?.actionType === 'finished' && PkgOrderSelect) &&
                <CompletePackageOrder pkgOrder={PkgOrderSelect} onClose={handleCloseModal} onSubmit={updatePackageOrder} />
            }
            {
                (actionMethod?.actionType === 'cancel' && PkgOrderSelect) &&
                <CancelPackageOrder pkgOrder={PkgOrderSelect} onClose={handleCloseModal} onSubmit={updatePackageOrder} />
            }
            {
                (actionMethod?.actionType === 'refund' && PkgOrderSelect) &&
                <RefundPackageOrder pkgOrder={PkgOrderSelect} onClose={handleCloseModal} />
            }
        </div>
    )
}

export default TakeCareOrderPackage