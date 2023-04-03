import { Input, Modal } from 'antd';
import CurrencyInput from 'app/components/renderer/currency-input/CurrencyInput';
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
    const handleChangeAmount = (values: CurrencyFormat.Values) =>{
        const { floatValue } = values
        const data = Number(floatValue || 0)
        setAmount(data)
    }

    return (
        <Modal
            open
            title={`Hoàn tiền cho đơn hàng "${orderCode}"`}
            onCancel={onClose}
            onOk={handleRefundOrder}
        >
            <p>Nhập số tiền cần trả (VND)</p>
            <CurrencyInput min={0} value={amount} onChange={handleChangeAmount} />
            <p style={{marginTop: '10px'}}>Ghi chú</p>
            <Input.TextArea autoSize={{minRows: 4, maxRows: 6}} value={desc} onChange={(e) => setDesc(e.target.value)} ></Input.TextArea>
        </Modal>
    )
}

export default RefundOrder