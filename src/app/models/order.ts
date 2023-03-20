import { CartItem } from "./cart"
import { OrderStatus } from "./general-type";
import { Paging } from "./paging";
import { ProductItemDetail } from "./product-item";

export interface OrderCreate{
    startDateRent?: Date;
    endDateRent?: Date;
    shippingID: number;
    rewardPointUsed: number;
    recipientAddress: string;
    recipientPhone: string;
    recipientName: string;
    rentOrderGroupID: string | null;
    itemList: CartItem[];
}

// order get
export interface RentOrderDetailList {
    id: string;
    totalPrice: number;
    quantity: number;
    salePricePerUnit: number;
    rentPricePerUnit?: number
    sizeName: string;
    productItemName: string;
    imgURL: string;
}
export interface RentOrderList {
    id: string;
    orderCode: string;
    transportFee: number;
    createDate: Date;
    startDateRent: Date;
    endDateRent: Date;
    deposit: number;
    totalPrice: number;
    status: OrderStatus;
    remainMoney: number;
    rewardPointGain: number;
    rewardPointUsed: number;
    rentOrderGroupID: string;
    discountAmount: number;
    recipientAddress: string;
    recipientPhone: string;
    recipientName: string;
    rentOrderDetailList: RentOrderDetailList[];
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
}

export interface OrderExtendDetail{
    rentOrder: RentOrderList;
    productItemDetailList: ProductItemDetail[]
}