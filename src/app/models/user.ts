export interface User{
    id: string;
    userName: string;
    fullName: string;
    address: string;
    phone: string;
    favorite: string;
    mail: string;
    roleName: string;
}
export interface UserLogin extends User{
    token: string;
    role: string;
    loading: boolean;
}
export interface UserUpdate{
    id: string;
    fullName: string;
    address: string;
    phone: string;
    mail: string;
    favorite: string;
}