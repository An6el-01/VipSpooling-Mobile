import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import AsyncStorage  from "@react-native-async-storage/async-storage";
import themeReducer from './themeSlice';

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, themeReducer)

const store = configureStore({
    reducer: {
        theme: persistedReducer,
    },
});

export const persistor = persistStore(store);
export default store;