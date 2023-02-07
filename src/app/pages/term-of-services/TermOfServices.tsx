import React, { useEffect } from 'react'
import useDispatch from '../../hooks/use-dispatch';
import { setTitle } from '../../slices/window-title';
import CONSTANT from '../../utils/constant';
import './style.scss';

const TermOfServices: React.FC = () =>{
    const dispatch = useDispatch();

    useEffect(() =>{
        dispatch(setTitle(`${CONSTANT.APP_NAME} | Term Of Service`))
    }, [dispatch])
    
    return (
        <div>
            <h1>Term Of Services</h1>
        </div>
    )
}

export default TermOfServices