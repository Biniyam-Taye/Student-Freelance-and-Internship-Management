import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import applicationService from '../../services/applicationService';

export const applyForJob = createAsyncThunk('applications/apply', async ({ opportunityId, data }, thunkAPI) => {
    try {
        const response = await applicationService.applyForOpportunity(opportunityId, data);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const fetchMyApplications = createAsyncThunk('applications/fetchMine', async (_, thunkAPI) => {
    try {
        const response = await applicationService.getMyApplications();
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const fetchJobApplications = createAsyncThunk('applications/fetchForJob', async (opportunityId, thunkAPI) => {
    try {
        const response = await applicationService.getApplicationsForJob(opportunityId);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const fetchRecruiterApplications = createAsyncThunk('applications/fetchRecruiterApps', async (_, thunkAPI) => {
    try {
        const response = await applicationService.getRecruiterApplications();
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const updateApplicationStatus = createAsyncThunk('applications/updateStatus', async ({ id, status }, thunkAPI) => {
    try {
        const response = await applicationService.updateStatus(id, status);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
});

const initialState = {
    items: [], // holds my applications OR recruiter job applications depending on view
    loading: false,
    error: null,
};

const applicationSlice = createSlice({
    name: 'applications',
    initialState,
    reducers: {
        clearApplicationError: (state) => { state.error = null; }
    },
    extraReducers: (builder) => {
        builder
            // Apply
            .addCase(applyForJob.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(applyForJob.fulfilled, (state, action) => {
                state.loading = false;
                state.items.unshift(action.payload);
            })
            .addCase(applyForJob.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch Mine
            .addCase(fetchMyApplications.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchMyApplications.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchMyApplications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch for Job
            .addCase(fetchJobApplications.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchJobApplications.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchJobApplications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch for Recruiter All
            .addCase(fetchRecruiterApplications.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchRecruiterApplications.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchRecruiterApplications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update Status
            .addCase(updateApplicationStatus.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(updateApplicationStatus.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.items.findIndex(item => item._id === action.payload._id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            .addCase(updateApplicationStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearApplicationError } = applicationSlice.actions;
export default applicationSlice.reducer;
