import Dayjs from 'dayjs'

const dateToString = (date: string) =>{
    const d = new Date(date)
    const result = Dayjs(d).format('DD/MM/YYYY')
    return result
}
const isDisplayExtendRentOrder = (date: Date) =>{
    const d1 = Dayjs(new Date())
    const d2 = Dayjs(date)

    if(d2.diff(d1, 'days') >= 0){
        return true
    }
    return false
}

const getDiff2Days = (date1: Date, date2: Date) =>{
    const d1 = Dayjs(date1)
    const d2 = Dayjs(date2)

    return d2.diff(d1, 'days')
}

const dateTimeToString = (time: string | Date) =>{
    const date = new Date(time);
    const dateString = `${("0" + date.getDate()).slice(-2)}/${("0" + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()} ${("0" + date.getHours()).slice(-2)}:${("0" + date.getMinutes()).slice(-2)}:${("0" + date.getSeconds()).slice(-2)}`;
    return dateString
}

const utilDateTime = {
    dateToString,
    isDisplayExtendRentOrder,
    getDiff2Days,
    dateTimeToString
}

export default utilDateTime;