export interface Response<T>{
    code: number;
    result: T;
    message: string;
    responseFail: string;
}