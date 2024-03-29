import { CartItem } from "./cart"
import { Feedback } from "./feedback";
import { OrderStatus } from "./general-type";
import { Paging } from "./paging";
import { ProductItemDetail } from "./product-item";

export interface OrderCreate{
    startDateRent?: Date
    endDateRent?: Date
    shippingID: number
    rewardPointUsed: number
    recipientAddress: string
    recipientPhone: string
    recipientName: string
    rentOrderGroupID?: string
    isTransport: boolean
    itemList: CartItem[]
}

// order get
export interface SaleOrderDetail {
    id: string
    productItemDetailID: string
    productItemName: string
    quantity: number
    salePricePerUnit: number
    totalPrice: number
    sizeName: string
    imgURL: string
    feedbackList: Feedback[]
}
  
export interface RentOrderDetailList {
    id: string;
    imgURL: string;
    productItemDetail: ProductItemDetail;
    productItemName: string;
    quantity: number;
    rentPricePerUnit: number
    sizeName: string;
    totalPrice: number;
    salePricePerUnit: number;
    careGuide: string
}
export interface RentOrderList {
    id: string
    isTransport: boolean
    transportFee: number
    createDate: Date
    startRentDate: Date
    endRentDate: Date
    createdBy: string
    userId: string
    deposit: number
    totalPrice: number
    status: OrderStatus
    remainMoney: number
    rewardPointGain: number
    rewardPointUsed: number
    rentOrderGroupID: string
    discountAmount: number
    recipientAddress: string
    recipientPhone: string
    recipientName: string
    orderCode: string
    recipientDistrict: number;
    reason: string;
    cancelBy: string;
    nameCancelBy: string;
    contractURL: string;
    rentOrderDetailList: RentOrderDetailList[]
    careGuideURL: string;
}
export interface RentOrder{
    id: string;
    createDate: Date;
    numberOfOrder: number;
    totalGroupAmount: number;
    rentOrderList: RentOrderList[]
}
export interface RentOrderResponse{
    paging: Paging;
    rentOrderGroups: RentOrder[]
}

// order sale
export interface SaleOrderList {
    id: string;
    transportFee: number;
    createDate: Date;
    deposit: number;
    totalPrice: number;
    status: OrderStatus;
    remainMoney: number;
    rewardPointGain: number;
    rewardPointUsed: number;
    discountAmount: number;
    recipientAddress: string;
    recipientPhone: string;
    recipientName: string;
    orderCode: string;
    isTransport: boolean;
    reason: string;
    cancelBy: string;
    nameCancelBy: string;
    careGuideURL: string;
    rentOrderDetailList: RentOrderDetailList[];
}
export interface SaleOrderResponse{
    paging: Paging;
    saleOrderList: SaleOrderList[];
}

export interface OrderCalculate {
    transportFee: number
    deposit: number
    totalPrice: number
    remainMoney: number
    rewardPointGain: number
    rewardPointUsed: number
    discountAmount: number
    maxPoint: number
}

export interface OrderExtendDetail{
    rentOrder: RentOrderList;
    productItemDetailList: ProductItemDetail[]
}

// service models
export interface CreateServiceOrder {
    serviceId: string
    rewardPointUsed: number
    transportFee: number
}

export interface UpdateCareGuide{
    orderID: string;
    listCareGuide: {
        userTreeID: string;
        careGuide: string
    }[]
}