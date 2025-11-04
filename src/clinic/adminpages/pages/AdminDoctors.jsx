import React, { useState, useEffect } from 'react';
import DoctorService from '../../../services/DoctorService';
import { FaEdit, FaTrash, FaPlus, FaClock, FaSave, FaTimes } from 'react-icons/fa';
import AdminLayout from '../components/AdminLayout';
import WorkingHourService from '../../../services/WorkingHourService';
import SpecializationService from '../../../services/SpecializationService';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AuthService from '../../../services/AuthService';

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    specializationNames: [],
    email: '',
    phone: '',
    fee: '',
    appointmentDurationMinutes: 15,
    username: '',
    createUserAccount: false,
    password: '',
  });
  const [profilePicture, setProfilePicture] = useState(null);
  // Working hours state
  const [expandedDoctorId, setExpandedDoctorId] = useState(null);
  const [workingHours, setWorkingHours] = useState([]); // for current expanded doctor
  const [whError, setWhError] = useState(null);
  const [whLoading, setWhLoading] = useState(false);
  const [editingHour, setEditingHour] = useState(null); // object or null
  const [hourForm, setHourForm] = useState({ dayOfWeek: 'MONDAY', startTime: '09:00', endTime: '17:00', sequence: 1 });
  const DAYS = ['MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY'];
  // Specializations
  const [specializations, setSpecializations] = useState([]);
  const [specError, setSpecError] = useState(null);
  const [specLoading, setSpecLoading] = useState(false);

  useEffect(() => {
    fetchDoctors();
    fetchSpecializations();
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

  const fetchSpecializations = async () => {
    setSpecLoading(true);
    setSpecError(null);
    try {
      const res = await SpecializationService.getAll();
      setSpecializations(res.data || []);
    } catch (err) {
      setSpecError('Failed to load specializations');
    } finally {
      setSpecLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      if (name === 'email' && !editingDoctor) {
        const local = (value || '').split('@')[0] || '';
        next.username = local;
      }
      return next;
    });
  };

  const handleSpecializationToggle = (name, checked) => {
    setFormData(prev => {
      let next = new Set(prev.specializationNames || []);
      if (checked) next.add(name); else next.delete(name);
      const list = Array.from(next);
      return {
        ...prev,
        specializationNames: list,
        specialization: list[0] || '' // keep legacy string synced
      };
    });
  };

  const handleFileChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDoctor) {
        // On edit, allow re-linking by username if provided
        await DoctorService.updateDoctor(editingDoctor.id, formData, profilePicture);
      } else {
        // Create flow: always register a DOCTOR user and link
        if (!formData.email) {
          setError('Email is required.');
          return;
        }
        if (!formData.password) {
          setError('Password is required.');
          return;
        }
        const token = AuthService.getToken();
        const regRes = await axios.post(
          'http://localhost:8081/api/auth/register',
          {
            username: formData.username,
            email: formData.email,
            password: formData.password,
            role: 'DOCTOR',
            name: formData.name || formData.username, // Include name
            phone: formData.phone || '0000000000', // Include phone with default
          },
          {
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            },
          }
        );

        const doctorId = regRes?.data?.doctorId;
        if (doctorId) {
          // Update the auto-created doctor with the provided details
          await DoctorService.updateDoctor(doctorId, formData, profilePicture);
        } else {
          // Fallback: if doctorId not returned, create doctor linked by username
          await DoctorService.createDoctor(formData, profilePicture);
        }
      }
      resetForm();
      fetchDoctors();
    } catch (err) {
      // Improve error messages for common cases
      if (err.response?.status === 409) {
        setError(err.response?.data?.message || 'Conflict: Username or email already exists.');
      } else if (err.response?.status === 400) {
        setError(err.response?.data?.message || 'Invalid input. Please check the form fields.');
      } else if (err.response?.status === 500) {
        setError('Server error during registration. It may be due to duplicate user/doctor linkage.');
      } else {
        setError('Failed to save doctor: ' + (err.response?.data?.message || err.message));
      }
      console.error('Error saving doctor:', err);
    }
  };

  const handleEdit = (doctor) => {
    setEditingDoctor(doctor);
    setFormData({
      name: doctor.name,
      specialization: doctor.specialization || (doctor.specializations && doctor.specializations[0]) || '',
      specializationNames: doctor.specializations || (doctor.specialization ? [doctor.specialization] : []),
      email: doctor.email,
      phone: doctor.phone,
      fee: doctor.fee || '',
      appointmentDurationMinutes: doctor.appointmentDurationMinutes ?? 15,
      username: '', // not provided by API; admin can set to re-link
      createUserAccount: false,
      password: '',
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

  // Working hours handlers
  const toggleWorkingHours = async (doctorId) => {
    if (expandedDoctorId === doctorId) {
      setExpandedDoctorId(null);
      setWorkingHours([]);
      setEditingHour(null);
      setWhError(null);
      return;
    }
    setExpandedDoctorId(doctorId);
    await loadWorkingHours(doctorId);
  };

  const loadWorkingHours = async (doctorId) => {
    setWhLoading(true);
    setWhError(null);
    try {
      const res = await WorkingHourService.list(doctorId);
      setWorkingHours(res.data || []);
    } catch (err) {
      setWhError('Failed to load working hours: ' + (err.response?.data?.message || err.message));
    } finally {
      setWhLoading(false);
    }
  };

  const toServerTime = (hhmm) => (hhmm?.length === 5 ? `${hhmm}:00` : hhmm);
  const fromServerTime = (hhmmss) => (hhmmss ? hhmmss.substring(0,5) : '');

  const handleHourFormChange = (e) => {
    const { name, value } = e.target;
    setHourForm((prev) => ({ ...prev, [name]: name === 'sequence' ? Number(value) : value }));
  };

  const resetHourForm = () => {
    setHourForm({ dayOfWeek: 'MONDAY', startTime: '09:00', endTime: '17:00', sequence: 1 });
    setEditingHour(null);
  };

  const submitNewHour = async () => {
    if (!expandedDoctorId) return;
    try {
      await WorkingHourService.create(expandedDoctorId, {
        dayOfWeek: hourForm.dayOfWeek,
        startTime: toServerTime(hourForm.startTime),
        endTime: toServerTime(hourForm.endTime),
        sequence: hourForm.sequence,
      });
      await loadWorkingHours(expandedDoctorId);
      resetHourForm();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const startEditHour = (hour) => {
    setEditingHour(hour);
    setHourForm({
      dayOfWeek: hour.dayOfWeek,
      startTime: fromServerTime(hour.startTime),
      endTime: fromServerTime(hour.endTime),
      sequence: hour.sequence,
    });
  };

  const submitUpdateHour = async () => {
    if (!expandedDoctorId || !editingHour) return;
    try {
      await WorkingHourService.update(expandedDoctorId, editingHour.id, {
        dayOfWeek: hourForm.dayOfWeek,
        startTime: toServerTime(hourForm.startTime),
        endTime: toServerTime(hourForm.endTime),
        sequence: hourForm.sequence,
      });
      await loadWorkingHours(expandedDoctorId);
      resetHourForm();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const deleteHour = async (hourId) => {
    if (!expandedDoctorId) return;
    if (!window.confirm('Delete this working hour?')) return;
    try {
      await WorkingHourService.delete(expandedDoctorId, hourId);
      await loadWorkingHours(expandedDoctorId);
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      specialization: '',
      specializationNames: [],
      email: '',
      phone: '',
      fee: '',
      appointmentDurationMinutes: 15,
      username: '',
      createUserAccount: false,
      password: '',
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

        {showForm && (
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-6">{editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}</h2>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-800 tracking-wide">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Appointment Duration (minutes)</label>
                      <input
                        type="number"
                        name="appointmentDurationMinutes"
                        min="5"
                        step="5"
                        value={formData.appointmentDurationMinutes}
                        onChange={(e) => {
                          const v = Number(e.target.value);
                          setFormData((prev) => ({ ...prev, appointmentDurationMinutes: isNaN(v) ? '' : v }));
                        }}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Specializations</label>
                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {specLoading ? (
                        <span className="text-sm text-gray-500">Loading...</span>
                      ) : (
                        [...new Set(specializations.map(s => s.name))]
                          .sort()
                          .map((name) => (
                            <label key={name} className="inline-flex items-center gap-2 p-2 border rounded-md hover:bg-gray-50">
                              <input
                                type="checkbox"
                                checked={formData.specializationNames.includes(name)}
                                onChange={(e) => handleSpecializationToggle(name, e.target.checked)}
                              />
                              <span>{name}</span>
                            </label>
                          ))
                      )}
                    </div>
                    <div className="mt-2 flex items-center gap-3">
                      <span className="text-xs text-gray-600">Selected: {formData.specializationNames.length > 0 ? formData.specializationNames.join(', ') : 'None'}</span>
                      <Link to="/admin-specializations" className="text-xs text-blue-600 hover:underline whitespace-nowrap">Manage</Link>
                    </div>
                    {specError && <p className="text-xs text-red-600 mt-1">{specError}</p>}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-800 tracking-wide">Contact & Account</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Username</label>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-gray-50"
                        placeholder="auto-filled from email"
                        readOnly={!editingDoctor}
                      />
                      {!editingDoctor && (
                        <p className="text-xs text-gray-500 mt-1">Prefilled from email (before @)</p>
                      )}
                    </div>
                    {!editingDoctor && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="set a password"
                          required
                        />
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Consultation Fee</label>
                  <input
                    type="number"
                    name="fee"
                    value={formData.fee}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md shadow"
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
                <th className="py-3 px-4 text-left">Duration</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doctor) => (
                <React.Fragment key={doctor.id}>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{doctor.name}</td>
                    <td className="py-3 px-4">{(doctor.specializations && doctor.specializations.length > 0) ? doctor.specializations.join(', ') : (doctor.specialization || '')}</td>
                    <td className="py-3 px-4">{doctor.email}</td>
                    <td className="py-3 px-4">{doctor.phone}</td>
                    <td className="py-3 px-4">${doctor.fee || 'N/A'}</td>
                    <td className="py-3 px-4">{doctor.appointmentDurationMinutes ?? 15} min</td>
                    <td className="py-3 px-4 text-center space-x-3">
                      <button
                        onClick={() => handleEdit(doctor)}
                        className="text-blue-500 hover:text-blue-700"
                        title="Edit doctor"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(doctor.id)}
                        className="text-red-500 hover:text-red-700"
                        title="Delete doctor"
                      >
                        <FaTrash />
                      </button>
                      <button
                        onClick={() => toggleWorkingHours(doctor.id)}
                        className="text-green-600 hover:text-green-800"
                        title="Manage working hours"
                      >
                        <FaClock />
                      </button>
                    </td>
                  </tr>
                  {expandedDoctorId === doctor.id && (
                    <tr className="bg-gray-50">
                      <td colSpan={7} className="py-4 px-6">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold">Working Hours</h3>
                          {whLoading && <span className="text-sm text-gray-500">Loading...</span>}
                        </div>
                        {whError && (
                          <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-3">{whError}</div>
                        )}
                        <div className="overflow-x-auto">
                          <table className="min-w-full bg-white shadow rounded">
                            <thead>
                              <tr className="bg-gray-200 text-gray-700">
                                <th className="py-2 px-3 text-left">Day</th>
                                <th className="py-2 px-3 text-left">Start</th>
                                <th className="py-2 px-3 text-left">End</th>
                                <th className="py-2 px-3 text-left">Seq</th>
                                <th className="py-2 px-3 text-center">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {workingHours.length === 0 ? (
                                <tr><td className="py-3 px-3" colSpan={5}>No working hours yet.</td></tr>
                              ) : (
                                workingHours.map((wh) => (
                                  <tr key={wh.id} className="border-b">
                                    <td className="py-2 px-3">{wh.dayOfWeek}</td>
                                    <td className="py-2 px-3">{fromServerTime(wh.startTime)}</td>
                                    <td className="py-2 px-3">{fromServerTime(wh.endTime)}</td>
                                    <td className="py-2 px-3">{wh.sequence}</td>
                                    <td className="py-2 px-3 text-center space-x-3">
                                      <button className="text-blue-600 hover:text-blue-800" onClick={() => startEditHour(wh)} title="Edit"><FaEdit /></button>
                                      <button className="text-red-600 hover:text-red-800" onClick={() => deleteHour(wh.id)} title="Delete"><FaTrash /></button>
                                    </td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>
                        <div className="mt-4 bg-white shadow rounded p-4">
                          <h4 className="font-medium mb-3">{editingHour ? 'Edit Working Hour' : 'Add Working Hour'}</h4>
                          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                            <div>
                              <label className="block text-sm text-gray-700">Day</label>
                              <select name="dayOfWeek" value={hourForm.dayOfWeek} onChange={handleHourFormChange} className="mt-1 w-full border rounded p-2">
                                {DAYS.map((d) => (<option key={d} value={d}>{d}</option>))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm text-gray-700">Start</label>
                              <input type="time" name="startTime" value={hourForm.startTime} onChange={handleHourFormChange} className="mt-1 w-full border rounded p-2" />
                            </div>
                            <div>
                              <label className="block text-sm text-gray-700">End</label>
                              <input type="time" name="endTime" value={hourForm.endTime} onChange={handleHourFormChange} className="mt-1 w-full border rounded p-2" />
                            </div>
                            <div>
                              <label className="block text-sm text-gray-700">Sequence</label>
                              <input type="number" min="1" name="sequence" value={hourForm.sequence} onChange={handleHourFormChange} className="mt-1 w-full border rounded p-2" />
                            </div>
                            <div className="flex items-end gap-2">
                              {editingHour ? (
                                <>
                                  <button onClick={submitUpdateHour} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded flex items-center gap-2"><FaSave /> Save</button>
                                  <button onClick={resetHourForm} className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-2 rounded flex items-center gap-2"><FaTimes /> Cancel</button>
                                </>
                              ) : (
                                <button onClick={submitNewHour} className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded flex items-center gap-2"><FaPlus /> Add</button>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
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
