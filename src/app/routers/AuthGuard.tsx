import React from 'react';
// import useSelector from '../hooks/use-selector';
import { Navigate, Outlet } from 'react-router-dom';

const AuthGuard: React.FC = () =>{
    // const state = useSelector(state => state.notification);
    const isLogged = true;
    return (
        isLogged ? <Outlet /> : <Navigate to="/" />
    );
}

export default AuthGuard;