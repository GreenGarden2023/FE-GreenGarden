import { Modal } from 'antd'
import orderService from 'app/services/order.service'
import React, { useEffect } from 'react'

interface ModalClientSaleOrderDetaiProps{
    orderId: string
}

const ModalClientSaleOrderDetai: React.FC<ModalClientSaleOrderDetaiProps> = ({orderId}) => {

    useEffect(() =>{
        if(!orderId) return;

        const init = async () =>{
            try{
                const res = await orderService.getSaleOrderDetail(orderId)
            }catch{

            }
        }
        init()
    }, [orderId])

    return (
        <Modal
            open
        >

        </Modal>
    )
}

export default ModalClientSaleOrderDetai