import { RcFile } from "antd/es/upload";

export interface Category{
    id: string;
    name: string;
    status: string;
    imgUrl: string;
    description: string;
}

export interface CategoryHandle{
    ID?: string;
    Name: string;
    Description: string;
    Status?: string;
    imgUrl?: string;
    imgFile?: RcFile | undefined;
}