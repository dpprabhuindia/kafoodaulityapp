import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { 
  X,
  ChevronLeft,
  Camera,
  Check,
  Upload,
  Trash2
} from 'lucide-react';
import { detectDevice, triggerHaptic } from '../utils/deviceDetection';
import { useI18n } from '../i18n/I18nProvider';
import SchoolWardenPhotoFeed from './SchoolWardenPhotoFeed';

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
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const device = detectDevice();
  const { t } = useI18n();
  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);
  const contentRef = useRef(null);
  const resolvedSchoolId = schoolId || schoolName || '';
  const hasSchool = Boolean(schoolId || schoolName);

  const totalSteps = 4;
  const takePhotoLabel = t('Take Photo') || 'Take Photo';
  const uploadLabel = t('Upload') || 'Upload';

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      formData.photos.forEach(photo => {
        if (photo.preview && photo.preview.startsWith('blob:')) {
          URL.revokeObjectURL(photo.preview);
        }
      });
    };
  }, []);

  // Scroll to top when step changes
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentStep]);

  // Validation
  const validateStep = useCallback((step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.inspectorName.trim()) {
        newErrors.inspectorName = t('inspection.errors.inspectorNameRequired') || 'Inspector name is required';
      }
      if (!formData.inspectionDate) {
        newErrors.inspectionDate = t('inspection.errors.dateRequired') || 'Inspection date is required';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData.inspectorName, formData.inspectionDate, t]);

  const handlePhotoCapture = useCallback((e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    
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

    if (e.target) {
      e.target.value = '';
    }
  }, []);

  const handleOpenCamera = useCallback(() => {
    triggerHaptic('light');
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  }, []);

  const handleOpenGallery = useCallback(() => {
    triggerHaptic('light');
    if (galleryInputRef.current) {
      galleryInputRef.current.click();
    }
  }, []);

  const removePhoto = useCallback((photoId) => {
    triggerHaptic('medium');
    setFormData(prev => {
      const photoToRemove = prev.photos.find(p => p.id === photoId);
      if (photoToRemove && photoToRemove.preview && photoToRemove.preview.startsWith('blob:')) {
        URL.revokeObjectURL(photoToRemove.preview);
      }
      return {
      ...prev,
      photos: prev.photos.filter(p => p.id !== photoId)
  };
    });
  }, []);

  const handleNext = useCallback(() => {
    if (validateStep(currentStep)) {
    triggerHaptic('light');
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
    } else {
      triggerHaptic('error');
    }
  }, [currentStep, totalSteps, validateStep]);

  const handleBack = useCallback(() => {
    triggerHaptic('light');
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    } else {
      onClose();
    }
  }, [currentStep, onClose]);

  const handleSubmit = useCallback(async () => {
    if (!validateStep(currentStep)) {
      triggerHaptic('error');
      return;
    }

    setIsSubmitting(true);
    triggerHaptic('success');
    
    try {
    // Save inspection data
    console.log('Inspection submitted:', formData);
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      alert(t('inspection.alerts.inspectionSaved') || 'Inspection saved successfully');
    onClose();
    } catch (error) {
      console.error('Failed to submit inspection:', error);
      alert(t('inspection.alerts.inspectionError') || 'Failed to save inspection');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, currentStep, validateStep, t, onClose]);

  const updateFormData = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  // Memoize form sections to avoid unnecessary re-renders
  const renderStep1 = useMemo(() => (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('inspection.inspectorName')} *
                </label>
                <input
                  type="text"
                  value={formData.inspectorName}
          onChange={(e) => updateFormData('inspectorName', e.target.value)}
          className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-xl focus:bg-white transition-all text-base touch-manipulation ${
            errors.inspectorName 
              ? 'border-red-500 focus:border-red-500' 
              : 'border-gray-200 focus:border-blue-500'
          }`}
                  placeholder={t('inspection.placeholderInspectorName')}
          autoComplete="name"
          inputMode="text"
                />
        {errors.inspectorName && (
          <p className="mt-1 text-xs text-red-600">{errors.inspectorName}</p>
        )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('inspection.inspectionDate')} *
                </label>
                <input
                  type="date"
                  value={formData.inspectionDate}
          onChange={(e) => updateFormData('inspectionDate', e.target.value)}
          className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-xl focus:bg-white transition-all text-base touch-manipulation ${
            errors.inspectionDate 
              ? 'border-red-500 focus:border-red-500' 
              : 'border-gray-200 focus:border-blue-500'
          }`}
          max={new Date().toISOString().split('T')[0]}
        />
        {errors.inspectionDate && (
          <p className="mt-1 text-xs text-red-600">{errors.inspectionDate}</p>
        )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('inspection.inspectionType')}
                </label>
                <select
                  value={formData.inspectionType}
          onChange={(e) => updateFormData('inspectionType', e.target.value)}
          className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white transition-all text-base touch-manipulation"
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
          onChange={(e) => updateFormData('overallRating', e.target.value)}
          className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white transition-all text-base touch-manipulation"
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
  ), [formData, errors, t, updateFormData]);

  const renderStep2 = useMemo(() => (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('inspection.inspectionFindings')}
                </label>
                <textarea
                  value={formData.findings}
          onChange={(e) => updateFormData('findings', e.target.value)}
                  rows={6}
          className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white transition-all text-base resize-none touch-manipulation"
                  placeholder={t('inspection.placeholderFindings')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('inspection.violationsFound')}
                </label>
                <textarea
                  value={formData.violations}
          onChange={(e) => updateFormData('violations', e.target.value)}
                  rows={5}
          className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white transition-all text-base resize-none touch-manipulation"
                  placeholder={t('inspection.placeholderViolations')}
                />
              </div>
            </div>
  ), [formData, t, updateFormData]);

  const renderStep3 = useMemo(() => (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('inspection.recommendations')}
                </label>
                <textarea
                  value={formData.recommendations}
          onChange={(e) => updateFormData('recommendations', e.target.value)}
                  rows={8}
          className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white transition-all text-base resize-none touch-manipulation"
                  placeholder={t('inspection.placeholderRecommendations')}
                />
              </div>
            </div>
  ), [formData, t, updateFormData]);

  const renderStep4 = useMemo(() => (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  {t('inspection.inspectionPhotos')}
                </label>
                
                  <input
          ref={cameraInputRef}
                    type="file"
                    accept="image/*"
          {...(device.isIOS ? { capture: true } : { capture: 'environment' })}
          onChange={handlePhotoCapture}
          className="hidden"
        />
        <input
          ref={galleryInputRef}
          type="file"
          accept="image/*"
                    multiple
                    onChange={handlePhotoCapture}
                    className="hidden"
                  />

        <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 sm:p-8 text-center bg-gray-50">
          <Camera className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      {t('inspection.uploadPhotos')}
                    </p>
          <p className="text-xs text-gray-500 mb-4">
                      Tap to capture or upload
                    </p>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={handleOpenCamera}
              className="flex-1 min-w-[140px] bg-green-600 active:bg-green-700 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors touch-manipulation"
            >
              <Camera className="w-5 h-5" />
              {takePhotoLabel}
            </button>
            <button
              type="button"
              onClick={handleOpenGallery}
              className="flex-1 min-w-[140px] bg-blue-600 active:bg-blue-700 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors touch-manipulation"
            >
              <Upload className="w-5 h-5" />
              {uploadLabel}
            </button>
                  </div>
        </div>

                {formData.photos.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {formData.photos.map((photo) => (
              <div key={photo.id} className="relative rounded-xl overflow-hidden bg-gray-100 group">
                        <img
                          src={photo.preview}
                          alt={photo.name}
                          className="w-full h-32 object-cover"
                  loading="lazy"
                        />
                        <button
                          onClick={() => removePhoto(photo.id)}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full shadow-lg active:scale-95 transition-transform touch-manipulation opacity-90 group-hover:opacity-100"
                  aria-label="Remove photo"
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
  ), [formData.photos, device.isIOS, t, handleOpenCamera, handleOpenGallery, handlePhotoCapture, removePhoto, takePhotoLabel, uploadLabel]);

  // iOS Style
  if (device.isIOS) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-4 safe-area-top">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={handleBack}
              className="p-2 -ml-2 active:scale-95 transition-transform touch-manipulation"
              aria-label="Back"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-semibold">New Inspection</h1>
            <button
              onClick={onClose}
              className="p-2 -mr-2 active:scale-95 transition-transform touch-manipulation"
              aria-label="Close"
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
        <div 
          ref={contentRef}
          className="flex-1 overflow-y-auto px-4 py-6 space-y-6"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {hasSchool && (
            <div className="mb-4">
              <SchoolWardenPhotoFeed
                schoolId={resolvedSchoolId}
                schoolName={schoolName}
                layout="mobile"
              />
            </div>
          )}
          
          {currentStep === 1 && renderStep1}
          {currentStep === 2 && renderStep2}
          {currentStep === 3 && renderStep3}
          {currentStep === 4 && renderStep4}
        </div>

        {/* Footer Buttons */}
        <div className="border-t border-gray-200 px-4 py-4 bg-white safe-area-bottom">
          <div className="flex gap-3">
            {currentStep < totalSteps ? (
              <button
                onClick={handleNext}
                disabled={isSubmitting}
                className="flex-1 bg-blue-500 text-white py-3.5 rounded-xl font-semibold active:scale-95 transition-transform shadow-lg touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 bg-green-500 text-white py-3.5 rounded-xl font-semibold active:scale-95 transition-transform shadow-lg flex items-center justify-center gap-2 touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check className="w-5 h-5" />
                {isSubmitting ? 'Submitting...' : 'Submit Inspection'}
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
              className="p-2 -ml-2 active:bg-blue-700 rounded transition-colors touch-manipulation"
              aria-label="Back"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-base font-semibold">New Inspection</h1>
            <button
              onClick={onClose}
              className="p-2 -mr-2 active:bg-blue-700 rounded transition-colors touch-manipulation"
              aria-label="Close"
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
        <div 
          ref={contentRef}
          className="flex-1 overflow-y-auto px-4 py-4 bg-gray-50 space-y-4"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {hasSchool && (
            <div className="mb-4">
            <SchoolWardenPhotoFeed
              schoolId={resolvedSchoolId}
              schoolName={schoolName}
              layout="mobile"
            />
              </div>
          )}
          
          {currentStep === 1 && renderStep1}
          {currentStep === 2 && renderStep2}
          {currentStep === 3 && renderStep3}
          {currentStep === 4 && renderStep4}
              </div>

        {/* Footer Buttons */}
        <div className="border-t border-gray-200 px-4 py-3 bg-white">
          <div className="flex gap-2">
            {currentStep < totalSteps ? (
              <button
                onClick={handleNext}
                disabled={isSubmitting}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium active:shadow-lg transition-shadow uppercase tracking-wide touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium active:shadow-lg transition-shadow uppercase tracking-wide flex items-center justify-center gap-2 touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check className="w-5 h-5" />
                {isSubmitting ? 'Submitting...' : 'Submit'}
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
