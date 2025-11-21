import React, { useCallback, useEffect, useState, useRef } from "react";
import { detectDevice } from "../utils/deviceDetection";
import MobileSchoolsList from "./MobileSchoolsList";
import MobileInspectionForm from "./MobileInspectionForm";
import EstablishmentManagement from "./EstablishmentManagement";
import MobileSchoolDetails from "./MobileSchoolDetails";
import { X, Save } from "lucide-react";
import { useI18n } from "../i18n/I18nProvider";
import ApiService from "../services/api";

const initialSchools = [
  {
    id: 1,
    legacyId: 1,
    name: "Government High School Bangalore North",
    location: "Bangalore North, Karnataka",
    phone: "+91 80 2234 5678",
    email: "ghsblrnorth@karnataka.gov.in",
    rating: "B+",
    lastInspection: "2024-01-15",
    level: "State Level",
    status: "Active",
    licenseNumber: "KGS-2024-001",
    owner: "Karnataka Education Department",
    category: "Higher Secondary",
    type: "Government School",
    violations: 2,
    photos: [
      {
        id: 1,
        url: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNGMEY4RkYiLz4KICA8cmVjdCB4PSIyMCIgeT0iMTQwIiB3aWR0aD0iMjYwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRDZFQUY4IiByeD0iNSIvPgogIDxjaXJjbGUgY3g9IjgwIiBjeT0iMTIwIiByPSIyMCIgZmlsbD0iIzYzNzVGNCIvPgogIDx0ZXh0IHg9IjE1MCIgeT0iMzAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiMxRjJBMzciIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZm9udC13ZWlnaHQ9ImJvbGQiPktpdGNoZW4gQXJlYTwvdGV4dD4KPC9zdmc+",
        caption: "Clean kitchen facilities",
        date: "2024-01-15",
        inspector: "Rajesh Kumar",
      },
      {
        id: 2,
        url: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNGRUY3RUQiLz4KICA8ZWxsaXBzZSBjeD0iMTUwIiBjeT0iMTMwIiByeD0iODAiIHJ5PSI0MCIgZmlsbD0iI0ZGRkZGRiIgc3Ryb2tlPSIjRDFEOEUwIiBzdHJva2Utd2lkdGg9IjIiLz4KICA8dGV4dCB4PSIxNTAiIHk9IjMwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjMUYyQTM3IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZvbnQtd2VpZ2h0PSJib2xkIj5EaW5pbmcgQXJlYTwvdGV4dD4KPC9zdmc+",
        caption: "Student dining area",
        date: "2024-01-15",
        inspector: "Rajesh Kumar",
      },
    ],
  },
  {
    id: 2,
    legacyId: 2,
    name: "Government Primary School Mysore",
    location: "Mysore, Karnataka",
    phone: "+91 821 2345 678",
    email: "gpsmysore@karnataka.gov.in",
    rating: "A",
    lastInspection: "2024-01-10",
    level: "District Level",
    status: "Active",
    licenseNumber: "KGS-2024-002",
    owner: "Karnataka Education Department",
    category: "Primary School",
    type: "Government School",
    violations: 0,
    photos: [
      {
        id: 3,
        url: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNGRkY3RUQiLz4KICA8cmVjdCB4PSIyMCIgeT0iNjAiIHdpZHRoPSIyNjAiIGhlaWdodD0iMTUiIGZpbGw9IiM4QjVDRjYiLz4KICA8dGV4dCB4PSIxNTAiIHk9IjMwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjMUYyQTM3IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZvbnQtd2VpZ2h0PSJib2xkIj5Gb29kIHN0b3JhZ2UgYXJlYTwvdGV4dD4KPC9zdmc+",
        caption: "Food storage facilities",
        date: "2024-01-10",
        inspector: "Priya Sharma",
      },
    ],
  },
  {
    id: 3,
    legacyId: 3,
    name: "Government Higher Secondary School Hubli",
    location: "Hubli, Karnataka",
    phone: "+91 836 2456 789",
    email: "ghsshubli@karnataka.gov.in",
    rating: "A",
    lastInspection: "2024-01-08",
    level: "State Level",
    status: "Active",
    licenseNumber: "KGS-2024-003",
    owner: "Karnataka Education Department",
    category: "Higher Secondary",
    type: "Government School",
    violations: 0,
    photos: [],
  },
  {
    id: 4,
    legacyId: 4,
    name: "Government Primary School Mangalore",
    location: "Mangalore, Karnataka",
    phone: "+91 824 2567 890",
    email: "gpsmangalore@karnataka.gov.in",
    rating: "C",
    lastInspection: "2024-01-20",
    level: "Taluk Level",
    status: "Under Review",
    licenseNumber: "KGS-2024-004",
    owner: "Karnataka Education Department",
    category: "Primary School",
    type: "Government School",
    violations: 4,
    photos: [],
  },
];

