import { Button, Modal, Radio, RadioChangeEvent, Space } from 'antd';
import useDispatch from 'app/hooks/use-dispatch';
import { PackageService } from 'app/models/package'
import { UserGetByRole } from 'app/models/user';
import authService from 'app/services/auth.service';
import takeCareComboService from 'app/services/take-care-combo.service';
import { setNoti } from 'app/slices/notification';
import CONSTANT from 'app/utils/constant';
import React, { useEffect, useState } from 'react'
import { AiOutlineUser } from 'react-icons/ai';

interface AssignServicePackageProps{
    pkgService: PackageService;
    onClose: () => void;
    onSubmit: (user: UserGetByRole) => void;
}

const AssignServicePackage: React.FC<AssignServicePackageProps> = ({ pkgService, onClose, onSubmit}) => {
    const dispatch = useDispatch()

    const [users, setUsers] = useState<UserGetByRole[]>([])
    const [userSelected, setUserSelected] = useState(pkgService.technicianId !== '00000000-0000-0000-0000-000000000000' ? pkgService.technicianId : '')

    useEffect(() =>{
        const init = async () =>{
            // setLoading(true)
            try{
                const res = await authService.getUserListByRole('technician')
                setUsers(res.data)
                if(!userSelected && res.data && res.data.length !== 0){
                    const resUsers = [...res.data]
                    const newUsers = resUsers.sort((a, b) => a.orderNumber - b.orderNumber)
                    console.log(newUsers[0])
                    setUserSelected(newUsers[0].id)
                }
            }catch{
                dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
            }
            // setLoading(false)
        }
        init()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch])

    const handleSubmitForm = async () =>{
        try{
            await takeCareComboService.assignTakeCareComboServiceTechnician({
                takecareComboServiceId: pkgService.id,
                technicianID: userSelected
            })
            const [userSubmit] = users.filter(x => x.id === userSelected)
            onSubmit(userSubmit)
            onClose()
            dispatch(setNoti({type: 'success', message: `Chọn chuyên gia chăm sóc cho gói chăm sóc ${pkgService.code} thành công`}))
        }catch{

        }
    }
    const handleChange = (e: RadioChangeEvent) => {
        setUserSelected(e.target.value)
    }

    return (
        <Modal
            open
            title={`Chọn chuyên gia chăm sóc cho gói chăm sóc (${pkgService.code})`}
            width={1000}
            onCancel={onClose}
            footer={false}
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
                <div className='btn-form-wrapper mt-10'>
                    <Button htmlType='button'  type='default' className='btn-cancel' size='large' onClick={onClose} >Hủy bỏ</Button>
                    <Button htmlType='submit'  type='primary' className='btn-update' size='large' onClick={handleSubmitForm}>
                        Phân công
                    </Button>
                </div>
            </div>
        </Modal>
    )
}

export default AssignServicePackage