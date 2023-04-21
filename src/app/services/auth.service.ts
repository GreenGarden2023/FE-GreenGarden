import jwt_decode from 'jwt-decode';
import { JWTDecode } from "../models/decode";
import { UserRegister } from "../models/register";
import { Response } from "../models/response";
import { LoginResponse, User, UserGetByRole } from "../models/user";
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
const getUserListByRole = async (role: 'admin' | 'technician' | 'customer' | 'manager') => {
    const res = await golbalAxios.get<Response<UserGetByRole[]>>(`/user/get-user-list-by-role?role=${role}`)
    return res.data
}

const sendEmailCode = async (email: string) =>{
    const res = await golbalAxios.post(`/user/send-email-code?email=${email}`)
    return res.data
}

const verifyRegisterOtpCode = async (email: string, otpCode: string) =>{
    const res = await golbalAxios.post<Response<User>>('/user/verify-register-otp-code', { email, otpCode})
    return res.data
}

const authService = {
    register,
    login,
    getUserDetail,
    decodeToken,
    getUserListByRole,
    sendEmailCode,
    verifyRegisterOtpCode
}

export default authService