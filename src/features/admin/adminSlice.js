import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import adminService from '../../services/adminService';

export const fetchAllUsers = createAsyncThunk('admin/fetchUsers', async (_, thunkAPI) => {
    try {
        const response = await adminService.getAllUsers();
        return response.data;
    } catch (error) { return thunkAPI.rejectWithValue(error.response?.data?.message || error.message); }
});

export const verifyRecruiter = createAsyncThunk('admin/verifyRecruiter', async (id, thunkAPI) => {
    try {
        const response = await adminService.verifyRecruiter(id);
        return response.data.user;
    } catch (error) { return thunkAPI.rejectWithValue(error.response?.data?.message || error.message); }
});

export const updateUserStatus = createAsyncThunk('admin/updateStatus', async ({ id, status }, thunkAPI) => {
    try {
        const response = await adminService.updateUserStatus(id, status);
        return response.data.user;
    } catch (error) { return thunkAPI.rejectWithValue(error.response?.data?.message || error.message); }
});

export const deleteUser = createAsyncThunk('admin/deleteUser', async (id, thunkAPI) => {
    try {
        await adminService.deleteUser(id);
        return id;
    } catch (error) { return thunkAPI.rejectWithValue(error.response?.data?.message || error.message); }
});

export const fetchAnalytics = createAsyncThunk('admin/fetchAnalytics', async (_, thunkAPI) => {
    try {
        const response = await adminService.getAnalytics();
        return response.data;
    } catch (error) { return thunkAPI.rejectWithValue(error.response?.data?.message || error.message); }
});

const initialState = {
    users: [],
    analytics: null,
    loading: false,
    error: null,
};

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: { clearAdminError: (state) => { state.error = null; } },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllUsers.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchAllUsers.fulfilled, (state, action) => { state.loading = false; state.users = action.payload; })
            .addCase(fetchAllUsers.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            .addCase(verifyRecruiter.fulfilled, (state, action) => {
                const index = state.users.findIndex(u => u._id === action.payload._id);
                if (index !== -1) state.users[index] = action.payload;
            })

            .addCase(updateUserStatus.fulfilled, (state, action) => {
                const index = state.users.findIndex(u => u._id === action.payload._id);
                if (index !== -1) state.users[index] = action.payload;
            })

            .addCase(deleteUser.fulfilled, (state, action) => {
                state.users = state.users.filter(u => u._id !== action.payload);
            })

            .addCase(fetchAnalytics.pending, (state) => { state.loading = true; })
            .addCase(fetchAnalytics.fulfilled, (state, action) => { state.loading = false; state.analytics = action.payload; })
            .addCase(fetchAnalytics.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
    }
});

export const { clearAdminError } = adminSlice.actions;
export default adminSlice.reducer;
