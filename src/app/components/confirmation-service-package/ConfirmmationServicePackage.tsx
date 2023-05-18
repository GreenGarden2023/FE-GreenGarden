import { Button, Modal } from 'antd';
import useDispatch from 'app/hooks/use-dispatch';
import { PackageService } from 'app/models/package';
import takeCareComboService from 'app/services/take-care-combo.service';
import { setNoti } from 'app/slices/notification';
import React, { useState } from 'react'

interface ConfirmmationServicePackageProps{
    handler: 'Accept' | 'Reject'
    pkgService: PackageService
    onClose: () => void;
    onSubmit: () => void;
}

const ConfirmmationServicePackage: React.FC<ConfirmmationServicePackageProps> = ({ handler, pkgService, onClose, onSubmit }) => {
    const dispatch = useDispatch();
    const [actionLoading, setActionLoading] = useState(false)

    const handleSubmitRequest = async () =>{
        setActionLoading(true)
        try{
            if(handler === 'Accept'){
                await takeCareComboService.changeTakeCareComboServiceStatus({takecareComboServiceId: pkgService.id, status: 'accepted'})
                dispatch(setNoti({type: 'success', message: `Chấp nhận yêu cầu dịch vụ chăm sóc (${pkgService.code}) thành công`}))
            }else{
                await takeCareComboService.changeTakeCareComboServiceStatus({takecareComboServiceId: pkgService.id, status: 'rejected'})
                dispatch(setNoti({type: 'success', message: `Từ chối yêu cầu dịch vụ chăm sóc (${pkgService.code}) thành công`}))
            }
            onSubmit()
            onClose()
        }catch{

        }
        setActionLoading(false)
    }

    return (
        <Modal
            open
            title={`${handler === 'Accept' ? 'Chấp nhận' : 'Từ chối'} yêu cầu chăm sóc cho gói (${pkgService.code})`}
            onCancel={onClose}
            width={800}
            footer={false}
        >
            <div className='btn-form-wrapper'>
                <Button htmlType='button' disabled={actionLoading} type='default' className='btn-cancel' size='large' onClick={onClose}>Hủy bỏ</Button>
                <Button htmlType='submit' loading={actionLoading} type='primary' className='btn-update' size='large' onClick={handleSubmitRequest} >
                    Xác nhận
                </Button>
            </div>
        </Modal>
    )
}

export default ConfirmmationServicePackage