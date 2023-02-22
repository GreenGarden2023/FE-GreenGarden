import { createSlice, PayloadAction, CaseReducer } from '@reduxjs/toolkit';

interface AdminLayoutProps{
    collapsedHeader: boolean;
}

type CR<T> = CaseReducer<AdminLayoutProps, PayloadAction<T>>;

const initialState: AdminLayoutProps = {
    collapsedHeader: false
}

const setCollapsedHeaderCR: CR<{active: boolean}> = (state: AdminLayoutProps, action) => ({
    ...state,
    collapsedHeader: action.payload.active
})

const slice = createSlice({
    name: 'admin-layout/slice',
    initialState,
    reducers: {
        setCollapsedHeader: setCollapsedHeaderCR,
    },
});

export const { setCollapsedHeader } = slice.actions
export default slice.reducer