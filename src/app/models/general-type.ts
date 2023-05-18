export type Status = 'active' | 'disable' | 'all'
export type Action = 'Create' | 'Update' | ''
export type Role = 'Customer' | 'Admin' | 'Manager' | 'Technician'
// 1 rent - 2 sale - 3 all
export type TypeOfSale = 'rent' | 'sale' | 'all'
// 1-duy nhất-unique, 2-số lượng lớn-normal
export type ProductItemType = 'normal' | 'unique' | ''
export type CartType = 'Rent' | 'Sale'
export type OrderStatus = 'unpaid' | 'ready' | 'paid' | 'completed' | 'cancel' | 'delivery' | 'renting' | ''
export type OrderType = 'rent' | 'sale' | 'service' | 'request' | 'package' | '' 
export type PaymentActionType = 'detail' | 'deposit' | 'remaining' | 'extend' | 'return deposit' | 'assign' | 'accept service' | 'reject service' | 'update infor'  | 'create order' | 'cancel' | 'create calendar' | 'update calendar' | 'refund' | 'view transaction' |  'delivery' | 'finished' | 'renting' |''
export type ServiceStatus = 'accepted' | 'rejected' | 'processing' | 'confirmed' | 'reprocess' | 'user approved' | 'completed' | 'cancel' | 'taking care'
export type TransactionType = 'rent deposit' | 'sale deposit' | 'service deposit' | 'rent payment' | 'sale payment' | 'service payment' | 'rent refund' | 'sale refund' | 'service refund' | 'compensation payment'
export type TakeCareStatus = 'pending' | 'done'
// ---- package
export type TStatusPkg = 'active' | 'disabled' | 'all'
export type TServicePkgStatus = 'pending' | 'accepted' | 'rejected' | 'all'