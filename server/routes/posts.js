import express from 'express';
import Post from '../models/Post.js';
import Notification from '../models/Notification.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all posts (sorted by latest, with author populated)
router.get('/', auth, async (req, res) => {
  try {
    const { tag, search } = req.query;
    let filter = {};
    
    if (tag && tag !== 'All') {
      filter.tags = tag;
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { body: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    const posts = await Post.find(filter)
      .populate('author', 'name email role avatar')
      .populate('replies.author', 'name email avatar')
      .sort({ createdAt: -1 });
    
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Create a new post
router.post('/', auth, async (req, res) => {
  try {
    const { title, body, tags } = req.body;
    
    if (!title || !body) {
      return res.status(400).json({ message: 'Title and body are required' });
    }

    const post = new Post({
      author: req.user.id,
      title,
      body,
      tags: tags || []
    });

    await post.save();
    
    const populated = await Post.findById(post._id)
      .populate('author', 'name email role avatar');
    
    res.json(populated);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Toggle like on a post
router.put('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const userId = req.user.id;
    const index = post.likes.indexOf(userId);

    if (index === -1) {
      post.likes.push(userId);
    } else {
      post.likes.splice(index, 1);
    }

    await post.save();
    res.json({ likes: post.likes, liked: index === -1 });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Add a reply to a post
router.post('/:id/reply', auth, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ message: 'Reply content is required' });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.replies.push({
      author: req.user.id,
      content
    });

    await post.save();

    // Notify the post author (if different from replier)
    if (post.author.toString() !== req.user.id) {
      const User = (await import('../models/User.js')).default;
      const replier = await User.findById(req.user.id).select('name');
      await new Notification({
        userId: post.author,
        message: `${replier?.name || 'Someone'} replied to your post "${post.title.substring(0, 30)}..."`,
        type: 'new-reply',
        link: '/student/community'
      }).save();
    }

    const updated = await Post.findById(post._id)
      .populate('author', 'name email role avatar')
      .populate('replies.author', 'name email avatar');

    res.json(updated);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Delete a post (author or admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Report a post
router.put('/:id/report', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.reported = true;
    await post.save();
    res.json({ message: 'Post reported' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;
