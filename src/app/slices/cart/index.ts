import { createSlice, PayloadAction, CaseReducer } from '@reduxjs/toolkit';
import { CartItem } from 'app/models/cart';

export interface CartProps{
    rentItems: CartItem[]
    saleItems: CartItem[]
}

const initialState: CartProps = {
    rentItems: [],
    saleItems: []
}

type CR<T> = CaseReducer<CartProps, PayloadAction<T>>;
const setCartCR: CR<CartProps> = (_, action) => ({
    ...action.payload
})
const resendCartCR: CR<void> = (_, action) => {
    
}

const slice = createSlice({
    name: 'cart/slice',
    initialState,
    reducers: {
        setCartSlice: setCartCR
    },
});

export const { setCartSlice } = slice.actions
export default slice.reducer