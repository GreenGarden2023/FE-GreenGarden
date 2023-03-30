import { OrderType } from "./general-type"

export interface TransactionHandle {
    orderID: string
    orderType: OrderType
    amount: number
    paymentType: 'cash' | 'momo'
    description: string
}
  