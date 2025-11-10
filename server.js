const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');

// Load environment variables
dotenv.config();

// Import models
const School = require('./src/models/School');
const Inspection = require('./src/models/Inspection');

const app = express();
const PORT = process.env.PORT || 5010;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Database connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/food-transparency-portal';
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};

// Connect to database
connectDB();

// SCHOOL ROUTES

// Get all schools
app.get('/api/schools', async (req, res) => {
  try {
    const schools = await School.find().sort({ createdAt: -1 });
    res.json(schools);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single school
app.get('/api/schools/:id', async (req, res) => {
  try {
    const school = await School.findById(req.params.id);
    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }
    res.json(school);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new school
app.post('/api/schools', async (req, res) => {
  try {
    const school = new School(req.body);
    const savedSchool = await school.save();
    res.status(201).json(savedSchool);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update school
app.put('/api/schools/:id', async (req, res) => {
  try {
    const school = await School.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }
    res.json(school);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete school
app.delete('/api/schools/:id', async (req, res) => {
  try {
    const school = await School.findByIdAndDelete(req.params.id);
    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }
    res.json({ message: 'School deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// INSPECTION ROUTES

// Get all inspections
app.get('/api/inspections', async (req, res) => {
  try {
    const inspections = await Inspection.find()
      .populate('schoolId', 'name location')
      .sort({ inspectionDate: -1 });
    res.json(inspections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single inspection
app.get('/api/inspections/:id', async (req, res) => {
  try {
    const inspection = await Inspection.findById(req.params.id)
      .populate('schoolId');
    if (!inspection) {
      return res.status(404).json({ message: 'Inspection not found' });
    }
    res.json(inspection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get inspections by school
app.get('/api/inspections/school/:schoolId', async (req, res) => {
  try {
    const inspections = await Inspection.find({ schoolId: req.params.schoolId })
      .sort({ inspectionDate: -1 });
    res.json(inspections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new inspection
app.post('/api/inspections', async (req, res) => {
  try {
    const inspection = new Inspection(req.body);
    const savedInspection = await inspection.save();
    
    // Update school's last inspection date and rating
    await School.findByIdAndUpdate(req.body.schoolId, {
      lastInspection: req.body.inspectionDate,
      rating: req.body.overallRating,
      violations: req.body.violationsList ? req.body.violationsList.length : 0
    });
    
    res.status(201).json(savedInspection);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update inspection
app.put('/api/inspections/:id', async (req, res) => {
  try {
    const inspection = await Inspection.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!inspection) {
      return res.status(404).json({ message: 'Inspection not found' });
    }
    res.json(inspection);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete inspection
app.delete('/api/inspections/:id', async (req, res) => {
  try {
    const inspection = await Inspection.findByIdAndDelete(req.params.id);
    if (!inspection) {
      return res.status(404).json({ message: 'Inspection not found' });
    }
    res.json({ message: 'Inspection deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upload inspection photo
app.post('/api/inspections/upload-photo', upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const photoData = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: req.file.path,
      size: req.file.size
    };

    if (req.body.inspectionId) {
      // Add photo to existing inspection
      await Inspection.findByIdAndUpdate(
        req.body.inspectionId,
        { $push: { photos: photoData } }
      );
    }

    res.json({
      message: 'Photo uploaded successfully',
      photo: photoData
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DASHBOARD ROUTES

// Get dashboard statistics
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const totalSchools = await School.countDocuments();
    const activeSchools = await School.countDocuments({ status: 'Active' });
    const totalInspections = await Inspection.countDocuments();
    const recentInspections = await Inspection.countDocuments({
      inspectionDate: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    });

    const ratingDistribution = await School.aggregate([
      { $group: { _id: '$rating', count: { $sum: 1 } } }
    ]);

    const violationStats = await School.aggregate([
      { $group: { _id: null, totalViolations: { $sum: '$violations' } } }
    ]);

    res.json({
      totalSchools,
      activeSchools,
      totalInspections,
      recentInspections,
      ratingDistribution,
      totalViolations: violationStats[0]?.totalViolations || 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// REPORTS ROUTES

// Get report data
app.get('/api/reports', async (req, res) => {
  try {
    const { startDate, endDate, rating, status } = req.query;
    
    let schoolFilter = {};
    let inspectionFilter = {};

    if (rating) schoolFilter.rating = rating;
    if (status) schoolFilter.status = status;
    if (startDate || endDate) {
      inspectionFilter.inspectionDate = {};
      if (startDate) inspectionFilter.inspectionDate.$gte = new Date(startDate);
      if (endDate) inspectionFilter.inspectionDate.$lte = new Date(endDate);
    }

    const schools = await School.find(schoolFilter);
    const inspections = await Inspection.find(inspectionFilter)
      .populate('schoolId', 'name location');

    res.json({
      schools,
      inspections,
      summary: {
        totalSchools: schools.length,
        totalInspections: inspections.length,
        averageRating: schools.length > 0 ? 
          schools.reduce((sum, school) => {
            const ratingValue = { 'A': 5, 'B+': 4, 'B': 3, 'C': 2, 'D': 1 }[school.rating] || 3;
            return sum + ratingValue;
          }, 0) / schools.length : 0
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Profile endpoints
app.get('/api/profile/:userId', async (req, res) => {
  try {
    // In a real application, you would fetch from a User model
    // For now, return mock data or handle with localStorage on frontend
    res.json({
      message: 'Profile data should be managed on frontend with localStorage for demo'
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

app.put('/api/profile/:userId', upload.single('profilePhoto'), async (req, res) => {
  try {
    const { userId } = req.params;
    const profileData = req.body;
    
    // Handle profile photo if uploaded
    if (req.file) {
      profileData.profilePhoto = `/uploads/${req.file.filename}`;
    }
    
    // In a real application, you would update a User model
    // For now, return success response
    res.json({
      message: 'Profile updated successfully',
      profileData: {
        ...profileData,
        id: userId
      }
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large' });
    }
  }
  res.status(500).json({ message: error.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
