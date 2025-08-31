import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaUserMd, FaClipboardCheck } from 'react-icons/fa';
import DoctorLayout from '../components/DoctorLayout';
import AppointmentService from '../../../services/AppointmentService';
import AuthService from '../../../services/AuthService';

const DoctorDashboard = () => {
  const [appointmentStats, setAppointmentStats] = useState({
    today: 0,
    confirmed: 0,
    pending: 0,
    total: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Debug: Log the doctor ID from localStorage
    console.log('Doctor ID from localStorage:', AuthService.getUserId());
    console.log('User role from localStorage:', AuthService.getUserRole());
    
    fetchAppointmentStats();
  }, []);

  const fetchAppointmentStats = async () => {
    setLoading(true);
    try {
      // Get the doctor ID from AuthService - for doctors, userId is the doctorId
      const doctorId = AuthService.getUserId();
      if (!doctorId) {
        setError('Doctor ID not available. Please ensure you are logged in as a doctor.');
        setLoading(false);
        return;
      }
      
      // Check if user is a doctor
      const userRole = AuthService.getUserRole();
      if (userRole !== 'DOCTOR') {
        setError(`Current user role (${userRole}) is not authorized to view doctor dashboard`);
        setLoading(false);
        return;
      }
      
      console.log('Fetching dashboard stats for doctor ID:', doctorId, 'type:', typeof doctorId);
      
      try {
        const response = await AppointmentService.getDoctorAppointments(doctorId);
        const appointments = response.data || [];
        
        // If response.data is an object with a message property, it might be an error
        if (response.data && typeof response.data === 'object' && response.data.message) {
          if (response.data.message.includes('Doctor not found')) {
            setError(`No doctor record found with ID ${doctorId}. Please contact an administrator to link your user account with a doctor profile.`);
            setLoading(false);
            return;
          }
        }
        
        // Calculate today's appointments
        const today = new Date().toISOString().split('T')[0];
        const todayAppointments = appointments.filter(appointment => {
          if (!appointment.appointmentTime) return false;
          const appointmentDate = new Date(appointment.appointmentTime).toISOString().split('T')[0];
          return appointmentDate === today;
        });
        
        // Calculate confirmed and pending appointments
        const confirmed = appointments.filter(appointment => appointment.status === 'CONFIRMED').length;
        const pending = appointments.filter(appointment => appointment.status === 'BOOKED').length;
        
        setAppointmentStats({
          today: todayAppointments.length,
          confirmed: confirmed,
          pending: pending,
          total: appointments.length
        });
        
        setError(null);
      } catch (err) {
        // Handle specific error for doctor not found
        if (err.response?.status === 404) {
          setError(`No doctor record found with ID ${doctorId}. Please contact an administrator to link your user account with a doctor profile.`);
        } else {
          setError('Failed to fetch appointment statistics: ' + (err.response?.data?.message || err.message));
        }
        console.error('Error fetching appointment statistics:', err);
      }
    } catch (err) {
      setError('An unexpected error occurred: ' + err.message);
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DoctorLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Doctor Dashboard</h1>
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm leading-5 font-medium">{error}</p>
                {error.includes('No doctor record found') && (
                  <p className="mt-2 text-sm leading-5">
                    This usually happens when your user account is not properly linked to a doctor profile. Please contact the system administrator to resolve this issue.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
        
        {loading ? (
          <div className="text-center py-4">Loading dashboard...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100 mr-4">
                    <FaCalendarAlt className="text-blue-500 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Today's Appointments</p>
                    <p className="text-2xl font-bold">{appointmentStats.today}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100 mr-4">
                    <FaClipboardCheck className="text-green-500 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Confirmed Appointments</p>
                    <p className="text-2xl font-bold">{appointmentStats.confirmed}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-yellow-100 mr-4">
                    <FaCalendarAlt className="text-yellow-500 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Pending Appointments</p>
                    <p className="text-2xl font-bold">{appointmentStats.pending}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-100 mr-4">
                    <FaUserMd className="text-purple-500 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Appointments</p>
                    <p className="text-2xl font-bold">{appointmentStats.total}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="flex flex-wrap gap-4">
                <Link 
                  to="/doctor/appointments" 
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
                >
                  <FaCalendarAlt /> View All Appointments
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </DoctorLayout>
  );
};

export default DoctorDashboard;
