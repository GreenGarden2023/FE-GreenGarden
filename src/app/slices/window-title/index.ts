import { createSlice, PayloadAction, CaseReducer } from '@reduxjs/toolkit';

const initialState: string = '';

type CR<T> = CaseReducer<string, PayloadAction<T>>;

const setTitleCR: CR<string> = (_, action) => (action.payload);

const slice = createSlice({
    name: 'window-title/slice',
    initialState,
    reducers: {
        setTitle: setTitleCR,
    },
});

export const { setTitle } = slice.actions
export default slice.reducer