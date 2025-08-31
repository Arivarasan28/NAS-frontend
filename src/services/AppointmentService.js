import axios from 'axios';
import AuthService from './AuthService';

const API_URL = 'http://localhost:8081/api/appointments';

class AppointmentService {
  getAllAppointments() {
    const token = AuthService.getToken();
    return axios.get(API_URL, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
  }

  getAppointmentById(id) {
    const token = AuthService.getToken();
    return axios.get(`${API_URL}/${id}`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
  }

  createAppointment(appointmentData) {
    const token = AuthService.getToken();
    return axios.post(API_URL, appointmentData, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
  }

  updateAppointment(id, appointmentData) {
    const token = AuthService.getToken();
    return axios.put(`${API_URL}/${id}`, appointmentData, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
  }

  deleteAppointment(id) {
    const token = AuthService.getToken();
    return axios.delete(`${API_URL}/${id}`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
  }
  
  // Doctor-specific appointment methods
  getDoctorAppointments(doctorId) {
    const token = AuthService.getToken();
    return axios.get(`${API_URL}/doctor/${doctorId}`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
  }
  
  updateAppointmentStatus(id, statusData) {
    const token = AuthService.getToken();
    return axios.patch(`${API_URL}/${id}/status`, statusData, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
  }
  
  getAppointmentsByDate(doctorId, date) {
    const token = AuthService.getToken();
    return axios.get(`${API_URL}/slots/available/doctor/${doctorId}/date/${date}`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
  }
  
  // Get all appointments for a doctor by date (including booked, confirmed, etc.)
  getAllAppointmentsByDoctorAndDate(doctorId, date) {
    const token = AuthService.getToken();
    return axios.get(`${API_URL}/doctor/${doctorId}/date/${date}`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
  }
  
  // Create appointment slots for a doctor
  createAppointmentSlots(slotData) {
    const token = AuthService.getToken();
    return axios.post(`${API_URL}/slots`, slotData, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
  }
  
  // Delete an available appointment slot
  deleteAvailableSlot(appointmentId, doctorId) {
    const token = AuthService.getToken();
    return axios.delete(`${API_URL}/slots/${appointmentId}/doctor/${doctorId}`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
  }
  
  // Get available appointment slots for a specific doctor and date
  getAvailableSlotsByDoctorAndDate(doctorId, date) {
    const token = AuthService.getToken();
    return axios.get(`${API_URL}/slots/available/doctor/${doctorId}/date/${date}`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
  }
  
  // Book an appointment slot
  bookAppointment(appointmentId, patientId) {
    const token = AuthService.getToken();
    return axios.post(`${API_URL}/book/${appointmentId}/patient/${patientId}`, {}, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
  }
}

export default new AppointmentService();
