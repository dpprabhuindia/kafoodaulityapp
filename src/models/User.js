const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: ['warden', 'tdo', 'officer', 'district_officer', 'super_admin'],
    default: 'warden'
  },
  schoolId: {
    type: String,
    index: true
  },
  // Additional profile information
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  designation: String,
  department: String,
  district: String,
  taluk: String,
  // Status and permissions
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  permissions: [{
    type: String,
    enum: ['upload_photos', 'view_reports', 'approve_photos', 'manage_users', 'admin_access']
  }],
  // Profile metadata
  profilePhoto: String,
  lastLogin: Date,
  loginCount: {
    type: Number,
    default: 0
  },
  // Verification
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  // Password reset
  resetPasswordToken: String,
  resetPasswordExpires: Date
}, {
  timestamps: true
});

// Indexes
userSchema.index({ phone: 1 });
userSchema.index({ role: 1 });
userSchema.index({ schoolId: 1 });
userSchema.index({ status: 1 });

// Virtual for full name if needed
userSchema.virtual('fullName').get(function() {
  return this.name;
});

// Method to check if user has permission
userSchema.methods.hasPermission = function(permission) {
  return this.permissions.includes(permission) || this.role === 'super_admin';
};

// Method to get role-based permissions
userSchema.methods.getRolePermissions = function() {
  const rolePermissions = {
    warden: ['upload_photos'],
    tdo: ['upload_photos', 'view_reports', 'approve_photos'],
    officer: ['view_reports', 'approve_photos'],
    district_officer: ['view_reports', 'approve_photos', 'manage_users'],
    super_admin: ['upload_photos', 'view_reports', 'approve_photos', 'manage_users', 'admin_access']
  };
  
  return rolePermissions[this.role] || [];
};

module.exports = mongoose.model('User', userSchema);