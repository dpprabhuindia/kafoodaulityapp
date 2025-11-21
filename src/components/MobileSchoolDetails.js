import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronLeft,
  MapPin,
  Phone,
  Mail,
  Calendar,
  ShieldCheck,
  AlertTriangle,
  Star,
  Image as ImageIcon,
  Camera,
  Upload,
  RefreshCw,
} from "lucide-react";
import { triggerHaptic } from "../utils/deviceDetection";
import { useI18n } from "../i18n/I18nProvider";
import MobilePhotoGallery from "./MobilePhotoGallery";
import ApiService from "../services/api";
import { useSSE } from "../hooks/useSSE";

const statusStyles = {
  Active: "bg-green-100 text-green-700",
  "Under Review": "bg-yellow-100 text-yellow-700",
  Suspended: "bg-red-100 text-red-700",
};

const ratingStyles = {
  A: "bg-green-100 text-green-800 border-green-200",
  "A+": "bg-green-100 text-green-800 border-green-200",
  "B+": "bg-blue-100 text-blue-800 border-blue-200",
  B: "bg-yellow-100 text-yellow-800 border-yellow-200",
  C: "bg-orange-100 text-orange-800 border-orange-200",
  D: "bg-red-100 text-red-800 border-red-200",
};

const MobileSchoolDetails = ({
  school,
  onClose,
  onInspect,
  onRefreshPhotos,
  isLoading = false,
}) => {

  const { t } = useI18n();
  const { isConnected, lastUpdate } = useSSE(school?.id);
  const [showGallery, setShowGallery] = useState(false);
  const [initialPhotoId, setInitialPhotoId] = useState(null);
  const [selectedFacilityType, setSelectedFacilityType] = useState("kitchen");
  const [uploadingFacilityPhotos, setUploadingFacilityPhotos] = useState(false);
  const [localPhotos, setLocalPhotos] = useState(
    Array.isArray(school?.photos) ? school.photos : []
  );
  const [refreshingPhotos, setRefreshingPhotos] = useState(false);

  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  useEffect(() => {
    setLocalPhotos(Array.isArray(school?.photos) ? school.photos : []);
  }, [school]);

  // Handle SSE updates from the hook
  useEffect(() => {
    if (!lastUpdate || !school?.id) return;

    const { eventType, data } = lastUpdate;
    console.log(
      `📡 SSE event received: ${eventType} for school ${school.id}`,
      data
    );

    switch (eventType) {
      case "photo_added":
        // Add new photo to local state
        setLocalPhotos((prevPhotos) => {
          // Check if photo already exists to avoid duplicates
          const exists = prevPhotos.some((photo) => photo.id === data.id);
          if (!exists) {
            const newPhotos = [data, ...prevPhotos];

            // Show notification for new photos from other devices
            if (data.facilityType) {
              console.log(
                `📸 New ${data.facilityType} photo synced from another device`
              );
            }

            return newPhotos;
          }
          return prevPhotos;
        });
        break;

      case "photo_deleted":
        // Remove deleted photo from local state
        setLocalPhotos((prevPhotos) => {
          const newPhotos = prevPhotos.filter(
            (photo) => photo.id !== data.photoId
          );
          return newPhotos;
        });
        break;

      case "photos_refreshed":
        // Refresh all photos from server
        handleManualRefresh();
        break;
      default:
        // Handle unknown event types
        console.log("Unknown SSE event type:", eventType);
        break;
    }
  }, [lastUpdate, school?.id]);

  const handleManualRefresh = async () => {
    if (!school?.id || refreshingPhotos) return;

    triggerHaptic("light");
    setRefreshingPhotos(true);

    try {
      const response = await ApiService.getSchoolPhotos(school.id);
      const newPhotos = Array.isArray(response) ? response : [];
      setLocalPhotos(newPhotos);

      // Also call parent refresh if available
      if (onRefreshPhotos) {
        await onRefreshPhotos();
      }
    } catch (error) {
      console.error("Error manually refreshing photos:", error);
    } finally {
      setRefreshingPhotos(false);
    }
  };

  const photos = localPhotos;

  const photoStats = useMemo(() => {
    const inspectionPhotos = photos.filter((photo) => photo.inspectionId);
    const facilityPhotos = photos.filter((photo) => photo.facilityType);
    const archivePhotos = photos.filter(
      (photo) => !photo.inspectionId && !photo.facilityType
    );
    const inspectors = new Set(
      photos.filter((photo) => photo.inspector).map((photo) => photo.inspector)
    );
    const totalBytes = photos.reduce(
      (sum, photo) => sum + (photo.size || 0),
      0
    );

    return {
      inspectionCount: inspectionPhotos.length,
      facilityCount: facilityPhotos.length,
      archiveCount: archivePhotos.length,
      inspectorsCount: inspectors.size,
      totalKb: Math.round(totalBytes / 1024) || 0,
    };
  }, [photos]);

  const facilityOptions = useMemo(
    () => [
      {
        value: "kitchen",
        label:
          t("establishments.facility.types.kitchen") || "Kitchen Facilities",
      },
      {
        value: "storeroom",
        label: t("establishments.facility.types.storeroom") || "Store Room",
      },
      {
        value: "dining",
        label: t("establishments.facility.types.dining") || "Dining Area",
      },
      {
        value: "washroom",
        label: t("establishments.facility.types.washroom") || "Wash Room",
      },
      {
        value: "playground",
        label: t("establishments.facility.types.playground") || "Playground",
      },
      {
        value: "classroom",
        label: t("establishments.facility.types.classroom") || "Classroom",
      },
    ],
    [t]
  );

  const facilityCounts = useMemo(() => {
    return facilityOptions.reduce((acc, option) => {
      acc[option.value] = photos.filter(
        (photo) => photo.facilityType === option.value
      ).length;
      return acc;
    }, {});
  }, [facilityOptions, photos]);

  if (!school) {
    return null;
  }

  const handleBack = () => {
    triggerHaptic("light");
    onClose?.();
  };

  const handleOpenGallery = (photoId = null) => {
    if (!photos.length) {
      triggerHaptic("light");
      return;
    }
    triggerHaptic("light");
    setInitialPhotoId(photoId);
    setShowGallery(true);
  };

  const handleCloseGallery = async () => {
    triggerHaptic("light");
    setShowGallery(false);
    setInitialPhotoId(null);
    if (onRefreshPhotos) {
      try {
        const refreshed = await onRefreshPhotos();
        if (refreshed?.photos) {
          setLocalPhotos(refreshed.photos);
        }
      } catch (error) {
        console.error("Error refreshing photos:", error);
      }
    }
  };

  const handleStartInspection = () => {
    triggerHaptic("medium");
    onInspect?.(school.id);
  };

  const handleFacilityFiles = async (files) => {
    if (!school) {
      alert(
        t("establishments.alerts.noSchoolSelected") ||
          "No school selected for photo upload."
      );
      return;
    }

    const validFiles = Array.from(files || []).filter(Boolean);
    if (validFiles.length === 0) {
      return;
    }

    triggerHaptic("light");
    setUploadingFacilityPhotos(true);

    const facilityLabel =
      facilityOptions.find((option) => option.value === selectedFacilityType)
        ?.label ||
      selectedFacilityType.charAt(0).toUpperCase() +
        selectedFacilityType.slice(1);

    try {
      const uploads = await Promise.all(
        validFiles.map(async (file) => {
          try {
            const response = await ApiService.uploadFacilityPhoto(
              school.id,
              file,
              {
                facilityType: selectedFacilityType,
                caption: `${facilityLabel} Facility - ${file.name}`,
                inspector: "Facility Manager",
              }
            );
            return response.photo;
          } catch (error) {
            console.error("Error uploading facility photo:", file.name, error);
            return null;
          }
        })
      );

      const successful = uploads.filter(Boolean);
      if (successful.length > 0) {
        const updatedPhotos = [...successful, ...photos];
        setLocalPhotos(updatedPhotos);

        if (onRefreshPhotos) {
          try {
            const refreshed = await onRefreshPhotos();
            if (refreshed?.photos) {
              setLocalPhotos(refreshed.photos);
            }
          } catch (refreshError) {
            console.error("Error refreshing photos:", refreshError);
          }
        }

        triggerHaptic("medium");
        alert(
          t("establishments.facility.successUpload", {
            count: successful.length,
            label: facilityLabel,
          }) ||
            `Successfully uploaded ${
              successful.length
            } ${facilityLabel.toLowerCase()} photos.`
        );
      } else {
        alert(
          t("establishments.facility.failedUpload") ||
            "No photos were uploaded. Please try again."
        );
      }
    } catch (error) {
      console.error("Facility upload error:", error);
      alert(
        t("establishments.facility.failedUpload") ||
          "Error uploading facility photos. Please try again."
      );
    } finally {
      setUploadingFacilityPhotos(false);
    }
  };

  const handleCameraCapture = (event) => {
    const { files } = event.target;
    handleFacilityFiles(files);
    event.target.value = "";
  };

  const handleGalleryUpload = (event) => {
    const { files } = event.target;
    handleFacilityFiles(files);
    event.target.value = "";
  };

  const getStatusBadgeClass = (status) =>
    statusStyles[status || ""] || "bg-gray-100 text-gray-700";

  const getRatingBadgeClass = (rating) =>
    ratingStyles[rating || ""] || "bg-gray-100 text-gray-800 border-gray-200";

  const getPhotoTypeBadge = (photo) => {
    if (photo.inspectionId) {
      return { label: "Inspection", classes: "bg-blue-100 text-blue-800" };
    }
    if (photo.facilityType) {
      const option = facilityOptions.find(
        (item) => item.value === photo.facilityType
      );
      const icon = option?.icon || "🏢";
      const text =
        option?.label ||
        `${
          photo.facilityType.charAt(0).toUpperCase() +
          photo.facilityType.slice(1)
        } Facility`;
      return {
        label: `${icon} ${text}`,
        classes: "bg-green-100 text-green-800",
      };
    }
    return { label: "Archive", classes: "bg-gray-100 text-gray-700" };
  };

  const infoLabel = (key, fallback) => t(key) || fallback;

  return (
    <div className="fixed inset-0 bg-gray-50 z-50 flex flex-col overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm text-sm font-medium text-gray-600">
          {t("common.loading") || "Loading..."}
        </div>
      )}
      <header className="bg-white border-b border-gray-200 px-4 py-4 flex-shrink-0">
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={handleBack}
            className="p-2.5 -ml-1 rounded-full active:bg-gray-100 transition-colors touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Go back"
          >
            <ChevronLeft className="w-6 h-6 text-gray-900" />
          </button>
          <div className="flex-1 text-center px-2 min-w-0">
            <h1 className="text-base font-semibold text-gray-900 truncate leading-tight">
              {school.name}
            </h1>
            {school.location && (
              <p className="text-xs text-gray-500 truncate mt-0.5 leading-tight">
                {school.location}
              </p>
            )}
          </div>
          <div className="w-10 flex-shrink-0" />
        </div>
      </header>

      <main className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-4 space-y-4 pb-6">
        {/* School Information Card */}
        <section className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Header with badges */}
          <div className="px-4 pt-4 pb-3">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span
                className={`text-xs px-3 py-1.5 rounded-full font-medium ${getStatusBadgeClass(
                  school.status
                )}`}
              >
                {school.status || infoLabel("common.status", "Active")}
              </span>
              {school.rating && (
                <span
                  className={`text-xs px-3 py-1.5 rounded-md font-semibold ${getRatingBadgeClass(
                    school.rating
                  )}`}
                >
                  {school.rating}
                </span>
              )}
            </div>

            <h2 className="text-lg font-semibold text-gray-900 mb-1">
              School Information
            </h2>

            {/* School Type and Category */}
            <div className="flex items-center gap-3 mb-1">
              <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-gray-100">
                <ShieldCheck className="w-3 h-3 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-900">
                  {school.type || "Government School"}
                </p>
                <p className="text-sm text-gray-500">
                  {school.category || "Higher Secondary"}
                </p>
              </div>
              {school.level && (
                <span className="ml-auto text-xs px-2 py-1 rounded-md bg-purple-50 text-purple-700 font-medium">
                  {school.level}
                </span>
              )}
            </div>
          </div>

          {/* Information List */}
          <div className="px-4 pb-4 space-y-4">
            {/* Location */}
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 mt-0.5">
                <MapPin className="w-3 h-3 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900 mb-0.5">Location</p>
                <p className="text-sm text-gray-500">
                  {school.location || "Not available"}
                </p>
              </div>
            </div>

            {/* Phone */}
            {school.phone && (
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-50 mt-0.5">
                  <Phone className="w-3 h-3 text-gray-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900 mb-0.5">Phone</p>
                  <p className="text-sm text-gray-500">{school.phone}</p>
                </div>
              </div>
            )}

            {/* Email */}
            {school.email && (
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 mt-0.5">
                  <Mail className="w-3 h-3 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900 mb-0.5">Email</p>
                  <p className="text-sm text-gray-500 break-all">
                    {school.email}
                  </p>
                </div>
              </div>
            )}

            {/* Last Inspection */}
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 mt-0.5">
                <Calendar className="w-3 h-3 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900 mb-0.5">Last Inspection</p>
                <p className="text-sm text-gray-500">
                  {school.lastInspection || "Not available"}
                </p>
              </div>
            </div>

            {/* Violations - only show if there are violations */}
            {school.violations > 0 && (
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-50 mt-0.5">
                  <AlertTriangle className="w-3 h-3 text-amber-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-0.5">
                    Inspection Violations
                  </p>
                  <p className="font-semibold text-red-600">
                    {school.violations}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Start Inspection Button */}
          {onInspect && (
            <div className="px-4 pb-4">
              <button
                onClick={handleStartInspection}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 text-white py-4 text-base font-semibold active:bg-blue-700 transition-colors touch-manipulation"
              >
                <Star className="w-5 h-5 flex-shrink-0" />
                <span className="truncate">{t('schools.newInspection') || 'Start New Inspection'}</span>
              </button>
            </div>
          )}
        </section>

        <section className="bg-white rounded-2xl shadow-sm p-4">
          <div className="flex items-center justify-between mb-4 gap-3">
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-semibold text-gray-900 leading-tight">
                {t("establishments.gallery.title") ||
                  "Inspection Photo Gallery"}
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {photos.length}{" "}
                {t("establishments.gallery.photosSuffix") || "photos"}
                {isConnected && (
                  <span className="ml-2 inline-flex items-center text-green-600">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1 animate-pulse"></span>
                    Live
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleManualRefresh}
                disabled={refreshingPhotos}
                className={`p-2 rounded-lg transition-colors touch-manipulation ${
                  refreshingPhotos
                    ? "text-gray-400"
                    : "text-gray-600 active:text-gray-800 active:bg-gray-100"
                }`}
                title="Refresh photos"
              >
                <RefreshCw
                  className={`w-4 h-4 ${
                    refreshingPhotos ? "animate-spin" : ""
                  }`}
                />
              </button>
              <button
                onClick={() => handleOpenGallery(null)}
                className="text-sm font-semibold text-blue-600 active:text-blue-700 px-2 py-1.5 touch-manipulation flex-shrink-0"
              >
                {t("common.viewAll") || "View All"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 mb-4">
            <div className="rounded-xl bg-blue-50 p-3 text-center">
              <p className="text-xl font-bold text-blue-600 leading-none">
                {photoStats.inspectionCount}
              </p>
              <p className="text-xs text-blue-600 mt-1.5 leading-tight">
                {t("establishments.gallery.inspectionPhotos") ||
                  "Inspection Photos"}
              </p>
            </div>
            <div className="rounded-xl bg-green-50 p-3 text-center">
              <p className="text-xl font-bold text-green-600 leading-none">
                {photoStats.facilityCount}
              </p>
              <p className="text-xs text-green-600 mt-1.5 leading-tight">
                {t("establishments.gallery.facilityPhotos") ||
                  "Facility Photos"}
              </p>
            </div>
            <div className="rounded-xl bg-gray-50 p-3 text-center">
              <p className="text-xl font-bold text-gray-600 leading-none">
                {photoStats.archiveCount}
              </p>
              <p className="text-xs text-gray-600 mt-1.5 leading-tight">
                {t("establishments.gallery.archivePhotos") || "Archive Photos"}
              </p>
            </div>
            <div className="rounded-xl bg-purple-50 p-3 text-center">
              <p className="text-xl font-bold text-purple-600 leading-none">
                {photoStats.inspectorsCount}
              </p>
              <p className="text-xs text-purple-600 mt-1.5 leading-tight">
                {t("establishments.gallery.inspectors") || "Inspectors"}
              </p>
            </div>
            <div className="rounded-xl bg-orange-50 p-3 text-center col-span-2">
              <p className="text-xl font-bold text-orange-600 leading-none">
                {photoStats.totalKb}
              </p>
              <p className="text-xs text-orange-600 mt-1.5 leading-tight">
                {t("establishments.gallery.totalKb") || "Total KB"}
              </p>
            </div>
          </div>

          {photos.length > 0 ? (
            <div className="grid grid-cols-2 gap-2.5">
              {photos.map((photo) => {
                const badge = getPhotoTypeBadge(photo);
                return (
                  <button
                    key={photo.id}
                    onClick={() => handleOpenGallery(photo.id)}
                    className="relative overflow-hidden rounded-xl bg-gray-100 aspect-square active:scale-[0.98] transition-transform text-left touch-manipulation"
                  >
                    <img
                      src={photo.url}
                      alt={photo.caption || "School facility photo"}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                    <span
                      className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-medium ${badge.classes} max-w-[calc(100%-1rem)] truncate`}
                    >
                      {badge.label}
                    </span>
                    <div className="absolute inset-0 bg-black/0 active:bg-black/10 transition-colors" />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                      <p className="text-xs text-white font-medium truncate leading-tight">
                        {photo.caption}
                      </p>
                      <p className="text-[10px] text-white/80 mt-0.5 leading-tight">
                        {photo.date
                          ? new Date(photo.date).toLocaleDateString()
                          : ""}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                <ImageIcon className="w-8 h-8" />
              </div>
              <p className="text-gray-500 text-sm">
                {t("establishments.gallery.emptyState") || "No photos found"}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {t("establishments.gallery.emptyHint") ||
                  "Upload inspection or facility photos to get started."}
              </p>
            </div>
          )}
        </section>

        <section className="bg-white rounded-2xl shadow-sm p-4 overflow-hidden">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 leading-tight">
              Upload Facility Photos
            </h2>

            <div className="space-y-4 min-w-0">
              {/* Facility Type Selector */}
              <div className="min-w-0">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Facility Type
                </label>
                <div className="relative">
                  <select
                    value={selectedFacilityType}
                    onChange={(e) => setSelectedFacilityType(e.target.value)}
                    className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-3 pr-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  >
                    {facilityOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        🍳 {option.label}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                    ▼
                  </span>
                </div>
              </div>

              {/* Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-3">
                    <Camera className="w-6 h-6 text-gray-500" />
                  </div>
                  <h3 className="text-base font-medium text-gray-700 mb-4">
                    Upload Facility Photos
                  </h3>

                  {/* Upload Button */}
                  <div className="flex gap-3 w-full max-w-xs">
                    <button
                      type="button"
                      onClick={() => cameraInputRef.current?.click()}
                      disabled={uploadingFacilityPhotos}
                      className={`flex-1 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                        uploadingFacilityPhotos
                          ? "bg-gray-200 text-gray-500"
                          : "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-700"
                      }`}
                    >
                      <Camera className="w-4 h-4" />
                      Take Photo
                    </button>
                    <button
                      type="button"
                      onClick={() => galleryInputRef.current?.click()}
                      disabled={uploadingFacilityPhotos}
                      className={`flex-1 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                        uploadingFacilityPhotos
                          ? "bg-gray-200 text-gray-500"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300 active:bg-gray-300"
                      }`}
                    >
                      <Upload className="w-4 h-4" />
                      Upload
                    </button>
                  </div>
                </div>
              </div>

              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleCameraCapture}
              />
              <input
                ref={galleryInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleGalleryUpload}
              />

              {/* Photo Counts Grid */}
              <div className="grid grid-cols-2 gap-3">
                {facilityOptions.slice(0, 2).map((option) => (
                  <div
                    key={option.value}
                    className={`rounded-lg p-4 text-center ${
                      option.value === "kitchen" ? "bg-green-50" : "bg-blue-50"
                    }`}
                  >
                    <p
                      className={`text-2xl font-bold leading-none ${
                        option.value === "kitchen"
                          ? "text-green-600"
                          : "text-blue-600"
                      }`}
                    >
                      {facilityCounts[option.value] || 0}
                    </p>
                    <p
                      className={`text-sm mt-1 ${
                        option.value === "kitchen"
                          ? "text-green-600"
                          : "text-blue-600"
                      }`}
                    >
                      {option.value === "kitchen"
                        ? "Kitchen Photos"
                        : "Store Room Photos"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
      </main>

      {showGallery && (
        <MobilePhotoGallery
          photos={photos}
          schoolName={school.name}
          onClose={handleCloseGallery}
          initialPhotoId={initialPhotoId}
        />
      )}
    </div>
  );
};

export default MobileSchoolDetails;
