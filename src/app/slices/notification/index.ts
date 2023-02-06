import { createSlice, PayloadAction, CaseReducer } from '@reduxjs/toolkit';

const initialState: string = '';

type CR<T> = CaseReducer<string, PayloadAction<T>>;

const setNotiCR: CR<string> = (_, action) => (action.payload);

const slice = createSlice({
    name: 'notification/slice',
    initialState,
    reducers: {
      setNoti: setNotiCR,
    },
});

export const { setNoti } = slice.actions;
export default slice.reducer;