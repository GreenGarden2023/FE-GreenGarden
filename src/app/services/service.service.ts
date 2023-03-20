import { Status } from "app/models/general-type";
import { ServiceCreate } from "app/models/service";
import queryString from "query-string";
import golbalAxios from "../utils/http-client";

const getListServiceByCustomer = async () =>{
    const res = await golbalAxios.get('/service/get-list-service-by-customer')
    return res.data
}
const changeStatus = async (serviceID: string, status: Status) =>{
    const params = {serviceID, status}
    const res = await golbalAxios.patch(`/service/change-status?${queryString.stringify(params)}`)
    return res.data
}
const createServcie = async (data: ServiceCreate) =>{
    const res = await golbalAxios.post('/service/create-service', data)
    return res.data
}
const getDetailServiceByCustomer = async (serviceID: string) =>{
    const res = await golbalAxios.post(`/service/get-detail-service-by-customer?serviceID=${serviceID}`)
    return res.data
}
// const updateService 

const serviceService = {
    getListServiceByCustomer,
    changeStatus,
    createServcie,
    getDetailServiceByCustomer
}

export default serviceService