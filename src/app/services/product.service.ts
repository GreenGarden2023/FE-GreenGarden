import { Category } from "app/models/category";
import { Status, TypeOfSale } from "app/models/general-type";
import { Paging } from "app/models/paging";
import { Product, ProductHandle } from "app/models/product";
import { Response } from "app/models/response";
import queryString from "query-string";
import golbalAxios from "../utils/http-client";
import { PagingProps } from "app/models/paging";
import { ProductItemResponse } from "app/models/product-item";

interface GetData{
    paging: Paging;
    category: Category
    result: Product[]
}

const getAllProduct = async (pagingProps: Partial<Paging>, categoryId: string, status?: Status, typeOfSale?: TypeOfSale): Promise<Response<GetData>> =>{
    const params = {
        ...pagingProps,
        categoryId,
        status: status ? status.toLowerCase() : undefined,
        rentSale: typeOfSale
    }
    const result = await golbalAxios.get<Response<GetData>>(`/product/get-products-by-category-status?${queryString.stringify(params)}`);
    return result.data
}

const getProductsBySearchText = async (pagingProps: PagingProps, categoryID: string) =>{
    const params = { ...pagingProps, categoryID }
    const result = await golbalAxios.get<Response<GetData>>(`/product/get-products-by-search-text?${queryString.stringify(params)}`);
    return result.data
}

const getProductItemsBySearchText = async (pagingProps: PagingProps, productID: string) =>{
    const params = { ...pagingProps, productID }
    const result = await golbalAxios.get<Response<ProductItemResponse>>(`/product/get-product-items-by-search-text?${queryString.stringify(params)}`);
    return result.data
}

const createProduct = async (product: ProductHandle): Promise<Response<Product>> =>{
    const { categoryId, name, description, imgFile, isForRent, isForSale } = product
    const productCreate = {
        Name: name,
        Description: description,
        CategoryId: categoryId,
        ImgFile: imgFile,
        IsForRent: isForRent,
        IsForSale: isForSale,
    }
    const result = await golbalAxios.post<Response<Product>>(`/product/create-product`, productCreate, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return result.data
}
const updateProduct = async (product: ProductHandle) =>{
    const { categoryId, name, description, imgFile, id, status, isForRent, isForSale } = product
    const productUpdate = {
        ID: id,
        Name: name,
        Description: description,
        CategoryId: categoryId,
        Image: imgFile,
        Status: status,
        IsForRent: isForRent,
        IsForSale: isForSale,
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
        CategoryId: product.categoryId,
        IsForSale: product.isForSale,
        IsForRent: product.isForRent
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
    toggleProduct,
    getProductsBySearchText,
    getProductItemsBySearchText
}

export default productServcie