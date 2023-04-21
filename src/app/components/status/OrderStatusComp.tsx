import { Tag } from 'antd'
import { OrderStatus } from 'app/models/general-type'
import React from 'react'
import { SyncOutlined } from '@ant-design/icons'
import { MdAttachMoney, MdDoneAll, MdForward5, MdOutlineCancel } from 'react-icons/md'
import { FaCheck } from 'react-icons/fa'
import { TbTruckDelivery } from 'react-icons/tb'

interface OrderStatusCompProps{
    status: OrderStatus
}

const OrderStatusComp: React.FC<OrderStatusCompProps> = ({ status }) => {
    switch(status){
        case 'unpaid': return <Tag className='center' color='#AAAAAA' icon={<SyncOutlined />} >Đang xử lý</Tag>
        case 'ready': return <Tag className='center' color='#108ee9' icon={<MdAttachMoney />} >Đã thanh toán cọc</Tag>
        case 'paid': return <Tag className='center' color='#87d068' icon={<FaCheck />} >Đã thanh toán đủ</Tag>
        case 'completed': return <Tag className='center' color='#2db7f5' icon={<MdDoneAll />} >Đã hoàn thành</Tag>
        case 'delivery': return <Tag className='center' color='#ECAB53' icon={<TbTruckDelivery />} >Đang vận chuyển</Tag>
        case 'cancel': return <Tag className='center' color='#528B8B' icon={<MdOutlineCancel />} >Đã bị hủy</Tag>
        case 'renting': return <Tag className='center' color='#66CC99' icon={<MdForward5 />} >Đang thuê</Tag>
        default: return <></>
    }
}

export default OrderStatusComp