import { Button, Modal } from 'antd';
import UserInforOrder from 'app/components/user-infor/user-infor-order/UserInforOrder';
import { RentOrderList } from 'app/models/order';
import utilDateTime from 'app/utils/date-time';
import React, { useMemo, useState } from 'react'

interface RentOrderPaymentDepositProps{
    rentOrderList: RentOrderList
    onClose: () => void;
    onSubmit: (orderId: string) => Promise<void>
}

const RentOrderPaymentDeposit: React.FC<RentOrderPaymentDepositProps> = ({rentOrderList, onClose, onSubmit}) => {
    const [loading, setLoading] = useState(false)

    const handleSubmit = async() =>{
        setLoading(true)
        await onSubmit(rentOrderList.id)
        setLoading(false)
    }
    
    const InforOrder = useMemo(() =>{
        const { recipientName, recipientPhone, recipientAddress, createDate, status, transportFee, totalPrice, deposit, remainMoney } = rentOrderList
        return {
            name: recipientName,
            phone: recipientPhone,
            address: recipientAddress,
            createOrderDate: utilDateTime.dateToString(createDate.toString()),
            status,
            transportFee,
            totalOrder: totalPrice,
            remainMoney,
            deposit
        }
    }, [rentOrderList])

    return (
        <Modal
            open
            title='Thanh toán tiền đặt cọc'
            onCancel={onClose}
            width={1000}
            footer={false}
        >
            <h3>Xác nhận thanh toán đặt cọc cho đơn hàng "{rentOrderList.orderCode}"</h3>
            <UserInforOrder {...InforOrder} />
            <div className='btn-form-wrapper mt-10'>
                <Button htmlType='button' disabled={loading} type='default' className='btn-cancel' size='large' onClick={onClose} >Hủy bỏ</Button>
                <Button htmlType='submit' loading={loading} type='primary' className='btn-update' size='large' onClick={handleSubmit}>
                    Thanh toán
                </Button>
            </div>
        </Modal>
    )
}

export default RentOrderPaymentDeposit