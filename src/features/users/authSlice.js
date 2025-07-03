import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { decodeToken } from "../../utils/jwtUtils";
import { setAccessToken } from "./tokenSlice";
import { resetToRoot } from "../folders/folderSlice";

const initialState = {
    userData: null,
    isAuthenticated: false,
    isIdentityVerified: false,
    message: "",
    error: null,
    loading: null
}

export const loginUser = createAsyncThunk(
    "auth/login",
    async (credentials, { rejectWithValue, dispatch }) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, credentials, {
                headers: { "x-client-type": "web" }, withCredentials: true
            });
            dispatch(setAccessToken(response?.data?.data?.accessToken));
            return response;
        } catch (err) {
            return rejectWithValue(err.response);
        }
    }
)

export const registerUser = createAsyncThunk(
    "auth/register",
    async (credentials, { rejectWithValue, dispatch }) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, credentials, {
                headers: { "x-client-type": "web" }, withCredentials: true
            })
            dispatch(setAccessToken(response?.data?.data?.accessToken));
            return response;
        } catch (err) {
            return rejectWithValue(err.response);
        }
    }
)

export const refreshToken = createAsyncThunk(
    "auth/refreshToken",
    async (_, { rejectWithValue, dispatch }) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/refresh-token`, {}, {
                headers: { "x-client-type": "web" },
                withCredentials: true,
            });

            const { accessToken } = response?.data?.data;

            dispatch(setAccessToken(accessToken));
            return accessToken;
        } catch (err) {
            return rejectWithValue(err?.response?.data);
        }
    }
);

export const logout = createAsyncThunk(
    "auth/logout",
    async (payload, { rejectWithValue,dispatch }) => {
        try {
            const body = payload ? payload : {};
            await axios.post(`${import.meta.env.VITE_API_URL}/auth/logout`, body, {
                headers: { "x-client-type": "web" },
                withCredentials: true,
            });
            dispatch(resetToRoot());
            return true;
        } catch (err) {
            return rejectWithValue(err?.response?.data);
        }
    }
)

const authSlice = createSlice({
    name: "auth",
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                const { accessToken } = action?.payload?.data?.data;
                const decoded = decodeToken(accessToken);
                state.isAuthenticated = true;
                state.userData = decoded;
                state.isIdentityVerified = decoded.photo_verified;
                state.loading = false;
                state.error = null;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isAuthenticated = false;
                state.userData = null;
                state.loading = false;
                state.error = action?.payload?.data;
            })
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                const { accessToken } = action?.payload?.data?.data;
                const decoded = decodeToken(accessToken);
                state.isAuthenticated = true;
                state.userData = decoded;
                state.isIdentityVerified = decoded.photo_verified;
                state.loading = false;
                state.error = null;
            })
            .addCase(refreshToken.fulfilled, (state, action) => {
                const accessToken = action?.payload;
                const decoded = decodeToken(accessToken);
                state.userData = decoded;
                state.isIdentityVerified = decoded.photo_verified;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isAuthenticated = false;
                state.userData = null;
                state.loading = false;
                state.error = action?.payload?.data;
            })
            .addCase(logout.fulfilled, (state) => {
                state.userData = null;
                state.isAuthenticated = false;
                state.isIdentityVerified = false;
                state.loading = false;
                state.error = null;
            })
            .addCase(logout.rejected, (state, action) => {
                state.error = action?.payload?.data;
            });
    }
})

export default authSlice.reducer;