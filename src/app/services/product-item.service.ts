import { ProductItemType, Status } from "app/models/general-type";
import { Paging } from "app/models/paging";
import { ProductItem, ProductItemDetail, ProductItemDetailHandle, ProductItemDetailResponse, ProductItemResponse } from "app/models/product-item";
import { Response } from "app/models/response";
import queryString from "query-string";
import golbalAxios from "../utils/http-client";

interface GetAllProps{
    productID: string;
    sizeID?: string;
    type?: ProductItemType;
    status?: Status
}

const getAllProductItem = async (pagingProps: Partial<Paging>, props: GetAllProps): Promise<Response<ProductItemResponse>> =>{
    const getAllProps = {
        ...pagingProps,
        ...props
    }
    const result = await golbalAxios.get<Response<ProductItemResponse>>(`/product-item/get-product-item?${queryString.stringify(getAllProps)}`);
    return result.data
}
const createProductItem = async (productItem: Partial<ProductItem>) =>{
    const result = await golbalAxios.post<Response<ProductItem>>(`/product-item/create-product-item`, productItem);
    return result.data
}
const updateProductItem = async (productItem: Partial<ProductItem>) =>{
    const result = await golbalAxios.post<Response<ProductItem>>(`/product-item/update-product-item`, productItem);
    return result.data
}
const getProductItemDetail = async (productItemId: string, sizeProductItemStatus: Status): Promise<Response<ProductItemDetailResponse>> =>{
    const props = {
        productItemId,
        sizeProductItemStatus
    }
    const result = await golbalAxios.get<Response<ProductItemDetailResponse>>(`/product-item/get-product-item-detail?${queryString.stringify(props)}`);
    return result.data
}
const createProductItemDetail = async (item: ProductItemDetailHandle) =>{
    const result = await golbalAxios.post<Response<ProductItemDetailHandle>>(`/product-item/create-product-item-detail`, item);
    return result.data
}
const updateProductItemDetail = async (item: ProductItemDetailHandle) =>{
    const result = await golbalAxios.post<Response<ProductItemDetailHandle>>(`/product-item/update-product-item-detail`, item);
    return result.data
}

const productItemService = {
    getAllProductItem,
    createProductItem,
    updateProductItem,
    getProductItemDetail,
    createProductItemDetail,
    updateProductItemDetail
}

export default productItemService