import { Table } from 'antd'
import HeaderInfor from 'app/components/header-infor/HeaderInfor'
import React from 'react'

const ManageTakeCarePackage: React.FC = () => {
  return (
    <div className='mtcp-wrapper'>
      <HeaderInfor title='Quản lý yêu cầu chăm sóc theo gói' />
      <section className="default-layout">
        <Table />
      </section>
    </div>
  )
}

export default ManageTakeCarePackage