const normalizePhotoList = (photos = [], schoolId) =>
  photos.map((photo, index) => ({
    id: photo._id || photo.id || `${schoolId}-photo-${index}`,
    url: photo.url || photo.path || "",
    caption: photo.caption || photo.originalName || "Photo",
    date: photo.uploadDate || photo.date,
    inspector: photo.inspector,
    facilityType: photo.facilityType,
    inspectionId: photo.inspectionId,
    size: photo.size,
  }));

const mapSchoolFromApi = (school) => {
  if (!school) return null;

  const id = school._id || school.id;
  const formatDate = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }
    return date.toISOString().split("T")[0];
  };

  return {
    id,
    legacyId: school.legacyId,
    name: school.name,
    location: school.location,
    phone: school.phone,
    email: school.email,
    rating: school.rating || "A",
    lastInspection: formatDate(school.lastInspection),
    level: school.level || "State Level",
    status: school.status || "Active",
    licenseNumber: school.licenseNumber || "",
    owner: school.owner || "Karnataka Education Department",
    category: school.category || "Primary School",
    type: school.type || "Government School",
    violations: typeof school.violations === "number" ? school.violations : 0,
    photos: normalizePhotoList(school.photos || [], id),
  };
};

const normalizeSchoolList = (schools = []) =>
  schools.map(mapSchoolFromApi).filter((school) => school !== null);

