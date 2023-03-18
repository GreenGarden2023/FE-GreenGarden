import { Checkbox, Modal } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
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

    return (
        <Modal
            title={`Thanh toán tiền cho đơn hàng "${rentOrderList.orderCode}"`}
            open
            onCancel={handleClose}
            onOk={handlePaymentCash}
            width={800}
        >
            <p>Nhập số tiền cần thanh toán</p>
            <CurrencyFormat disabled={checkFullAmount} value={amount} thousandSeparator={true} suffix={' VNĐ'} isAllowed={(values) => {
                        const value = values.floatValue || 0
                        const remain = rentOrderList.remainMoney
                        if(value >= remain) {
                            setAmount(remain)
                        }else{
                            setAmount(Number(value))
                        }
                        return value <= remain
                    }}/>
            <Checkbox checked={checkFullAmount} onChange={handleChangeCheck}>Đủ số tiền cần thanh toán</Checkbox>
        </Modal>
    )
}

export default RentOrderPaymentCash