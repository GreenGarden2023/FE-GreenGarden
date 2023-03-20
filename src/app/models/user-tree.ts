import { Status } from "./general-type";

export interface UserTree{
    id: string;
    treeName: string;
    description: string;
    quantity: number;
    imgUrl: string[];
    status: Status;
}

export interface UserTreeResponse{
    userTrees: UserTree[]
}