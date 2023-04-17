import React, { useEffect, useMemo, useState } from 'react'
import './style.scss'
import Table, { ColumnsType } from 'antd/es/table'
import HeaderInfor from 'app/components/header-infor/HeaderInfor'
import { Paging } from 'app/models/paging'
import CONSTANT from 'app/utils/constant'
import { User } from 'app/models/user'
import userService from 'app/services/user.service'
import { useNavigate, useSearchParams } from 'react-router-dom'
import pagingPath from 'app/utils/paging-path'
import { Switch, Tooltip } from 'antd'
import useDispatch from 'app/hooks/use-dispatch'
import { setNoti } from 'app/slices/notification'
import { AiOutlineEdit } from 'react-icons/ai'
import AdminUpdateUser from 'app/components/modal/admin-update-user/AdminUpdateUser'

const UserPage: React.FC = () => {
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [users, setUsers]= useState<User[]>([])
    const [paging, setPaging] = useState<Partial<Paging>>({curPage: 1, pageSize: CONSTANT.PAGING_ITEMS.MANAGE_USER})

    const [userIndex, setUserIndex] = useState(-1)

    useEffect(() =>{
        const currentPage = searchParams.get('page');
        if(!pagingPath.isValidPaging(currentPage)){
            setPaging({curPage: 1, pageSize: CONSTANT.PAGING_ITEMS.MANAGE_USER})
            return navigate('/panel/users?page=1')
        }

        const init = async () =>{
            const res = await userService.getListAccountByAdmin({curPage: Number(currentPage), pageSize: paging.pageSize})
            setUsers(res.data.users)
            setPaging(res.data.paging)
        }
        init()
    }, [navigate, searchParams, paging.pageSize])

    const Column: ColumnsType<any> = [
        {
            title: '#',
            key: '#',
            dataIndex: '#',
            render: (_, v, index) => (index + 1)
        },
        {
            title: 'Tài khoản',
            key: 'userName',
            dataIndex: 'userName',
        },
        {
            title: 'Họ tên',
            key: 'fullName',
            dataIndex: 'fullName',
        },
        {
            title: 'Vai trò',
            key: 'roleName',
            dataIndex: 'roleName',
        },
        {
            title: 'Trạng thái',
            key: 'status',
            dataIndex: 'status',
            // enable || disable
            render: (v, record, index) => <Switch disabled={record.roleName === 'Admin'} checked={v === 'enable'} onChange={(e) => handleChangeStatus(e, index)} />
        },
        {
            title: 'Công cụ',
            key: 'actions',
            dataIndex: 'actions',
            render: (_, record, index) => (
                <Tooltip color='#00a76f' title='Chỉnh sửa'>
                    <AiOutlineEdit size={25} color='#00a76f' cursor='pointer' onClick={() => setUserIndex(index)} />
                </Tooltip>
            )
        }
    ]

    const DataSource = useMemo(() =>{
        return users.map((x, index) => ({
            key: `${index + 1}`,
            ...x
        }))
    }, [users])

    const handleChangeStatus = async (checked: boolean, index: number) =>{
        const user = users[index]
        const status = checked ? 'enable' : 'disable'
        try{
            await userService.updateUserStatus(user.id, status)
            dispatch(setNoti({type: 'success', message: 'Cập nhật trạng thái thành công'}))
            user.status = status
            setUsers([...users])
        }catch{

        }
    }

    const handleClose = () =>{
        setUserIndex(-1)
    }

    return (
        <div className='manage-user-wrapper'>
            <HeaderInfor title='Quản lý người dùng' />
            <section className="default-layout manage-user-table">
                <Table dataSource={DataSource} columns={Column} pagination={{
                    current: paging.curPage || 1,
                    pageSize: paging.pageSize || 1,
                    total: paging.recordCount || 1,
                    onChange: (page: number) =>{
                        navigate(`/panel/users?page=${page}`)
                    }
                }} />
            </section>
            {
                userIndex !== -1 &&
                <AdminUpdateUser
                    user={users[userIndex]}
                    onClose={handleClose}
                    onSubmit={() => {}}
                />
            }
        </div>
    )
}

export default UserPage