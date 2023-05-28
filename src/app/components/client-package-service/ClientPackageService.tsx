import { PackageService } from 'app/models/package'
import React, { useEffect, useMemo, useState } from 'react'
import takeCareComboService from 'app/services/take-care-combo.service';
import { Popover, Table } from 'antd';
import utilDateTime from 'app/utils/date-time';
import TechnicianName from '../renderer/technician/TechnicianName';
import { GrMore } from 'react-icons/gr';
import { PaymentControlState } from 'app/models/payment';
import { BiCommentDetail, BiDetail } from 'react-icons/bi';
import { MdCancelPresentation } from 'react-icons/md';
import { ColumnsType } from 'antd/es/table';
import PackageServiceStatusComp from '../status/PackageServiceStatusComp';
import ClientPackageDetail from '../client-package-detail/ClientPackageDetail';
import ConfirmmationServicePackage from '../confirmation-service-package/ConfirmmationServicePackage';
import { useNavigate } from 'react-router-dom';

const ClientPackageService: React.FC = () => {
    const navigate = useNavigate()

    const [pkgServices, setPkgServices] = useState<PackageService[]>([])
    const [actionMethod, setActionMethod] = useState<PaymentControlState>()

    useEffect(() =>{
        const init = async () =>{
            try{
                const res = await takeCareComboService.getAllTakeCareComboService('all')
                setPkgServices(res.data)
            }catch{

            }
        }
        init()
    }, [])

    const contextService = (record) =>{
        return (
            <div className='context-menu-wrapper'>
                <div className="item" onClick={() => {
                    setActionMethod({orderId: record.id, actionType: 'detail', orderType: 'service', openIndex: -1})
                    // navigate(`/take-care-service/me/${record.id}`)
                }}>
                    <BiDetail size={25} className='icon'/>
                    <span>Chi tiết yêu cầu</span>
                </div>
                {
                    (record.status === 'pending' || record.status === 'reprocess') &&
                    <div className="item" onClick={() => {
                        setActionMethod({orderId: record.id, actionType: 'cancel', orderType: 'service', openIndex: -1})
                    }}>
                        <MdCancelPresentation size={25} className='icon'/>
                        <span>Hủy yêu cầu</span>
                    </div>
                }
                {
                    (record.takecareComboOrder) &&
                    <div className="item" onClick={() => {
                        // console.log(record.takecareComboOrder.id)
                        navigate(`/order/package/${record.takecareComboOrder.id}`)
                        // handleAction({orderId: record.id, actionType: 'detail', orderType: 'service', openIndex: -1})
                    }}>
                        <BiCommentDetail size={25} className='icon'/>
                        <span>Xem đơn hàng</span>
                    </div>
                }
            </div>
        )
    }

    const Column: ColumnsType<any> = [
        {
            title: 'Mã dịch vụ',
            key: 'code',
            dataIndex: 'code',
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
            render: (v) => (<PackageServiceStatusComp status={v} />)
        },
        {
            title: 'Người chăm sóc',
            key: 'technicianName',
            dataIndex: 'technicianName',
            render: (v) => (<TechnicianName name={v} minWidth={100} />)
        },
        {
            title: 'Tổng số cây',
            key: 'treeQuantity',
            dataIndex: 'treeQuantity',
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

    const DataSource = useMemo(() =>{
        return pkgServices.map((item, index) => ({
            key: index + 1,
            ...item
        }))
    }, [pkgServices])

    const PkgServiceSelect = useMemo(() =>{
        const [item] = pkgServices.filter(x => x.id === actionMethod?.orderId)
        return item
    }, [pkgServices, actionMethod])

    const handleCloseModal = () =>{
        setActionMethod(undefined)
    }

    const handleCancelService = () =>{
        const [pkgService] = pkgServices.filter(x => x.id === actionMethod?.orderId)

        pkgService.status = 'cancel'
        setPkgServices([...pkgServices])
    }

    return (
        <section className="default-layout">
            <Table
                columns={Column}
                dataSource={DataSource}
                pagination={false}
                scroll={{x: 480}}
            />
            {
                (actionMethod?.actionType === 'detail' && PkgServiceSelect) &&
                <ClientPackageDetail pkgService={PkgServiceSelect} onClose={handleCloseModal} />
            }
            {
                (actionMethod?.actionType === 'cancel' && PkgServiceSelect) &&
                <ConfirmmationServicePackage pkgService={PkgServiceSelect} handler='Reject' isClient onClose={handleCloseModal} onSubmit={handleCancelService}  />
            }
        </section>
    )
}

export default ClientPackageService