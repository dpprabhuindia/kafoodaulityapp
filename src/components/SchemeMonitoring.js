import React, { useState } from 'react';
import { BarChart3, TrendingUp, AlertTriangle, CheckCircle, Clock, DollarSign, Users, Target } from 'lucide-react';

const SchemeMonitoring = () => {
  const [selectedScheme, setSelectedScheme] = useState('all');
  const [timeRange, setTimeRange] = useState('monthly');

  const schemes = [
    {
      id: 'pre-matric',
      name: 'Pre-Matric Scholarship',
      totalBeneficiaries: 4250,
      activeBeneficiaries: 3890,
      budgetAllocated: 5000000,
      budgetUtilized: 4200000,
      completionRate: 78,
      status: 'Active',
      lastAudit: '2024-01-10',
      issues: 2
    },
    {
      id: 'post-matric',
      name: 'Post-Matric Scholarship',
      totalBeneficiaries: 3200,
      activeBeneficiaries: 2950,
      budgetAllocated: 8000000,
      budgetUtilized: 7100000,
      completionRate: 89,
      status: 'Active',
      lastAudit: '2024-01-08',
      issues: 1
    },
    {
      id: 'skill-dev',
      name: 'Skill Development Program',
      totalBeneficiaries: 1800,
      activeBeneficiaries: 1650,
      budgetAllocated: 3500000,
      budgetUtilized: 2800000,
      completionRate: 92,
      status: 'Active',
      lastAudit: '2024-01-12',
      issues: 0
    },
    {
      id: 'self-employment',
      name: 'Self Employment Scheme',
      totalBeneficiaries: 950,
      activeBeneficiaries: 820,
      budgetAllocated: 6000000,
      budgetUtilized: 4500000,
      completionRate: 86,
      status: 'Active',
      lastAudit: '2024-01-05',
      issues: 3
    }
  ];

  const performanceMetrics = [
    { label: 'Budget Utilization', value: 85, target: 90, unit: '%' },
    { label: 'Beneficiary Satisfaction', value: 88, target: 85, unit: '%' },
    { label: 'Scheme Completion Rate', value: 84, target: 80, unit: '%' },
    { label: 'Audit Compliance', value: 92, target: 95, unit: '%' }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'audit',
      scheme: 'Skill Development Program',
      activity: 'Audit completed successfully',
      date: '2024-01-12',
      status: 'success'
    },
    {
      id: 2,
      type: 'alert',
      scheme: 'Self Employment Scheme',
      activity: 'Budget utilization below target',
      date: '2024-01-11',
      status: 'warning'
    },
    {
      id: 3,
      type: 'update',
      scheme: 'Post-Matric Scholarship',
      activity: 'New beneficiaries added',
      date: '2024-01-10',
      status: 'info'
    },
    {
      id: 4,
      type: 'audit',
      scheme: 'Pre-Matric Scholarship',
      activity: 'Audit scheduled for next week',
      date: '2024-01-09',
      status: 'info'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'audit': return <CheckCircle className="w-4 h-4" />;
      case 'alert': return <AlertTriangle className="w-4 h-4" />;
      case 'update': return <TrendingUp className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getActivityColor = (status) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'info': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredSchemes = selectedScheme === 'all' ? schemes : schemes.filter(s => s.id === selectedScheme);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Scheme Monitoring</h1>
        <p className="text-gray-600">Track performance and progress of minority welfare schemes</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Scheme</label>
            <select
              value={selectedScheme}
              onChange={(e) => setSelectedScheme(e.target.value)}
              className="input-field"
            >
              <option value="all">All Schemes</option>
              {schemes.map(scheme => (
                <option key={scheme.id} value={scheme.id}>{scheme.name}</option>
              ))}
            </select>
          </div>
          <div className="md:w-48">
            <label className="block text-sm font-medium text-gray-700 mb-2">Time Range</label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="input-field"
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {performanceMetrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">{metric.label}</h3>
              <Target className="w-5 h-5 text-gray-400" />
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">{metric.value}{metric.unit}</p>
                <p className="text-sm text-gray-500">Target: {metric.target}{metric.unit}</p>
              </div>
              <div className={`text-sm font-medium ${
                metric.value >= metric.target ? 'text-green-600' : 'text-red-600'
              }`}>
                {metric.value >= metric.target ? '↗' : '↘'}
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    metric.value >= metric.target ? 'bg-green-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min((metric.value / metric.target) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Scheme Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSchemes.map((scheme) => (
          <div key={scheme.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{scheme.name}</h3>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(scheme.status)}`}>
                  {scheme.status}
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Last Audit</p>
                <p className="text-sm font-medium text-gray-900">{scheme.lastAudit}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <Users className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                <p className="text-sm text-gray-600">Total Beneficiaries</p>
                <p className="text-lg font-bold text-gray-900">{scheme.totalBeneficiaries.toLocaleString()}</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-1" />
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-lg font-bold text-gray-900">{scheme.activeBeneficiaries.toLocaleString()}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Budget Utilization</span>
                <span className="text-sm font-medium text-gray-900">
                  ₹{(scheme.budgetUtilized / 1000000).toFixed(1)}M / ₹{(scheme.budgetAllocated / 1000000).toFixed(1)}M
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${(scheme.budgetUtilized / scheme.budgetAllocated) * 100}%` }}
                />
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Completion Rate</span>
                <span className="text-sm font-medium text-gray-900">{scheme.completionRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${scheme.completionRate}%` }}
                />
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-sm text-gray-600">Issues</span>
                <span className={`text-sm font-medium ${
                  scheme.issues === 0 ? 'text-green-600' : scheme.issues <= 2 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {scheme.issues} {scheme.issues === 1 ? 'issue' : 'issues'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activities</h2>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
              <div className={`p-2 rounded-full ${getActivityColor(activity.status)}`}>
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{activity.activity}</p>
                    <p className="text-sm text-gray-600">{activity.scheme}</p>
                  </div>
                  <span className="text-xs text-gray-500">{activity.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors duration-200">
            <BarChart3 className="h-8 w-8 text-gray-400 mr-3" />
            <span className="text-gray-600 font-medium">Generate Performance Report</span>
          </button>
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors duration-200">
            <AlertTriangle className="h-8 w-8 text-gray-400 mr-3" />
            <span className="text-gray-600 font-medium">Schedule Audit</span>
          </button>
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors duration-200">
            <TrendingUp className="h-8 w-8 text-gray-400 mr-3" />
            <span className="text-gray-600 font-medium">View Analytics</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SchemeMonitoring;
