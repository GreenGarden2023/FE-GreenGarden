import React from 'react'
import { MdOutlineBookmarkBorder } from 'react-icons/md'
import './style.scss'

const NoResult: React.FC = () => {
  return (
    <div className='no-result-wrapper'>
        <MdOutlineBookmarkBorder size={40} color='#0099FF' />
        <p>Không tìm thấy kết quả tương ứng nào</p>
    </div>
  )
}

export default NoResult