import axios from 'axios';

const API_URL = 'http://localhost:8081/api/patients';

class PatientService {
  getAllPatients() {
    return axios.get(`${API_URL}/`);
  }

  getPatientById(id) {
    return axios.get(`${API_URL}/${id}`);
  }

  getPatientByUserId(userId) {
    return axios.get(`${API_URL}/user/${userId}`);
  }

  createPatient(patientData) {
    return axios.post(`${API_URL}/create`, patientData);
  }

  updatePatient(id, patientData) {
    return axios.put(`${API_URL}/${id}`, patientData);
  }

  deletePatient(id) {
    return axios.delete(`${API_URL}/${id}`);
  }
}

export default new PatientService();
