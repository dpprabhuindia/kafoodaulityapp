import React, { useState, useRef } from 'react';
import { Camera, Upload, X, Eye } from 'lucide-react';

const PhotoUpload = ({ onPhotosChange, maxPhotos = 5, label = "Upload Photos" }) => {
  const [photos, setPhotos] = useState([]);
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const fileInputRef = useRef(null);

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

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} ({photos.length}/{maxPhotos})
      </label>
      
      {/* Upload Area */}
      <div 
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer"
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

      <input
        ref={fileInputRef}
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
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity rounded-lg flex items-center justify-center space-x-2 opacity-0 group-hover:opacity-100">
                <button
                  onClick={() => setPreviewPhoto(photo)}
                  className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                >
                  <Eye className="h-4 w-4 text-gray-700" />
                </button>
                <button
                  onClick={() => removePhoto(photo.id)}
                  className="p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="h-4 w-4 text-white" />
                </button>
              </div>
              
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
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setPreviewPhoto(null)}
              className="absolute top-4 right-4 p-2 bg-white rounded-full hover:bg-gray-100 transition-colors z-10"
            >
              <X className="h-6 w-6 text-gray-700" />
            </button>
            <img
              src={previewPhoto.preview}
              alt={previewPhoto.name}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 rounded-lg p-3">
              <p className="font-medium text-gray-900">{previewPhoto.name}</p>
              <p className="text-sm text-gray-600">{formatFileSize(previewPhoto.size)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoUpload;
