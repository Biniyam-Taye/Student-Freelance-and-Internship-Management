import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import messageService from '../../services/messageService';

// Fetch list of contacts (users with whom there are conversations)
export const fetchConversationsList = createAsyncThunk('chat/fetchList', async (_, thunkAPI) => {
    try {
        const res = await messageService.getConversationsList();
        return res.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
});

// Fetch messages for a specific conversation
export const fetchConversation = createAsyncThunk('chat/fetchConversation', async (otherUserId, thunkAPI) => {
    try {
        const res = await messageService.getConversation(otherUserId);
        return { otherUserId, messages: res.data };
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
});

// Send a message
export const sendMessageThunk = createAsyncThunk('chat/sendMessage', async ({ receiverId, content }, thunkAPI) => {
    try {
        const res = await messageService.sendMessage(receiverId, content);
        return { receiverId, message: res.data };
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
});

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        contacts: [],           // List of users we've conversed with
        activeContactId: null,  // ID of the currently open contact
        conversations: {},      // Map of contactId -> array of messages
        loading: false,
        sendingMessage: false,
        error: null,
    },
    reducers: {
        setActiveContact: (state, action) => {
            state.activeContactId = action.payload;
        },
        // Keep local optimistic update for immediate feel after sendMessageThunk resolves
        appendLocalMessage: (state, action) => {
            const { contactId, message } = action.payload;
            if (!state.conversations[contactId]) state.conversations[contactId] = [];
            state.conversations[contactId].push(message);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchConversationsList.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchConversationsList.fulfilled, (state, action) => {
                state.loading = false;
                state.contacts = action.payload;
                if (action.payload.length > 0 && !state.activeContactId) {
                    state.activeContactId = action.payload[0]._id;
                }
            })
            .addCase(fetchConversationsList.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            .addCase(fetchConversation.pending, (state) => { state.loading = true; })
            .addCase(fetchConversation.fulfilled, (state, action) => {
                state.loading = false;
                state.conversations[action.payload.otherUserId] = action.payload.messages;
            })
            .addCase(fetchConversation.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            .addCase(sendMessageThunk.pending, (state) => { state.sendingMessage = true; })
            .addCase(sendMessageThunk.fulfilled, (state, action) => {
                state.sendingMessage = false;
                const { receiverId, message } = action.payload;
                if (!state.conversations[receiverId]) state.conversations[receiverId] = [];
                // Replace the optimistic entry or just push if not already present
                const exists = state.conversations[receiverId].some(m => m._id === message._id);
                if (!exists) state.conversations[receiverId].push(message);
            })
            .addCase(sendMessageThunk.rejected, (state, action) => { state.sendingMessage = false; state.error = action.payload; });
    },
});

export const { setActiveContact, appendLocalMessage } = chatSlice.actions;
export default chatSlice.reducer;
