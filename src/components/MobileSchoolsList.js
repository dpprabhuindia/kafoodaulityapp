import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Phone, 
  ChevronRight,
  ChevronDown,
  X,
  Store
} from 'lucide-react';
import { detectDevice, triggerHaptic } from '../utils/deviceDetection';
import { useI18n } from '../i18n/I18nProvider';

const MobileSchoolsList = ({ schools, onSchoolSelect, onInspect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const device = detectDevice();
  const { t } = useI18n();

  const filteredSchools = schools.filter(school => {
    const matchesSearch = school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         school.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = selectedLevel === 'all' || school.level === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  const getRatingColor = (rating) => {
    const colors = {
      'A': 'bg-green-100 text-green-800 border-green-200',
      'B+': 'bg-blue-100 text-blue-800 border-blue-200',
      'B': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'C': 'bg-orange-100 text-orange-800 border-orange-200',
      'D': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[rating] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getLevelColor = (level) => {
    const colors = {
      'State Level': 'bg-purple-100 text-purple-800',
      'District Level': 'bg-blue-100 text-blue-800',
      'Taluk Level': 'bg-green-100 text-green-800'
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  // iOS Style
  if (device.isIOS) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-gray-200 px-4 py-3">
          <h1 className="text-xl font-bold text-gray-900 mb-3">{t('schools.title')}</h1>
          
          {/* Search and Filter Row */}
          <div className="flex gap-2">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('schools.searchPlaceholder')}
                className="w-full pl-10 pr-10 py-3 bg-gray-100 border-0 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all text-base"
              />
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    triggerHaptic('light');
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              )}
            </div>

            {/* Category Dropdown */}
            <div className="relative">
              <select
                value={selectedLevel}
                onChange={(e) => {
                  setSelectedLevel(e.target.value);
                  triggerHaptic('light');
                }}
                className="appearance-none bg-gray-100 border-0 rounded-xl pl-4 pr-10 py-3 text-sm font-medium text-gray-700 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
              >
                <option value="all">{t('schools.allLevels')}</option>
                <option value="State Level">{t('inspection.levels.state')}</option>
                <option value="District Level">{t('inspection.levels.district')}</option>
                <option value="Taluk Level">{t('inspection.levels.taluk')}</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Schools List (Grouped by Level) */}
        <div className="px-4 py-4 space-y-4">
          {['State Level','District Level','Taluk Level']
            .filter(level => selectedLevel === 'all' || selectedLevel === level)
            .map(level => {
              const label = level === 'State Level' ? t('inspection.levels.state')
                          : level === 'District Level' ? t('inspection.levels.district')
                          : t('inspection.levels.taluk');
              const ratingOrder = { 'A': 1, 'B+': 2, 'B': 3, 'C': 4, 'D': 5 };
              const schoolsOfLevel = filteredSchools
                .filter(s => s.level === level)
                .sort((a, b) => {
                  const ra = ratingOrder[a.rating] || 99;
                  const rb = ratingOrder[b.rating] || 99;
                  if (ra !== rb) return ra - rb;
                  return a.name.localeCompare(b.name);
                });
              if (schoolsOfLevel.length === 0) return null;
              return (
                <div key={level} className="space-y-3">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-1">{label}</div>
                  {schoolsOfLevel.map((school) => (
                    <div
                      key={school.id}
                      onClick={() => {
                        triggerHaptic('light');
                        onSchoolSelect(school);
                      }}
                      className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 active:scale-98 transition-transform"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-base mb-1">{school.name}</h3>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getLevelColor(school.level)}`}>
                              {label}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-lg border font-bold ${getRatingColor(school.rating)}`}>
                              {school.rating}
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
                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                          <span className="text-xs text-gray-500">{t('schools.lastPrefix')} {school.lastInspection}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              triggerHaptic('medium');
                              onInspect(school.id);
                            }}
                            className="px-3 py-1.5 bg-blue-500 text-white text-xs font-medium rounded-lg active:scale-95 transition-transform"
                          >
                            {t('schools.inspect')}
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
            <p className="text-gray-500">{t('schools.noneFound')}</p>
          </div>
        )}
      </div>
    );
  }

  // Android Material Design Style
  if (device.isAndroid) {
    return (
      <div className="min-h-screen bg-gray-100 pb-20">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white shadow-sm px-4 py-3">
          <h1 className="text-lg font-bold text-gray-900 mb-3">{t('schools.title')}</h1>
          
          {/* Search and Filter Row */}
          <div className="flex gap-2">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('schools.searchPlaceholder')}
                className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors text-base"
              />
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    triggerHaptic('light');
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              )}
            </div>

            {/* Category Dropdown */}
            <div className="relative">
              <select
                value={selectedLevel}
                onChange={(e) => {
                  setSelectedLevel(e.target.value);
                  triggerHaptic('light');
                }}
                className="appearance-none bg-gray-50 border border-gray-300 rounded-lg pl-3 pr-9 py-2.5 text-sm font-medium text-gray-700 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors cursor-pointer"
              >
                <option value="all">{t('schools.allLevels')}</option>
                <option value="State Level">{t('inspection.levels.state')}</option>
                <option value="District Level">{t('inspection.levels.district')}</option>
                <option value="Taluk Level">{t('inspection.levels.taluk')}</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Schools List (Grouped by Level) */}
        <div className="p-3 space-y-3">
          {['State Level','District Level','Taluk Level']
            .filter(level => selectedLevel === 'all' || selectedLevel === level)
            .map(level => {
              const label = level === 'State Level' ? t('inspection.levels.state')
                          : level === 'District Level' ? t('inspection.levels.district')
                          : t('inspection.levels.taluk');
              const schoolsOfLevel = filteredSchools.filter(s => s.level === level);
              if (schoolsOfLevel.length === 0) return null;
              return (
                <div key={level} className="space-y-2">
                  <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide px-1">{label}</div>
                  {schoolsOfLevel.map((school) => (
                    <div
                      key={school.id}
                      onClick={() => {
                        triggerHaptic('light');
                        onSchoolSelect(school);
                      }}
                      className="bg-white rounded-lg p-3 shadow-sm border border-gray-200 active:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-sm mb-1">{school.name}</h3>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-[11px] px-2 py-0.5 rounded font-medium ${getLevelColor(school.level)}`}>
                              {label}
                            </span>
                            <span className={`text-[11px] px-2 py-0.5 rounded border font-bold ${getRatingColor(school.rating)}`}>
                              {school.rating}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
                      </div>

                      <div className="space-y-1.5 text-sm text-gray-600">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span className="truncate text-xs">{school.location}</span>
                        </div>
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span className="text-xs">{school.phone}</span>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                          <span className="text-xs text-gray-500">{t('schools.lastPrefix')} {school.lastInspection}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              triggerHaptic('medium');
                              onInspect(school.id);
                            }}
                            className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded active:shadow-lg transition-shadow uppercase"
                          >
                            {t('schools.inspect')}
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
            <p className="text-gray-500 text-sm">{t('schools.noneFound')}</p>
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default MobileSchoolsList;
