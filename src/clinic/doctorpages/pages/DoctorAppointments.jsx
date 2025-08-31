import React, { useState, useEffect } from 'react';
import { FaCheck, FaTimes, FaCalendarDay } from 'react-icons/fa';
import DoctorLayout from '../components/DoctorLayout';
import AppointmentService from '../../../services/AppointmentService';
import DoctorService from '../../../services/DoctorService';
import AuthService from '../../../services/AuthService';

const DoctorAppointments = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [doctorId, setDoctorId] = useState(null);
  const [doctorExists, setDoctorExists] = useState(false);

  useEffect(() => {
    // Debug: Log the doctor ID from localStorage
    console.log('User ID from localStorage (Appointments):', AuthService.getUserId());
    console.log('User role from localStorage (Appointments):', AuthService.getUserRole());
    
    // First verify if the doctor exists with this user ID
    verifyDoctorExists();
  }, []);
  
  useEffect(() => {
    // Only fetch appointments if we have verified that the doctor exists
    if (doctorExists && doctorId) {
      fetchAppointmentsByDate();
    }
  }, [selectedDate, doctorExists, doctorId]);
  
  // First verify if the doctor record exists
  const verifyDoctorExists = async () => {
    setLoading(true);
    try {
      const userId = AuthService.getUserId();
      if (!userId) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }
      
      // Check if user is a doctor
      const userRole = AuthService.getUserRole();
      if (userRole !== 'DOCTOR') {
        setError(`Current user role (${userRole}) is not authorized to view doctor appointments`);
        setLoading(false);
        return;
      }
      
      try {
        const response = await DoctorService.getDoctorByUserId(userId);
        console.log('Doctor verification response:', response.data);
        
        // Check if the response contains an error message or a doctor record
        if (response.data.error) {
          setError(`No doctor record found for user ID ${userId}. Please contact an administrator.`);
          setDoctorExists(false);
        } else {
          // Doctor record found
          setDoctorId(response.data.id);
          setDoctorExists(true);
          setError(null);
          console.log('Doctor ID set to:', response.data.id);
        }
      } catch (err) {
        setError(`No doctor record found for your user account. Please contact an administrator.`);
        console.error('Error verifying doctor:', err);
        setDoctorExists(false);
      }
    } catch (err) {
      setError('An unexpected error occurred: ' + err.message);
      console.error('Unexpected error during doctor verification:', err);
      setDoctorExists(false);
    } finally {
      if (!doctorExists) {
        setLoading(false); // Stop loading if doctor doesn't exist
      }
    }
  };

  const fetchAppointmentsByDate = async () => {
    setLoading(true);
    try {
      // Skip if no doctor ID
      if (!doctorId) {
        setFilteredAppointments([]);
        setLoading(false);
        return;
      }
      
      console.log('Fetching appointments for doctor ID:', doctorId, 'type:', typeof doctorId);
      
      try {
        // Use the backend endpoint to get ALL appointments for the doctor on the selected date
        const response = await AppointmentService.getAllAppointmentsByDoctorAndDate(doctorId, selectedDate);
        console.log('Fetched appointments:', response.data);
        setFilteredAppointments(response.data || []);
        setError(null);
      } catch (err) {
        setError('Failed to fetch appointments: ' + (err.response?.data?.message || err.message));
        console.error('Error fetching appointments:', err);
        setFilteredAppointments([]);
      }
    } catch (err) {
      setError('An unexpected error occurred: ' + err.message);
      console.error('Unexpected error:', err);
      setFilteredAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctorAppointments = async () => {
    // This method is used after status updates to refresh the current view
    try {
      // Skip if no doctor ID
      if (!doctorId) {
        return;
      }
      
      console.log('Refreshing appointments for doctor ID:', doctorId, 'type:', typeof doctorId);
      
      try {
        const response = await AppointmentService.getAllAppointmentsByDoctorAndDate(doctorId, selectedDate);
        console.log('Refreshed appointments:', response.data);
        setFilteredAppointments(response.data || []);
        setError(null);
      } catch (err) {
        setError('Failed to refresh appointments: ' + (err.response?.data?.message || err.message));
        console.error('Error refreshing appointments:', err);
      }
    } catch (err) {
      setError('An unexpected error occurred: ' + err.message);
      console.error('Unexpected error:', err);
    }
  };

  const updateAppointmentStatus = async (appointmentId, newStatus) => {
    try {
      setLoading(true); // Show loading state while updating
      await AppointmentService.updateAppointmentStatus(appointmentId, { status: newStatus });
      // Refresh the appointments list after updating status
      await fetchDoctorAppointments();
      // Show success message
      setError(null);
    } catch (err) {
      setError('Failed to update appointment status: ' + (err.response?.data?.message || err.message));
      console.error('Error updating appointment status:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmAppointment = async (id) => {
    await updateAppointmentStatus(id, 'CONFIRMED');
  };

  const handleCancelAppointment = async (id) => {
    await updateAppointmentStatus(id, 'CANCELLED');
  };

  const formatDateTime = (dateTimeString) => {
    const dateTime = new Date(dateTimeString);
    return dateTime.toLocaleString();
  };

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      case 'BOOKED':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DoctorLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">My Appointments</h1>
        
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
          <div className="flex items-center">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-gray-300 rounded-md shadow-sm p-2 mr-2"
            />
            <button 
              onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
            >
              <FaCalendarDay /> Today
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-4">Loading appointments...</div>
        ) : filteredAppointments.length === 0 ? (
          <div className="text-center py-4 bg-gray-50 rounded">No appointments found for this date.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="py-3 px-4 text-left">Patient</th>
                  <th className="py-3 px-4 text-left">Time</th>
                  <th className="py-3 px-4 text-left">Reason</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((appointment) => (
                  <tr key={appointment.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{appointment.patientName}</td>
                    <td className="py-3 px-4">
                      {new Date(appointment.appointmentTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3 px-4">{appointment.reason}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusBadgeClass(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {appointment.status === 'BOOKED' && (
                        <>
                          <button
                            onClick={() => handleConfirmAppointment(appointment.id)}
                            className="text-green-500 hover:text-green-700 mr-3"
                            title="Confirm Appointment"
                          >
                            <FaCheck />
                          </button>
                          <button
                            onClick={() => handleCancelAppointment(appointment.id)}
                            className="text-red-500 hover:text-red-700"
                            title="Cancel Appointment"
                          >
                            <FaTimes />
                          </button>
                        </>
                      )}
                      {appointment.status === 'CONFIRMED' && (
                        <button
                          onClick={() => handleCancelAppointment(appointment.id)}
                          className="text-red-500 hover:text-red-700"
                          title="Cancel Appointment"
                        >
                          <FaTimes />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DoctorLayout>
  );
};

export default DoctorAppointments;
