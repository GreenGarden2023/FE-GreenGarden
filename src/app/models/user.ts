export interface User{
    id: string;
    userName: string;
    fullName: string;
    address: string;
    districtID:number;
    phone: string;
    favorite: string;
    mail: string;
    roleName: string;
    currentPoint: number;
}

export interface UserUpdate{
    id: string;
    fullName: string;
    address: string;
    phone: string;
    mail: string;
    favorite: string;
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
}