import { Modal, Select } from 'antd'
import useDispatch from 'app/hooks/use-dispatch';
import { Service } from 'app/models/service'
import { UserGetByRole } from 'app/models/user';
import authService from 'app/services/auth.service';
import serviceService from 'app/services/service.service';
import { setNoti } from 'app/slices/notification';
import React, { useEffect, useState } from 'react'

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

    const handleChange = (value) => {
        setUserSelected(value)
    }
    const handleSubmit = async () =>{
        if(!userSelected){
            dispatch(setNoti({type: 'warning', message: 'Người chăm sóc không được để trống'}))
            return;
        }
        try{
            await serviceService.assignServiceTechnician(service.id, userSelected)
            const [user] = users.filter(x => x.id === userSelected)
            dispatch(setNoti({type: 'success', message: `Chọn người chăm sóc cho đơn hàng ${service.id} thành công`}))
            onSubmit(service.id, user)
        }catch{

        }
    }

    return (
        <Modal
            open
            title={`Chọn chuyên gia chăm sóc cho đơn hàng ${service.id}`}
            width={1000}
            onCancel={onClose}
            onOk={handleSubmit}
        >
            <p>Chọn chuyên gia</p>
            <Select onChange={handleChange} value={userSelected} style={{ width: 250 }} >
                {
                    users.map((item, index) => (
                        <Select.Option key={index} value={item.id}>
                            {item.fullName}
                        </Select.Option>
                    ))
                }
            </Select>
        </Modal>
    )
}

export default AssignTechnician