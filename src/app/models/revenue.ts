import { Size } from "./size";

export interface RevenueRenderProps{
    startDate?: string;
    endDate?: string;
}

// ------------------------------

export interface FRevenue{
    totalRevenue: number;
    rentRevenue: number;
    saleRevenue: number;
    serviceRevenue: number;
    serviceComboRevenue: number;
}

// ------------------------------

export interface SRevenue{
    productItemDetail: ProductItemDetail
    quantity: number
    revenueProductItemDetail: number
}

interface ProductItemDetail {
    id: string
    product: Product
    size: Size
    rentPrice: number
    salePrice: number
    quantity: number
    transportFee: number
    status: string
    careGuide: string
    imagesURL: string[]
  }

interface Product {
    productId: string
    productName: string
    status: string
    isForRent: boolean
    isForSale: boolean
    imageURL: string
    productItem: ProductItem
}

interface ProductItem {
    productItemId: string
    productItemName: string
    imageURL: string
}

// ------------------------------

export interface TRevenue {
    orderNumer: number
    rentRevenue: number
    itemDetailRevenue: ItemDetailRevenue[]
  }

interface ItemDetailRevenue {
    productItemDetail: ProductItemDetail
    quantity: number
    revenueProductItemDetail: number
}