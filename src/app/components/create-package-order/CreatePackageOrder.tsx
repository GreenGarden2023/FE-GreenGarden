import { Button, Modal } from 'antd';
import useDispatch from 'app/hooks/use-dispatch';
import { PackageService } from 'app/models/package';
import takeComboOrderService from 'app/services/take-combo-order.service';
import { setNoti } from 'app/slices/notification';
import React, { useState } from 'react'

interface CreatePackageOrderProps{
    pkgService: PackageService
    onClose: () => void;
    onSubmit: () => void;
}

const CreatePackageOrder: React.FC<CreatePackageOrderProps> = ({ pkgService, onClose, onSubmit }) => {
    const dispatch = useDispatch()
    const [loadingAction, setLoadingAction] = useState(false)

    const handleSubmit = async () =>{
        setLoadingAction(true)
        try{
            await takeComboOrderService.createOrder(pkgService.id)
            dispatch(setNoti({type: 'success', message: `Tạo mới đơn hàng cho gói chăm sóc (${pkgService.code}) thành công`}))
            onSubmit()
            onClose()
        }catch{

        }
        setLoadingAction(false)
    }

    return (
        <Modal
            open
            title={`Xác nhận tạo đơn hàng cho yêu cầu chăm sóc (${pkgService.code})`}
            onCancel={onClose}
            footer={false}
            width={800}
        >
            <div className='btn-form-wrapper mt-10'>
                <Button htmlType='button' disabled={loadingAction} type='default' className='btn-cancel' size='large' onClick={onClose} >Hủy bỏ</Button>
                <Button htmlType='submit' loading={loadingAction} type='primary' className='btn-update' size='large' onClick={handleSubmit}>
                    Xác nhận
                </Button>
            </div>
        </Modal>
    )
}

export default CreatePackageOrder