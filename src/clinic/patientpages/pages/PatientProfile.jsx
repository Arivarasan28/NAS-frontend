import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AuthService from '../../../services/AuthService';

const PatientProfile = () => {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [appointments, setAppointments] = useState([]);
  
  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        // Get userId from token
        const userId = AuthService.getUserId();
        
        if (!userId) {
          setError('User ID not found. Please login again.');
          setLoading(false);
          return;
        }
        
        console.log('Fetching patient data for user ID:', userId);
        
        // Fetch patient data
        const response = await axios.get(`http://localhost:8081/api/patients/user/${userId}`, {
          headers: {
            'Authorization': `Bearer ${AuthService.getToken()}`
          }
        });
        
        console.log('Patient data received:', response.data);
        setPatient(response.data);
        
        // Only fetch appointments if we have a patient ID
        if (response.data && response.data.id) {
          try {
            // Fetch patient appointments
            const appointmentsResponse = await axios.get(`http://localhost:8081/api/appointments/patient/${response.data.id}`, {
              headers: {
                'Authorization': `Bearer ${AuthService.getToken()}`
              }
            });
            
            console.log('Appointments received:', appointmentsResponse.data);
            setAppointments(appointmentsResponse.data || []);
          } catch (appointmentErr) {
            console.error('Error fetching appointments:', appointmentErr);
            // Don't fail the whole page if just appointments fail
            setAppointments([]);
          }
        } else {
          setAppointments([]);
        }
      } catch (err) {
        console.error('Error fetching patient data:', err);
        if (err.response) {
          console.error('Error response:', err.response.status, err.response.data);
          setError(`Failed to load patient data: ${err.response.status} ${err.response.statusText}`);
        } else if (err.request) {
          console.error('No response received:', err.request);
          setError('Failed to load patient data: No response from server');
        } else {
          console.error('Error message:', err.message);
          setError(`Failed to load patient data: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchPatientData();
  }, []);
  
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
  
  if (!patient) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p>No patient data found.</p>
        </div>
      </div>
    );
  }
  
  // Get initials for avatar
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };
  
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Patient Profile</h1>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-blue-500 p-6 text-white">
          <div className="flex items-center">
            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-blue-500 text-2xl font-bold mr-4">
              {patient.name ? getInitials(patient.name) : '??'}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{patient.name || 'Unknown'}</h2>
              <p className="text-blue-100">Patient ID: {patient.id || 'Unknown'}</p>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-700">Personal Information</h3>
              <div className="space-y-3">
                <div className="flex">
                  <span className="font-medium w-32 text-gray-500">Full Name:</span>
                  <span className="text-gray-800">{patient.name || 'Not provided'}</span>
                </div>
                <div className="flex">
                  <span className="font-medium w-32 text-gray-500">Email:</span>
                  <span className="text-gray-800">{patient.email || 'Not provided'}</span>
                </div>
                <div className="flex">
                  <span className="font-medium w-32 text-gray-500">Phone:</span>
                  <span className="text-gray-800">{patient.phone || 'Not provided'}</span>
                </div>
                <div className="flex">
                  <span className="font-medium w-32 text-gray-500">Address:</span>
                  <span className="text-gray-800">{patient.address || 'Not provided'}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-700">Upcoming Appointments</h3>
              {appointments.length > 0 ? (
                appointments.map((appointment, index) => (
                  <div key={index} className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-blue-800">{appointment.doctorName || 'Doctor'}</p>
                        <p className="text-sm text-gray-600">{appointment.specialization || 'Specialist'}</p>
                        <p className="text-sm text-gray-600">
                          {appointment.appointmentDate ? new Date(appointment.appointmentDate).toLocaleDateString() : 'Date not set'} - 
                          {appointment.appointmentTime || 'Time not set'}
                        </p>
                      </div>
                      <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">
                        Reschedule
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                  <p className="text-gray-500">No upcoming appointments</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Medical History</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">No medical history available.</p>
            </div>
          </div>
          
          <div className="mt-8 flex space-x-4">
            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
              Book New Appointment
            </button>
            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition">
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
