import React, { useState } from 'react';
import { Upload, Database, AlertCircle, CheckCircle, X } from 'lucide-react';
import { migrateLocalStorageToDatabase, debugDatabasePhotoStorage } from '../utils/databasePhotoStorage';

const PhotoMigration = ({ onClose }) => {
  const [migrationStatus, setMigrationStatus] = useState('idle'); // idle, migrating, success, error
  const [migrationResult, setMigrationResult] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleMigration = async () => {
    setMigrationStatus('migrating');
    setMigrationResult(null);
    
    try {
      const result = await migrateLocalStorageToDatabase();
      setMigrationResult(result);
      setMigrationStatus(result.success ? 'success' : 'error');
    } catch (error) {
      setMigrationResult({ success: false, error: error.message });
      setMigrationStatus('error');
    }
  };

  const checkLocalStoragePhotos = () => {
    const localPhotos = JSON.parse(localStorage.getItem('unified_photos') || '[]');
    const oldInspectionPhotos = JSON.parse(localStorage.getItem('inspectionPhotos') || '[]');
    const oldFacilityPhotos = JSON.parse(localStorage.getItem('facilityPhotos') || '[]');
    
    return {
      unified: localPhotos.length,
      inspection: oldInspectionPhotos.length,
      facility: oldFacilityPhotos.length,
      total: localPhotos.length + oldInspectionPhotos.length + oldFacilityPhotos.length
    };
  };

  const localPhotoCount = checkLocalStoragePhotos();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-xl">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Photo Storage Migration</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Migration Info */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-start">
              <Database className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Database Storage Migration</h3>
                <p className="text-blue-800 text-sm">
                  This tool will migrate your photos from localStorage to the database for better performance and reliability.
                  Photos will be stored securely in the MongoDB database instead of browser storage.
                </p>
              </div>
            </div>
          </div>

          {/* Current Status */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Current Photo Storage</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Unified Photos:</span>
                <span className="ml-2 font-semibold">{localPhotoCount.unified}</span>
              </div>
              <div>
                <span className="text-gray-600">Legacy Inspection:</span>
                <span className="ml-2 font-semibold">{localPhotoCount.inspection}</span>
              </div>
              <div>
                <span className="text-gray-600">Legacy Facility:</span>
                <span className="ml-2 font-semibold">{localPhotoCount.facility}</span>
              </div>
              <div>
                <span className="text-gray-600">Total Photos:</span>
                <span className="ml-2 font-semibold text-blue-600">{localPhotoCount.total}</span>
              </div>
            </div>
          </div>

          {/* Migration Button */}
          {localPhotoCount.total > 0 && migrationStatus === 'idle' && (
            <div className="text-center">
              <button
                onClick={handleMigration}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 mx-auto transition-colors"
              >
                <Upload className="w-5 h-5" />
                Migrate {localPhotoCount.total} Photos to Database
              </button>
            </div>
          )}

          {/* Migration Progress */}
          {migrationStatus === 'migrating' && (
            <div className="text-center">
              <div className="bg-blue-50 rounded-lg p-6">
                <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-blue-800 font-semibold">Migrating photos to database...</p>
                <p className="text-blue-600 text-sm mt-2">This may take a few moments</p>
              </div>
            </div>
          )}

          {/* Migration Success */}
          {migrationStatus === 'success' && migrationResult && (
            <div className="bg-green-50 rounded-lg p-6">
              <div className="flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-green-900 font-semibold text-center mb-2">Migration Completed!</h3>
              <p className="text-green-800 text-center mb-4">
                Successfully migrated {migrationResult.migrated} out of {migrationResult.total} photos to the database.
              </p>
              
              {migrationResult.errors && migrationResult.errors.length > 0 && (
                <div className="mt-4">
                  <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                  >
                    {showDetails ? 'Hide' : 'Show'} Migration Details ({migrationResult.errors.length} errors)
                  </button>
                  
                  {showDetails && (
                    <div className="mt-2 bg-orange-50 rounded p-3 text-sm">
                      <p className="text-orange-800 font-medium mb-2">Errors encountered:</p>
                      <ul className="text-orange-700 space-y-1">
                        {migrationResult.errors.slice(0, 5).map((error, index) => (
                          <li key={index} className="text-xs">• {error}</li>
                        ))}
                        {migrationResult.errors.length > 5 && (
                          <li className="text-xs">• ... and {migrationResult.errors.length - 5} more</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Migration Error */}
          {migrationStatus === 'error' && migrationResult && (
            <div className="bg-red-50 rounded-lg p-6">
              <div className="flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-red-900 font-semibold text-center mb-2">Migration Failed</h3>
              <p className="text-red-800 text-center mb-4">
                {migrationResult.error || 'An error occurred during migration'}
              </p>
              <div className="text-center">
                <button
                  onClick={() => setMigrationStatus('idle')}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* No Photos Message */}
          {localPhotoCount.total === 0 && (
            <div className="text-center py-8">
              <Database className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No photos found in localStorage to migrate.</p>
              <p className="text-gray-400 text-sm mt-2">All new photos will be stored directly in the database.</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            {migrationStatus === 'success' && (
              <button
                onClick={() => debugDatabasePhotoStorage()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
              >
                Debug Database Storage
              </button>
            )}
            <button
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoMigration;