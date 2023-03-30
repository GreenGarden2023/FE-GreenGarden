import { ServiceStatus } from "app/models/general-type";
import { Response } from "app/models/response";
import { Service, ServiceCreate, UpdateServiceDetail } from "app/models/service";
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
    const res = await golbalAxios.post(`/service/update-service-detail`, data)
    return res.data
}
const getAServiceRequestDetail = async (serviceRequestID: string) =>{
    const res = await golbalAxios.get<Response<Service>>(`/service/get-a-service-request-detail?serviceRequestID=${serviceRequestID}`)
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
    getAServiceRequestDetail
}

export default serviceService