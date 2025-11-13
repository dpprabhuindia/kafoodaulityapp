import React, { useState, useRef } from 'react';
import { Camera, Upload, X, Eye, Image as ImageIcon } from 'lucide-react';

const PhotoUpload = ({ onPhotosChange, maxPhotos = 5, label = "Upload Photos" }) => {
  const [photos, setPhotos] = useState([]);
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    
    files.forEach(file => {
      if (photos.length < maxPhotos && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newPhoto = {
            id: Date.now() + Math.random(),
            file: file,
            preview: e.target.result,
            name: file.name,
            size: file.size
          };
          
          setPhotos(prev => {
            const updated = [...prev, newPhoto];
            onPhotosChange && onPhotosChange(updated);
            return updated;
          });
        };
        reader.readAsDataURL(file);
      }
    });
    
    // Reset input
    event.target.value = '';
  };

  const removePhoto = (photoId) => {
    setPhotos(prev => {
      const updated = prev.filter(photo => photo.id !== photoId);
      onPhotosChange && onPhotosChange(updated);
      return updated;
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleCameraClick = () => {
    cameraInputRef.current?.click();
  };

  const handleGalleryClick = () => {
    galleryInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} ({photos.length}/{maxPhotos})
      </label>
      
      {/* Upload Area - Desktop */}
      <div 
        className="hidden md:block border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="flex flex-col items-center space-y-2">
          <div className="flex space-x-2">
            <Camera className="h-8 w-8 text-gray-400" />
            <Upload className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-gray-600">
            Click to upload photos or drag and drop
          </p>
          <p className="text-xs text-gray-500">
            PNG, JPG, JPEG up to 10MB each
          </p>
        </div>
      </div>

      {/* Mobile Upload Options */}
      <div className="md:hidden space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleCameraClick}
            className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg active:border-blue-500 active:bg-blue-50 transition-all touch-manipulation min-h-[120px]"
          >
            <Camera className="h-10 w-10 text-blue-600 mb-2" />
            <span className="text-sm font-medium text-gray-700">Take Photo</span>
            <span className="text-xs text-gray-500 mt-1">Use Camera</span>
          </button>
          
          <button
            type="button"
            onClick={handleGalleryClick}
            className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg active:border-blue-500 active:bg-blue-50 transition-all touch-manipulation min-h-[120px]"
          >
            <ImageIcon className="h-10 w-10 text-blue-600 mb-2" />
            <span className="text-sm font-medium text-gray-700">Choose from Gallery</span>
            <span className="text-xs text-gray-500 mt-1">Select Photos</span>
          </button>
        </div>
        <p className="text-xs text-gray-500 text-center">
          PNG, JPG, JPEG up to 10MB each • {maxPhotos - photos.length} remaining
        </p>
      </div>

      {/* File Inputs */}
      {/* Desktop - General file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Mobile - Camera input */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Mobile - Gallery input */}
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Photo Grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <div key={photo.id} className="relative group">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={photo.preview}
                  alt={photo.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Overlay with actions */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 md:group-hover:bg-opacity-50 active:bg-opacity-50 transition-opacity rounded-lg flex items-center justify-center space-x-2 opacity-0 group-hover:opacity-100 md:group-hover:opacity-100 active:opacity-100 md:active:opacity-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewPhoto(photo);
                  }}
                  className="p-2 bg-white rounded-full active:bg-gray-100 sm:hover:bg-gray-100 transition-colors touch-manipulation min-w-[36px] min-h-[36px] flex items-center justify-center"
                  aria-label="Preview photo"
                >
                  <Eye className="h-4 w-4 text-gray-700" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removePhoto(photo.id);
                  }}
                  className="p-2 bg-red-500 rounded-full active:bg-red-600 sm:hover:bg-red-600 transition-colors touch-manipulation min-w-[36px] min-h-[36px] flex items-center justify-center"
                  aria-label="Remove photo"
                >
                  <X className="h-4 w-4 text-white" />
                </button>
              </div>
              
              {/* Mobile - Always visible remove button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removePhoto(photo.id);
                }}
                className="md:hidden absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center active:bg-red-600 transition-colors touch-manipulation shadow-lg"
                aria-label="Remove photo"
              >
                <X className="h-4 w-4" />
              </button>
              
              {/* File info */}
              <div className="mt-2 text-xs text-gray-600 truncate">
                <p className="font-medium truncate">{photo.name}</p>
                <p>{formatFileSize(photo.size)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Photo Preview Modal */}
      {previewPhoto && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-2 sm:p-4"
          onClick={() => setPreviewPhoto(null)}
        >
          <div 
            className="relative max-w-4xl max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewPhoto(null)}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 p-2 sm:p-3 bg-white rounded-full active:bg-gray-100 sm:hover:bg-gray-100 transition-colors z-10 touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Close preview"
            >
              <X className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700" />
            </button>
            <img
              src={previewPhoto.preview}
              alt={previewPhoto.name}
              className="max-w-full max-h-[calc(100vh-8rem)] sm:max-h-[calc(100vh-10rem)] object-contain rounded-lg"
            />
            <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 bg-white bg-opacity-90 rounded-lg p-2 sm:p-3 max-w-[calc(100%-4rem)]">
              <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{previewPhoto.name}</p>
              <p className="text-xs sm:text-sm text-gray-600">{formatFileSize(previewPhoto.size)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoUpload;
