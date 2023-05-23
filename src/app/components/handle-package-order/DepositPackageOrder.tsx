import { Button, Modal } from 'antd';
import useDispatch from 'app/hooks/use-dispatch';
import { PackageOrder } from 'app/models/package'
import takeComboOrderService from 'app/services/take-combo-order.service';
import { setNoti } from 'app/slices/notification';
import React, { useState } from 'react'

interface DepositPackageOrderProps{
    pkgOrder: PackageOrder
    onClose: () => void;
    onSubmit: (pkgOrder: PackageOrder) => void;
}

const DepositPackageOrder: React.FC<DepositPackageOrderProps> = ({pkgOrder, onClose, onSubmit}) => {
    const dispatch = useDispatch()
    const [loadingAction, setLoadingAction] = useState(false)

    const handleSubmit = async () =>{
        setLoadingAction(true)
        try{
            const res = await takeComboOrderService.depositPaymentCash(pkgOrder.id)
            if(res.isSuccess){
                dispatch(setNoti({type: 'success', message: `Thanh toán cọc cho đơn hàng (${pkgOrder.orderCode}) thành công`}))
                const amountPrice = pkgOrder.totalPrice - pkgOrder.deposit
                pkgOrder.status = 'ready'
                pkgOrder.remainAmount = amountPrice
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
            title={`Xác nhận thanh toán tiền cọc cho đơn hàng (${pkgOrder.orderCode})`}
            onCancel={onClose}
            footer={false}
            width={800}
        >
            <div className='btn-form-wrapper' style={{marginTop: '15px'}}>
                <Button htmlType='button' disabled={loadingAction} type='default' className='btn-cancel' size='large' onClick={onClose}>Hủy bỏ</Button>
                <Button htmlType='submit' loading={loadingAction} type='primary' className='btn-update' size='large' onClick={handleSubmit} >
                    Xác nhận
                </Button>
            </div>
        </Modal>
    )
}

export default DepositPackageOrder