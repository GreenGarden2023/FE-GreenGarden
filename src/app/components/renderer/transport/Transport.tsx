import React from 'react'
import './style.scss'
import { IoLocationSharp, IoStorefrontSharp } from 'react-icons/io5'

interface TransportProps{
    isTransport: boolean
    isRequest?: boolean;
}

const Transport: React.FC<TransportProps>= ({ isTransport, isRequest }) => {
  return (
    <div className='transport-wrapper'>
        {
            isTransport ? 
            <>
                <IoLocationSharp size={20} color='#FF6EB4' />
                <span>Tại nhà {isRequest ? 'riêng' : ''}</span>
            </> : 
            <>
                <IoStorefrontSharp size={20} color='#FF6EB4' />
                <span>Tại cửa hàng</span>
            </>
        }
    </div>
  )
}

export default Transport