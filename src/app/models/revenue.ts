export interface RevenueRenderProps{
    startDate?: string;
    endDate?: string;
}

export interface FRevenue{
    totalRevenue: number;
    rentRevenue: number;
    saleRevenue: number;
    serviceRevenue: number;
    serviceComboRevenue: number;
}