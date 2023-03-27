import React from 'react'
import './style.scss'

interface DescriptionProps{
    content: string
}

const Description: React.FC<DescriptionProps> = ({content}) => {
  return (
    <p className='description-renderer'>{content}</p>
  )
}

export default Description