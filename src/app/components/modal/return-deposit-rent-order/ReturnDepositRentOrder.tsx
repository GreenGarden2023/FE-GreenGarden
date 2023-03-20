import { Modal } from 'antd';
import useDispatch from 'app/hooks/use-dispatch';
import { RentOrderList } from 'app/models/order'
import orderService from 'app/services/order.service';
import { setNoti } from 'app/slices/notification';
import React from 'react'

interface ReturnDepositRentOrderProps{
    rentOrderList: RentOrderList
    onClose: () => void;
    onSubmit: (rentOrderListId: string) => void;
}

const ReturnDepositRentOrder: React.FC<ReturnDepositRentOrderProps> = ({rentOrderList, onClose, onSubmit}) => {
    const dispatch = useDispatch();

    const handleConfirmReturnDeposit = async () =>{
        try{
            await orderService.updateRentOrderStatus(rentOrderList.id, 'completed')
            onSubmit(rentOrderList.id)
            dispatch(setNoti({type: 'success', message: `Đã hoàn cọc cho đơn hàng "${rentOrderList.orderCode}"`}))
        }catch{

        }
    }

    return (
        <Modal
            open
            title={`Xác nhận hoàn cọc cho đơn hàng ${rentOrderList.orderCode}`}
            onCancel={onClose}
            onOk={handleConfirmReturnDeposit}
        >

        </Modal>
    )
}

export default ReturnDepositRentOrder