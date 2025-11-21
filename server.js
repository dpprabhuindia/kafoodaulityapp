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
const { isValidObjectId } = mongoose;

const findSchoolByIdentifier = async (identifier) => {
  if (!identifier) return null;

  if (isValidObjectId(identifier)) {
    const byObjectId = await School.findById(identifier);
    if (byObjectId) return byObjectId;
  }

  const numericId = Number(identifier);
  if (!Number.isNaN(numericId)) {
    const byLegacyId = await School.findOne({ legacyId: numericId });
    if (byLegacyId) return byLegacyId;
  }

  const byLicense = await School.findOne({ licenseNumber: identifier });
  if (byLicense) return byLicense;

  return null;
};

const app = express();
const PORT = process.env.PORT || 5010;

// Store SSE connections for real-time updates
const sseConnections = new Map();

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
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname));
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
    await mongoose.connect(mongoURI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};

// Connect to database
connectDB();

// Helper function to broadcast photo updates to all connected clients
const broadcastPhotoUpdate = (schoolId, eventType, photoData) => {
  const message = {
    type: eventType, // 'photo_added', 'photo_deleted', 'photos_refreshed'
    schoolId,
    timestamp: new Date().toISOString(),
    data: photoData
  };

  sseConnections.forEach((res, clientId) => {
    try {
      res.write(`data: ${JSON.stringify(message)}\n\n`);
    } catch (error) {
      console.error(`Error sending SSE to client ${clientId}:`, error);
      sseConnections.delete(clientId);
    }
  });
};

// SSE endpoint for real-time photo updates
app.get('/api/photos/events', (req, res) => {
  // Set SSE headers
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Cache-Control'
  });

  // Generate unique client ID
  const clientId = Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  
  // Store connection
  sseConnections.set(clientId, res);
  
  // Send initial connection message
  res.write(`data: ${JSON.stringify({ type: 'connected', clientId, timestamp: new Date().toISOString() })}\n\n`);

  // Handle client disconnect
  req.on('close', () => {
    sseConnections.delete(clientId);
    console.log(`SSE client ${clientId} disconnected`);
  });

  req.on('error', () => {
    sseConnections.delete(clientId);
  });

  console.log(`SSE client ${clientId} connected. Total connections: ${sseConnections.size}`);
});

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
    const school = await findSchoolByIdentifier(req.params.id);
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

// Helper to normalize file URL
const buildFileUrl = (req, filePath) => {
  const normalized = filePath.replace(/\\/g, '/');
  const relative = normalized.startsWith('/') ? normalized : `/${normalized}`;
  return `${req.protocol}://${req.get('host')}${relative}`;
};

