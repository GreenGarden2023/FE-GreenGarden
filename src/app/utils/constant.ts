import { Role } from "app/models/general-type"

const APP_NAME = 'Green Garden'
const STORAGE = {
    ACCESS_TOKEN: 'access-token',
    REFRESH_TOKEN: 'refresh-token'
}
const ROLES = {
    CUSTOMER: 'Customer',
    ADMIN: 'Admin',
    STAFF: 'Staff'
}
const MESSAGES = {

}
const FAVORITES = ['Hoa giấy', 'Hoa Hồng', 'Cây cảnh', 'Cây để bàn']
const ERROS_MESSAGE = {
    RESPONSE: 'Error occurred while handling. Please try again',
    RESPONSE_VI: 'Đã xảy ra lỗi trong khi xử lý. Vui lòng thử lại',
}
const PAGING_ITEMS = {
    CATEGORY: 10,
    CLIENT_CATEGORY: 20,
    PRODUCT: 5,
    CLIENT_PRODUCT: 20,
    PRODUCT_ITEM: 20,
    CLIENT_PRODUCT_ITEM: 20
}
const STATUS = {
    ACTIVE: 'Active',
    DISABLE: 'Disable'
}
const ACTION = {
    CREATE: 'Create',
    UPDATE: 'Update'
}
const SIZES = {
    SMALL: 'Small',
    MEDIUM: 'Medium',
    LARGE: 'Large',
    UNIQUE: 'Unique'
}
const SUPPORT_FORMATS = ['image/png', 'image/jpg', 'image/jpeg']



const MANAGE_CATEGORY: Role[] = ['Admin', 'Staff', 'Manager']
const MANAGE_PRODUCT: Role[] = ['Admin', 'Staff', 'Manager']
const MANAGE_PRODUCT_ITEM: Role[] = ['Admin', 'Staff', 'Manager']
const MANAGE_SIZE: Role[] = ['Admin', 'Staff', 'Manager']
const MANAGE_ORDER: Role[] = ['Admin', 'Staff', 'Manager']

const CONSTANT = {
    STORAGE,
    ROLES,
    MESSAGES,
    FAVORITES,
    APP_NAME,
    ERROS_MESSAGE,
    PAGING_ITEMS,
    STATUS,
    ACTION,
    SIZES,
    SUPPORT_FORMATS,
    MANAGE_CATEGORY,
    MANAGE_PRODUCT,
    MANAGE_PRODUCT_ITEM,
    MANAGE_SIZE,
    MANAGE_ORDER
}

export default CONSTANT