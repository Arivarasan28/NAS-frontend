import axios from 'axios';
import AuthService from './AuthService';

const API_URL = 'http://localhost:8081/api/specializations';

class SpecializationService {
  getAll() {
    const token = AuthService.getToken();
    return axios.get(`${API_URL}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  }

  getById(id) {
    const token = AuthService.getToken();
    return axios.get(`${API_URL}/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  }

  create(data) {
    const token = AuthService.getToken();
    return axios.post(`${API_URL}`, data, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
  }

  update(id, data) {
    const token = AuthService.getToken();
    return axios.put(`${API_URL}/${id}`, data, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
  }

  delete(id) {
    const token = AuthService.getToken();
    return axios.delete(`${API_URL}/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  }
}

export default new SpecializationService();
