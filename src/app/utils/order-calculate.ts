import { OrderPreview } from "app/models/cart"
import { OrderCalculate } from "app/models/order";

const compare2Orders = (orderUser: OrderCalculate, orderPreview: OrderPreview) =>{
    if(!orderUser || !orderPreview) return false;

    const { deposit, remainMoney, totalPrice, transportFee } = orderUser
    const { deposit: deposit2, totalPricePayment, transportFee: transportFee2 } = orderPreview

    if(deposit2 !== deposit || remainMoney !== totalPricePayment || totalPrice !== totalPricePayment || transportFee !== transportFee2){
        return false
    }

    return true
}

const utilCalculate = {
    compare2Orders
}

export default utilCalculate