import { createSlice, PayloadAction, CaseReducer } from '@reduxjs/toolkit';
import { User, UserLogin } from '../../models/user';

type CR<T> = CaseReducer<UserLogin, PayloadAction<T>>;

const initialState: UserLogin = {
    user: {
        id: '',
        userName: '',
        fullName: '',
        address: '',
        phone: '',
        favorite: '',
        mail: '',
        roleName: 'Customer',
        currentPoint: 0,
        districtID: 0,
        status: 'enable'
    },
    token: '',
    loading: false
}

const setUserCR: CR<UserLogin> = (_, action) => (action.payload);

const setEmptyUserCR: CR<void> = () => ({...initialState, loading: false});

const setTokenAndRoleCR: CR<{token: string, role: string}> = (state: UserLogin, action) => (
    {
        ...state,
        token: action.payload.token,
        role: action.payload.role
    }
) 
const setLoadingCR: CR<{loading: boolean}> = (state: UserLogin, action) => ({
    ...state,
    loading: action.payload.loading
})

const setApartUserCR: CR<Partial<User>> = (state, action) => ({
    ...state,
    user: {
        ...state.user,
        ...action.payload
    }
})

const slice = createSlice({
    name: 'user-infor/slice',
    initialState,
    reducers: {
        setUser: setUserCR,
        setEmptyUser: setEmptyUserCR,
        setTokenAndRole: setTokenAndRoleCR,
        setLoading: setLoadingCR,
        setApartUser: setApartUserCR
    },
});

export const { setUser, setEmptyUser, setTokenAndRole, setLoading, setApartUser } = slice.actions
export default slice.reducer