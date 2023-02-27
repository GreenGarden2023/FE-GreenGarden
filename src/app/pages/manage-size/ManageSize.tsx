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
import { Action } from 'app/models/general-type'
import ModalSize from 'app/components/modal/size/ModalSize'

const ManageSize: React.FC = () => {
    const dispatch = useDispatch()

    const [sizes, setSizes] = useState<Size[]>([])
    const [loading, setLoading] = useState(false)
    const [action, setAction] = useState<Action>('')
    const [sizeSelected, setSizeSelected] = useState<Size>()

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
            render:(_, record, index) => (<p>{index + 1}</p>)
        },
        {
            title: 'Size name',
            key: 'sizeName',
            dataIndex: 'sizeName',
            align: 'center',
        },
        {
            title: 'Actions',
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
        setAction('Update')
    }
    const handleCreateSize = () =>{
        setAction('Create')
    }
    const handleCloseModal = () =>{
        setAction('')
        setSizeSelected(undefined)
    }
    const handleSubmitModal = (actionType: Action, size: Size) =>{
        if(actionType === 'Create'){
            setSizes([size, ...sizes])
        }else if(actionType === 'Update'){
            setSizes(sizes.map((s => s.id === size.id ? {
                ...s,
                sizeName: size.sizeName
            } : s)))
        }
    }
    return (
        <div className='ms-wrapper'>
            <section className="ms-infor default-layout">
                <h1>Manage sizes</h1>
            </section>
            <section className="ms-search-wrapper default-layout">
                <div className="ms-btn-wrapper">
                    <button onClick={handleCreateSize} className='btn-create'>
                        <IoCreateOutline size={20} />
                        Create a size
                    </button>
                </div>
            </section>
            <section className="ms-box default-layout">
                <Table loading={loading} dataSource={DataSource} columns={Column}  />
            </section>
            <ModalSize 
                action={action}
                open={action !== ''}
                onClose={handleCloseModal}
                size={sizeSelected}
                onSubmit={handleSubmitModal}
            />
        </div>
    )
}

export default ManageSize