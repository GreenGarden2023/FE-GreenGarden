import React, { useEffect, useMemo, useState } from 'react'
import './style.scss'
import HeaderInfor from 'app/components/header-infor/HeaderInfor'
import Table, { ColumnsType } from 'antd/es/table'
import MoneyFormat from 'app/components/money/MoneyFormat'
import { AiOutlineEdit } from 'react-icons/ai'
import HandlePackage from 'app/components/handle-package/HandlePackage'
import { Switch } from 'antd'
import useDispatch from 'app/hooks/use-dispatch'
import { setNoti } from 'app/slices/notification'
import { Package } from 'app/models/package'
import takeCareComboService from 'app/services/take-care-combo.service'

const ManagePackage: React.FC = () => {
    const dispatch = useDispatch();

    // data
    const [packages, setPackages] = useState<Package[]>([])

    const [action, setAction] = useState(0)
    const [pkg, setPkg] = useState<Package>()

    useEffect(() =>{
        const init = async () =>{
            try{
                const res = await takeCareComboService.getAllTakeCareCombo('all')
                setPackages(res.data)
            }catch{
                
            }
        }
        init()
    }, [])

    const Column: ColumnsType<any> = [
        {
            title: 'Gói dịch vụ',
            key: 'name',
            dataIndex: 'name'
        },
        {
            title: 'Đơn giá',
            key: 'price',
            dataIndex: 'price',
            align: 'right',
            render: (v) => <MoneyFormat value={v} color='Blue' />
        },
        {
            title: 'Chi tiết công việc',
            key: 'description',
            dataIndex: 'description'
        },
        {
            title: 'Cam kết',
            key: 'guarantee',
            dataIndex: 'guarantee',
            render: (v) => <p className='manage-guarantee'>{v}</p>
        },
        {
            title: 'Trạng thái',
            key: 'status',
            dataIndex: 'status',
            width: 120,
            align: 'center',
            render: (v, record, index) => <Switch checked={v} onChange={(e) => handleChangeStatus(index, e, record)} />
        },
        {
            title: 'Xử lý',
            key: '#',
            dataIndex: '#',
            width: 100,
            align: 'center',
            render: (_, record) => <AiOutlineEdit color='#00a76f' size={25} cursor='pointer' onClick={() => {
                handleSetAction(2)
                setPkg(record)
            }}/>
        },
    ]
    const DataSource = useMemo(() =>{
        return packages.map((item, index) => ({
            key: index + 1,
            ...item
        }))
    }, [packages])

    const handleChangeStatus = async (index: number, checked: boolean, record: Package) =>{
        record.status = checked
        try{
            await takeCareComboService.updateTakeCareCombo(record)
            packages[index].status = checked
            setPackages([...packages])
            dispatch(setNoti({type: 'success', message: 'Cập nhật trạng thái thành công'}))
        }catch{

        }
    }

    const handleCloseModal = () =>{
        handleSetAction(0)
        setPkg(undefined)
    }

    const handlePackage = (data: Package) =>{
        if(action === 1){
            setPackages([data, ...packages])
            return;
        }
        const index = packages.findIndex(x => x.id === data.id)
        packages[index] = data
        setPackages([...packages])
    }

    const handleSetAction = (act: number) =>{
        setAction(act)
    }
    return (
        <div className='mng-package-wrapper'>
            <HeaderInfor title='Quản lý gói chăm sóc' />
            <section className="default-layout">
                <div className="btn-tools">
                    <button className="btn btn-create"  onClick={() => handleSetAction(1)}>
                        Tạo mới gói chăm sóc
                    </button>
                </div>
            </section>
            <section className="default-layout">
                <Table columns={Column}  dataSource={DataSource} bordered pagination={false} scroll={{x: 480}} />
            </section>
            {
                action !== 0 &&
                // data get by pkgId
                <HandlePackage data={pkg} onClose={handleCloseModal} onSubmit={handlePackage} />
            }
        </div>
    )
}

export default ManagePackage