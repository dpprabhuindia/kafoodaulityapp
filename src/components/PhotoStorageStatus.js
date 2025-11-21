import React, { useState, useEffect } from 'react';
import { Database, HardDrive, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { getStorageMethod, hasLocalStoragePhotos, debugPhotoStorage } from '../utils/unifiedPhotoStorage';

const PhotoStorageStatus = ({ className = '' }) => {
  const [storageInfo, setStorageInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadStorageInfo = async () => {
    setIsLoading(true);
    try {
      const method = getStorageMethod();
      const localPhotos = hasLocalStoragePhotos();
      
      setStorageInfo({
        method,
        localPhotos,
        timestamp: new Date().toLocaleTimeString()
      });
    } catch (error) {
      console.error('Error loading storage info:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStorageInfo();
  }, []);

  const handleDebug = async () => {
    console.log('=== Photo Storage Debug ===');
    await debugPhotoStorage();
    await loadStorageInfo();
  };

  if (isLoading) {
    return (
      <div className={`flex items-center space-x-2 text-gray-500 ${className}`}>
        <RefreshCw className="w-4 h-4 animate-spin" />
        <span className="text-sm">Loading storage info...</span>
      </div>
    );
  }

  if (!storageInfo) {
    return (
      <div className={`flex items-center space-x-2 text-red-500 ${className}`}>
        <AlertCircle className="w-4 h-4" />
        <span className="text-sm">Storage info unavailable</span>
      </div>
    );
  }
};

export default PhotoStorageStatus;