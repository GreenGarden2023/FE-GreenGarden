import { PagingProps } from "app/models/paging";
import golbalAxios from "../utils/http-client";
import { Response } from "app/models/response";
import { UserReponse } from "app/models/user";
import queryString from "query-string";

const getListAccountByAdmin = async (paging: Partial<PagingProps>) =>{
    const res = await golbalAxios.get<Response<UserReponse>>(`/user/get-list-account-by-admin?${queryString.stringify(paging)}`)
    return res.data
}

const updateUserStatus = async (userID: string, status: 'enable' | 'disable') =>{
    const res = await golbalAxios.post('/user/update-user-status', { userID, status })
    return res.data
}

const updateUser = async (data: any) =>{
    const res = await golbalAxios.post('/user/update-user', data)
    return res.data
}

const userService = {
    getListAccountByAdmin,
    updateUserStatus,
    updateUser
}

export default userService