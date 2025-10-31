import axios from 'axios';

const API_URL = 'http://localhost:8081/api/doctor-leave';

/**
 * Service for handling doctor leave management API calls
 */
class DoctorLeaveService {
  /**
   * Get authorization header with JWT token
   */
  getAuthHeader() {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  /**
   * Request a new leave
   * @param {Object} leaveData - Leave request data
   * @returns {Promise} - Promise with created leave data
   */
  async requestLeave(leaveData) {
    const response = await axios.post(`${API_URL}/request`, leaveData, {
      headers: this.getAuthHeader()
    });
    return response.data;
  }

  /**
   * Get all leaves for a specific doctor
   * @param {number} doctorId - Doctor ID
   * @returns {Promise} - Promise with array of leaves
   */
  async getLeavesByDoctorId(doctorId) {
    const response = await axios.get(`${API_URL}/doctor/${doctorId}`, {
      headers: this.getAuthHeader()
    });
    return response.data;
  }

  /**
   * Get leaves by status (for admin)
   * @param {string} status - Leave status (PENDING, APPROVED, REJECTED, CANCELLED)
   * @returns {Promise} - Promise with array of leaves
   */
  async getLeavesByStatus(status) {
    const response = await axios.get(`${API_URL}/status/${status}`, {
      headers: this.getAuthHeader()
    });
    return response.data;
  }

  /**
   * Get a specific leave by ID
   * @param {number} leaveId - Leave ID
   * @returns {Promise} - Promise with leave data
   */
  async getLeaveById(leaveId) {
    const response = await axios.get(`${API_URL}/${leaveId}`, {
      headers: this.getAuthHeader()
    });
    return response.data;
  }

  /**
   * Approve or reject a leave request (admin only)
   * @param {number} leaveId - Leave ID
   * @param {Object} approvalData - Approval data {status, approvedBy, adminNotes}
   * @returns {Promise} - Promise with updated leave data
   */
  async updateLeaveStatus(leaveId, approvalData) {
    const response = await axios.put(`${API_URL}/${leaveId}/approve`, approvalData, {
      headers: this.getAuthHeader()
    });
    return response.data;
  }

  /**
   * Cancel a leave request (by doctor)
   * @param {number} leaveId - Leave ID
   * @param {number} doctorId - Doctor ID
   * @returns {Promise} - Promise with updated leave data
   */
  async cancelLeave(leaveId, doctorId) {
    const response = await axios.put(`${API_URL}/${leaveId}/cancel?doctorId=${doctorId}`, {}, {
      headers: this.getAuthHeader()
    });
    return response.data;
  }

  /**
   * Check if doctor is on leave for a specific date
   * @param {number} doctorId - Doctor ID
   * @param {string} date - Date in YYYY-MM-DD format
   * @returns {Promise} - Promise with availability data
   */
  async checkDoctorAvailability(doctorId, date) {
    const response = await axios.get(`${API_URL}/check-availability`, {
      params: { doctorId, date }
    });
    return response.data;
  }

  /**
   * Get approved leaves for a doctor within a date range
   * @param {number} doctorId - Doctor ID
   * @param {string} startDate - Start date in YYYY-MM-DD format
   * @param {string} endDate - End date in YYYY-MM-DD format
   * @returns {Promise} - Promise with array of leaves
   */
  async getApprovedLeavesByDateRange(doctorId, startDate, endDate) {
    const response = await axios.get(`${API_URL}/doctor/${doctorId}/range`, {
      params: { startDate, endDate }
    });
    return response.data;
  }

  /**
   * Get all leaves within a date range (for admin dashboard)
   * @param {string} startDate - Start date in YYYY-MM-DD format
   * @param {string} endDate - End date in YYYY-MM-DD format
   * @returns {Promise} - Promise with array of leaves
   */
  async getLeavesByDateRange(startDate, endDate) {
    const response = await axios.get(`${API_URL}/range`, {
      params: { startDate, endDate },
      headers: this.getAuthHeader()
    });
    return response.data;
  }

  /**
   * Delete a leave request (admin only)
   * @param {number} leaveId - Leave ID
   * @returns {Promise} - Promise with success message
   */
  async deleteLeave(leaveId) {
    const response = await axios.delete(`${API_URL}/${leaveId}`, {
      headers: this.getAuthHeader()
    });
    return response.data;
  }
}

export default new DoctorLeaveService();
