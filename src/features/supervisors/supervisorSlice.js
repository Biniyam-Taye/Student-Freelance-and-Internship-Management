import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import supervisorService from '../../services/supervisorService';

export const fetchPendingSupervisors = createAsyncThunk(
    'supervisors/fetchPending',
    async (_, thunkAPI) => {
        try {
            const res = await supervisorService.getPending();
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const fetchMySupervisors = createAsyncThunk(
    'supervisors/fetchMine',
    async (_, thunkAPI) => {
        try {
            const res = await supervisorService.getMine();
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const approveSupervisor = createAsyncThunk(
    'supervisors/approve',
    async (id, thunkAPI) => {
        try {
            const res = await supervisorService.approve(id);
            return res.data.user;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const rejectSupervisor = createAsyncThunk(
    'supervisors/reject',
    async (id, thunkAPI) => {
        try {
            const res = await supervisorService.reject(id);
            return res.data.user;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const initialState = {
    pending: [],
    mine: [],
    loading: false,
    error: null,
};

const supervisorSlice = createSlice({
    name: 'supervisors',
    initialState,
    reducers: {
        clearSupervisorError: (state) => { state.error = null; },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPendingSupervisors.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPendingSupervisors.fulfilled, (state, action) => {
                state.loading = false;
                state.pending = action.payload || [];
            })
            .addCase(fetchPendingSupervisors.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(fetchMySupervisors.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMySupervisors.fulfilled, (state, action) => {
                state.loading = false;
                state.mine = action.payload || [];
            })
            .addCase(fetchMySupervisors.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(approveSupervisor.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(approveSupervisor.fulfilled, (state, action) => {
                state.loading = false;
                const sup = action.payload;
                state.pending = state.pending.filter((s) => s._id !== sup._id);
                const exists = state.mine.findIndex((s) => s._id === sup._id);
                if (exists === -1) state.mine.push(sup);
                else state.mine[exists] = sup;
            })
            .addCase(approveSupervisor.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(rejectSupervisor.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(rejectSupervisor.fulfilled, (state, action) => {
                state.loading = false;
                const sup = action.payload;
                state.pending = state.pending.filter((s) => s._id !== sup._id);
                state.mine = state.mine.filter((s) => s._id !== sup._id);
            })
            .addCase(rejectSupervisor.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearSupervisorError } = supervisorSlice.actions;
export default supervisorSlice.reducer;

