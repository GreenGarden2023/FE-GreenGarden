import { Role } from "./general-type";

export interface UserRegister{
    userName: string;
    password: string;
    fullName: string;
    address: string;
    phone: string;
    favorite: string;
    mail: string;
    confirmPassword: string;
    isAgreeTerm: boolean;
    districtID: number;
    roleName: Role
}