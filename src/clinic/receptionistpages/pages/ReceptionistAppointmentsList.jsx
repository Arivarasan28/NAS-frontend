import React, { useState, useEffect } from 'react';
import AppointmentService from '../../../services/AppointmentService';
import DoctorService from '../../../services/DoctorService';
import PatientService from '../../../services/PatientService';
import ReceptionistLayout from '../components/ReceptionistLayout';
import { AppointmentList } from '../../../components/AppointmentList';
import { Calendar } from 'lucide-react';

const ReceptionistAppointmentsList = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      await AppointmentService.updateAppointmentStatus(appointmentId, { status: newStatus });
      fetchAppointments();
    } catch (err) {
      setError('Failed to update status: ' + (err.response?.data?.message || err.message));
      console.error('Error updating status:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await AppointmentService.updateAppointmentStatus(id, { status: 'CANCELLED' });
        fetchAppointments();
      } catch (err) {
        setError('Failed to cancel appointment: ' + (err.response?.data?.message || err.message));
        console.error('Error cancelling appointment:', err);
      }
    }
  };

  return (
    <ReceptionistLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Appointment List</h1>
          <p className="text-gray-600 mt-1">View and manage all appointments</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Receptionist Actions</h3>
              <p className="text-sm text-blue-800">
                View appointment details, update status, or cancel appointments. 
                Use filters to find specific appointments quickly.
              </p>
            </div>
          </div>
        </div>

        <AppointmentList
          appointments={appointments}
          loading={loading}
          error={error}
          onDelete={handleDelete}
          onRefresh={fetchAppointments}
          doctors={doctors}
          patients={patients}
          showStats={true}
          showFilters={true}
          showActions={true}
          showDoctorFilter={true}
          showPatientFilter={true}
          role="receptionist"
        />
      </div>
    </ReceptionistLayout>
  );
};

export default ReceptionistAppointmentsList;
