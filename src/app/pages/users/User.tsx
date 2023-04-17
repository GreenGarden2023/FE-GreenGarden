import React from 'react'
import './style.scss'
// import { ColumnsType } from 'antd/es/table'
import HeaderInfor from 'app/components/header-infor/HeaderInfor'

const User: React.FC = () => {

    // const Column: ColumnsType = [
    //     {
    //         title: '#',
    //         key: '#',
    //         dataIndex: '#',
    //         render: (_, v, index) => (index)
    //     },
    //     {
    //         title: 'Tài khoản',
    //         key: 'username',
    //         dataIndex: 'username',
    //     },
    //     {
    //         title: 'Họ tên',
    //         key: 'fullname',
    //         dataIndex: 'fullname',
    //     },
    //     {
    //         title: 'Trạng thái',
    //         key: 'status',
    //         dataIndex: 'status',
    //     },
    //     {
    //         title: 'Công cụ',
    //         key: 'actions',
    //         dataIndex: 'actions',
    //     }
    // ]

    return (
        <div className='manage-user-wrapper'>
            <HeaderInfor title='Quản lý người dùng' />
            <section className="default-layout manage-user-table">

            </section>
        </div>
    )
}

export default User