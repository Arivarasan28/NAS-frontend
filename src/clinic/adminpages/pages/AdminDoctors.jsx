import React, { useState, useEffect } from 'react';
import DoctorService from '../../../services/DoctorService';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import AdminLayout from '../components/AdminLayout';

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    email: '',
    phone: '',
    fee: '',
  });
  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const response = await DoctorService.getAllDoctors();
      setDoctors(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch doctors: ' + (err.response?.data?.message || err.message));
      console.error('Error fetching doctors:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDoctor) {
        await DoctorService.updateDoctor(editingDoctor.id, formData, profilePicture);
      } else {
        await DoctorService.createDoctor(formData, profilePicture);
      }
      resetForm();
      fetchDoctors();
    } catch (err) {
      setError('Failed to save doctor: ' + (err.response?.data?.message || err.message));
      console.error('Error saving doctor:', err);
    }
  };

  const handleEdit = (doctor) => {
    setEditingDoctor(doctor);
    setFormData({
      name: doctor.name,
      specialization: doctor.specialization,
      email: doctor.email,
      phone: doctor.phone,
      fee: doctor.fee || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        await DoctorService.deleteDoctor(id);
        fetchDoctors();
      } catch (err) {
        setError('Failed to delete doctor: ' + (err.response?.data?.message || err.message));
        console.error('Error deleting doctor:', err);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      specialization: '',
      email: '',
      phone: '',
      fee: '',
    });
    setProfilePicture(null);
    setEditingDoctor(null);
    setShowForm(false);
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Doctors</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          {showForm ? 'Cancel' : <><FaPlus /> Add New Doctor</>}
        </button>
      </div>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      {showForm && (
        <div className="bg-white shadow-md rounded p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">{editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}</h2>
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
                <label className="block text-sm font-medium text-gray-700">Specialization</label>
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
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
                <label className="block text-sm font-medium text-gray-700">Consultation Fee</label>
                <input
                  type="number"
                  name="fee"
                  value={formData.fee}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
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
                {editingDoctor ? 'Update Doctor' : 'Add Doctor'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-4">Loading doctors...</div>
      ) : doctors.length === 0 ? (
        <div className="text-center py-4 bg-gray-50 rounded">No doctors found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Specialization</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Phone</th>
                <th className="py-3 px-4 text-left">Fee</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doctor) => (
                <tr key={doctor.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{doctor.name}</td>
                  <td className="py-3 px-4">{doctor.specialization}</td>
                  <td className="py-3 px-4">{doctor.email}</td>
                  <td className="py-3 px-4">{doctor.phone}</td>
                  <td className="py-3 px-4">${doctor.fee || 'N/A'}</td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleEdit(doctor)}
                      className="text-blue-500 hover:text-blue-700 mr-3"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(doctor.id)}
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

export default AdminDoctors;
