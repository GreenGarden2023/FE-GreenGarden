import { Response } from "app/models/response";
import { CreateServiceCalendar, ServiceCalendar } from "app/models/service-calendar";
import golbalAxios from "../utils/http-client";

const createServiceCalendar = async (data: CreateServiceCalendar) =>{
    const res = await golbalAxios.post('/service-calendar/create-service-calendar', data)
    return res.data
}
const getServiceCalendarByServiceOrder = async (serviceOrderID: string) =>{
    const res = await golbalAxios.get<Response<ServiceCalendar[]>>(`/service-calendar/get-service-calendar-by-service-order?serviceOrderID=${serviceOrderID}`)
    return res.data
}

const serviceCalendar = {
    createServiceCalendar,
    getServiceCalendarByServiceOrder
}

export default serviceCalendar