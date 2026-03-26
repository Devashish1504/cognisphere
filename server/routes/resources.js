import express from 'express';
import Resource from '../models/Resource.js';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Middleware to check if user is mentor or admin
const canManageResource = (req, res, next) => {
  if (req.user.role !== 'admin' && req.user.role !== 'mentor') {
    return res.status(401).json({ message: 'Not authorized for this action' });
  }
  next();
};

// @route   GET api/resources
// @desc    Get all resources with filters
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { category, type, search } = req.query;
    let query = {};

    if (category && category !== 'All') query.category = category;
    if (type && type !== 'All') query.type = type;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const resources = await Resource.find(query)
      .sort({ createdAt: -1 })
      .populate('uploadedBy', 'name role');

    res.json(resources);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/resources
// @desc    Create a resource
// @access  Protected (Admin/Mentor)
router.post('/', [auth, canManageResource], async (req, res) => {
  try {
    const newResource = new Resource({
      ...req.body,
      uploadedBy: req.user.id
    });

    const resource = await newResource.save();
    res.json(resource);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/resources/:id/view
// @desc    Increment resource views
// @access  Private
router.put('/:id/view', auth, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ message: 'Resource not found' });

    resource.views += 1;
    await resource.save();
    res.json({ views: resource.views });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/resources/:id/bookmark
// @desc    Toggle bookmark for user
// @access  Private
router.put('/:id/bookmark', auth, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ message: 'Resource not found' });

    const index = resource.bookmarkedBy.indexOf(req.user.id);
    if (index === -1) {
      resource.bookmarkedBy.push(req.user.id);
    } else {
      resource.bookmarkedBy.splice(index, 1);
    }

    await resource.save();
    res.json({ bookmarked: index === -1 });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/resources/:id
// @desc    Delete a resource
// @access  Protected (Admin Only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ message: 'Resource not found' });

    // Check if user is admin or the one who uploaded
    if (req.user.role !== 'admin' && resource.uploadedBy.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    await Resource.findByIdAndDelete(req.params.id);
    res.json({ message: 'Resource removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;
