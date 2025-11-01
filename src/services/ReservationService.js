import axios from 'axios';
import AuthService from './AuthService';

const API_URL = 'http://localhost:8081/api/appointments/reservations';

class ReservationService {
  /**
   * Reserve a slot temporarily for payment process (5 minutes)
   * @param {number} appointmentId - Appointment slot ID
   * @param {number} patientId - Patient ID
   * @returns {Promise} Reservation response
   */
  reserveSlot(appointmentId, patientId) {
    const token = AuthService.getToken();
    return axios.post(
      `${API_URL}/reserve/${appointmentId}/patient/${patientId}`,
      {},
      {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      }
    );
  }

  /**
   * Release a reservation (when payment is cancelled)
   * @param {number} appointmentId - Appointment slot ID
   * @param {number} patientId - Patient ID
   * @returns {Promise} Release response
   */
  releaseReservation(appointmentId, patientId) {
    const token = AuthService.getToken();
    return axios.delete(
      `${API_URL}/release/${appointmentId}/patient/${patientId}`,
      {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      }
    );
  }

  /**
   * Check if a slot is available for booking
   * @param {number} appointmentId - Appointment slot ID
   * @param {number} patientId - Patient ID
   * @returns {Promise} Availability status
   */
  checkSlotAvailability(appointmentId, patientId) {
    const token = AuthService.getToken();
    return axios.get(
      `${API_URL}/check/${appointmentId}/patient/${patientId}`,
      {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      }
    );
  }
}

export default new ReservationService();
