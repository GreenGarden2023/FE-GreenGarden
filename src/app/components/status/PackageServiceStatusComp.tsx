import { Tag } from 'antd'
import { TServicePkgStatus } from 'app/models/general-type'
import React from 'react'
import { SyncOutlined } from '@ant-design/icons'
import { MdAttachMoney, MdDoneAll, MdOutlineCancel } from 'react-icons/md'
import { FaCheck } from 'react-icons/fa'

interface PackageServiceStatusCompProps{
    status: TServicePkgStatus
}

const PackageServiceStatusComp: React.FC<PackageServiceStatusCompProps> = ({ status }) => {
    switch(status){
        case 'pending': return <Tag className='center' color='#AAAAAA' icon={<SyncOutlined />} >Đang xử lý</Tag>
        case 'accepted': return <Tag className='center' color='#108ee9' icon={<MdAttachMoney />} >Chấp nhận yêu cầu</Tag>
        case 'rejected': return <Tag className='center' color='#87d068' icon={<FaCheck />} >Từ chối yêu cầu</Tag>
        case 'taking care': return <Tag className='center' color='#2db7f5' icon={<MdDoneAll />} >Đang chăm sóc</Tag>
        case 'reprocess': return <Tag className='center' color='#ECAB53' icon={<SyncOutlined />} >Xử lý lại</Tag>
        case 'cancel': return <Tag className='center' color='#528B8B' icon={<MdOutlineCancel />} >Đã bị hủy</Tag>
        // case 'renting': return <Tag className='center' color='#66CC99' icon={<MdForward5 />} >Đang thuê</Tag>
        default: return <>{status}</>
    }
}

export default PackageServiceStatusComp