import { CartItem } from "./cart"

export interface OrderCreate{
    rentItems: CartItem[]
    saleItems: CartItem[]
    startRentDate?: string;
    endRentDate?: string;
}

interface SizeProductItems {
    sizeProductItemID: string;
    sizeName: string;
    productName: string;
    imgUrl: string[];
}

interface AddendumProductItem {
    addendumProductItemID: string;
    sizeProductItemPrice: number;
    quantity: number;
    sizeProductItems: SizeProductItems;
}

export interface Addendum {
    addendumID: string;
    transportFee: number;
    startDateRent: Date;
    endDateRent: Date;
    deposit: number;
    reducedMoney: number;
    totalPrice: number;
    status: string;
    remainMoney: number;
    address: string;
    addendumProductItems: AddendumProductItem[];
}

export interface Order {
    orderID: string;
    totalPrice: number;
    createDate: Date;
    status: string;
    isForRent: boolean;
    addendums: Addendum[];
}