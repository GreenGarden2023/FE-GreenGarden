import { TPackageOrderStatus, TServicePkgStatus } from "./general-type"
import { Paging } from "./paging"

export interface Package{
    id: string
    name: string
    price: number
    description: string
    guarantee: string
    status: boolean
    careGuide?: string
}

export interface PackageHandle extends Partial<Package>{}

export interface TakecareComboDetail {
    takecareComboID: string
    takecareComboName: string
    takecareComboPrice: number
    takecareComboDescription: string
    takecareComboGuarantee: string
}

export interface PackageService{
    id: string
    code: string
    takecareComboDetail: TakecareComboDetail
    createDate: string
    startDate: string
    endDate: string
    name: string
    phone: string
    email: string
    address: string
    userId: string
    technicianId: string
    technicianName: string
    treeQuantity: number
    isAtShop: boolean
    numOfMonths: number
    status: TServicePkgStatus
    cancelBy: string;
    nameCancelBy: string;
    reason: string;
    takecareComboOrder: TakecareComboOrder
    careGuide: string;
}

export interface PackageServiceHandle{
    id?: string;
    takecareComboId: string
    startDate: string
    numOfMonth: number
    isAtShop: boolean
    name: string
    phone: string
    email: string
    address: string
    treeQuantity: number
}

export interface PackageServiceStatusHandle{
    takecareComboServiceId: string;
    status: TServicePkgStatus
}

export interface PackageServiceAssignHandle{
    takecareComboServiceId: string;
    technicianID: string
}

export interface PackageOrder{
    id: string
    orderCode: string
    createDate: Date
    serviceStartDate: Date
    serviceEndDate: Date
    deposit: number
    totalPrice: number
    remainAmount: number
    technicianId: string
    userId: string
    status: TPackageOrderStatus
    description: string
    cancelBy: string
    nameCancelBy: string;
    reason: string;
    takecareComboService: PackageService
    careGuide: string
}

export interface PackageGetAll{
    paging: Paging
    takecareComboOrderList: PackageOrder[]
}

export interface TakecareComboOrder {
    id: string
    orderCode: string
    createDate: Date
    serviceStartDate: Date
    serviceEndDate: Date
    deposit: number
    totalPrice: number
    remainAmount: number
    technicianId: string
    userId: string
    status: TPackageOrderStatus
    description: string
    cancelBy: string
}