import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import opportunityService from '../../services/opportunityService';

export const fetchOpportunities = createAsyncThunk('opportunities/fetchAll', async (query, thunkAPI) => {
    try {
        const { keyword = '', type = '' } = query || {};
        const response = await opportunityService.getAll(keyword, type);
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        return thunkAPI.rejectWithValue(message);
    }
});

export const fetchOpportunityById = createAsyncThunk('opportunities/fetchSingle', async (id, thunkAPI) => {
    try {
        const response = await opportunityService.getById(id);
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        return thunkAPI.rejectWithValue(message);
    }
});

export const createOpportunity = createAsyncThunk('opportunities/create', async (data, thunkAPI) => {
    try {
        const response = await opportunityService.create(data);
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        return thunkAPI.rejectWithValue(message);
    }
});

export const updateOpportunity = createAsyncThunk('opportunities/update', async ({ id, data }, thunkAPI) => {
    try {
        const response = await opportunityService.update(id, data);
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        return thunkAPI.rejectWithValue(message);
    }
});

export const deleteOpportunity = createAsyncThunk('opportunities/delete', async (id, thunkAPI) => {
    try {
        await opportunityService.remove(id);
        return id;
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        return thunkAPI.rejectWithValue(message);
    }
});

const initialState = {
    items: [],
    currentItem: null,
    loading: false,
    error: null,
};

const opportunitySlice = createSlice({
    name: 'opportunities',
    initialState,
    reducers: {
        clearCurrentOpportunity: (state) => {
            state.currentItem = null;
        },
        clearOpportunityError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch All
            .addCase(fetchOpportunities.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchOpportunities.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchOpportunities.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch Single
            .addCase(fetchOpportunityById.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchOpportunityById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentItem = action.payload;
            })
            .addCase(fetchOpportunityById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create
            .addCase(createOpportunity.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(createOpportunity.fulfilled, (state, action) => {
                state.loading = false;
                state.items.unshift(action.payload);
            })
            .addCase(createOpportunity.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update
            .addCase(updateOpportunity.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(updateOpportunity.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.items.findIndex(item => item._id === action.payload._id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
                if (state.currentItem && state.currentItem._id === action.payload._id) {
                    state.currentItem = action.payload;
                }
            })
            .addCase(updateOpportunity.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Delete
            .addCase(deleteOpportunity.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(deleteOpportunity.fulfilled, (state, action) => {
                state.loading = false;
                state.items = state.items.filter(item => item._id !== action.payload);
                if (state.currentItem && state.currentItem._id === action.payload) {
                    state.currentItem = null;
                }
            })
            .addCase(deleteOpportunity.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearCurrentOpportunity, clearOpportunityError } = opportunitySlice.actions;
export default opportunitySlice.reducer;
