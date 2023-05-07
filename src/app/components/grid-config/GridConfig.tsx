import { ConfigProvider } from 'antd'
import React from 'react'

const GridConfig: React.FC<any> = (props) => {
  return (
    <ConfigProvider
        theme={{
            token:{
                // screen < 370
                screenXSMin: 370,
                screenXSMax: 480,
                // screen > 371 (371 -> -----)
                // screenXS: 480,
                screenSMMin: 481,
                screenSMMax: 576,
                screenMDMin: 577,
                screenMDMax: 768,
                screenLGMin: 768,
                screenLGMax: 992,
                screenXLMin: 993,
                screenXLMax: 1200,
                screenXXLMin: 1201,
                screenXXL: 1800,
            },
        }}
    >
        {props.children}
    </ConfigProvider>
  )
}

export default GridConfig