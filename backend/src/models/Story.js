const mongoose = require('mongoose');
const crypto = require('crypto');

const storySchema = new mongoose.Schema({
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    default: '',
  },
  storyData: {
    type: Object,
    required: true,
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
  shareId: {
    type: String,
    unique: true,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

storySchema.pre('save', function(next) {
  if (this.isNew && !this.shareId) {
    this.shareId = crypto.randomBytes(16).toString('hex');
  }
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Story', storySchema);