const MobileEstablishmentWrapper = () => {
  const device = detectDevice();
  const [schools, setSchools] = useState(initialSchools);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [showGallery, setShowGallery] = useState(false);
  const [showInspection, setShowInspection] = useState(false);
  const [inspectionSchoolId, setInspectionSchoolId] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [editingSchool, setEditingSchool] = useState(null);

  const [loadingSchools, setLoadingSchools] = useState(false);
  const [loadingSchoolDetails, setLoadingSchoolDetails] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const hasSeededRef = useRef(false);

  const persistUpdatedSchool = useCallback((updatedSchool) => {
    if (!updatedSchool || !updatedSchool.id) return;
    setSchools((prev) => {
      const exists = prev.some((school) => school.id === updatedSchool.id);
      if (exists) {
        return prev.map((school) =>
          school.id === updatedSchool.id
            ? { ...school, ...updatedSchool }
            : school
        );
      }
      return [...prev, updatedSchool];
    });
  }, []);

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        setLoadingSchools(true);
        const response = await ApiService.getSchools();
        let normalized = normalizeSchoolList(response);

        if (normalized.length === 0 && !hasSeededRef.current) {
          await Promise.all(
            initialSchools.map(async (school) => {
              try {
                const payload = {
                  ...school,
                  legacyId: school.id,
                  level: school.level || "State Level",
                };
                delete payload.id;
                delete payload.photos;
                await ApiService.createSchool(payload);
              } catch (seedError) {
                console.error("Failed to seed school:", seedError);
              }
            })
          );
          hasSeededRef.current = true;
          const seededResponse = await ApiService.getSchools();
          normalized = normalizeSchoolList(seededResponse);
        }

        if (normalized.length > 0) {
          setSchools(normalized);
          setLoadError(null);
        } else if (!hasSeededRef.current) {
          setSchools(initialSchools);
        }
      } catch (error) {
        console.error("Failed to load schools:", error);
        setLoadError(
          "Unable to load schools from server. Showing sample data."
        );
        setSchools(initialSchools);
      } finally {
        setLoadingSchools(false);
      }
    };

    fetchSchools();
  }, []); // Empty dependency array - only run once on mount

  const openSchoolDetails = useCallback(
    async (school) => {
      if (!school) return;
      const schoolId = school.id || school._id || school.legacyId;

      try {
        setLoadingSchoolDetails(true);
        const [schoolResponse, photosResponse] = await Promise.all([
          ApiService.getSchool(schoolId),
          ApiService.getSchoolPhotos(schoolId),
        ]);

        const normalizedSchool = mapSchoolFromApi({
          ...schoolResponse,
          _id: schoolId,
        });
        normalizedSchool.photos = photosResponse;
        persistUpdatedSchool(normalizedSchool);
        setSelectedSchool(normalizedSchool);
        setShowGallery(true);
      } catch (error) {
        console.error("Failed to load school details:", error);
        const fallback =
          schools.find((entry) => entry.id === schoolId) || school;
        setSelectedSchool(fallback);
        setShowGallery(true);
      } finally {
        setLoadingSchoolDetails(false);
      }
    },
    [persistUpdatedSchool, schools]
  );

  const handleSchoolSelect = (school) => {
    openSchoolDetails(school);
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
      name: "",
      location: "",
      phone: "",
      email: "",
      rating: "B+",
      lastInspection: "",
      level: "State Level",
      status: "Active",
      licenseNumber: "",
      owner: "",
      category: "Primary School",
      type: "Government School",
      violations: 0,
      photos: [],
    });
    setShowEdit(true);
  };

  const handleViewSchool = (school) => {
    openSchoolDetails(school);
  };

  const handleEditSchool = (school) => {
    setEditingSchool({ ...school });
    setShowEdit(true);
  };

  const handleSaveSchool = async (updatedSchool) => {
    try {
      let savedSchool;
      const payload = { ...updatedSchool };
      delete payload.photos;
      const computedLegacyId =
        updatedSchool.legacyId ??
        (typeof updatedSchool.id === "number" ? updatedSchool.id : undefined);
      if (computedLegacyId !== undefined) {
        payload.legacyId = computedLegacyId;
      }

      if (updatedSchool.id && typeof updatedSchool.id === "string") {
        savedSchool = await ApiService.updateSchool(updatedSchool.id, payload);
      } else {
        savedSchool = await ApiService.createSchool({
          ...payload,
          legacyId: computedLegacyId ?? Date.now(),
        });
      }

      const normalized = mapSchoolFromApi(savedSchool);
      if (normalized) {
        persistUpdatedSchool(normalized);
        setSelectedSchool(normalized);
      }
    } catch (error) {
      console.error("Failed to save school:", error);
      persistUpdatedSchool(updatedSchool);
    } finally {
      setShowEdit(false);
      setEditingSchool(null);
    }
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

  const refreshSchoolPhotos = useCallback(async (schoolId) => {
    try {
      const photosResponse = await ApiService.getSchoolPhotos(schoolId);
      const normalizedPhotos = normalizePhotoList(
        photosResponse || [],
        schoolId
      );
      setSchools((prev) =>
        prev.map((school) =>
          school.id === schoolId ||
          school.legacyId === schoolId ||
          String(school.id) === String(schoolId)
            ? { ...school, photos: normalizedPhotos }
            : school
        )
      );
      setSelectedSchool((prev) =>
        prev &&
        (prev.id === schoolId ||
          prev.legacyId === schoolId ||
          String(prev.id) === String(schoolId))
          ? { ...prev, photos: normalizedPhotos }
          : prev
      );
      return { photos: normalizedPhotos };
    } catch (error) {
      console.error("Failed to refresh school photos:", error);
      return null;
    }
  }, []);

  // Use mobile UI for mobile devices
  if (device.isMobile) {
    if (showInspection) {
      const school = schools.find((s) => s.id === inspectionSchoolId);
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
        <MobileSchoolDetails
          school={selectedSchool}
          onClose={handleCloseGallery}
          onInspect={handleInspect}
          onRefreshPhotos={() => refreshSchoolPhotos(selectedSchool.id)}
          isLoading={loadingSchoolDetails}
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

    if (loadingSchools) {
      return (
        <div className="min-h-screen flex items-center justify-center text-gray-500">
          Loading schools...
        </div>
      );
    }

    return (
      <div className="flex flex-col min-h-screen">
        {loadError && (
          <div className="px-4 py-2 bg-yellow-100 text-yellow-700 text-sm text-center">
            {loadError}
          </div>
        )}
        <MobileSchoolsList
          schools={schools}
          onSchoolSelect={handleSchoolSelect}
          onInspect={handleInspect}
          onNewInspection={handleNewInspection}
          onAddSchool={handleAddSchool}
          onViewSchool={handleViewSchool}
          onEditSchool={handleEditSchool}
        />
      </div>
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
    name: school?.name ?? "",
    location: school?.location ?? "",
    phone: school?.phone ?? "",
    email: school?.email ?? "",
    rating: school?.rating ?? "B+",
    lastInspection: school?.lastInspection ?? "",
    level: school?.level ?? "State Level",
    status: school?.status ?? "Active",
    licenseNumber: school?.licenseNumber ?? "",
    owner: school?.owner ?? "",
    category: school?.category ?? "Primary School",
    type: school?.type ?? "Government School",
    violations: school?.violations ?? 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "violations" ? Number(value) : value,
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
            {formData.id
              ? t("establishments.editTitle")
              : t("establishments.buttons.addSchool") || "Add School"}
          </h1>
          <button
            onClick={onClose}
            className="p-2 -mr-2 active:bg-blue-700 rounded transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-gray-50"
      >
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              {t("establishments.labels.schoolName")}
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
              {t("inspection.location")}
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
                {t("establishments.labels.phone")}
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
                {t("establishments.labels.email")}
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
                {t("establishments.labels.schoolType")}
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-sm"
              >
                <option value="Government School">
                  {t("establishments.schoolTypes.government")}
                </option>
                <option value="Government Aided School">
                  {t("establishments.schoolTypes.aided")}
                </option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                {t("establishments.labels.category")}
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-sm"
              >
                <option value="Primary School">
                  {t("inspection.categories.primary")}
                </option>
                <option value="Higher Secondary">
                  {t("inspection.categories.higherSecondary")}
                </option>
                <option value="High School">
                  {t("inspection.categories.highSchool")}
                </option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                {t("inspection.level")}
              </label>
              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
                className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-sm"
              >
                <option value="State Level">
                  {t("inspection.levels.state")}
                </option>
                <option value="District Level">
                  {t("inspection.levels.district")}
                </option>
                <option value="Taluk Level">
                  {t("inspection.levels.taluk")}
                </option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                {t("establishments.labels.status")}
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
                {t("establishments.labels.ownerDept")}
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
                {t("establishments.labels.licenseNumber")}
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
            {t("common.cancel") || "Cancel"}
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
