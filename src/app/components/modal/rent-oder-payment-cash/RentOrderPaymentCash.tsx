import { Button, Modal } from 'antd';
import UserInforOrder from 'app/components/user-infor/user-infor-order/UserInforOrder';
import useDispatch from 'app/hooks/use-dispatch';
import { RentOrderList } from 'app/models/order';
import { setNoti } from 'app/slices/notification';
import utilDateTime from 'app/utils/date-time';
import React, { useEffect, useMemo, useState } from 'react';
import CurrencyFormat from 'react-currency-format';

interface RentOrderPaymentCashProps{
    rentOrderList: RentOrderList
    onClose: () => void;
    onSubmit: (orderId: string, amount: number) => Promise<void>
}

const RentOrderPaymentCash: React.FC<RentOrderPaymentCashProps> = ({rentOrderList, onClose, onSubmit}) => {
    const dispatch = useDispatch()

    const [amount, setAmount] = useState(0);
    const [loading, setLoading] = useState(false)

    useEffect(() =>{
        if(rentOrderList.status === 'unpaid' && rentOrderList.deposit !== 0){
            setAmount(rentOrderList.remainMoney + rentOrderList.deposit)
        }else{
            setAmount(rentOrderList.remainMoney)
        }
    }, [rentOrderList])

    const handlePaymentCash = async () =>{
        if(amount < 1000){
            dispatch(setNoti({type: 'error', message: 'Số tiền nhập vào ít nhất là 1.000 VNĐ'}))
            return;
        }
        setLoading(true)
        await onSubmit(rentOrderList.id, amount)
        setLoading(false)
    }
    const handleClose = () =>{
        setAmount(0)
        onClose()
    }

    const handleChangeAmount = (values: CurrencyFormat.Values) =>{
        let max = rentOrderList.remainMoney
        if(rentOrderList.status === 'unpaid' && rentOrderList.deposit !== 0){
            max += rentOrderList.deposit
        }

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
            remainMoney: status === 'unpaid' ? remainMoney + deposit : remainMoney,
            deposit
        }
    }, [rentOrderList])

    return (
        <Modal
            title={`Thanh toán tiền cho đơn hàng "${rentOrderList.orderCode}"`}
            open
            onCancel={handleClose}
            width={1000}
            footer={false}
        >
            <p>Nhập số tiền cần thanh toán (VND)</p>
            <CurrencyFormat min={0} value={amount} isAllowed={handleChangeAmount} className='currency-input' thousandSeparator={true} />
            {
                (rentOrderList.status === 'unpaid' && rentOrderList.deposit !== 0) &&
                <p style={{color: '#ff002f', marginTop: '10px'}}>Đơn hàng chưa thanh toán cọc. Số tiền cần thanh toán = Tiền còn thiếu + tiền cọc</p>
            }
            <UserInforOrder {...InforOrder} />
            <div className='btn-form-wrapper mt-10'>
                <Button type='default' disabled={loading} className='btn-cancel' size='large' onClick={onClose} >Hủy bỏ</Button>
                <Button type='primary' loading={loading} className='btn-update' size='large' onClick={handlePaymentCash}>
                    Thanh toán
                </Button>
            </div>
        </Modal>
    )
}

export default RentOrderPaymentCash