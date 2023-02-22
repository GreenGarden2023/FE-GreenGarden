import { Status } from 'app/models/general-type';
import queryString from 'query-string';
import { Category, CategoryHandle } from "../models/category";
import { Paging } from "../models/paging";
import { Response } from "../models/response";
import golbalAxios from "../utils/http-client";

interface Data{
    paging: Paging;
    result: Category[]
}

const getAllCategory = async (pagingProps?: Partial<Paging>): Promise<Response<Data>> =>{
    if(pagingProps){
        const result = await golbalAxios.get<Response<Data>>(`/category/get-all?${queryString.stringify(pagingProps)}`);
        return result.data
    }
    const result = await golbalAxios.get<Response<Data>>(`/category/get-all`);
    return result.data
}
const getAllCategoryByStatus = async (pagingProps: Partial<Paging>, status: Status): Promise<Response<Data>> =>{
    const params = {
        ...pagingProps,
        status: status.toLowerCase()
    }
    const result = await golbalAxios.get<Response<Data>>(`/category/get-category-by-status?${queryString.stringify(params)}`);
    return result.data
}
const createCategory = async (category: CategoryHandle): Promise<Response<Category>> => {
    const { Name, Description, imgFile } = category
    const categoryCreate = {
        Name, Description, 
        Image: imgFile
    }
    const result = await golbalAxios.post<Response<Category>>(`/category/create-category`, {...categoryCreate}, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    return result.data
}
const updateCategory = async (category: CategoryHandle): Promise<Response<Category>> =>{
    const { ID, Name, Status, Description, imgFile } = category
    const categoryUpdate = {
        ID, Name, Status, Description, Image: imgFile
    }
    const result = await golbalAxios.post<Response<Category>>(`/category/update-category`, {...categoryUpdate}, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    return result.data
}

const toggleStatus = async (categoryId: string, categoryName: string, status: string) =>{
    const categoryToggle = {
        ID: categoryId,
        Status: status,
        Name: categoryName
    }
    const result = await golbalAxios.post<Response<Category>>(`/category/update-category`, {...categoryToggle}, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    return result.data
}

const categoryService = {
    getAllCategory,
    createCategory,
    updateCategory,
    toggleStatus,
    getAllCategoryByStatus
}

export default categoryService;