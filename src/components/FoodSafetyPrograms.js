import React, { useState } from 'react';
import { 
  ShieldCheck, 
  TrendingUp, 
  Calendar, 
  Users, 
  Target, 
  Award, 
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  FileText,
  Star,
  Activity
} from 'lucide-react';

const FoodSafetyPrograms = () => {
  const [selectedProgram, setSelectedProgram] = useState(null);

  const programs = [
    {
      id: 1,
      name: 'Karnataka Govt School Kitchen HACCP Training',
      description: 'Hazard Analysis and Critical Control Points training for government school kitchen staff',
      status: 'Active',
      participants: 1250,
      budget: 850000,
      spent: 630000,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      coordinator: 'Dr. Rajesh Kumar',
      progress: 74,
      category: 'Training'
    },
    {
      id: 2,
      name: 'Karnataka Govt School Food Handler Certification',
      description: 'Mandatory certification program for all Karnataka government school food service workers',
      status: 'Active',
      participants: 2840,
      budget: 520000,
      spent: 435000,
      startDate: '2024-02-01',
      endDate: '2024-11-30',
      coordinator: 'Priya Sharma',
      progress: 84,
      category: 'Certification'
    },
    {
      id: 3,
      name: 'Karnataka Govt School Nutrition & Hygiene Program',
      description: 'Comprehensive nutrition and hygiene training for Karnataka government school staff',
      status: 'Active',
      participants: 1680,
      budget: 420000,
      spent: 315000,
      startDate: '2024-03-01',
      endDate: '2024-10-31',
      coordinator: 'Amit Patel',
      progress: 75,
      category: 'Training'
    },
    {
      id: 4,
      name: 'Karnataka Govt School Food Safety Monitoring',
      description: 'Regular safety audits and compliance monitoring for Karnataka government schools',
      status: 'Planning',
      participants: 0,
      budget: 750000,
      spent: 125000,
      startDate: '2024-06-01',
      endDate: '2025-05-31',
      coordinator: 'Mohammed Ali',
      progress: 17,
      category: 'Monitoring'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'badge-success';
      case 'Planning': return 'badge-info';
      case 'Completed': return 'badge-primary';
      case 'On Hold': return 'badge-warning';
      default: return 'badge-secondary';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalBudget = programs.reduce((sum, program) => sum + program.budget, 0);
  const totalSpent = programs.reduce((sum, program) => sum + program.spent, 0);
  const totalParticipants = programs.reduce((sum, program) => sum + program.participants, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-card p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent mb-3">
              Karnataka Government School Food Safety Programs
            </h1>
            <p className="text-gray-600 text-lg">
              Monitor and manage Karnataka government school food safety training and certification programs
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-700 rounded-2xl flex items-center justify-center shadow-lg">
              <ShieldCheck className="w-10 h-10 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Programs</p>
              <p className="text-3xl font-bold text-gray-900">{programs.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Participants</p>
              <p className="text-3xl font-bold text-gray-900">{totalParticipants}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Budget Utilization</p>
              <p className="text-3xl font-bold text-gray-900">
                {Math.round((totalSpent / totalBudget) * 100)}%
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Completion</p>
              <p className="text-3xl font-bold text-gray-900">
                {Math.round(programs.reduce((sum, p) => sum + p.progress, 0) / programs.length)}%
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Programs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {programs.map((program) => (
          <div key={program.id} className="glass-card p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{program.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{program.description}</p>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(program.status)}`}>
                  {program.status}
                </span>
                <span className="px-2 py-1 rounded text-xs font-bold bg-blue-100 text-blue-800">
                  {program.category}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Progress</span>
                <span className="text-sm text-gray-600">{program.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${program.progress}%` }}
                ></div>
              </div>
            </div>

            {/* Program Details */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-center mb-1">
                  <Users className="w-4 h-4 text-blue-600 mr-1" />
                </div>
                <p className="text-lg font-bold text-gray-900">{program.participants}</p>
                <p className="text-xs text-gray-600">Participants</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-center mb-1">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
                </div>
                <p className="text-lg font-bold text-gray-900">{program.progress}%</p>
                <p className="text-xs text-gray-600">Progress</p>
              </div>
            </div>

            {/* Budget Information */}
            <div className="border-t pt-4 mb-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600">Budget:</span>
                <span className="font-medium">₹{program.budget.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600">Spent:</span>
                <span className="font-medium text-blue-600">₹{program.spent.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Coordinator:</span>
                <span className="font-medium">{program.coordinator}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <button 
                className="flex-1 btn-secondary text-sm py-2"
                onClick={() => setSelectedProgram(program)}
              >
                <FileText className="w-4 h-4 mr-1" />
                View Details
              </button>
              <button className="flex-1 btn-primary text-sm py-2">
                <Activity className="w-4 h-4 mr-1" />
                Manage
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activities */}
      <div className="glass-card p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Program Activities</h2>
        <div className="space-y-4">
          {[
            {
              id: 1,
              activity: 'HACCP Implementation program milestone completed',
              program: 'HACCP Implementation',
              time: '2 hours ago',
              type: 'success'
            },
            {
              id: 2,
              activity: 'New batch of 25 participants enrolled in Food Handler Certification',
              program: 'Food Handler Certification',
              time: '4 hours ago',
              type: 'info'
            },
            {
              id: 3,
              activity: 'Restaurant Hygiene Standards program budget review scheduled',
              program: 'Restaurant Hygiene Standards',
              time: '1 day ago',
              type: 'warning'
            }
          ].map((activity) => (
            <div key={activity.id} className="flex items-center p-4 bg-gray-50 rounded-xl">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                activity.type === 'success' ? 'bg-green-100' :
                activity.type === 'info' ? 'bg-blue-100' : 'bg-yellow-100'
              }`}>
                {activity.type === 'success' ? <CheckCircle className="w-5 h-5 text-green-600" /> :
                 activity.type === 'info' ? <Activity className="w-5 h-5 text-blue-600" /> :
                 <Clock className="w-5 h-5 text-yellow-600" />}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{activity.activity}</p>
                <p className="text-sm text-gray-600">{activity.program} • {activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FoodSafetyPrograms;
