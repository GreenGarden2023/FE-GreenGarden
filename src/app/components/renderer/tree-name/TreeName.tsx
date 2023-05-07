import React, { useMemo } from 'react'
import './style.scss'

interface TreeNameProps{
    name: string;
    minWidth?: number
}

const TreeName:React.FC<TreeNameProps> = ({name, minWidth}) => {

  const Styled = useMemo((): React.CSSProperties =>{
    return {
      display: minWidth ? 'inline-block' : 'initial',
      minWidth: minWidth || 'initial'
    }
  }, [minWidth])

  return (
    <span style={Styled} className='tree-name-renderer'>{name}</span>
  )
}

export default TreeName