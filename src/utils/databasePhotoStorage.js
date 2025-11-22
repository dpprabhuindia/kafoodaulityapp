// Database Photo Storage System - replaces localStorage approach
import { v4 as uuidv4 } from 'uuid';

// Ensure API_BASE_URL doesn't have trailing /api
const resolveBaseUrl = () => {
  const envValue = process.env.REACT_APP_API_URL;
  if (envValue && envValue !== 'undefined' && envValue !== 'null') {
    return envValue;
  }
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }
  return '';
};

const getApiBaseUrl = () => {
  const baseUrl = resolveBaseUrl();
  // Remove trailing /api if it exists to avoid double /api/api
  return baseUrl.replace(/\/api\/?$/, '');
};

const API_BASE_URL = getApiBaseUrl();

// Utility to generate unique filename
export const generatePhotoFilename = (originalName) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const uuid = uuidv4().substring(0, 8);
  const extension = originalName.split('.').pop();
  return `${timestamp}_${uuid}.${extension}`;
};

// Convert file to base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Save photo to database
export const savePhotoToDatabase = async (file, schoolId, inspectionId, photoType = 'inspection', facilityType = null, inspector = null, caption = null) => {
  try {
    // Convert file to base64
    const photoData = await fileToBase64(file);
    const filename = generatePhotoFilename(file.name);
    
    const payload = {
      schoolId: schoolId.toString(),
      inspectionId: inspectionId ? inspectionId.toString() : null,
      photoData,
      filename,
      originalName: file.name,
      size: file.size,
      mimeType: file.type,
      photoType,
      facilityType,
      inspector: inspector || (photoType === 'facility' ? 'Facility Manager' : 'Inspector'),
      caption: caption || `${photoType.charAt(0).toUpperCase() + photoType.slice(1)} Photo - ${file.name}`
    };

    const response = await fetch(`${API_BASE_URL}/api/photos/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to upload photo');
    }

    const result = await response.json();
    console.log('Photo saved to database:', {
      id: result.photo.id,
      schoolId,
      photoType,
      filename: result.photo.filename
    });

    return {
      id: result.photo.id,
      path: `database/${schoolId}/${photoType}_${inspectionId || 'general'}/${filename}`,
      filename: result.photo.filename,
      originalName: result.photo.originalName,
      size: result.photo.size,
      url: result.photo.url
    };
  } catch (error) {
    console.error('Error saving photo to database:', error);
    throw error;
  }
};

// Get all photos for a school from database
export const getAllSchoolPhotosFromDatabase = async (schoolId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/schools/${schoolId}/photos-db`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch photos');
    }

    const photos = await response.json();
    console.log('Loaded photos from database for school:', schoolId, photos.length);
    
    return photos.map(photo => ({
      id: photo.id,
      url: photo.url,
      caption: photo.caption,
      date: photo.date,
      inspector: photo.inspector,
      inspectionId: photo.inspectionId,
      localPath: photo.path,
      originalName: photo.caption?.split(' - ')[1] || 'Photo',
      size: photo.size,
      type: photo.photoType,
      facilityType: photo.facilityType,
      source: photo.source
    }));
  } catch (error) {
    console.error('Error retrieving school photos from database:', error);
    return [];
  }
};

