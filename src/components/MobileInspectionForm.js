import React, { useState } from 'react';
import { 
  X,
  ChevronLeft,
  Camera,
  Check,
  AlertCircle,
  Upload,
  Trash2
} from 'lucide-react';
import { detectDevice, getDeviceStyles, triggerHaptic } from '../utils/deviceDetection';
import { useI18n } from '../i18n/I18nProvider';

const MobileInspectionForm = ({ onClose, schoolId, schoolName }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    inspectorName: '',
    inspectionDate: new Date().toISOString().split('T')[0],
    inspectionType: 'routine',
    overallRating: '',
    findings: '',
    violations: '',
    recommendations: '',
    photos: []
  });

  const device = detectDevice();
  const styles = getDeviceStyles();
  const { t } = useI18n();

  const totalSteps = 4;

  const handlePhotoCapture = (e) => {
    const files = Array.from(e.target.files);
    triggerHaptic('light');
    
    const newPhotos = files.map((file, index) => ({
      id: Date.now() + index,
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: file.size
    }));

    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, ...newPhotos]
    }));
  };

  const removePhoto = (photoId) => {
    triggerHaptic('medium');
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter(p => p.id !== photoId)
    }));
  };

  const handleNext = () => {
    triggerHaptic('light');
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    triggerHaptic('light');
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      onClose();
    }
  };

  const handleSubmit = () => {
    triggerHaptic('success');
    // Save inspection data
    console.log('Inspection submitted:', formData);
    alert(t('inspection.alerts.inspectionSaved'));
    onClose();
  };

  // iOS Style
  if (device.isIOS) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-4 safe-area-top">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={handleBack}
              className="p-2 -ml-2 active:scale-95 transition-transform"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-semibold">New Inspection</h1>
            <button
              onClick={onClose}
              className="p-2 -mr-2 active:scale-95 transition-transform"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {schoolName && (
            <p className="text-sm text-blue-100">{schoolName}</p>
          )}

          {/* Progress Bar */}
          <div className="mt-4 flex gap-1">
            {[...Array(totalSteps)].map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-all ${
                  i < currentStep ? 'bg-white' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('inspection.inspectorName')} *
                </label>
                <input
                  type="text"
                  value={formData.inspectorName}
                  onChange={(e) => setFormData({...formData, inspectorName: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white transition-all text-base"
                  placeholder={t('inspection.placeholderInspectorName')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('inspection.inspectionDate')} *
                </label>
                <input
                  type="date"
                  value={formData.inspectionDate}
                  onChange={(e) => setFormData({...formData, inspectionDate: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white transition-all text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('inspection.inspectionType')}
                </label>
                <select
                  value={formData.inspectionType}
                  onChange={(e) => setFormData({...formData, inspectionType: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white transition-all text-base"
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
                  value={formData.overallRating}
                  onChange={(e) => setFormData({...formData, overallRating: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white transition-all text-base"
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
          )}

          {/* Step 2: Findings */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('inspection.inspectionFindings')}
                </label>
                <textarea
                  value={formData.findings}
                  onChange={(e) => setFormData({...formData, findings: e.target.value})}
                  rows={6}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white transition-all text-base resize-none"
                  placeholder={t('inspection.placeholderFindings')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('inspection.violationsFound')}
                </label>
                <textarea
                  value={formData.violations}
                  onChange={(e) => setFormData({...formData, violations: e.target.value})}
                  rows={5}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white transition-all text-base resize-none"
                  placeholder={t('inspection.placeholderViolations')}
                />
              </div>
            </div>
          )}

          {/* Step 3: Recommendations */}
          {currentStep === 3 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('inspection.recommendations')}
                </label>
                <textarea
                  value={formData.recommendations}
                  onChange={(e) => setFormData({...formData, recommendations: e.target.value})}
                  rows={8}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white transition-all text-base resize-none"
                  placeholder={t('inspection.placeholderRecommendations')}
                />
              </div>
            </div>
          )}

          {/* Step 4: Photos */}
          {currentStep === 4 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  {t('inspection.inspectionPhotos')}
                </label>
                
                {/* Camera Button */}
                <label className="block">
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    multiple
                    onChange={handlePhotoCapture}
                    className="hidden"
                  />
                  <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center bg-gray-50 active:bg-gray-100 transition-colors">
                    <Camera className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      {t('inspection.uploadPhotos')}
                    </p>
                    <p className="text-xs text-gray-500">
                      Tap to capture or upload
                    </p>
                  </div>
                </label>

                {/* Photo Grid */}
                {formData.photos.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {formData.photos.map((photo) => (
                      <div key={photo.id} className="relative rounded-xl overflow-hidden bg-gray-100">
                        <img
                          src={photo.preview}
                          alt={photo.name}
                          className="w-full h-32 object-cover"
                        />
                        <button
                          onClick={() => removePhoto(photo.id)}
                          className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full shadow-lg active:scale-95 transition-transform"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                          <p className="text-xs text-white truncate">{photo.name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <p className="text-xs text-gray-500 mt-3">
                  {formData.photos.length} photo(s) added
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="border-t border-gray-200 px-4 py-4 bg-white safe-area-bottom">
          <div className="flex gap-3">
            {currentStep < totalSteps ? (
              <button
                onClick={handleNext}
                className="flex-1 bg-blue-500 text-white py-3.5 rounded-xl font-semibold active:scale-95 transition-transform shadow-lg"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="flex-1 bg-green-500 text-white py-3.5 rounded-xl font-semibold active:scale-95 transition-transform shadow-lg flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" />
                Submit Inspection
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Android Material Design Style
  if (device.isAndroid) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col">
        {/* Header */}
        <div className="bg-blue-600 text-white px-4 py-3 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={handleBack}
              className="p-2 -ml-2 active:bg-blue-700 rounded transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-base font-semibold">New Inspection</h1>
            <button
              onClick={onClose}
              className="p-2 -mr-2 active:bg-blue-700 rounded transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {schoolName && (
            <p className="text-sm text-blue-100">{schoolName}</p>
          )}

          {/* Progress Bar */}
          <div className="mt-3 flex gap-1">
            {[...Array(totalSteps)].map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 transition-all ${
                  i < currentStep ? 'bg-white' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 py-4 bg-gray-50">
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('inspection.inspectorName')} *
                </label>
                <input
                  type="text"
                  value={formData.inspectorName}
                  onChange={(e) => setFormData({...formData, inspectorName: e.target.value})}
                  className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors text-base"
                  placeholder={t('inspection.placeholderInspectorName')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('inspection.inspectionDate')} *
                </label>
                <input
                  type="date"
                  value={formData.inspectionDate}
                  onChange={(e) => setFormData({...formData, inspectionDate: e.target.value})}
                  className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('inspection.inspectionType')}
                </label>
                <select
                  value={formData.inspectionType}
                  onChange={(e) => setFormData({...formData, inspectionType: e.target.value})}
                  className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors text-base"
                >
                  <option value="routine">{t('inspection.inspectionTypes.routine')}</option>
                  <option value="complaint">{t('inspection.inspectionTypes.complaint')}</option>
                  <option value="follow-up">{t('inspection.inspectionTypes.followUp')}</option>
                  <option value="surprise">{t('inspection.inspectionTypes.surprise')}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('inspection.overallRating')}
                </label>
                <select
                  value={formData.overallRating}
                  onChange={(e) => setFormData({...formData, overallRating: e.target.value})}
                  className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors text-base"
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
          )}

          {/* Step 2: Findings */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('inspection.inspectionFindings')}
                </label>
                <textarea
                  value={formData.findings}
                  onChange={(e) => setFormData({...formData, findings: e.target.value})}
                  rows={6}
                  className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors text-base resize-none"
                  placeholder={t('inspection.placeholderFindings')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('inspection.violationsFound')}
                </label>
                <textarea
                  value={formData.violations}
                  onChange={(e) => setFormData({...formData, violations: e.target.value})}
                  rows={5}
                  className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors text-base resize-none"
                  placeholder={t('inspection.placeholderViolations')}
                />
              </div>
            </div>
          )}

          {/* Step 3: Recommendations */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('inspection.recommendations')}
                </label>
                <textarea
                  value={formData.recommendations}
                  onChange={(e) => setFormData({...formData, recommendations: e.target.value})}
                  rows={8}
                  className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors text-base resize-none"
                  placeholder={t('inspection.placeholderRecommendations')}
                />
              </div>
            </div>
          )}

          {/* Step 4: Photos */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('inspection.inspectionPhotos')}
                </label>
                
                {/* Camera Button */}
                <label className="block">
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    multiple
                    onChange={handlePhotoCapture}
                    className="hidden"
                  />
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-white active:bg-gray-50 transition-colors">
                    <Camera className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      {t('inspection.uploadPhotos')}
                    </p>
                    <p className="text-xs text-gray-500">
                      Tap to capture or upload
                    </p>
                  </div>
                </label>

                {/* Photo Grid */}
                {formData.photos.length > 0 && (
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {formData.photos.map((photo) => (
                      <div key={photo.id} className="relative rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={photo.preview}
                          alt={photo.name}
                          className="w-full h-28 object-cover"
                        />
                        <button
                          onClick={() => removePhoto(photo.id)}
                          className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full shadow active:shadow-lg transition-shadow"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-1.5">
                          <p className="text-xs text-white truncate">{photo.name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <p className="text-xs text-gray-500 mt-2">
                  {formData.photos.length} photo(s) added
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="border-t border-gray-200 px-4 py-3 bg-white">
          <div className="flex gap-2">
            {currentStep < totalSteps ? (
              <button
                onClick={handleNext}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium active:shadow-lg transition-shadow uppercase tracking-wide"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium active:shadow-lg transition-shadow uppercase tracking-wide flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" />
                Submit
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default MobileInspectionForm;
