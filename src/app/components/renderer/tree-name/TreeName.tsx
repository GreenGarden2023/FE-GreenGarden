import React from 'react'
import './style.scss'

interface TreeNameProps{
    name: string;
}

const TreeName:React.FC<TreeNameProps> = ({name}) => {
  return (
    <span className='tree-name-renderer'>{name}</span>
  )
}

export default TreeName