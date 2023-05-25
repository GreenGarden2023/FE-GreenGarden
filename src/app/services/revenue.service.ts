import { Response } from "app/models/response"
import { FRevenue } from "app/models/revenue"
import golbalAxios from "app/utils/http-client"
import queryString from "query-string"

const convertParams = (fromDate: string, toDate: string) =>{
    return queryString.stringify({fromDate, toDate})
}

const getRevenueFirst = async (fromDate: string, toDate: string) =>{
    const res = await golbalAxios.get<Response<FRevenue>>(`/revenue/get-revenue-by-date-range?${convertParams(fromDate, toDate)}`)
    return res.data
}

const revenueService = {
    getRevenueFirst
}

export default revenueService