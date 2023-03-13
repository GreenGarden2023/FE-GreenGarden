import { CartItem } from "./cart"
import { OrderStatus } from "./general-type";
import { Paging } from "./paging";

export interface OrderCreate{
    startDateRent?: Date;
    endDateRent?: Date;
    rewardPointUsed: number;
    recipientAddress: string;
    recipientPhone: string;
    recipientName: string;
    rentOrderGroupID: string | null;
    itemList: CartItem[];
}

// order get
interface RentOrderDetailList {
    id: string;
    productItemDetailId: string;
    productItemDetailTotalPrice: number;
    quantity: number;
}
interface RentOrderList {
    id: string;
    orderCode: string;
    transportFee: number;
    startDateRent: Date;
    endDateRent: Date;
    deposit: number;
    totalPrice: number;
    status: string;
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
    rentOrderDetailList: RentOrderDetailList[];
}
export interface SaleOrderResponse{
    paging: Paging;
    saleOrderList: SaleOrderList[];
}