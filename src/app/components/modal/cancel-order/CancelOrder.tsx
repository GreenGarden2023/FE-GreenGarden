import { Button, Form, Input, Modal } from 'antd';
import UserInforOrder from 'app/components/user-infor/user-infor-order/UserInforOrder';
import useDispatch from 'app/hooks/use-dispatch';
import useSelector from 'app/hooks/use-selector';
import { OrderType } from 'app/models/general-type';
import orderService from 'app/services/order.service';
import serviceService from 'app/services/service.service';
import { setNoti } from 'app/slices/notification';
import React, { useMemo, useState } from 'react'

interface CancelOrderProps{
    orderId: string;
    orderCode: string;
    orderType: OrderType;
    userInforOrder?: any;
    onClose: () => void;
    onSubmit: (reason: string, canceledBy: string) => void;
}

const CancelOrder: React.FC<CancelOrderProps> = ({ orderId, orderCode, orderType, userInforOrder, onClose, onSubmit }) => {
    const dispatch = useDispatch()
    const { fullName } = useSelector(state => state.userInfor.user)

    const [reason, setReason] = useState('')

    const [loading, setLoading] = useState(false)

    const handleSubmit = async () =>{
        setLoading(true)
        try{
            if(orderType === 'request'){
                await serviceService.cancelRequest(orderId, reason)
                dispatch(setNoti({type: 'success', message: `Hủy yêu cầu chăm sóc "${orderCode}" thành công`}))
                onSubmit(reason, fullName)
                onClose()
                return;
            }

            await orderService.cancelOrder(orderId, orderType, reason)
            dispatch(setNoti({type: 'success', message: `Hủy đơn hàng "${orderCode}" thành công`}))
            onSubmit(reason, fullName)
            onClose()
        }catch{
            
        }
        setLoading(false)
    }

    const Title = useMemo(() =>{
        if(orderType === 'request'){
            return `Xác nhận hủy yêu cầu chăm sóc "${orderCode}"`
        }
        return `Xác nhận hủy đơn hàng "${orderCode}"`
    }, [orderType, orderCode])

    return (
        <Modal
            open
            title={Title}
            onCancel={onClose}
            width={800}
            footer={false}
        >
            <Form
                layout='vertical'
                onFinish={handleSubmit}
            >
                <Form.Item label='Lý do hủy đơn hàng'>
                    <Input.TextArea autoSize={{minRows: 4, maxRows: 6}} value={reason} onChange={(e) => setReason(e.target.value)} ></Input.TextArea>
                </Form.Item>
                {
                    userInforOrder && 
                    <UserInforOrder {...userInforOrder} columnNumber={2} />
                }
                <div className='btn-form-wrapper mt-10'>
                    <Button htmlType='button' disabled={loading} type='default' className='btn-cancel' size='large' onClick={onClose}>Hủy bỏ</Button>
                    <Button htmlType='submit' loading={loading} type='primary' className='btn-update' size='large'>
                        Xác nhận
                    </Button>
                </div>
            </Form>
        </Modal>
    )
}

export default CancelOrder