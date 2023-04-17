import { Modal } from 'antd';
import useDispatch from 'app/hooks/use-dispatch';
import orderService from 'app/services/order.service';
import { setNoti } from 'app/slices/notification';
import React from 'react'

interface FinishOrderProps{
    orderId: string;
    orderCode: string;
    type: 'rent' | 'sale'
    onClose: () => void;
    onSubmit: () => void;
}

const FinishOrder: React.FC<FinishOrderProps> = ({ orderId, orderCode, type, onClose, onSubmit }) => {
    const dispatch = useDispatch();

    const handleSubmitForm = async () =>{
        if(type === 'sale'){
            try{
                await orderService.updateSaleOrderStatus(orderId, 'completed')
                dispatch(setNoti({type: 'success', message: `Cập nhật trạng thái hoàn thành cho đơn hàng ${orderCode}`}))
                onSubmit()
            }catch{

            }
        }else{
            try{
                await orderService.updateRentOrderStatus(orderId, 'completed')
                dispatch(setNoti({type: 'success', message: `Cập nhật trạng thái hoàn thành cho đơn hàng ${orderCode}`}))
                onSubmit()
            }catch{

            }
        }
    }
    return (
        <Modal
            open
            title={`Xác nhận đã hoàn thành đơn hàng "${orderCode}"`}
            onCancel={onClose}
            onOk={handleSubmitForm}
        >

        </Modal>
    )
}

export default FinishOrder