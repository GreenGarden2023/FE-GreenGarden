import { CartItem } from "./cart"

export interface OrderCreate{
    rentItems: CartItem[]
    saleItems: CartItem[]
    startRentDate?: string;
    endRentDate?: string;
}