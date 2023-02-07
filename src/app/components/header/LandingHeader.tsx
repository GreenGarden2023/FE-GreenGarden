import React from 'react';
import './style.scss';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { Badge } from 'antd';
import { FaUserCircle } from 'react-icons/fa';

const LandingHeader: React.FC = () =>{

    return (
        <header className='landing-header'>
            <div className='container-wrapper' >
                <div className="left">
                    <Link to='/' >
                        <img src="/assets/logo.jpg" alt="/" />
                    </Link>
                </div>
                <div className="right">
                    <div className="cart-box">
                        <Link to='/cart' >
                            <Badge count={5} >
                                <AiOutlineShoppingCart size={30} />
                            </Badge>
                        </Link>
                    </div>
                    <div className="register-login-infor-box">
                        {/* <Link to='/register' >
                            <AiOutlineUserAdd size={20} />
                            <span>Regsiter</span>
                        </Link>
                        <Link to='/login' >
                            <GiExitDoor size={20} />
                            <span>Login</span>
                        </Link> */}
                        <div className='user-infor-box'>
                            <FaUserCircle size={20} />
                            <span>Admin</span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default LandingHeader;