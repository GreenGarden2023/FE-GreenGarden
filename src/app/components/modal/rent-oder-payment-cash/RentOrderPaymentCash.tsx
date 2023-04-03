import { Checkbox, Modal } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import CurrencyInput from 'app/components/renderer/currency-input/CurrencyInput';
import useDispatch from 'app/hooks/use-dispatch';
import { RentOrderList } from 'app/models/order';
import { setNoti } from 'app/slices/notification';
import React, { useState } from 'react'
import CurrencyFormat from 'react-currency-format';

interface RentOrderPaymentCashProps{
    rentOrderList: RentOrderList
    onClose: () => void;
    onSubmit: (orderId: string, amount: number, isFull: boolean) => void
}

const RentOrderPaymentCash: React.FC<RentOrderPaymentCashProps> = ({rentOrderList, onClose, onSubmit}) => {
    const dispatch = useDispatch()

    const [amount, setAmount] = useState(0);
    const [checkFullAmount, setCheckFullAmount] = useState(false);

    const handleChangeCheck = (e: CheckboxChangeEvent) =>{
        setCheckFullAmount(e.target.checked)
    }

    const handlePaymentCash = () =>{
        if(!checkFullAmount && amount < 1000){
            dispatch(setNoti({type: 'error', message: 'Số tiền nhập vào ít nhất là 1.000 VNĐ'}))
            return;
        }
        onSubmit(rentOrderList.id, amount, checkFullAmount)
    }
    const handleClose = () =>{
        setAmount(0)
        setCheckFullAmount(false)
        onClose()
    }

    const handleChangeAmount = (values: CurrencyFormat.Values) =>{
        const { floatValue } = values
        const data = Number(floatValue || 0)
        setAmount(data)
    }

    return (
        <Modal
            title={`Thanh toán tiền cho đơn hàng "${rentOrderList.orderCode}"`}
            open
            onCancel={handleClose}
            onOk={handlePaymentCash}
            width={800}
        >
            <p>Nhập số tiền cần thanh toán (VND)</p>
            <CurrencyInput min={0} value={amount} onChange={handleChangeAmount} disbaled={checkFullAmount} />
            <Checkbox checked={checkFullAmount} onChange={handleChangeCheck}>Đã thanh toán đủ</Checkbox>
        </Modal>
    )
}

export default RentOrderPaymentCash