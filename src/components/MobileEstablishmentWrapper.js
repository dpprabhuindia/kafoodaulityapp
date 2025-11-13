import React, { useState } from 'react';
import { detectDevice } from '../utils/deviceDetection';
import MobileSchoolsList from './MobileSchoolsList';
import MobilePhotoGallery from './MobilePhotoGallery';
import MobileInspectionForm from './MobileInspectionForm';
import EstablishmentManagement from './EstablishmentManagement';
import { X, Save } from 'lucide-react';
import { useI18n } from '../i18n/I18nProvider';

const initialSchools = [
    {
      id: 1,
      name: 'Government High School Bangalore North',
      location: 'Bangalore North, Karnataka',
      phone: '+91 80 2234 5678',
    email: 'ghsblrnorth@karnataka.gov.in',
      rating: 'B+',
      lastInspection: '2024-01-15',
      level: 'State Level',
      status: 'Active',
      licenseNumber: 'KGS-2024-002',
    owner: 'Department of Education',
    category: 'Higher Secondary',
    type: 'Government School',
      violations: 2,
      photos: [
        {
          id: 1,
          url: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNGMEY4RkYiLz48dGV4dCB4PSIxNTAiIHk9IjEwMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzFGMkEzNyIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE2Ij5LaXRjaGVuIEFyZWE8L3RleHQ+PC9zdmc+",
          caption: "Clean kitchen facilities",
          date: "2024-01-15",
          inspector: "Rajesh Kumar",
          inspectionId: "INS_001"
        }
      ]
    },
    {
      id: 2,
      name: 'Government Primary School Mysore',
      location: 'Mysore, Karnataka',
      phone: '+91 821 2345 678',
    email: 'gpsmysore@karnataka.gov.in',
      rating: 'A',
      lastInspection: '2024-01-10',
      level: 'District Level',
      status: 'Active',
      licenseNumber: 'KGS-2024-004',
    owner: 'Department of Education',
    category: 'Primary School',
    type: 'Government School',
      violations: 0,
      photos: []
    },
    {
      id: 3,
      name: 'Government Higher Secondary School Hubli',
      location: 'Hubli, Karnataka',
      phone: '+91 836 2456 789',
    email: 'ghsshubli@karnataka.gov.in',
      rating: 'A',
      lastInspection: '2024-01-08',
      level: 'State Level',
      status: 'Active',
      licenseNumber: 'KGS-2024-003',
    owner: 'Department of Education',
    category: 'Higher Secondary',
    type: 'Government School',
      violations: 0,
      photos: []
    },
  {
    id: 4,
    name: 'Government Primary School Mangalore',
    location: 'Mangalore, Karnataka',
    phone: '+91 824 2567 890',
    email: 'gpsmangalore@karnataka.gov.in',
    rating: 'C',
    lastInspection: '2024-01-20',
    level: 'Taluk Level',
    status: 'Under Review',
    licenseNumber: 'KGS-2024-005',
    owner: 'Department of Education',
    category: 'Primary School',
    type: 'Government School',
    violations: 4,
    photos: []
  }
];

