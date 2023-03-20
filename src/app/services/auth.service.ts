import jwt_decode from 'jwt-decode';
import { JWTDecode } from "../models/decode";
import { UserRegister } from "../models/register";
import { Response } from "../models/response";
import { LoginResponse, User } from "../models/user";
import golbalAxios from "../utils/http-client";

const register = async (user: Partial<UserRegister>): Promise<Response<null>> =>{
    const result = await golbalAxios.post<Response<null>>('/user/register', { ...user });
    return result.data
}
const login = async (username: string, password: string) =>{
    const result = await golbalAxios.post<Response<LoginResponse>>('/user/login', {username, password});
    return result.data
}
const getUserDetail = async () => {
    const result = await golbalAxios.get<Response<User>>('/user/get-current-user');
    return result.data
}
const decodeToken = (token: string) =>{
    const data = jwt_decode<JWTDecode>(token)
    return data
}
const authService = {
    register,
    login,
    getUserDetail,
    decodeToken
}

export default authService