import { Button, Form, Input, Modal } from 'antd';
import useDispatch from 'app/hooks/use-dispatch';
import { PackageOrder } from 'app/models/package';
import React, { useState } from 'react'
import CurrencyFormat from 'react-currency-format';
import CurrencyInput from '../renderer/currency-input/CurrencyInput';
import { setNoti } from 'app/slices/notification';
import { TransactionHandle } from 'app/models/transaction';
import transactionService from 'app/services/transaction.service';

interface RefundPackageOrderProps{
    pkgOrder: PackageOrder
    onClose: () => void;
}

const RefundPackageOrder: React.FC<RefundPackageOrderProps> = ({ pkgOrder, onClose }) => {
    const dispatch = useDispatch()
    const [loadingAction, setLoadingAction] = useState(false)

    const [amount, setAmount] = useState(0);
    const [desc, setDesc] = useState('')

    const handleChangeAmount = (values: CurrencyFormat.Values) =>{
        const { floatValue } = values
        const data = Number(floatValue || 0)
        setAmount(data)
    }

    const handleSubmit = async () =>{
        if(amount < 1000){
            dispatch(setNoti({type: 'warning', message: 'Số tiền nhập vào ít nhất là 1000VNĐ'}))
            return
        }

        setLoadingAction(true)
        try{
            const body: TransactionHandle = {
                orderID: pkgOrder.id,
                amount: amount,
                description: desc,
                orderType: 'combo',
                paymentType: 'cash',
                status: 'refund',
                transactionType: 'combo refund'
            }
            await transactionService.createTransaction(body)
            dispatch(setNoti({type: 'success', message: `Đã hoàn ${amount}VNĐ cho đơn hàng ${pkgOrder.orderCode}`}))
            setAmount(0)
            setDesc('')
            onClose()
        }catch{

        }
        setLoadingAction(false)
    }

    return (
        <Modal
            open
            title={`Hoàn tiền cho đơn hàng (${pkgOrder.orderCode})`}
            onCancel={onClose}
            footer={false}
            width={800}
        >
            <Form
                labelAlign='left'
                layout='vertical'
                onFinish={handleSubmit}
            >
                <Form.Item label='Nhập số tiền cần trả (VND)'>
                    <CurrencyInput min={0} value={amount} onChange={handleChangeAmount} />
                </Form.Item>
                <Form.Item label='Ghi chú'>
                    <Input.TextArea autoSize={{minRows: 4, maxRows: 6}} value={desc} onChange={(e) => setDesc(e.target.value)} ></Input.TextArea>
                </Form.Item>
                <div className='btn-form-wrapper' style={{marginTop: '15px'}}>
                    <Button htmlType='button' disabled={loadingAction} type='default' className='btn-cancel' size='large' onClick={onClose}>Hủy bỏ</Button>
                    <Button htmlType='submit' loading={loadingAction} type='primary' className='btn-update' size='large' >
                        Xác nhận
                    </Button>
                </div>
            </Form>
        </Modal>
    )
}

export default RefundPackageOrder