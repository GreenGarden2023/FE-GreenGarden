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

const utilDateTime = {
    dateToString,
    isDisplayExtendRentOrder,
    getDiff2Days
}

export default utilDateTime;