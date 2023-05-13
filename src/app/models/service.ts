import { OrderStatus, ServiceStatus } from "./general-type"
import { Paging } from "./paging"
import { User } from "./user"

export interface ServiceCreate {
    startDate?: Date
    endDate?: Date
    name: string
    phone: string
    email: string
    address: string
    isTransport: boolean
    rewardPointUsed: number
    districtID: number;
    userTreeIDList: string[]
}
  

export interface UserTree {
    userTreeID: string
    quantity: number
}

// merge update and create
export interface UpdateServiceDetail {
    serviceUpdate: ServiceUpdate
    serviceDetailUpdate: ServiceDetailUpdate[]
}
  
export interface ServiceUpdate {
    serviceID: string
    name: string
    phone: string
    email: string
    address: string
    transportFee: number
    rewardPointUsed: number
    isTranSport: boolean;
    startDate?: Date
    endDate?: Date
    rules: string;
    districtID: number;
}
  
export interface ServiceDetailUpdate {
    serviceDetailID: string
    quantity: number
    servicePrice: number
    managerDescription: string
}


export interface Service {
    id: string
    serviceCode: string
    userId: string
    serviceOrderID: string
    userCurrentPoint: number
    createDate: Date
    startDate: Date
    endDate: Date
    name: string
    phone: string
    email: string
    address: string
    districtID: number
    isTransport: boolean
    transportFee: number
    rewardPointUsed: number
    rules: string
    status: ServiceStatus
    technicianID: string
    technicianName: string
    cancelBy: string
    nameCancelBy: string
    reason: string
    serviceDetailList: ServiceDetailList[]
}
  
export interface ServiceDetailList {
    id: string
    userTreeID: string
    serviceID: string
    treeName: string
    description: string
    quantity: number
    servicePrice: number
    managerDescription: string
    imgUrls: string[]
    careGuide: string
}

export interface ServiceResponse{
    paging: Paging;
    serviceOrderList: ServiceOrderList[]
}
export interface ServiceOrderList {
    id: string
    orderCode: string
    userID: string
    technician: Technician
    createDate: string
    serviceStartDate: string
    serviceEndDate: string
    deposit: number
    totalPrice: number
    discountAmount: number
    remainAmount: number
    rewardPointGain: number
    rewardPointUsed: number
    transportFee: number
    status: OrderStatus
    service: Service
    reason: string;
    cancelBy: string;
    nameCancelBy: string;
}
export interface Technician {
    technicianID: string
    technicianUserName: string
    technicianFullName: string
    technicianAddress: string
    technicianPhone: string
    technicianMail: string
}

export interface ServiceOrderDetail{
    id: string
    orderCode: string
    userID: string
    technician: Technician
    createDate: string
    serviceStartDate: Date
    serviceEndDate: Date
    deposit: number
    totalPrice: number
    discountAmount: number
    remainAmount: number
    rewardPointGain: number
    rewardPointUsed: number
    transportFee: number
    status: OrderStatus
    service: Service
    reason: string;
    cancelBy: string;
    nameCancelBy: string;
}

export interface ServiceRequest{
    id: string
    serviceCode: string
    startDate: Date
    endDate: Date
    name: string
    userCurrentPoint: number
    phone: string
    email: string
    address: string
    status: ServiceStatus
    districtID: number
    user: User
    createDate: Date
    technicianName: string
    isTransport: boolean
    transportFee: number
    rules: string
    rewardPointUsed: number
    technician: Technician
    serviceDetailList: ServiceDetailList[]
    cancelBy: string;
    nameCancelBy: string;
    reason: string;
    serviceOrderID: string;
}

export interface ServiceRequestResponse{
    paging: Paging
    requestList: ServiceRequest[]
}