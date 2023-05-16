import { Table } from 'antd'
import HeaderInfor from 'app/components/header-infor/HeaderInfor'
import React from 'react'

const TakeCareOrderPackage: React.FC = () => {
  return (
    <div className='tcop-wrapper'>
      <HeaderInfor title='Quản lý đơn hàng chăm sóc theo gói' />
      <section className="default-layout">
        <Table />
      </section>
    </div>
  )
}

export default TakeCareOrderPackage