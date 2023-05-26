import { Button, Form, Input, Modal } from 'antd'
import useDispatch from 'app/hooks/use-dispatch';
import { PackageOrder } from 'app/models/package'
import takeComboOrderService from 'app/services/take-combo-order.service';
import { setNoti } from 'app/slices/notification';
import React, { useState } from 'react'

interface ClientCancelPackageOrderProps{
    pkgOrder: PackageOrder;
    onClose: () => void;
    onSubmit: (pkgOrder: PackageOrder) => void;
}

const ClientCancelPackageOrder: React.FC<ClientCancelPackageOrderProps> = ({ pkgOrder, onClose, onSubmit }) => {
    const dispatch = useDispatch()

    const [loadingAction, setLoadingAction] = useState(false)

    const [reason, setReason] = useState('')

    const handleSubmitForm = async () =>{
        setLoadingAction(true)
        try{
            await takeComboOrderService.cancelOrder(pkgOrder.id, reason)
            dispatch(setNoti({type: 'success', message: `Xác nhận hủy đơn hàng (${pkgOrder.orderCode}) thành công`}))
            pkgOrder.status = 'cancel'
            // pkgOrder.reason = reason
            onSubmit(pkgOrder)
            onClose()
            setReason('')
        }catch{

        }
        setLoadingAction(false)
    }

    return (
        <Modal
            open
            title={`Xác nhận hủy đơn hàng (${pkgOrder.orderCode})`}
            onCancel={onClose}
            footer={false}
            width={800}
        >
            <Form
                labelAlign='left'
                layout='vertical'
                onFinish={handleSubmitForm}
            >
                <Form.Item label='Lý do hủy đơn hàng'>
                    <Input.TextArea autoSize={{minRows: 4, maxRows: 6}} value={reason} onChange={(e) => setReason(e.target.value)} ></Input.TextArea>
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

export default ClientCancelPackageOrder