import React, { useState } from 'react';
import { Search, Plus, Edit, Eye, Filter, Download, Users, Phone, Mail, MapPin } from 'lucide-react';

const BeneficiaryManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterScheme, setFilterScheme] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);

  const beneficiaries = [
    {
      id: 'BEN001',
      name: 'Mohammed Ahmed',
      fatherName: 'Abdul Rahman',
      phone: '+91-9876543210',
      email: 'mohammed.ahmed@email.com',
      address: 'House No. 123, Sector 15, Delhi',
      scheme: 'Pre-Matric Scholarship',
      status: 'Active',
      amount: 12000,
      category: 'Muslim',
      education: 'Class 10',
      joinDate: '2023-04-15'
    },
    {
      id: 'BEN002',
      name: 'Fatima Khan',
      fatherName: 'Salim Khan',
      phone: '+91-9876543211',
      email: 'fatima.khan@email.com',
      address: 'Plot No. 456, Bandra, Mumbai',
      scheme: 'Post-Matric Scholarship',
      status: 'Active',
      amount: 25000,
      category: 'Muslim',
      education: 'Graduate',
      joinDate: '2023-03-20'
    },
    {
      id: 'BEN003',
      name: 'John Thomas',
      fatherName: 'Thomas John',
      phone: '+91-9876543212',
      email: 'john.thomas@email.com',
      address: 'Church Street, Kochi, Kerala',
      scheme: 'Skill Development Program',
      status: 'Completed',
      amount: 15000,
      category: 'Christian',
      education: 'Class 12',
      joinDate: '2023-01-10'
    },
    {
      id: 'BEN004',
      name: 'Priya Sharma',
      fatherName: 'Raj Sharma',
      phone: '+91-9876543213',
      email: 'priya.sharma@email.com',
      address: 'MG Road, Bangalore',
      scheme: 'Self Employment Scheme',
      status: 'Pending',
      amount: 50000,
      category: 'Sikh',
      education: 'Graduate',
      joinDate: '2023-05-01'
    }
  ];

  const schemes = ['All Schemes', 'Pre-Matric Scholarship', 'Post-Matric Scholarship', 'Skill Development Program', 'Self Employment Scheme'];

  const filteredBeneficiaries = beneficiaries.filter(beneficiary => {
    const matchesSearch = beneficiary.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         beneficiary.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesScheme = filterScheme === '' || filterScheme === 'All Schemes' || beneficiary.scheme === filterScheme;
    return matchesSearch && matchesScheme;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const BeneficiaryModal = ({ beneficiary, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Beneficiary Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Beneficiary ID</label>
            <p className="text-gray-900">{beneficiary.id}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <p className="text-gray-900">{beneficiary.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Father's Name</label>
            <p className="text-gray-900">{beneficiary.fatherName}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <p className="text-gray-900">{beneficiary.category}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <p className="text-gray-900 flex items-center">
              <Phone className="w-4 h-4 mr-1" />
              {beneficiary.phone}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <p className="text-gray-900 flex items-center">
              <Mail className="w-4 h-4 mr-1" />
              {beneficiary.email}
            </p>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <p className="text-gray-900 flex items-start">
              <MapPin className="w-4 h-4 mr-1 mt-1" />
              {beneficiary.address}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Scheme</label>
            <p className="text-gray-900">{beneficiary.scheme}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Education</label>
            <p className="text-gray-900">{beneficiary.education}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Amount</label>
            <p className="text-gray-900">₹{beneficiary.amount.toLocaleString()}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(beneficiary.status)}`}>
              {beneficiary.status}
            </span>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <button className="btn-secondary">Edit Details</button>
          <button onClick={onClose} className="btn-primary">Close</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Beneficiary Management</h1>
            <p className="text-gray-600">Manage and track beneficiaries across all schemes</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Beneficiary
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="bg-blue-500 p-3 rounded-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Beneficiaries</p>
              <p className="text-2xl font-bold text-gray-900">{beneficiaries.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="bg-green-500 p-3 rounded-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">
                {beneficiaries.filter(b => b.status === 'Active').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="bg-yellow-500 p-3 rounded-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {beneficiaries.filter(b => b.status === 'Pending').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="bg-purple-500 p-3 rounded-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {beneficiaries.filter(b => b.status === 'Completed').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 input-field"
              />
            </div>
          </div>
          
          <div className="md:w-64">
            <select
              value={filterScheme}
              onChange={(e) => setFilterScheme(e.target.value)}
              className="input-field"
            >
              {schemes.map(scheme => (
                <option key={scheme} value={scheme}>{scheme}</option>
              ))}
            </select>
          </div>
          
          <button className="btn-secondary flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Beneficiaries Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Beneficiary
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Scheme
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBeneficiaries.map((beneficiary) => (
                <tr key={beneficiary.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{beneficiary.name}</div>
                      <div className="text-sm text-gray-500">ID: {beneficiary.id}</div>
                      <div className="text-sm text-gray-500">{beneficiary.category}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{beneficiary.phone}</div>
                    <div className="text-sm text-gray-500">{beneficiary.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{beneficiary.scheme}</div>
                    <div className="text-sm text-gray-500">{beneficiary.education}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{beneficiary.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(beneficiary.status)}`}>
                      {beneficiary.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => setSelectedBeneficiary(beneficiary)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Beneficiary Details Modal */}
      {selectedBeneficiary && (
        <BeneficiaryModal 
          beneficiary={selectedBeneficiary} 
          onClose={() => setSelectedBeneficiary(null)} 
        />
      )}
    </div>
  );
};

export default BeneficiaryManagement;
