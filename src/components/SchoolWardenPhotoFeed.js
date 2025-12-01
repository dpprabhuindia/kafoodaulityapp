import React, { useEffect, useMemo, useState, useRef } from "react";
import { AlertCircle, Image, RefreshCw, School, ChevronLeft, ChevronRight, X } from "lucide-react";
import apiService from "../services/api";

const formatTime = (value) =>
  new Date(value).toLocaleString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "short",
  });

const EmptyState = ({ title, message }) => (
  <div className="flex flex-col items-center justify-center text-center py-6 text-gray-500 space-y-2">
    <Image className="w-10 h-10 opacity-70" />
    <div className="font-semibold text-gray-700">{title}</div>
    <p className="text-sm text-gray-500">{message}</p>
  </div>
);

export default function SchoolWardenPhotoFeed({
  schoolId,
  schoolName,
  layout = "desktop",
}) {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [schools, setSchools] = useState([]);
  const [viewer, setViewer] = useState({ isOpen: false, index: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const normalizedSchoolId = useMemo(() => {
    if (!schoolId) return "";
    return String(schoolId).trim();
  }, [schoolId]);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || layout === "mobile");
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [layout]);

  // Inject CSS to hide scrollbar on mobile
  useEffect(() => {
    if (!isMobile) return;
    const style = document.createElement('style');
    style.textContent = `
      .warden-photo-feed-scroll::-webkit-scrollbar {
        display: none;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, [isMobile]);

  useEffect(() => {
    let isMounted = true;
    const fetchSchools = async () => {
      try {
        const data = await apiService.getSchools();
        if (isMounted) {
          setSchools(Array.isArray(data) ? data : data?.schools || []);
        }
      } catch (err) {
        console.warn("Unable to load schools for warden photo feed:", err);
      }
    };

    fetchSchools();
    return () => {
      isMounted = false;
    };
  }, []);

  const matchedSchool = useMemo(() => {
    if (!schools.length && !schoolName) return null;
    const targets = [normalizedSchoolId, schoolName]
      .filter(Boolean)
      .map((value) => value.toLowerCase());

    return (
      schools.find((school) => {
        const { licenseNumber, _id, id, legacyId, name } = school || {};
        const candidates = [
          licenseNumber,
          _id,
          id,
          legacyId,
          name,
          licenseNumber && `${name} (${licenseNumber})`,
          name && `${name} ()`,
        ]
          .filter(Boolean)
          .map((value) => String(value).trim().toLowerCase());

        return targets.some(
          (target) => target && candidates.includes(target)
        );
      }) || null
    );
  }, [schools, normalizedSchoolId, schoolName]);

  const preferredServerId =
    matchedSchool?.licenseNumber ||
    matchedSchool?._id ||
    (normalizedSchoolId && /\D/.test(normalizedSchoolId)
      ? normalizedSchoolId
      : "");

  const resolvePhotoUrl = (photo = {}) => {
    if (photo.url && photo.url.startsWith("http")) {
      return photo.url;
    }

    if (photo.url && photo.url.startsWith("data:")) {
      return photo.url;
    }

    const relativePath = photo.localPath || photo.path || photo.url;
    if (relativePath) {
      if (/^https?:\/\//i.test(relativePath)) return relativePath;
      const normalized = relativePath.startsWith("/")
        ? relativePath.slice(1)
        : relativePath;
      return `${window.location.origin}/${normalized}`;
    }

    if (photo.photoUrl) {
      return photo.photoUrl;
    }

    return "";
  };

  const fetchPhotos = async () => {
    const identifier = preferredServerId || normalizedSchoolId || schoolName;
    if (!identifier) {
      setPhotos([]);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await apiService.getSchoolPhotos(identifier);
      const dataArray = Array.isArray(response) ? response : response?.photos || [];

      const inspectionPhotos = dataArray
        .filter((photo) => {
          const type = (photo?.photoType || photo?.type || "inspection").toLowerCase();
          return type === "inspection";
        })
        .map((photo) => {
          const photoUrl = resolvePhotoUrl(photo);
          return {
            _id: photo.id || photo._id || `${photo.filename || ""}-${photo.uploadDate || ""}`,
            photoUrl,
            mealType: photo.photoType || "inspection",
            uploadedBy: { name: photo.inspector || "Inspector" },
            timestamp: photo.uploadDate || photo.date || photo.createdAt,
            schoolId: photo.schoolId || photo.schoolName || matchedSchool?.name || normalizedSchoolId,
          };
        })
        .filter((photo) => !!photo.photoUrl);

      setPhotos(inspectionPhotos);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Failed to fetch inspection photos", err);
      setError("Unable to load latest uploads");
      setPhotos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!normalizedSchoolId && !schoolName) {
      setPhotos([]);
      return;
    }
    fetchPhotos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [normalizedSchoolId, schoolName, preferredServerId]);

  if (!normalizedSchoolId && !schoolName) {
    return (
      <div className="bg-white border rounded-xl p-4 sm:p-5">
        <EmptyState
          title="Select a school to view uploads"
          message="Photos from the assigned warden will appear here once a school is chosen."
        />
      </div>
    );
  }

  // Swipe gesture handlers for mobile photo viewer
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (Math.abs(distance) > minSwipeDistance) {
      if (distance > 0) {
        // Swipe left - next photo
        setViewer((prev) => ({
          ...prev,
          index: (prev.index + 1) % photos.length,
        }));
      } else {
        // Swipe right - previous photo
        setViewer((prev) => ({
          ...prev,
          index: (prev.index - 1 + photos.length) % photos.length,
        }));
      }
    }
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  const header = (
    <div className={`flex ${isMobile ? 'flex-col items-start' : 'flex-wrap items-center'} justify-between gap-2`}>
      <div className="flex-1 min-w-0">
        <p className={`${isMobile ? 'text-[10px]' : 'text-xs'} uppercase tracking-wide text-indigo-500 font-semibold break-words`}>
          Latest Warden Uploads
        </p>
        <h3 className={`${isMobile ? 'text-sm' : 'text-base sm:text-lg'} font-semibold text-gray-900 flex items-start gap-2 min-w-0 flex-wrap`}>
          <School className={`${isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4'} text-indigo-400 flex-shrink-0 mt-0.5`} />
          <span className="break-words min-w-0">{schoolName || normalizedSchoolId}</span>
        </h3>
        {lastUpdated && (
          <p className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-gray-500 mt-1 break-words`}>
            Updated {formatTime(lastUpdated)}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={fetchPhotos}
        disabled={loading}
        className={`inline-flex items-center gap-2 ${isMobile ? 'text-xs px-3 py-1.5' : 'text-sm px-2 py-1'} font-medium text-indigo-600 active:text-indigo-700 disabled:text-gray-400 touch-manipulation ${isMobile ? 'self-end' : ''}`}
        aria-label="Refresh photos"
      >
        <RefreshCw
          className={`${isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4'} ${loading ? "animate-spin" : ""}`}
        />
        {!isMobile && <span>Refresh</span>}
      </button>
    </div>
  );

  return (
    <div className={`bg-white border ${isMobile ? 'rounded-xl p-3' : 'rounded-2xl p-4 sm:p-5'} shadow-sm`}>
      {header}
      {error && (
        <div className="mt-4 flex items-center gap-2 text-sm text-red-600">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      <div
        className={`mt-4 ${
          isMobile
            ? "flex gap-2.5 overflow-x-auto pb-2 -mx-3 px-3 snap-x snap-mandatory warden-photo-feed-scroll"
            : "grid grid-cols-2 md:grid-cols-3 gap-3"
        }`}
        style={isMobile ? { 
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        } : {}}
      >
        {loading
          ? Array.from({ length: isMobile ? 3 : 6 }).map((_, idx) => (
              <div
                key={`skeleton-${idx}`}
                className={`bg-gray-100 rounded-xl animate-pulse ${
                  isMobile ? "min-w-[150px] h-36 snap-start flex-shrink-0" : "h-32"
                }`}
              />
            ))
          : null}

        {!loading && photos.length === 0 && (
          <div className={isMobile ? "w-full" : "col-span-full w-full"}>
            <EmptyState
              title="No uploads yet"
              message="Once the warden submits photos for this school, they will show here."
            />
          </div>
        )}

        {!loading &&
          photos.map((photo, idx) => (
            <figure
              key={photo._id || photo.id}
              className={`relative rounded-xl overflow-hidden bg-gray-100 border ${
                isMobile ? "min-w-[150px] snap-start flex-shrink-0" : ""
              } cursor-pointer active:scale-95 transition-transform touch-manipulation`}
              onClick={() => setViewer({ isOpen: true, index: idx })}
            >
              <img
                src={photo.photoUrl}
                alt={photo.mealType || "Meal"}
                className={`w-full ${isMobile ? 'h-36' : 'h-32'} object-cover`}
                loading="lazy"
              />
              <figcaption className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent ${isMobile ? 'p-1.5' : 'p-2'} ${isMobile ? 'text-[10px]' : 'text-xs'} text-white`}>
                <div className="flex justify-between items-start gap-2 min-w-0 flex-wrap">
                  <span className="capitalize font-semibold break-words min-w-0">
                    {photo.mealType}
                  </span>
                  {!isMobile && <span className="ml-2 break-words min-w-0 flex-shrink-0">{photo.uploadedBy?.name || "Warden"}</span>}
                </div>
                <p className={`${isMobile ? 'text-[9px]' : 'text-[11px]'} text-white/80 mt-0.5 break-words`}>
                  {photo.timestamp ? formatTime(photo.timestamp) : ""}
                </p>
              </figcaption>
            </figure>
          ))}
      </div>

      {viewer.isOpen && photos[viewer.index] && (
        <div 
          className="fixed inset-0 bg-black z-50 flex flex-col overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Mobile-optimized header */}
          <div className={`flex justify-between items-start ${isMobile ? 'px-3 py-2.5' : 'px-4 py-3'} text-white bg-black/90 backdrop-blur-sm sticky top-0 z-10 gap-2`}>
            <div className="flex-1 min-w-0">
              <p className={`${isMobile ? 'text-[10px]' : 'text-sm'} uppercase tracking-wide text-white/60 break-words min-w-0`}>
                {photos[viewer.index].mealType || "Meal"}
                {!isMobile && ` • ${photos[viewer.index].schoolId}`}
              </p>
              <p className={`${isMobile ? 'text-sm' : 'text-lg'} font-semibold break-words min-w-0`}>
                {photos[viewer.index].uploadedBy?.name || "Warden"}
              </p>
              {!isMobile && (
                <p className="text-xs text-white/60 break-words">
                  {photos[viewer.index].timestamp
                    ? formatTime(photos[viewer.index].timestamp)
                    : ""}
                </p>
              )}
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              {!isMobile && (
                <>
                  <button
                    type="button"
                    className="p-2 text-white/80 hover:text-white active:bg-white/10 rounded-lg touch-manipulation flex-shrink-0"
                    onClick={() =>
                      setViewer((prev) => ({
                        ...prev,
                        index:
                          (prev.index - 1 + photos.length) % photos.length,
                      }))
                    }
                    aria-label="Previous photo"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    className="p-2 text-white/80 hover:text-white active:bg-white/10 rounded-lg touch-manipulation flex-shrink-0"
                    onClick={() =>
                      setViewer((prev) => ({
                        ...prev,
                        index: (prev.index + 1) % photos.length,
                      }))
                    }
                    aria-label="Next photo"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
              <button
                type="button"
                className={`${isMobile ? 'p-2.5' : 'p-2'} text-white/80 active:text-white active:bg-white/10 rounded-lg touch-manipulation flex-shrink-0`}
                onClick={() => setViewer({ isOpen: false, index: 0 })}
                aria-label="Close preview"
              >
                <X className={isMobile ? "w-5 h-5" : "w-4 h-4"} />
              </button>
            </div>
          </div>

          {/* Photo display area with swipe support */}
          <div className="flex-1 flex items-center justify-center px-2 sm:px-4 pb-4 sm:pb-6 overflow-y-auto relative">
            <img
              src={photos[viewer.index].photoUrl}
              alt={photos[viewer.index].mealType || "Meal"}
              className={`${isMobile ? 'max-h-[85vh]' : 'max-h-[80vh]'} max-w-full object-contain ${isMobile ? 'rounded-lg' : 'rounded-2xl'} shadow-2xl select-none`}
              draggable={false}
            />
            
            {/* Mobile swipe indicators */}
            {isMobile && photos.length > 1 && (
              <>
                <button
                  type="button"
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-3 bg-black/50 text-white rounded-full active:bg-black/70 touch-manipulation z-20"
                  onClick={() =>
                    setViewer((prev) => ({
                      ...prev,
                      index: (prev.index - 1 + photos.length) % photos.length,
                    }))
                  }
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-black/50 text-white rounded-full active:bg-black/70 touch-manipulation z-20"
                  onClick={() =>
                    setViewer((prev) => ({
                      ...prev,
                      index: (prev.index + 1) % photos.length,
                    }))
                  }
                  aria-label="Next photo"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Mobile footer with photo counter */}
          {isMobile && photos.length > 1 && (
            <div className="px-4 py-2 bg-black/80 text-white text-center text-xs">
              {viewer.index + 1} / {photos.length}
            </div>
          )}
        </div>
      )}
    </div>
  );
}


