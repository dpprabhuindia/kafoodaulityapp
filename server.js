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
const WardenPhoto = require('./src/models/WardenPhoto');
const User = require('./src/models/User');
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

const normalizeBaseUrl = (url = '') => url.replace(/\/+$/, '');

const resolveConfiguredBaseUrl = () => {
  const explicitBase =
    process.env.PUBLIC_BASE_URL ||
    process.env.APP_BASE_URL ||
    process.env.REACT_APP_API_URL ||
    process.env.API_BASE_URL;

  if (explicitBase && explicitBase !== 'undefined' && explicitBase !== 'null') {
    return normalizeBaseUrl(explicitBase.replace(/\/api\/?$/, ''));
  }

  return '';
};

const getRequestBaseUrl = (req) => {
  if (!req) return '';
  const protocol = req.protocol || 'http';
  const host = req.get ? req.get('host') : '';
  return host ? `${protocol}://${host}` : '';
};

const getAbsoluteBaseUrl = (req) => {
  const configured = resolveConfiguredBaseUrl();
  if (configured) {
    return configured;
  }
  return normalizeBaseUrl(getRequestBaseUrl(req));
};

const app = express();
const PORT = process.env.PORT || 5010;

// Store SSE connections for real-time updates
const sseConnections = new Map();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

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
    const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/food-transparency-portal';
    await mongoose.connect(mongoURI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};

// Connect to database
connectDB();

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

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

// WARDEN PHOTO ROUTES

