import { RcFile } from "antd/es/upload";
import { ProductItemType, Status } from "./general-type";
import { Size } from "./size";

export interface ProductItemSize{
    id: string;
    // name: string;
    // productItemId: string;
    quantity: number;
    rentPrice: number;
    salePrice: number;
    size: Size;
    status: Status;
    imagesURL: string[]
    content: string;
}

interface ProductItemSizeCreate extends ProductItemSize{
    imgFiles: RcFile[]
}

export interface ProductItem{
    id: string;
    name: string;
    productId: string;
    description: string;
    sizeModelList: ProductItemSize[];
    type: ProductItemType
}

export interface ProductItemHandleCreate{
    name: string;
    productId: string;
    description: string;
    sizeModelList: Partial<ProductItemSizeCreate>[];
    type: ProductItemType
}

export interface ProductItemInCart extends ProductItem{
    quantityInCart: number
}