import { Response } from "app/models/response";
import { UserTree, UserTreeResponse } from "app/models/user-tree";
import golbalAxios from "../utils/http-client";

const createUserTree = async (data: Partial<UserTree>) =>{
    const res = await golbalAxios.post<Response<{userTrees: UserTree}>>('/user-tree/create-user-tree', data)
    return res.data
}

const getUserTree = async () =>{
    const res = await golbalAxios.get<Response<UserTreeResponse>>('/user-tree/get-user-tree')
    return res.data
}

const updateUserTree = async (data: Partial<UserTree>) =>{
    const res = await golbalAxios.post(`/user-tree/update-user-tree`, data)
    return res.data
}

const changeStatus = async (id: string, status: 'active' | 'disable') =>{
    const res = await golbalAxios.post(`/user-tree/update-user-tree-status`, {id, status})
    return res.data
}

const userTreeService = {
    createUserTree,
    getUserTree,
    updateUserTree,
    changeStatus
}

export default userTreeService