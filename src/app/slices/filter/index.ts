import { createSlice, PayloadAction, CaseReducer } from '@reduxjs/toolkit';
import { Filter } from 'app/models/filter';

const initialState: Filter = {
    sizeId: ''
}

type CR<T> = CaseReducer<Filter, PayloadAction<T>>;

const setSizeCR: CR<{sizeId: string}> = (state, action) => {
    return {
        ...state,
        sizeId: action.payload.sizeId
    }
}

const clearFilterCR: CR<void> = () =>{
    return {
        ...initialState
    }
}

const slice = createSlice({
    name: 'filter/slice',
    initialState,
    reducers: {
        setSize: setSizeCR,
        clearFilter: clearFilterCR
    }
})

export const { setSize } = slice.actions
export default slice.reducer