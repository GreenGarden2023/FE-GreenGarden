import { Modal } from 'antd';
import useDispatch from 'app/hooks/use-dispatch';
import orderService from 'app/services/order.service';
import { setNoti } from 'app/slices/notification';
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
    console.log(loading)

    const handleSubmitForm = async () =>{
        setLoading(true)
        if(type === 'sale'){
            try{
                await orderService.updateSaleOrderStatus(orderId, 'delivery')
                dispatch(setNoti({type: 'success', message: `Cập nhật trạng thái vận chuyển cho đơn hàng "${orderCode}" thành công`}))
                onSubmit()
            }catch{

            }
        }else{
            try{
                await orderService.updateRentOrderStatus(orderId, 'delivery')
                dispatch(setNoti({type: 'success', message: `Cập nhật trạng thái vận chuyển cho đơn hàng "${orderCode}" thành công`}))
                onSubmit()
            }catch{

            }
        }
        setLoading(false)
    }

    return (
        <Modal
            open
            title={`Chuyển trạng thái vận chuyển cho đơn hàng "${orderCode}"`}
            onCancel={onClose}
            onOk={handleSubmitForm}
        >

        </Modal>
    )
}

export default SaleDelivery