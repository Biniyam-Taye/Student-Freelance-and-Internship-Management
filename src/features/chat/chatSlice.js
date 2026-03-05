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

// Fetch total unread messages count
export const fetchUnreadCount = createAsyncThunk('chat/fetchUnreadCount', async (_, thunkAPI) => {
    try {
        const res = await messageService.getUnreadCount();
        return res.data?.count ?? 0;
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
        unreadCount: 0,         // Total unread messages for the current user
        loading: false,
        sendingMessage: false,
        error: null,
    },
    reducers: {
        setActiveContact: (state, action) => {
            state.activeContactId = action.payload;
        },
        // Ensure or update a contact (used when starting chat from applications)
        upsertContact: (state, action) => {
            const contact = action.payload;
            if (!contact || !contact._id) return;
            const idx = state.contacts.findIndex(c => c._id === contact._id);
            if (idx === -1) {
                state.contacts.push(contact);
            } else {
                state.contacts[idx] = { ...state.contacts[idx], ...contact };
            }
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

                const incoming = action.payload || [];
                const mergedById = new Map();

                // Keep any contacts that were already present (e.g. injected via upsertContact)
                (state.contacts || []).forEach((c) => {
                    if (c && c._id) {
                        mergedById.set(c._id, c);
                    }
                });

                // Merge in contacts returned from the server
                incoming.forEach((c) => {
                    if (c && c._id) {
                        const existing = mergedById.get(c._id) || {};
                        mergedById.set(c._id, { ...existing, ...c });
                    }
                });

                state.contacts = Array.from(mergedById.values());

                // If there was no active contact yet, default to the first server contact (if any)
                if (incoming.length > 0 && !state.activeContactId) {
                    state.activeContactId = incoming[0]._id;
                }
            })
            .addCase(fetchConversationsList.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            // Unread count
            .addCase(fetchUnreadCount.fulfilled, (state, action) => {
                state.unreadCount = action.payload ?? 0;
            })

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

                const list = state.conversations[receiverId];

                // Remove a matching optimistic "temp" message if present
                const tempIndex = list.findIndex(
                    (m) =>
                        typeof m._id === 'string' &&
                        m._id.startsWith('temp_') &&
                        (m.content || m.text) === (message.content || message.text)
                );
                if (tempIndex !== -1) {
                    list.splice(tempIndex, 1);
                }

                // Avoid pushing duplicates if the real message is already there
                const exists = list.some((m) => m._id === message._id);
                if (!exists) {
                    list.push(message);
                }
            })
            .addCase(sendMessageThunk.rejected, (state, action) => { state.sendingMessage = false; state.error = action.payload; });
    },
});

export const { setActiveContact, upsertContact, appendLocalMessage } = chatSlice.actions;
export default chatSlice.reducer;