// Get all warden photos
app.get('/api/warden-photos', async (req, res) => {
  try {
    const { schoolId, mealType, status, startDate, endDate, page = 1, limit = 20 } = req.query;
    
    let filter = {};
    if (schoolId) {
      // Enhanced school filtering - match by exact schoolId, licenseNumber, or school name
      const searchCriteria = [
        { licenseNumber: schoolId },
        { name: { $regex: schoolId, $options: 'i' } }
      ];
      
      // Only add _id search if schoolId is a valid ObjectId
      if (mongoose.Types.ObjectId.isValid(schoolId)) {
        searchCriteria.push({ _id: schoolId });
      }
      
      const schools = await School.find({
        $or: searchCriteria
      });
      
      if (schools.length > 0) {
        // Create filter that matches any of the school identifiers
        const schoolIdentifiers = schools.flatMap(school => [
          school._id.toString(),
          school.licenseNumber,
          school.name,
          `${school.name} (${school.licenseNumber})`,
          `${school.name} ()` // Handle empty parentheses format from old data
        ]).filter(Boolean);
        
        console.log('School filter - Found schools:', schools.length, 'Identifiers:', schoolIdentifiers);
        filter.schoolId = { $in: schoolIdentifiers };
      } else {
        console.log('School filter - No schools found for:', schoolId, 'Using direct match');
        // If no schools found, use direct match (fallback)
        filter.schoolId = schoolId;
      }
    }
    if (mealType) filter.mealType = mealType;
    if (status) filter.status = status;
    
    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) filter.timestamp.$gte = new Date(startDate);
      if (endDate) filter.timestamp.$lte = new Date(endDate);
    }
    
    const skip = (page - 1) * limit;
    
    const photos = await WardenPhoto.find(filter)
      .populate('uploadedBy', 'name phone role')
      .populate('reviewedBy', 'name role')
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean(); // Use lean() for better performance and smaller response size
    
    const total = await WardenPhoto.countDocuments(filter);
    
    res.json({
      photos,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching warden photos:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get warden photos for a specific school
app.get('/api/schools/:schoolId/warden-photos', async (req, res) => {
  try {
    const { schoolId } = req.params;
    const { mealType, status, startDate, endDate } = req.query;
    
    let filter = { schoolId };
    if (mealType) filter.mealType = mealType;
    if (status) filter.status = status;
    
    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) filter.timestamp.$gte = new Date(startDate);
      if (endDate) filter.timestamp.$lte = new Date(endDate);
    }
    
    const photos = await WardenPhoto.find(filter)
      .populate('uploadedBy', 'name phone role')
      .populate('reviewedBy', 'name role')
      .sort({ timestamp: -1 });
    
    res.json(photos);
  } catch (error) {
    console.error('Error fetching school warden photos:', error);
    res.status(500).json({ message: error.message });
  }
});

// Create warden photo (from warden app)
app.post('/api/warden-photos', async (req, res) => {
  try {
    console.log('Received warden photo sync request:', req.body);
    const { schoolId, mealType, photoUrl, uploadedBy, filename, originalName, size, mimeType, data } = req.body;
    
    if (!schoolId || !mealType || !photoUrl || !uploadedBy) {
      console.error('Missing required fields:', { schoolId, mealType, photoUrl, uploadedBy });
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    const wardenPhoto = new WardenPhoto({
      schoolId,
      mealType,
      photoUrl,
      uploadedBy,
      filename,
      originalName,
      size,
      mimeType,
      data,
      status: 'pending'
    });
    
    const savedPhoto = await wardenPhoto.save();
    await savedPhoto.populate('uploadedBy', 'name phone role');
    
    // Broadcast photo update via SSE
    broadcastPhotoUpdate(schoolId, 'warden_photo_added', {
      id: savedPhoto._id,
      schoolId: savedPhoto.schoolId,
      mealType: savedPhoto.mealType,
      photoUrl: savedPhoto.photoUrl,
      timestamp: savedPhoto.timestamp,
      uploadedBy: savedPhoto.uploadedBy,
      status: savedPhoto.status
    });
    
    res.status(201).json({
      success: true,
      photo: savedPhoto
    });
  } catch (error) {
    console.error('Error creating warden photo:', error);
    res.status(500).json({ message: error.message });
  }
});

// Warden photo upload endpoint (handles FormData from PWA)
app.post('/api/warden-photos/upload', upload.single('photo'), async (req, res) => {
  try {
    console.log('Received warden photo upload:', req.body);
    console.log('File:', req.file);
    
    if (!req.file) {
      return res.status(400).json({ message: 'No photo file uploaded' });
    }
    
    const { schoolId, mealType } = req.body;
    
    if (!schoolId || !mealType) {
      return res.status(400).json({ message: 'Missing required fields: schoolId, mealType' });
    }
    
    // Build absolute photo URL based on configured base or incoming request
    const photoUrl = `${getAbsoluteBaseUrl(req)}/uploads/${req.file.filename}`;
    
    // Create warden photo record
    const wardenPhoto = new WardenPhoto({
      schoolId,
      mealType,
      photoUrl,
      uploadedBy: req.body.uploadedBy || 'anonymous', // Will be set by auth middleware in production
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      mimeType: req.file.mimetype,
      status: 'pending'
    });
    
    const savedPhoto = await wardenPhoto.save();
    
    // Broadcast photo update via SSE
    broadcastPhotoUpdate(schoolId, 'warden_photo_added', {
      id: savedPhoto._id,
      schoolId: savedPhoto.schoolId,
      mealType: savedPhoto.mealType,
      photoUrl: savedPhoto.photoUrl,
      timestamp: savedPhoto.timestamp,
      uploadedBy: savedPhoto.uploadedBy,
      status: savedPhoto.status
    });
    
    res.status(201).json({
      success: true,
      photo: savedPhoto
    });
  } catch (error) {
    console.error('Error uploading warden photo:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update warden photo status (approve/reject)
app.put('/api/warden-photos/:photoId/status', async (req, res) => {
  try {
    const { photoId } = req.params;
    const { status, reviewNotes, reviewedBy } = req.body;
    
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be approved or rejected' });
    }
    
    const photo = await WardenPhoto.findByIdAndUpdate(
      photoId,
      {
        status,
        reviewNotes,
        reviewedBy,
        reviewedAt: new Date()
      },
      { new: true }
    ).populate('uploadedBy', 'name phone role').populate('reviewedBy', 'name role');
    
    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }
    
    // Broadcast photo status update via SSE
    broadcastPhotoUpdate(photo.schoolId, 'warden_photo_status_updated', {
      id: photo._id,
      status: photo.status,
      reviewNotes: photo.reviewNotes,
      reviewedBy: photo.reviewedBy,
      reviewedAt: photo.reviewedAt
    });
    
    res.json(photo);
  } catch (error) {
    console.error('Error updating warden photo status:', error);
    res.status(500).json({ message: error.message });
  }
});

// Delete warden photo
app.delete('/api/warden-photos/:photoId', async (req, res) => {
  try {
    const { photoId } = req.params;
    
    const photo = await WardenPhoto.findByIdAndDelete(photoId);
    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }
    
    // Broadcast photo deletion via SSE
    broadcastPhotoUpdate(photo.schoolId, 'warden_photo_deleted', {
      id: photo._id,
      schoolId: photo.schoolId
    });
    
    res.json({ message: 'Photo deleted successfully' });
  } catch (error) {
    console.error('Error deleting warden photo:', error);
    res.status(500).json({ message: error.message });
  }
});

// Bulk update warden photo school IDs (migration endpoint)
app.post('/api/warden-photos/fix-school-ids', async (req, res) => {
  try {
    console.log('Starting warden photo school ID migration...');
    
    // Get all schools to create mapping
    const schools = await School.find();
    const schoolMapping = new Map();
    
    schools.forEach(school => {
      // Map various formats to license number
      schoolMapping.set(school.name, school.licenseNumber);
      schoolMapping.set(`${school.name} ()`, school.licenseNumber);
      schoolMapping.set(school._id.toString(), school.licenseNumber);
      schoolMapping.set(school.licenseNumber, school.licenseNumber);
    });
    
    // Get all warden photos
    const photos = await WardenPhoto.find();
    let updatedCount = 0;
    const updateSummary = [];
    
    for (const photo of photos) {
      const currentSchoolId = photo.schoolId;
      const correctSchoolId = schoolMapping.get(currentSchoolId);
      
      if (correctSchoolId && correctSchoolId !== currentSchoolId) {
        photo.schoolId = correctSchoolId;
        await photo.save();
        updatedCount++;
        
        // Track summary
        const existing = updateSummary.find(s => s.from === currentSchoolId);
        if (existing) {
          existing.count++;
        } else {
          updateSummary.push({
            from: currentSchoolId,
            to: correctSchoolId,
            count: 1
          });
        }
      }
    }
    
    console.log(`Migration completed. Updated ${updatedCount} photos.`);
    
    res.json({
      success: true,
      message: `Successfully updated ${updatedCount} warden photos`,
      updatedCount,
      summary: updateSummary
    });
  } catch (error) {
    console.error('Error fixing warden photo school IDs:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get warden photo statistics
app.get('/api/warden-photos/stats', async (req, res) => {
  try {
    const { schoolId, startDate, endDate } = req.query;
    
    let matchFilter = {};
    if (schoolId) {
      // Enhanced school filtering - match by exact schoolId, licenseNumber, or school name
      const searchCriteria = [
        { licenseNumber: schoolId },
        { name: { $regex: schoolId, $options: 'i' } }
      ];
      
      // Only add _id search if schoolId is a valid ObjectId
      if (mongoose.Types.ObjectId.isValid(schoolId)) {
        searchCriteria.push({ _id: schoolId });
      }
      
      const schools = await School.find({
        $or: searchCriteria
      });
      
      if (schools.length > 0) {
        // Create filter that matches any of the school identifiers
        const schoolIdentifiers = schools.flatMap(school => [
          school._id.toString(),
          school.licenseNumber,
          school.name,
          `${school.name} (${school.licenseNumber})`,
          `${school.name} ()` // Handle empty parentheses format from old data
        ]).filter(Boolean);
        
        matchFilter.schoolId = { $in: schoolIdentifiers };
      } else {
        // If no schools found, use direct match (fallback)
        matchFilter.schoolId = schoolId;
      }
    }
    if (startDate || endDate) {
      matchFilter.timestamp = {};
      if (startDate) matchFilter.timestamp.$gte = new Date(startDate);
      if (endDate) matchFilter.timestamp.$lte = new Date(endDate);
    }
    
    const stats = await WardenPhoto.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: null,
          totalPhotos: { $sum: 1 },
          pendingPhotos: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
          approvedPhotos: { $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] } },
          rejectedPhotos: { $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] } },
          breakfastPhotos: { $sum: { $cond: [{ $eq: ['$mealType', 'breakfast'] }, 1, 0] } },
          lunchPhotos: { $sum: { $cond: [{ $eq: ['$mealType', 'lunch'] }, 1, 0] } },
          snacksPhotos: { $sum: { $cond: [{ $eq: ['$mealType', 'snacks'] }, 1, 0] } },
          dinnerPhotos: { $sum: { $cond: [{ $eq: ['$mealType', 'dinner'] }, 1, 0] } }
        }
      }
    ]);
    
    const mealTypeStats = await WardenPhoto.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: '$mealType',
          count: { $sum: 1 },
          pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
          approved: { $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] } },
          rejected: { $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] } }
        }
      }
    ]);
    
    const dailyStats = await WardenPhoto.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: {
            year: { $year: '$timestamp' },
            month: { $month: '$timestamp' },
            day: { $dayOfMonth: '$timestamp' }
          },
          count: { $sum: 1 },
          pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
          approved: { $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] } },
          rejected: { $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] } }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1, '_id.day': -1 } },
      { $limit: 30 }
    ]);
    
    res.json({
      overall: stats[0] || {
        totalPhotos: 0,
        pendingPhotos: 0,
        approvedPhotos: 0,
        rejectedPhotos: 0,
        breakfastPhotos: 0,
        lunchPhotos: 0,
        snacksPhotos: 0,
        dinnerPhotos: 0
      },
      byMealType: mealTypeStats,
      daily: dailyStats
    });
  } catch (error) {
    console.error('Error fetching warden photo stats:', error);
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

// USER SYNC ENDPOINT
// Sync user from backend to web portal
app.post('/api/users/sync', async (req, res) => {
  try {
    console.log('Received user sync request:', req.body);
    const { name, phone, role, schoolId } = req.body;
    
    if (!phone) {
      return res.status(400).json({ message: 'Phone number is required' });
    }

    // Check if user already exists by phone number (more reliable than ID)
    let user = await User.findOne({ phone });
    
    if (user) {
      // Update existing user
      user.name = name || user.name;
      user.role = role || user.role;
      user.schoolId = schoolId || user.schoolId;
      await user.save();
      console.log('User updated:', user._id);
    } else {
      // Create new user - let MongoDB generate the ObjectId
      user = new User({
        name: name || 'Warden',
        phone: phone,
        password: 'synced_user_temp_password', // Temporary password for synced users
        role: role || 'warden',
        schoolId: schoolId || '',
        status: 'active',
        permissions: role === 'warden' ? ['upload_photos'] : []
      });
      await user.save();
      console.log('User created:', user._id);
    }
    
    res.json({ success: true, user });
  } catch (error) {
    console.error('Error syncing user:', error);
    res.status(500).json({ message: error.message });
  }
});

// Serve React app static files
app.use(express.static(path.join(__dirname, 'build')));

// Handle specific React routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get('/warden-photos', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get('/establishments', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get('/audit', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get('/reports', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get('/profile', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  const fallbackBaseUrl = `http://127.0.0.1:${PORT}`;
  const baseUrl = resolveConfiguredBaseUrl() || fallbackBaseUrl;
  console.log(`Web portal available at ${baseUrl}`);
});

