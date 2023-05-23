import { TPackageOrderStatus } from "app/models/general-type"
import { PackageGetAll, PackageOrder } from "app/models/package"
import { Paging } from "app/models/paging"
import { Response } from "app/models/response"
import { CalendarUpdate, CreateServiceResponse, ServiceCalendar } from "app/models/service-calendar"
import { CalendarInitial } from "app/models/service-calendar"
import { CreateFirstCalendarResponse } from "app/models/service-calendar"
import golbalAxios from "app/utils/http-client"
import queryString from "query-string"

const baseUrl = '/takecare-combo-order'

const createOrder = async (takecareComboServiceId: string) =>{
    const res = await golbalAxios.post<Response<PackageOrder>>(`${baseUrl}/create-order`, { takecareComboServiceId })
    return res.data
}
const getOrderById = async (orderID: string) =>{
    const res = await golbalAxios.get<Response<PackageOrder>>(`${baseUrl}/get-order-by-id?orderID=${orderID}`)
    return res.data
}
const getAllOrders = async (paging: Partial<Paging>, status: TPackageOrderStatus) =>{
    const params = { ...paging, status }
    const res = await golbalAxios.get<Response<PackageGetAll>>(`${baseUrl}/get-all-orders?${queryString.stringify(params)}`)
    return res.data
}
const updateOrderStatus = async (takecareComboOrderId: string, status: TPackageOrderStatus) =>{
    const res = await golbalAxios.post<Response<PackageOrder>>(`${baseUrl}/update-order-status`, { takecareComboOrderId, status })
    return res.data
}
const cancelOrder = async (takecareComboOrderId: string, cancelReason: string) =>{
    const res = await golbalAxios.post<Response<PackageOrder>>(`${baseUrl}/cancel-order`, { takecareComboOrderId, cancelReason })
    return res.data
}
const getAllOrdersByTechnician = async (paging: Partial<Paging>, status: TPackageOrderStatus, technicianId: string) =>{
    const params = { ...paging, status, technicianId }
    const res = await golbalAxios.get<Response<PackageGetAll>>(`${baseUrl}/get-all-orders-by-technician?${queryString.stringify(params)}`)
    return res.data
}

// ------------------------------------------------------------------------------------------------------------------------------
const baseUrlPayment = '/takecare-combo-order-payment'

const depositPaymentCash = async (orderId: string) =>{
    const res = await golbalAxios.post<Response<null>>(`${baseUrlPayment}/deposit-payment-cash`, { orderId })
    return res.data
}
const depositPaymentMomo = async (orderId: string) =>{
    const res = await golbalAxios.post<Response<null>>(`${baseUrlPayment}/deposit-payment-momo`, { orderId })
    return res.data
}
const orderPaymentCash = async (orderId: string, amount: number, paymentType: 'whole' | 'normal') =>{
    const res = await golbalAxios.post<Response<null>>(`${baseUrlPayment}/order-payment-cash`, { orderId, amount, paymentType })
    return res.data
}
const orderPaymentMomo = async (orderId: string, amount: number, paymentType: 'whole' | 'normal') =>{
    const res = await golbalAxios.post<Response<null>>(`${baseUrlPayment}/order-payment-momo`, { orderId, amount, paymentType })
    return res.data
}

// ----------------------------------------------------------------------------------------------------------------------------
const baseUrlCalendar = '/takecare-service-calendar'
const createFirstCalendar = async (calendarInitial: CalendarInitial) =>{
    const res = await golbalAxios.post<Response<CreateFirstCalendarResponse>>(`${baseUrlCalendar}/create-service-calendar`, { calendarInitial })
    return res.data
}
const uploadCalendar = async (calendarUpdate: CalendarUpdate) =>{
    const res = await golbalAxios.post<Response<CreateServiceResponse>>(`${baseUrlCalendar}/create-service-calendar`, { calendarUpdate })
    return res.data
}
const getServiceCalendarByServiceOrder = async (serviceOrderID: string) =>{
    const res = await golbalAxios.get<Response<ServiceCalendar[]>>(`${baseUrlCalendar}/get-service-calendar-by-service-order?serviceOrderID=${serviceOrderID}`)
    return res.data
}
const getServiceCalendarByTechnician = async (TechnicianID: string, Date: string) =>{
    const params = { TechnicianID, Date }
    const res = await golbalAxios.get<Response<ServiceCalendar[]>>(`${baseUrlCalendar}/get-service-calendar-by-technician?${queryString.stringify(params)}`)
    return res.data
}
const getServiceCalendarByUser = async (UserID: string, StartDate: string, EndDate: string) =>{
    const params = { UserID, StartDate, EndDate }
    const res = await golbalAxios.get<Response<ServiceCalendar[]>>(`${baseUrlCalendar}/get-service-calendar-by-user?${queryString.stringify(params)}`)
    return res.data
}

const takeComboOrderService = {
    createOrder,
    getOrderById,
    getAllOrders,
    updateOrderStatus,
    cancelOrder,
    getAllOrdersByTechnician,
    depositPaymentCash,
    depositPaymentMomo,
    orderPaymentCash,
    orderPaymentMomo,
    // ---------------
    createFirstCalendar,
    uploadCalendar,
    getServiceCalendarByServiceOrder,
    getServiceCalendarByTechnician,
    getServiceCalendarByUser
}

export default takeComboOrderService