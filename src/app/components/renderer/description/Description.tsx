import React from 'react'
import './style.scss'
import { Input } from 'antd'

interface DescriptionProps{
    content: string
}

const Description: React.FC<DescriptionProps> = ({content}) => {
  return (
    <Input.TextArea autoSize={{minRows: 4, maxRows: 6}} style={{color: '#EE7942'}} value={content} disabled className='description-renderer'></Input.TextArea>
  )
}

export default Description