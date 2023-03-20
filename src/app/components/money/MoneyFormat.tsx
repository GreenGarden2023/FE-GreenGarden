import React, { useMemo } from 'react'
import CurrencyFormat from 'react-currency-format'
import './style.scss';

type Color = 'Orange' | 'Green' | 'Blue'

interface MoneyFormatProps{
  value: string | number
  isHighlight?: boolean
  color?: Color
}

const MoneyFormat: React.FC<MoneyFormatProps> = ({value, isHighlight = false, color}) => {

  const GetColor = useMemo(() =>{
    switch(color){
      case 'Orange': return '#ff6a00'
      case 'Green': return '#00a76f'
      default: return '#0099FF'
    }
  }, [color])

  return (
        <CurrencyFormat value={value} displayType={'text'} thousandSeparator={true} suffix={'VNĐ'} className={isHighlight ? 'highlight' : ''} style={{color: color ? GetColor : 'initial'}} />
  )
}

export default MoneyFormat