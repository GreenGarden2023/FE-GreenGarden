import { TransactionHandle } from "app/models/transaction";
import golbalAxios from "../utils/http-client";

const createTransaction = async (data: TransactionHandle) =>{
    const res = await golbalAxios.post('/transaction/create-transaction', data)
    return res.data
}

const transactionService = {
    createTransaction
}

export default transactionService