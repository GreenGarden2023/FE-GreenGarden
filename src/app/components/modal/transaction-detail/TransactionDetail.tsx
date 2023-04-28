import React, { useEffect, useMemo, useState } from 'react'
import './style.scss'
import { Transaction } from 'app/models/transaction'
import transactionService from 'app/services/transaction.service'
import { OrderType } from 'app/models/general-type';
import { Button, Modal } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import utilDateTime from 'app/utils/date-time';
import MoneyFormat from 'app/components/money/MoneyFormat';
import { BiShoppingBag } from 'react-icons/bi';
import Description from 'app/components/renderer/description/Description';
import LoadingView from 'app/components/loading-view/LoadingView';
import useDispatch from 'app/hooks/use-dispatch';
import { setNoti } from 'app/slices/notification';
import CONSTANT from 'app/utils/constant';

interface TransactionDetailProps{
    orderId: string;
    orderType: OrderType
    orderCode: string;
    onClose: () => void;
}

const TransactionDetail: React.FC<TransactionDetailProps> = ({orderId, orderType, orderCode, onClose}) => {
    const dispatch = useDispatch()

    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() =>{
        const init = async () =>{
            setLoading(true)
            try{
                const res = await transactionService.getTransactionByOrder(orderId, orderType)
                setTransactions(res.data)
                console.log(res)
            }catch{
                dispatch(setNoti({type: 'error', message: CONSTANT.ERROS_MESSAGE.RESPONSE_VI}))
            }
            setLoading(false)
        }
        init()
    }, [orderId, orderType, dispatch])

    const Column: ColumnsType<any> = [
        {
            title: '#',
            key: '#',
            dataIndex: '#',
            width: 50,
            render: (v, x, index) => (index + 1)
        },
        {
            title: 'Thời gian giao dịch',
            key: 'paidDate',
            dataIndex: 'paidDate',
            width: 250,
            render: (v) => (utilDateTime.dateTimeToString(v))
        },
        {
            title: 'Số tiền',
            key: 'amountdDate',
            dataIndex: 'amount',
            render: (v) => (<MoneyFormat value={v} color='Blue' />)
        },
        {
            title: 'Ghi chú',
            key: 'description',
            dataIndex: 'description',
            render: (v) => (<Description content={v} />)
        },
        {
            title: 'Loại giao dịch',
            key: 'status',
            dataIndex: 'status',
            render: (v) => (v === 'received' ? 'Nhận' : 'Trả')
        },
        {
            title: 'Phương thức giao dịch',
            key: 'paymentType',
            dataIndex: 'paymentType',
            render: (v) => (v === 'Cash' ? 'Tiền mặt' : 'Momo')
        },
    ]
    
    const DataSource = useMemo(() =>{
        return transactions.map((x, index) => ({
            key: index + 1,
            ...x,
            paymentType: x.paymentType.paymentName
        }))
    }, [transactions])

    return (
        <Modal
            open
            title={`Giao dịch của đơn hàng ${orderCode}`}
            onCancel={onClose}
            onOk={onClose}
            width={1000}
            footer={false}
        >
            {
                loading ?
                <LoadingView loading={loading} /> :
                <>
                    {
                        transactions.length === 0 ? 
                        <div className='no-transaction'>
                            <BiShoppingBag size={30} color='#0099FF' />
                            <span>Chưa có giao dịch nào cho đơn hàng "{orderCode}"</span>
                        </div> : 
                        <Table
                            dataSource={DataSource} 
                            columns={Column} 
                            scroll={{ y: 680 }}
                            pagination={false}
                        />
                    }
                    <div className='btn-form-wrapper mt-10'>
                        <Button type='primary' className='btn-update' size='large' onClick={onClose}>
                            Đóng
                        </Button>
                    </div>
                </>
            }
        </Modal>
    )
}

export default TransactionDetail