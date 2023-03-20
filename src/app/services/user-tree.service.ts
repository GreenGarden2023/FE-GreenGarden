import { Response } from "app/models/response";
import { UserTree, UserTreeResponse } from "app/models/user-tree";
import golbalAxios from "../utils/http-client";

const createUserTree = async (data: Partial<UserTree>) =>{
    const res = await golbalAxios.post<Response<{userTrees: UserTree}>>('/userTree/create-user-tree', data)
    return res.data
}

const getListUserTree = async () =>{
    const res = await golbalAxios.get<Response<UserTreeResponse>>('/userTree/get-list-user-tree')
    return res.data
}

const getDetailUserTree = async (userTreeID: string) =>{
    const res = await golbalAxios.get<Response<UserTreeResponse>>(`/userTree/get-detail-user-tree?userTreeID=${userTreeID}`)
    return res.data
}

const updateUserTree = async (data: Partial<UserTree>) =>{
    const res = await golbalAxios.post(`/userTree/update-user-tree`, data)
    return res.data
}

const changeStatus = async (data: Partial<UserTree>) =>{
    const res = await golbalAxios.patch(`/userTree/changeStatus`, data)
    return res.data
}

const userTreeService = {
    createUserTree,
    getListUserTree,
    getDetailUserTree,
    updateUserTree,
    changeStatus
}

export default userTreeService