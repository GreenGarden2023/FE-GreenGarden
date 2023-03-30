import { Input, Modal } from 'antd';
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
    onSubmit: () => void;
}

const CancelOrder: React.FC<CancelOrderProps> = ({ orderId, orderCode, orderType, onClose, onSubmit }) => {
    const dispatch = useDispatch()
    const [reason, setReason] = useState('')

    const handleSubmit = async () =>{
        try{
            await orderService.cancelOrder(orderId, orderType)
            dispatch(setNoti({type: 'success', message: `Hủy đơn hàng "${orderCode}" thành công`}))
            onSubmit()
        }catch{
            
        }
    }
    return (
        <Modal
            open
            title={`Xác nhận hủy đơn hàng ${orderCode}`}
            onCancel={onClose}
            onOk={handleSubmit}
        >
            <p>Lý do hủy đơn hàng</p>
            <Input.TextArea value={reason} onChange={(e) => setReason(e.target.value)} ></Input.TextArea>
        </Modal>
    )
}

export default CancelOrder