// Upload facility photo for a school with database storage
app.post('/api/schools/:id/facility-photos', upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const school = await findSchoolByIdentifier(req.params.id);
    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }

    const fs = require('fs');
    const fileData = fs.readFileSync(req.file.path);
    const base64Data = fileData.toString('base64');

    const facilityType = (req.body.facilityType || 'facility').toLowerCase();
    const facilityLabel = facilityType.charAt(0).toUpperCase() + facilityType.slice(1);
    const relativePath = `database/${req.params.id}/facility_${facilityType}/${req.file.filename}`;

    const photoRecord = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: relativePath,
      url: buildFileUrl(req, `uploads/${req.file.filename}`),
      size: req.file.size,
      caption: req.body.caption || `${facilityLabel} Facility - ${req.file.originalname}`,
      facilityType,
      inspector: req.body.inspector || 'Facility Manager',
      photoType: 'facility',
      data: base64Data,
      mimeType: req.file.mimetype,
      uploadDate: new Date()
    };

    school.photos = school.photos || [];
    school.photos.push(photoRecord);
    await school.save();

    const savedPhoto = school.photos[school.photos.length - 1];

    // Clean up uploaded file since we're storing in database
    fs.unlinkSync(req.file.path);

    const responsePhoto = {
      id: savedPhoto._id,
      url: `data:${savedPhoto.mimeType};base64,${savedPhoto.data}`,
      caption: savedPhoto.caption,
      date: savedPhoto.uploadDate,
      inspector: savedPhoto.inspector,
      facilityType: savedPhoto.facilityType,
      photoType: savedPhoto.photoType,
      size: savedPhoto.size,
      path: savedPhoto.path,
      source: 'facility'
    };

    // Broadcast photo update via SSE
    broadcastPhotoUpdate(req.params.id, 'photo_added', responsePhoto);

    res.status(201).json({
      message: 'Facility photo uploaded successfully',
      photo: responsePhoto
    });
  } catch (error) {
    console.error('Error uploading facility photo:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get combined school photos (facility + inspection)
app.get('/api/schools/:id/photos', async (req, res) => {
  try {
    const schoolId = req.params.id;
    const schoolDoc = await findSchoolByIdentifier(schoolId);
    if (!schoolDoc) {
      return res.status(404).json({ message: 'School not found' });
    }

    const school = schoolDoc.toObject();

    const inspections = await Inspection.find(
      isValidObjectId(schoolId) ? { schoolId } : { schoolId: schoolDoc._id }
    ).lean();
    const facilityPhotos = (school.photos || []).map((photo) => ({
      id: photo._id,
      url: photo.data ? `data:${photo.mimeType};base64,${photo.data}` : (photo.url || buildFileUrl(req, photo.path || `uploads/${photo.filename}`)),
      caption: photo.caption || photo.originalName || 'Facility Photo',
      date: photo.uploadDate || new Date(),
      inspector: photo.inspector || 'Facility Manager',
      facilityType: photo.facilityType,
      size: photo.size,
      path: photo.path,
      source: 'facility'
    }));

    const inspectionPhotos = inspections.flatMap((inspection) =>
      (inspection.photos || []).map((photo) => {
        const relativePath = photo.path || `uploads/${photo.filename}`;
        return {
          id: photo._id || `${inspection._id}-${photo.filename}`,
          url: photo.data ? `data:${photo.mimeType};base64,${photo.data}` : (photo.url || buildFileUrl(req, relativePath)),
          caption: photo.caption || (photo.originalName
            ? `Inspection Photo - ${photo.originalName}`
            : 'Inspection Photo'),
          date: photo.uploadDate || inspection.inspectionDate,
          inspector: photo.inspector || inspection.inspectorName || 'Inspector',
          inspectionId: inspection._id,
          size: photo.size,
          path: relativePath,
          source: 'inspection'
        };
      })
    );

    const combined = [...facilityPhotos, ...inspectionPhotos].sort((a, b) => {
      const dateA = a.date ? new Date(a.date) : 0;
      const dateB = b.date ? new Date(b.date) : 0;
      return dateB - dateA;
    });

    res.json(combined);
  } catch (error) {
    console.error('Error fetching school photos:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update school
app.put('/api/schools/:id', async (req, res) => {
  try {
    const school = await findSchoolByIdentifier(req.params.id);
    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }

    Object.assign(school, req.body);
    const updated = await school.save();
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete school
app.delete('/api/schools/:id', async (req, res) => {
  try {
    const school = await findSchoolByIdentifier(req.params.id);
    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }
    await school.deleteOne();
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

// Upload inspection photo with database storage
app.post('/api/inspections/upload-photo', upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fs = require('fs');
    const fileData = fs.readFileSync(req.file.path);
    const base64Data = fileData.toString('base64');

    const relativePath = `uploads/${req.file.filename}`;
    const photoData = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: relativePath,
      url: buildFileUrl(req, relativePath),
      size: req.file.size,
      caption: req.body.caption || `Inspection Photo - ${req.file.originalname}`,
      inspector: req.body.inspector || 'Inspector',
      photoType: 'inspection',
      data: base64Data,
      mimeType: req.file.mimetype,
      uploadDate: new Date()
    };

    if (req.body.inspectionId) {
      // Add photo to existing inspection
      await Inspection.findByIdAndUpdate(
        req.body.inspectionId,
        { $push: { photos: photoData } }
      );
    }

    // Clean up uploaded file since we're storing in database
    fs.unlinkSync(req.file.path);

    res.json({
      message: 'Photo uploaded successfully',
      photo: {
        id: photoData._id,
        filename: photoData.filename,
        originalName: photoData.originalName,
        size: photoData.size,
        caption: photoData.caption,
        inspector: photoData.inspector,
        uploadDate: photoData.uploadDate,
        url: `data:${photoData.mimeType};base64,${photoData.data}`
      }
    });
  } catch (error) {
    console.error('Error uploading inspection photo:', error);
    res.status(500).json({ message: error.message });
  }
});

// PHOTO MANAGEMENT ROUTES

// Upload photo with base64 data (for mobile/web uploads)
app.post('/api/photos/upload', async (req, res) => {
  try {
    const { 
      schoolId, 
      inspectionId, 
      photoData, 
      filename, 
      originalName, 
      size, 
      mimeType, 
      photoType = 'inspection',
      facilityType,
      caption,
      inspector 
    } = req.body;

    if (!schoolId || !photoData || !filename) {
      return res.status(400).json({ message: 'Missing required fields: schoolId, photoData, filename' });
    }

    // Validate base64 data
    if (!photoData.startsWith('data:')) {
      return res.status(400).json({ message: 'Invalid photo data format' });
    }

    // Extract base64 data without data URL prefix
    const base64Data = photoData.split(',')[1];
    const detectedMimeType = photoData.split(';')[0].split(':')[1];

    const photoRecord = {
      filename,
      originalName: originalName || filename,
      path: `database/${schoolId}/${photoType}_${inspectionId || 'general'}/${filename}`,
      size: size || 0,
      caption: caption || `${photoType.charAt(0).toUpperCase() + photoType.slice(1)} Photo - ${originalName || filename}`,
      inspector: inspector || (photoType === 'facility' ? 'Facility Manager' : 'Inspector'),
      photoType,
      facilityType,
      data: base64Data,
      mimeType: mimeType || detectedMimeType,
      uploadDate: new Date()
    };

    if (photoType === 'inspection' && inspectionId) {
      // Add to inspection
      const inspection = await Inspection.findById(inspectionId);
      if (!inspection) {
        return res.status(404).json({ message: 'Inspection not found' });
      }
      
      inspection.photos.push(photoRecord);
      await inspection.save();
      
      const savedPhoto = inspection.photos[inspection.photos.length - 1];
      
      const responsePhoto = {
        id: savedPhoto._id,
        filename: savedPhoto.filename,
        originalName: savedPhoto.originalName,
        size: savedPhoto.size,
        caption: savedPhoto.caption,
        inspector: savedPhoto.inspector,
        photoType: savedPhoto.photoType,
        uploadDate: savedPhoto.uploadDate,
        url: `data:${savedPhoto.mimeType};base64,${savedPhoto.data}`
      };

      // Broadcast photo update via SSE
      broadcastPhotoUpdate(schoolId, 'photo_added', responsePhoto);

      res.status(201).json({
        message: 'Inspection photo uploaded successfully',
        photo: responsePhoto
      });
    } else {
      // Add to school (facility or general photos)
      const school = await findSchoolByIdentifier(schoolId);
      if (!school) {
        return res.status(404).json({ message: 'School not found' });
      }
      
      school.photos = school.photos || [];
      school.photos.push(photoRecord);
      await school.save();
      
      const savedPhoto = school.photos[school.photos.length - 1];
      
      const responsePhoto = {
        id: savedPhoto._id,
        filename: savedPhoto.filename,
        originalName: savedPhoto.originalName,
        size: savedPhoto.size,
        caption: savedPhoto.caption,
        inspector: savedPhoto.inspector,
        photoType: savedPhoto.photoType,
        facilityType: savedPhoto.facilityType,
        uploadDate: savedPhoto.uploadDate,
        url: `data:${savedPhoto.mimeType};base64,${savedPhoto.data}`
      };

      // Broadcast photo update via SSE
      broadcastPhotoUpdate(schoolId, 'photo_added', responsePhoto);

      res.status(201).json({
        message: 'Photo uploaded successfully',
        photo: responsePhoto
      });
    }
  } catch (error) {
    console.error('Error uploading photo:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get all photos for a school from database
app.get('/api/schools/:id/photos-db', async (req, res) => {
  try {
    const schoolId = req.params.id;
    const schoolDoc = await findSchoolByIdentifier(schoolId);
    if (!schoolDoc) {
      return res.status(404).json({ message: 'School not found' });
    }

    // Get facility photos from school
    const facilityPhotos = (schoolDoc.photos || []).map((photo) => ({
      id: photo._id,
      url: `data:${photo.mimeType};base64,${photo.data}`,
      caption: photo.caption || photo.originalName || 'Facility Photo',
      date: photo.uploadDate || new Date(),
      inspector: photo.inspector || 'Facility Manager',
      facilityType: photo.facilityType,
      photoType: photo.photoType || 'facility',
      size: photo.size,
      path: photo.path,
      source: 'facility'
    }));

    // Get inspection photos
    const inspections = await Inspection.find(
      isValidObjectId(schoolId) ? { schoolId } : { schoolId: schoolDoc._id }
    ).lean();
    
    const inspectionPhotos = inspections.flatMap((inspection) =>
      (inspection.photos || []).map((photo) => ({
        id: photo._id || `${inspection._id}-${photo.filename}`,
        url: `data:${photo.mimeType};base64,${photo.data}`,
        caption: photo.caption || (photo.originalName
          ? `Inspection Photo - ${photo.originalName}`
          : 'Inspection Photo'),
        date: photo.uploadDate || inspection.inspectionDate,
        inspector: photo.inspector || inspection.inspectorName || 'Inspector',
        inspectionId: inspection._id,
        photoType: photo.photoType || 'inspection',
        size: photo.size,
        path: photo.path,
        source: 'inspection'
      }))
    );

    const combined = [...facilityPhotos, ...inspectionPhotos].sort((a, b) => {
      const dateA = a.date ? new Date(a.date) : 0;
      const dateB = b.date ? new Date(b.date) : 0;
      return dateB - dateA;
    });

    res.json(combined);
  } catch (error) {
    console.error('Error fetching school photos from database:', error);
    res.status(500).json({ message: error.message });
  }
});

// Delete photo from database
app.delete('/api/photos/:photoId', async (req, res) => {
  try {
    const { photoId } = req.params;
    const { schoolId, inspectionId, photoType } = req.query;

    if (photoType === 'inspection' && inspectionId) {
      // Remove from inspection
      const inspection = await Inspection.findById(inspectionId);
      if (!inspection) {
        return res.status(404).json({ message: 'Inspection not found' });
      }
      
      inspection.photos = inspection.photos.filter(photo => photo._id.toString() !== photoId);
      await inspection.save();
    } else {
      // Remove from school
      const school = await findSchoolByIdentifier(schoolId);
      if (!school) {
        return res.status(404).json({ message: 'School not found' });
      }
      
      school.photos = school.photos.filter(photo => photo._id.toString() !== photoId);
      await school.save();
    }

    // Broadcast photo deletion via SSE
    broadcastPhotoUpdate(schoolId, 'photo_deleted', { photoId, schoolId, inspectionId, photoType });

    res.json({ message: 'Photo deleted successfully' });
  } catch (error) {
    console.error('Error deleting photo:', error);
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

