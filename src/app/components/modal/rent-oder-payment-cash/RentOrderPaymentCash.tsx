import { Modal } from 'antd';
import UserInforOrder from 'app/components/user-infor/user-infor-order/UserInforOrder';
import useDispatch from 'app/hooks/use-dispatch';
import { RentOrderList } from 'app/models/order';
import { setNoti } from 'app/slices/notification';
import utilDateTime from 'app/utils/date-time';
import React, { useMemo, useState } from 'react';
import CurrencyFormat from 'react-currency-format';

interface RentOrderPaymentCashProps{
    rentOrderList: RentOrderList
    onClose: () => void;
    onSubmit: (orderId: string, amount: number) => void
}

const RentOrderPaymentCash: React.FC<RentOrderPaymentCashProps> = ({rentOrderList, onClose, onSubmit}) => {
    const dispatch = useDispatch()

    const [amount, setAmount] = useState(rentOrderList.remainMoney);

    const handlePaymentCash = () =>{
        if(amount < 1000){
            dispatch(setNoti({type: 'error', message: 'Số tiền nhập vào ít nhất là 1.000 VNĐ'}))
            return;
        }
        onSubmit(rentOrderList.id, amount)
    }
    const handleClose = () =>{
        setAmount(0)
        onClose()
    }

    const handleChangeAmount = (values: CurrencyFormat.Values) =>{
        const max = rentOrderList.remainMoney
        const { floatValue } = values
        const data = Number(floatValue || 0)

        if(data >= max){
            setAmount(max)
        }else{
            setAmount(data)
        }
        return data <= max
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
            title={`Thanh toán tiền cho đơn hàng "${rentOrderList.orderCode}"`}
            open
            onCancel={handleClose}
            onOk={handlePaymentCash}
            width={1000}
        >
            <p>Nhập số tiền cần thanh toán (VND)</p>
            <CurrencyFormat min={0} value={amount} isAllowed={handleChangeAmount} className='currency-input' thousandSeparator={true} />
            <UserInforOrder {...InforOrder} />
        </Modal>
    )
}

export default RentOrderPaymentCash