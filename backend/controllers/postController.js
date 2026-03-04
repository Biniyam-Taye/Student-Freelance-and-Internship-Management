const asyncHandler = require('express-async-handler');
const Post = require('../models/Post');

// @desc    Get all posts
// @route   GET /api/posts
// @access  Private
const getAllPosts = asyncHandler(async (req, res) => {
    const posts = await Post.find()
        .populate('author', 'name role company university avatar')
        .populate('comments.author', 'name avatar')
        .sort({ createdAt: -1 });
    res.json(posts);
});

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
const createPost = asyncHandler(async (req, res) => {
    const { content, image } = req.body;

    if (!content) {
        res.status(400);
        throw new Error('Please provide content for the post');
    }

    const post = await Post.create({
        author: req.user._id,
        content,
        image
    });

    const populatedPost = await Post.findById(post._id).populate('author', 'name role avatar');
    res.status(201).json(populatedPost);
});

// @desc    Like or Unlike a post
// @route   PUT /api/posts/:id/like
// @access  Private
const likePost = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);

    if (!post) {
        res.status(404);
        throw new Error('Post not found');
    }

    const userId = req.user._id;
    const isLiked = post.likes.includes(userId);

    if (isLiked) {
        post.likes = post.likes.filter(id => id.toString() !== userId.toString());
    } else {
        post.likes.push(userId);
    }

    await post.save();
    res.json(post.likes);
});

// @desc    Add a comment to a post
// @route   POST /api/posts/:id/comment
// @access  Private
const addComment = asyncHandler(async (req, res) => {
    const { text } = req.body;

    if (!text) {
        res.status(400);
        throw new Error('Comment text is required');
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
        res.status(404);
        throw new Error('Post not found');
    }

    const comment = {
        author: req.user._id,
        text,
        createdAt: new Date()
    };

    post.comments.push(comment);
    await post.save();

    const updatedPost = await Post.findById(post._id).populate('comments.author', 'name avatar');
    res.json(updatedPost.comments);
});

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private
const deletePost = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);

    if (!post) {
        res.status(404);
        throw new Error('Post not found');
    }

    // Only author or admin can delete
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        res.status(401);
        throw new Error('Not authorized to delete this post');
    }

    await post.remove();
    res.json({ message: 'Post removed' });
});

module.exports = {
    getAllPosts,
    createPost,
    likePost,
    addComment,
    deletePost
};
