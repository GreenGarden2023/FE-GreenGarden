import { PagingProps } from "app/models/paging";
import golbalAxios from "../utils/http-client";
import { Response } from "app/models/response";
import { CreateUserByAdmin, User, UserReponse, UserUpdate } from "app/models/user";
import queryString from "query-string";

const getListAccountByAdmin = async (paging: Partial<PagingProps>) =>{
    const res = await golbalAxios.get<Response<UserReponse>>(`/user/get-list-account-by-admin?${queryString.stringify(paging)}`)
    return res.data
}

const updateUserStatus = async (userID: string, status: 'enable' | 'disabled') =>{
    const res = await golbalAxios.post('/user/update-user-status', { userID, status })
    return res.data
}

const updateUser = async (data: UserUpdate) =>{
    const res = await golbalAxios.post<Response<User>>('/user/update-user', data)
    return res.data
}

const createUserByAdmin = async (data: CreateUserByAdmin) =>{
    const res = await golbalAxios.post<Response<User>>('/user/create-user-by-admin', data)
    return res.data
}

const updateUserByAdmin = async (data: CreateUserByAdmin) =>{
    const res = await golbalAxios.post<Response<User>>('/user/update-user-by-admin', data)
    return res.data
}

const userService = {
    getListAccountByAdmin,
    updateUserStatus,
    updateUser,
    createUserByAdmin,
    updateUserByAdmin
}

export default userService