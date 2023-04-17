import { Form, Modal } from 'antd';
import { User } from 'app/models/user'
import React from 'react'
// import { useForm } from 'react-hook-form';

interface AdminUpdateUserProps{
    user?: User
    onClose: () => void;
    onSubmit: () => void;
}

const AdminUpdateUser: React.FC<AdminUpdateUserProps> = ({user, onClose, onSubmit}) => {

    // const {  } = useForm<>

    return (
        <Modal
            open
            title={`${user ? 'Cập nhật' : 'Tạo mới'} thông tin người dùng`}
            onCancel={onClose}
        >
            <Form
                layout='vertical'
                // onFinish={}
            >

            </Form>
        </Modal>
    )
}

export default AdminUpdateUser