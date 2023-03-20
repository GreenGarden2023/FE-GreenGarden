import { ProductItemType } from "./general-type";
import { Size } from "./size";

interface CartProductItem {
    id: string;
    name: string;
    description: string;
    type: ProductItemType;
    content: string;
}
interface CartSizeProductItem{
    id: string;
    sizeId: string;
    productItemId: string;
    rentPrice: number;
    salePrice: number;
    quantity: number;
    content: string;
    status: string;
    size: Size;
    imgUrl: string[]
}
interface CartItemDetail{
    productItemDetail: CartSizeProductItem;
    productItem: CartProductItem;
    quantity: number;
    unitPrice: number;
}

export interface Cart{
    rentItems: CartItemDetail[]
    totalRentPrice: number;
    saleItems: CartItemDetail[]
    totalSalePrice: number;
    totalPrice: number;
}

export interface CartItem{
    productItemDetailID: string;
    quantity: number
}

export interface CartUserData{
    recipientAddress: string;
    recipientPhone: string;
    recipientName: string;
    shippingID: number;
}