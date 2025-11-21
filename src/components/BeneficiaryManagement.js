import React, { useState } from "react";
import {
  Search,
  Plus,
  Edit,
  Eye,
  Filter,
  Download,
  Users,
  Phone,
  Mail,
  MapPin,
  X,
} from "lucide-react";

const BeneficiaryManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterScheme, setFilterScheme] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);

  const beneficiaries = [
    {
      id: "BEN001",
      name: "Mohammed Ahmed",
      fatherName: "Abdul Rahman",
      phone: "+91-9876543210",
      email: "mohammed.ahmed@email.com",
      address: "House No. 123, Sector 15, Delhi",
      scheme: "Pre-Matric Scholarship",
      status: "Active",
      amount: 12000,
      category: "Muslim",
      education: "Class 10",
      joinDate: "2023-04-15",
    },
    {
      id: "BEN002",
      name: "Fatima Khan",
      fatherName: "Salim Khan",
      phone: "+91-9876543211",
      email: "fatima.khan@email.com",
      address: "Plot No. 456, Bandra, Mumbai",
      scheme: "Post-Matric Scholarship",
      status: "Active",
      amount: 25000,
      category: "Muslim",
      education: "Graduate",
      joinDate: "2023-03-20",
    },
    {
      id: "BEN003",
      name: "John Thomas",
      fatherName: "Thomas John",
      phone: "+91-9876543212",
      email: "john.thomas@email.com",
      address: "Church Street, Kochi, Kerala",
      scheme: "Skill Development Program",
      status: "Completed",
      amount: 15000,
      category: "Christian",
      education: "Class 12",
      joinDate: "2023-01-10",
    },
    {
      id: "BEN004",
      name: "Priya Sharma",
      fatherName: "Raj Sharma",
      phone: "+91-9876543213",
      email: "priya.sharma@email.com",
      address: "MG Road, Bangalore",
      scheme: "Self Employment Scheme",
      status: "Pending",
      amount: 50000,
      category: "Sikh",
      education: "Graduate",
      joinDate: "2023-05-01",
    },
  ];

  const schemes = [
    "All Schemes",
    "Pre-Matric Scholarship",
    "Post-Matric Scholarship",
    "Skill Development Program",
    "Self Employment Scheme",
  ];

  const filteredBeneficiaries = beneficiaries.filter((beneficiary) => {
    const matchesSearch =
      beneficiary.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      beneficiary.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesScheme =
      filterScheme === "" ||
      filterScheme === "All Schemes" ||
      beneficiary.scheme === filterScheme;
    return matchesSearch && matchesScheme;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const BeneficiaryModal = ({ beneficiary, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg p-4 sm:p-6 max-w-2xl w-full max-h-[calc(100vh-2rem)] sm:max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">
            Beneficiary Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 active:text-gray-700 sm:hover:text-gray-700 min-w-[44px] min-h-[44px] flex items-center justify-center touch-manipulation"
            aria-label="Close"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Beneficiary ID
            </label>
            <p className="text-gray-900">{beneficiary.id}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <p className="text-gray-900">{beneficiary.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Father's Name
            </label>
            <p className="text-gray-900">{beneficiary.fatherName}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <p className="text-gray-900">{beneficiary.category}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <p className="text-gray-900 flex items-center">
              <Phone className="w-4 h-4 mr-1" />
              {beneficiary.phone}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <p className="text-gray-900 flex items-center">
              <Mail className="w-4 h-4 mr-1" />
              {beneficiary.email}
            </p>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <p className="text-gray-900 flex items-start">
              <MapPin className="w-4 h-4 mr-1 mt-1" />
              {beneficiary.address}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Scheme
            </label>
            <p className="text-gray-900">{beneficiary.scheme}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Education
            </label>
            <p className="text-gray-900">{beneficiary.education}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Amount
            </label>
            <p className="text-gray-900">
              ₹{beneficiary.amount.toLocaleString()}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <span
              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                beneficiary.status
              )}`}
            >
              {beneficiary.status}
            </span>
          </div>
        </div>

        <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
          <button className="btn-secondary w-full sm:w-auto min-h-[44px] touch-manipulation text-sm sm:text-base">
            Edit Details
          </button>
          <button
            onClick={onClose}
            className="btn-primary w-full sm:w-auto min-h-[44px] touch-manipulation text-sm sm:text-base"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-4">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
              Beneficiary Management
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Manage and track beneficiaries across all schemes
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center w-full sm:w-auto min-h-[44px] touch-manipulation text-sm sm:text-base"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Beneficiary
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <div className="flex items-center">
            <div className="bg-blue-500 p-2.5 sm:p-3 rounded-lg flex-shrink-0">
              <Users className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div className="ml-3 sm:ml-4 min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600">
                Total Beneficiaries
              </p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {beneficiaries.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <div className="flex items-center">
            <div className="bg-green-500 p-2.5 sm:p-3 rounded-lg flex-shrink-0">
              <Users className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div className="ml-3 sm:ml-4 min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600">
                Active
              </p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {beneficiaries.filter((b) => b.status === "Active").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <div className="flex items-center">
            <div className="bg-yellow-500 p-2.5 sm:p-3 rounded-lg flex-shrink-0">
              <Users className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div className="ml-3 sm:ml-4 min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600">
                Pending
              </p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {beneficiaries.filter((b) => b.status === "Pending").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <div className="flex items-center">
            <div className="bg-purple-500 p-2.5 sm:p-3 rounded-lg flex-shrink-0">
              <Users className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div className="ml-3 sm:ml-4 min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600">
                Completed
              </p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {beneficiaries.filter((b) => b.status === "Completed").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1 min-w-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 input-field text-base"
              />
            </div>
          </div>

          <div className="w-full sm:w-48 lg:w-64">
            <select
              value={filterScheme}
              onChange={(e) => setFilterScheme(e.target.value)}
              className="input-field text-base w-full"
            >
              {schemes.map((scheme) => (
                <option key={scheme} value={scheme}>
                  {scheme}
                </option>
              ))}
            </select>
          </div>

          <button className="btn-secondary flex items-center justify-center min-h-[44px] touch-manipulation text-sm sm:text-base w-full sm:w-auto">
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
                      <div className="text-sm font-medium text-gray-900">
                        {beneficiary.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {beneficiary.id}
                      </div>
                      <div className="text-sm text-gray-500">
                        {beneficiary.category}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {beneficiary.phone}
                    </div>
                    <div className="text-sm text-gray-500">
                      {beneficiary.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {beneficiary.scheme}
                    </div>
                    <div className="text-sm text-gray-500">
                      {beneficiary.education}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{beneficiary.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        beneficiary.status
                      )}`}
                    >
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
