import { Popover } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import DetailPackageService from 'app/components/detail-package-service/DetailPackageService'
import HeaderInfor from 'app/components/header-infor/HeaderInfor'
import Transport from 'app/components/renderer/transport/Transport'
import PackageServiceStatusComp from 'app/components/status/PackageServiceStatusComp'
import UserInforTable from 'app/components/user-infor/UserInforTable'
import useSelector from 'app/hooks/use-selector'
import { PackageService } from 'app/models/package'
import { PaymentControlState } from 'app/models/payment'
import takeCareComboService from 'app/services/take-care-combo.service'
import utilDateTime from 'app/utils/date-time'
import React, { useEffect, useMemo, useState } from 'react'
import { BiDetail } from 'react-icons/bi'
import { GrMore } from 'react-icons/gr'

const ManagePackageRequest:React.FC = () => {
    const { user } = useSelector(state => state.userInfor)

    const [pkgServices, setPkgServices] = useState<PackageService[]>([])
    const [actionMethod, setActionMethod] = useState<PaymentControlState>()

    useEffect(() =>{
        if(!user.id) return;

        const init = async () =>{
            try{
                const res = await takeCareComboService.getAllTakeCareComboServiceByTech('all', user.id)
                setPkgServices(res.data)
            }catch{

            }
        }
        init() 
    }, [user.id])

    const Column: ColumnsType<any> = [
        {
            title: 'Mã dịch vụ',
            key: 'code',
            dataIndex: 'code',
            render: (v) => <p style={{maxWidth: 100}}>{v}</p>
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
            title: 'Số lượng cây',
            key: 'treeQuantity',
            dataIndex: 'treeQuantity',
            render: (v) => <p style={{minWidth: 80}}>{v}</p>
        },
        {
            title: 'Nơi chăm sóc',
            key: 'isAtShop',
            dataIndex: 'isAtShop',
            render: (v) => (<Transport isTransport={v} isRequest minWidth={120} />)
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

    const DataSource = useMemo(() =>{
        return pkgServices.map((item, index) => ({
            key: index + 1,
            ...item
        }))
    }, [pkgServices])

    const PkgServiceSelect = useMemo(() =>{
        const [pkgService] = pkgServices.filter(x => x.id === actionMethod?.orderId)

        return pkgService
    }, [pkgServices, actionMethod])

    const handleClose = () =>{
        setActionMethod(undefined)
    }

    return (
        <div>
            <HeaderInfor title='Yêu cầu chăm sóc cây theo gói' />
            <section className="default-layout">
                <Table
                    columns={Column}
                    dataSource={DataSource}
                    scroll={{x: 480 }}
                />
            </section>
            {
                (actionMethod?.actionType === 'detail' && PkgServiceSelect) && 
                <DetailPackageService
                    pkgService={PkgServiceSelect}
                    onClose={handleClose}
                />
            }
        </div>
    )
}

export default ManagePackageRequest