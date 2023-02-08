import { UserRegister } from "../models/register";
import { Response } from "../models/response";
import { UserLogin } from "../models/user";
import golbalAxios from "../utils/http-client"

const register = async (user: Partial<UserRegister>): Promise<Response<null>> =>{
    const result = await golbalAxios.post<Response<null>>('/user/register', { ...user });
    return result.data
}
const login = async (username: string, password: string): Promise<Response<UserLogin>> =>{
    const result = await golbalAxios.post<Response<UserLogin>>('/user/login', {username, password});
    return result.data
}
const getUserDetail = async (): Promise<Response<UserLogin>> => {
    const result = await golbalAxios.get<Response<UserLogin>>('/user/get-current-user');
    return result.data
}
const authService = {
    register,
    login,
    getUserDetail
}

export default authService