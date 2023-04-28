import { Button, Modal } from 'antd';
import useDispatch from 'app/hooks/use-dispatch';
import orderService from 'app/services/order.service';
import { setNoti } from 'app/slices/notification';
import CONSTANT from 'app/utils/constant';
import React, { useState } from 'react'

interface SaleDeliveryProps{
    orderId: string;
    orderCode: string;
    type: 'rent' | 'sale'
    onClose: () => void;
    onSubmit: () => void;
}

const SaleDelivery: React.FC<SaleDeliveryProps> = ({orderId, orderCode, type, onClose, onSubmit}) => {
    const dispatch = useDispatch()

    const [loading, setLoading] = useState(false)

    const handleSubmitForm = async () =>{
        setLoading(true)
        if(type === 'sale'){
            try{
                await orderService.updateSaleOrderStatus(orderId, 'delivery')
                dispatch(setNoti({type: 'success', message: `Cập nhật trạng thái vận chuyển cho đơn hàng "${orderCode}" thành công`}))
                onSubmit()
            }catch{
                dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
            }
        }else{
            try{
                await orderService.updateRentOrderStatus(orderId, 'delivery')
                dispatch(setNoti({type: 'success', message: `Cập nhật trạng thái vận chuyển cho đơn hàng "${orderCode}" thành công`}))
                onSubmit()
            }catch{
                dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
            }
        }
        setLoading(false)
    }

    return (
        <Modal
            open
            title={`Chuyển trạng thái vận chuyển cho đơn hàng "${orderCode}"`}
            onOk={handleSubmitForm}
            footer={false}
        >
            <div className='btn-form-wrapper mt-10'>
                <Button htmlType='button' disabled={loading} type='default' className='btn-cancel' size='large' onClick={onClose} >Hủy bỏ</Button>
                <Button htmlType='submit' loading={loading} type='primary' className='btn-update' size='large' onClick={handleSubmitForm}>
                    Chuyển trạng thái
                </Button>
            </div>
        </Modal>
    )
}

export default SaleDelivery