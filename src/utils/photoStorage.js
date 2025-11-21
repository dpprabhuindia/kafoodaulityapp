// Unified Photo Storage System for Mobile and Desktop
import { v4 as uuidv4 } from 'uuid';

// Storage keys - unified across mobile and desktop
const STORAGE_KEYS = {
  PHOTOS: 'unified_photos', // Single key for all photos
  INSPECTIONS: 'inspections',
  FACILITIES: 'facilities'
};

// Create inspectPhotos directory path (for reference)
// const INSPECT_PHOTOS_DIR = './inspectPhotos';

// Utility to generate unique filename
export const generatePhotoFilename = (originalName) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const uuid = uuidv4().substring(0, 8);
  const extension = originalName.split('.').pop();
  return `${timestamp}_${uuid}.${extension}`;
};

// Unified photo data structure
const createPhotoRecord = (file, schoolId, inspectionId, photoType = 'inspection', facilityType = null) => {
  const id = uuidv4();
  const filename = generatePhotoFilename(file.name);
  const relativePath = `inspectPhotos/school_${schoolId}/${photoType}_${inspectionId || 'general'}/${filename}`;
  
  return {
    id,
    filename,
    originalName: file.name,
    path: relativePath,
    size: file.size,
    type: file.type,
    uploadDate: new Date().toISOString(),
    schoolId: schoolId.toString(), // Always store as string for consistency
    inspectionId: inspectionId ? inspectionId.toString() : null,
    photoType, // 'inspection', 'facility', 'general'
    facilityType, // 'kitchen', 'storeroom', etc.
    platform: navigator.userAgent.includes('Mobile') ? 'mobile' : 'desktop' // Track source
  };
};

