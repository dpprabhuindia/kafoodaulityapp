import React, { useState, useEffect } from "react";
import {
  Clock,
  User,
  MapPin,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import sseService from "../services/sseService";
import apiService from "../services/api";

const WardenPhotos = () => {
  const [photos, setPhotos] = useState([]);
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    schoolId: "",
  });
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [stats, setStats] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("connecting");
  const [lastUpdate, setLastUpdate] = useState(null);
  const [newPhotoAlert, setNewPhotoAlert] = useState(false);
  const [imageViewer, setImageViewer] = useState({
    isOpen: false,
    photos: [],
    currentIndex: 0,
  });

  useEffect(() => {
    fetchSchools();
    fetchPhotos();
    fetchStats();

    // Set up real-time updates via SSE service
    const handleSSEUpdate = (eventType, schoolId, data) => {
      if (eventType === "photo_added" || eventType === "warden_photo_added") {
        // If we have photo data in the SSE event, try to add it directly
        if (data && data.schoolId && data.mealType) {
          // Check if the new photo matches current filters
          let shouldShow = true;
          if (filters.schoolId) {
            const selectedSchool = schools.find(
              (school) => school.licenseNumber === filters.schoolId
            );
            if (selectedSchool) {
              shouldShow =
                data.schoolId === selectedSchool.name ||
                data.schoolId === `${selectedSchool.name} ()` ||
                data.schoolId ===
                  `${selectedSchool.name} (${selectedSchool.licenseNumber})` ||
                data.schoolId === selectedSchool.licenseNumber ||
                data.schoolId === selectedSchool._id;
            }
          }

          if (shouldShow) {
            // Add the new photo to the beginning of the list
            setPhotos((prevPhotos) => {
              // Check if photo already exists to avoid duplicates
              const exists = prevPhotos.some((p) => p._id === data.id);
              if (!exists) {
                return [data, ...prevPhotos];
              }
              return prevPhotos;
            });
          }
        } else {
          // Fallback to full refresh
          fetchPhotos();
        }

        fetchStats();
        setLastUpdate(new Date());
        setNewPhotoAlert(true);
        setTimeout(() => setNewPhotoAlert(false), 5000); // Hide after 5 seconds
      } else if (eventType === "warden_photo_status_updated") {
        // Update specific photo in the list instead of refetching all
        if (data && data.id) {
          setPhotos((prevPhotos) =>
            prevPhotos.map((photo) =>
              photo._id === data.id
                ? {
                    ...photo,
                    status: data.status,
                    reviewNotes: data.reviewNotes,
                    reviewedBy: data.reviewedBy,
                    reviewedAt: data.reviewedAt,
                  }
                : photo
            )
          );
        } else {
          // Fallback to full refresh if we don't have the photo ID
          fetchPhotos();
        }
        fetchStats();
        setLastUpdate(new Date());
      } else if (eventType === "warden_photo_deleted") {
        // Remove photo from the list instead of refetching all
        if (data && data.id) {
          setPhotos((prevPhotos) =>
            prevPhotos.filter((photo) => photo._id !== data.id)
          );
        } else {
          // Fallback to full refresh
          fetchPhotos();
        }
        fetchStats();
        setLastUpdate(new Date());
      }
    };

    // Subscribe to all photo updates
    console.log("📡 Setting up SSE subscription...");
    const unsubscribe = sseService.subscribeAll(handleSSEUpdate);

    // Check connection status once after initial setup (no forced reconnection)
    setTimeout(() => {
      const status = sseService.getConnectionStatus();
      if (!status.isConnected) {
        console.log(
          "📡 SSE not connected after 3 seconds, connection may be in progress..."
        );
        // Don't force reconnection here, let the SSE service handle it
      }
    }, 3000);

    // Monitor connection status (less frequently to avoid performance issues)
    const checkConnection = () => {
      const status = sseService.getConnectionStatus();
      const newStatus = status.isConnected ? "connected" : "disconnected";
      setConnectionStatus(newStatus);
    };

    checkConnection();
    const connectionInterval = setInterval(checkConnection, 30000); // Check every 30 seconds instead of 5

    // Cleanup on unmount
    return () => {
      console.log("📡 Cleaning up SSE subscription...");
      unsubscribe();
      clearInterval(connectionInterval);
    };
  }, []);

  useEffect(() => {
    fetchPhotos();
    fetchStats();
  }, [filters]);

  const fetchSchools = async () => {
    try {
      const data = await apiService.getSchools();
      setSchools(data);
    } catch (error) {
      console.error("Error fetching schools:", error);
    }
  };

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      // Get all photos first (since server filtering is not working)
      const data = await apiService.getWardenPhotos({});
      let allPhotos = data.photos || data;

      // Apply client-side filtering if server-side filtering fails
      if (filters.schoolId) {
        // Find the school by license number
        const selectedSchool = schools.find(
          (school) => school.licenseNumber === filters.schoolId
        );
        if (selectedSchool) {
          // Filter photos by school name (with or without parentheses)
          allPhotos = allPhotos.filter((photo) => {
            return (
              photo.schoolId === selectedSchool.name ||
              photo.schoolId === `${selectedSchool.name} ()` ||
              photo.schoolId ===
                `${selectedSchool.name} (${selectedSchool.licenseNumber})` ||
              photo.schoolId === selectedSchool.licenseNumber ||
              photo.schoolId === selectedSchool._id
            );
          });
        }
      }

      setPhotos(allPhotos);
    } catch (error) {
      console.error("Error fetching warden photos:", error);
    } finally {
      setLoading(false);
    }
  };

  // Group photos by warden, school, meal type, and time (within 10 minutes)
  const groupPhotos = (photos) => {
    const groups = [];
    const sortedPhotos = [...photos].sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );

    sortedPhotos.forEach((photo) => {
      // Try to find an existing group for this photo
      const existingGroup = groups.find((group) => {
        const timeDiff = Math.abs(
          new Date(photo.timestamp) - new Date(group.timestamp)
        );
        const tenMinutes = 10 * 60 * 1000; // 10 minutes in milliseconds

        return (
          group.uploadedBy?.name === photo.uploadedBy?.name &&
          group.schoolId === photo.schoolId &&
          group.mealType === photo.mealType &&
          timeDiff <= tenMinutes
        );
      });

      if (existingGroup) {
        // Add photo to existing group
        existingGroup.photos.push(photo);
      } else {
        // Create new group
        groups.push({
          id: photo._id,
          uploadedBy: photo.uploadedBy,
          schoolId: photo.schoolId,
          mealType: photo.mealType,
          timestamp: photo.timestamp,
          status: photo.status,
          reviewedBy: photo.reviewedBy,
          reviewedAt: photo.reviewedAt,
          reviewNotes: photo.reviewNotes,
          photos: [photo],
        });
      }
    });

    return groups;
  };

  const fetchStats = async () => {
    try {
      // Get overall stats first (since server filtering might not work)
      const data = await apiService.getWardenPhotoStats({});

      // If we have a school filter, calculate stats from the filtered photos
      if (filters.schoolId && photos.length >= 0) {
        // Calculate stats from currently displayed photos
        const filteredStats = {
          overall: {
            totalPhotos: photos.length,
            pendingPhotos: photos.filter((p) => p.status === "pending").length,
            approvedPhotos: photos.filter((p) => p.status === "approved")
              .length,
            rejectedPhotos: photos.filter((p) => p.status === "rejected")
              .length,
            breakfastPhotos: photos.filter((p) => p.mealType === "breakfast")
              .length,
            lunchPhotos: photos.filter((p) => p.mealType === "lunch").length,
            snacksPhotos: photos.filter((p) => p.mealType === "snacks").length,
            dinnerPhotos: photos.filter((p) => p.mealType === "dinner").length,
          },
          byMealType: data.byMealType || [],
          daily: data.daily || [],
        };
        setStats(filteredStats);
      } else {
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const updatePhotoStatus = async (photoId, status, reviewNotes = "") => {
    try {
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      await apiService.updateWardenPhotoStatus(
        photoId,
        status,
        reviewNotes,
        currentUser?.id
      );

      fetchPhotos();
      fetchStats();
      setSelectedPhoto(null);
    } catch (error) {
      console.error("Error updating photo status:", error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getMealIcon = (mealType) => {
    switch (mealType) {
      case "breakfast":
        return "🍳";
      case "lunch":
        return "🍽️";
      case "snacks":
        return "🍪";
      case "dinner":
        return "🍛";
      default:
        return "🍽️";
    }
  };

  // Open image viewer with photos from the group
  const openImageViewer = (photo, groupPhotos) => {
    const currentIndex = groupPhotos.findIndex((p) => p._id === photo._id);
    setImageViewer({
      isOpen: true,
      photos: groupPhotos,
      currentIndex: currentIndex >= 0 ? currentIndex : 0,
    });
  };

  // Navigate to next/previous image
  const navigateImage = (direction) => {
    setImageViewer((prev) => {
      const newIndex =
        direction === "next"
          ? (prev.currentIndex + 1) % prev.photos.length
          : (prev.currentIndex - 1 + prev.photos.length) % prev.photos.length;
      return { ...prev, currentIndex: newIndex };
    });
  };

  // Close image viewer
  const closeImageViewer = () => {
    setImageViewer({ isOpen: false, photos: [], currentIndex: 0 });
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!imageViewer.isOpen) return;

      if (e.key === "ArrowLeft") {
        navigateImage("prev");
      } else if (e.key === "ArrowRight") {
        navigateImage("next");
      } else if (e.key === "Escape") {
        closeImageViewer();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [imageViewer.isOpen]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-3xl font-bold text-gray-900">Warden Photos</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                fetchPhotos();
                fetchStats();
                setLastUpdate(new Date());
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow border mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-900">
            Filter by School
          </h3>
        </div>

        <div className="max-w-md">
          <select
            value={filters.schoolId}
            onChange={(e) => setFilters({ schoolId: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Schools</option>
            {schools.map((school) => (
              <option key={school._id} value={school.licenseNumber}>
                {school.name} ({school.licenseNumber})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Photos Feed */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {groupPhotos(photos).map((group) => (
            <div
              key={group.id}
              className="bg-white rounded-lg shadow border overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-gray-500" />
                  </div>

                  {/* User Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">
                        {group.uploadedBy?.name || "Unknown Warden"} (Warden)
                      </h3>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                      <span className="capitalize">
                         Today's {group.mealType}
                      </span>
                      <span>•</span>
                      <span>
                        Posted At:{" "}
                        {new Date(group.timestamp).toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Meal Type Label */}
              <div className="px-4 py-2 bg-gray-50">
                <h4 className="font-medium text-gray-900 capitalize">
                  {group.mealType}
                </h4>
              </div>

              {/* Photo Grid */}
              <div className="p-4">
                {group.photos.length === 1 ? (
                  // Single photo - full width
                  <div className="w-full">
                    <img
                      src={group.photos[0].photoUrl}
                      alt={`${group.mealType} meal`}
                      className="w-full h-64 object-cover rounded-lg cursor-pointer hover:opacity-95 transition-opacity"
                      onClick={() =>
                        openImageViewer(group.photos[0], group.photos)
                      }
                    />
                  </div>
                ) : group.photos.length === 2 ? (
                  // Two photos - side by side
                  <div className="grid grid-cols-2 gap-2">
                    {group.photos.map((photo, index) => (
                      <div key={photo._id} className="aspect-square">
                        <img
                          src={photo.photoUrl}
                          alt={`${group.mealType} meal ${index + 1}`}
                          className="w-full h-full object-cover rounded-lg cursor-pointer hover:opacity-95 transition-opacity"
                          onClick={() => openImageViewer(photo, group.photos)}
                        />
                      </div>
                    ))}
                  </div>
                ) : group.photos.length === 3 ? (
                  // Three photos - one large, two small
                  <div className="grid grid-cols-2 gap-2">
                    <div className="row-span-2">
                      <img
                        src={group.photos[0].photoUrl}
                        alt={`${group.mealType} meal 1`}
                        className="w-full h-full object-cover rounded-lg cursor-pointer hover:opacity-95 transition-opacity"
                        onClick={() =>
                          openImageViewer(group.photos[0], group.photos)
                        }
                      />
                    </div>
                    {group.photos.slice(1).map((photo, index) => (
                      <div key={photo._id} className="aspect-square">
                        <img
                          src={photo.photoUrl}
                          alt={`${group.mealType} meal ${index + 2}`}
                          className="w-full h-full object-cover rounded-lg cursor-pointer hover:opacity-95 transition-opacity"
                          onClick={() => openImageViewer(photo, group.photos)}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  // Four or more photos - 2x2 grid
                  <div className="grid grid-cols-2 gap-2">
                    {group.photos.slice(0, 4).map((photo, index) => (
                      <div key={photo._id} className="aspect-square relative">
                        <img
                          src={photo.photoUrl}
                          alt={`${group.mealType} meal ${index + 1}`}
                          className="w-full h-full object-cover rounded-lg cursor-pointer hover:opacity-95 transition-opacity"
                          onClick={() => openImageViewer(photo, group.photos)}
                        />
                        {index === 3 && group.photos.length > 4 && (
                          <div
                            className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center cursor-pointer"
                            onClick={() =>
                              openImageViewer(group.photos[0], group.photos)
                            }
                          >
                            <span className="text-white text-xl font-bold">
                              +{group.photos.length - 4}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* School Info */}
              <div className="px-4 pb-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{group.schoolId}</span>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                    🇮🇳 {formatDate(group.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {photos.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📸</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No photos found
          </h3>
          <p className="text-gray-600">
            No warden photos match your current filters.
          </p>
        </div>
      )}

      {/* Full-Screen Image Viewer */}
      {imageViewer.isOpen && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={closeImageViewer}
            className="absolute top-4 right-4 z-60 text-white hover:text-gray-300 transition-colors"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Navigation Buttons */}
          {imageViewer.photos.length > 1 && (
            <>
              <button
                onClick={() => navigateImage("prev")}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-60 text-white hover:text-gray-300 transition-colors"
              >
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <button
                onClick={() => navigateImage("next")}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-60 text-white hover:text-gray-300 transition-colors"
              >
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </>
          )}

          {/* Image Counter */}
          {imageViewer.photos.length > 1 && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-60 text-white bg-black bg-opacity-50 px-3 py-1 rounded-full text-sm">
              {imageViewer.currentIndex + 1} / {imageViewer.photos.length}
            </div>
          )}

          {/* Main Image */}
          <div className="w-full h-full flex items-center justify-center p-4">
            <img
              src={imageViewer.photos[imageViewer.currentIndex]?.photoUrl}
              alt={`${
                imageViewer.photos[imageViewer.currentIndex]?.mealType
              } meal`}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Image Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6 text-white">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold">
                    {imageViewer.photos[imageViewer.currentIndex]?.uploadedBy
                      ?.name || "Unknown Warden"}{" "}
                    (Warden)
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <span className="capitalize">
                      {getMealIcon(
                        imageViewer.photos[imageViewer.currentIndex]?.mealType
                      )}
                      {imageViewer.photos[imageViewer.currentIndex]?.mealType}
                    </span>
                    <span>•</span>
                    <span>
                      {imageViewer.photos[imageViewer.currentIndex]?.schoolId}
                    </span>
                    <span>•</span>
                    <span>
                      {formatDate(
                        imageViewer.photos[imageViewer.currentIndex]?.timestamp
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Click outside to close */}
          <div className="absolute inset-0 -z-10" onClick={closeImageViewer} />
        </div>
      )}

      {/* Photo Detail Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Photo Details
                </h2>
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <img
                src={selectedPhoto.photoUrl}
                alt={`${selectedPhoto.mealType} meal`}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">Meal Type:</span>
                  <span className="capitalize">
                    {getMealIcon(selectedPhoto.mealType)}{" "}
                    {selectedPhoto.mealType}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="font-medium">School ID:</span>
                  <span>{selectedPhoto.schoolId}</span>
                </div>

                <div className="flex justify-between">
                  <span className="font-medium">Uploaded By:</span>
                  <span>
                    {selectedPhoto.uploadedBy?.name} (
                    {selectedPhoto.uploadedBy?.role})
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="font-medium">Upload Time:</span>
                  <span>{formatDate(selectedPhoto.timestamp)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="font-medium">Status:</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      selectedPhoto.status
                    )}`}
                  >
                    {selectedPhoto.status}
                  </span>
                </div>

                {selectedPhoto.reviewedBy && (
                  <>
                    <div className="flex justify-between">
                      <span className="font-medium">Reviewed By:</span>
                      <span>{selectedPhoto.reviewedBy.name}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="font-medium">Review Date:</span>
                      <span>{formatDate(selectedPhoto.reviewedAt)}</span>
                    </div>

                    {selectedPhoto.reviewNotes && (
                      <div>
                        <span className="font-medium">Review Notes:</span>
                        <p className="mt-1 text-gray-600">
                          {selectedPhoto.reviewNotes}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WardenPhotos;
