import { Button, Form, Input, Modal } from 'antd';
import CurrencyInput from 'app/components/renderer/currency-input/CurrencyInput';
import UserInforOrder from 'app/components/user-infor/user-infor-order/UserInforOrder';
import useDispatch from 'app/hooks/use-dispatch';
import { OrderType, TransactionType } from 'app/models/general-type';
import { TransactionHandle } from 'app/models/transaction';
import transactionService from 'app/services/transaction.service';
import { setNoti } from 'app/slices/notification';
import CONSTANT from 'app/utils/constant';
import React, { useState } from 'react'
import CurrencyFormat from 'react-currency-format';

interface RefundOrderProps{
    orderId: string;
    orderCode: string;
    orderType: OrderType;
    transactionType: TransactionType
    userInforOrder: any;
    onClose: () => void;
    onSubmit: () => void;
}

const RefundOrder: React.FC<RefundOrderProps> = ({orderId, orderCode, orderType, transactionType, userInforOrder, onClose, onSubmit}) => {
    const dispatch = useDispatch()
    const [amount, setAmount] = useState(0)
    const [desc, setDesc] = useState('')

    const [loading, setLoading] = useState(false)

    const handleRefundOrder = async () =>{
        if(amount < 1000){
            dispatch(setNoti({type: 'warning', message: 'Số tiền nhập vào ít nhất là 1000VNĐ'}))
            return
        }

        setLoading(true)
        try{
            const body: TransactionHandle = {
                orderID: orderId,
                amount: amount,
                description: desc,
                orderType: orderType,
                paymentType: 'cash',
                status: 'refund',
                transactionType: transactionType
            }
            await transactionService.createTransaction(body)
            dispatch(setNoti({type: 'success', message: `Đã hoàn ${amount}VNĐ cho đơn hàng ${orderCode}`}))
            setAmount(0)
            setDesc('')
            onSubmit()
        }catch{
            dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
        }
        setLoading(false)
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
            width={800}
            footer={false}
        >
            <Form
                layout='vertical'
                onFinish={handleRefundOrder}
            >
                <Form.Item label='Nhập số tiền cần trả (VND)'>
                    <CurrencyInput min={0} value={amount} onChange={handleChangeAmount} />
                </Form.Item>
                <Form.Item label='Ghi chú'>
                    <Input.TextArea autoSize={{minRows: 4, maxRows: 6}} value={desc} onChange={(e) => setDesc(e.target.value)} ></Input.TextArea>
                </Form.Item>
                <UserInforOrder {...userInforOrder} columnNumber={2} />
                <div className='btn-form-wrapper mt-10'>
                    <Button htmlType='button' disabled={loading} type='default' className='btn-cancel' size='large' >Hủy bỏ</Button>
                    <Button htmlType='submit' loading={loading} type='primary' className='btn-update' size='large'>
                        Xác nhận
                    </Button>
                </div>
            </Form>
        </Modal>
    )
}

export default RefundOrder