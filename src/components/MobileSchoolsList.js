import React, { useState } from "react";
import {
  Search,
  MapPin,
  Phone,
  ChevronRight,
  ChevronDown,
  Store,
  Eye,
  Pencil,
  ClipboardList,
} from "lucide-react";
import { triggerHaptic } from "../utils/deviceDetection";
import { useI18n } from "../i18n/I18nProvider";

const MobileSchoolsList = ({
  schools,
  onSchoolSelect,
  onInspect,
  onNewInspection,
  onAddSchool,
  onViewSchool,
  onEditSchool,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("all");

  const { t } = useI18n();

  const filteredSchools = schools.filter((school) => {
    const matchesSearch =
      school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel =
      selectedLevel === "all" || school.level === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  const getRatingColor = (rating) => {
    const colors = {
      A: "bg-green-100 text-green-800 border-green-200",
      "B+": "bg-blue-100 text-blue-800 border-blue-200",
      B: "bg-yellow-100 text-yellow-800 border-yellow-200",
      C: "bg-orange-100 text-orange-800 border-orange-200",
      D: "bg-red-100 text-red-800 border-red-200",
    };
    return colors[rating] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getLevelColor = (level) => {
    const colors = {
      "State Level": "bg-purple-100 text-purple-800",
      "District Level": "bg-blue-100 text-blue-800",
      "Taluk Level": "bg-green-100 text-green-800",
    };
    return colors[level] || "bg-gray-100 text-gray-800";
  };

  const getStatusColor = (status) => {
    const colors = {
      Active: "bg-green-100 text-green-700",
      "Under Review": "bg-yellow-100 text-yellow-700",
      Suspended: "bg-red-100 text-red-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  const handleView = (school) => {
    triggerHaptic("light");
    if (onViewSchool) {
      onViewSchool(school);
    } else if (onSchoolSelect) {
      onSchoolSelect(school);
    }
  };

  const handleEdit = (school) => {
    triggerHaptic("medium");
    if (onEditSchool) {
      onEditSchool(school);
    }
  };

  const callInspect = (schoolId) => {
    triggerHaptic("medium");
    onInspect && onInspect(schoolId);
  };

  const callNewInspection = () => {
    triggerHaptic("light");
    onNewInspection && onNewInspection();
  };

  const callAddSchool = () => {
    triggerHaptic("light");
    onAddSchool && onAddSchool();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <h1 className="text-lg font-bold text-gray-900 mb-3">
          Karnataka Government School Management
        </h1>

        {/* Search and Filter Row */}
        <div className="space-y-3">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search government schools..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border-0 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all text-sm"
            />
          </div>
          <div className="flex gap-3 py-2">
            {/* Status Dropdown */}
            <div className="relative">
              <select
                value={selectedLevel}
                onChange={(e) => {
                  setSelectedLevel(e.target.value);
                  triggerHaptic("light");
                }}
                className="appearance-none bg-gray-100 border-0 rounded-lg pl-3 pr-8 py-2.5 text-sm font-medium text-gray-700 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer min-w-[100px]"
              >
                <option value="all">All Status</option>
                <option value="Active">Active</option>
                <option value="Under Review">Under Review</option>
                <option value="Suspended">Suspended</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* More Filters Button */}
            <button className="bg-gray-100 px-3 py-2.5 rounded-lg flex items-center gap-1 text-sm font-medium text-gray-700 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all">
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
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z"
                />
              </svg>
              More Filters
            </button>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="flex gap-3 py-2">
          <button
            onClick={callNewInspection}
            className="flex-1 bg-green-600 active:bg-green-700 text-white py-3 rounded-xl font-semibold text-sm"
          >
            {t("schools.newInspection") || "New Inspection"}
          </button>
          <button
            onClick={callAddSchool}
            className="flex-1 bg-blue-600 active:bg-blue-700 text-white py-3 rounded-xl font-semibold text-sm"
          >
            {t("establishments.buttons.addSchool") || "Add School"}
          </button>
        </div>
      </div>

      {/* Schools List (Grouped by Level) */}
      <div className="px-4 py-4 space-y-4 pb-6">
        {["State Level", "District Level", "Taluk Level"]
          .filter(
            (level) => selectedLevel === "all" || selectedLevel === level
          )
          .map((level) => {
            const label =
              level === "State Level"
                ? t("inspection.levels.state") || "State Level"
                : level === "District Level"
                ? t("inspection.levels.district") || "District Level"
                : t("inspection.levels.taluk") || "Taluk Level";
            const ratingOrder = { A: 1, "B+": 2, B: 3, C: 4, D: 5 };
            const schoolsOfLevel = filteredSchools
              .filter((s) => s.level === level)
              .sort((a, b) => {
                const ra = ratingOrder[a.rating] || 99;
                const rb = ratingOrder[b.rating] || 99;
                if (ra !== rb) return ra - rb;
                return a.name.localeCompare(b.name);
              });
            if (schoolsOfLevel.length === 0) return null;
            return (
              <div key={level} className="space-y-3">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-1">
                  {label}
                </div>
                {schoolsOfLevel.map((school) => (
                  <div
                    key={school.id}
                    onClick={() => handleView(school)}
                    className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 active:scale-[0.98] transition-transform"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-base mb-1">
                          {school.name}
                        </h3>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-medium ${getLevelColor(
                              school.level
                            )}`}
                          >
                            {label}
                          </span>
                          <span
                            className={`text-xs px-2 py-1 rounded-lg border font-bold ${getRatingColor(
                              school.rating
                            )}`}
                          >
                            {school.rating}
                          </span>
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(
                              school.status
                            )}`}
                          >
                            {school.status}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
                    </div>

                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className="truncate">{school.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span>{school.phone}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-y-1 pt-3 border-t border-gray-100 text-xs text-gray-500">
                        <span className="font-medium text-gray-600">
                          License
                        </span>
                        <span>{school.licenseNumber}</span>
                        <span className="font-medium text-gray-600">
                          {t("schools.lastPrefix") || "Last Inspection"}
                        </span>
                        <span>{school.lastInspection}</span>
                        <span className="font-medium text-gray-600">
                          Violations
                        </span>
                        <span
                          className={
                            school.violations > 0
                              ? "text-red-600 font-semibold"
                              : "text-green-600 font-semibold"
                          }
                        >
                          {school.violations}
                        </span>
                      </div>

                      <div className="mt-3 flex items-center gap-2 text-xs font-medium">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleView(school);
                          }}
                          className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg flex items-center justify-center gap-1 active:bg-gray-200 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          {t("common.view") || "View"}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(school);
                          }}
                          className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg flex items-center justify-center gap-1 active:bg-gray-200 transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                          {t("common.edit") || "Edit"}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            callInspect(school.id);
                          }}
                          className="flex-1 bg-blue-500 text-white py-2 rounded-lg flex items-center justify-center gap-1 active:bg-blue-600 transition-colors"
                        >
                          <ClipboardList className="w-4 h-4" />
                          {t("schools.inspect") || "Inspect"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
      </div>

      {filteredSchools.length === 0 && (
        <div className="text-center py-12">
          <Store className="w-16 h-16 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">{t("schools.noneFound") || "No schools found"}</p>
        </div>
      )}
    </div>
  );
};

export default MobileSchoolsList;
