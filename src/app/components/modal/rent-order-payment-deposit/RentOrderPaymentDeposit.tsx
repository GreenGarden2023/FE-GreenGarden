import { Modal } from 'antd';
import UserInforOrder from 'app/components/user-infor/user-infor-order/UserInforOrder';
import { RentOrderList } from 'app/models/order';
import utilDateTime from 'app/utils/date-time';
import React, { useMemo } from 'react'

interface RentOrderPaymentDepositProps{
    rentOrderList: RentOrderList
    onClose: () => void;
    onSubmit: (orderId: string) => void
}

const RentOrderPaymentDeposit: React.FC<RentOrderPaymentDepositProps> = ({rentOrderList, onClose, onSubmit}) => {
    const handleSubmit = () =>{
        onSubmit(rentOrderList.id)
    }
    // name?: string;
    // phone?: string;
    // address?: string;
    // createOrderDate?: string;
    // status?: OrderStatus;
    // transportFree?: number;
    // totalOrder?: number;
    // totalPayment?: number;
    // deposit?: number;

    
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
            onOk={handleSubmit}
            width={1000}
        >
            <h2>Xác nhận thanh toán đặt cọc cho đơn hàng {rentOrderList.orderCode}</h2>
            <UserInforOrder {...InforOrder} />
        </Modal>
    )
}

export default RentOrderPaymentDeposit