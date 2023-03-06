import dayjs from 'dayjs'

const dateToString = (date: string) =>{
    const d = new Date(date)
    const result = dayjs(d).format('DD/MM/YYYY')
    return result
}

const utilDateTime = {
    dateToString
}

export default utilDateTime;