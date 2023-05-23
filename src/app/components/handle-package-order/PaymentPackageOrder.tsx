import { Button, Form, Modal } from 'antd'
import useDispatch from 'app/hooks/use-dispatch';
import { PackageOrder } from 'app/models/package';
import takeComboOrderService from 'app/services/take-combo-order.service';
import { setNoti } from 'app/slices/notification';
import React, { useEffect, useState } from 'react'
import CurrencyFormat from 'react-currency-format';

interface PaymentPackageOrderProps{
    pkgOrder: PackageOrder
    onClose: () => void;
    onSubmit: (pkgOrder: PackageOrder) => void;
}

const PaymentPackageOrder: React.FC<PaymentPackageOrderProps> = ({ pkgOrder, onClose, onSubmit }) => {
    const dispatch = useDispatch()
    const [loadingAction, setLoadingAction] = useState(false)

    const [amount, setAmount] = useState(0);

    useEffect(() =>{
        if(pkgOrder.status === 'unpaid' && pkgOrder.deposit !== 0){
            setAmount(pkgOrder.remainAmount + pkgOrder.deposit)
        }else{
            setAmount(pkgOrder.remainAmount)
        }
    }, [pkgOrder])

    const handleChangeAmount = (values: CurrencyFormat.Values) =>{
        let max = pkgOrder.remainAmount
        if(pkgOrder.status === 'unpaid' && pkgOrder.deposit !== 0){
            max += pkgOrder.deposit
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

    const handleSubmit = async () =>{
        setLoadingAction(true)
        try{
            const res = await takeComboOrderService.orderPaymentCash(pkgOrder.id, amount, 'normal')
            if(res.isSuccess){
                dispatch(setNoti({type: 'success', message: `Thanh toán đủ cho đơn hàng (${pkgOrder.orderCode}) thành công`}))
                pkgOrder.status = 'paid'
                pkgOrder.remainAmount = pkgOrder.remainAmount - amount
                onSubmit(pkgOrder)
                onClose()
            }
        }catch{

        }
        setLoadingAction(false)
    }

    return (
        <Modal
            open
            title={`Thanh toán cho đơn hàng (${pkgOrder.orderCode})`}
            onCancel={onClose}
            footer={false}
            width={800}
        >
            <Form
                labelAlign='left'
                layout='vertical'
                onFinish={handleSubmit}
            >
                <CurrencyFormat min={0} value={amount} isAllowed={handleChangeAmount} className='currency-input' thousandSeparator={true} />
                {
                    (pkgOrder.status === 'unpaid' && pkgOrder.deposit !== 0) &&
                    <p style={{color: '#ff002f', marginTop: '10px'}}>Đơn hàng chưa thanh toán cọc. Số tiền cần thanh toán = Tiền còn thiếu + tiền cọc</p>
                }
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

export default PaymentPackageOrder