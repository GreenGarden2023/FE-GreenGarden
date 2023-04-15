import { Button, Form, Input, Modal } from 'antd';
import useDispatch from 'app/hooks/use-dispatch';
import { OrderType } from 'app/models/general-type';
import orderService from 'app/services/order.service';
import { setNoti } from 'app/slices/notification';
import React, { useState } from 'react'

interface CancelOrderProps{
    orderId: string;
    orderCode: string;
    orderType: OrderType;
    onClose: () => void;
    onSubmit: (reason: string) => void;
}

const CancelOrder: React.FC<CancelOrderProps> = ({ orderId, orderCode, orderType, onClose, onSubmit }) => {
    const dispatch = useDispatch()
    const [reason, setReason] = useState('')

    const handleSubmit = async () =>{
        try{
            await orderService.cancelOrder(orderId, orderType, reason)
            dispatch(setNoti({type: 'success', message: `Hủy đơn hàng "${orderCode}" thành công`}))
            onSubmit(reason)
        }catch{
            
        }
    }
    return (
        <Modal
            open
            title={`Xác nhận hủy đơn hàng ${orderCode}`}
            onCancel={onClose}
            width={800}
            footer={false}
        >
            <Form
                layout='vertical'
                onFinish={handleSubmit}
            >
                <Form.Item label='Lý do hủy đơn hàng'>
                    <Input.TextArea autoSize={{minRows: 4, maxRows: 6}} value={reason} onChange={(e) => setReason(e.target.value)} ></Input.TextArea>
                </Form.Item>
                <div className='btn-form-wrapper'>
                    <Button htmlType='button' type='default' className='btn-cancel' size='large' onClick={onClose}>Hủy bỏ</Button>
                    <Button htmlType='submit' type='primary' className='btn-update' size='large'>
                        Xác nhận
                    </Button>
                </div>
            </Form>
        </Modal>
    )
}

export default CancelOrder