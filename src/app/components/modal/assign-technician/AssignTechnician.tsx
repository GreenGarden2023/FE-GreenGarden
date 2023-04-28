import { Button, Modal, Radio, RadioChangeEvent, Space } from 'antd'
import useDispatch from 'app/hooks/use-dispatch';
import { Service } from 'app/models/service'
import { UserGetByRole } from 'app/models/user';
import authService from 'app/services/auth.service';
import serviceService from 'app/services/service.service';
import { setNoti } from 'app/slices/notification';
import React, { useEffect, useState } from 'react'
import { AiOutlineUser } from 'react-icons/ai';
import './style.scss'
import CONSTANT from 'app/utils/constant';
import LoadingView from 'app/components/loading-view/LoadingView';

interface AssignTechnicianProps{
    service: Service;
    onClose: () => void;
    onSubmit: (serviveId: string, user: UserGetByRole) => void;
}

const AssignTechnician: React.FC<AssignTechnicianProps> = ({service, onClose, onSubmit}) => {
    const dispatch = useDispatch()

    const [users, setUsers] = useState<UserGetByRole[]>([])
    const [userSelected, setUserSelected] = useState(service.technicianID)
    const [loading, setLoading] = useState(true)
    const [loadingAction, setLoadingAction] = useState(false)

    useEffect(() =>{
        const init = async () =>{
            setLoading(true)
            try{
                const res = await authService.getUserListByRole('technician')
                setUsers(res.data)
                if(!userSelected && res.data && res.data.length !== 0){
                    const resUsers = [...res.data]
                    const newUsers = resUsers.sort((a, b) => a.orderNumber - b.orderNumber)
                    setUserSelected(newUsers[0].id)
                }
            }catch{
                dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
            }
            setLoading(false)
        }
        init()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch])

    const handleChange = (e: RadioChangeEvent) => {
        setUserSelected(e.target.value)
    }
    const handleSubmit = async () =>{
        if(!userSelected){
            dispatch(setNoti({type: 'warning', message: 'Người chăm sóc không được để trống'}))
            return;
        }
        setLoadingAction(true)
        try{
            await serviceService.assignServiceTechnician(service.id, userSelected)
            const [user] = users.filter(x => x.id === userSelected)
            dispatch(setNoti({type: 'success', message: `Chọn người chăm sóc cho yêu cầu ${service.serviceCode} thành công`}))
            onSubmit(service.id, user)
        }catch{
            dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
        }
        setLoadingAction(false)
    }

    return (
        <Modal
            open
            title={`Chọn chuyên gia chăm sóc cho yêu cầu "${service.serviceCode}"`}
            width={1000}
            onCancel={onClose}
            footer={false}
        >
            <div className="assign-tech-wrapper">
                {
                    loading ? <LoadingView loading /> :
                    <>
                        <p>Chọn chuyên gia</p>
                        <Radio.Group value={userSelected} onChange={handleChange} >
                            <Space direction="vertical">
                                {
                                    users.map((user, index) => (
                                        <Radio key={index} value={user.id} >
                                            <div className='radio-wrapper'>
                                                <AiOutlineUser color='#0099FF' />
                                                <span className='tech-name'>{user.fullName}</span>
                                                <span className='tech-num-order'>({user.orderNumber})</span>
                                            </div>
                                        </Radio>
                                    ))
                                }
                            </Space>
                        </Radio.Group>
                        <div className='btn-form-wrapper mt-10'>
                            <Button htmlType='button' disabled={loadingAction} type='default' className='btn-cancel' size='large' onClick={onClose} >Hủy bỏ</Button>
                            <Button htmlType='submit' loading={loadingAction} type='primary' className='btn-update' size='large' onClick={handleSubmit}>
                                Phân công
                            </Button>
                        </div>
                    </>
                }
            </div>
        </Modal>
    )
}

export default AssignTechnician