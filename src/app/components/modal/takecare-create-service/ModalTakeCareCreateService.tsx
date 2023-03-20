import { Form, Modal } from 'antd'
import { UserTree } from 'app/models/user-tree'
import React from 'react'

interface ModalTakeCareCreateServiceProps{
    trees: UserTree[]
}
// tên - địa chỉ - sđt - startdate - enddate - chăm sóc tại nhà hay tại vườn
const ModalTakeCareCreateService: React.FC<ModalTakeCareCreateServiceProps> = ({trees}) => {
  return (
    <Modal
        title='Tạo dịch vụ chăm sóc cây'
        open
        footer={null}
        width={1000}
    >
        <div className="tree-preview">
            <div className="title">
                <p>Các cây đã chọn cho dịch vụ chăm sóc này <span>({trees.length})</span></p>
            </div>
        </div>
        <div className="infor-service">
            <p>Thông tin khách hàng</p>
            <Form
                layout='vertical'
            >
                
            </Form>
        </div>
    </Modal>
  )
}

export default ModalTakeCareCreateService