const MobileEstablishmentWrapper = () => {
  const device = detectDevice();
  const [schools, setSchools] = useState(initialSchools);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [showGallery, setShowGallery] = useState(false);
  const [showInspection, setShowInspection] = useState(false);
  const [inspectionSchoolId, setInspectionSchoolId] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [editingSchool, setEditingSchool] = useState(null);

  const handleSchoolSelect = (school) => {
    setSelectedSchool(school);
    setShowGallery(true);
  };

  const handleInspect = (schoolId) => {
    setInspectionSchoolId(schoolId);
    setShowInspection(true);
  };

  const handleNewInspection = () => {
    setInspectionSchoolId(null);
    setShowInspection(true);
  };

  const handleAddSchool = () => {
    setEditingSchool({
      id: null,
      name: '',
      location: '',
      phone: '',
      email: '',
      rating: 'B+',
      lastInspection: '',
      level: 'State Level',
      status: 'Active',
      licenseNumber: '',
      owner: '',
      category: 'Primary School',
      type: 'Government School',
      violations: 0,
      photos: []
    });
    setShowEdit(true);
  };

  const handleViewSchool = (school) => {
    setSelectedSchool(school);
    setShowGallery(true);
  };

  const handleEditSchool = (school) => {
    setEditingSchool({ ...school });
    setShowEdit(true);
  };

  const handleSaveSchool = (updatedSchool) => {
    setSchools(prev => {
      if (updatedSchool.id) {
        return prev.map(s => (s.id === updatedSchool.id ? updatedSchool : s));
      }
      const newId = Math.max(0, ...prev.map(s => s.id)) + 1;
      return [...prev, { ...updatedSchool, id: newId }];
    });
    setShowEdit(false);
    setEditingSchool(null);
  };

  const handleCloseEdit = () => {
    setShowEdit(false);
    setEditingSchool(null);
  };

  const handleCloseGallery = () => {
    setShowGallery(false);
    setSelectedSchool(null);
  };

  const handleCloseInspection = () => {
    setShowInspection(false);
    setInspectionSchoolId(null);
  };

  // Use mobile UI for mobile devices
  if (device.isMobile) {
    if (showInspection) {
      const school = schools.find(s => s.id === inspectionSchoolId);
      return (
        <MobileInspectionForm
          onClose={handleCloseInspection}
          schoolId={inspectionSchoolId}
          schoolName={school?.name}
        />
      );
    }

    if (showGallery && selectedSchool) {
      return (
        <MobilePhotoGallery
          photos={selectedSchool.photos}
          schoolName={selectedSchool.name}
          onClose={handleCloseGallery}
        />
      );
    }

    if (showEdit && editingSchool) {
      return (
        <MobileEditSchool
          school={editingSchool}
          onClose={handleCloseEdit}
          onSave={handleSaveSchool}
        />
      );
    }

    return (
      <MobileSchoolsList
        schools={schools}
        onSchoolSelect={handleSchoolSelect}
        onInspect={handleInspect}
        onNewInspection={handleNewInspection}
        onAddSchool={handleAddSchool}
        onViewSchool={handleViewSchool}
        onEditSchool={handleEditSchool}
      />
    );
  }

  // Use desktop UI for desktop
  return <EstablishmentManagement />;
};

export default MobileEstablishmentWrapper;

const MobileEditSchool = ({ school, onClose, onSave }) => {
  const { t } = useI18n();
  const [formData, setFormData] = useState({
    id: school?.id ?? null,
    name: school?.name ?? '',
    location: school?.location ?? '',
    phone: school?.phone ?? '',
    email: school?.email ?? '',
    rating: school?.rating ?? 'B+',
    lastInspection: school?.lastInspection ?? '',
    level: school?.level ?? 'State Level',
    status: school?.status ?? 'Active',
    licenseNumber: school?.licenseNumber ?? '',
    owner: school?.owner ?? '',
    category: school?.category ?? 'Primary School',
    type: school?.type ?? 'Government School',
    violations: school?.violations ?? 0
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'violations' ? Number(value) : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      <div className="bg-blue-600 text-white px-4 py-3 shadow-md">
        <div className="flex items-center justify-between">
          <h1 className="text-base font-semibold">
            {formData.id ? t('establishments.editTitle') : t('establishments.buttons.addSchool') || 'Add School'}
          </h1>
          <button
            onClick={onClose}
            className="p-2 -mr-2 active:bg-blue-700 rounded transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-gray-50">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              {t('establishments.labels.schoolName')}
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              {t('inspection.location')}
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                {t('establishments.labels.phone')}
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                {t('establishments.labels.email')}
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                {t('establishments.labels.schoolType')}
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-sm"
              >
                <option value="Government School">{t('establishments.schoolTypes.government')}</option>
                <option value="Government Aided School">{t('establishments.schoolTypes.aided')}</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                {t('establishments.labels.category')}
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-sm"
              >
                <option value="Primary School">{t('inspection.categories.primary')}</option>
                <option value="Higher Secondary">{t('inspection.categories.higherSecondary')}</option>
                <option value="High School">{t('inspection.categories.highSchool')}</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                {t('inspection.level')}
              </label>
              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
                className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-sm"
              >
                <option value="State Level">{t('inspection.levels.state')}</option>
                <option value="District Level">{t('inspection.levels.district')}</option>
                <option value="Taluk Level">{t('inspection.levels.taluk')}</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                {t('establishments.labels.status')}
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-sm"
              >
                <option value="Active">Active</option>
                <option value="Under Review">Under Review</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                {t('establishments.labels.ownerDept')}
              </label>
              <input
                type="text"
                name="owner"
                value={formData.owner}
                onChange={handleChange}
                className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                {t('establishments.labels.licenseNumber')}
              </label>
              <input
                type="text"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleChange}
                className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 border border-gray-300 bg-white text-gray-700 py-3 rounded-lg font-medium text-sm active:bg-gray-100"
          >
            {t('common.cancel') || 'Cancel'}
          </button>
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium text-sm flex items-center justify-center gap-2 active:bg-blue-700"
          >
            <Save className="w-5 h-5" />
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};
