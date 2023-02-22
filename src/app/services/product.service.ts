import { Category } from "app/models/category";
import { Status } from "app/models/general-type";
import { Paging } from "app/models/paging";
import { Product, ProductHandle } from "app/models/product";
import { Response } from "app/models/response";
import queryString from "query-string";
import golbalAxios from "../utils/http-client";

interface GetData{
    paging: Paging;
    category: Category
    result: Product[]
}

const getAllProduct = async (pagingProps: Partial<Paging>, categoryId: string, status?: Status): Promise<Response<GetData>> =>{
    const params = {
        ...pagingProps,
        categoryId,
        status: status ? status.toLowerCase() : undefined
    }
    const result = await golbalAxios.get<Response<GetData>>(`/product/get-products-by-category-status?${queryString.stringify(params)}`);
    return result.data
}

const createProduct = async (product: ProductHandle): Promise<Response<Product>> =>{
    const { categoryId, name, description, imgFile } = product
    const productCreate = {
        Name: name,
        Description: description,
        CategoryId: categoryId,
        ImgFile: imgFile
    }
    const result = await golbalAxios.post<Response<Product>>(`/product/create-product`, productCreate, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return result.data
}
const updateProduct = async (product: ProductHandle) =>{
    const { categoryId, name, description, imgFile, id, status } = product
    const productUpdate = {
        ID: id,
        Name: name,
        Description: description,
        CategoryId: categoryId,
        Image: imgFile,
        Status: status
    }
    const result = await golbalAxios.post(`/product/update-product`, productUpdate, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return result.data
}
const toggleProduct = async (product: Product, status: Status) =>{
    const productToggle = {
        ID: product.id,
        Name: product.name,
        Status: status,
        CategoryId: product.categoryId
    }
    const result = await golbalAxios.post(`/product/update-product`, productToggle, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return result.data
}

const productServcie = {
    getAllProduct,
    createProduct,
    updateProduct,
    toggleProduct
}

export default productServcie