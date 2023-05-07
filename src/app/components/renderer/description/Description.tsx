import React, { useMemo } from 'react'
import './style.scss'
import { Input } from 'antd'

interface DescriptionProps{
    content: string;
    minWidth?: number
}

const Description: React.FC<DescriptionProps> = ({content, minWidth}) => {
  const Styled = useMemo((): React.CSSProperties =>{
    return {
      display: minWidth ? 'inline-block' : 'initial',
      minWidth: minWidth || 'initial'
    }
  }, [minWidth])
  return (
    <>
      {
        minWidth ? 
        <div style={Styled}>
          <Input.TextArea autoSize={{minRows: 4, maxRows: 6}} style={{color: '#EE7942'}} value={content} disabled className='description-renderer'></Input.TextArea>
        </div> :
          <Input.TextArea autoSize={{minRows: 4, maxRows: 6}} style={{color: '#EE7942'}} value={content} disabled className='description-renderer'></Input.TextArea>
      }
    </>
  )
}

export default Description