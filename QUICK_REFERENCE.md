# 🚀 Food Transparency Portal - Quick Reference Card

## 🔑 Login Credentials

| Role | Username | Password | Access Level |
|------|----------|----------|--------------|
| **Admin** | `admin` | `admin123` | Full system + Portal settings |
| **Auditor** | `auditor1` | `audit123` | Inspections + Reports |
| **Officer** | `officer1` | `officer123` | Schools + Safety programs |
| **Viewer** | `viewer1` | `view123` | Read-only access |

## 📱 Quick Actions

### From Dashboard
- **🔍 New Inspection** → Start inspection process
- **🏫 Manage Schools** → School management system
- **🛡️ Safety Programs** → Program tracking
- **📊 Generate Reports** → Analytics dashboard

### Navigation Menu
- **Dashboard** → Main overview
- **New Inspection** → Inspection form
- **Schools** → School management
- **Programs** → Safety programs
- **Reports** → Analytics
- **Profile** → User settings
- **Admin Panel** → System settings (admin only)

## 📸 Photo Upload Guide

### Inspection Photos
1. Select school in inspection form
2. Upload photos → `inspectPhotos/school_{id}/inspection_{id}/`
3. Supports: PNG, JPG, SVG (max 2MB each)

### Facility Photos
1. Go to school detail view
2. Select facility type: Kitchen 🍳, Store Room 📦, Dining 🍽️, etc.
3. Upload photos → `inspectPhotos/school_{id}/facility_{type}/`

## 🏫 School Management

### View Schools
- **List View** → Browse all schools
- **Detail View** → Click "View" for comprehensive info
- **Photo Gallery** → See all photos with statistics

### Edit Schools
- Click "Edit" → Modal form opens
- Update: Name, type, status, contact info
- Save changes → Immediate update

### School Actions
- **👁️ View** → Detailed information
- **✏️ Edit** → Modify school data
- **🔍 Inspect** → Start new inspection
- **📸 Photos** → Upload facility photos

## 🔍 Inspection Workflow

### Start Inspection
**Method 1:** Dashboard → "New Govt School Inspection"
**Method 2:** Schools → Click "Inspect" on school card
**Method 3:** Navigation → "New Inspection"

### Complete Inspection
1. **Select School** (or add new)
2. **Fill Details** (inspector, date, type, rating)
3. **Add Findings** (observations, violations, recommendations)
4. **Upload Photos** (inspection evidence)
5. **Save Inspection** → Data stored with photo paths

## 📊 Photo Types & Badges

| Badge | Type | Description | Storage Path |
|-------|------|-------------|--------------|
| 🔍 **Blue** | Inspection | Formal inspection photos | `inspection_{id}/` |
| 🏢 **Green** | Facility | Kitchen, store room, etc. | `facility_{type}/` |
| 📁 **Gray** | Archive | Historical/reference photos | Root directory |

## ⚙️ Admin Features (admin only)

### Portal Logo Management
1. **Admin Panel** → Logo Management
2. **Upload Logo** → PNG/JPG/SVG (max 2MB)
3. **Preview** → See before saving
4. **Save** → Updates navbar and login page
5. **Reset** → Return to default Karnataka logo

### Logo Guidelines
- **Size:** 200x80 pixels recommended
- **Format:** PNG with transparent background
- **Usage:** Navbar + Login page
- **Limit:** 2MB maximum

## 🛡️ Safety Programs

### Program Information
- **Status:** Active, Planning, Completed, On Hold
- **Progress:** Visual progress bars
- **Budget:** Allocated vs. spent tracking
- **Participants:** Enrollment numbers

### Available Programs
1. **HACCP Training** → Kitchen safety protocols
2. **Food Handler Certification** → Mandatory certification
3. **Nutrition & Hygiene** → Comprehensive training
4. **Safety Monitoring** → Regular audits

## 📈 Reports & Analytics

### Report Types
- **Inspection Reports** → Detailed findings
- **School Performance** → Individual analytics
- **Program Effectiveness** → Training outcomes
- **Compliance Reports** → Regulatory status

### Export Options
- **PDF** → Formatted reports
- **Excel** → Data analysis
- **CSV** → Raw data export

