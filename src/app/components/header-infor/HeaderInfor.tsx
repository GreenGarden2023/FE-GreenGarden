import React from 'react';
import './style.scss'

interface HeaderInforProps{
    title: string;
    children?: any
}

const HeaderInfor: React.FC<HeaderInforProps> = ({title, children}) =>{
    return (
        <div className='hi-wrapper default-layout'>
            <p className='hi-title'>{title}</p>
            {
                children && 
                <div className="hi-content">
                    {children}
                </div>
            }
        </div>
    );
}

export default HeaderInfor;