const mongoose = require('mongoose');

const inspectionSchema = new mongoose.Schema({
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true
  },
  inspectorName: {
    type: String,
    required: true,
    trim: true
  },
  inspectionDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  inspectionType: {
    type: String,
    required: true,
    enum: ['routine', 'complaint', 'follow-up', 'surprise'],
    default: 'routine'
  },
  overallRating: {
    type: String,
    required: true,
    enum: ['A', 'B+', 'B', 'C', 'D']
  },
  findings: {
    type: String,
    required: true,
    trim: true
  },
  violations: {
    type: String,
    trim: true
  },
  recommendations: {
    type: String,
    trim: true
  },
  photos: [{
    filename: String,
    originalName: String,
    path: String,
    size: Number,
    uploadDate: {
      type: Date,
      default: Date.now
    }
  }],
  categories: {
    kitchenHygiene: {
      rating: {
        type: String,
        enum: ['A', 'B+', 'B', 'C', 'D']
      },
      notes: String
    },
    foodQuality: {
      rating: {
        type: String,
        enum: ['A', 'B+', 'B', 'C', 'D']
      },
      notes: String
    },
    storageConditions: {
      rating: {
        type: String,
        enum: ['A', 'B+', 'B', 'C', 'D']
      },
      notes: String
    },
    staffHygiene: {
      rating: {
        type: String,
        enum: ['A', 'B+', 'B', 'C', 'D']
      },
      notes: String
    },
    documentation: {
      rating: {
        type: String,
        enum: ['A', 'B+', 'B', 'C', 'D']
      },
      notes: String
    }
  },
  violationsList: [{
    category: String,
    description: String,
    severity: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium'
    },
    correctionRequired: Boolean,
    deadline: Date
  }],
  followUpRequired: {
    type: Boolean,
    default: false
  },
  followUpDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['Completed', 'Pending Review', 'Follow-up Required'],
    default: 'Completed'
  },
  inspectorSignature: String,
  schoolRepresentative: {
    name: String,
    designation: String,
    signature: String
  },
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
inspectionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for better query performance
inspectionSchema.index({ schoolId: 1, inspectionDate: -1 });
inspectionSchema.index({ inspectorName: 1 });
inspectionSchema.index({ inspectionType: 1 });
inspectionSchema.index({ overallRating: 1 });
inspectionSchema.index({ status: 1 });

module.exports = mongoose.model('Inspection', inspectionSchema);
