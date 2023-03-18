import React from 'react'
import { AiOutlinePhone } from 'react-icons/ai';
import { CiLocationOn } from 'react-icons/ci';
import { MdOutlineDriveFileRenameOutline } from 'react-icons/md';
import './style.scss'

interface UserInforTableProps{
    name: string;
    phone: string;
    address: string;
}

const UserInforTable: React.FC<UserInforTableProps> = ({ name, phone, address }) => {
  return (
    <div className='user-infor-table-wrapper'>
        <div className="user-box">
            <div className="left">
                <MdOutlineDriveFileRenameOutline size={20} color='#0099FF' />
                <span>Tên</span>
            </div>
            <div className="right">
                <span>{name}</span>
            </div>
        </div>
        <div className="user-box">
            <div className="left">
                <AiOutlinePhone size={20} color='#0099FF' />
                <span>SĐT</span>
            </div>
            <div className="right">
                <span>{phone}</span>
            </div>
        </div>
        <div className="user-box">
            <div className="left">
                <CiLocationOn size={20} color='#0099FF' />
                <span>Địa chỉ</span>
            </div>
            <div className="right">
                <span>{address}</span>
            </div>
        </div>
    </div>
  )
}

export default UserInforTable