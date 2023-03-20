export interface ServiceCreate {
    startDate: string
    endDate: string
    name: string
    phone: string
    address: string
    mail: string
    userTrees: UserTree[]
}

export interface UserTree {
    userTreeID: string
    quantity: number
}
