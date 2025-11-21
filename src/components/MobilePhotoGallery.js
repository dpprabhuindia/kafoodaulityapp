import React, { useEffect, useState } from 'react';
import { 
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  Share2,
  Image as ImageIcon,
  Calendar,
  User
} from 'lucide-react';
import { triggerHaptic } from '../utils/deviceDetection';

const MobilePhotoGallery = ({ photos, schoolName, onClose, initialPhotoId = null }) => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [filter, setFilter] = useState('all');

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

  const handlePrevious = () => {
    const currentIndex = filteredPhotos.findIndex(p => p.id === selectedPhoto.id);
    if (currentIndex > 0) {
      setSelectedPhoto(filteredPhotos[currentIndex - 1]);
      triggerHaptic('light');
    }
  };

  const handleNext = () => {
    const currentIndex = filteredPhotos.findIndex(p => p.id === selectedPhoto.id);
    if (currentIndex < filteredPhotos.length - 1) {
      setSelectedPhoto(filteredPhotos[currentIndex + 1]);
      triggerHaptic('light');
    }
  };

  useEffect(() => {
    if (initialPhotoId) {
      const photo = photos.find(p => p.id === initialPhotoId);
      if (photo) {
        setSelectedPhoto(photo);
      }
    }
  }, [initialPhotoId, photos]);

  const getPhotoTypeBadge = (photo) => {
    if (photo.inspectionId) {
      return { text: '🔍 Inspection', color: 'bg-blue-100 text-blue-800' };
    }
    if (photo.facilityType) {
      const facilityIcons = {
        kitchen: '🍳',
        storeroom: '📦',
        dining: '🍽️',
        washroom: '🚿',
        playground: '⚽',
        classroom: '📚'
      };
      const icon = facilityIcons[photo.facilityType] || '🏢';
      const label = photo.facilityType.charAt(0).toUpperCase() + photo.facilityType.slice(1);
      return { text: `${icon} ${label}`, color: 'bg-green-100 text-green-800' };
    }
    return { text: '📁 Archive', color: 'bg-gray-100 text-gray-800' };
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={onClose}
            className="p-2 -ml-2 active:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-gray-900" />
          </button>
          <div className="flex-1 text-center">
            <h1 className="text-lg font-semibold text-gray-900">Photo Gallery</h1>
            {schoolName && <p className="text-xs text-gray-500">{schoolName}</p>}
          </div>
          <div className="w-10" />
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
                  ? 'bg-blue-500 text-white'
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
        <div className="flex-1 overflow-y-auto px-4 py-4 pb-6">
          <div className="grid grid-cols-2 gap-3">
            {filteredPhotos.map((photo) => {
              const badge = getPhotoTypeBadge(photo);
              return (
                <div
                  key={photo.id}
                  onClick={() => handlePhotoSelect(photo)}
                  className="relative rounded-2xl overflow-hidden bg-gray-100 active:scale-[0.98] transition-transform"
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
              className="p-2 -ml-2 active:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
            <div className="flex gap-3">
              <button
                onClick={() => triggerHaptic('medium')}
                className="p-2 active:bg-white/20 rounded-full transition-colors"
              >
                <Share2 className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={() => triggerHaptic('medium')}
                className="p-2 active:bg-white/20 rounded-full transition-colors"
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
                className="absolute left-4 p-3 bg-black/50 rounded-full active:bg-black/70 transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
            )}
            {filteredPhotos.findIndex(p => p.id === selectedPhoto.id) < filteredPhotos.length - 1 && (
              <button
                onClick={handleNext}
                className="absolute right-4 p-3 bg-black/50 rounded-full active:bg-black/70 transition-colors"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            )}
          </div>

          {/* Photo Info */}
          <div className="bg-black/90 backdrop-blur-sm px-4 py-4 pb-6">
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
};

export default MobilePhotoGallery;