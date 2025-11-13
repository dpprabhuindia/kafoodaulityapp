import React, { useState } from 'react';
import { Save, FileText, MapPin, Calendar, User, CheckCircle, Store, ShieldCheck, Camera, Upload } from 'lucide-react';
import KarnatakaLogo from './KarnatakaLogo';

const AuditForm = () => {
  const [formData, setFormData] = useState({
    inspectionType: '',
    schoolName: '',
    schoolType: '',
    location: '',
    district: '',
    state: 'Karnataka',
    inspectionDate: '',
    inspectorName: '',
    ownerName: '',
    licenseNumber: '',
    principalName: '',
    contactNumber: '',
    schemeName: '',
    beneficiaryCount: '',
    fundAllocated: '',
    fundUtilized: '',
    hygieneRating: '',
    temperatureCheck: '',
    storageConditions: '',
    kitchenStaffHygiene: '',
    equipmentCleanliness: '',
    wasteManagement: '',
    findings: '',
    recommendations: '',
    photos: [],
    documents: []
  });

  const [currentSection, setCurrentSection] = useState(0);

  const sections = [
    {
      title: 'School Details',
      icon: Store,
      fields: ['inspectionType', 'schoolName', 'schoolType', 'location', 'district', 'state', 'inspectionDate', 'inspectorName']
    },
    {
      title: 'License & Contact Information',
      icon: FileText,
      fields: ['licenseNumber', 'principalName', 'contactNumber']
    },
    {
      title: 'Food Safety Assessment',
      icon: ShieldCheck,
      fields: ['hygieneRating', 'temperatureCheck', 'storageConditions', 'kitchenStaffHygiene', 'equipmentCleanliness', 'wasteManagement']
    },
    {
      title: 'Inspection Findings',
      icon: CheckCircle,
      fields: ['findings', 'recommendations']
    },
    {
      title: 'Photo Documentation',
      icon: Camera,
      fields: ['photos']
    },
    {
      title: 'Final Report',
      icon: Upload,
      fields: ['documents']
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, ...files]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Audit Form Submitted:', formData);
    alert('Audit form submitted successfully!');
  };

  const nextSection = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4">
          <KarnatakaLogo size="lg" className="mr-0 sm:mr-4 mb-3 sm:mb-0" />
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Food Transparency Portal Inspection Form</h1>
            <p className="text-sm sm:text-base text-gray-600">Complete inspection documentation for Social Welfare Department</p>
          </div>
        </div>
      </div>

      {/* Progress Bar - Mobile Optimized */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
        {/* Mobile: Show current section only */}
        <div className="block sm:hidden mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium bg-primary-600 text-white">
                {currentSection + 1}
              </div>
              <span className="ml-3 text-sm font-medium text-primary-600">
                {sections[currentSection].title}
              </span>
            </div>
            <span className="text-xs text-gray-500">
              {currentSection + 1} of {sections.length}
            </span>
          </div>
        </div>
        
        {/* Desktop: Full progress bar */}
        <div className="hidden sm:flex items-center justify-between overflow-x-auto pb-2">
          {sections.map((section, index) => (
            <div key={index} className="flex items-center flex-shrink-0">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                index <= currentSection ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {index + 1}
              </div>
              <span className={`ml-2 text-sm font-medium whitespace-nowrap ${
                index <= currentSection ? 'text-primary-600' : 'text-gray-500'
              }`}>
                {section.title}
              </span>
              {index < sections.length - 1 && (
                <div className={`w-8 sm:w-12 h-1 mx-2 sm:mx-4 flex-shrink-0 ${
                  index < currentSection ? 'bg-primary-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        {/* Section 0: Establishment Details */}
        {currentSection === 0 && (
          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center">
              <User className="w-5 h-5 mr-2 flex-shrink-0" />
              <span className="break-words">Government School Details</span>
            </h2>
            
            <div className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Inspection Type
                  </label>
                  <select
                    name="inspectionType"
                    value={formData.inspectionType}
                    onChange={handleInputChange}
                    className="input text-base"
                  >
                    <option value="">Select inspection type</option>
                    <option value="routine">Routine Inspection</option>
                    <option value="complaint">Complaint-based</option>
                    <option value="followup">Follow-up Inspection</option>
                    <option value="licensing">Licensing Inspection</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    School Name
                  </label>
                  <input
                    type="text"
                    name="schoolName"
                    value={formData.schoolName}
                    onChange={handleInputChange}
                    className="input text-base"
                    placeholder="Enter school name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    School Type
                  </label>
                  <select
                    name="schoolType"
                    value={formData.schoolType}
                    onChange={handleInputChange}
                    className="input text-base"
                  >
                    <option value="">Select type</option>
                    <option value="primary">Government Primary School</option>
                    <option value="secondary">Government High School</option>
                    <option value="higher_secondary">Government Higher Secondary School</option>
                    <option value="residential">Government Residential School</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    License Number
                  </label>
                  <input
                    type="text"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleInputChange}
                    className="input text-base"
                    placeholder="Enter license number"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="input text-base"
                    placeholder="Enter location"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    District
                  </label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    className="input text-base"
                    placeholder="Enter district"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="input text-base"
                    placeholder="Enter state"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Inspection Date
                  </label>
                  <input
                    type="date"
                    name="inspectionDate"
                    value={formData.inspectionDate}
                    onChange={handleInputChange}
                    className="input text-base"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Inspector Name
                  </label>
                  <input
                    type="text"
                    name="inspectorName"
                    value={formData.inspectorName}
                    onChange={handleInputChange}
                    className="input text-base"
                    placeholder="Enter inspector name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Owner Name
                  </label>
                  <input
                    type="text"
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleInputChange}
                    className="input text-base"
                    placeholder="Enter owner name"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section 1: Scheme Details */}
        {currentSection === 1 && (
          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center">
              <FileText className="w-5 h-5 mr-2 flex-shrink-0" />
              <span className="break-words">Scheme Details</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Scheme Name *
                </label>
                <select
                  name="schemeName"
                  value={formData.schemeName}
                  onChange={handleInputChange}
                  className="input-field text-base"
                  required
                >
                  <option value="">Select Scheme</option>
                  <option value="pre-matric">Pre-Matric Scholarship</option>
                  <option value="post-matric">Post-Matric Scholarship</option>
                  <option value="skill-development">Skill Development Program</option>
                  <option value="self-employment">Self Employment Scheme</option>
                  <option value="coaching-guidance">Coaching and Guidance Scheme</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State *
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="input-field text-base"
                  placeholder="Enter state"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  District *
                </label>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                  className="input-field text-base"
                  placeholder="Enter district"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location Details *
                </label>
                <textarea
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  rows="3"
                  className="input-field text-base"
                  placeholder="Enter detailed location information"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Beneficiaries
                </label>
                <input
                  type="number"
                  name="beneficiaryCount"
                  value={formData.beneficiaryCount}
                  onChange={handleInputChange}
                  className="input-field text-base"
                  placeholder="Enter beneficiary count"
                />
              </div>
            </div>
          </div>
        )}

        {/* Section 2: Financial Information */}
        {currentSection === 2 && (
          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center">
              <Calendar className="w-5 h-5 mr-2 flex-shrink-0" />
              <span className="break-words">Financial Information</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fund Allocated (₹)
                </label>
                <input
                  type="number"
                  name="fundAllocated"
                  value={formData.fundAllocated}
                  onChange={handleInputChange}
                  className="input-field text-base"
                  placeholder="Enter allocated amount"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fund Utilized (₹)
                </label>
                <input
                  type="number"
                  name="fundUtilized"
                  value={formData.fundUtilized}
                  onChange={handleInputChange}
                  className="input-field text-base"
                  placeholder="Enter utilized amount"
                />
              </div>

              <div className="md:col-span-2">
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">Financial Summary</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Allocated:</span>
                      <span className="font-medium ml-2">₹{formData.fundAllocated || '0'}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Utilized:</span>
                      <span className="font-medium ml-2">₹{formData.fundUtilized || '0'}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Balance:</span>
                      <span className="font-medium ml-2">
                        ₹{(formData.fundAllocated || 0) - (formData.fundUtilized || 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section 3: Audit Findings */}
        {currentSection === 3 && (
          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center">
              <MapPin className="w-5 h-5 mr-2 flex-shrink-0" />
              <span className="break-words">Audit Findings</span>
            </h2>
            
            <div className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Key Observations *
                </label>
                <textarea
                  name="findings"
                  value={formData.findings}
                  onChange={handleInputChange}
                  rows="6"
                  className="input text-base"
                  placeholder="Enter detailed findings from the inspection..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recommendations *
                </label>
                <textarea
                  name="recommendations"
                  value={formData.recommendations}
                  onChange={handleInputChange}
                  rows="6"
                  className="input text-base"
                  placeholder="Enter recommendations for improvement..."
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* Section 4: Documents & Evidence */}
        {currentSection === 4 && (
          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center">
              <Upload className="w-5 h-5 mr-2 flex-shrink-0" />
              <span className="break-words">Documents & Evidence</span>
            </h2>
            
            <div className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Supporting Documents
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center min-h-[120px] sm:min-h-[150px] flex flex-col justify-center">
                  <Upload className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
                  <div className="mt-3 sm:mt-4">
                    <label htmlFor="file-upload" className="cursor-pointer touch-manipulation">
                      <span className="mt-2 block text-sm font-medium text-gray-900">
                        Tap to upload files
                      </span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        multiple
                        className="sr-only"
                        onChange={handleFileUpload}
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      />
                    </label>
                    <p className="mt-1 text-xs text-gray-500">
                      PDF, DOC, JPG, PNG up to 10MB each
                    </p>
                  </div>
                </div>
              </div>

              {formData.documents.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Uploaded Files:</h3>
                  <ul className="space-y-2">
                    {formData.documents.map((file, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <FileText className="w-4 h-4 mr-2" />
                        {file.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation Buttons - Mobile Optimized */}
        <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={prevSection}
            disabled={currentSection === 0}
            className={`min-h-[44px] px-6 py-3 sm:px-4 sm:py-2 rounded-lg font-medium text-base touch-manipulation ${
              currentSection === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 active:bg-gray-300 sm:hover:bg-gray-300'
            }`}
          >
            Previous
          </button>

          <div className="flex space-x-3 sm:space-x-4">
            {currentSection < sections.length - 1 ? (
              <button
                type="button"
                onClick={nextSection}
                className="btn-primary min-h-[44px] px-6 py-3 sm:px-4 sm:py-2 text-base touch-manipulation flex-1 sm:flex-initial"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="btn-primary min-h-[44px] px-6 py-3 sm:px-4 sm:py-2 text-base touch-manipulation flex items-center justify-center flex-1 sm:flex-initial"
              >
                <Save className="w-4 h-4 mr-2" />
                Submit Audit
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default AuditForm;
