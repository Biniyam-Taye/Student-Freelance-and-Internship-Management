import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import aiService from '../../services/aiService';

export const fetchRecommendations = createAsyncThunk('ai/fetchRecommendations', async (_, thunkAPI) => {
    try {
        const response = await aiService.getRecommendations();
        return response.data;
    } catch (error) { return thunkAPI.rejectWithValue(error.response?.data?.message || error.message); }
});

export const fetchSkillGap = createAsyncThunk('ai/fetchSkillGap', async (opportunityId, thunkAPI) => {
    try {
        const response = await aiService.getSkillGapAnalysis(opportunityId);
        return { opportunityId, analysis: response.data };
    } catch (error) { return thunkAPI.rejectWithValue(error.response?.data?.message || error.message); }
});

const initialState = {
    recommendations: [],
    skillGaps: {}, // mapping opportunityId -> analysis
    loading: false,
    error: null,
};

const aiSlice = createSlice({
    name: 'ai',
    initialState,
    reducers: { clearAiError: (state) => { state.error = null; } },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRecommendations.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchRecommendations.fulfilled, (state, action) => { state.loading = false; state.recommendations = action.payload; })
            .addCase(fetchRecommendations.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            .addCase(fetchSkillGap.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchSkillGap.fulfilled, (state, action) => {
                state.loading = false;
                state.skillGaps[action.payload.opportunityId] = action.payload.analysis;
            })
            .addCase(fetchSkillGap.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
    }
});

export const { clearAiError } = aiSlice.actions;
export default aiSlice.reducer;
