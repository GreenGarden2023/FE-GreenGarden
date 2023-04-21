import { Role } from "./general-type";
import { Paging } from "./paging";

export interface User{
    id: string;
    userName: string;
    fullName: string;
    address: string;
    districtID: number;
    phone: string;
    favorite: string;
    mail: string;
    roleName: Role;
    currentPoint: number;
    status: 'disabled' | 'enable'
}

export interface UserUpdate{
    id: string;
    fullName: string;
    address: string;
    phone: string;
    mail: string;
    favorite: string;
    districtID: number;
}

export interface LoginResponse{
    user: User
    token: string
}

export interface UserLogin extends LoginResponse{
    loading: boolean;
}

export interface UserGetByRole{
    id: string
    userName: string
    fullName: string
    email: string
    roleName: string
    orderNumber: number
}

export interface UserReponse{
    users: User[]
    paging: Paging
}

export interface CreateUserByAdmin{
    userID?: string
    userName: string
    password: string
    fullName: string
    address: string
    districtId: number
    roleName: Role
    phone: string
    favorite: string
    mail: string
}