import { Image, Modal } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import { ServiceDetailList } from 'app/models/service'
import React, { useMemo } from 'react'

interface ClientServiceOrderDetailProps{
    serviceDetailList: ServiceDetailList[]
    onClose: () => void
}

const ClientServiceOrderDetail: React.FC<ClientServiceOrderDetailProps> = ({serviceDetailList, onClose}) => {
    const Column: ColumnsType<any> = [
        {
            title: 'Tên cây',
            key: 'treeName',
            dataIndex: 'treeName',
        },
        {
            title: 'Hình ảnh',
            key: 'imgUrls',
            dataIndex: 'imgUrls',
            render: (v) => (
                <Image 
                    width={150}
                    height={150}
                    src={v}
                    style={{objectFit: 'cover'}}
                />
            )
        },
        {
            title: 'Số lượng',
            key: 'quantity',
            dataIndex: 'quantity',
        },
        {
            title: 'Mô tả',
            key: 'description',
            dataIndex: 'description',
        },
        {
            title: 'Thành tiền',
            key: 'servicePrice',
            dataIndex: 'servicePrice',
        },
        {
            title: 'Mô tả của cửa hàng',
            key: 'managerDescription',
            dataIndex: 'managerDescription',
        },
    ]
    const DataSource = useMemo(() =>{
        return serviceDetailList.map((x, index) => ({
            key: String(index + 1),
            treeName: x.treeName,
            imgUrls: x.imgUrls[0],
            quantity: x.quantity,
            description: x.description,
            servicePrice: x.servicePrice,
            managerDescription: x.managerDescription
        }))
    }, [serviceDetailList])
  return (
    <Modal
        title='Chi tiết dịch vụ chăm sóc cho đơn hàng'
        onCancel={onClose}
        open
        width={1200}
        onOk={onClose}
    >
        <Table columns={Column} dataSource={DataSource} pagination={false} />
    </Modal>
  )
}

export default ClientServiceOrderDetail