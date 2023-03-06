export type Status = 'active' | 'disable' | 'all'
export type Action = 'Create' | 'Update' | ''
export type Role = 'Customer' | 'Admin' | 'Staff' | 'Manager'
// 1 rent - 2 sale - 3 all
export type TypeOfSale = 'rent' | 'sale' | 'all'
export type ProductItemType = 'normal' | 'unique'
export type CartType = 'Rent' | 'Sale'
export type OrderStatus = 'unpaid' | 'ready' | 'paid' | 'completed' | 'cancle'