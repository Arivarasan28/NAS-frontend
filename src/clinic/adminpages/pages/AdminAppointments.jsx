import React, { useState, useEffect } from 'react';
import AppointmentService from '../../../services/AppointmentService';
import DoctorService from '../../../services/DoctorService';
import PatientService from '../../../services/PatientService';
import { FaPlus } from 'react-icons/fa';
import AdminLayout from '../components/AdminLayout';
import { AppointmentList } from '../../../components/AppointmentList';

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
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchAppointments(),
        fetchDoctors(),
        fetchPatients()
      ]);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await AppointmentService.getAllAppointments();
      const appointmentsData = response.data;
      
      // Enrich appointments with full patient and doctor data if needed
      const enrichedAppointments = appointmentsData.map(apt => {
        // If patient/doctor objects are missing or incomplete, they'll be enriched
        // from the doctors and patients state that were fetched separately
        return {
          ...apt,
          patient: apt.patient || {},
          doctor: apt.doctor || {}
        };
      });
      
      setAppointments(enrichedAppointments);
      setError(null);
    } catch (err) {
      setError('Failed to fetch appointments: ' + (err.response?.data?.message || err.message));
      console.error('Error fetching appointments:', err);
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

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header with Add Button */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Manage Appointments</h1>
            <p className="text-gray-600 mt-1">View, edit, and manage all appointments</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md transition"
          >
            {showForm ? 'Cancel' : <><FaPlus /> Schedule New Appointment</>}
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-white shadow-lg rounded-lg p-6 mb-6 border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              {editingAppointment ? 'Edit Appointment' : 'Schedule New Appointment'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Patient</label>
                  <select
                    name="patientId"
                    value={formData.patientId}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Patient</option>
                    {patients.map(patient => (
                      <option key={patient.id} value={patient.id}>
                        {patient.name || `${patient.firstName} ${patient.lastName}`}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Doctor</label>
                  <select
                    name="doctorId"
                    value={formData.doctorId}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Doctor</option>
                    {doctors.map(doctor => (
                      <option key={doctor.id} value={doctor.id}>
                        Dr. {doctor.name || `${doctor.firstName} ${doctor.lastName}`} 
                        {doctor.specialization && ` (${doctor.specialization})`}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Date</label>
                  <input
                    type="date"
                    name="appointmentDate"
                    value={formData.appointmentDate}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Time</label>
                  <input
                    type="time"
                    name="appointmentTime"
                    value={formData.appointmentTime}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                  <textarea
                    name="reason"
                    value={formData.reason}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                    required
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="SCHEDULED">Scheduled</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                    <option value="NO_SHOW">No Show</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
                >
                  {editingAppointment ? 'Update Appointment' : 'Schedule Appointment'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Appointment List Component */}
        <AppointmentList
          appointments={appointments}
          loading={loading}
          error={error}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onRefresh={fetchAppointments}
          doctors={doctors}
          patients={patients}
          showStats={true}
          showFilters={true}
          showActions={true}
          showDoctorFilter={true}
          showPatientFilter={true}
          role="admin"
        />
      </div>
    </AdminLayout>
  );
};

export default AdminAppointments;
