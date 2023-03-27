import { Response } from "app/models/response";
import { UserTree } from "app/models/user-tree";
import golbalAxios from "../utils/http-client";

const createUserTree = async (data: Partial<UserTree>) =>{
    const res = await golbalAxios.post<Response<UserTree>>('/user-tree/create-user-tree', data)
    return res.data
}

const getUserTree = async () =>{
    const res = await golbalAxios.get<Response<UserTree[]>>('/user-tree/get-user-tree')
    return res.data
}

const updateUserTree = async (data: Partial<UserTree>) =>{
    const res = await golbalAxios.post(`/user-tree/update-user-tree`, data)
    return res.data
}

const updateUserTreeStatus = async (id: string, status: 'active' | 'disable') =>{
    const res = await golbalAxios.post(`/user-tree/update-user-tree-status`, {id, status})
    return res.data
}

const userTreeService = {
    createUserTree,
    getUserTree,
    updateUserTree,
    updateUserTreeStatus
}

export default userTreeService