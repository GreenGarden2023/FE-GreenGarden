import { createSlice, PayloadAction, CaseReducer } from '@reduxjs/toolkit';
import { CartItem } from 'app/models/cart';

export interface CartProps{
    rentItems: CartItem[]
    saleItems: CartItem[]
    status?: 'remove' | ''
}

const initialState: CartProps = {
    rentItems: [],
    saleItems: []
}

type CR<T> = CaseReducer<CartProps, PayloadAction<T>>;
const setCartCR: CR<CartProps> = (_, action) => ({
    ...action.payload
})
const setEmptySaleCartCR: CR<void> = (state) => ({
    ...state,
    saleItems: []
})
const setEmptyRentCartCR: CR<void> = (state) => ({
    ...state,
    rentItems: []
})
// const resendCartCR: CR<void> = (_, action) => {
    
// }

const slice = createSlice({
    name: 'cart/slice',
    initialState,
    reducers: {
        setCartSlice: setCartCR,
        setEmptySaleCart: setEmptySaleCartCR,
        setEmptyRentCart: setEmptyRentCartCR
    },
});

export const { setCartSlice, setEmptySaleCart, setEmptyRentCart } = slice.actions
export default slice.reducer