// Delete photo from database
export const deletePhotoFromDatabase = async (photoId, schoolId, inspectionId = null, photoType = 'facility') => {
  try {
    const params = new URLSearchParams({
      schoolId: schoolId.toString(),
      photoType
    });
    
    if (inspectionId) {
      params.append('inspectionId', inspectionId.toString());
    }

    const response = await fetch(`${API_BASE_URL}/api/photos/${photoId}?${params}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete photo');
    }

    console.log('Photo deleted from database:', photoId);
    return true;
  } catch (error) {
    console.error('Error deleting photo from database:', error);
    return false;
  }
};

// Get inspection photos from database
export const getInspectionPhotosFromDatabase = async (schoolId, inspectionId) => {
  try {
    const allPhotos = await getAllSchoolPhotosFromDatabase(schoolId);
    return allPhotos.filter(photo => 
      photo.inspectionId === inspectionId.toString() && 
      photo.type === 'inspection'
    );
  } catch (error) {
    console.error('Error retrieving inspection photos from database:', error);
    return [];
  }
};

// Get facility photos from database
export const getFacilityPhotosFromDatabase = async (schoolId, facilityType = null) => {
  try {
    const allPhotos = await getAllSchoolPhotosFromDatabase(schoolId);
    return allPhotos.filter(photo => 
      photo.type === 'facility' &&
      (facilityType ? photo.facilityType === facilityType : true)
    );
  } catch (error) {
    console.error('Error retrieving facility photos from database:', error);
    return [];
  }
};

// Migration function to move localStorage photos to database
export const migrateLocalStorageToDatabase = async () => {
  try {
    console.log('Starting migration from localStorage to database...');
    
    // Get photos from localStorage
    const localPhotos = JSON.parse(localStorage.getItem('unified_photos') || '[]');
    
    if (localPhotos.length === 0) {
      console.log('No photos found in localStorage to migrate');
      return { success: true, migrated: 0 };
    }

    console.log(`Found ${localPhotos.length} photos in localStorage to migrate`);
    
    let migratedCount = 0;
    const errors = [];

    for (const photo of localPhotos) {
      try {
        // Convert base64 data back to file-like object for upload
        const base64Data = photo.data;
        if (!base64Data) continue;

        const payload = {
          schoolId: photo.schoolId,
          inspectionId: photo.inspectionId,
          photoData: base64Data,
          filename: photo.filename,
          originalName: photo.originalName,
          size: photo.size,
          mimeType: photo.type || 'image/jpeg',
          photoType: photo.photoType || 'inspection',
          facilityType: photo.facilityType,
          inspector: photo.inspector || 'Migrated User',
          caption: photo.caption || `Migrated Photo - ${photo.originalName}`
        };

        const response = await fetch(`${API_BASE_URL}/api/photos/upload`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          migratedCount++;
          console.log(`Migrated photo ${photo.id} for school ${photo.schoolId}`);
        } else {
          const errorData = await response.json();
          errors.push(`Photo ${photo.id}: ${errorData.message}`);
        }
      } catch (error) {
        errors.push(`Photo ${photo.id}: ${error.message}`);
      }
    }

    console.log(`Migration completed: ${migratedCount}/${localPhotos.length} photos migrated`);
    
    if (errors.length > 0) {
      console.warn('Migration errors:', errors);
    }

    // Optionally clear localStorage after successful migration
    if (migratedCount > 0) {
      const shouldClear = window.confirm(
        `Successfully migrated ${migratedCount} photos to database. Clear localStorage photos?`
      );
      if (shouldClear) {
        localStorage.removeItem('unified_photos');
        localStorage.removeItem('inspectionPhotos');
        localStorage.removeItem('facilityPhotos');
        console.log('localStorage photos cleared');
      }
    }

    return { 
      success: true, 
      migrated: migratedCount, 
      total: localPhotos.length, 
      errors 
    };
  } catch (error) {
    console.error('Error during migration:', error);
    return { success: false, error: error.message };
  }
};

// Debug function for database photo storage
export const debugDatabasePhotoStorage = async (schoolId = null) => {
  try {
    console.log('=== DATABASE Photo Storage Debug ===');
    
    if (schoolId) {
      const photos = await getAllSchoolPhotosFromDatabase(schoolId);
      console.log(`Photos for school ${schoolId}:`, photos.length);
      
      const photosByType = { inspection: 0, facility: 0, general: 0 };
      photos.forEach(photo => {
        photosByType[photo.type]++;
      });
      
      console.log('Photos by type:', photosByType);
      console.log('Recent photos:', photos.slice(0, 5).map(p => ({
        id: p.id,
        type: p.type,
        date: p.date,
        caption: p.caption
      })));
    } else {
      console.log('Provide schoolId to debug specific school photos');
    }
    
    console.log('===================================');
  } catch (error) {
    console.error('Error debugging database photo storage:', error);
  }
};

// Wrapper function to maintain compatibility with existing code
export const savePhotoToLocal = savePhotoToDatabase;
export const getAllSchoolPhotos = getAllSchoolPhotosFromDatabase;
export const deletePhoto = deletePhotoFromDatabase;
export const getInspectionPhotos = getInspectionPhotosFromDatabase;
export const getFacilityPhotos = getFacilityPhotosFromDatabase;

// Create directory structure (simulation for compatibility)
export const ensureDirectoryExists = (schoolId, inspectionId) => {
  return `database/${schoolId}/${inspectionId ? `inspection_${inspectionId}` : 'general'}/`;
};