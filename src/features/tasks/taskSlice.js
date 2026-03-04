import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import taskService from '../../services/taskService';

// Thunks
export const fetchMyTasks = createAsyncThunk('tasks/fetchMine', async (_, thunkAPI) => {
    try {
        const response = await taskService.getMyTasks();
        return response.data;
    } catch (error) { return thunkAPI.rejectWithValue(error.response?.data?.message || error.message); }
});

export const fetchAssignedTasks = createAsyncThunk('tasks/fetchAssigned', async (_, thunkAPI) => {
    try {
        const response = await taskService.getAssignedTasks();
        return response.data;
    } catch (error) { return thunkAPI.rejectWithValue(error.response?.data?.message || error.message); }
});

export const assignTask = createAsyncThunk('tasks/assign', async (data, thunkAPI) => {
    try {
        const response = await taskService.assignTask(data);
        return response.data;
    } catch (error) { return thunkAPI.rejectWithValue(error.response?.data?.message || error.message); }
});

export const updateTaskStatus = createAsyncThunk('tasks/updateStatus', async ({ id, status }, thunkAPI) => {
    try {
        const response = await taskService.updateStatus(id, status);
        return response.data;
    } catch (error) { return thunkAPI.rejectWithValue(error.response?.data?.message || error.message); }
});

export const submitTask = createAsyncThunk('tasks/submit', async ({ id, submission }, thunkAPI) => {
    try {
        const response = await taskService.submitTask(id, submission);
        return response.data;
    } catch (error) { return thunkAPI.rejectWithValue(error.response?.data?.message || error.message); }
});

export const reviewTask = createAsyncThunk('tasks/review', async ({ id, review }, thunkAPI) => {
    try {
        const response = await taskService.reviewTask(id, review);
        return response.data;
    } catch (error) { return thunkAPI.rejectWithValue(error.response?.data?.message || error.message); }
});

const initialState = {
    items: [],
    loading: false,
    error: null,
};

const updateItemInState = (state, action) => {
    state.loading = false;
    const index = state.items.findIndex(item => item._id === action.payload._id);
    if (index !== -1) { state.items[index] = action.payload; }
};

const taskSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: { clearTaskError: (state) => { state.error = null; } },
    extraReducers: (builder) => {
        builder
            // Fetch Mine
            .addCase(fetchMyTasks.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchMyTasks.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
            .addCase(fetchMyTasks.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            // Fetch Assigned
            .addCase(fetchAssignedTasks.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchAssignedTasks.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
            .addCase(fetchAssignedTasks.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            // Assign
            .addCase(assignTask.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(assignTask.fulfilled, (state, action) => { state.loading = false; state.items.unshift(action.payload); })
            .addCase(assignTask.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            // Updates / Submits / Reviews
            .addCase(updateTaskStatus.pending, (state) => { state.loading = true; })
            .addCase(updateTaskStatus.fulfilled, updateItemInState)
            .addCase(submitTask.pending, (state) => { state.loading = true; })
            .addCase(submitTask.fulfilled, updateItemInState)
            .addCase(reviewTask.pending, (state) => { state.loading = true; })
            .addCase(reviewTask.fulfilled, updateItemInState);
    }
});

export const { clearTaskError } = taskSlice.actions;
export default taskSlice.reducer;
