import axios from 'axios';
import AuthService from './AuthService';

const API_URL = 'http://localhost:8081/api/doctor';

class DoctorService {
  getAllDoctors() {
    const token = AuthService.getToken();
    return axios.get(`${API_URL}/`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
  }

  getDoctorById(id) {
    const token = AuthService.getToken();
    return axios.get(`${API_URL}/${id}`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
  }
  
  getDoctorByUserId(userId) {
    const token = AuthService.getToken();
    return axios.get(`${API_URL}/user/${userId}`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
  }

  createDoctor(doctorData, profilePicture) {
    const formData = new FormData();
    formData.append('doctor', new Blob([JSON.stringify(doctorData)], { type: 'application/json' }));
    
    if (profilePicture) {
      formData.append('profilePicture', profilePicture);
    }
    
    const token = AuthService.getToken();
    return axios.post(`${API_URL}/create`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    });
  }

  updateDoctor(id, doctorData, profilePicture) {
    const formData = new FormData();
    formData.append('doctor', new Blob([JSON.stringify(doctorData)], { type: 'application/json' }));
    
    if (profilePicture) {
      formData.append('profilePicture', profilePicture);
    }
    
    const token = AuthService.getToken();
    return axios.put(`${API_URL}/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    });
  }

  deleteDoctor(id) {
    const token = AuthService.getToken();
    return axios.delete(`${API_URL}/${id}`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
  }
}

export default new DoctorService();
