import axios from 'axios';
import AuthService from './AuthService';

const API_URL = 'http://localhost:8081/api/doctor';

class WorkingHourService {
  list(doctorId) {
    const token = AuthService.getToken();
    return axios.get(`${API_URL}/${doctorId}/working-hours`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  }

  create(doctorId, data) {
    const token = AuthService.getToken();
    return axios.post(`${API_URL}/${doctorId}/working-hours`, data, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
  }

  update(doctorId, id, data) {
    const token = AuthService.getToken();
    return axios.put(`${API_URL}/${doctorId}/working-hours/${id}`, data, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
  }

  delete(doctorId, id) {
    const token = AuthService.getToken();
    return axios.delete(`${API_URL}/${doctorId}/working-hours/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  }
}

export default new WorkingHourService();
