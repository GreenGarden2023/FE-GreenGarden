import { Paging } from "app/models/paging";
import queryString from "query-string";
import golbalAxios from "../utils/http-client";

const getAllProductItem = async (pagingProps: Partial<Paging>) =>{
    const result = await golbalAxios.get(`/product/get-products-by-category?${queryString.stringify(pagingProps)}`);
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