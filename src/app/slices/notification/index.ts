import { createSlice, PayloadAction, CaseReducer } from '@reduxjs/toolkit';

interface NotifiProps{
  type: "success" | "info" | "warning" | "error",
  message: string;
  description?: string;
}

const initialState: NotifiProps = {
  type: 'success',
  message: ''
};

type CR<T> = CaseReducer<NotifiProps, PayloadAction<T>>;

const setNotiCR: CR<NotifiProps> = (_, action) => (action.payload);

const slice = createSlice({
    name: 'notification/slice',
    initialState,
    reducers: {
      setNoti: setNotiCR,
    },
});

export const { setNoti } = slice.actions;
export default slice.reducer;