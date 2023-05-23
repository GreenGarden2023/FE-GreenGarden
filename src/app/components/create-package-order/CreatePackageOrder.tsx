import { Modal } from 'antd';
import useDispatch from 'app/hooks/use-dispatch';
import { PackageService } from 'app/models/package';
import takeComboOrderService from 'app/services/take-combo-order.service';
import { setNoti } from 'app/slices/notification';
import React from 'react'

interface CreatePackageOrderProps{
    pkgService: PackageService
    onClose: () => void;
    onSubmit: () => void;
}

const CreatePackageOrder: React.FC<CreatePackageOrderProps> = ({ pkgService, onClose, onSubmit }) => {
    const dispatch = useDispatch()

    const handleSubmit = async () =>{
        try{
            await takeComboOrderService.createOrder(pkgService.id)
            dispatch(setNoti({type: 'success', message: `Tạo mới đơn hàng cho gói chăm sóc (${pkgService.code}) thành công`}))
            onSubmit()
            onClose()
        }catch{

        }
    }

    return (
        <Modal
            open
            title={`Xác nhận tạo đơn hàng cho yêu cầu chăm sóc (${pkgService.code})`}
            onCancel={onClose}
            onOk={handleSubmit}
        >

        </Modal>
    )
}

export default CreatePackageOrder