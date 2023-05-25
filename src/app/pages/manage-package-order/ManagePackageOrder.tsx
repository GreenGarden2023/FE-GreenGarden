import { Popover } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import HeaderInfor from 'app/components/header-infor/HeaderInfor'
import MoneyFormat from 'app/components/money/MoneyFormat';
import TechnicianName from 'app/components/renderer/technician/TechnicianName';
import Transport from 'app/components/renderer/transport/Transport';
import PackageServiceOrderStatusComp from 'app/components/status/PackageServiceOrderStatusComp';
import UserInforTable from 'app/components/user-infor/UserInforTable';
import useSelector from 'app/hooks/use-selector';
import { PackageOrder } from 'app/models/package'
import { Paging } from 'app/models/paging';
import { PaymentControlState } from 'app/models/payment';
import takeComboOrderService from 'app/services/take-combo-order.service';
import CONSTANT from 'app/utils/constant';
import utilDateTime from 'app/utils/date-time';
import pagingPath from 'app/utils/paging-path';
import React, { useEffect, useMemo, useState } from 'react'
import { BiCommentDetail } from 'react-icons/bi';
import { GrMore } from 'react-icons/gr';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

const ManagePackageOrder:React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user } = useSelector(state => state.userInfor)

    // data
    const [pkgOrders, setPkgOrders] = useState<PackageOrder[]>([])

    const [actionMethod, setActionMethod] = useState<PaymentControlState>()
    const [paging, setPaging] = useState<Partial<Paging>>({curPage: 1, pageSize: CONSTANT.PAGING_ITEMS.MANAGE_ORDER_RENT})

    useEffect(() =>{
        pagingPath.scrollTop()
        const currentPage = searchParams.get('page');
        
        if(!pagingPath.isValidPaging(currentPage)){
            setPaging({curPage: 1, pageSize: CONSTANT.PAGING_ITEMS.MANAGE_ORDER_RENT})
            return navigate('/panel/manage-package-order?page=1', { replace: true })
        }

        if(!user.id) return;

        const init = async () =>{
            try{
                const res = await takeComboOrderService.getAllOrdersByTechnician({curPage: Number(currentPage), pageSize: paging.pageSize}, 'all', user.id)
                setPkgOrders(res.data.takecareComboOrderList)
                setPaging(res.data.paging)
            }catch{

            }
        }
        init()
    }, [navigate, searchParams, user.id, paging.pageSize])

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
                <Link to={`/panel/manage-package-order/${record.id}`} target='_blank' >
                    <div className="item" onClick={() => {
                        setActionMethod(undefined)
                        // handleAction({orderId: record.orderId, actionType: 'detail', orderType: 'service', openIndex: -1})
                        // navigate(`/panel/take-care-order-assigned/${record.orderId}`)
                    }}>
                        <BiCommentDetail size={25} className='icon'/>
                        <span>Chi tiết đơn hàng</span>
                    </div>
                </Link>
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

    return (
        <div>
            <HeaderInfor title='Đơn chăm sóc theo gói' />
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
                            navigate(`/panel/manage-package-order?page=${page}`)
                        }
                    }}
                />
            </section>
        </div>
    )
}

export default ManagePackageOrder