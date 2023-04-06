import { OrderType, TransactionType } from "./general-type"

export interface TransactionHandle {
    orderID: string
    orderType: OrderType
    amount: number
    status: 'received' | 'refund'
    transactionType: TransactionType
    paymentType: 'cash' | 'momo'
    description: string
}

export interface Transaction{
    id: string
    orderID: string
    amount: number
    paidDate: Date
    type: string
    status: 'received' | 'refund'
    paymentType: PaymentType
    description: string;
}

export interface PaymentType {
    id: string
    paymentName: string
}