import { RcFile } from "antd/es/upload";
import { Status } from "./general-type";

export interface Product{
    id: string;
    name: string;
    categoryId: string;
    description: string;
    imgUrl: string;
    quantity?: number;
    status: Status;
}

export interface ProductHandle{
    id?: string;
    name: string;
    description: string;
    imgUrl?: string;
    imgFile?: RcFile | undefined;
    categoryId: string;
    status: Status;
}