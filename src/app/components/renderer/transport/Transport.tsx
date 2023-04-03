import React from 'react'
import './style.scss'
import { IoLocationSharp, IoStorefrontSharp } from 'react-icons/io5'

interface TransportProps{
    isTransport: boolean
}

const Transport: React.FC<TransportProps>= ({ isTransport }) => {
  return (
    <div className='transport-wrapper'>
        {
            isTransport ? 
            <>
                <IoLocationSharp size={20} color='#EEC900' />
                <span>Tại nhà</span>
            </> : 
            <>
                <IoStorefrontSharp size={20} color='#EEC900' />
                <span>Tại cửa hàng</span>
            </>
        }
    </div>
  )
}

export default Transport