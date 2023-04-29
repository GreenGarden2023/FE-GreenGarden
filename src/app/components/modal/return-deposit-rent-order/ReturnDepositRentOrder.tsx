import { Button, Col, Form, Input, Modal, Radio, RadioChangeEvent, Row } from 'antd';
import MoneyFormat from 'app/components/money/MoneyFormat';
import CurrencyInput from 'app/components/renderer/currency-input/CurrencyInput';
import UserInforOrder from 'app/components/user-infor/user-infor-order/UserInforOrder';
import useDispatch from 'app/hooks/use-dispatch';
import { RentOrderList } from 'app/models/order'
import { TransactionHandle } from 'app/models/transaction';
import orderService from 'app/services/order.service';
import transactionService from 'app/services/transaction.service';
import { setNoti } from 'app/slices/notification';
import CONSTANT from 'app/utils/constant';
import utilDateTime from 'app/utils/date-time';
import React, { useMemo, useState } from 'react'
import CurrencyFormat from 'react-currency-format';

interface ReturnDepositRentOrderProps{
    rentOrderList: RentOrderList
    onClose: () => void;
    onSubmit: () => void;
}

const ReturnDepositRentOrder: React.FC<ReturnDepositRentOrderProps> = ({rentOrderList, onClose, onSubmit}) => {
    const dispatch = useDispatch();
    const [value, setValue] = useState(1)
    const [amount, setAmount] = useState(0)
    const [days, setDays] = useState(0)

    const [loading, setLoading] = useState(false)

    const TotalPayment = useMemo(() =>{
        let total = 0

        for (const item of rentOrderList.rentOrderDetailList) {
            total += item.quantity * item.rentPricePerUnit * days
        }

        return total + amount
    }, [rentOrderList, days, amount])

    const handleConfirmReturnDeposit = async () =>{
        try{
            switch(value){
                case 2:
                    if(days === 0){
                        return dispatch(setNoti({type: 'warning', message: 'Ngày trả trễ ít nhất là 1 ngày'}))
                    }
                    break;
                case 3:
                    if(amount < 1000){
                        return dispatch(setNoti({type: 'warning', message: 'Số tiền đền bù ít nhất là 1000VND'}))
                    }
                    break;
                case 4:
                    if(days === 0 || amount < 1000){
                        return dispatch(setNoti({type: 'warning', message: 'Ngày trả trễ ít nhất là 1 ngày và số tiền đền bù ít nhất là 1000VND'}))
                    }
                    break;
            }

            setLoading(true)
            await orderService.updateRentOrderStatus(rentOrderList.id, 'completed')

            switch(value){
                case 2:
                    const data_2: TransactionHandle = {
                        amount: TotalPayment,
                        description: `Trả cây trễ ${days} ngày`,
                        orderID: rentOrderList.id,
                        orderType: 'rent',
                        paymentType: 'cash',
                        status: 'received',
                        transactionType: 'compensation payment'
                    }
                    await transactionService.createTransaction(data_2)
                    break;
                case 3:
                    const data_3: TransactionHandle = {
                        amount: TotalPayment,
                        description: `Trả tiền cho cây bị hư hại`,
                        orderID: rentOrderList.id,
                        orderType: 'rent',
                        paymentType: 'cash',
                        status: 'received',
                        transactionType: 'compensation payment'
                    }
                    await transactionService.createTransaction(data_3)
                    break;
                case 4:
                    const data_4: TransactionHandle = {
                        amount: TotalPayment,
                        description: `Trả cây trễ ${days} ngày và cây bị hư hại (${amount} VND)`,
                        orderID: rentOrderList.id,
                        orderType: 'rent',
                        paymentType: 'cash',
                        status: 'received',
                        transactionType: 'compensation payment'
                    }
                    await transactionService.createTransaction(data_4)
                    break;
            }

            // hoàn cọc
            if(rentOrderList.deposit !== 0){
                const bodyRefundDeposit: TransactionHandle = {
                    amount: rentOrderList.deposit,
                    description: 'Hoàn cọc',
                    orderID: rentOrderList.id,
                    orderType: 'rent',
                    paymentType: 'cash',
                    status: 'refund',
                    transactionType: 'compensation payment',
                }
                await transactionService.createTransaction(bodyRefundDeposit)
            }

            dispatch(setNoti({type: 'success', message: `Xác nhận tất toán cho đơn hàng "${rentOrderList.orderCode}" thành công`}))
            onSubmit()
        }catch{
            dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
        }
        setLoading(false)
    }
    const handleChangeAmount = (values: CurrencyFormat.Values) =>{
        const { floatValue } = values
        const data = Number(floatValue || 0)
        setAmount(data)
    }

    const handChangeDays = (e) =>{
        const data = Number(e.target.value || 0)
        setDays(data)
    }

    const handleChangeRadio = (e: RadioChangeEvent) =>{
        setDays(0)
        setAmount(0)
        setValue(e.target.value)
    }

    const UserInforDetail = useMemo(() =>{
    //     name?: string;
    // phone?: string;
    // address?: string;
    // createOrderDate?: string;
    // startDate?: string;
    // endDate?: string;
    // status?: OrderStatus;
    // transportFee?: number;
    // totalOrder?: number;
    // remainMoney?: number;
    // deposit?: number;
    // reason?: string;
        const { recipientName, recipientPhone, recipientAddress, createDate, startRentDate, endRentDate, status, transportFee, totalPrice,
        remainMoney, deposit, reason } = rentOrderList

        return {
            name: recipientName,
            phone: recipientPhone,
            address: recipientAddress,
            createOrderDate: utilDateTime.dateToString(createDate.toString()),
            startDate:  utilDateTime.dateToString(startRentDate.toString()),
            endDate: utilDateTime.dateToString(endRentDate.toString()),
            status, transportFee,
            totalOrder: totalPrice,
            remainMoney: status === 'unpaid' ? remainMoney + deposit : remainMoney, 
            deposit, reason
        }
    }, [rentOrderList])

    return (
        <Modal
            open
            title={`Xác nhận tất toán đơn hàng ${rentOrderList.orderCode}`}
            onCancel={onClose}
            footer={false}
            width={1000}
        >
            <Form
                layout='vertical'
                onFinish={handleConfirmReturnDeposit}
            >
                <Form.Item label='Chọn loại tất toán cho đơn hàng'>
                    <Radio.Group value={value} onChange={handleChangeRadio}>
                        <Radio value={1}>Xác nhận đã nhận đủ cây và hoàn cọc</Radio>
                        <Radio value={2}>Trả cây trễ</Radio>
                        <Radio value={3}>Trả cây bị hư hại</Radio>
                        <Radio value={4}>Trả cây trễ và bị hư hại</Radio>
                    </Radio.Group>
                </Form.Item>
                {
                    value === 2 &&
                    <Form.Item label='Số ngày trả trễ'>
                        <Input type='number' min={0} value={days} onChange={handChangeDays} />
                    </Form.Item>
                }
                {
                    value === 3 &&
                    <Form.Item label='Số tiền đền bù của khách hàng (VND)'>
                        <CurrencyInput min={0} value={amount} onChange={handleChangeAmount} />
                    </Form.Item>
                }
                {
                    value === 4 &&
                    <Row gutter={[24, 24]}>
                        <Col span={12}>
                            <Form.Item label='Số ngày trả trễ'>
                                <Input type='number' min={0} value={days} onChange={handChangeDays} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label='Số tiền đền bù của khách hàng (VND)'>
                                <CurrencyInput min={0} value={amount} onChange={handleChangeAmount} />
                            </Form.Item>
                        </Col>
                    </Row>
                }
                {
                    value !== 1 &&
                    <Form.Item label='Số tiền cần phải trả là'>
                        <MoneyFormat value={TotalPayment} isHighlight color='Blue' />
                    </Form.Item>
                }
                <div>
                    <UserInforOrder {...UserInforDetail} />
                </div>
                <div className='btn-form-wrapper' style={{marginTop: '10px'}}>
                    <Button htmlType='button' disabled={loading} type='default' className='btn-cancel' size='large' >Hủy bỏ</Button>
                    <Button htmlType='submit' loading={loading} type='primary' className='btn-update' size='large'>
                        Xác nhận
                    </Button>
                </div>
            </Form>
            
        </Modal>
    )
}

export default ReturnDepositRentOrder