export interface Package{
    id: string
    name: string
    price: number
    description: string
    guarantee: string
    status: boolean
}

export interface PackageHandle extends Partial<Package>{}