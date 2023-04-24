import { SyncOutlined } from '@ant-design/icons'
import { Tag } from 'antd'
import { ServiceStatus } from 'app/models/general-type'
import React from 'react'
import { FaCheck } from 'react-icons/fa'
import { MdOutlineCancel, MdOutlineFileDownloadDone, MdOutlineKeyboardReturn } from 'react-icons/md'

interface ServiceStatusCompProps{
    status: ServiceStatus
}

const ServiceStatusComp: React.FC<ServiceStatusCompProps> = ({status}) => {
    switch(status){
        case 'processing': return <Tag className='center' icon={<SyncOutlined  />} color='default' >Đang xử lý</Tag>
        case 'accepted': return <Tag className='center' icon={<FaCheck  />} color='#2db7f5' >Chấp nhận yêu cầu</Tag>
        case 'rejected': return <Tag className='center' icon={<MdOutlineCancel  />} color='#f50'>Từ chối yêu cầu</Tag>
        case 'confirmed': return <Tag className='center' icon={<MdOutlineFileDownloadDone  />} color='#FF0066'>Đã tạo đơn hàng</Tag>
        case 'user approved': return <Tag className='center' icon={<MdOutlineFileDownloadDone  />} color='#87d068'>Đã xác nhận</Tag>
        case 'completed': return <Tag className='center' icon={<MdOutlineFileDownloadDone  />} color='#7AC5CD'>Đã hoàn thành</Tag>
        case 'cancel': return <Tag className='center' icon={<MdOutlineFileDownloadDone  />} color='#FF0000'>Đã hủy</Tag>
        case 'taking care': return <Tag className='center' icon={<MdOutlineFileDownloadDone  />} color='#F4A460'>Đang chăm sóc</Tag>
        default: return <Tag className='center' icon={<MdOutlineKeyboardReturn />} color='#108ee9'>Đang xử lý lại</Tag>
    }
}

export default ServiceStatusComp