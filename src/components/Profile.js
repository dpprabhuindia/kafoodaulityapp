import React, { useState, useEffect } from 'react';
import { Camera, User, Mail, Phone, MapPin, Calendar, Badge, Save, Upload, X } from 'lucide-react';
import { useI18n } from '../i18n/I18nProvider';

const Profile = () => {
  const { t } = useI18n();
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    employeeId: '',
    designation: '',
    department: 'Social Welfare Department',
    district: '',
    joiningDate: '',
    address: '',
    profilePhoto: null,
    photoPreview: null
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load current user data
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    setProfileData(prev => ({
      ...prev,
      name: currentUser.name || currentUser.username || '',
      email: currentUser.email || '',
      designation: currentUser.role || '',
      employeeId: currentUser.employeeId || '',
      phone: currentUser.phone || '',
      district: currentUser.district || '',
      joiningDate: currentUser.joiningDate || '',
      address: currentUser.address || '',
      photoPreview: currentUser.profilePhoto || null
    }));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert(t('profile.photoSizeError'));
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileData(prev => ({
          ...prev,
          profilePhoto: file,
          photoPreview: event.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setProfileData(prev => ({
      ...prev,
      profilePhoto: null,
      photoPreview: null
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Update localStorage with new profile data
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      const updatedUser = {
        ...currentUser,
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
        employeeId: profileData.employeeId,
        designation: profileData.designation,
        district: profileData.district,
        joiningDate: profileData.joiningDate,
        address: profileData.address,
        profilePhoto: profileData.photoPreview
      };
      
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      // Here you would typically make an API call to update the profile
      // await api.updateProfile(profileData);
      
      setIsEditing(false);
      alert(t('profile.successUpdate'));
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(t('profile.errorUpdate'));
    } finally {
      setLoading(false);
    }
  };

  const districts = [
    'Bengaluru Urban', 'Bengaluru Rural', 'Mysuru', 'Tumakuru', 'Mandya', 'Ramanagara',
    'Kolar', 'Chikkaballapur', 'Hassan', 'Kodagu', 'Chamarajanagar', 'Chikkamagaluru',
    'Dakshina Kannada', 'Udupi', 'Uttara Kannada', 'Shivamogga', 'Davanagere',
    'Chitradurga', 'Ballari', 'Koppal', 'Raichur', 'Kalaburagi', 'Bidar', 'Yadgir',
    'Vijayapura', 'Bagalkot', 'Belagavi', 'Haveri', 'Dharwad', 'Gadag'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('profile.title')}</h1>
            <p className="text-gray-600">{t('profile.subtitle')}</p>
          </div>
          <div className="flex space-x-3">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="btn-primary"
              >
                <User className="w-4 h-4 mr-2" />
                {t('profile.editProfile')}
              </button>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  {t('profile.cancel')}
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="btn-primary"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? t('profile.saving') : t('profile.saveChanges')}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Photo Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('profile.profilePhoto')}</h2>
            
            <div className="flex flex-col items-center">
              <div className="relative">
                {profileData.photoPreview ? (
                  <div className="relative">
                    <img
                      src={profileData.photoPreview}
                      alt="Profile"
                      className="w-32 h-32 rounded-full object-cover border-4 border-primary-200"
                    />
                    {isEditing && (
                      <button
                        onClick={removePhoto}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-gray-300">
                    <User className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-primary-600 text-white rounded-full p-2 cursor-pointer hover:bg-primary-700 transition-colors">
                    <Camera className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              
              <div className="mt-4 text-center">
                <h3 className="text-lg font-semibold text-gray-900">{profileData.name || 'Officer Name'}</h3>
                <p className="text-sm text-gray-600">{profileData.designation}</p>
                <p className="text-sm text-gray-500">{profileData.employeeId}</p>
              </div>
              
              {isEditing && (
                <div className="mt-4 text-center">
                  <label className="btn-secondary cursor-pointer">
                    <Upload className="w-4 h-4 mr-2" />
                    {t('profile.uploadPhoto')}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-2">{t('profile.maxSize')}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile Details Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('profile.personalInfo')}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-1" />
                  {t('profile.fullName')}
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder={t('profile.placeholderName')}
                  />
                ) : (
                  <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">{profileData.name || t('profile.notProvided')}</p>
                )}
              </div>

              {/* Employee ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Badge className="w-4 h-4 inline mr-1" />
                  {t('profile.employeeId')}
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="employeeId"
                    value={profileData.employeeId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder={t('profile.placeholderEmployeeId')}
                  />
                ) : (
                  <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">{profileData.employeeId || t('profile.notProvided')}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-1" />
                  {t('profile.email')}
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder={t('profile.placeholderEmail')}
                  />
                ) : (
                  <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">{profileData.email || t('profile.notProvided')}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-1" />
                  {t('profile.phone')}
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder={t('profile.placeholderPhone')}
                  />
                ) : (
                  <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">{profileData.phone || t('profile.notProvided')}</p>
                )}
              </div>

              {/* Designation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Badge className="w-4 h-4 inline mr-1" />
                  {t('profile.designation')}
                </label>
                {isEditing ? (
                  <select
                    name="designation"
                    value={profileData.designation}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">{t('profile.selectDesignation')}</option>
                    <option value="Food Safety Inspector">{t('profile.designations.inspector')}</option>
                    <option value="Assistant Food Safety Officer">{t('profile.designations.assistantOfficer')}</option>
                    <option value="Food Safety Officer">{t('profile.designations.officer')}</option>
                    <option value="District Food Safety Officer">{t('profile.designations.districtOfficer')}</option>
                    <option value="Joint Director">{t('profile.designations.jointDirector')}</option>
                    <option value="Deputy Director">{t('profile.designations.deputyDirector')}</option>
                    <option value="Director">{t('profile.designations.director')}</option>
                  </select>
                ) : (
                  <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">{profileData.designation || t('profile.notProvided')}</p>
                )}
              </div>

              {/* District */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  {t('profile.district')}
                </label>
                {isEditing ? (
                  <select
                    name="district"
                    value={profileData.district}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">{t('profile.selectDistrict')}</option>
                    {districts.map(district => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                  </select>
                ) : (
                  <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">{profileData.district || t('profile.notProvided')}</p>
                )}
              </div>

              {/* Department */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Badge className="w-4 h-4 inline mr-1" />
                  {t('profile.department')}
                </label>
                <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">{profileData.department}</p>
              </div>

              {/* Joining Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  {t('profile.joiningDate')}
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    name="joiningDate"
                    value={profileData.joiningDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                ) : (
                  <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                    {profileData.joiningDate ? new Date(profileData.joiningDate).toLocaleDateString() : t('profile.notProvided')}
                  </p>
                )}
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  {t('profile.address')}
                </label>
                {isEditing ? (
                  <textarea
                    name="address"
                    value={profileData.address}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder={t('profile.placeholderAddress')}
                  />
                ) : (
                  <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">{profileData.address || t('profile.notProvided')}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
