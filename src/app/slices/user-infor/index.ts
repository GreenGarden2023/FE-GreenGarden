import { createSlice, PayloadAction, CaseReducer } from '@reduxjs/toolkit';
import { UserLogin } from '../../models/user';

type CR<T> = CaseReducer<UserLogin, PayloadAction<T>>;

const initialState: UserLogin = {
    id: '',
    userName: '',
    fullName: '',
    address: '',
    phone: '',
    favorite: '',
    mail: '',
    roleName: '',
    token: ''
}

const setUserCR: CR<UserLogin> = (_, action) => (action.payload);
const setEmptyUserCR: CR<void> = () => (initialState)

const slice = createSlice({
    name: 'user-infor/slice',
    initialState,
    reducers: {
        setUser: setUserCR,
        setEmptyUser: setEmptyUserCR
    },
});

export const { setUser, setEmptyUser } = slice.actions
export default slice.reducer