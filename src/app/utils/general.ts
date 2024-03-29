import { OrderStatus } from "app/models/general-type"
import CurrencyFormat from "react-currency-format"

const statusToColor = (status: OrderStatus) =>{
    switch(status){
        case 'unpaid': return '#AAAAAA'
        case 'ready': return '#108ee9'
        case 'paid': return '#87d068'
        case 'completed': return '#2db7f5'
        case 'cancel': return 'f50'
    }
}
const statusToViLanguage = (status: OrderStatus) =>{
    switch(status){
        case 'unpaid': return 'Đang xử lý'
        case 'ready': return 'Đã thanh toán cọc'
        case 'paid': return 'Đã thanh toán đủ'
        case 'completed': return 'Đã hoàn thành đơn hàng'
        case 'cancel': return 'Đã bị hủy'
    }
}

const setDefaultImage = ({currentTarget}) =>{
    currentTarget.onerror = null
    currentTarget.src = '/assets/inventory-empty.png'
}

const setCurrency = (setValue, key: string, values: CurrencyFormat.Values) =>{
    const { floatValue } = values
    const data = Number(floatValue || 0)
    if(!floatValue || floatValue < 0){
        setValue(key as any, 0)
    }else{
        console.log(data)
        setValue(key as any, data)
    }
}

const utilGeneral = {
    statusToColor,
    statusToViLanguage,
    setDefaultImage,
    setCurrency
}

export default utilGeneral