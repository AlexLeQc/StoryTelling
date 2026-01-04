const express = require('express');
const { body, validationResult } = require('express-validator');
const crypto = require('crypto');
const Story = require('../models/Story');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/public/:shareId', async (req, res) => {
  try {
    const story = await Story.findOne({ shareId: req.params.shareId });
    
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    res.json({
      id: story._id,
      title: story.title,
      description: story.description,
      storyData: story.storyData,
      shareId: story.shareId,
      createdAt: story.createdAt,
    });
  } catch (error) {
    console.error('Error fetching public story:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const stories = await Story.find({ authorId: req.user._id })
      .sort({ updatedAt: -1 })
      .select('_id title description shareId isPublic createdAt updatedAt');
    
    res.json({ stories });
  } catch (error) {
    console.error('Error fetching stories:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const story = await Story.findOne({
      _id: req.params.id,
      authorId: req.user._id,
    });

    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    res.json({
      id: story._id,
      title: story.title,
      description: story.description,
      storyData: story.storyData,
      isPublic: story.isPublic,
      shareId: story.shareId,
      createdAt: story.createdAt,
      updatedAt: story.updatedAt,
    });
  } catch (error) {
    console.error('Error fetching story:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', auth, [
  body('title').trim().isLength({ min: 1 }),
  body('storyData').isObject(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, storyData } = req.body;

    const story = new Story({
      authorId: req.user._id,
      title,
      description: description || '',
      storyData: storyData,
      shareId: crypto.randomBytes(16).toString('hex'),
    });

    await story.save();

    res.status(201).json({
      id: story._id,
      title: story.title,
      description: story.description,
      storyData: story.storyData,
      isPublic: story.isPublic,
      shareId: story.shareId,
      createdAt: story.createdAt,
      updatedAt: story.updatedAt,
    });
  } catch (error) {
    console.error('Error creating story:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', auth, [
  body('title').optional().trim().isLength({ min: 1 }),
  body('storyData').optional().isObject(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const story = await Story.findOne({
      _id: req.params.id,
      authorId: req.user._id,
    });

    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    if (req.body.title) story.title = req.body.title;
    if (req.body.description !== undefined) story.description = req.body.description;
    if (req.body.storyData) {
      story.storyData = req.body.storyData;
    }
    if (req.body.isPublic !== undefined) story.isPublic = req.body.isPublic;

    story.updatedAt = Date.now();
    await story.save();

    res.json({
      id: story._id,
      title: story.title,
      description: story.description,
      storyData: story.storyData,
      isPublic: story.isPublic,
      shareId: story.shareId,
      createdAt: story.createdAt,
      updatedAt: story.updatedAt,
    });
  } catch (error) {
    console.error('Error updating story:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const story = await Story.findOneAndDelete({
      _id: req.params.id,
      authorId: req.user._id,
    });

    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    res.json({ message: 'Story deleted successfully' });
  } catch (error) {
    console.error('Error deleting story:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/:id/duplicate', auth, async (req, res) => {
  try {
    const originalStory = await Story.findOne({
      _id: req.params.id,
      authorId: req.user._id,
    });

    if (!originalStory) {
      return res.status(404).json({ message: 'Story not found' });
    }

    const duplicatedStory = new Story({
      authorId: req.user._id,
      title: `${originalStory.title} (Copy)`,
      description: originalStory.description,
      storyData: originalStory.storyData,
      shareId: crypto.randomBytes(16).toString('hex'),
      isPublic: false,
    });

    await duplicatedStory.save();

    res.status(201).json({
      id: duplicatedStory._id,
      title: duplicatedStory.title,
      description: duplicatedStory.description,
      storyData: duplicatedStory.storyData,
      isPublic: duplicatedStory.isPublic,
      shareId: duplicatedStory.shareId,
      createdAt: duplicatedStory.createdAt,
      updatedAt: duplicatedStory.updatedAt,
    });
  } catch (error) {
    console.error('Error duplicating story:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

