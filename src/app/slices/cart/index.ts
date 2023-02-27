import { createSlice, PayloadAction, CaseReducer } from '@reduxjs/toolkit';
import { CartType } from 'app/models/general-type';
import { ProductItem, ProductItemInCart } from 'app/models/product-item';

interface CartSliceProps{
    rentalCart: ProductItemInCart[]
    buyCart: ProductItemInCart[]
}

const initialState: CartSliceProps = {
    rentalCart: [],
    buyCart: []
}

type CR<T> = CaseReducer<CartSliceProps, PayloadAction<T>>;

// chưa có cart / đã có cart nhưng chưa có item (id) / đã có cart và item
const addToCartCR: CR<{cartType: CartType, item: ProductItem}> = (state, action) =>{
    const { rentalCart, buyCart } = state
    const { cartType, item } = action.payload
    switch(cartType){
        case 'Rent':
            if(rentalCart.length === 0){
                return {
                    ...state,
                    rentalCart: [
                        {
                            ...item,
                            quantityInCart: 1
                        }
                    ]
                }
            }
            const indexRentalInCart = rentalCart.findIndex(x => x.id === item.id)
            console.log(indexRentalInCart)
            if(indexRentalInCart < 0){
                rentalCart.push({
                    ...item,
                    quantityInCart: 1
                })
                void(state.rentalCart = rentalCart)
            }
            const newRentalCart = [...rentalCart]
            newRentalCart[indexRentalInCart].quantityInCart = newRentalCart[indexRentalInCart].quantityInCart + 1
            void(state.rentalCart = newRentalCart)
            break;
        default:
            if(buyCart.length === 0){
                return {
                    ...state,
                    buyCart: [{
                        ...item,
                        quantityInCart: 1
                    }]
                }
            }
            const indexBuyInCart = buyCart.findIndex(x => x.id === item.id)
            if(indexBuyInCart < 0){
                buyCart.push({
                    ...item,
                    quantityInCart: 1
                })
                return {
                    ...state,
                    buyCart: buyCart
                }
            }
            const newBuyCart = [...buyCart]
            newBuyCart[indexBuyInCart].quantityInCart = newBuyCart[indexBuyInCart].quantityInCart + 1
            return {
                ...state,
                rentalCart: newBuyCart
            }
            // break;
    }
}

const slice = createSlice({
    name: 'cart/slice',
    initialState,
    reducers: {
        addToCart: addToCartCR,
    },
});

export const {addToCart } = slice.actions
export default slice.reducer