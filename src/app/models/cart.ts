import { ProductItemType } from "./general-type";
import { Size } from "./size";

interface CartProductItem {
    id: string;
    name: string;
    description: string;
    type: ProductItemType;
    content: string;
    rule: string;
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
    transportFee: number
}
export interface CartItemDetail{
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

// export interface CartUserData{
//     recipientAddress: string;
//     recipientPhone: string;
//     recipientName: string;
//     shippingID: number;
// }

export interface OrderUserInfor{
    startDateRent?: Date
    endDateRent?: Date
    shippingID: number
    rewardPointUsed: number
    recipientAddress: string
    recipientPhone: string
    recipientName: string
    rentOrderGroupID?: string
    itemList: CartItem[]
    isTransport: boolean;
}

export interface OrderPreview{
    pointUsed: number;
    rewardPoint: number;
    totalPriceOrder: number;
    transportFee: number;
    discountAmount: number;
    totalPricePayment: number;
    deposit: number;
    totalRentDays?: number;
}