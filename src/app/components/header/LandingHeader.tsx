import React, { useEffect, useMemo, useState } from 'react';
import './style.scss';

const LandingHeader: React.FC = () =>{
    const [scrollPosition, setScrollPosition] = useState(0);
    const handleScroll = () => {
        const position = window.pageYOffset;
        setScrollPosition(position);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
    
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    
    const FixedHeader = useMemo((): React.CSSProperties | undefined =>{
        return scrollPosition > 135 ? {
            position: 'fixed',
            width: '100%',
            backgroundColor: '#061524',
            top: 0,
            zIndex: 16
        } : undefined
    }, [scrollPosition])

    return (
        <header className='landing-header' style={FixedHeader ? {paddingBottom: '41px'} : undefined}>
            <div className="header__top">
                <img src={`${process.env.PUBLIC_URL}/main-logo.png`} alt="" />
                <p>Green Garden Shop</p>
            </div>
            <div className="header__bottom" style={FixedHeader}>
                <div className="header__item">
                    <p className='active'>Home</p>
                </div>
                <div className="header__item">
                    <p>About us</p>
                </div>
                <div className="header__item">
                    <p>Login</p>
                </div>
            </div>
        </header>
    );
}

export default LandingHeader;