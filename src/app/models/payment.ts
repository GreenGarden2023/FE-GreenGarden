import { PaymentAction } from "./general-type";

export interface Payment {
    partnerCode: string;
    orderId: string;
    requestId: string;
    amount: number;
    responseTime: number;
    message: string;
    resultCode: number;
    payUrl: string;
}

export interface PaymentModal{
    orderId: string;
    type: PaymentAction
}