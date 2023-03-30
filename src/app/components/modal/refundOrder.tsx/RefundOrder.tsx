import { Input, Modal } from 'antd';
import useDispatch from 'app/hooks/use-dispatch';
import { OrderType } from 'app/models/general-type';
import { TransactionHandle } from 'app/models/transaction';
import transactionService from 'app/services/transaction.service';
import { setNoti } from 'app/slices/notification';
import React, { useState } from 'react'
import CurrencyFormat from 'react-currency-format';

interface RefundOrderProps{
    orderId: string;
    orderCode: string;
    orderType: OrderType;
    onClose: () => void;
    onSubmit: () => void;
}

const RefundOrder: React.FC<RefundOrderProps> = ({orderId, orderCode, orderType, onClose, onSubmit}) => {
    const dispatch = useDispatch()
    const [amount, setAmount] = useState(0)
    const [desc, setDesc] = useState('')

    const handleRefundOrder = async () =>{
        if(amount < 1000){
            dispatch(setNoti({type: 'warning', message: 'Số tiền nhập vào ít nhất là 1000VNĐ'}))
            return
        }
        try{
            const body: TransactionHandle = {
                orderID: orderId,
                amount: amount,
                description: desc,
                orderType: orderType,
                paymentType: 'cash'
            }
            await transactionService.createTransaction(body)
            dispatch(setNoti({type: 'success', message: `Đã hoàn ${amount}VNĐ cho đơn hàng ${orderCode}`}))
            setAmount(0)
            setDesc('')
            onSubmit()
        }catch{

        }
    }

    return (
        <Modal
            open
            title={`Hoàn tiền cho đơn hàng "${orderCode}"`}
            onCancel={onClose}
            onOk={handleRefundOrder}
        >
            <p>Nhập số tiền cần trả</p>
            <CurrencyFormat value={amount} thousandSeparator={true}  onValueChange={(values) => {
                const value = values.floatValue || 0
                setAmount(value)
            }} />
            <p>Ghi chú</p>
            <Input.TextArea value={desc} onChange={(e) => setDesc(e.target.value)} ></Input.TextArea>
        </Modal>
    )
}

export default RefundOrder