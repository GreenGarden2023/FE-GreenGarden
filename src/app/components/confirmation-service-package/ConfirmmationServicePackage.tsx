import { Button, Form, Input, Modal } from 'antd';
import useDispatch from 'app/hooks/use-dispatch';
import useSelector from 'app/hooks/use-selector';
import { PackageService } from 'app/models/package';
import takeCareComboService from 'app/services/take-care-combo.service';
import { setNoti } from 'app/slices/notification';
import React, { useState } from 'react'

interface ConfirmmationServicePackageProps{
    handler: 'Accept' | 'Reject'
    pkgService: PackageService
    isClient?: boolean;
    onClose: () => void;
    onSubmit: (pkgService: PackageService) => void;
}

const ConfirmmationServicePackage: React.FC<ConfirmmationServicePackageProps> = ({ handler, pkgService, isClient, onClose, onSubmit }) => {
    const { user } = useSelector(state => state.userInfor)

    const dispatch = useDispatch();
    const [actionLoading, setActionLoading] = useState(false)
    const [reason, setReason] = useState('')

    const handleSubmitRequest = async () =>{
        setActionLoading(true)
        try{
            if(handler === 'Accept'){
                await takeCareComboService.changeTakeCareComboServiceStatus({takecareComboServiceId: pkgService.id, status: 'accepted'})
                dispatch(setNoti({type: 'success', message: `Chấp nhận yêu cầu dịch vụ chăm sóc (${pkgService.code}) thành công`}))
                pkgService.status = 'accepted'
            }else{
                if(isClient){
                    await takeCareComboService.cancelTakeCareComboService(pkgService.id, reason)
                    dispatch(setNoti({type: 'success', message: `Hủy yêu cầu dịch vụ chăm sóc (${pkgService.code}) thành công`}))
                    pkgService.status = 'cancel'
                }else{
                    await takeCareComboService.rejectTakeCareComboService(pkgService.id, reason)
                    dispatch(setNoti({type: 'success', message: `Từ chối yêu cầu dịch vụ chăm sóc (${pkgService.code}) thành công`}))
                    pkgService.status = 'rejected'
                }

                pkgService.reason = reason
                pkgService.nameCancelBy = user.fullName
                setReason('')
            }
            onSubmit(pkgService)
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
            <Form
                labelAlign='left'
                layout='vertical'
                onFinish={handleSubmitRequest}
            >
                {
                    handler === 'Reject' &&
                    <Form.Item label='Lý do hủy yêu cầu' >
                        <Input.TextArea autoSize={{minRows: 4, maxRows: 6}} value={reason} onChange={(e) => setReason(e.target.value)} ></Input.TextArea>
                    </Form.Item>
                }
                <div className='btn-form-wrapper'>
                    <Button htmlType='button' disabled={actionLoading} type='default' className='btn-cancel' size='large' onClick={onClose}>Hủy bỏ</Button>
                    <Button htmlType='submit' loading={actionLoading} type='primary' className='btn-update' size='large' >
                        Xác nhận
                    </Button>
                </div>
            </Form>
        </Modal>
    )
}

export default ConfirmmationServicePackage