import React from 'react'
import CurrencyFormat from 'react-currency-format'

interface MoneyFormatProps{
    value: string | number
}

const MoneyFormat: React.FC<MoneyFormatProps> = ({value}) => {
  return (
        <CurrencyFormat value={value} displayType={'text'} thousandSeparator={true} suffix={'VNĐ'} />
  )
}

export default MoneyFormat