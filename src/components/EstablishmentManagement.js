import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar,
  Store,
  Star,
  CheckCircle,
  AlertTriangle,
  Clock,
  ArrowLeft,
  Camera,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  Image
} from 'lucide-react';
import InspectionForm from './InspectionForm';
import { useI18n } from '../i18n/I18nProvider';
import { getInspectionPhotos, savePhotoToLocal, deletePhoto } from '../utils/photoStorage';

const EstablishmentManagement = () => {
  const { t } = useI18n();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showInspectionForm, setShowInspectionForm] = useState(false);
  const [selectedSchoolForInspection, setSelectedSchoolForInspection] = useState(null);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [editingSchool, setEditingSchool] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [uploadingFacilityPhotos, setUploadingFacilityPhotos] = useState(false);
  const [selectedFacilityType, setSelectedFacilityType] = useState('kitchen');

  const handleEditSchool = (schoolId) => {
    const school = establishments.find(e => e.id === schoolId);
    if (school) {
      setEditingSchool({ ...school });
      setShowEditModal(true);
    }
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingSchool(null);
  };

  const handleSaveSchool = (updatedSchool) => {
    // In a real app, this would make an API call to update the school
    console.log('Saving school:', updatedSchool);
    // For now, we'll just close the modal
    setShowEditModal(false);
    setEditingSchool(null);
    // You could update the local state here if needed
    alert(t('establishments.alerts.updatedSuccess') || 'School information updated successfully!');
  };

  const handleInspectSchool = (schoolId) => {
    // Open inspection form with pre-selected school
    console.log('Starting inspection for school ID:', schoolId);
    setSelectedSchoolForInspection(schoolId);
    setShowInspectionForm(true);
  };

  const handleNewInspection = () => {
    // Open inspection form without pre-selected school
    setSelectedSchoolForInspection(null);
    setShowInspectionForm(true);
  };

  const handleCloseInspectionForm = () => {
    setShowInspectionForm(false);
    setSelectedSchoolForInspection(null);
  };

  const loadInspectionPhotos = (schoolId) => {
    try {
      // Get all inspections for this school from localStorage
      const existingInspections = JSON.parse(localStorage.getItem('inspections') || '[]');
      const schoolInspections = existingInspections.filter(inspection => 
        inspection.schoolId === schoolId || inspection.schoolId === schoolId.toString()
      );
      
      // Collect all photos from all inspections for this school
      const allPhotos = [];
      schoolInspections.forEach(inspection => {
        if (inspection.photos && inspection.photos.length > 0) {
          inspection.photos.forEach(photo => {
            // Get the actual photo data from storage
            const existingPhotos = JSON.parse(localStorage.getItem('inspectionPhotos') || '[]');
            const photoData = existingPhotos.find(p => p.id === photo.id);
            
            if (photoData) {
              allPhotos.push({
                id: photo.id,
                url: photoData.data, // base64 data for display
                caption: `Inspection Photo - ${photo.originalName}`,
                date: inspection.inspectionDate || photo.uploadDate,
                inspector: inspection.inspectorName || 'Unknown Inspector',
                inspectionId: inspection.inspectionId,
                localPath: photo.localPath,
                originalName: photo.originalName,
                size: photo.size
              });
            }
          });
        }
      });
      
      // Also load facility photos
      const existingFacilityPhotos = JSON.parse(localStorage.getItem('facilityPhotos') || '[]');
      const schoolFacilityPhotos = existingFacilityPhotos.filter(photo => 
        photo.schoolId === schoolId || photo.schoolId === schoolId.toString()
      );
      
      schoolFacilityPhotos.forEach(photo => {
        const existingPhotos = JSON.parse(localStorage.getItem('inspectionPhotos') || '[]');
        const photoData = existingPhotos.find(p => p.id === photo.id);
        
        if (photoData) {
          allPhotos.push({
            id: photo.id,
            url: photoData.data,
            caption: `${photo.facilityType.charAt(0).toUpperCase() + photo.facilityType.slice(1)} Facility - ${photo.originalName}`,
            date: photo.uploadDate,
            inspector: 'Facility Manager',
            facilityType: photo.facilityType,
            facilityId: photo.facilityId,
            localPath: photo.localPath,
            originalName: photo.originalName,
            size: photo.size
          });
        }
      });
      
      return allPhotos;
    } catch (error) {
      console.error('Error loading inspection photos:', error);
      return [];
    }
  };

  const handleViewSchool = (schoolId) => {
    const school = establishments.find(e => e.id === schoolId);
    if (school) {
      // Load actual inspection photos from storage
      const inspectionPhotos = loadInspectionPhotos(schoolId);
      
      // Combine static photos with inspection photos
      const allPhotos = [
        ...(school.photos || []), // Keep existing static photos
        ...inspectionPhotos // Add inspection photos
      ];
      
      setSelectedSchool({
        ...school,
        photos: allPhotos
      });
    }
  };

  const handleBackToList = () => {
    setSelectedSchool(null);
    setSelectedPhoto(null);
  };

  const handleFacilityPhotoUpload = async (event) => {
    const files = Array.from(event.target.files);
    
    if (!selectedSchool) {
      alert(t('establishments.alerts.noSchoolSelected') || 'No school selected for photo upload.');
      return;
    }
    
    setUploadingFacilityPhotos(true);
    
    try {
      const facilityId = `FACILITY_${selectedFacilityType.toUpperCase()}_${Date.now()}`;
      
      const photoPromises = files.map(async (file) => {
        try {
          const savedPhoto = await savePhotoToLocal(file, selectedSchool.id, facilityId);
          return {
            id: savedPhoto.id,
            file: file,
            name: savedPhoto.originalName,
            filename: savedPhoto.filename,
            path: savedPhoto.path,
            size: savedPhoto.size,
            preview: savedPhoto.url,
            uploadDate: new Date().toISOString(),
            localPath: `inspectPhotos/school_${selectedSchool.id}/facility_${selectedFacilityType}/${savedPhoto.filename}`,
            facilityType: selectedFacilityType,
            facilityId: facilityId
          };
        } catch (error) {
          console.error('Error uploading facility photo:', file.name, error);
          return null;
        }
      });
      
      const uploadedPhotos = await Promise.all(photoPromises);
      const successfulUploads = uploadedPhotos.filter(photo => photo !== null);
      
      // Update the selected school with new facility photos
      const updatedPhotos = [
        ...(selectedSchool.photos || []),
        ...successfulUploads.map(photo => ({
          ...photo,
          caption: `${selectedFacilityType.charAt(0).toUpperCase() + selectedFacilityType.slice(1)} Facility - ${photo.name}`,
          date: photo.uploadDate,
          inspector: 'Facility Manager',
          facilityType: selectedFacilityType
        }))
      ];
      
      setSelectedSchool({
        ...selectedSchool,
        photos: updatedPhotos
      });
      
      // Save facility photos to localStorage
      const existingFacilityPhotos = JSON.parse(localStorage.getItem('facilityPhotos') || '[]');
      const facilityPhotoData = successfulUploads.map(photo => ({
        ...photo,
        schoolId: selectedSchool.id,
        facilityType: selectedFacilityType,
        uploadDate: new Date().toISOString()
      }));
      
      localStorage.setItem('facilityPhotos', JSON.stringify([...existingFacilityPhotos, ...facilityPhotoData]));
      
      if (successfulUploads.length < files.length) {
        alert(`${files.length - successfulUploads.length} photos failed to upload. Please try again.`);
      } else {
        alert(`Successfully uploaded ${successfulUploads.length} ${selectedFacilityType} facility photos!`);
      }
      
    } catch (error) {
      console.error('Error during facility photo upload:', error);
      alert('Error uploading facility photos. Please try again.');
    } finally {
      setUploadingFacilityPhotos(false);
    }
  };

  const establishments = [
    {
      id: 1,
      name: 'Government High School Bangalore North',
      type: 'Government School',
      owner: 'Karnataka Education Department',
      location: 'Bangalore North, Karnataka',
      phone: '+91 80 2234 5678',
      email: 'ghsblrnorth@karnataka.gov.in',
      licenseNumber: 'KGS-2024-001',
      rating: 'B+',
      status: 'Active',
      lastInspection: '2024-01-15',
      nextInspection: '2024-04-15',
      violations: 2,
      category: 'Higher Secondary',
      level: 'State Level',
      photos: [
        {
          id: 1,
          url: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNGMEY4RkYiLz4KICA8cmVjdCB4PSIyMCIgeT0iMTQwIiB3aWR0aD0iMjYwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRDZFQUY4IiByeD0iNSIvPgogIDxjaXJjbGUgY3g9IjgwIiBjeT0iMTIwIiByPSIyMCIgZmlsbD0iIzYzNzVGNCIvPgogIDx0ZXh0IHg9IjE1MCIgeT0iMzAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiMxRjJBMzciIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZm9udC13ZWlnaHQ9ImJvbGQiPktpdGNoZW4gQXJlYTwvdGV4dD4KPC9zdmc+",
          caption: "Clean kitchen facilities",
          date: "2024-01-15",
          inspector: "Rajesh Kumar"
        },
        {
          id: 2,
          url: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNGRUY3RUQiLz4KICA8ZWxsaXBzZSBjeD0iMTUwIiBjeT0iMTMwIiByeD0iODAiIHJ5PSI0MCIgZmlsbD0iI0ZGRkZGRiIgc3Ryb2tlPSIjRDFEOEUwIiBzdHJva2Utd2lkdGg9IjIiLz4KICA8dGV4dCB4PSIxNTAiIHk9IjMwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjMUYyQTM3IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZvbnQtd2VpZ2h0PSJib2xkIj5EaW5pbmcgQXJlYTwvdGV4dD4KPC9zdmc+",
          caption: "Student dining area",
          date: "2024-01-15",
          inspector: "Rajesh Kumar"
        }
      ]
    },
    {
      id: 2,
      name: 'Government Primary School Mysore',
      type: 'Government School',
      owner: 'Karnataka Education Department',
      location: 'Mysore, Karnataka',
      phone: '+91 821 2345 678',
      email: 'gpsmysore@karnataka.gov.in',
      licenseNumber: 'KGS-2024-002',
      rating: 'A',
      status: 'Active',
      lastInspection: '2024-01-10',
      nextInspection: '2024-04-10',
      violations: 0,
      category: 'Primary School',
      level: 'District Level',
      photos: [
        {
          id: 3,
          url: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNGRkY3RUQiLz4KICA8cmVjdCB4PSIyMCIgeT0iNjAiIHdpZHRoPSIyNjAiIGhlaWdodD0iMTUiIGZpbGw9IiM4QjVDRjYiLz4KICA8dGV4dCB4PSIxNTAiIHk9IjMwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjMUYyQTM3IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZvbnQtd2VpZ2h0PSJib2xkIj5TdG9yYWdlIEFyZWE8L3RleHQ+Cjwvc3ZnPg==",
          caption: "Food storage facilities",
          date: "2024-01-10",
          inspector: "Priya Sharma"
        }
      ]
    },
    {
      id: 3,
      name: 'Government Higher Secondary School Hubli',
      type: 'Government School',
      owner: 'Karnataka Education Department',
      location: 'Hubli, Karnataka',
      phone: '+91 836 2456 789',
      email: 'ghsshubli@karnataka.gov.in',
      licenseNumber: 'KGS-2024-003',
      rating: 'A',
      status: 'Active',
      lastInspection: '2024-01-08',
      nextInspection: '2024-04-08',
      violations: 0,
      category: 'Higher Secondary',
      level: 'State Level'
    },
    {
      id: 4,
      name: 'Government Primary School Mangalore',
      type: 'Government School',
      owner: 'Karnataka Education Department',
      location: 'Mangalore, Karnataka',
      phone: '+91 824 2567 890',
      email: 'gpsmangalore@karnataka.gov.in',
      licenseNumber: 'KGS-2024-004',
      rating: 'C',
      status: 'Under Review',
      lastInspection: '2024-01-20',
      nextInspection: '2024-02-20',
      violations: 4,
      category: 'Primary School',
      level: 'Taluk Level'
    }
  ];

  const filteredEstablishments = establishments.filter(establishment => {
    const matchesSearch = establishment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         establishment.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         establishment.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || establishment.status.toLowerCase() === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const getRatingColor = (rating) => {
    switch (rating) {
      case 'A': return 'bg-green-100 text-green-800';
      case 'B+': case 'B': return 'bg-yellow-100 text-yellow-800';
      case 'C': case 'D': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'badge-success';
      case 'Under Review': return 'badge-warning';
      case 'Suspended': return 'badge-danger';
      default: return 'badge-info';
    }
  };

  // Edit School Modal Component
  const EditSchoolModal = ({ school, onClose, onSave }) => {
    const [formData, setFormData] = useState({
      name: school?.name || '',
      type: school?.type || '',
      owner: school?.owner || '',
      location: school?.location || '',
      phone: school?.phone || '',
      email: school?.email || '',
      licenseNumber: school?.licenseNumber || '',
      category: school?.category || '',
      status: school?.status || 'Active'
    });

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave({ ...school, ...formData });
    };

    if (!school) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">{t('establishments.editTitle')}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('establishments.labels.schoolName')}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('establishments.labels.schoolType')}
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Government School">{t('establishments.schoolTypes.government')}</option>
                  <option value="Government Aided School">{t('establishments.schoolTypes.aided')}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('establishments.labels.category')}
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Primary School">Primary School</option>
                  <option value="Higher Secondary">Higher Secondary</option>
                  <option value="High School">High School</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('establishments.labels.level')}
                </label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="State Level">State Level</option>
                  <option value="District Level">District Level</option>
                  <option value="Taluk Level">Taluk Level</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('establishments.labels.status')}
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Active">Active</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('establishments.labels.ownerDept')}
                </label>
                <input
                  type="text"
                  name="owner"
                  value={formData.owner}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('establishments.labels.location')}
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('establishments.labels.phone')}
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('establishments.labels.email')}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('establishments.labels.licenseNumber')}
                </label>
                <input
                  type="text"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              >
                {t('establishments.buttons.cancel')}
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                {t('establishments.buttons.saveChanges')}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Photo Modal Component
  const PhotoModal = ({ photo, onClose, onNext, onPrev, hasNext, hasPrev }) => {
    if (!photo) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300"
          aria-label="Close"
        >
          <X size={32} />
        </button>
        
        {hasPrev && (
          <button
            onClick={onPrev}
            className="absolute left-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
            aria-label="Previous photo"
          >
            <ChevronLeft size={32} />
          </button>
        )}
        
        <div className="relative max-w-4xl w-full">
          <img
            src={photo.url}
            alt={photo.caption || t('establishments.gallery.title')}
            className="max-h-[80vh] w-auto mx-auto object-contain rounded-lg"
          />
          <div className="mt-4 text-white text-center">
            <div className="flex items-center justify-center mb-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                photo.inspectionId 
                  ? 'bg-blue-600 text-white' 
                  : photo.facilityType
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-600 text-white'
              }`}>
                {photo.inspectionId 
                  ? `${t('establishments.gallery.badgeInspection')} ${t('establishments.gallery.inspectionPhotos')}` 
                  : photo.facilityType 
                  ? `${photo.facilityType === 'kitchen' ? '🍳' : photo.facilityType === 'storeroom' ? '📦' : '🏢'} ${t('establishments.gallery.facilityPhotos')}`
                  : `${t('establishments.gallery.badgeArchive')} ${t('establishments.gallery.archivePhotos')}`}
              </span>
            </div>
            <h3 className="text-xl font-semibold mb-2">{photo.caption}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="text-left">
                <p className="text-gray-300">
                  <span className="font-medium">{t('establishments.photoModal.inspector')}</span> {photo.inspector || 'Unknown'}
                </p>
                <p className="text-gray-300">
                  <span className="font-medium">{t('establishments.photoModal.date')}</span> {new Date(photo.date).toLocaleDateString()}
                </p>
                {photo.originalName && (
                  <p className="text-gray-300">
                    <span className="font-medium">{t('establishments.photoModal.originalName')}</span> {photo.originalName}
                  </p>
                )}
              </div>
              <div className="text-left">
                {photo.size && (
                  <p className="text-gray-300">
                    <span className="font-medium">{t('establishments.photoModal.fileSize')}</span> {Math.round(photo.size / 1024)} KB
                  </p>
                )}
                {photo.inspectionId && (
                  <p className="text-gray-300">
                    <span className="font-medium">{t('establishments.photoModal.inspectionId')}</span> {photo.inspectionId}
                  </p>
                )}
                {photo.localPath && (
                  <p className="text-gray-300 truncate">
                    <span className="font-medium">{t('establishments.photoModal.localPath')}</span> {photo.localPath}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {hasNext && (
          <button
            onClick={onNext}
            className="absolute right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
            aria-label={t('establishments.photoModal.ariaNext')}
          >
            <ChevronRight size={32} />
          </button>
        )}
      </div>
    );
  };

  // If a school is selected, show school detail view
  if (selectedSchool) {
    return (
      <div className="space-y-8">
        {/* Header with Back Button */}
        <div className="glass-card p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToList}
                className="bg-gray-600 hover:bg-gray-700 text-white p-2 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-white">{selectedSchool.name}</h1>
                <p className="text-gray-300">{selectedSchool.location}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded text-sm font-bold ${getRatingColor(selectedSchool.rating)}`}>
                {selectedSchool.rating}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedSchool.status)}`}>
                {selectedSchool.status}
              </span>
            </div>
          </div>
        </div>

        {/* School Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* School Information */}
          <div className="lg:col-span-1">
            <div className="glass-card p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">{t('establishments.infoPanel.title')}</h2>
              <div className="space-y-4">
                <div className="flex items-center text-sm">
                  <Store className="w-4 h-4 mr-3 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">{selectedSchool.type}</p>
                    <p className="text-gray-600">{selectedSchool.category}</p>
                    {selectedSchool.level && (
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium ${
                        selectedSchool.level === 'State Level' ? 'bg-purple-100 text-purple-800' :
                        selectedSchool.level === 'District Level' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {selectedSchool.level}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center text-sm">
                  <MapPin className="w-4 h-4 mr-3 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">{t('establishments.infoPanel.location')}</p>
                    <p className="text-gray-600">{selectedSchool.location}</p>
                  </div>
                </div>
                <div className="flex items-center text-sm">
                  <Phone className="w-4 h-4 mr-3 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">{t('establishments.infoPanel.phone')}</p>
                    <p className="text-gray-600">{selectedSchool.phone}</p>
                  </div>
                </div>
                <div className="flex items-center text-sm">
                  <Mail className="w-4 h-4 mr-3 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">{t('establishments.infoPanel.email')}</p>
                    <p className="text-gray-600">{selectedSchool.email}</p>
                  </div>
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="w-4 h-4 mr-3 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">{t('establishments.infoPanel.lastInspection')}</p>
                    <p className="text-gray-600">{selectedSchool.lastInspection}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Facility Photo Upload */}
            <div className="glass-card p-6 mt-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">{t('establishments.facility.uploadTitle')}</h2>
              
              {/* Facility Type Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('establishments.facility.typeLabel')}
                </label>
                <select
                  value={selectedFacilityType}
                  onChange={(e) => setSelectedFacilityType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="kitchen">{t('establishments.facility.types.kitchen')}</option>
                  <option value="storeroom">{t('establishments.facility.types.storeroom')}</option>
                  <option value="dining">{t('establishments.facility.types.dining')}</option>
                  <option value="washroom">{t('establishments.facility.types.washroom')}</option>
                  <option value="playground">{t('establishments.facility.types.playground')}</option>
                  <option value="classroom">{t('establishments.facility.types.classroom')}</option>
                </select>
              </div>

              {/* Photo Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">
                  {t('establishments.facility.uploadTitle')}
                </p>
                <p className="text-xs text-gray-500 mb-4">
                  {t('establishments.facility.storedInPrefix')} inspectPhotos/school_{selectedSchool.id}/facility_{selectedFacilityType}/
                </p>
                <input
                  type="file"
                  id="facility-photo-upload"
                  multiple
                  accept="image/*"
                  onChange={handleFacilityPhotoUpload}
                  className="hidden"
                  disabled={uploadingFacilityPhotos}
                />
                <button 
                  type="button"
                  onClick={() => document.getElementById('facility-photo-upload').click()}
                  disabled={uploadingFacilityPhotos}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    uploadingFacilityPhotos 
                      ? 'bg-gray-400 cursor-not-allowed text-white' 
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {uploadingFacilityPhotos ? t('inspection.uploading') : t('establishments.facility.uploadTitle')}
                </button>
              </div>

              {/* Facility Photo Statistics */}
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="bg-green-50 p-3 rounded-lg text-center">
                  <p className="text-lg font-bold text-green-600">
                    {selectedSchool.photos?.filter(p => p.facilityType === 'kitchen').length || 0}
                  </p>
                  <p className="text-xs text-green-600">{t('establishments.gallery.kitchenPhotos')}</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg text-center">
                  <p className="text-lg font-bold text-blue-600">
                    {selectedSchool.photos?.filter(p => p.facilityType === 'storeroom').length || 0}
                  </p>
                  <p className="text-xs text-blue-600">{t('establishments.gallery.storeroomPhotos')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Photo Gallery */}
          <div className="lg:col-span-2">
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">{t('establishments.gallery.title')}</h2>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Camera className="w-4 h-4" />
                  <span>{selectedSchool.photos?.length || 0} {t('establishments.gallery.photosSuffix')}</span>
                </div>
              </div>
              
              {selectedSchool.photos && selectedSchool.photos.length > 0 ? (
                <div className="space-y-6">
                  {/* Photo Statistics */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                    <div className="bg-blue-50 p-3 rounded-lg text-center">
                      <p className="text-2xl font-bold text-blue-600">
                        {selectedSchool.photos.filter(p => p.inspectionId).length}
                      </p>
                      <p className="text-xs text-blue-600">{t('establishments.gallery.inspectionPhotos')}</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg text-center">
                      <p className="text-2xl font-bold text-green-600">
                        {selectedSchool.photos.filter(p => p.facilityType).length}
                      </p>
                      <p className="text-xs text-green-600">{t('establishments.gallery.facilityPhotos')}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                      <p className="text-2xl font-bold text-gray-600">
                        {selectedSchool.photos.filter(p => !p.inspectionId && !p.facilityType).length}
                      </p>
                      <p className="text-xs text-gray-600">{t('establishments.gallery.archivePhotos')}</p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg text-center">
                      <p className="text-2xl font-bold text-purple-600">
                        {new Set(selectedSchool.photos.filter(p => p.inspector).map(p => p.inspector)).size}
                      </p>
                      <p className="text-xs text-purple-600">{t('establishments.gallery.inspectors')}</p>
                    </div>
                    <div className="bg-orange-50 p-3 rounded-lg text-center">
                      <p className="text-2xl font-bold text-orange-600">
                        {Math.round(selectedSchool.photos.reduce((sum, p) => sum + (p.size || 0), 0) / 1024)}
                      </p>
                      <p className="text-xs text-orange-600">{t('establishments.gallery.totalKb')}</p>
                    </div>
                  </div>

                  {/* Photo Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectedSchool.photos.map((photo, index) => (
                      <div 
                        key={photo.id || index} 
                        className="relative group cursor-pointer bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200"
                        onClick={() => setSelectedPhoto(photo)}
                      >
                        {/* Photo Type Badge */}
                        <div className="absolute top-2 left-2 z-10">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            photo.inspectionId 
                              ? 'bg-blue-100 text-blue-800' 
                              : photo.facilityType
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {photo.inspectionId 
                              ? '🔍 Inspection' 
                              : photo.facilityType 
                              ? `${photo.facilityType === 'kitchen' ? '🍳' : photo.facilityType === 'storeroom' ? '📦' : '🏢'} ${photo.facilityType.charAt(0).toUpperCase() + photo.facilityType.slice(1)}`
                              : '📁 Archive'}
                          </span>
                        </div>

                        <img
                          src={photo.url}
                          alt={photo.caption}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                        
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                          <Eye className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                        </div>
                        
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
                          <p className="text-white text-sm font-medium truncate">{photo.caption}</p>
                          <div className="flex items-center justify-between text-xs text-gray-300 mt-1">
                            <span>{new Date(photo.date).toLocaleDateString()}</span>
                            {photo.size && (
                              <span>{Math.round(photo.size / 1024)} KB</span>
                            )}
                          </div>
                          {photo.inspector && (
                            <p className="text-xs text-gray-400 truncate">By: {photo.inspector}</p>
                          )}
                        </div>

                        {/* Local Path Info */}
                        {photo.localPath && (
                          <div className="absolute top-2 right-2 z-10">
                            <div className="bg-black bg-opacity-70 text-white p-1 rounded text-xs" title={photo.localPath}>
                              📁
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Image className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No inspection photos available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Photo Modal */}
        {selectedPhoto && (
          <PhotoModal
            photo={selectedPhoto}
            onClose={() => setSelectedPhoto(null)}
            onNext={() => {
              const currentIndex = selectedSchool.photos.findIndex(p => p.id === selectedPhoto.id);
              if (currentIndex < selectedSchool.photos.length - 1) {
                setSelectedPhoto(selectedSchool.photos[currentIndex + 1]);
              }
            }}
            onPrev={() => {
              const currentIndex = selectedSchool.photos.findIndex(p => p.id === selectedPhoto.id);
              if (currentIndex > 0) {
                setSelectedPhoto(selectedSchool.photos[currentIndex - 1]);
              }
            }}
            hasNext={selectedSchool.photos.findIndex(p => p.id === selectedPhoto.id) < selectedSchool.photos.length - 1}
            hasPrev={selectedSchool.photos.findIndex(p => p.id === selectedPhoto.id) > 0}
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-card p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Karnataka Government School Management</h1>
          <div className="flex gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add School
            </button>
            <button
              onClick={handleNewInspection}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Calendar className="w-5 h-5" />
              New Inspection
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="glass-card p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={t('establishments.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              className="input"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">{t('establishments.filters.allStatus')}</option>
              <option value="active">{t('establishments.filters.active')}</option>
              <option value="under review">{t('establishments.filters.underReview')}</option>
              <option value="suspended">{t('establishments.filters.suspended')}</option>
            </select>
            <button className="btn-secondary flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <span>{t('establishments.actions.moreFilters')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Establishments Grid grouped by Level */}
      <div className="space-y-6">
        {['State Level','District Level','Taluk Level'].map(level => {
          const label = level === 'State Level' ? t('inspection.levels.state')
                        : level === 'District Level' ? t('inspection.levels.district')
                        : t('inspection.levels.taluk');
          const ratingOrder = { 'A': 1, 'B+': 2, 'B': 3, 'C': 4, 'D': 5 };
          const items = filteredEstablishments
            .filter(e => e.level === level)
            .sort((a, b) => {
              const ra = ratingOrder[a.rating] || 99;
              const rb = ratingOrder[b.rating] || 99;
              if (ra !== rb) return ra - rb;
              return a.name.localeCompare(b.name);
            });
          if (items.length === 0) return null;
          return (
            <div key={level} className="space-y-3">
              <div className="text-sm font-semibold text-gray-200 uppercase tracking-wide px-1">{label}</div>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {items.map((establishment) => (
                  <div key={establishment.id} className="glass-card p-6 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                          <Store className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">{establishment.name}</h3>
                          <p className="text-sm text-gray-600">{establishment.type}</p>
                          {establishment.level && (
                            <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium ${
                              establishment.level === 'State Level' ? 'bg-purple-100 text-purple-800' :
                              establishment.level === 'District Level' ? 'bg-blue-100 text-blue-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {label}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${getRatingColor(establishment.rating)}`}>
                          {establishment.rating}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(establishment.status)}`}>
                          {establishment.status}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        {establishment.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="w-4 h-4 mr-2" />
                        {establishment.phone}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="w-4 h-4 mr-2" />
                        {establishment.email}
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-600">{t('establishments.card.license')}</span>
                        <span className="font-medium">{establishment.licenseNumber}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-600">{t('establishments.card.lastInspection')}</span>
                        <span className="font-medium">{establishment.lastInspection}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm mb-4">
                        <span className="text-gray-600">{t('establishments.card.violations')}</span>
                        <span className={`font-medium ${establishment.violations > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {establishment.violations}
                        </span>
                      </div>

                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleViewSchool(establishment.id)}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm py-2 px-3 rounded-lg flex items-center justify-center transition-colors"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          {t('common.view')}
                        </button>
                        <button 
                          onClick={() => handleEditSchool(establishment.id)}
                          className="flex-1 btn-secondary text-sm py-2 hover:bg-blue-50 transition-colors"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          {t('common.edit')}
                        </button>
                        <button 
                          onClick={() => handleInspectSchool(establishment.id)}
                          className="flex-1 btn-primary text-sm py-2 hover:bg-blue-700 transition-colors"
                        >
                          <Calendar className="w-4 h-4 mr-1" />
                          {t('schools.inspect')}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        {filteredEstablishments.length === 0 && (
          <div className="text-center py-12 text-gray-300">{t('schools.noneFound')}</div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card p-6 text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Store className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{establishments.length}</h3>
          <p className="text-gray-600">{t('establishments.stats.total')}</p>
        </div>
        
        <div className="glass-card p-6 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {establishments.filter(e => e.status === 'Active').length}
          </h3>
          <p className="text-gray-600">{t('establishments.stats.active')}</p>
        </div>
        
        <div className="glass-card p-6 text-center">
          <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Clock className="w-6 h-6 text-yellow-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {establishments.filter(e => e.status === 'Under Review').length}
          </h3>
          <p className="text-gray-600">{t('establishments.stats.underReview')}</p>
        </div>
        
        <div className="glass-card p-6 text-center">
          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {establishments.reduce((sum, e) => sum + e.violations, 0)}
          </h3>
          <p className="text-gray-600">{t('establishments.stats.totalViolations')}</p>
        </div>
      </div>

      {/* Inspection Form Modal */}
      {showInspectionForm && (
        <InspectionForm
          onClose={handleCloseInspectionForm}
          preSelectedSchoolId={selectedSchoolForInspection}
          isModal={true}
        />
      )}

      {/* Edit School Modal */}
      {showEditModal && editingSchool && (
        <EditSchoolModal
          school={editingSchool}
          onClose={handleCloseEditModal}
          onSave={handleSaveSchool}
        />
      )}
    </div>
  );
};

export default EstablishmentManagement;
