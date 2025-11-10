const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Government School', 'Aided School'],
    default: 'Government School'
  },
  owner: {
    type: String,
    required: true,
    default: 'Karnataka Education Department'
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  licenseNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  rating: {
    type: String,
    enum: ['A', 'B+', 'B', 'C', 'D'],
    default: 'B'
  },
  status: {
    type: String,
    enum: ['Active', 'Under Review', 'Suspended'],
    default: 'Active'
  },
  lastInspection: {
    type: Date,
    default: null
  },
  nextInspection: {
    type: Date,
    default: null
  },
  violations: {
    type: Number,
    default: 0,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['Primary School', 'Higher Primary', 'High School', 'Higher Secondary'],
    default: 'Primary School'
  },
  principalName: {
    type: String,
    trim: true
  },
  studentCount: {
    type: Number,
    default: 0,
    min: 0
  },
  address: {
    street: String,
    city: String,
    state: {
      type: String,
      default: 'Karnataka'
    },
    pincode: String
  },
  facilities: [{
    name: String,
    status: {
      type: String,
      enum: ['Available', 'Under Maintenance', 'Not Available'],
      default: 'Available'
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
schoolSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for better query performance
schoolSchema.index({ name: 1, location: 1 });
schoolSchema.index({ licenseNumber: 1 });
schoolSchema.index({ status: 1 });
schoolSchema.index({ rating: 1 });

module.exports = mongoose.model('School', schoolSchema);
