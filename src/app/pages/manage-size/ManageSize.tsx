import useDispatch from 'app/hooks/use-dispatch'
import { setNoti } from 'app/slices/notification'
import CONSTANT from 'app/utils/constant'
import React, { useEffect, useMemo, useState } from 'react'
import './style.scss'
import sizeService from 'app/services/size.service';
import { Size } from 'app/models/size'
import Table, { ColumnsType } from 'antd/es/table'
import { AiFillEdit } from 'react-icons/ai'
import { IoCreateOutline } from 'react-icons/io5'
import ModalSize from 'app/components/modal/size/ModalSize'
import { Tag } from 'antd'
import HeaderInfor from 'app/components/header-infor/HeaderInfor'

const ManageSize: React.FC = () => {
    const dispatch = useDispatch()

    const [sizes, setSizes] = useState<Size[]>([])
    const [loading, setLoading] = useState(false)
    const [sizeSelected, setSizeSelected] = useState<Size>()
    const [openModal, setOpenModal] = useState(false);

    useEffect(() =>{
        const init = async () =>{
            setLoading(true)
            try{
                const res = await sizeService.getAllSize();
                setSizes(res.data)
            }catch{
                dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE}))
            }
            setLoading(false)
        }
        init()
    }, [dispatch])
    
    const Column: ColumnsType<Size> = [
        {
            title: '#',
            key: '#',
            dataIndex: '#',
            align: 'center',
            render:(_, r, index) => (<p>{index + 1}</p>)
        },
        {
            title: 'Tên kích thước',
            key: 'sizeName',
            dataIndex: 'sizeName',
            align: 'center',
        },
        {
            title: 'Loại kích thước',
            key: 'sizeType',
            dataIndex: 'sizeType',
            align: 'center',
            render: (value) => (value ? <Tag color='#108ee9'>Duy nhất</Tag> : <Tag color='#87d068'>Số lượng lớn</Tag>)
        },
        {
            title: 'Công cụ',
            key: 'actions',
            dataIndex: 'actions',
            align: 'center',
            render:(_, record) => (
                <div className="btn-actions-wrapper">
                    <AiFillEdit className='btn-icon' onClick={() => handleUpdateSize(record)} />
                </div>
            )
        }
    ]
    const DataSource = useMemo(() =>{
        return sizes.map((size, index) => ({
          key: String(index + 1),
          ...size
        }))
    }, [sizes])

    const handleUpdateSize = (size: Size) =>{
        setSizeSelected(size)
        setOpenModal(true)
    }
    const handleCreateSize = () =>{
        setOpenModal(true)
    }
    const handleCloseModal = () =>{
        setSizeSelected(undefined)
        setOpenModal(false)
    }
    const handleSubmitModal = (size: Size) =>{
        const index = sizes.findIndex(x => x.id === size.id)

        if(index < 1){
            setSizes([size, ...sizes])
        }else{
            setSizes(sizes.map((s => s.id === size.id ? ({
                ...s,
                sizeName: size.sizeName
            }) : s)))
        }
    }
    return (
        <div className='ms-wrapper'>
            <HeaderInfor title='Quản lý kích thước' />
            <section className="ms-search-wrapper default-layout">
                <div className="ms-btn-wrapper">
                    <button onClick={handleCreateSize} className='btn-create'>
                        <IoCreateOutline size={20} />
                        Tạo mới 1 kích thước
                    </button>
                </div>
            </section>
            <section className="ms-box default-layout">
                <Table loading={loading} dataSource={DataSource} columns={Column}  />
            </section>
            <ModalSize 
                open={openModal}
                onClose={handleCloseModal}
                size={sizeSelected}
                onSubmit={handleSubmitModal}
            />
        </div>
    )
}

export default ManageSize