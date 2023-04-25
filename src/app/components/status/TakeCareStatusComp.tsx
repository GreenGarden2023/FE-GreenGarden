import { Tag } from 'antd'
import { TakeCareStatus } from 'app/models/general-type'
import React from 'react'
import { SyncOutlined } from '@ant-design/icons'
import { MdDoneAll } from 'react-icons/md'

interface TakeCareStatusCompProps{
    status: TakeCareStatus
}

const TakeCareStatusComp: React.FC<TakeCareStatusCompProps> = ({ status }) => {
    switch(status){
        case 'pending': return <Tag className='center' color='#AAAAAA' icon={<SyncOutlined />} >Đang chuẩn bị</Tag>
        default: return <Tag className='center' color='#2db7f5' icon={<MdDoneAll />} >Đã hoàn thành</Tag>
    }
}

export default TakeCareStatusComp