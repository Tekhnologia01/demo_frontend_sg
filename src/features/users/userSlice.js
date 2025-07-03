import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axiosClient from "../../services/axiosInstance";
import { logout } from "./authSlice";

const initialState = {
    profile: null,
    loading: false,
    error: null
}

export const fetchProfile = createAsyncThunk(
    "user/profile",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosClient.get(`/user/profile`);
            return response?.data?.data;
        } catch (err) {
            return rejectWithValue(err?.message);
        }
    }
)

const userSlice = createSlice({
    name: "user",
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(fetchProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProfile.fulfilled, (state, action) => {
                state.profile = action?.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(fetchProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action?.payload;
            })
            .addCase(logout.fulfilled, (state) => {
                state.profile = null;
                state.loading = false;
                state.error = null;
            });
    }
})

export default userSlice.reducer;