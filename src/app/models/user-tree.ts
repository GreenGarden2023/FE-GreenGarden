import { Status } from "./general-type";

export interface UserTree{
    id: string;
    userId: string;
    treeName: string;
    description: string;
    quantity: number;
    imgUrls: string[];
    status: Status;
}

export interface UserTreeResponse{
    userTrees: UserTree[]
}