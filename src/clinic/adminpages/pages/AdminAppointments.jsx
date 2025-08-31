import React, { useState, useEffect } from 'react';
import AppointmentService from '../../../services/AppointmentService';
import DoctorService from '../../../services/DoctorService';
import PatientService from '../../../services/PatientService';
import { FaEdit, FaTrash, FaPlus, FaCalendarAlt } from 'react-icons/fa';
import AdminLayout from '../components/AdminLayout';

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    appointmentDate: '',
    appointmentTime: '',
    reason: '',
    status: 'SCHEDULED',
  });

  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
    fetchPatients();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await AppointmentService.getAllAppointments();
      setAppointments(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch appointments: ' + (err.response?.data?.message || err.message));
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await DoctorService.getAllDoctors();
      setDoctors(response.data);
    } catch (err) {
      console.error('Error fetching doctors:', err);
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await PatientService.getAllPatients();
      setPatients(response.data);
    } catch (err) {
      console.error('Error fetching patients:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Format date and time for backend
      const appointmentData = {
        ...formData,
        appointmentDateTime: `${formData.appointmentDate}T${formData.appointmentTime}:00`,
      };

      // Remove separate date and time fields as they're combined now
      delete appointmentData.appointmentDate;
      delete appointmentData.appointmentTime;

      if (editingAppointment) {
        await AppointmentService.updateAppointment(editingAppointment.id, appointmentData);
      } else {
        await AppointmentService.createAppointment(appointmentData);
      }
      resetForm();
      fetchAppointments();
    } catch (err) {
      setError('Failed to save appointment: ' + (err.response?.data?.message || err.message));
      console.error('Error saving appointment:', err);
    }
  };

  const handleEdit = (appointment) => {
    // Extract date and time from appointmentDateTime
    const dateTime = new Date(appointment.appointmentDateTime);
    const date = dateTime.toISOString().split('T')[0];
    const time = dateTime.toTimeString().slice(0, 5); // HH:MM format

    setEditingAppointment(appointment);
    setFormData({
      patientId: appointment.patient.id.toString(),
      doctorId: appointment.doctor.id.toString(),
      appointmentDate: date,
      appointmentTime: time,
      reason: appointment.reason || '',
      status: appointment.status || 'SCHEDULED',
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await AppointmentService.deleteAppointment(id);
        fetchAppointments();
      } catch (err) {
        setError('Failed to delete appointment: ' + (err.response?.data?.message || err.message));
        console.error('Error deleting appointment:', err);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      patientId: '',
      doctorId: '',
      appointmentDate: '',
      appointmentTime: '',
      reason: '',
      status: 'SCHEDULED',
    });
    setEditingAppointment(null);
    setShowForm(false);
  };

  const formatDateTime = (dateTimeString) => {
    const dateTime = new Date(dateTimeString);
    return dateTime.toLocaleString();
  };

  return (
    <AdminLayout>
      <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Appointments</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          {showForm ? 'Cancel' : <><FaPlus /> Schedule New Appointment</>}
        </button>
      </div>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      {showForm && (
        <div className="bg-white shadow-md rounded p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">{editingAppointment ? 'Edit Appointment' : 'Schedule New Appointment'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Patient</label>
                <select
                  name="patientId"
                  value={formData.patientId}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                >
                  <option value="">Select Patient</option>
                  {patients.map(patient => (
                    <option key={patient.id} value={patient.id}>
                      {patient.firstName} {patient.lastName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Doctor</label>
                <select
                  name="doctorId"
                  value={formData.doctorId}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                >
                  <option value="">Select Doctor</option>
                  {doctors.map(doctor => (
                    <option key={doctor.id} value={doctor.id}>
                      Dr. {doctor.firstName} {doctor.lastName} ({doctor.specialization})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Appointment Date</label>
                <input
                  type="date"
                  name="appointmentDate"
                  value={formData.appointmentDate}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Appointment Time</label>
                <input
                  type="time"
                  name="appointmentTime"
                  value={formData.appointmentTime}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Reason</label>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  rows="3"
                  required
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                >
                  <option value="SCHEDULED">Scheduled</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                  <option value="NO_SHOW">No Show</option>
                </select>
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
                {editingAppointment ? 'Update Appointment' : 'Schedule Appointment'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-4">Loading appointments...</div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-4 bg-gray-50 rounded">No appointments found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="py-3 px-4 text-left">Patient</th>
                <th className="py-3 px-4 text-left">Doctor</th>
                <th className="py-3 px-4 text-left">Date & Time</th>
                <th className="py-3 px-4 text-left">Reason</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{appointment.patient.name}</td>
                  <td className="py-3 px-4">Dr. {appointment.doctor.name}</td>
                  <td className="py-3 px-4">{formatDateTime(appointment.appointmentDateTime)}</td>
                  <td className="py-3 px-4">{appointment.reason}</td>
                  <td className="py-3 px-4">
                    <span className={
                      `px-2 py-1 rounded text-xs font-semibold ${
                        appointment.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                        appointment.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                        appointment.status === 'NO_SHOW' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`
                    }>
                      {appointment.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleEdit(appointment)}
                      className="text-blue-500 hover:text-blue-700 mr-3"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(appointment.id)}
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

export default AdminAppointments;
