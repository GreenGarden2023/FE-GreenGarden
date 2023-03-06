import { OrderStatus } from "app/models/general-type"

const statusToColor = (status: OrderStatus) =>{
    switch(status){
        case 'unpaid': return '#AAAAAA'
        case 'ready': return '#108ee9'
        case 'paid': return '#87d068'
        case 'completed': return '#2db7f5'
        case 'cancle': return 'f50'
    }
}
const statusToViLanguage = (status: OrderStatus) =>{
    switch(status){
        case 'unpaid': return 'Đang xử lý'
        case 'ready': return 'Đã thanh toán cọc'
        case 'paid': return 'Đã thanh toán đủ'
        case 'completed': return 'Đã hoàn tất và hoàn cọc'
        case 'cancle': return 'Đã bị hủy'
    }
}
const setDefaultImage = ({currentTarget}) =>{
    currentTarget.onerror = null
    currentTarget.src = '/assets/inventory-empty.png'
}

const utilGeneral = {
    statusToColor,
    statusToViLanguage,
    setDefaultImage
}

export default utilGeneral