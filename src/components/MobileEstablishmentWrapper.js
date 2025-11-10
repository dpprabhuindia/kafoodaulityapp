import React, { useState } from 'react';
import { detectDevice } from '../utils/deviceDetection';
import MobileSchoolsList from './MobileSchoolsList';
import MobilePhotoGallery from './MobilePhotoGallery';
import MobileInspectionForm from './MobileInspectionForm';
import EstablishmentManagement from './EstablishmentManagement';

const MobileEstablishmentWrapper = () => {
  const device = detectDevice();
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [showGallery, setShowGallery] = useState(false);
  const [showInspection, setShowInspection] = useState(false);
  const [inspectionSchoolId, setInspectionSchoolId] = useState(null);

  // Sample schools data
  const schools = [
    {
      id: 1,
      name: 'Government High School Bangalore North',
      location: 'Bangalore North, Karnataka',
      phone: '+91 80 2234 5678',
      rating: 'B+',
      lastInspection: '2024-01-15',
      level: 'State Level',
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
      rating: 'A',
      lastInspection: '2024-01-10',
      level: 'District Level',
      photos: []
    },
    {
      id: 3,
      name: 'Government Higher Secondary School Hubli',
      location: 'Hubli, Karnataka',
      phone: '+91 836 2456 789',
      rating: 'A',
      lastInspection: '2024-01-08',
      level: 'State Level',
      photos: []
    },
    {
      id: 4,
      name: 'Government Primary School Mangalore',
      location: 'Mangalore, Karnataka',
      phone: '+91 824 2567 890',
      rating: 'C',
      lastInspection: '2024-01-20',
      level: 'Taluk Level',
      photos: []
    }
  ];

  const handleSchoolSelect = (school) => {
    setSelectedSchool(school);
    setShowGallery(true);
  };

  const handleInspect = (schoolId) => {
    setInspectionSchoolId(schoolId);
    setShowInspection(true);
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

    return (
      <MobileSchoolsList
        schools={schools}
        onSchoolSelect={handleSchoolSelect}
        onInspect={handleInspect}
      />
    );
  }

  // Use desktop UI for desktop
  return <EstablishmentManagement />;
};

export default MobileEstablishmentWrapper;
