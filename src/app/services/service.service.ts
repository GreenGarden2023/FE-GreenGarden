import { ServiceStatus } from "app/models/general-type";
import { Paging } from "app/models/paging";
import { Response } from "app/models/response";
import { Service, ServiceCreate, ServiceRequestResponse, UpdateServiceDetail } from "app/models/service";
import queryString from "query-string";
import golbalAxios from "../utils/http-client";

const createServcieRequest = async (data: ServiceCreate) =>{
    const res = await golbalAxios.post('/service/create-service-request', data)
    return res.data
}
const updateServiceRequestStatus = async (serviceID: string, status: ServiceStatus) =>{
    const res = await golbalAxios.post(`/service/update-service-request-status`, {serviceID, status})
    return res.data
}
const getAllServiceRequest = async () =>{
    const res = await golbalAxios.get<Response<Service[]>>(`/service/get-all-service-request`)
    return res.data
}
const getUserServiceRequest = async () =>{
    const res = await golbalAxios.get<Response<Service[]>>(`/service/get-user-service-request`)
    return res.data
}
const assignServiceTechnician = async (serviceID: string, technicianID: string) =>{
    const res = await golbalAxios.post(`/service/assign-service-technician`, {serviceID, technicianID})
    return res.data
}
const updateServiceDetail = async (data: UpdateServiceDetail) =>{
    const res = await golbalAxios.post<Response<Service>>(`/service/update-service-detail`, data)
    return res.data
}
const getAServiceRequestDetail = async (serviceRequestID: string) =>{
    const res = await golbalAxios.get<Response<Service>>(`/service/get-a-service-request-detail?serviceRequestID=${serviceRequestID}`)
    return res.data
}

const getRequestOrderByTechnician = async (paging: Partial<Paging>, technicianID: string) =>{
    const param = {...paging, technicianID}
    const res = await golbalAxios.get<Response<ServiceRequestResponse>>(`/service/get-request-order-by-technician?${queryString.stringify(param)}`)
    return res.data
}

const cancelRequest = async (serviceID: string, reason: string) =>{
    const res = await golbalAxios.post('/service/cancel-request', { serviceID, reason})
    return res.data
}
// const updateService 

const serviceService = {
    updateServiceRequestStatus,
    getAllServiceRequest,
    getUserServiceRequest,
    createServcieRequest,
    assignServiceTechnician,
    updateServiceDetail,
    getAServiceRequestDetail,
    getRequestOrderByTechnician,
    cancelRequest
}

export default serviceService