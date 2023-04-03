import React from 'react'
import CurrencyFormat from 'react-currency-format'
import './style.scss'

interface CurrencyInputProps{
    value: string | number
    min: number
    disbaled?: boolean
    onChange: (values: CurrencyFormat.Values) => void
}

const CurrencyInput: React.FC<CurrencyInputProps> = ({value, min, disbaled, onChange}) => {
  return (
    <CurrencyFormat
        className='currency-input'
        thousandSeparator 
        value={value}
        disabled={disbaled}
        isAllowed={(values) => {
            const { floatValue } = values
            const data = Number(floatValue || 0)
            onChange(values)
            return data > min
        }}
    />
  )
}

export default CurrencyInput