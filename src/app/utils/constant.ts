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
    CLIENT_PRODUCT: 5,
    PRODUCT_ITEM: 20,
    CLIENT_PRODUCT_ITEM: 20,
    CLIENT_ORDER_SALE: 10,
    CLIENT_ORDER_RENT: 10,
    CLIENT_ORDER_RENT_GROUP: 20,
    MANAGE_ORDER_SALE: 20,
    MANAGE_ORDER_RENT: 20,
    MANAGE_ORDER_RENT_GROUP: 20,
    MANAGE_USER: 5,
    REQUEST: 20,
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

const ROLES_DECLARE: Role[] = ['Admin', 'Customer', 'Manager', 'Technician']


const MANAGE_CATEGORY: Role[] = ['Manager']
const MANAGE_PRODUCT: Role[] = ['Manager']
const MANAGE_PRODUCT_ITEM: Role[] = ['Manager']
const MANAGE_SIZE: Role[] = ['Manager']
const MANAGE_ORDER: Role[] = ['Manager']
const MANAGE_SHIPPING_FEE: Role[] = ['Admin']
const MANAGE_USERS: Role[] = ['Admin']
const TAKE_CARE_ORDER: Role[] = ['Technician']

const PAYMENT_MESSAGE = {
    PAID_DEPOSIT: 'Đơn hàng này đã thanh toán tiền cọc',
    PAID_REMAINING: 'Đơn hàng này đã thanh toán đủ',
    MIN_AMOUNT_PAYMENT: 'Số tiền nhập vào ít nhất là 1.000 VNĐ và phần còn lại phải nhiều hơn 1000'
}
const PHONE_REGEX = /(0[3|5|7|8|9])+([0-9]{8})\b/g
const EMAIL_REGEX = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
const DATE_FORMAT_LIST = ['DD/MM/YYYY', 'DD/MM/YY', 'DD-MM-YYYY', 'DD-MM-YY'];

// 1000vnđ / điểm
const POINT_TO_MONEY = 1000
// total price / 100000
const REWARD_POINT_RATE = 100000
// đơn thuê ít nhất 200k mới có deposit
const RENT_DEPOSIT_RATE = 200000
// đơn mua ít nhất 500k mới có deposit
const SALE_DEPOSIT_RATE = 500000
// giá order >= 50k mới cho nhập tích điểm
const MIN_ORDER = 50000
// / 10k tối thiểu
const MONEY_RATE = 10000
// trả trước ít nhất 20% order
const DEPOSIT_MIN_RATE = 0.2

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
    MANAGE_ORDER,
    PAYMENT_MESSAGE,
    MANAGE_SHIPPING_FEE,
    TAKE_CARE_ORDER,
    PHONE_REGEX,
    EMAIL_REGEX,
    DATE_FORMAT_LIST,
    POINT_TO_MONEY,
    REWARD_POINT_RATE,
    RENT_DEPOSIT_RATE,
    SALE_DEPOSIT_RATE,
    MIN_ORDER,
    MONEY_RATE,
    DEPOSIT_MIN_RATE,
    MANAGE_USERS,
    ROLES_DECLARE
}

export default CONSTANT