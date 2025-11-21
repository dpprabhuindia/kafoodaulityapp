import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Upload, 
  Image, 
  Save, 
  RefreshCw, 
  Shield, 
  User, 
  Eye,
  X,
  Check,
  AlertTriangle,
  Database
} from 'lucide-react';
import KarnatakaLogo from './KarnatakaLogo';
import PhotoMigration from './PhotoMigration';
import { useI18n } from '../i18n/I18nProvider';

const AdminPanel = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [currentLogo, setCurrentLogo] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showPhotoMigration, setShowPhotoMigration] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    // Get current user
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    setCurrentUser(user);

    // Load current logo
    const savedLogo = localStorage.getItem('portalLogo');
    if (savedLogo) {
      setCurrentLogo(savedLogo);
    }
  }, []);

  // Check if user is admin
  const isAdmin = currentUser?.role === 'admin';

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setMessage({ type: 'error', text: t('admin.errorInvalidFile') });
        return;
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setMessage({ type: 'error', text: t('admin.errorFileSize') });
        return;
      }

      setLogoFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
      
      setMessage({ type: '', text: '' });
    }
  };

  const handleSaveLogo = async () => {
    if (!logoFile) {
      setMessage({ type: 'error', text: t('admin.errorSelectFile') });
      return;
    }

    setIsUploading(true);
    
    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Save logo to localStorage (in production, this would be uploaded to server)
      const reader = new FileReader();
      reader.onload = (e) => {
        const logoData = e.target.result;
        localStorage.setItem('portalLogo', logoData);
        setCurrentLogo(logoData);
        setLogoFile(null);
        setLogoPreview(null);
        setMessage({ type: 'success', text: t('admin.successLogoUpdated') });
        
        // Clear message after 3 seconds
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      };
      reader.readAsDataURL(logoFile);
      
    } catch (error) {
      setMessage({ type: 'error', text: t('admin.errorUploadFailed') });
    } finally {
      setIsUploading(false);
    }
  };

  const handleResetLogo = () => {
    localStorage.removeItem('portalLogo');
    setCurrentLogo(null);
    setLogoFile(null);
    setLogoPreview(null);
    setMessage({ type: 'success', text: t('admin.successLogoReset') });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleCancelUpload = () => {
    setLogoFile(null);
    setLogoPreview(null);
    setMessage({ type: '', text: '' });
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen gradient-bg pt-14 sm:pt-16">
        <div className="container mx-auto px-4 py-6 sm:py-8">
          <div className="max-w-md mx-auto">
            <div className="glass-card p-4 sm:p-6 lg:p-8 text-center">
              <Shield className="w-12 h-12 sm:w-16 sm:h-16 text-red-500 mx-auto mb-3 sm:mb-4" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{t('admin.accessDenied')}</h2>
              <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
                {t('admin.accessDeniedMsg')}
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm">
                <p className="text-red-600">
                  {t('admin.currentRole')}: <strong>{currentUser?.role || 'Unknown'}</strong>
                </p>
                <p className="text-red-600">
                  {t('admin.requiredRole')}: <strong>admin</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 px-2 sm:px-4">
      {/* Header */}
      <div className="glass-card p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-black break-words">{t('admin.title')}</h1>
              <p className="text-gray-700 text-sm sm:text-base">{t('admin.subtitle')}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-700 whitespace-nowrap">
            <User className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{t('admin.welcome')}, {currentUser?.name}</span>
          </div>
        </div>
      </div>

      {/* Logo Management Section */}
      <div className="glass-card p-4 sm:p-6 lg:p-8">
        <div className="flex items-center space-x-3 mb-4 sm:mb-6">
          <Image className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0" />
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{t('admin.logoManagement')}</h2>
        </div>

        {/* Message Display */}
        {message.text && (
          <div className={`mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg flex items-center space-x-2 text-sm sm:text-base ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-700' 
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {message.type === 'success' ? (
              <Check className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            )}
            <span className="break-words">{message.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Current Logo Display */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">{t('admin.currentLogo')}</h3>
            <div className="bg-gray-50 rounded-lg p-4 sm:p-6 text-center">
              {currentLogo ? (
                <div className="space-y-3 sm:space-y-4">
                  <img
                    src={currentLogo}
                    alt="Current Portal Logo"
                    className="max-h-24 sm:max-h-32 mx-auto object-contain"
                  />
                  <p className="text-xs sm:text-sm text-gray-600">{t('admin.customLogoActive')}</p>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  <KarnatakaLogo size="lg" className="mx-auto" />
                  <p className="text-xs sm:text-sm text-gray-600">{t('admin.defaultLogo')}</p>
                </div>
              )}
            </div>
          </div>

          {/* Logo Upload Section */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">{t('admin.uploadNewLogo')}</h3>
            
            {/* File Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center mb-3 sm:mb-4">
              <Upload className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
              <p className="text-gray-600 mb-2 text-sm sm:text-base">{t('admin.uploadLogoMsg')}</p>
              <p className="text-xs text-gray-500 mb-3 sm:mb-4">
                {t('admin.supportedFormats')}
              </p>
              <input
                type="file"
                id="logo-upload"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <button
                onClick={() => document.getElementById('logo-upload').click()}
                className="bg-blue-600 active:bg-blue-700 sm:hover:bg-blue-700 text-white px-4 py-2.5 sm:py-2 rounded-lg transition-colors min-h-[44px] touch-manipulation text-sm sm:text-base"
              >
                {t('admin.chooseFile')}
              </button>
            </div>

            {/* Preview Section */}
            {logoPreview && (
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">{t('admin.preview')}</h4>
                <div className="flex items-center justify-center bg-white rounded border p-3 sm:p-4 mb-3">
                  <img
                    src={logoPreview}
                    alt="Logo Preview"
                    className="max-h-20 sm:max-h-24 object-contain"
                  />
                </div>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <button
                    onClick={handleSaveLogo}
                    disabled={isUploading}
                    className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 sm:py-2 rounded-lg transition-colors min-h-[44px] touch-manipulation text-sm sm:text-base ${
                      isUploading
                        ? 'bg-gray-400 cursor-not-allowed text-white'
                        : 'bg-green-600 active:bg-green-700 sm:hover:bg-green-700 text-white'
                    }`}
                  >
                    {isUploading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>{t('admin.uploading')}</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>{t('admin.saveLogo')}</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleCancelUpload}
                    className="px-4 py-2.5 sm:py-2 bg-gray-500 active:bg-gray-600 sm:hover:bg-gray-600 text-white rounded-lg transition-colors min-h-[44px] touch-manipulation flex items-center justify-center"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Reset Option */}
            {currentLogo && (
              <div className="border-t pt-3 sm:pt-4">
                <button
                  onClick={handleResetLogo}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 sm:py-2 bg-red-600 active:bg-red-700 sm:hover:bg-red-700 text-white rounded-lg transition-colors min-h-[44px] touch-manipulation text-sm sm:text-base"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>{t('admin.resetToDefault')}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Logo Guidelines */}
        <div className="mt-4 sm:mt-6 lg:mt-8 bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
          <h4 className="text-sm font-medium text-blue-800 mb-2">{t('admin.logoGuidelines')}</h4>
          <ul className="text-xs sm:text-sm text-blue-700 space-y-1">
            <li>• {t('admin.guidelineSize')}</li>
            <li>• {t('admin.guidelineFormat')}</li>
            <li>• {t('admin.guidelineReadable')}</li>
            <li>• {t('admin.guidelineMaxSize')}</li>
            <li>• {t('admin.guidelineAppear')}</li>
          </ul>
        </div>
      </div>

      {/* Photo Storage Management */}
      <div className="glass-card p-4 sm:p-6 lg:p-8">
        <div className="flex items-center space-x-3 mb-4 sm:mb-6">
          <Database className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 flex-shrink-0" />
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Photo Storage Management</h2>
        </div>
        
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <h3 className="text-base sm:text-lg font-semibold text-purple-900 mb-2">Database Storage Migration</h3>
          <p className="text-purple-800 text-sm sm:text-base mb-4">
            Migrate photos from browser localStorage to the database for better performance and reliability.
            This will move all inspection and facility photos to secure database storage.
          </p>
          
          <button
            onClick={() => setShowPhotoMigration(true)}
            className="bg-purple-600 hover:bg-purple-700 active:bg-purple-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg flex items-center gap-2 transition-colors min-h-[44px] touch-manipulation text-sm sm:text-base"
          >
            <Database className="w-4 h-4 sm:w-5 sm:h-5" />
            Open Photo Migration Tool
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
            <h4 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">Storage Type</h4>
            <p className="text-sm text-gray-600">Database (MongoDB)</p>
            <p className="text-xs text-green-600 mt-1">✓ Recommended</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
            <h4 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">Legacy Storage</h4>
            <p className="text-sm text-gray-600">Browser localStorage</p>
            <p className="text-xs text-orange-600 mt-1">⚠ Limited capacity</p>
          </div>
        </div>
      </div>

      {/* System Information */}
      <div className="glass-card p-4 sm:p-6 lg:p-8">
        <div className="flex items-center space-x-3 mb-4 sm:mb-6">
          <Eye className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 flex-shrink-0" />
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{t('admin.systemInfo')}</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
            <h4 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">{t('admin.portalVersion')}</h4>
            <p className="text-xl sm:text-2xl font-bold text-blue-600">v1.0.0</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
            <h4 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">{t('admin.lastUpdated')}</h4>
            <p className="text-xs sm:text-sm text-gray-600">{new Date().toLocaleDateString()}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4 sm:col-span-2 lg:col-span-1">
            <h4 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">{t('admin.adminUser')}</h4>
            <p className="text-xs sm:text-sm text-gray-600 break-words">{currentUser?.name}</p>
          </div>
        </div>
      </div>

      {/* Photo Migration Modal */}
      {showPhotoMigration && (
        <PhotoMigration onClose={() => setShowPhotoMigration(false)} />
      )}
    </div>
  );
};

export default AdminPanel;
