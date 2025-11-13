import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Star, 
  Award, 
  Target, 
  Building, 
  Shield, 
  Camera, 
  Download, 
  Plus, 
  BarChart3,
  Store,
  ShieldCheck,
  Activity
} from 'lucide-react';
import KarnatakaLogo from './KarnatakaLogo';
import { useI18n } from '../i18n/I18nProvider';

const Dashboard = () => {
  const navigate = useNavigate();
  const { t } = useI18n();
  const stats = [
    {
      nameKey: 'karnatakaGovtSchools',
      value: '8,547',
      change: '+12%',
      changeType: 'increase',
      icon: Store,
      color: 'bg-blue-500'
    },
    {
      nameKey: 'pendingInspections',
      value: '142',
      change: '-8',
      changeType: 'decrease',
      icon: FileText,
      color: 'bg-yellow-500'
    },
    {
      nameKey: 'safetyCompliance',
      value: '89.2%',
      change: '+2.1%',
      changeType: 'increase',
      icon: CheckCircle,
      color: 'bg-purple-500'
    }
  ];

  const recentInspections = [
    {
      id: 1,
      establishment: 'Government High School Bangalore North',
      location: 'Bangalore North, Karnataka',
      status: 'Completed',
      date: '2024-01-15',
      inspector: 'Rajesh Kumar',
      findings: 'Minor kitchen ventilation issues',
      rating: 'B+',
      photos: 12
    },
    {
      id: 2,
      establishment: 'Government Primary School Mysore',
      location: 'Mysore, Karnataka',
      status: 'In Progress',
      date: '2024-01-12',
      inspector: 'Priya Sharma',
      findings: 'Under inspection',
      rating: 'Pending',
      photos: 8
    },
    {
      id: 3,
      establishment: 'Government Higher Secondary School Hubli',
      location: 'Hubli, Karnataka',
      status: 'Completed',
      date: '2024-01-10',
      inspector: 'Amit Patel',
      findings: 'Good food safety standards',
      rating: 'A',
      photos: 15
    }
  ];

  const alerts = [
    {
      id: 1,
      type: 'warning',
      message: 'High number of food safety violations in Bangalore district government schools',
      time: '2 hours ago'
    },
    {
      id: 2,
      type: 'info',
      message: 'New Karnataka government school food safety certification deadline approaching',
      time: '4 hours ago'
    },
    {
      id: 3,
      type: 'success',
      message: 'Monthly Karnataka government school food safety report generated successfully',
      time: '1 day ago'
    }
  ];

  const quickActions = [
    {
      titleKey: 'newGovtSchoolInspection',
      descKey: 'newGovtSchoolInspectionDesc',
      icon: FileText,
      color: 'bg-blue-500',
      href: '/audit'
    },
    {
      titleKey: 'manageGovtSchools',
      descKey: 'manageGovtSchoolsDesc',
      icon: Store,
      color: 'bg-green-500',
      href: '/establishments'
    },
    {
      titleKey: 'generateReports',
      descKey: 'generateReportsDesc',
      icon: TrendingUp,
      color: 'bg-orange-500',
      href: '/reports'
    }
  ];

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 px-2 sm:px-4">
      {/* Header */}
      <div className="glass-card p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center min-w-0 flex-1">
            <KarnatakaLogo size="lg" className="mr-3 sm:mr-4 lg:mr-6 flex-shrink-0 hidden sm:block" />
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent mb-2 sm:mb-3 break-words">
                {t('dashboard.title')}
              </h1>
              <p className="text-gray-600 text-sm sm:text-base lg:text-lg">
                {t('dashboard.subtitle')}
              </p>
            </div>
          </div>
          <div className="hidden md:block flex-shrink-0 ml-4">
            <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
              <Shield className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="stat-card group">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className={`${stat.color} p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                </div>
                <div className={`text-xl sm:text-2xl font-bold ${
                  stat.changeType === 'increase' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {stat.changeType === 'increase' ? '↗' : '↘'}
                </div>
              </div>
              <div className="space-y-1 sm:space-y-2">
                <p className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide">{t(`dashboard.${stat.nameKey}`)}</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stat.value}</p>
                <div className="flex items-center flex-wrap gap-1 sm:gap-2">
                  <span className={`text-xs sm:text-sm font-semibold px-2 py-1 rounded-full ${
                    stat.changeType === 'increase' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-xs text-gray-500">{t('dashboard.fromLastMonth')}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        {/* Recent Inspections */}
        <div className="glass-card p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{t('dashboard.recentInspections')}</h2>
            <button className="btn-primary w-full sm:w-auto text-sm sm:text-base min-h-[44px] touch-manipulation">
              {t('dashboard.viewAll')}
            </button>
          </div>
          <div className="space-y-3 sm:space-y-4">
            {recentInspections.map((inspection) => (
              <div key={inspection.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-xl active:bg-gray-100 sm:hover:bg-gray-100 transition-colors gap-3 sm:gap-0">
                <div className="flex items-start sm:items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Store className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{inspection.establishment}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 flex items-center mt-1">
                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                      <span className="truncate">{inspection.location}</span>
                    </p>
                    <p className="text-xs text-gray-500 flex items-center mt-1">
                      <Camera className="w-3 h-3 mr-1 flex-shrink-0" />
                      {inspection.photos} {t('dashboard.photosUploaded')}
                    </p>
                  </div>
                </div>
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start w-full sm:w-auto gap-2 sm:gap-1">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                      inspection.status === 'Completed' ? 'badge-success' : 
                      inspection.status === 'In Progress' ? 'badge-warning' : 'badge-info'
                    }`}>
                      {inspection.status === 'Completed' ? t('dashboard.completed') : 
                       inspection.status === 'In Progress' ? t('dashboard.inProgress') : 
                       t('dashboard.pending')}
                    </span>
                    {inspection.rating !== 'Pending' && (
                      <span className={`px-2 py-1 rounded text-xs font-bold whitespace-nowrap ${
                        inspection.rating === 'A' ? 'bg-green-100 text-green-800' :
                        inspection.rating === 'B+' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {inspection.rating}
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 flex items-center">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                    {inspection.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts & Notifications */}
        <div className="glass-card p-4 sm:p-6 lg:p-8">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{t('dashboard.alertsNotifications')}</h2>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
            </div>
          </div>
          <div className="space-y-3 sm:space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="group p-3 sm:p-4 rounded-xl border border-gray-100 active:border-orange-200 active:bg-orange-50/30 sm:hover:border-orange-200 sm:hover:bg-orange-50/30 transition-all duration-200">
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className={`p-2 rounded-xl flex-shrink-0 ${
                    alert.type === 'warning' ? 'bg-yellow-100' :
                    alert.type === 'info' ? 'bg-blue-100' :
                    'bg-green-100'
                  }`}>
                    {alert.type === 'warning' ? <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" /> :
                     alert.type === 'info' ? <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" /> :
                     <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 group-hover:text-orange-700 transition-colors break-words">{alert.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-4 sm:mt-6 w-full btn-secondary min-h-[44px] touch-manipulation text-sm sm:text-base">
            {t('dashboard.viewAllNotifications')}
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{t('dashboard.quickActions')}</h2>
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button 
                key={index}
                onClick={() => navigate(action.href)}
                className="card-hover group text-left p-4 sm:p-6 bg-white rounded-xl border border-gray-200 active:border-blue-300 active:shadow-lg sm:hover:border-blue-300 sm:hover:shadow-lg transition-all duration-200 touch-manipulation min-h-[120px] sm:min-h-[140px]"
              >
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 ${action.color} rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div className="text-gray-400 group-hover:text-blue-500 transition-colors text-lg sm:text-xl">→</div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base group-hover:text-blue-700 transition-colors">
                  {t(`dashboard.${action.titleKey}`)}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 group-hover:text-gray-700 transition-colors">
                  {t(`dashboard.${action.descKey}`)}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
