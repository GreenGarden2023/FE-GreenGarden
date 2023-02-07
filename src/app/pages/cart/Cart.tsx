import React, { useEffect } from 'react'
import useDispatch from '../../hooks/use-dispatch'
import { setTitle } from '../../slices/window-title';
import CONSTANT from '../../utils/constant';
import './style.scss'

const Cart: React.FC = () => {
    const dispatch = useDispatch();

    useEffect(() =>{
        dispatch(setTitle(`${CONSTANT.APP_NAME} | Cart`))
    }, [dispatch])

  return (
    <div>Cart</div>
  )
}

export default Cart