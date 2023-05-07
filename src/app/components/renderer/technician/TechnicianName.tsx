import React, { useMemo } from 'react'
import './style.scss'

interface TechnicianNameProps{
  name: string
  minWidth?: number
}

const TechnicianName: React.FC<TechnicianNameProps> = ({name, minWidth}) => {

  const Styled = useMemo((): React.CSSProperties =>{
    return {
      display: minWidth ? 'inline-block' : 'initial',
      minWidth: minWidth || 'initial'
    }
  }, [minWidth])

  return (
    <span className='tech-name' style={Styled} >{name}</span>
  )
}

export default TechnicianName