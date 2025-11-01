import axios from 'axios';
import AuthService from './AuthService';

const API_URL = 'http://localhost:8081/api/payments';

class PaymentService {
  /**
   * Book appointment with payment in a single transaction
   * @param {Object} bookingData - { appointmentId, patientId, paymentMethod, amount, cardDetails, notes }
   * @returns {Promise} Response with appointment and payment details
   */
  bookAppointmentWithPayment(bookingData) {
    const token = AuthService.getToken();
    return axios.post(`${API_URL}/book-with-payment`, bookingData, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
  }

  /**
   * Process payment for an existing appointment
   * @param {Object} paymentData - { appointmentId, paymentMethod, amount, cardDetails, notes }
   * @returns {Promise} Payment details
   */
  processPayment(paymentData) {
    const token = AuthService.getToken();
    return axios.post(API_URL, paymentData, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
  }

  /**
   * Get payment by ID
   * @param {number} paymentId - Payment ID
   * @returns {Promise} Payment details
   */
  getPaymentById(paymentId) {
    const token = AuthService.getToken();
    return axios.get(`${API_URL}/${paymentId}`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
  }

  /**
   * Get payment by appointment ID
   * @param {number} appointmentId - Appointment ID
   * @returns {Promise} Payment details
   */
  getPaymentByAppointmentId(appointmentId) {
    const token = AuthService.getToken();
    return axios.get(`${API_URL}/appointment/${appointmentId}`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
  }

  /**
   * Get all payments for a patient
   * @param {number} patientId - Patient ID
   * @returns {Promise} List of payments
   */
  getPaymentsByPatientId(patientId) {
    const token = AuthService.getToken();
    return axios.get(`${API_URL}/patient/${patientId}`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
  }

  /**
   * Get all payments for a doctor
   * @param {number} doctorId - Doctor ID
   * @returns {Promise} List of payments
   */
  getPaymentsByDoctorId(doctorId) {
    const token = AuthService.getToken();
    return axios.get(`${API_URL}/doctor/${doctorId}`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
  }

  /**
   * Cancel payment
   * @param {number} paymentId - Payment ID
   * @returns {Promise} Updated payment details
   */
  cancelPayment(paymentId) {
    const token = AuthService.getToken();
    return axios.patch(`${API_URL}/${paymentId}/cancel`, {}, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
  }
}

export default new PaymentService();
