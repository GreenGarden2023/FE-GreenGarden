import { Popover, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import AssignServicePackage from 'app/components/assign-service-package/AssignServicePackage'
import ConfirmmationServicePackage from 'app/components/confirmation-service-package/ConfirmmationServicePackage'
import CreatePackageOrder from 'app/components/create-package-order/CreatePackageOrder'
import DetailPackageService from 'app/components/detail-package-service/DetailPackageService'
import HeaderInfor from 'app/components/header-infor/HeaderInfor'
import TechnicianName from 'app/components/renderer/technician/TechnicianName'
import PackageServiceStatusComp from 'app/components/status/PackageServiceStatusComp'
import UpdatePackageService from 'app/components/update-package-service/UpdatePackageService'
import UserInforTable from 'app/components/user-infor/UserInforTable'
import { PackageService } from 'app/models/package'
import { PaymentControlState } from 'app/models/payment'
import { UserGetByRole } from 'app/models/user'
import takeCareComboService from 'app/services/take-care-combo.service'
import utilDateTime from 'app/utils/date-time'
import React, { useEffect, useMemo, useState } from 'react'
import { AiOutlineEdit } from 'react-icons/ai'
import { BiDetail, BiUserPlus } from 'react-icons/bi'
import { BsCheck2All } from 'react-icons/bs'
import { GrMore } from 'react-icons/gr'
import { MdCancelPresentation } from 'react-icons/md'

const ManageTakeCarePackage: React.FC = () => {
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

    const Column: ColumnsType<any> = [
        {
            title: 'Mã dịch vụ',
            key: 'code',
            dataIndex: 'code',
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
            fixed: 'left',
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

    const contextService = (record) =>{
        return (
            <div className='context-menu-wrapper'>
                <div className="item" onClick={() => {
                    setActionMethod({orderId: record.id, actionType: 'detail', orderType: 'service', openIndex: -1})
                }}>
                    <BiDetail size={25} className='icon'/>
                    <span>Chi tiết dịch vụ</span>
                </div>
                {
                    (record.status === 'pending' || record.status === 'reprocess') &&
                    <div className="item" onClick={() => {
                        setActionMethod({orderId: record.id, actionType: 'accept service', orderType: 'service', openIndex: -1})
                    }}>
                        <BsCheck2All size={25} className='icon'/>
                        <span>Xác nhận yêu cầu</span>
                    </div>
                }
                {
                    (record.status === 'pending' || record.status === 'reprocess') &&
                    <div className="item" onClick={() => {
                        setActionMethod({orderId: record.id, actionType: 'reject service', orderType: 'service', openIndex: -1})
                    }}>
                        <MdCancelPresentation size={25} className='icon'/>
                        <span>Từ chối yêu cầu</span>
                    </div>
                }
                {
                    record.status === 'accepted' &&
                    <div className="item"  onClick={() => {
                            setActionMethod({orderId: record.id, actionType: 'assign', orderType: 'service', openIndex: -1})
                        }}
                    >
                        <BiUserPlus size={25} className='icon'/>
                        <span>Chọn người chăm sóc</span>
                    </div>
                }
                {
                    (record.status === 'accepted' && record.technicianName) &&
                    <div className="item" onClick={() => {
                            setActionMethod({orderId: record.id, actionType: 'update infor', orderType: 'service', openIndex: -1})
                        }}
                    >
                        <AiOutlineEdit size={25} className='icon'/>
                        <span>Cập nhật thông tin dịch vụ</span>
                    </div>
                }
                {
                    (record.status === 'accepted' && record.technicianName) &&
                    <div className="item" onClick={() => {
                            setActionMethod({orderId: record.id, actionType: 'create order', orderType: 'service', openIndex: -1})
                        }}
                    >
                        <BiDetail size={25} className='icon'/>
                        <span>Tạo đơn hàng</span>
                    </div>
                }
            </div>
        )
    }

    const handleClose = () =>{
        setActionMethod(undefined)
    }

    const PkgServiceSelect = useMemo(() =>{
        const [pkgService] = pkgServices.filter(x => x.id === actionMethod?.orderId)

        return pkgService
    }, [pkgServices, actionMethod])

    const handleAcceptRequest = () =>{
        const [pkgService] = pkgServices.filter(x => x.id === actionMethod?.orderId)

        pkgService.status = 'accepted'
        setPkgServices([...pkgServices])
    }

    const handleRejectRequest = () =>{
        const [pkgService] = pkgServices.filter(x => x.id === actionMethod?.orderId)

        pkgService.status = 'rejected'
        setPkgServices([...pkgServices])
    }

    const handleAssignRequest = (user: UserGetByRole) =>{
        const [pkgService] = pkgServices.filter(x => x.id === actionMethod?.orderId)

        pkgService.technicianId = user.id
        pkgService.technicianName = user.fullName

        setPkgServices([...pkgServices])
    }

    const handleUpdatePkgRequest = (pkgService: PackageService) =>{
        const index = pkgServices.findIndex(x => x.id === pkgService.id)

        pkgServices[index] = pkgService
        setPkgServices([...pkgServices])
    }

    const handleCreateOrder = () =>{
        const [pkgService] = pkgServices.filter(x => x.id === actionMethod?.orderId)

        pkgService.status = 'taking care'

        setPkgServices([...pkgServices])
    }

    return (
        <div className='mtcp-wrapper'>
            <HeaderInfor title='Quản lý yêu cầu chăm sóc theo gói' />
            <section className="default-layout">
                <Table 
                    columns={Column}
                    dataSource={DataSource}
                    scroll={{x: 2000}}
                />
            </section>
            {
                (actionMethod?.actionType === 'detail' && PkgServiceSelect) && 
                <DetailPackageService 
                    pkgService={PkgServiceSelect}
                    onClose={handleClose}
                />
            }
            {
                (actionMethod?.actionType === 'accept service' && PkgServiceSelect) && 
                <ConfirmmationServicePackage handler='Accept' pkgService={PkgServiceSelect} onClose={handleClose} onSubmit={handleAcceptRequest} />
            }
            {
                (actionMethod?.actionType === 'reject service' && PkgServiceSelect) && 
                <ConfirmmationServicePackage handler='Reject' pkgService={PkgServiceSelect} onClose={handleClose} onSubmit={handleRejectRequest} />
            }
            {
                (actionMethod?.actionType === 'assign' && PkgServiceSelect) &&
                <AssignServicePackage pkgService={PkgServiceSelect} onClose={handleClose} onSubmit={handleAssignRequest} />
            }
            {
                (actionMethod?.actionType === 'update infor' && PkgServiceSelect) &&
                <UpdatePackageService pkgService={PkgServiceSelect} onClose={handleClose} onSubmit={handleUpdatePkgRequest} />
            }
            {
                (actionMethod?.actionType === 'create order' && PkgServiceSelect) &&
                <CreatePackageOrder pkgService={PkgServiceSelect} onClose={handleClose} onSubmit={handleCreateOrder} />
            }
        </div>
    )
}

export default ManageTakeCarePackage