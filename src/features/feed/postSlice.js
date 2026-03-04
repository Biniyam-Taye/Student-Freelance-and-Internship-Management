import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchPosts = createAsyncThunk('post/fetchPosts', async (_, thunkAPI) => {
    try {
        const response = await api.get('/posts');
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const createNewPost = createAsyncThunk('post/createPost', async (postData, thunkAPI) => {
    try {
        const response = await api.post('/posts', postData);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const likePost = createAsyncThunk('post/likePost', async (postId, thunkAPI) => {
    try {
        const response = await api.put(`/posts/${postId}/like`);
        return { postId, likes: response.data };
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const addComment = createAsyncThunk('post/addComment', async ({ postId, text }, thunkAPI) => {
    try {
        const response = await api.post(`/posts/${postId}/comment`, { text });
        return { postId, comments: response.data };
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
});

const initialState = {
    posts: [],
    loading: false,
    error: null,
};

const postSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {
        clearPostError: (state) => { state.error = null; }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPosts.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchPosts.fulfilled, (state, action) => { state.loading = false; state.posts = action.payload; })
            .addCase(fetchPosts.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            .addCase(createNewPost.fulfilled, (state, action) => { state.posts.unshift(action.payload); })

            .addCase(likePost.fulfilled, (state, action) => {
                const post = state.posts.find(p => (p._id || p.id) === action.payload.postId);
                if (post) post.likes = action.payload.likes;
            })

            .addCase(addComment.fulfilled, (state, action) => {
                const post = state.posts.find(p => (p._id || p.id) === action.payload.postId);
                if (post) post.comments = action.payload.comments;
            });
    }
});

export const { clearPostError } = postSlice.actions;
export default postSlice.reducer;
