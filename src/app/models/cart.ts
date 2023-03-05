import { Size } from "./size";

interface CartProductItem {
    id: string;
    name: string;
    description: string;
    productId: string;
    type: string;
    product?: any;
    tblFeedBacks: any[];
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
    sizeProductItem: CartSizeProductItem;
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
    sizeProductItemID: string;
    quantity: number
}