// Unified photo save function
export const savePhotoToLocal = async (file, schoolId, inspectionId, photoType = 'inspection', facilityType = null) => {
  try {
    // Create unified photo record
    const photoRecord = createPhotoRecord(file, schoolId, inspectionId, photoType, facilityType);
    
    // Convert file to base64 for storage
    const reader = new FileReader();
    
    return new Promise((resolve, reject) => {
      reader.onload = () => {
        // Complete photo data with base64
        const completePhotoData = {
          ...photoRecord,
          data: reader.result // base64 data
        };
        
        // Get existing photos from unified storage
        const existingPhotos = JSON.parse(localStorage.getItem(STORAGE_KEYS.PHOTOS) || '[]');
        existingPhotos.push(completePhotoData);
        
        // Save to unified storage
        localStorage.setItem(STORAGE_KEYS.PHOTOS, JSON.stringify(existingPhotos));
        
        // Also maintain backward compatibility with old keys
        migrateToUnifiedStorage();
        
        console.log('Photo saved to unified storage:', {
          id: photoRecord.id,
          schoolId: photoRecord.schoolId,
          photoType: photoRecord.photoType,
          platform: photoRecord.platform
        });
        
        resolve({
          id: photoRecord.id,
          path: photoRecord.path,
          filename: photoRecord.filename,
          originalName: photoRecord.originalName,
          size: photoRecord.size,
          url: reader.result
        });
      };
      
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  } catch (error) {
    console.error('Error saving photo:', error);
    throw error;
  }
};

// Migration function to move old photos to unified storage
export const migrateToUnifiedStorage = () => {
  try {
    const unifiedPhotos = JSON.parse(localStorage.getItem(STORAGE_KEYS.PHOTOS) || '[]');
    const existingIds = new Set(unifiedPhotos.map(p => p.id));
    
    // Migrate from old inspectionPhotos key
    const oldInspectionPhotos = JSON.parse(localStorage.getItem('inspectionPhotos') || '[]');
    oldInspectionPhotos.forEach(photo => {
      if (!existingIds.has(photo.id)) {
        const migratedPhoto = {
          ...photo,
          schoolId: photo.schoolId.toString(),
          inspectionId: photo.inspectionId ? photo.inspectionId.toString() : null,
          photoType: 'inspection',
          facilityType: null,
          platform: 'legacy'
        };
        unifiedPhotos.push(migratedPhoto);
        existingIds.add(photo.id);
      }
    });
    
    // Migrate from old facilityPhotos key
    const oldFacilityPhotos = JSON.parse(localStorage.getItem('facilityPhotos') || '[]');
    oldFacilityPhotos.forEach(facilityPhoto => {
      if (!existingIds.has(facilityPhoto.id)) {
        // Find the actual photo data
        const photoData = oldInspectionPhotos.find(p => p.id === facilityPhoto.id);
        if (photoData) {
          const migratedPhoto = {
            ...photoData,
            schoolId: facilityPhoto.schoolId.toString(),
            inspectionId: null,
            photoType: 'facility',
            facilityType: facilityPhoto.facilityType,
            platform: 'legacy'
          };
          unifiedPhotos.push(migratedPhoto);
          existingIds.add(facilityPhoto.id);
        }
      }
    });
    
    // Save migrated data
    if (unifiedPhotos.length > 0) {
      localStorage.setItem(STORAGE_KEYS.PHOTOS, JSON.stringify(unifiedPhotos));
      console.log('Migrated photos to unified storage:', unifiedPhotos.length);
    }
  } catch (error) {
    console.error('Error migrating photos:', error);
  }
};

// Get photo by path from unified storage
export const getPhotoByPath = (path) => {
  try {
    migrateToUnifiedStorage(); // Ensure migration
    const allPhotos = JSON.parse(localStorage.getItem(STORAGE_KEYS.PHOTOS) || '[]');
    return allPhotos.find(photo => photo.path === path);
  } catch (error) {
    console.error('Error retrieving photo:', error);
    return null;
  }
};

// Get all photos for a specific inspection from unified storage
export const getInspectionPhotos = (schoolId, inspectionId) => {
  try {
    migrateToUnifiedStorage(); // Ensure migration
    const allPhotos = JSON.parse(localStorage.getItem(STORAGE_KEYS.PHOTOS) || '[]');
    return allPhotos.filter(photo => 
      photo.schoolId === schoolId.toString() && 
      photo.inspectionId === inspectionId.toString() &&
      photo.photoType === 'inspection'
    );
  } catch (error) {
    console.error('Error retrieving inspection photos:', error);
    return [];
  }
};

// Get all facility photos for a school
export const getFacilityPhotos = (schoolId, facilityType = null) => {
  try {
    migrateToUnifiedStorage(); // Ensure migration
    const allPhotos = JSON.parse(localStorage.getItem(STORAGE_KEYS.PHOTOS) || '[]');
    return allPhotos.filter(photo => 
      photo.schoolId === schoolId.toString() && 
      photo.photoType === 'facility' &&
      (facilityType ? photo.facilityType === facilityType : true)
    );
  } catch (error) {
    console.error('Error retrieving facility photos:', error);
    return [];
  }
};

// Get all photos for a specific school from unified storage
export const getAllSchoolPhotos = (schoolId) => {
  try {
    migrateToUnifiedStorage(); // Ensure migration
    const allPhotos = JSON.parse(localStorage.getItem(STORAGE_KEYS.PHOTOS) || '[]');
    
    console.log('Loading photos for school:', schoolId);
    console.log('Total photos in unified storage:', allPhotos.length);
    
    // Filter photos for this school
    const schoolPhotos = allPhotos.filter(photo => 
      photo.schoolId === schoolId.toString()
    );
    
    console.log('Photos for school:', schoolPhotos.length);
    console.log('Photo breakdown:', {
      inspection: schoolPhotos.filter(p => p.photoType === 'inspection').length,
      facility: schoolPhotos.filter(p => p.photoType === 'facility').length,
      general: schoolPhotos.filter(p => p.photoType === 'general').length,
      mobile: schoolPhotos.filter(p => p.platform === 'mobile').length,
      desktop: schoolPhotos.filter(p => p.platform === 'desktop').length
    });
    
    // Format photos for display
    const formattedPhotos = schoolPhotos.map(photo => ({
      id: photo.id,
      url: photo.data,
      caption: formatPhotoCaption(photo),
      date: photo.uploadDate,
      inspector: getInspectorName(photo),
      inspectionId: photo.inspectionId,
      localPath: photo.path,
      originalName: photo.originalName,
      size: photo.size,
      type: photo.photoType,
      facilityType: photo.facilityType,
      platform: photo.platform
    }));
    
    // Sort by date (newest first)
    formattedPhotos.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    console.log('Formatted photos for display:', formattedPhotos.length);
    return formattedPhotos;
  } catch (error) {
    console.error('Error retrieving school photos:', error);
    return [];
  }
};

// Helper function to format photo caption
const formatPhotoCaption = (photo) => {
  switch (photo.photoType) {
    case 'inspection':
      return `Inspection Photo - ${photo.originalName}`;
    case 'facility':
      const facilityName = photo.facilityType?.charAt(0).toUpperCase() + photo.facilityType?.slice(1);
      return `${facilityName} Facility - ${photo.originalName}`;
    default:
      return `Photo - ${photo.originalName}`;
  }
};

// Helper function to get inspector name
const getInspectorName = (photo) => {
  switch (photo.photoType) {
    case 'inspection':
      return 'Inspector';
    case 'facility':
      return 'Facility Manager';
    default:
      return 'Unknown';
  }
};

// Enhanced debug function for unified storage
export const debugPhotoStorage = () => {
  try {
    migrateToUnifiedStorage(); // Ensure migration
    
    const unifiedPhotos = JSON.parse(localStorage.getItem(STORAGE_KEYS.PHOTOS) || '[]');
    const oldInspectionPhotos = JSON.parse(localStorage.getItem('inspectionPhotos') || '[]');
    const oldFacilityPhotos = JSON.parse(localStorage.getItem('facilityPhotos') || '[]');
    const inspections = JSON.parse(localStorage.getItem('inspections') || '[]');
    
    console.log('=== UNIFIED Photo Storage Debug ===');
    console.log('Unified Photos:', unifiedPhotos.length);
    console.log('Legacy Inspection Photos:', oldInspectionPhotos.length);
    console.log('Legacy Facility Photos:', oldFacilityPhotos.length);
    console.log('Inspections:', inspections.length);
    
    // Analyze unified photos
    const photosBySchool = {};
    const photosByType = { inspection: 0, facility: 0, general: 0 };
    const photosByPlatform = { mobile: 0, desktop: 0, legacy: 0 };
    
    unifiedPhotos.forEach(photo => {
      const schoolId = photo.schoolId;
      if (!photosBySchool[schoolId]) {
        photosBySchool[schoolId] = { inspection: 0, facility: 0, general: 0, total: 0 };
      }
      
      photosBySchool[schoolId][photo.photoType]++;
      photosBySchool[schoolId].total++;
      photosByType[photo.photoType]++;
      photosByPlatform[photo.platform]++;
    });
    
    console.log('Photos by School:', photosBySchool);
    console.log('Photos by Type:', photosByType);
    console.log('Photos by Platform:', photosByPlatform);
    
    // Check for recent uploads
    const recentPhotos = unifiedPhotos.filter(photo => {
      const uploadTime = new Date(photo.uploadDate);
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      return uploadTime > fiveMinutesAgo;
    });
    
    console.log('Recent Photos (last 5 minutes):', recentPhotos.length);
    if (recentPhotos.length > 0) {
      console.log('Recent photos details:', recentPhotos.map(p => ({
        id: p.id,
        schoolId: p.schoolId,
        type: p.photoType,
        platform: p.platform,
        time: p.uploadDate
      })));
    }
    
    console.log('===================================');
    
    return {
      unifiedPhotos: unifiedPhotos.length,
      legacyInspectionPhotos: oldInspectionPhotos.length,
      legacyFacilityPhotos: oldFacilityPhotos.length,
      inspections: inspections.length,
      photosBySchool,
      photosByType,
      photosByPlatform,
      recentPhotos: recentPhotos.length
    };
  } catch (error) {
    console.error('Error debugging photo storage:', error);
    return null;
  }
};

// Delete photo by ID from unified storage
export const deletePhoto = (photoId) => {
  try {
    // Delete from unified storage
    const unifiedPhotos = JSON.parse(localStorage.getItem(STORAGE_KEYS.PHOTOS) || '[]');
    const updatedPhotos = unifiedPhotos.filter(photo => photo.id !== photoId);
    localStorage.setItem(STORAGE_KEYS.PHOTOS, JSON.stringify(updatedPhotos));
    
    // Also clean up legacy storage for backward compatibility
    const oldInspectionPhotos = JSON.parse(localStorage.getItem('inspectionPhotos') || '[]');
    const updatedOldPhotos = oldInspectionPhotos.filter(photo => photo.id !== photoId);
    localStorage.setItem('inspectionPhotos', JSON.stringify(updatedOldPhotos));
    
    console.log('Photo deleted from unified storage:', photoId);
    return true;
  } catch (error) {
    console.error('Error deleting photo:', error);
    return false;
  }
};

// Clear all photos (for testing/reset)
export const clearAllPhotos = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.PHOTOS);
    localStorage.removeItem('inspectionPhotos');
    localStorage.removeItem('facilityPhotos');
    console.log('All photos cleared from storage');
    return true;
  } catch (error) {
    console.error('Error clearing photos:', error);
    return false;
  }
};

// Create directory structure (simulation)
export const ensureDirectoryExists = (schoolId, inspectionId) => {
  // In a real application, this would create actual directories
  // For demo purposes, we'll just return the path structure
  return `inspectPhotos/school_${schoolId}/inspection_${inspectionId}/`;
};
