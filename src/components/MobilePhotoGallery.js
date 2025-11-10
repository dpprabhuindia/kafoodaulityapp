import React, { useState } from 'react';
import { 
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  Share2,
  ZoomIn,
  Image as ImageIcon,
  Calendar,
  User
} from 'lucide-react';
import { detectDevice, getDeviceStyles, triggerHaptic } from '../utils/deviceDetection';

const MobilePhotoGallery = ({ photos, schoolName, onClose }) => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [filter, setFilter] = useState('all');
  const device = detectDevice();
  const styles = getDeviceStyles();

  const filteredPhotos = photos.filter(photo => {
    if (filter === 'all') return true;
    if (filter === 'inspection') return photo.inspectionId;
    if (filter === 'facility') return photo.facilityType;
    if (filter === 'archive') return !photo.inspectionId && !photo.facilityType;
    return true;
  });

  const handlePhotoSelect = (photo) => {
    triggerHaptic('light');
    setSelectedPhoto(photo);
  };

  const handleNext = () => {
    triggerHaptic('light');
    const currentIndex = filteredPhotos.findIndex(p => p.id === selectedPhoto.id);
    if (currentIndex < filteredPhotos.length - 1) {
      setSelectedPhoto(filteredPhotos[currentIndex + 1]);
    }
  };

  const handlePrevious = () => {
    triggerHaptic('light');
    const currentIndex = filteredPhotos.findIndex(p => p.id === selectedPhoto.id);
    if (currentIndex > 0) {
      setSelectedPhoto(filteredPhotos[currentIndex - 1]);
    }
  };

  const getPhotoTypeBadge = (photo) => {
    if (photo.inspectionId) {
      return { text: '🔍 Inspection', color: 'bg-blue-100 text-blue-800' };
    } else if (photo.facilityType) {
      const icons = {
        kitchen: '🍳',
        storeroom: '📦',
        dining: '🍽️',
        washroom: '🚿',
        playground: '⚽',
        classroom: '📚'
      };
      return { 
        text: `${icons[photo.facilityType] || '🏢'} ${photo.facilityType}`, 
        color: 'bg-green-100 text-green-800' 
      };
    }
    return { text: '📁 Archive', color: 'bg-gray-100 text-gray-800' };
  };

  // iOS Style
  if (device.isIOS) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 safe-area-top">
          <div className="flex items-center justify-between">
            <button
              onClick={onClose}
              className="p-2 -ml-2 active:scale-95 transition-transform"
            >
              <ChevronLeft className="w-6 h-6 text-gray-900" />
            </button>
            <div className="flex-1 text-center">
              <h1 className="text-lg font-semibold text-gray-900">Photo Gallery</h1>
              {schoolName && <p className="text-xs text-gray-500">{schoolName}</p>}
            </div>
            <div className="w-10" /> {/* Spacer for centering */}
          </div>

          {/* Filter Pills */}
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
            {['all', 'inspection', 'facility', 'archive'].map((f) => (
              <button
                key={f}
                onClick={() => {
                  setFilter(f);
                  triggerHaptic('light');
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  filter === f
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 active:bg-gray-200'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Photo Grid */}
        {!selectedPhoto && (
          <div className="flex-1 overflow-y-auto px-4 py-4">
            <div className="grid grid-cols-2 gap-3">
              {filteredPhotos.map((photo) => {
                const badge = getPhotoTypeBadge(photo);
                return (
                  <div
                    key={photo.id}
                    onClick={() => handlePhotoSelect(photo)}
                    className="relative rounded-2xl overflow-hidden bg-gray-100 active:scale-95 transition-transform"
                  >
                    <img
                      src={photo.url}
                      alt={photo.caption}
                      className="w-full h-40 object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${badge.color}`}>
                        {badge.text}
                      </span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                      <p className="text-xs text-white font-medium truncate">{photo.caption}</p>
                      <p className="text-xs text-white/80">{new Date(photo.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredPhotos.length === 0 && (
              <div className="text-center py-12">
                <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No photos found</p>
              </div>
            )}
          </div>
        )}

        {/* Full Screen Photo View */}
        {selectedPhoto && (
          <div className="flex-1 flex flex-col bg-black">
            {/* Photo Viewer Header */}
            <div className="bg-black/90 backdrop-blur-sm px-4 py-3 flex items-center justify-between">
              <button
                onClick={() => {
                  setSelectedPhoto(null);
                  triggerHaptic('light');
                }}
                className="p-2 -ml-2 active:scale-95 transition-transform"
              >
                <X className="w-6 h-6 text-white" />
              </button>
              <div className="flex gap-3">
                <button
                  onClick={() => triggerHaptic('medium')}
                  className="p-2 active:scale-95 transition-transform"
                >
                  <Share2 className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={() => triggerHaptic('medium')}
                  className="p-2 active:scale-95 transition-transform"
                >
                  <Download className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Photo */}
            <div className="flex-1 flex items-center justify-center relative">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.caption}
                className="max-w-full max-h-full object-contain"
              />

              {/* Navigation Arrows */}
              {filteredPhotos.findIndex(p => p.id === selectedPhoto.id) > 0 && (
                <button
                  onClick={handlePrevious}
                  className="absolute left-4 p-3 bg-black/50 rounded-full active:scale-95 transition-transform"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
              )}
              {filteredPhotos.findIndex(p => p.id === selectedPhoto.id) < filteredPhotos.length - 1 && (
                <button
                  onClick={handleNext}
                  className="absolute right-4 p-3 bg-black/50 rounded-full active:scale-95 transition-transform"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
              )}
            </div>

            {/* Photo Info */}
            <div className="bg-black/90 backdrop-blur-sm px-4 py-4 safe-area-bottom">
              <div className="mb-2">
                {(() => {
                  const badge = getPhotoTypeBadge(selectedPhoto);
                  return (
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${badge.color}`}>
                      {badge.text}
                    </span>
                  );
                })()}
              </div>
              <h3 className="text-white font-semibold mb-2">{selectedPhoto.caption}</h3>
              <div className="flex items-center gap-4 text-sm text-gray-300">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(selectedPhoto.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>{selectedPhoto.inspector}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Android Material Design Style
  if (device.isAndroid) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-sm px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={onClose}
              className="p-2 -ml-2 active:bg-gray-100 rounded transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-gray-900" />
            </button>
            <div className="flex-1 text-center">
              <h1 className="text-base font-semibold text-gray-900">Photo Gallery</h1>
              {schoolName && <p className="text-xs text-gray-500">{schoolName}</p>}
            </div>
            <div className="w-10" />
          </div>

          {/* Filter Chips */}
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
            {['all', 'inspection', 'facility', 'archive'].map((f) => (
              <button
                key={f}
                onClick={() => {
                  setFilter(f);
                  triggerHaptic('light');
                }}
                className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  filter === f
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 active:bg-gray-300'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Photo Grid */}
        {!selectedPhoto && (
          <div className="flex-1 overflow-y-auto p-3 bg-gray-50">
            <div className="grid grid-cols-2 gap-2">
              {filteredPhotos.map((photo) => {
                const badge = getPhotoTypeBadge(photo);
                return (
                  <div
                    key={photo.id}
                    onClick={() => handlePhotoSelect(photo)}
                    className="relative rounded-lg overflow-hidden bg-gray-100 active:shadow-lg transition-shadow"
                  >
                    <img
                      src={photo.url}
                      alt={photo.caption}
                      className="w-full h-36 object-cover"
                    />
                    <div className="absolute top-1 left-1">
                      <span className={`text-xs px-2 py-0.5 rounded font-medium ${badge.color}`}>
                        {badge.text}
                      </span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                      <p className="text-xs text-white font-medium truncate">{photo.caption}</p>
                      <p className="text-xs text-white/80">{new Date(photo.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredPhotos.length === 0 && (
              <div className="text-center py-12">
                <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No photos found</p>
              </div>
            )}
          </div>
        )}

        {/* Full Screen Photo View */}
        {selectedPhoto && (
          <div className="flex-1 flex flex-col bg-black">
            {/* Photo Viewer Header */}
            <div className="bg-black/90 px-4 py-2 flex items-center justify-between">
              <button
                onClick={() => {
                  setSelectedPhoto(null);
                  triggerHaptic('light');
                }}
                className="p-2 -ml-2 active:bg-white/10 rounded transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => triggerHaptic('medium')}
                  className="p-2 active:bg-white/10 rounded transition-colors"
                >
                  <Share2 className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={() => triggerHaptic('medium')}
                  className="p-2 active:bg-white/10 rounded transition-colors"
                >
                  <Download className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Photo */}
            <div className="flex-1 flex items-center justify-center relative">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.caption}
                className="max-w-full max-h-full object-contain"
              />

              {/* Navigation Arrows */}
              {filteredPhotos.findIndex(p => p.id === selectedPhoto.id) > 0 && (
                <button
                  onClick={handlePrevious}
                  className="absolute left-3 p-2 bg-black/50 rounded-full active:bg-black/70 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
              )}
              {filteredPhotos.findIndex(p => p.id === selectedPhoto.id) < filteredPhotos.length - 1 && (
                <button
                  onClick={handleNext}
                  className="absolute right-3 p-2 bg-black/50 rounded-full active:bg-black/70 transition-colors"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
              )}
            </div>

            {/* Photo Info */}
            <div className="bg-black/90 px-4 py-3">
              <div className="mb-2">
                {(() => {
                  const badge = getPhotoTypeBadge(selectedPhoto);
                  return (
                    <span className={`text-xs px-2 py-0.5 rounded font-medium ${badge.color}`}>
                      {badge.text}
                    </span>
                  );
                })()}
              </div>
              <h3 className="text-white font-semibold mb-2 text-sm">{selectedPhoto.caption}</h3>
              <div className="flex items-center gap-4 text-xs text-gray-300">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{new Date(selectedPhoto.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5" />
                  <span>{selectedPhoto.inspector}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default MobilePhotoGallery;
