const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  postId: { type: String, required: true },
  title: { type: String, required: true },
  link: { type: String, required: true },
  publishedAt: { type: Date, required: true },
  format: { type: String, default: 'Video' },
});

const CompetitorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  platform: {
    type: String,
    required: true,
    enum: ['YouTube', 'Twitter', 'Blog'],
  },
  // --- UPDATED: Replaced 'handle' with platform-specific identifiers ---
  youtubeChannelId: {
    type: String,
    sparse: true, // Allows multiple nulls, but unique if present
  },
  twitterHandle: {
    type: String,
    sparse: true,
  },
  blogRssUrl: {
    type: String,
    sparse: true,
  },
  lastFetched: {
    type: Date,
  },
  recentPosts: [PostSchema],
  
  topicAnalysis: {
    themes: { type: [String], default: [] },
    summary: { type: String, default: '' },
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

CompetitorSchema.index({ user: 1, youtubeChannelId: 1 }, { unique: true, sparse: true });
CompetitorSchema.index({ user: 1, twitterHandle: 1 }, { unique: true, sparse: true });
CompetitorSchema.index({ user: 1, blogRssUrl: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('Competitor', CompetitorSchema);