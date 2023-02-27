import { CartType } from "./general-type";
import { ProductItem } from "./product-item";

export interface Cart{
    type: CartType
    productItems: ProductItem[]
}