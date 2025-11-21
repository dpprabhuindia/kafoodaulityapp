const mongoose = require('mongoose');

const wardenPhotoSchema = new mongoose.Schema({
  schoolId: {
    type: String,
    required: true,
    index: true
  },
  mealType: {
    type: String,
    required: true,
    enum: ['breakfast', 'lunch', 'snacks', 'dinner'],
    index: true
  },
  photoUrl: {
    type: String,
    required: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  // Additional metadata
  filename: String,
  originalName: String,
  size: Number,
  mimeType: String,
  // For local storage if needed
  data: String, // Base64 encoded image data
  // Status and approval workflow
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: Date,
  reviewNotes: String,
  // Location data if available
  location: {
    latitude: Number,
    longitude: Number
  },
  // Quality metrics
  qualityScore: {
    type: Number,
    min: 1,
    max: 5
  },
  tags: [String],
  remarks: String
}, {
  timestamps: true
});

// Indexes for better query performance
wardenPhotoSchema.index({ schoolId: 1, timestamp: -1 });
wardenPhotoSchema.index({ mealType: 1, timestamp: -1 });
wardenPhotoSchema.index({ uploadedBy: 1, timestamp: -1 });
wardenPhotoSchema.index({ status: 1 });
wardenPhotoSchema.index({ timestamp: -1 });

// Compound indexes for common queries
wardenPhotoSchema.index({ schoolId: 1, mealType: 1, timestamp: -1 });
wardenPhotoSchema.index({ schoolId: 1, status: 1, timestamp: -1 });

module.exports = mongoose.model('WardenPhoto', wardenPhotoSchema);