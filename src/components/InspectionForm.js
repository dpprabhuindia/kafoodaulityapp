import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar,
  Store,
  CheckCircle,
  AlertTriangle,
  Camera,
  FileText,
  Save,
  X,
  Building2,
  Users,
  Clock
} from 'lucide-react';
import { savePhotoToLocal, deletePhoto, ensureDirectoryExists } from '../utils/photoStorage';
import { useI18n } from '../i18n/I18nProvider';

const InspectionForm = ({ onClose, preSelectedSchoolId = null, isModal = true }) => {
  const { t } = useI18n();
  const [selectedSchool, setSelectedSchool] = useState(preSelectedSchoolId);
  const [showAddSchool, setShowAddSchool] = useState(false);
  const [inspectionId] = useState(() => `INS_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [inspectionData, setInspectionData] = useState({
    inspectorName: '',
    inspectionDate: new Date().toISOString().split('T')[0],
    inspectionType: 'routine',
    overallRating: '',
    findings: '',
    violations: '',
    recommendations: '',
    photos: []
  });

  const [newSchool, setNewSchool] = useState({
    name: '',
    type: 'Government School',
    location: '',
    phone: '',
    email: '',
    principalName: '',
    studentCount: '',
    category: 'Primary School',
    level: 'District Level'
  });

  // Sample existing schools data
  const existingSchools = [
    {
      id: 1,
      name: 'Government High School Bangalore North',
      location: 'Bangalore North, Karnataka',
      phone: '+91 80 2234 5678',
      email: 'ghsblrnorth@karnataka.gov.in',
      category: 'Higher Secondary',
      level: 'State Level',
      studentCount: 850
    },
    {
      id: 2,
      name: 'Government Primary School Mysore',
      location: 'Mysore, Karnataka',
      phone: '+91 821 2345 678',
      email: 'gpsmysore@karnataka.gov.in',
      category: 'Primary School',
      level: 'District Level',
      studentCount: 320
    },
    {
      id: 3,
      name: 'Government Higher Secondary School Hubli',
      location: 'Hubli, Karnataka',
      phone: '+91 836 2456 789',
      email: 'ghsshubli@karnataka.gov.in',
      category: 'Higher Secondary',
      level: 'State Level',
      studentCount: 1200
    },
    {
      id: 4,
      name: 'Government Primary School Mangalore',
      location: 'Mangalore, Karnataka',
      phone: '+91 824 2567 890',
      email: 'gpsmangalore@karnataka.gov.in',
      category: 'Primary School',
      level: 'Taluk Level',
      studentCount: 280
    }
  ];

  const handleSchoolSelect = (schoolId) => {
    setSelectedSchool(schoolId);
    setShowAddSchool(false);
  };

  const handleAddNewSchool = () => {
    setShowAddSchool(true);
    setSelectedSchool(null);
  };

  const handlePhotoUpload = async (event) => {
    const files = Array.from(event.target.files);
    
    if (!selectedSchool && !showAddSchool) {
      alert(t('inspection.alerts.selectSchoolFirst'));
      return;
    }
    
    setUploadingPhotos(true);
    
    try {
      // Ensure directory exists for this school and inspection
      const schoolId = selectedSchool || 'new_school';
      ensureDirectoryExists(schoolId, inspectionId);
      
      // Process each file
      const photoPromises = files.map(async (file) => {
        try {
          const savedPhoto = await savePhotoToLocal(file, schoolId, inspectionId);
          return {
            id: savedPhoto.id,
            file: file,
            name: savedPhoto.originalName,
            filename: savedPhoto.filename,
            path: savedPhoto.path,
            size: savedPhoto.size,
            preview: savedPhoto.url,
            uploadDate: new Date().toISOString(),
            localPath: `inspectPhotos/school_${schoolId}/inspection_${inspectionId}/${savedPhoto.filename}`
          };
        } catch (error) {
          console.error('Error uploading photo:', file.name, error);
          return null;
        }
      });
      
      const uploadedPhotos = await Promise.all(photoPromises);
      const successfulUploads = uploadedPhotos.filter(photo => photo !== null);
      
      setInspectionData(prev => ({
        ...prev,
        photos: [...prev.photos, ...successfulUploads]
      }));
      
      if (successfulUploads.length < files.length) {
        alert(`${files.length - successfulUploads.length} ${t('inspection.alerts.photoUploadFailed')}`);
      }
      
    } catch (error) {
      console.error('Error during photo upload:', error);
      alert(t('inspection.alerts.photoUploadError'));
    } finally {
      setUploadingPhotos(false);
    }
  };

  const removePhoto = (index) => {
    const photoToRemove = inspectionData.photos[index];
    
    // Delete from storage if it has an ID (was successfully uploaded)
    if (photoToRemove && photoToRemove.id) {
      deletePhoto(photoToRemove.id);
    }
    
    // Remove from state
    setInspectionData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const handleNewSchoolSubmit = () => {
    // In a real app, this would save the new school to the database
    const newSchoolId = existingSchools.length + 1;
    setSelectedSchool(newSchoolId);
    setShowAddSchool(false);
    alert(t('inspection.alerts.newSchoolAdded'));
  };

  const handleInspectionSubmit = () => {
    if (!selectedSchool && !showAddSchool) {
      alert(t('inspection.alerts.selectSchoolOrAdd'));
      return;
    }
    
    // Prepare inspection data with photo paths
    const inspectionSubmissionData = {
      ...inspectionData,
      inspectionId: inspectionId,
      schoolId: selectedSchool,
      submissionDate: new Date().toISOString(),
      photos: inspectionData.photos.map(photo => ({
        id: photo.id,
        originalName: photo.name,
        filename: photo.filename,
        localPath: photo.localPath,
        path: photo.path,
        size: photo.size,
        uploadDate: photo.uploadDate
      }))
    };
    
    // In a real app, this would save the inspection data to database
    console.log('Inspection Data:', inspectionSubmissionData);
    console.log('Selected School:', selectedSchool);
    console.log('Photos stored in local paths:', inspectionSubmissionData.photos.map(p => p.localPath));
    
    // Save to localStorage for demo purposes
    const existingInspections = JSON.parse(localStorage.getItem('inspections') || '[]');
    existingInspections.push(inspectionSubmissionData);
    localStorage.setItem('inspections', JSON.stringify(existingInspections));
    
    alert(`${t('inspection.alerts.inspectionSaved')}\n\n${t('inspection.alerts.photosStoredIn')}\n${inspectionSubmissionData.photos.map(p => p.localPath).join('\n')}`);
    onClose();
  };

  const selectedSchoolData = existingSchools.find(school => school.id === selectedSchool);

  const containerClasses = isModal 
    ? "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    : "min-h-screen flex items-center justify-center p-4";
    
  const formClasses = isModal
    ? "bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
    : "bg-white rounded-xl shadow-2xl max-w-4xl w-full";

  return (
    <div className={containerClasses}>
      <div className={formClasses}>
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">{t('inspection.title')}</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* School Selection Section */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Building2 className="w-5 h-5 mr-2 text-blue-600" />
              {t('inspection.selectSchool')}
            </h3>

            {!showAddSchool ? (
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('inspection.chooseExisting')}
                    </label>
                    <div className="relative">
                      <select
                        value={selectedSchool || ''}
                        onChange={(e) => handleSchoolSelect(parseInt(e.target.value))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 cursor-pointer"
                      >
                        <option value="">{t('inspection.selectSchoolPlaceholder')}</option>
                        {existingSchools.map((school) => (
                          <option key={school.id} value={school.id}>
                            {school.name} - {school.location}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={handleAddNewSchool}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                      {t('inspection.addNewSchool')}
                    </button>
                  </div>
                </div>

                {/* Selected School Details */}
                {selectedSchoolData && (
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2">{t('inspection.selectedSchoolDetails')}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        {selectedSchoolData.location}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Phone className="w-4 h-4 mr-2" />
                        {selectedSchoolData.phone}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Mail className="w-4 h-4 mr-2" />
                        {selectedSchoolData.email}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Users className="w-4 h-4 mr-2" />
                        {selectedSchoolData.studentCount} {t('common.students')}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Add New School Form */
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold text-gray-900">{t('inspection.addNewSchoolTitle')}</h4>
                  <button
                    onClick={() => setShowAddSchool(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('inspection.schoolName')} *
                    </label>
                    <input
                      type="text"
                      value={newSchool.name}
                      onChange={(e) => setNewSchool({...newSchool, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder={t('inspection.placeholderSchoolName')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('inspection.schoolType')}
                    </label>
                    <select
                      value={newSchool.type}
                      onChange={(e) => setNewSchool({...newSchool, type: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Government School">{t('inspection.schoolTypes.government')}</option>
                      <option value="Aided School">{t('inspection.schoolTypes.aided')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('inspection.location')} *
                    </label>
                    <input
                      type="text"
                      value={newSchool.location}
                      onChange={(e) => setNewSchool({...newSchool, location: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder={t('inspection.placeholderLocation')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('inspection.phoneNumber')}
                    </label>
                    <input
                      type="tel"
                      value={newSchool.phone}
                      onChange={(e) => setNewSchool({...newSchool, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="+91 XXX XXX XXXX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('inspection.email')}
                    </label>
                    <input
                      type="email"
                      value={newSchool.email}
                      onChange={(e) => setNewSchool({...newSchool, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="school@karnataka.gov.in"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('inspection.principalName')}
                    </label>
                    <input
                      type="text"
                      value={newSchool.principalName}
                      onChange={(e) => setNewSchool({...newSchool, principalName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder={t('inspection.principalName')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('inspection.studentCount')}
                    </label>
                    <input
                      type="number"
                      value={newSchool.studentCount}
                      onChange={(e) => setNewSchool({...newSchool, studentCount: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder={t('inspection.studentCount')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('inspection.category')}
                    </label>
                    <select
                      value={newSchool.category}
                      onChange={(e) => setNewSchool({...newSchool, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Primary School">{t('inspection.categories.primary')}</option>
                      <option value="Higher Primary">{t('inspection.categories.higherPrimary')}</option>
                      <option value="High School">{t('inspection.categories.highSchool')}</option>
                      <option value="Higher Secondary">{t('inspection.categories.higherSecondary')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('inspection.level')}
                    </label>
                    <select
                      value={newSchool.level}
                      onChange={(e) => setNewSchool({...newSchool, level: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="State Level">{t('inspection.levels.state')}</option>
                      <option value="District Level">{t('inspection.levels.district')}</option>
                      <option value="Taluk Level">{t('inspection.levels.taluk')}</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleNewSchoolSubmit}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    {t('inspection.addSchoolContinue')}
                  </button>
                  <button
                    onClick={() => setShowAddSchool(false)}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    {t('common.cancel')}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Inspection Details Section */}
          {(selectedSchool || showAddSchool) && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-600" />
                {t('inspection.inspectionDetails')}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('inspection.inspectorName')} *
                  </label>
                  <input
                    type="text"
                    value={inspectionData.inspectorName}
                    onChange={(e) => setInspectionData({...inspectionData, inspectorName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder={t('inspection.placeholderInspectorName')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('inspection.inspectionDate')} *
                  </label>
                  <input
                    type="date"
                    value={inspectionData.inspectionDate}
                    onChange={(e) => setInspectionData({...inspectionData, inspectionDate: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('inspection.inspectionType')}
                  </label>
                  <select
                    value={inspectionData.inspectionType}
                    onChange={(e) => setInspectionData({...inspectionData, inspectionType: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="routine">{t('inspection.inspectionTypes.routine')}</option>
                    <option value="complaint">{t('inspection.inspectionTypes.complaint')}</option>
                    <option value="follow-up">{t('inspection.inspectionTypes.followUp')}</option>
                    <option value="surprise">{t('inspection.inspectionTypes.surprise')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('inspection.overallRating')}
                  </label>
                  <select
                    value={inspectionData.overallRating}
                    onChange={(e) => setInspectionData({...inspectionData, overallRating: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">{t('inspection.selectRatingPlaceholder')}</option>
                    <option value="A">{t('inspection.ratings.a')}</option>
                    <option value="B+">{t('inspection.ratings.bPlus')}</option>
                    <option value="B">{t('inspection.ratings.b')}</option>
                    <option value="C">{t('inspection.ratings.c')}</option>
                    <option value="D">{t('inspection.ratings.d')}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('inspection.inspectionFindings')}
                </label>
                <textarea
                  value={inspectionData.findings}
                  onChange={(e) => setInspectionData({...inspectionData, findings: e.target.value})}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder={t('inspection.placeholderFindings')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('inspection.violationsFound')}
                </label>
                <textarea
                  value={inspectionData.violations}
                  onChange={(e) => setInspectionData({...inspectionData, violations: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder={t('inspection.placeholderViolations')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('inspection.recommendations')}
                </label>
                <textarea
                  value={inspectionData.recommendations}
                  onChange={(e) => setInspectionData({...inspectionData, recommendations: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder={t('inspection.placeholderRecommendations')}
                />
              </div>

              {/* Photo Upload Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('inspection.inspectionPhotos')}
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">{t('inspection.uploadPhotos')}</p>
                  <p className="text-xs text-gray-500 mb-4">
                    {t('inspection.photosStoredIn')}: inspectPhotos/school_{selectedSchool || 'new'}/inspection_{inspectionId.split('_')[1]}/
                  </p>
                  <input
                    type="file"
                    id="photo-upload"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    disabled={uploadingPhotos}
                  />
                  <button 
                    type="button"
                    onClick={() => document.getElementById('photo-upload').click()}
                    disabled={uploadingPhotos}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      uploadingPhotos 
                        ? 'bg-gray-400 cursor-not-allowed text-white' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {uploadingPhotos ? t('inspection.uploading') : t('inspection.chooseFiles')}
                  </button>
                </div>
                
                {/* Display uploaded photos */}
                {inspectionData.photos.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">{t('inspection.uploadedPhotos')}</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {inspectionData.photos.map((photo, index) => (
                        <div key={photo.id || index} className="relative bg-white border rounded-lg p-2">
                          <img
                            src={photo.preview}
                            alt={`Inspection ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border"
                          />
                          <button
                            type="button"
                            onClick={() => removePhoto(index)}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                          >
                            ×
                          </button>
                          <div className="mt-2">
                            <p className="text-xs text-gray-700 font-medium truncate" title={photo.name}>
                              {photo.name}
                            </p>
                            {photo.localPath && (
                              <p className="text-xs text-blue-600 truncate" title={photo.localPath}>
                                📁 {photo.localPath}
                              </p>
                            )}
                            <p className="text-xs text-gray-400">
                              {(photo.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {t('common.cancel')}
            </button>
            <button
              onClick={handleInspectionSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Save className="w-5 h-5" />
              {t('inspection.saveInspection')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InspectionForm;
