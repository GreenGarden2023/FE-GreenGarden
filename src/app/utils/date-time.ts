import dayjs from 'dayjs'

const dateToString = (date: string) =>{
    const d = new Date(date)
    const result = dayjs(d).format('DD/MM/YYYY')
    return result
}
const isDisplayExtendRentOrder = (date: Date) =>{
    const d1 = dayjs(new Date())
    const d2 = dayjs(date)

    if(d2.diff(d1, 'days') >= 0){
        return true
    }
    return false
}

const getDiff2Days = (date1: Date, date2: Date) =>{
    const d1 = dayjs(date1)
    const d2 = dayjs(date2)

    return d2.diff(d1, 'days')
}

const dateTimeToString = (time: string | Date) =>{
    const date = new Date(time);
    const dateString = `${("0" + date.getDate()).slice(-2)}/${("0" + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()} ${("0" + date.getHours()).slice(-2)}:${("0" + date.getMinutes()).slice(-2)}:${("0" + date.getSeconds()).slice(-2)}`;
    return dateString
}

const dayjsToLocalString = (date: dayjs.Dayjs) => {
    return date.toDate().toLocaleDateString() as any
}

const dayjsToLocalStringTemp = (date: dayjs.Dayjs) => {
    const dateString = date.toDate().toLocaleDateString()
    const [_mm, _dd, _yyyy] = dateString.split('/')
    return `${_dd.length === 2 ? _dd : `0${_dd}`}/${_mm.length === 2 ? _mm : `0${_mm}`}/${_yyyy}`
}

const plusDate = (date: Date | string, plusNumber: number) =>{
    const current = new Date(date)
    current.setDate(current.getDate() + plusNumber)

    return current
}

const utilDateTime = {
    dateToString,
    isDisplayExtendRentOrder,
    getDiff2Days,
    dateTimeToString,
    dayjsToLocalString,
    plusDate,
    dayjsToLocalStringTemp
}

export default utilDateTime;