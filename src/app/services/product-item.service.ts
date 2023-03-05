import { Category } from "app/models/category";
import { ProductItemType, Status } from "app/models/general-type";
import { Paging } from "app/models/paging";
import { Product } from "app/models/product";
import { ProductItem } from "app/models/product-item";
import { Response } from "app/models/response";
import queryString from "query-string";
import golbalAxios from "../utils/http-client";

interface GetAllProps{
    productID: string;
    sizeID?: string;
    type?: ProductItemType;
    status?: Status
}
interface ResponseType{
    paging: Paging;
    productItems: ProductItem[];
    category: Category;
    product: Product
}

const getAllProductItem = async (pagingProps: Partial<Paging>, props: GetAllProps): Promise<Response<ResponseType>> =>{
    const getAllProps = {
        ...pagingProps,
        ...props
    }
    const result = await golbalAxios.get<Response<ResponseType>>(`/product-item/get-product-item?${queryString.stringify(getAllProps)}`);
    return result.data
}
const createProductItem = async () =>{
    
}
const updateProductItem = async () =>{
    
}

const productItemService = {
    getAllProductItem,
    createProductItem,
    updateProductItem
}

export default productItemService