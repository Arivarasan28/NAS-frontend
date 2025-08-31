import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthService from '../../../services/AuthService';

const PatientDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [pastAppointments, setPastAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [patientInfo, setPatientInfo] = useState(null);
  
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const userId = AuthService.getUserId();
        
        if (!userId) {
          setError('User ID not found. Please login again.');
          setLoading(false);
          return;
        }
        
        // Fetch patient information using user ID
        const patientResponse = await axios.get(`http://localhost:8081/api/patients/user/${userId}`, {
          headers: {
            'Authorization': `Bearer ${AuthService.getToken()}`
          }
        });
        
        const patientInfo = patientResponse.data;
        setPatientInfo(patientInfo);
        
        // Fetch all appointments for the patient using the actual patient ID
        const appointmentsResponse = await axios.get(`http://localhost:8081/api/appointments/patient/${patientInfo.id}`, {
          headers: {
            'Authorization': `Bearer ${AuthService.getToken()}`
          }
        });
        
        const allAppointments = appointmentsResponse.data || [];
        setAppointments(allAppointments);
        
        // Separate upcoming and past appointments
        const now = new Date();
        const upcoming = allAppointments.filter(appointment => 
          new Date(appointment.appointmentTime) > now
        ).sort((a, b) => new Date(a.appointmentTime) - new Date(b.appointmentTime));
        
        const past = allAppointments.filter(appointment => 
          new Date(appointment.appointmentTime) <= now
        ).sort((a, b) => new Date(b.appointmentTime) - new Date(a.appointmentTime));
        
        setUpcomingAppointments(upcoming);
        setPastAppointments(past);
        
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load your dashboard information');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  const handleBookAppointment = () => {
    navigate('/book-appointment');
  };
  
  const formatAppointmentDate = (dateString) => {
    const options = { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'BOOKED':
        return 'bg-blue-100 text-blue-800';
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'COMPLETED':
        return 'bg-purple-100 text-purple-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow-md overflow-hidden mb-6">
        <div className="p-6 text-white">
          <h1 className="text-3xl font-bold">Welcome{patientInfo ? `, ${patientInfo.name}` : ''}!</h1>
          <p className="mt-2 text-blue-100">View your appointments and manage your health records</p>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-200">
          <div className="flex items-center">
            <div className="rounded-full bg-blue-100 p-3 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-800">Book Appointment</h3>
              <p className="text-sm text-gray-600">Schedule a new appointment with a doctor</p>
            </div>
          </div>
          <button 
            onClick={handleBookAppointment}
            className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Book Now
          </button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-200">
          <div className="flex items-center">
            <div className="rounded-full bg-green-100 p-3 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-800">Medical Records</h3>
              <p className="text-sm text-gray-600">View your medical history and reports</p>
            </div>
          </div>
          <Link 
            to="/medical-records"
            className="mt-4 w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition block text-center"
          >
            View Records
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-200">
          <div className="flex items-center">
            <div className="rounded-full bg-purple-100 p-3 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-800">My Profile</h3>
              <p className="text-sm text-gray-600">View and edit your personal information</p>
            </div>
          </div>
          <Link 
            to="/patient-profile"
            className="mt-4 w-full px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition block text-center"
          >
            Go to Profile
          </Link>
        </div>
      </div>
      
      {/* Upcoming Appointments */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Upcoming Appointments</h2>
          <Link to="/all-appointments" className="text-blue-500 hover:text-blue-700">View All</Link>
        </div>
        
        {upcomingAppointments.length > 0 ? (
          <div className="space-y-4">
            {upcomingAppointments.slice(0, 3).map((appointment, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                  <div className="flex items-start">
                    <div className="rounded-full bg-blue-100 p-3 mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Dr. {appointment.doctorName}</h3>
                      <p className="text-sm text-gray-600">{appointment.doctorSpecialization}</p>
                      <p className="text-sm text-gray-600">{formatAppointmentDate(appointment.appointmentTime)}</p>
                      <span className={`inline-block mt-2 px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 mt-4 md:mt-0">
                    <button className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition text-sm">
                      Reschedule
                    </button>
                    <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 p-8 rounded-lg text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-800">No upcoming appointments</h3>
            <p className="text-gray-600 mt-2">Schedule an appointment with one of our doctors</p>
            <button 
              onClick={handleBookAppointment}
              className="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Book Appointment
            </button>
          </div>
        )}
      </div>
      
      {/* Recent Medical History */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Recent Medical History</h2>
          <Link to="/medical-history" className="text-blue-500 hover:text-blue-700">View All</Link>
        </div>
        
        {pastAppointments.length > 0 ? (
          <div className="space-y-4">
            {pastAppointments.slice(0, 3).map((appointment, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
                <div className="flex items-start">
                  <div className="rounded-full bg-purple-100 p-3 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="flex items-center">
                      <h3 className="font-semibold text-gray-800">Dr. {appointment.doctorName}</h3>
                      <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{appointment.doctorSpecialization}</p>
                    <p className="text-sm text-gray-600">{formatAppointmentDate(appointment.appointmentTime)}</p>
                    <p className="mt-2 text-gray-700">{appointment.reason || "No diagnosis provided"}</p>
                    <button className="mt-2 text-blue-500 text-sm hover:text-blue-700">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 p-8 rounded-lg text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-800">No medical history</h3>
            <p className="text-gray-600 mt-2">Your past appointments and medical records will appear here</p>
          </div>
        )}
      </div>
      
      {/* Health Metrics */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Health Metrics</h2>
        <div className="bg-gray-50 p-8 rounded-lg text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-800">No health metrics yet</h3>
          <p className="text-gray-600 mt-2">Health measurements and statistics will appear here</p>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
