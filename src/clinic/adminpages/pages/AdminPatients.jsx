import React, { useState, useEffect } from 'react';
import PatientService from '../../../services/PatientService';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import AdminLayout from '../components/AdminLayout';
import axios from 'axios';
import AuthService from '../../../services/AuthService';

const AdminPatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    username: '',
    createUserAccount: false,
    password: '',
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const response = await PatientService.getAllPatients();
      setPatients(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch patients: ' + (err.response?.data?.message || err.message));
      console.error('Error fetching patients:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPatient) {
        await PatientService.updatePatient(editingPatient.id, formData);
      } else {
        // Patient creation flow with optional account registration
        if (formData.createUserAccount) {
          if (!formData.username || !formData.password) {
            setError('Username and password are required to create a user account.');
            return;
          }
          const token = AuthService.getToken();
          const regRes = await axios.post(
            'http://localhost:8081/api/auth/register',
            {
              username: formData.username,
              email: formData.email,
              password: formData.password,
              role: 'PATIENT',
            },
            {
              headers: {
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
              },
            }
          );
          const patientId = regRes?.data?.patientId;
          if (patientId) {
            await PatientService.updatePatient(patientId, formData);
          } else {
            await PatientService.createPatient(formData);
          }
        } else {
          // If not creating user, require a username to link to an existing account (optional enhancement if backend supports linking)
          await PatientService.createPatient(formData);
        }
      }
      resetForm();
      fetchPatients();
    } catch (err) {
      if (err.response?.status === 409) {
        setError(err.response?.data?.message || 'Conflict: Username or email already exists.');
      } else if (err.response?.status === 400) {
        setError(err.response?.data?.message || 'Invalid input. Please check the form fields.');
      } else if (err.response?.status === 500) {
        setError('Server error during registration. It may be due to duplicate user/patient linkage.');
      } else {
        setError('Failed to save patient: ' + (err.response?.data?.message || err.message));
      }
      console.error('Error saving patient:', err);
    }
  };

  const handleEdit = (patient) => {
    setEditingPatient(patient);
    setFormData({
      name: patient.name,
      email: patient.email,
      phone: patient.phone,
      address: patient.address || '',
      username: '',
      createUserAccount: false,
      password: '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await PatientService.deletePatient(id);
        fetchPatients();
      } catch (err) {
        setError('Failed to delete patient: ' + (err.response?.data?.message || err.message));
        console.error('Error deleting patient:', err);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      username: '',
      createUserAccount: false,
      password: '',
    });
    setEditingPatient(null);
    setShowForm(false);
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Manage Patients</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            {showForm ? 'Cancel' : <><FaPlus /> Add New Patient</>}
          </button>
        </div>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

        {showForm && (
          <div className="bg-white shadow-md rounded p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">{editingPatient ? 'Edit Patient' : 'Add New Patient'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Username (link to user)</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    placeholder="patient's username"
                    disabled={editingPatient && formData.createUserAccount}
                  />
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      id="createUserAccount"
                      type="checkbox"
                      checked={formData.createUserAccount}
                      onChange={(e) => setFormData(prev => ({ ...prev, createUserAccount: e.target.checked }))}
                      disabled={!!editingPatient}
                    />
                    <label htmlFor="createUserAccount" className="text-sm text-gray-700">Create user account for this patient</label>
                  </div>
                  {formData.createUserAccount && !editingPatient && (
                    <div className="mt-2">
                      <label className="block text-sm font-medium text-gray-700">Password for new account</label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        placeholder="temporary password"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                  {editingPatient ? 'Update Patient' : 'Add Patient'}
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center py-4">Loading patients...</div>
        ) : patients.length === 0 ? (
          <div className="text-center py-4 bg-gray-50 rounded">No patients found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">Email</th>
                  <th className="py-3 px-4 text-left">Phone</th>
                  <th className="py-3 px-4 text-left">Address</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient) => (
                  <tr key={patient.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{patient.name}</td>
                    <td className="py-3 px-4">{patient.email}</td>
                    <td className="py-3 px-4">{patient.phone}</td>
                    <td className="py-3 px-4">{patient.address || 'N/A'}</td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleEdit(patient)}
                        className="text-blue-500 hover:text-blue-700 mr-3"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(patient.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminPatients;
