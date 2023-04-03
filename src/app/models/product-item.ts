import { Category } from "./category";
import { ProductItemType, Status } from "./general-type";
import { Paging } from "./paging";
import { Product } from "./product";
import { Size } from "./size";

export interface ProductItemDetailHandle{
    id?: string;
    sizeId: string;
    productItemID: string;
    rentPrice?: number;
    salePrice?: number;
    quantity: number;
    transportFee: number;
    status: Status;
    imagesUrls: string[];
}

export interface ProductItemDetail{
    id: string;
    quantity: number;
    rentPrice?: number;
    salePrice?: number;
    size: Size;
    status: Status;
    transportFee: number;
    imagesURL: string[]
}
export interface ProductItem{
    id: string;
    name: string;
    description: string;
    content: string;
    productId: string;
    type: ProductItemType
    imageURL: string;
    productItemDetail: ProductItemDetail[];
}
export interface ProductItemResponse{
    paging: Paging;
    category: Category;
    product: Product;
    productItems: ProductItem[];
}
export interface ProductItemDetailResponse{
    category: Category;
    product: Product;
    productItem: ProductItem;
}

export interface ProductItemInCart extends ProductItem{
    quantityInCart: number
}