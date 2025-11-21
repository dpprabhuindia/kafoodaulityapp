// Unified Photo Storage - Single interface for both mobile and desktop
// This wrapper provides a consistent API regardless of the underlying storage method

import { 
  savePhotoToDatabase, 
  getAllSchoolPhotosFromDatabase, 
  deletePhotoFromDatabase,
  getInspectionPhotosFromDatabase,
  getFacilityPhotosFromDatabase,
  migrateLocalStorageToDatabase,
  debugDatabasePhotoStorage
} from './databasePhotoStorage';

// Configuration - can be changed to switch storage methods
const STORAGE_METHOD = 'database'; // 'database' or 'localStorage'

/**
 * Unified photo upload function
 * Works for both mobile and desktop components
 */
export const uploadPhoto = async (file, schoolId, inspectionId = null, photoType = 'inspection', facilityType = null, inspector = null, caption = null) => {
  try {
    console.log(`Uploading photo via unified storage (${STORAGE_METHOD}):`, {
      schoolId,
      inspectionId,
      photoType,
      facilityType,
      filename: file.name
    });

    if (STORAGE_METHOD === 'database') {
      return await savePhotoToDatabase(file, schoolId, inspectionId, photoType, facilityType, inspector, caption);
    } else {
      // Fallback to localStorage (legacy)
      const { savePhotoToLocal } = await import('./photoStorage');
      return await savePhotoToLocal(file, schoolId, inspectionId, photoType, facilityType);
    }
  } catch (error) {
    console.error('Error in unified photo upload:', error);
    throw error;
  }
};

/**
 * Unified photo retrieval function
 * Gets all photos for a school from the configured storage method
 */
export const getSchoolPhotos = async (schoolId) => {
  try {
    console.log(`Loading school photos via unified storage (${STORAGE_METHOD}):`, schoolId);

    if (STORAGE_METHOD === 'database') {
      return await getAllSchoolPhotosFromDatabase(schoolId);
    } else {
      // Fallback to localStorage (legacy)
      const { getAllSchoolPhotos } = await import('./photoStorage');
      return getAllSchoolPhotos(schoolId);
    }
  } catch (error) {
    console.error('Error in unified photo retrieval:', error);
    return [];
  }
};

/**
 * Unified photo deletion function
 */
export const deletePhoto = async (photoId, schoolId, inspectionId = null, photoType = 'facility') => {
  try {
    console.log(`Deleting photo via unified storage (${STORAGE_METHOD}):`, photoId);

    if (STORAGE_METHOD === 'database') {
      return await deletePhotoFromDatabase(photoId, schoolId, inspectionId, photoType);
    } else {
      // Fallback to localStorage (legacy)
      const { deletePhoto: deletePhotoLocal } = await import('./photoStorage');
      return deletePhotoLocal(photoId);
    }
  } catch (error) {
    console.error('Error in unified photo deletion:', error);
    return false;
  }
};

/**
 * Get inspection photos specifically
 */
export const getInspectionPhotos = async (schoolId, inspectionId) => {
  try {
    if (STORAGE_METHOD === 'database') {
      return await getInspectionPhotosFromDatabase(schoolId, inspectionId);
    } else {
      const { getInspectionPhotos: getInspectionPhotosLocal } = await import('./photoStorage');
      return getInspectionPhotosLocal(schoolId, inspectionId);
    }
  } catch (error) {
    console.error('Error getting inspection photos:', error);
    return [];
  }
};

/**
 * Get facility photos specifically
 */
export const getFacilityPhotos = async (schoolId, facilityType = null) => {
  try {
    if (STORAGE_METHOD === 'database') {
      return await getFacilityPhotosFromDatabase(schoolId, facilityType);
    } else {
      const { getFacilityPhotos: getFacilityPhotosLocal } = await import('./photoStorage');
      return getFacilityPhotosLocal(schoolId, facilityType);
    }
  } catch (error) {
    console.error('Error getting facility photos:', error);
    return [];
  }
};

/**
 * Migration function
 */
export const migratePhotos = async () => {
  try {
    console.log('Starting photo migration via unified storage...');
    
    if (STORAGE_METHOD === 'database') {
      return await migrateLocalStorageToDatabase();
    } else {
      console.log('No migration needed for localStorage storage');
      return { success: true, migrated: 0 };
    }
  } catch (error) {
    console.error('Error in photo migration:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Debug function
 */
export const debugPhotoStorage = async (schoolId = null) => {
  try {
    console.log(`Debugging photo storage (${STORAGE_METHOD})...`);
    
    if (STORAGE_METHOD === 'database') {
      return await debugDatabasePhotoStorage(schoolId);
    } else {
      const { debugPhotoStorage: debugPhotoStorageLocal } = await import('./photoStorage');
      return debugPhotoStorageLocal();
    }
  } catch (error) {
    console.error('Error in photo storage debug:', error);
  }
};

/**
 * Check storage method
 */
export const getStorageMethod = () => STORAGE_METHOD;

/**
 * Check if photos exist in localStorage (for migration purposes)
 */
export const hasLocalStoragePhotos = () => {
  try {
    const unifiedPhotos = JSON.parse(localStorage.getItem('unified_photos') || '[]');
    const oldInspectionPhotos = JSON.parse(localStorage.getItem('inspectionPhotos') || '[]');
    const oldFacilityPhotos = JSON.parse(localStorage.getItem('facilityPhotos') || '[]');
    
    const totalCount = unifiedPhotos.length + oldInspectionPhotos.length + oldFacilityPhotos.length;
    
    return {
      hasPhotos: totalCount > 0,
      unified: unifiedPhotos.length,
      inspection: oldInspectionPhotos.length,
      facility: oldFacilityPhotos.length,
      total: totalCount
    };
  } catch (error) {
    console.error('Error checking localStorage photos:', error);
    return { hasPhotos: false, total: 0 };
  }
};

/**
 * Clear all photos (for testing/reset)
 */
export const clearAllPhotos = async () => {
  try {
    console.log(`Clearing all photos via unified storage (${STORAGE_METHOD})...`);
    
    if (STORAGE_METHOD === 'database') {
      // For database storage, we'd need a specific API endpoint to clear all photos
      // For now, just clear localStorage as a fallback
      localStorage.removeItem('unified_photos');
      localStorage.removeItem('inspectionPhotos');
      localStorage.removeItem('facilityPhotos');
      console.log('Cleared localStorage photos (database clearing would need API endpoint)');
      return true;
    } else {
      const { clearAllPhotos: clearAllPhotosLocal } = await import('./photoStorage');
      return clearAllPhotosLocal();
    }
  } catch (error) {
    console.error('Error clearing all photos:', error);
    return false;
  }
};

/**
 * Utility function to ensure directory exists (for compatibility)
 */
export const ensureDirectoryExists = (schoolId, inspectionId) => {
  if (STORAGE_METHOD === 'database') {
    return `database/${schoolId}/${inspectionId ? `inspection_${inspectionId}` : 'general'}/`;
  } else {
    return `inspectPhotos/school_${schoolId}/${inspectionId ? `inspection_${inspectionId}` : 'general'}/`;
  }
};

// Export storage method for components that need to know
export { STORAGE_METHOD };

// Default exports for backward compatibility
const unifiedPhotoStorage = {
  uploadPhoto,
  getSchoolPhotos,
  deletePhoto,
  getInspectionPhotos,
  getFacilityPhotos,
  migratePhotos,
  debugPhotoStorage,
  clearAllPhotos,
  getStorageMethod,
  hasLocalStoragePhotos,
  ensureDirectoryExists
};

export default unifiedPhotoStorage;