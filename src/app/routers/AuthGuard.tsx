import React, { useMemo } from 'react';
// import useSelector from '../hooks/use-selector';
import { Navigate } from 'react-router-dom';
import authService from '../services/auth.service';
import CONSTANT, { Role } from '../utils/constant';



interface AuthGuardProps{
    rolesAuth: Role[];
    children: any;
}

const AuthGuard: React.FC<AuthGuardProps> = ({rolesAuth, children}) =>{
    const isLogged = useMemo(() =>{
        const accessToken = localStorage.getItem(CONSTANT.STORAGE.ACCESS_TOKEN)
        if(!accessToken) return false
    
        const jwtDecode = authService.decodeToken(accessToken)
        const dateNow = new Date();
        if(!rolesAuth.includes(jwtDecode.rolename as Role) || jwtDecode.exp * 1000 < dateNow.getTime()) return false

        return true
    }, [rolesAuth])

    return (
        isLogged ? 
        <>
        {children}
        </>
          : <Navigate to="/file-not-found" />
    );
}

export default AuthGuard;