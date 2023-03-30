export type Status = 'active' | 'disable' | 'all'
export type Action = 'Create' | 'Update' | ''
export type Role = 'Customer' | 'Admin' | 'Staff' | 'Manager' | 'Technician'
// 1 rent - 2 sale - 3 all
export type TypeOfSale = 'rent' | 'sale' | 'all'
// 1-duy nhất-unique, 2-số lượng lớn-normal
export type ProductItemType = 'normal' | 'unique' | ''
export type CartType = 'Rent' | 'Sale'
export type OrderStatus = 'unpaid' | 'ready' | 'paid' | 'completed' | 'cancel'
export type OrderType = 'rent' | 'sale' | 'service' | ''
export type PaymentActionType = 'detail' | 'deposit' | 'remaining' | 'extend' | 'return deposit' | 'assign' | 'accept service' | 'reject service' | 'update infor'  | 'create order' | 'cancel' | 'create calendar' | 'update calendar' | 'refund' |''
export type ServiceStatus = 'accepted' | 'rejected' | 'processing' | 'confirmed' | 'reprocess' | 'user approved'
