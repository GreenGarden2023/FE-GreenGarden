import { Button, Modal } from 'antd';
import useDispatch from 'app/hooks/use-dispatch';
import orderService from 'app/services/order.service';
import { setNoti } from 'app/slices/notification';
import CONSTANT from 'app/utils/constant';
import React, { useState } from 'react'

interface FinishOrderProps{
    orderId: string;
    orderCode: string;
    type: 'rent' | 'sale' | 'service'
    onClose: () => void;
    onSubmit: () => void;
}

const FinishOrder: React.FC<FinishOrderProps> = ({ orderId, orderCode, type, onClose, onSubmit }) => {
    const dispatch = useDispatch();
    
    const [loading, setLoading] = useState(false)

    const handleSubmitForm = async () =>{
        setLoading(true)

        switch(type){
            case 'sale':
                try{
                    await orderService.updateSaleOrderStatus(orderId, 'completed')
                    dispatch(setNoti({type: 'success', message: `Cập nhật trạng thái hoàn thành cho đơn hàng ${orderCode}`}))
                    onSubmit()
                }catch{
                    dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
                }
                break;
            case 'rent':
                try{
                    await orderService.updateRentOrderStatus(orderId, 'completed')
                    dispatch(setNoti({type: 'success', message: `Cập nhật trạng thái hoàn thành cho đơn hàng ${orderCode}`}))
                    onSubmit()
                }catch{
                    dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
                }
                break;
            case 'service':
                try{
                    await orderService.updateServiceOrderStatus(orderId, 'completed')
                    dispatch(setNoti({type: 'success', message: `Cập nhật trạng thái hoàn thành cho đơn hàng ${orderCode}`}))
                    onSubmit()
                }catch{
                    dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
                }
                break;
        }
        setLoading(false)
    }
    return (
        <Modal
            open
            title={`Xác nhận đã hoàn thành đơn hàng "${orderCode}"`}
            onCancel={onClose}
            footer={false}
        >
            <div className='btn-form-wrapper mt-10'>
                <Button htmlType='button' disabled={loading} type='default' className='btn-cancel' size='large' onClick={onClose} >Hủy bỏ</Button>
                <Button htmlType='submit' loading={loading} type='primary' className='btn-update' size='large' onClick={handleSubmitForm}>
                    Xác nhận
                </Button>
            </div>
        </Modal>
    )
}

export default FinishOrder