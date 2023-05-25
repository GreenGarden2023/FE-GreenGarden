import { Response } from "app/models/response";
import { CreateServiceCalendar, CreateServiceResponse, ServiceCalendar } from "app/models/service-calendar";
import golbalAxios from "../utils/http-client";

const initialServiceCalendar = async (data: CreateServiceCalendar) =>{
    const res = await golbalAxios.post<Response<ServiceCalendar>>('/service-calendar/create-service-calendar', data)
    return res.data
}

const createServiceCalendar = async (data: CreateServiceCalendar) =>{
    const res = await golbalAxios.post<Response<CreateServiceResponse>>('/service-calendar/create-service-calendar', data)
    return res.data
}
const getServiceCalendarByServiceOrder = async (serviceOrderID: string) =>{
    const res = await golbalAxios.get<Response<ServiceCalendar[]>>(`/service-calendar/get-service-calendar-by-service-order?serviceOrderID=${serviceOrderID}`)
    return res.data
}

const serviceCalendar = {
    initialServiceCalendar,
    createServiceCalendar,
    getServiceCalendarByServiceOrder
}

export default serviceCalendar