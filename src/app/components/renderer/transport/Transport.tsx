import React, { useMemo } from 'react'
import './style.scss'
import { IoLocationSharp, IoStorefrontSharp } from 'react-icons/io5'

interface TransportProps{
    isTransport: boolean
    isRequest?: boolean;
    minWidth?: number
}

const Transport: React.FC<TransportProps>= ({ isTransport, isRequest, minWidth}) => {
    const Styled = useMemo((): React.CSSProperties =>{
        return {
          display: minWidth ? 'inline-block' : 'initial',
          minWidth: minWidth || 'initial'
        }
    }, [minWidth])

    return (
        <div className='transport-wrapper' style={Styled}>
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