import { Modal } from 'antd';
import { RentOrderList } from 'app/models/order';
import React from 'react'

interface RentOrderPaymentDepositProps{
    rentOrderList: RentOrderList
    onClose: () => void;
    onSubmit: (orderId: string) => void
}

const RentOrderPaymentDeposit: React.FC<RentOrderPaymentDepositProps> = ({rentOrderList, onClose, onSubmit}) => {
    const handleSubmit = () =>{
        onSubmit(rentOrderList.id)
    }
  return (
    <Modal
        open
        title='Xác nhận thanh toán đặt cọc'
        onCancel={onClose}
        onOk={handleSubmit}
        width={800}
    >
        <h2>Xác nhận thanh toán đặt cọc cho đơn hàng {rentOrderList.orderCode}</h2>
    </Modal>
  )
}

export default RentOrderPaymentDeposit