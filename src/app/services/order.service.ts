import { OrderStatus } from "app/models/general-type";
import { CreateServiceOrder, OrderCalculate, OrderCreate, OrderExtendDetail, RentOrder, RentOrderDetailList, RentOrderResponse, SaleOrderResponse } from "app/models/order";
import { Paging } from "app/models/paging";
import { Response } from "app/models/response";
import { ServiceOrderDetail, ServiceResponse } from "app/models/service";
import queryString from "query-string";
import golbalAxios from "../utils/http-client";

const createOrder = async (orderCreate: OrderCreate) =>{
    const res = await golbalAxios.post('/order/create-order', orderCreate)
    return res.data
}

const getRentOrders = async (paging: Partial<Paging>) =>{
    const res = await golbalAxios.get<Response<RentOrderResponse>>(`/order/get-rent-orders?${queryString.stringify(paging)}`)
    return res.data
}

const getRentOrderDetail = async (rentOrderDetailID: string) =>{
    const res = await golbalAxios.get(`/order/get-rent-order-detail?rentOrderDetailID=${rentOrderDetailID}`)
    return res.data
}

const getRentOrderGroup = async (groupID: string) =>{
    const res = await golbalAxios.get<Response<RentOrder>>(`/order/get-rent-order-group?groupID=${groupID}`)
    return res.data
}

const updateRentOrderStatus = async (orderID: string, status: OrderStatus) =>{
    
    const res = await golbalAxios.post('/order/update-rent-order-status', { orderID, status })
    return res.data
}

const getSaleOrders = async (paging: Partial<Paging>) =>{
    const res = await golbalAxios.get<Response<SaleOrderResponse>>(`/order/get-sale-orders?${queryString.stringify(paging)}`)
    return res.data
}

const getSaleOrderDetail = async (saleOrderDetailID: string) =>{
    const res = await golbalAxios.get<Response<RentOrderDetailList>>(`/order/get-sale-order-detail?saleOrderDetailID=${saleOrderDetailID}`)
    return res.data
}

const updateSaleOrderStatus = async (saleOrderID: string, status: OrderStatus) =>{
    const res = await golbalAxios.post('/order/update-sale-order-status', { saleOrderID, status })
    return res.data
}

const getAllRentOrders = async (paging: Partial<Paging>) =>{
    const res = await golbalAxios.get<Response<RentOrderResponse>>(`/order/get-all-rent-orders?${queryString.stringify(paging)}`)
    return res.data
}

const getAllSaleOrders = async (paging: Partial<Paging>) =>{
    const res = await golbalAxios.get<Response<SaleOrderResponse>>(`/order/get-all-sale-orders?${queryString.stringify(paging)}`)
    return res.data
}
const calculateOrder = async (orderCreate: OrderCreate) =>{
    const res = await golbalAxios.post<Response<OrderCalculate>>(`/order/calculate-order`, orderCreate)
    return res.data
}
const getARentOrder = async (rentOrderID: string) =>{
    const res = await golbalAxios.get<Response<OrderExtendDetail>>(`/order/get-a-rent-order?rentOrderID=${rentOrderID}`)
    return res.data
}

// ------------------------------------------------------------------------------------------------------------------
// service

const createOrderService = async (data: CreateServiceOrder) =>{
    const res = await golbalAxios.post('/order/create-service-order', data)
    return res.data
}
// get order by token
const getServiceOrders = async (paging: Partial<Paging>) =>{
    const res = await golbalAxios.get<Response<ServiceResponse>>(`/order/get-service-orders?${queryString.stringify(paging)}`)
    return res.data
}
// get all
const getAllServiceOrders = async (paging: Partial<Paging>) =>{
    const res = await golbalAxios.get(`/order/get-all-service-orders?${queryString.stringify(paging)}`)
    return res.data
}
const createServiceOrder = async (serviceId: string) =>{
    const res = await golbalAxios.post('/order/create-service-order', {serviceId})
    return res.data
}
const getServiceOrdersByTechnician = async (technicianID: string, paging: Partial<Paging>) =>{
    const params = {technicianID, ...paging}
    const res = await golbalAxios.get<Response<ServiceResponse>>(`/order/get-service-orders-by-technician?${queryString.stringify(params)}`)
    return res.data
}
const getAServiceOrderDetail = async (orderID: string) =>{
    const res = await golbalAxios.get<Response<ServiceOrderDetail>>(`/order/get-a-service-order-detail?orderID=${orderID}`)
    return res.data
}

const orderService = {
    createOrder,
    getRentOrders,
    getRentOrderDetail,
    updateRentOrderStatus,
    getSaleOrders,
    getSaleOrderDetail,
    updateSaleOrderStatus,
    getAllRentOrders,
    getAllSaleOrders,
    getRentOrderGroup,
    calculateOrder,
    getARentOrder,
    createOrderService,
    getServiceOrders,
    getAllServiceOrders,
    createServiceOrder,
    getServiceOrdersByTechnician,
    getAServiceOrderDetail
}

export default orderService