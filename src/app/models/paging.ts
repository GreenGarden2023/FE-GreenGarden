export interface Paging{
    searchText: string;
    pageSize: number;
    curPage: number;
    recordCount: number;
    pageCount: number
}
export interface PagingProps{
    searchText: string;
    pageSize: number;
    curPage: number;
}