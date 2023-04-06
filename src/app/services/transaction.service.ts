import { Transaction, TransactionHandle } from "app/models/transaction";
import golbalAxios from "../utils/http-client";
import { OrderType } from "app/models/general-type";
import { Response } from "app/models/response";
import queryString from "query-string";

const createTransaction = async (data: TransactionHandle) =>{
    const res = await golbalAxios.post('/transaction/create-transaction', data)
    return res.data
}
const getTransactionByOrder = async (orderId: string, orderType: OrderType) =>{
    const params = queryString.stringify({orderId, orderType})
    const res = await golbalAxios.get<Response<Transaction[]>>(`/transaction/get-transaction-by-order?${params}`)
    return res.data
}

const transactionService = {
    createTransaction,
    getTransactionByOrder
}

export default transactionService