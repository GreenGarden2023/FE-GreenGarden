import { Image } from 'antd'
import React from 'react'

interface ListImageProps{
    listImgs: string[]
}

const ListImage: React.FC<ListImageProps> = ({listImgs}) => {
  return (
    <Image.PreviewGroup>
        {
            listImgs.map((item, index) => (
                <div key={index} style={{display: index === 0 ? 'initial' : 'none'}}>
                    <Image 
                    width={100}
                    height={100}
                    src={item}
                    style={{objectFit: 'cover'}}
                />
                </div>
            ))
        }
    </Image.PreviewGroup>
  )
}

export default ListImage