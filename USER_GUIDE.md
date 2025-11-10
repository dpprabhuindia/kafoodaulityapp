# 📚 Food Transparency Portal - Complete User Guide

Welcome to the Food Transparency Portal, a comprehensive system for managing Karnataka Government School food safety inspections, facility documentation, and administrative oversight.

## 📋 Table of Contents

1. [Getting Started](#getting-started)
2. [User Roles & Access](#user-roles--access)
3. [Dashboard Overview](#dashboard-overview)
4. [School Management](#school-management)
5. [Inspection System](#inspection-system)
6. [Photo Management](#photo-management)
7. [Safety Programs](#safety-programs)
8. [Reports & Analytics](#reports--analytics)
9. [Admin Panel](#admin-panel)
10. [Troubleshooting](#troubleshooting)

---

## 🚀 Getting Started

### System Requirements
- **Web Browser**: Chrome, Firefox, Safari, or Edge (latest versions)
- **Internet Connection**: Required for all features
- **Screen Resolution**: Minimum 1024x768 (responsive design supports mobile)

### Accessing the Portal
1. Open your web browser
2. Navigate to the portal URL
3. You'll see the login page with the Karnataka Government branding

### First Time Login
The system comes with pre-configured demo accounts:

| Role | Username | Password | Description |
|------|----------|----------|-------------|
| **Administrator** | `admin` | `admin123` | Full system access, can manage portal settings |
| **Senior Auditor** | `auditor1` | `audit123` | Conduct inspections and reviews |
| **Food Safety Officer** | `officer1` | `officer123` | Manage school inspections and safety |
| **Report Viewer** | `viewer1` | `view123` | View reports and analytics only |

---

## 👥 User Roles & Access

### 🔑 Administrator
**Full system access including:**
- ✅ Portal logo customization
- ✅ System configuration
- ✅ All inspection and management features
- ✅ User management capabilities
- ✅ Advanced reporting and analytics

### 🔍 Senior Auditor
**Inspection and audit capabilities:**
- ✅ Create and manage inspections
- ✅ Upload inspection photos
- ✅ Generate inspection reports
- ✅ View school details and histories
- ✅ Access safety programs

### 👨‍💼 Food Safety Officer
**School management and safety oversight:**
- ✅ Manage school information
- ✅ Conduct safety inspections
- ✅ Upload facility photos
- ✅ Monitor safety programs
- ✅ Generate compliance reports

### 👀 Report Viewer
**Read-only access:**
- ✅ View inspection reports
- ✅ Access analytics dashboards
- ✅ View school information
- ❌ Cannot create or modify data

---

## 📊 Dashboard Overview

### Main Dashboard Features

#### Quick Statistics Cards
- **Total Schools**: Shows count of registered government schools
- **Recent Inspections**: Number of inspections in the current period
- **Pending Reviews**: Inspections awaiting review
- **Safety Programs**: Active food safety programs

#### Quick Actions
- **🔍 New Govt School Inspection**: Start a new inspection process
- **🏫 Manage Govt Schools**: Access school management system
- **🛡️ Safety Programs**: View and manage food safety programs
- **📊 Generate Reports**: Create comprehensive reports

#### Recent Activities
- Real-time feed of recent system activities
- Inspection completions
- New school registrations
- Program updates

---

## 🏫 School Management

### Viewing Schools

#### School List View
1. Click **"Manage Govt Schools"** from dashboard or navigation
2. Browse through the list of registered schools
3. Use search and filter options to find specific schools

#### School Information Displayed:
- **School Name** and location
- **School Type** (Government School, Government Aided)
- **Category** (Primary, Higher Secondary, High School)
- **Status** (Active, Under Review, Suspended)
- **Last Inspection Date**
- **Overall Rating** (A, B+, B, C, D)
- **Contact Information**

### School Detail View

#### Accessing School Details
1. Click **"View"** button on any school card
2. Comprehensive school information panel opens

#### School Information Panel
- **Contact Details**: Phone, email, location
- **School Category** and type information
- **Last Inspection** date and next scheduled inspection
- **Overall Rating** and status

#### Photo Gallery Features
- **📊 Photo Statistics Dashboard**:
  - 🔍 **Inspection Photos**: Photos from formal inspections
  - 🏢 **Facility Photos**: Photos of kitchens, store rooms, etc.
  - 📁 **Archive Photos**: Historical photos
  - 👥 **Inspectors**: Number of unique inspectors
  - 📊 **Total Size**: Combined file size of all photos

- **📸 Photo Display**:
  - Visual badges showing photo types
  - Hover effects with preview
  - Click for full-screen viewing
  - Photo metadata (date, inspector, file size)
  - Local storage path information

### Facility Photo Upload

#### Upload Process
1. In school detail view, find **"Upload Facility Photos"** panel
2. Select facility type from dropdown:
   - 🍳 **Kitchen Facilities**
   - 📦 **Store Room**
   - 🍽️ **Dining Area**
   - 🚿 **Wash Room**
   - ⚽ **Playground**
   - 📚 **Classroom**

3. Click **"Upload [Facility Type] Photos"**
4. Select multiple photos (supports PNG, JPG, SVG up to 2MB each)
5. Photos are automatically organized and stored

#### Storage Organization
Photos are stored in organized directory structure:
```
inspectPhotos/
├── school_1/
│   ├── facility_kitchen/
│   ├── facility_storeroom/
│   └── inspection_INS_123456/
```

### School Editing

#### Edit School Information
1. Click **"Edit"** button on school card
2. Modal form opens with pre-populated data
3. Editable fields include:
   - School Name
   - School Type
   - Category
   - Status
   - Owner/Department
   - Location
   - Phone Number
   - Email Address
   - License Number

4. Click **"Save Changes"** to update
5. Success message confirms the update

---

## 🔍 Inspection System

### Creating New Inspections

#### Starting an Inspection
**Method 1: From Dashboard**
1. Click **"New Govt School Inspection"** quick action
2. Full-page inspection form opens

**Method 2: From School Management**
1. Go to **"Manage Govt Schools"**
2. Click **"Inspect"** button on specific school
3. Modal inspection form opens with school pre-selected

**Method 3: From Navigation**
1. Click **"New Inspection"** in navigation menu
2. Full-page inspection form opens

### Inspection Form Features

#### School Selection
- **Existing Schools**: Dropdown with all registered schools
- **Add New School**: Option to register new school during inspection
- **School Details**: Automatic display of selected school information

#### Inspection Details
- **Inspector Name**: Required field
- **Inspection Date**: Defaults to current date
- **Inspection Type**: 
  - Routine Inspection
  - Complaint-based
  - Follow-up Inspection
  - Surprise Inspection
- **Overall Rating**: A (Excellent) to D (Poor)

#### Inspection Documentation
- **Findings**: Detailed inspection observations
- **Violations**: Any non-compliance issues found
- **Recommendations**: Improvement suggestions

### Photo Upload During Inspections

#### Upload Process
1. In inspection form, find **"Inspection Photos"** section
2. Shows storage path: `inspectPhotos/school_{id}/inspection_{id}/`
3. Click **"Choose Files"** or drag and drop
4. Multiple photo selection supported
5. Real-time upload progress indication

#### Photo Management
- **Preview**: See photos before saving
- **Metadata**: Original filename, size, upload date preserved
- **Local Paths**: Shows exact storage location
- **Remove**: Delete photos before submission

#### Photo Data Structure
Each photo includes:
- Unique identifier
- Original filename
- Generated unique filename with timestamp
- Local storage path
- File size and type
- Upload timestamp
- Associated school and inspection IDs

### Inspection Submission
1. Complete all required fields
2. Upload relevant photos
3. Click **"Save Inspection"**
4. Success message shows photo storage locations
5. Inspection data saved to system

---

## 📸 Photo Management System

### Photo Types and Organization

#### 🔍 Inspection Photos (Blue Badges)
- Photos taken during formal inspections
- Automatically organized by inspection ID
- Include inspector and date metadata
- Stored in: `inspectPhotos/school_{id}/inspection_{id}/`

#### 🏢 Facility Photos (Green Badges)
- Photos of specific school facilities
- Organized by facility type
- Include facility type and upload date
- Stored in: `inspectPhotos/school_{id}/facility_{type}/`

#### 📁 Archive Photos (Gray Badges)
- Historical or reference photos
- General school documentation
- Legacy photo storage

### Photo Viewing and Management

#### Gallery View
- **Grid Layout**: Thumbnail view of all photos
- **Type Badges**: Visual indicators for photo categories
- **Hover Effects**: Preview and metadata on hover
- **Click to Expand**: Full-screen viewing with navigation

#### Full-Screen Photo Modal
- **High-Resolution Display**: Full photo viewing
- **Navigation**: Previous/Next photo browsing
- **Detailed Metadata**:
  - Photo type and category
  - Inspector name and date
  - Original filename and size
  - Local storage path
  - Inspection or facility ID

#### Photo Statistics
- **Real-time Counts**: Updated automatically
- **Storage Information**: File sizes and totals
- **Inspector Tracking**: Unique inspector counts
- **Category Breakdown**: Photos by type

### Local Storage System

#### Directory Structure
```
inspectPhotos/
├── school_1/
│   ├── facility_kitchen/
│   │   ├── 2024-01-15T10-30-00-000Z_uuid1234.jpg
│   │   └── 2024-01-15T10-31-15-000Z_uuid5678.png
│   ├── facility_storeroom/
│   │   └── 2024-01-15T11-00-00-000Z_uuid9012.jpg
│   └── inspection_INS_1234567890_abc123def/
│       ├── 2024-01-15T14-20-00-000Z_uuid3456.jpg
│       └── 2024-01-15T14-21-30-000Z_uuid7890.png
└── school_2/
    └── facility_kitchen/
        └── 2024-01-16T09-15-00-000Z_uuid2468.jpg
```

#### File Naming Convention
- **Timestamp**: ISO format with safe characters
- **UUID**: Unique identifier to prevent conflicts
- **Extension**: Preserved from original file

---

## 🛡️ Safety Programs

### Program Overview

#### Accessing Safety Programs
1. Click **"Safety Programs"** from dashboard or navigation
2. View comprehensive program management interface

#### Program Statistics Dashboard
- **Total Programs**: Count of active programs
- **Total Participants**: Sum across all programs
- **Budget Utilization**: Percentage of allocated budget spent
- **Average Completion**: Progress across all programs

### Program Management

#### Program Information Display
Each program card shows:
- **Program Name** and description
- **Status**: Active, Planning, Completed, On Hold
- **Category**: Training, Certification, Monitoring
- **Participants**: Number enrolled
- **Progress**: Completion percentage with visual progress bar
- **Budget Information**: Allocated vs. spent amounts
- **Coordinator**: Program manager details

#### Program Actions
- **View Details**: Detailed program information
- **Manage**: Program administration (for authorized users)

#### Available Programs
1. **Karnataka Govt School Kitchen HACCP Training**
   - Hazard Analysis and Critical Control Points training
   - 1,250 participants
   - 74% completion rate

2. **Karnataka Govt School Food Handler Certification**
   - Mandatory certification for food service workers
   - 2,840 participants
   - 84% completion rate

3. **Karnataka Govt School Nutrition & Hygiene Program**
   - Comprehensive nutrition and hygiene training
   - 1,680 participants
   - 75% completion rate

4. **Karnataka Govt School Food Safety Monitoring**
   - Regular safety audits and compliance monitoring
   - Planning phase
   - 17% initial setup completion

### Recent Program Activities
- Real-time activity feed
- Program milestone completions
- New participant enrollments
- Budget reviews and updates

---

## 📊 Reports & Analytics

### Report Generation

#### Accessing Reports
1. Click **"Reports"** from navigation menu
2. Comprehensive reporting dashboard opens

#### Report Types Available
- **Inspection Reports**: Detailed inspection findings
- **School Performance Reports**: Individual school analytics
- **Program Effectiveness Reports**: Safety program outcomes
- **Compliance Reports**: Regulatory compliance status
- **Photo Documentation Reports**: Visual inspection records

#### Report Features
- **Date Range Selection**: Custom reporting periods
- **School Filtering**: Specific schools or all schools
- **Export Options**: PDF, Excel, CSV formats
- **Visual Charts**: Graphs and statistics
- **Detailed Tables**: Comprehensive data views

### Analytics Dashboard

#### Key Metrics
- **Inspection Trends**: Frequency and outcomes over time
- **Compliance Rates**: Percentage of schools meeting standards
- **Program Participation**: Enrollment and completion rates
- **Photo Documentation**: Upload trends and coverage

#### Visual Analytics
- **Charts and Graphs**: Trend analysis and comparisons
- **Heat Maps**: Geographic distribution of inspections
- **Progress Indicators**: Goal achievement tracking
- **Comparative Analysis**: School-to-school comparisons

---

## ⚙️ Admin Panel

### Accessing Admin Features

#### Admin Login
- **Username**: `admin`
- **Password**: `admin123`
- **Role**: Administrator

#### Admin Panel Access
1. Login with admin credentials
2. **"Admin Panel"** appears in navigation menu (admin users only)
3. Click to access administrative features

### Portal Logo Management

#### Current Logo Display
- Shows active portal logo (custom or default Karnataka Government logo)
- Logo status and information

#### Upload Custom Logo
1. **Select Facility Type**: Choose logo category if needed
2. **File Upload**:
   - Click **"Choose File"** or drag and drop
   - Supported formats: PNG, JPG, SVG
   - Maximum size: 2MB
   - Recommended size: 200x80 pixels

3. **Preview**: See logo before saving
4. **Save Logo**: Apply changes across the portal
5. **Real-time Updates**: Logo appears immediately in navbar and login page

#### Logo Guidelines
- **Recommended Size**: 200x80 pixels or similar aspect ratio
- **Format**: PNG with transparent background for best results
- **Readability**: Ensure logo works on both light and dark backgrounds
- **File Size**: Maximum 2MB
- **Usage**: Logo appears in navigation bar and login page

#### Reset to Default
- **Reset Option**: Return to default Karnataka Government logo
- **Confirmation**: Confirms reset action
- **Immediate Effect**: Changes apply instantly

### System Information
- **Portal Version**: Current system version
- **Last Updated**: System update information
- **Admin User**: Current administrator details

### Access Control
- **Role Verification**: Only admin users can access
- **Access Denied**: Non-admin users see restricted access message
- **Security**: Proper authentication checks

---

## 🎨 User Interface Features

### White Theme Design

#### Clean Professional Appearance
- **Background**: Pure white (#ffffff) throughout
- **Text Colors**: Professional gray tones for excellent readability
- **Borders**: Subtle gray borders for clean separation
- **Hover States**: Light gray highlights for interactive elements

#### Benefits
- **High Readability**: Excellent contrast for all text
- **Print Friendly**: Perfect for printing reports and documents
- **Professional**: Business-appropriate appearance
- **Accessibility**: Improved contrast ratios
- **Versatile**: Works with any custom logo colors

### Responsive Design
- **Mobile Friendly**: Optimized for smartphones and tablets
- **Desktop Optimized**: Full feature access on larger screens
- **Adaptive Layout**: Adjusts to different screen sizes
- **Touch Friendly**: Large buttons and touch targets

### Navigation System
- **Top Navigation**: Main portal branding and user information
- **Side Navigation**: Primary feature access
- **Breadcrumbs**: Clear navigation path
- **Quick Actions**: Fast access to common tasks

---

## 🔧 System Features

### Data Persistence
- **Local Storage**: All data persists across browser sessions
- **Photo Storage**: Organized file system for images
- **User Preferences**: Settings maintained per user
- **Session Management**: Secure login sessions

### Performance Features
- **Fast Loading**: Optimized for quick page loads
- **Efficient Storage**: Organized data structure
- **Responsive UI**: Smooth interactions and transitions
- **Error Handling**: Graceful error management

### Security Features
- **Role-Based Access**: Different permissions per user type
- **Secure Authentication**: Protected login system
- **Data Validation**: Input validation and sanitization
- **File Upload Security**: Safe file handling and validation

---

## 🚨 Troubleshooting

### Common Issues and Solutions

#### Login Problems
**Issue**: Cannot login with provided credentials
**Solution**: 
1. Verify username and password are correct
2. Check caps lock is off
3. Try refreshing the page
4. Clear browser cache and cookies

#### Photo Upload Issues
**Issue**: Photos won't upload
**Solutions**:
1. **File Size**: Ensure photos are under 2MB
2. **File Format**: Use PNG, JPG, or SVG formats only
3. **School Selection**: Select a school before uploading
4. **Browser**: Try a different browser
5. **Connection**: Check internet connection

#### Page Loading Problems
**Issue**: Pages load slowly or not at all
**Solutions**:
1. **Internet Connection**: Check network connectivity
2. **Browser Cache**: Clear browser cache and cookies
3. **Browser Update**: Update to latest browser version
4. **Disable Extensions**: Temporarily disable browser extensions

#### Navigation Issues
**Issue**: Menu items not appearing or not working
**Solutions**:
1. **User Role**: Verify you have appropriate permissions
2. **Browser Refresh**: Refresh the page
3. **JavaScript**: Ensure JavaScript is enabled
4. **Browser Compatibility**: Use supported browser

### Getting Help

#### Self-Service Options
1. **User Guide**: This comprehensive guide
2. **Tooltips**: Hover over elements for help text
3. **Error Messages**: Read system error messages carefully

#### Contact Support
- **Technical Issues**: Contact system administrator
- **Training Needs**: Request user training session
- **Feature Requests**: Submit enhancement requests
- **Bug Reports**: Report system issues with details

---

## 📱 Mobile Usage

### Mobile-Optimized Features
- **Responsive Design**: Adapts to phone and tablet screens
- **Touch Navigation**: Large, touch-friendly buttons
- **Mobile Photo Upload**: Camera integration for direct photo capture
- **Swipe Gestures**: Natural mobile interactions

### Mobile Best Practices
1. **Portrait Orientation**: Optimized for vertical phone use
2. **Thumb Navigation**: Easy one-handed operation
3. **Fast Loading**: Optimized for mobile networks
4. **Offline Capability**: Some features work without internet

---

## 🔄 System Updates and Maintenance

### Regular Updates
- **Feature Enhancements**: New capabilities added regularly
- **Security Updates**: Regular security improvements
- **Bug Fixes**: Issues resolved promptly
- **Performance Improvements**: Ongoing optimization

### Maintenance Windows
- **Scheduled Maintenance**: Announced in advance
- **Minimal Downtime**: Updates applied efficiently
- **Data Backup**: Regular system backups
- **Recovery Procedures**: Quick restoration if needed

---

## 📈 Best Practices

### For Inspectors
1. **Complete Documentation**: Fill all required fields
2. **Photo Quality**: Take clear, well-lit photos
3. **Consistent Naming**: Use descriptive photo captions
4. **Regular Uploads**: Don't delay inspection submissions
5. **Follow-up**: Track inspection recommendations

### For Administrators
1. **Regular Monitoring**: Check system usage and performance
2. **User Management**: Maintain appropriate access levels
3. **Data Backup**: Ensure regular data backups
4. **Training**: Provide user training as needed
5. **Updates**: Keep system updated with latest features

### For All Users
1. **Strong Passwords**: Use secure login credentials
2. **Regular Logout**: Log out when finished
3. **Data Accuracy**: Enter accurate information
4. **Report Issues**: Notify administrators of problems
5. **Stay Updated**: Learn about new features and updates

---

## 🎯 Quick Reference

### Essential Shortcuts
- **Dashboard**: Click portal logo to return to main dashboard
- **Quick Search**: Use browser search (Ctrl+F) to find content
- **Navigation**: Use browser back/forward buttons
- **Refresh**: F5 or Ctrl+R to refresh page

### Key Features Summary
- ✅ **School Management**: Complete school information system
- ✅ **Inspection System**: Comprehensive inspection workflow
- ✅ **Photo Management**: Organized photo storage and viewing
- ✅ **Safety Programs**: Program tracking and management
- ✅ **Reports & Analytics**: Detailed reporting capabilities
- ✅ **Admin Panel**: System configuration and customization
- ✅ **Mobile Support**: Full mobile device compatibility
- ✅ **Role-Based Access**: Appropriate permissions per user type

### Important URLs
- **Login Page**: Main portal entry point
- **Dashboard**: `/` - Main system dashboard
- **Schools**: `/establishments` - School management
- **Inspections**: `/audit` - New inspection form
- **Programs**: `/programs` - Safety programs
- **Reports**: `/reports` - Analytics and reporting
- **Admin Panel**: `/admin` - Administrative features (admin only)

---

## 📞 Support Information

### System Requirements
- **Minimum Browser**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Screen Resolution**: 1024x768 minimum (responsive design)
- **Internet**: Broadband connection recommended
- **JavaScript**: Must be enabled

### Contact Information
- **System Administrator**: Contact your IT department
- **Training**: Request user training sessions
- **Technical Support**: Submit support tickets through proper channels
- **Emergency**: Contact system administrator for critical issues

---

*Food Transparency Portal - Karnataka Government Social Welfare Department*
*Version 1.0 - Last Updated: $(date)*

---

**© 2024 Government of Karnataka. All rights reserved.**

This user guide covers all implemented features including the white theme UI, admin panel with logo upload, facility photo management, unified inspection workflow, and comprehensive school management system. The portal maintains all data locally with organized photo storage and provides role-based access for different user types.
