import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/users/authSlice.js";
import tokenReducer from "../features/users/tokenSlice.js";
import userReducer from "../features/users/userSlice.js";
import folderReducer from "../features/folders/folderSlice.js";
import uploadReducer from "../features/uploads/uploadSlice.js";
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from "redux-persist"

const persistConfig = {
    key: "smart-gallary-root",
    storage,
    version: 1,
    blacklist: ['token', 'upload']
}

const rootReducer = combineReducers({
    auth: authReducer,
    user: userReducer,
    token: tokenReducer,
    folder: folderReducer,
    upload: uploadReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    })
})

export const persistor = persistStore(store);
export default store;