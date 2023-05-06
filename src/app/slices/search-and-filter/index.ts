import { createSlice, PayloadAction, CaseReducer } from '@reduxjs/toolkit';
import { OrderStatus, Role, TakeCareStatus } from 'app/models/general-type';

interface SearchProps{
    orderCode?: string;
    phone?: string;
    status?: OrderStatus
    productName?: string;
    isSearching: boolean;
}
interface FilterProps{
    startDate?: string;
    endDate?: string;
    role?: Role;
    takeCareStatus?: TakeCareStatus
    isFiltering: boolean;
}

interface SearchAndFilterProps{
    search: SearchProps
    filter: FilterProps
}

const initialState: SearchAndFilterProps = {
    search: {
        isSearching: false
    },
    filter: {
        isFiltering: false
    }
}

type CR<T> = CaseReducer<SearchAndFilterProps, PayloadAction<T>>;

const setSearchCR: CR<boolean> = (state, action) =>{
    return {
        ...state,
        search: {
            ...state.search,
            isSearching: action.payload
        }
    }
}
const setFilterCR: CR<boolean> = (state, action) =>{
    return {
        ...state,
        filter: {
            ...state.filter,
            isFiltering: action.payload
        }
    }
}
const setEmptySearchCR: CR<void> = (state, action) =>{
    return {
        ...state,
        search: {
            isSearching: false,
            orderCode: undefined
        }
    }
}
const setEmptyFilterCR: CR<void> = (state, action) =>{
    return {
        ...state,
        filter: {
            isFiltering: false,
            startDate: undefined,
            endDate: undefined
        }
    }
}

const setRangeDateCR: CR<{start: string, end: string}> = (state, action) => {
    return {
        ...state,
        filter: {
            ...state.filter,
            startDate: action.payload.start,
            endDate: action.payload.end
        }
    }
}

const setRoleCR: CR<Role> = (state, action) =>{
    return {
        ...state,
        filter:{
            ...state.filter,
            role: action.payload
        }
    }
}

const setOrderTodayCR: CR<TakeCareStatus> = (state, action) =>{
    return {
        ...state,
        filter:{
            ...state.filter,
            takeCareStatus: action.payload
        }
    }
}

const setSearchValuesCR: CR<SearchProps> = (state, action) =>{
    return {
        search: action.payload,
        filter: {
            isFiltering: false,
            endDate: undefined,
            role: undefined,
            startDate: undefined,
            takeCareStatus: undefined
        }
    }
}

const slice = createSlice({
    name: 'searchAndFilter/slice',
    initialState,
    reducers: {
        setSearch: setSearchCR,
        setFilter: setFilterCR,
        setRangeDate: setRangeDateCR,
        setEmptySearch: setEmptySearchCR,
        setEmptyFilter: setEmptyFilterCR,
        setRole: setRoleCR,
        setOrderToday: setOrderTodayCR,
        setSearchValues: setSearchValuesCR
    },
});

export const { setSearch, setFilter, setRangeDate, setEmptySearch, setEmptyFilter, setRole, setOrderToday, setSearchValues } = slice.actions
export default slice.reducer