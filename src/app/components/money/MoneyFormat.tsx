import React, { useMemo } from 'react'
import CurrencyFormat from 'react-currency-format'
import './style.scss';

type Color = 'Orange' | 'Green' | 'Blue' | 'Light Blue' | 'Yellow' | 'Default'

interface MoneyFormatProps{
  value: string | number
  isHighlight?: boolean
  color?: Color
}

const MoneyFormat: React.FC<MoneyFormatProps> = ({value, isHighlight = false, color}) => {

  const GetColor = useMemo(() =>{
    switch(color){
      case 'Orange': return '#f50'
      case 'Green': return '#00a76f'
      case 'Light Blue': return '#2db7f5'
      case 'Blue' : return '#108ee9'
      case 'Yellow': return '#FFC125'
      default: return '#707070'
    }
  }, [color])

  return (
        <CurrencyFormat value={value} displayType={'text'} thousandSeparator={true} suffix={'VNĐ'} className={isHighlight ? 'highlight' : 'normal'} style={{color: color ? GetColor : 'initial'}} />
  )
}

export default MoneyFormat