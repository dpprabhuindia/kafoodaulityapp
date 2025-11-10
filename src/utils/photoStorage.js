// Photo storage utility for inspection photos
import { v4 as uuidv4 } from 'uuid';

// Create inspectPhotos directory path
const INSPECT_PHOTOS_DIR = './inspectPhotos';

// Utility to generate unique filename
export const generatePhotoFilename = (originalName) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const uuid = uuidv4().substring(0, 8);
  const extension = originalName.split('.').pop();
  return `${timestamp}_${uuid}.${extension}`;
};

// Save photo to local inspectPhotos directory
export const savePhotoToLocal = async (file, schoolId, inspectionId) => {
  try {
    // Generate unique filename
    const filename = generatePhotoFilename(file.name);
    
    // Create directory structure: inspectPhotos/schoolId/inspectionId/
    const relativePath = `inspectPhotos/school_${schoolId}/inspection_${inspectionId}/${filename}`;
    
    // In a real application, you would use Node.js fs module or a file upload service
    // For now, we'll simulate the file save and return the path
    
    // Convert file to base64 for storage simulation
    const reader = new FileReader();
    
    return new Promise((resolve, reject) => {
      reader.onload = () => {
        // Simulate saving to local storage
        const photoData = {
          id: uuidv4(),
          filename: filename,
          originalName: file.name,
          path: relativePath,
          size: file.size,
          type: file.type,
          data: reader.result, // base64 data
          uploadDate: new Date().toISOString(),
          schoolId: schoolId,
          inspectionId: inspectionId
        };
        
        // Store in localStorage for demo purposes
        // In production, this would be saved to actual file system
        const existingPhotos = JSON.parse(localStorage.getItem('inspectionPhotos') || '[]');
        existingPhotos.push(photoData);
        localStorage.setItem('inspectionPhotos', JSON.stringify(existingPhotos));
        
        resolve({
          id: photoData.id,
          path: relativePath,
          filename: filename,
          originalName: file.name,
          size: file.size,
          url: reader.result // For preview purposes
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

// Get photo by path
export const getPhotoByPath = (path) => {
  try {
    const existingPhotos = JSON.parse(localStorage.getItem('inspectionPhotos') || '[]');
    return existingPhotos.find(photo => photo.path === path);
  } catch (error) {
    console.error('Error retrieving photo:', error);
    return null;
  }
};

// Get all photos for a specific inspection
export const getInspectionPhotos = (schoolId, inspectionId) => {
  try {
    const existingPhotos = JSON.parse(localStorage.getItem('inspectionPhotos') || '[]');
    return existingPhotos.filter(photo => 
      photo.schoolId === schoolId && photo.inspectionId === inspectionId
    );
  } catch (error) {
    console.error('Error retrieving inspection photos:', error);
    return [];
  }
};

// Delete photo by ID
export const deletePhoto = (photoId) => {
  try {
    const existingPhotos = JSON.parse(localStorage.getItem('inspectionPhotos') || '[]');
    const updatedPhotos = existingPhotos.filter(photo => photo.id !== photoId);
    localStorage.setItem('inspectionPhotos', JSON.stringify(updatedPhotos));
    return true;
  } catch (error) {
    console.error('Error deleting photo:', error);
    return false;
  }
};

// Create directory structure (simulation)
export const ensureDirectoryExists = (schoolId, inspectionId) => {
  // In a real application, this would create actual directories
  // For demo purposes, we'll just return the path structure
  return `inspectPhotos/school_${schoolId}/inspection_${inspectionId}/`;
};
