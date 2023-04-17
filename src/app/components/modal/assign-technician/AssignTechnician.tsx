import { Modal, Radio, RadioChangeEvent, Space } from 'antd'
import useDispatch from 'app/hooks/use-dispatch';
import { Service } from 'app/models/service'
import { UserGetByRole } from 'app/models/user';
import authService from 'app/services/auth.service';
import serviceService from 'app/services/service.service';
import { setNoti } from 'app/slices/notification';
import React, { useEffect, useState } from 'react'
import { AiOutlineUser } from 'react-icons/ai';
import './style.scss'

interface AssignTechnicianProps{
    service: Service;
    onClose: () => void;
    onSubmit: (serviveId: string, user: UserGetByRole) => void;
}

const AssignTechnician: React.FC<AssignTechnicianProps> = ({service, onClose, onSubmit}) => {
    const dispatch = useDispatch()


    const [users, setUsers] = useState<UserGetByRole[]>([])
    const [userSelected, setUserSelected] = useState(service.technicianID)

    useEffect(() =>{
        const init = async () =>{
            try{
                const res = await authService.getUserListByRole('technician')
                return setUsers(res.data)
            }catch{

            }
        }
        init()
    }, [])

    const handleChange = (e: RadioChangeEvent) => {
        setUserSelected(e.target.value)
    }
    const handleSubmit = async () =>{
        if(!userSelected){
            dispatch(setNoti({type: 'warning', message: 'Người chăm sóc không được để trống'}))
            return;
        }
        try{
            await serviceService.assignServiceTechnician(service.id, userSelected)
            const [user] = users.filter(x => x.id === userSelected)
            dispatch(setNoti({type: 'success', message: `Chọn người chăm sóc cho yêu cầu ${service.serviceCode} thành công`}))
            onSubmit(service.id, user)
        }catch{

        }
    }

    return (
        <Modal
            open
            title={`Chọn chuyên gia chăm sóc cho yêu cầu "${service.serviceCode}"`}
            width={1000}
            onCancel={onClose}
            onOk={handleSubmit}
        >
            <div className="assign-tech-wrapper">
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
            </div>
        </Modal>
    )
}

export default AssignTechnician