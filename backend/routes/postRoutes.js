const express = require('express');
const router = express.Router();
const { getAllPosts, createPost, likePost, addComment, deletePost } = require('../controllers/postController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/')
    .get(protect, getAllPosts)
    .post(protect, createPost);

router.route('/:id')
    .delete(protect, deletePost);

router.route('/:id/like')
    .put(protect, likePost);

router.route('/:id/comment')
    .post(protect, addComment);

module.exports = router;
