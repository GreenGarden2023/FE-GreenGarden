import { Button, Modal } from 'antd';
import useDispatch from 'app/hooks/use-dispatch';
import { PackageOrder } from 'app/models/package';
import takeComboOrderService from 'app/services/take-combo-order.service';
import { setNoti } from 'app/slices/notification';
import React, { useState } from 'react'

interface CompletePackageOrderProps{
    pkgOrder: PackageOrder
    onClose: () => void;
    onSubmit: (pkgOrder: PackageOrder) => void;
}

const CompletePackageOrder: React.FC<CompletePackageOrderProps> = ({ pkgOrder, onClose, onSubmit }) => {
    const dispatch = useDispatch()
    const [loadingAction, setLoadingAction] = useState(false)

    const handleSubmit = async () =>{
        setLoadingAction(true)
        try{
            const res = await takeComboOrderService.updateOrderStatus(pkgOrder.id, 'completed')
            if(res.isSuccess){
                dispatch(setNoti({type: 'success', message: `Cập nhật trạng thái hoàn thành cho đơn hàng (${pkgOrder.orderCode})`}))
                pkgOrder.status = 'completed'
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
            title={`Xác nhận đã hoàn thành đơn hàng (${pkgOrder.orderCode})`}
            width={800}
            onCancel={onClose}
            footer={false}
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

export default CompletePackageOrder