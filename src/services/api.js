// API service for handling HTTP requests to the backend
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

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
    return this.request('/schools');
  }

  async getSchool(id) {
    return this.request(`/schools/${id}`);
  }

  async createSchool(schoolData) {
    return this.request('/schools', {
      method: 'POST',
      body: JSON.stringify(schoolData),
    });
  }

  async updateSchool(id, schoolData) {
    return this.request(`/schools/${id}`, {
      method: 'PUT',
      body: JSON.stringify(schoolData),
    });
  }

  async deleteSchool(id) {
    return this.request(`/schools/${id}`, {
      method: 'DELETE',
    });
  }

  // Inspection API methods
  async getInspections() {
    return this.request('/inspections');
  }

  async getInspection(id) {
    return this.request(`/inspections/${id}`);
  }

  async getInspectionsBySchool(schoolId) {
    return this.request(`/inspections/school/${schoolId}`);
  }

  async createInspection(inspectionData) {
    return this.request('/inspections', {
      method: 'POST',
      body: JSON.stringify(inspectionData),
    });
  }

  async updateInspection(id, inspectionData) {
    return this.request(`/inspections/${id}`, {
      method: 'PUT',
      body: JSON.stringify(inspectionData),
    });
  }

  async deleteInspection(id) {
    return this.request(`/inspections/${id}`, {
      method: 'DELETE',
    });
  }

  // File upload for inspection photos
  async uploadInspectionPhoto(inspectionId, file) {
    const formData = new FormData();
    formData.append('photo', file);
    formData.append('inspectionId', inspectionId);

    return this.request('/inspections/upload-photo', {
      method: 'POST',
      body: formData,
      headers: {}, // Remove Content-Type to let browser set it for FormData
    });
  }

  // Dashboard statistics
  async getDashboardStats() {
    return this.request('/dashboard/stats');
  }

  // Reports
  async getReportData(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return this.request(`/reports?${queryParams}`);
  }
}

export default new ApiService();
