import { TServicePkgStatus } from "./general-type"

export interface Package{
    id: string
    name: string
    price: number
    description: string
    guarantee: string
    status: boolean
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