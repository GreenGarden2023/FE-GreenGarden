import { RcFile } from "antd/es/upload";
import { Size } from "./size";

export interface ProductItem{
    id: string;
    name: string;
    salePrice: number;
    status: string;
    description: string;
    productId: string;
    size: Size;
    quantity: number;
    type: string;
    rentPrice: number;
    content: string;
    imgURLs: string[];
}

export interface ProductItemHandle{
    id?: string
    name: string;
    salePrice: number;
    status: string;
    description: string;
    productId: string;
    sizeId: string;
    quantity: number;
    type: string;
    rentPrice: number;
    content: string;
    imgURLs?: string[];
    imgFiles?: RcFile[];
}

export interface ProductItemInCart extends ProductItem{
    quantityInCart: number
}