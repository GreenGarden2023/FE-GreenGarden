import { RcFile } from "antd/es/upload";
import { ProductItemType, Status } from "./general-type";
import { Size } from "./size";

export interface ProductItem{
    id: string;
    name: string;
    productId: string;
    description: string;
    sizeModelList: ProductItemSize[];
    type: ProductItemType
}

export interface ProductItemSize{
    id: string;
    quantity: number;
    rentPrice: number;
    salePrice: number;
    size: Size;
    status: Status;
    imagesURL: string[]
    content: string;
}

interface ProductItemSizeCreate {
    sizeId: string;
    quantity: number;
    rentPrice: number;
    salePrice: number;
    content: string;
    status: Status;
    imagesURL: string[];
    Images: RcFile[]
}

export interface ProductItemHandleCreate{
    name: string;
    productId: string;
    description: string;
    type: ProductItemType
    sizeModelList: Partial<ProductItemSizeCreate>[];
}

export interface ProductItemInCart extends ProductItem{
    quantityInCart: number
}