## 🎨 UI Theme Features

### White Theme Benefits
- **Clean Design** → Professional appearance
- **High Readability** → Excellent contrast
- **Print Friendly** → Perfect for documents
- **Accessibility** → Improved for all users

### Responsive Design
- **Mobile Optimized** → Works on phones/tablets
- **Touch Friendly** → Large buttons and targets
- **Adaptive Layout** → Adjusts to screen size

## 🔧 Troubleshooting

### Common Issues
| Problem | Solution |
|---------|----------|
| **Can't login** | Check credentials, refresh page |
| **Photos won't upload** | Check file size (<2MB), format (PNG/JPG/SVG) |
| **Page won't load** | Clear cache, check internet |
| **Menu missing** | Check user role permissions |

### File Upload Requirements
- **Formats:** PNG, JPG, SVG only
- **Size:** Maximum 2MB per file
- **School:** Must select school first
- **Connection:** Stable internet required

## 📱 Mobile Usage

### Mobile Features
- **Responsive Design** → Adapts to mobile screens
- **Touch Navigation** → Finger-friendly interface
- **Camera Integration** → Direct photo capture
- **Offline Capability** → Some features work offline

### Mobile Tips
- **Portrait Mode** → Optimized for vertical use
- **One-Hand Operation** → Easy thumb navigation
- **Fast Loading** → Optimized for mobile networks

## 🔄 Data Management

### Data Persistence
- **Local Storage** → All data saved locally
- **Photo Organization** → Structured file system
- **Session Management** → Secure login sessions
- **Cross-Browser** → Works across different browsers

### Backup Locations
```
inspectPhotos/
├── school_1/
│   ├── facility_kitchen/
│   ├── facility_storeroom/
│   └── inspection_INS_123456/
└── school_2/
    └── facility_kitchen/
```

## 🎯 Best Practices

### For All Users
- ✅ **Complete Forms** → Fill all required fields
- ✅ **Quality Photos** → Clear, well-lit images
- ✅ **Regular Logout** → Security best practice
- ✅ **Report Issues** → Notify admin of problems

### For Inspectors
- ✅ **Document Thoroughly** → Detailed findings
- ✅ **Upload Promptly** → Don't delay submissions
- ✅ **Follow Standards** → Consistent procedures
- ✅ **Track Progress** → Monitor recommendations

### For Administrators
- ✅ **Monitor Usage** → Check system performance
- ✅ **Manage Access** → Appropriate user permissions
- ✅ **Backup Data** → Regular data protection
- ✅ **Train Users** → Provide adequate training

## 🚨 Emergency Procedures

### System Issues
1. **Refresh Page** → F5 or Ctrl+R
2. **Clear Cache** → Browser settings
3. **Try Different Browser** → Chrome, Firefox, Safari
4. **Contact Admin** → Report critical issues

### Data Recovery
- **Local Storage** → Data persists in browser
- **Photo Backup** → Files stored in organized folders
- **Session Recovery** → Login again to restore session

## 📞 Support Contacts

### Getting Help
- **User Guide** → Complete documentation
- **System Admin** → Technical support
- **Training** → User education sessions
- **Bug Reports** → Issue reporting

### Important URLs
- **Dashboard:** `/` 
- **Schools:** `/establishments`
- **Inspections:** `/audit`
- **Programs:** `/programs`
- **Reports:** `/reports`
- **Admin:** `/admin` (admin only)

---

## 🏆 Key Features Summary

✅ **Complete School Management** → Full CRUD operations
✅ **Comprehensive Inspections** → Detailed workflow
✅ **Organized Photo Storage** → Structured file system
✅ **Role-Based Access** → Appropriate permissions
✅ **Safety Program Tracking** → Progress monitoring
✅ **Advanced Reporting** → Analytics and exports
✅ **Admin Customization** → Logo and settings
✅ **Mobile Responsive** → Works on all devices
✅ **Clean White Theme** → Professional appearance
✅ **Local Data Persistence** → Reliable storage

---

*Keep this reference card handy for quick access to essential features and procedures.*

**Food Transparency Portal v1.0 - Karnataka Government**
