import { Response } from "app/models/response"
import { FRevenue, SRevenue, TRevenue } from "app/models/revenue"
import golbalAxios from "app/utils/http-client"
import queryString from "query-string"

const convertParams = (fromDate: string, toDate: string) =>{
    return queryString.stringify({fromDate, toDate})
}

const getRevenueFirst = async (fromDate: string, toDate: string) =>{
    const res = await golbalAxios.get<Response<FRevenue>>(`/revenue/get-revenue-by-date-range?${convertParams(fromDate, toDate)}`)
    return res.data
}

const getRevenueSecond = async (fromDate: string, toDate: string) =>{
    const res = await golbalAxios.get<Response<SRevenue[]>>(`/revenue/get-best-product-detail-by-date-range?${convertParams(fromDate, toDate)}`)
    return res.data
}

const getRevenueThird = async (fromDate: string, toDate: string) =>{
    const res = await golbalAxios.get<Response<TRevenue>>(`/revenue/get-rent-revenue-by-date-range?${convertParams(fromDate, toDate)}`)
    return res.data
}

const getRevenueFour = async (fromDate: string, toDate: string) =>{
    const res = await golbalAxios.get<Response<TRevenue>>(`/revenue/get-sale-revenue-by-date-range?${convertParams(fromDate, toDate)}`)
    return res.data
}

const revenueService = {
    getRevenueFirst,
    getRevenueSecond,
    getRevenueThird,
    getRevenueFour
}

export default revenueService