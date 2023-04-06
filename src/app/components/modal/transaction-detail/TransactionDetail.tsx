import React, { useEffect, useMemo, useState } from 'react'
import './style.scss'
import { Transaction } from 'app/models/transaction'
import transactionService from 'app/services/transaction.service'
import { OrderType } from 'app/models/general-type';
import { Modal } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import utilDateTime from 'app/utils/date-time';
import MoneyFormat from 'app/components/money/MoneyFormat';
import { BiShoppingBag } from 'react-icons/bi';
import Description from 'app/components/renderer/description/Description';

interface TransactionDetailProps{
    orderId: string;
    orderType: OrderType
    orderCode: string;
    onClose: () => void;
}

const TransactionDetail: React.FC<TransactionDetailProps> = ({orderId, orderType, orderCode, onClose}) => {

    const [transactions, setTransactions] = useState<Transaction[]>([])

    useEffect(() =>{
        const init = async () =>{
            try{
                const res = await transactionService.getTransactionByOrder(orderId, orderType)
                setTransactions(res.data)
            }catch{
                
            }
        }
        init()
    }, [orderId, orderType])

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
            render: (v) => (utilDateTime.dateToString(v))
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
        >
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
        </Modal>
    )
}

export default TransactionDetail