// API service for handling HTTP requests to the backend
// Ensure API_BASE_URL doesn't have trailing /api to avoid double /api/api
const getApiBaseUrl = () => {
  const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5010';
  // Remove trailing /api if it exists
  return baseUrl.replace(/\/api\/?$/, '');
};

const API_BASE_URL = getApiBaseUrl();

class ApiService {
  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const isFormData = options.body instanceof FormData;

    const config = {
      headers: {
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...options.headers,
      },
      ...options,
    };

    if (!isFormData && options.body && typeof options.body !== 'string') {
      config.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // School API methods
  async getSchools() {
    return this.request('/api/schools');
  }

  async getSchool(id) {
    return this.request(`/api/schools/${id}`);
  }

  async createSchool(schoolData) {
    return this.request('/api/schools', {
      method: 'POST',
      body: schoolData,
    });
  }

  async updateSchool(id, schoolData) {
    return this.request(`/api/schools/${id}`, {
      method: 'PUT',
      body: schoolData,
    });
  }

  async deleteSchool(id) {
    return this.request(`/api/schools/${id}`, {
      method: 'DELETE',
    });
  }

  // Inspection API methods
  async getInspections() {
    return this.request('/api/inspections');
  }

  async getInspection(id) {
    return this.request(`/api/inspections/${id}`);
  }

  async getInspectionsBySchool(schoolId) {
    return this.request(`/api/inspections/school/${schoolId}`);
  }

  async createInspection(inspectionData) {
    return this.request('/api/inspections', {
      method: 'POST',
      body: inspectionData,
    });
  }

  async updateInspection(id, inspectionData) {
    return this.request(`/api/inspections/${id}`, {
      method: 'PUT',
      body: inspectionData,
    });
  }

  async deleteInspection(id) {
    return this.request(`/api/inspections/${id}`, {
      method: 'DELETE',
    });
  }

  // File upload for inspection photos
  async uploadInspectionPhoto(inspectionId, file) {
    const formData = new FormData();
    formData.append('photo', file);
    formData.append('inspectionId', inspectionId);

    return this.request('/api/inspections/upload-photo', {
      method: 'POST',
      body: formData,
      headers: {}, // Remove Content-Type to let browser set it for FormData
    });
  }

  async uploadFacilityPhoto(schoolId, file, metadata = {}) {
    const formData = new FormData();
    formData.append('photo', file);
    if (metadata.facilityType) {
      formData.append('facilityType', metadata.facilityType);
    }
    if (metadata.caption) {
      formData.append('caption', metadata.caption);
    }
    if (metadata.inspector) {
      formData.append('inspector', metadata.inspector);
    }

    return this.request(`/api/schools/${schoolId}/facility-photos`, {
      method: 'POST',
      body: formData,
      headers: {},
    });
  }

  async getSchoolPhotos(schoolId) {
    return this.request(`/api/schools/${schoolId}/photos`);
  }

  // Dashboard statistics
  async getDashboardStats() {
    return this.request('/api/dashboard/stats');
  }

  // Reports
  async getReportData(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return this.request(`/api/reports?${queryParams}`);
  }
}

export default new ApiService();

