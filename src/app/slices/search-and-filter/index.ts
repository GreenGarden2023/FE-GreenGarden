import { createSlice, PayloadAction, CaseReducer } from '@reduxjs/toolkit';

interface SearchProps{
    orderCode?: string;
    isSearching: boolean;
}
interface FilterProps{
    startDate?: string;
    endDate?: string;
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
const setOrderCodeCR: CR<string> = (state, action) => {
    return {
        ...state,
        search: {
            ...state.search,
            orderCode: action.payload
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

const slice = createSlice({
    name: 'searchAndFilter/slice',
    initialState,
    reducers: {
        setSearch: setSearchCR,
        setFilter: setFilterCR,
        setOrderCode: setOrderCodeCR,
        setRangeDate: setRangeDateCR,
        setEmptySearch: setEmptySearchCR,
        setEmptyFilter: setEmptyFilterCR
    },
});

export const { setSearch, setFilter, setOrderCode, setRangeDate, setEmptySearch, setEmptyFilter } = slice.actions
export default slice.reducer