import React from 'react'
import './style.scss'

interface TechnicianNameProps{
    name: string
}

const TechnicianName: React.FC<TechnicianNameProps> = ({name}) => {
  return (
    <span className='tech-name'>{name}</span>
  )
}

export default TechnicianName