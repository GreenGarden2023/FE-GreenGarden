import { Category } from "app/models/category";
import { ProductItemType, Status } from "app/models/general-type";
import { Paging } from "app/models/paging";
import { Product } from "app/models/product";
import { ProductItem, ProductItemHandleCreate } from "app/models/product-item";
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
interface GetDetail{
    category: Category;
    product: Product;
    productItem: ProductItem;
}

const getAllProductItem = async (pagingProps: Partial<Paging>, props: GetAllProps): Promise<Response<ResponseType>> =>{
    const getAllProps = {
        ...pagingProps,
        ...props
    }
    const result = await golbalAxios.get<Response<ResponseType>>(`/product-item/get-product-item?${queryString.stringify(getAllProps)}`);
    return result.data
}
const createProductItem = async (productItemHandleCreate: ProductItemHandleCreate) =>{
    const { name, description, productId, type, sizeModelList } = productItemHandleCreate
    const createProps = {
        Name: name,
        Description: description,
        ProductId: productId,
        Type: type,
        sizeModelList
    }
    const result = await golbalAxios.post<Response<ResponseType>>(`/product-item/create-product-item`, createProps, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return result.data
}
const updateProductItem = async () =>{
    
}
const getProductItemDetail = async (productItemId: string, sizeProductItemStatus: Status): Promise<Response<GetDetail>> =>{
    const props = {
        productItemId,
        sizeProductItemStatus
    }
    const result = await golbalAxios.get<Response<GetDetail>>(`/product-item/get-product-item-detail?${queryString.stringify(props)}`);
    return result.data
}

const productItemService = {
    getAllProductItem,
    createProductItem,
    updateProductItem,
    getProductItemDetail
}

export default productItemService