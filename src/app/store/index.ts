import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';

import appReducers from '../slices';

const middleware = getDefaultMiddleware({
    serializableCheck: false,
});

const store = configureStore({
    reducer: {
      ...appReducers,
    },
    middleware,
    devTools: true
});

export type AppDispatch = typeof store.dispatch;
export type AppState = ReturnType<typeof store.getState>;

export default store;