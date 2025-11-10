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
    licenseNumber: '',
    principalName: '',
    contactNumber: '',
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
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center mb-4">
          <KarnatakaLogo size="lg" className="mr-4" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Food Transparency Portal Inspection Form</h1>
            <p className="text-gray-600">Complete inspection documentation for Social Welfare Department</p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          {sections.map((section, index) => (
            <div key={index} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                index <= currentSection ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {index + 1}
              </div>
              <span className={`ml-2 text-sm font-medium ${
                index <= currentSection ? 'text-primary-600' : 'text-gray-500'
              }`}>
                {section.title}
              </span>
              {index < sections.length - 1 && (
                <div className={`w-12 h-1 mx-4 ${
                  index < currentSection ? 'bg-primary-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        {/* Section 0: Establishment Details */}
        {currentSection === 0 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Government School Details
            </h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Inspection Type
                  </label>
                  <select
                    name="inspectionType"
                    value={formData.inspectionType}
                    onChange={handleInputChange}
                    className="input"
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
                    className="input"
                    placeholder="Enter school name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    School Type
                  </label>
                  <select
                    name="schoolType"
                    value={formData.schoolType}
                    onChange={handleInputChange}
                    className="input"
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
                    className="input"
                    placeholder="Enter license number"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="input"
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
                    className="input"
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
                    className="input"
                    placeholder="Enter state"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Inspection Date
                  </label>
                  <input
                    type="date"
                    name="inspectionDate"
                    value={formData.inspectionDate}
                    onChange={handleInputChange}
                    className="input"
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
                    className="input"
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
                    className="input"
                    placeholder="Enter owner name"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section 1: Scheme Details */}
        {currentSection === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Scheme Details
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Scheme Name *
                </label>
                <select
                  name="schemeName"
                  value={formData.schemeName}
                  onChange={handleInputChange}
                  className="input-field"
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
                  className="input-field"
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
                  className="input-field"
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
                  className="input-field"
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
                  className="input-field"
                  placeholder="Enter beneficiary count"
                />
              </div>
            </div>
          </div>
        )}

        {/* Section 2: Financial Information */}
        {currentSection === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Financial Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fund Allocated (₹)
                </label>
                <input
                  type="number"
                  name="fundAllocated"
                  value={formData.fundAllocated}
                  onChange={handleInputChange}
                  className="input-field"
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
                  className="input-field"
                  placeholder="Enter utilized amount"
                />
              </div>

              <div className="md:col-span-2">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Financial Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
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
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Audit Findings
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Key Observations *
                </label>
                <textarea
                  name="findings"
                  value={formData.findings}
                  onChange={handleInputChange}
                  rows="6"
                  className="input"
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
                  className="input"
                  placeholder="Enter recommendations for improvement..."
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* Section 4: Documents & Evidence */}
        {currentSection === 4 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <Upload className="w-5 h-5 mr-2" />
              Documents & Evidence
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Supporting Documents
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-900">
                        Click to upload files
                      </span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        multiple
                        className="sr-only"
                        onChange={handleFileUpload}
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

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={prevSection}
            disabled={currentSection === 0}
            className={`px-4 py-2 rounded-lg font-medium ${
              currentSection === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Previous
          </button>

          <div className="flex space-x-4">
            {currentSection < sections.length - 1 ? (
              <button
                type="button"
                onClick={nextSection}
                className="btn-primary"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="btn-primary flex items-center"
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
