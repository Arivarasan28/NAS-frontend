import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AuthService from '../../../services/AuthService';

const AllAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming', 'past', or 'all'

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const userId = AuthService.getUserId();
        
        if (!userId) {
          setError('User ID not found. Please login again.');
          setLoading(false);
          return;
        }
        
        // First, get patient info by user ID
        const patientResponse = await axios.get(`http://localhost:8081/api/patients/user/${userId}`, {
          headers: {
            'Authorization': `Bearer ${AuthService.getToken()}`
          }
        });
        
        const patientId = patientResponse.data.id;
        
        // Then fetch appointments using patient ID
        const response = await axios.get(`http://localhost:8081/api/appointments/patient/${patientId}`, {
          headers: {
            'Authorization': `Bearer ${AuthService.getToken()}`
          }
        });
        
        setAppointments(response.data || []);
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setError('Failed to load appointments. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAppointments();
  }, []);

  // Filter appointments based on active tab
  const filteredAppointments = () => {
    if (activeTab === 'all') return appointments;
    
    const now = new Date();
    
    if (activeTab === 'upcoming') {
      return appointments
        // Consider both date and status - BOOKED and CONFIRMED should be upcoming regardless of time
        .filter(appointment => {
          const appointmentDate = new Date(appointment.appointmentTime);
          return appointmentDate > now || 
                 (appointment.status === 'BOOKED' || appointment.status === 'CONFIRMED');
        })
        .sort((a, b) => new Date(a.appointmentTime) - new Date(b.appointmentTime));
    }
    
    // Past appointments - only show COMPLETED or CANCELLED appointments 
    // or appointments with times in the past
    return appointments
      .filter(appointment => {
        const appointmentDate = new Date(appointment.appointmentTime);
        return (appointmentDate <= now && 
                appointment.status !== 'BOOKED' && 
                appointment.status !== 'CONFIRMED') ||
               appointment.status === 'COMPLETED' || 
               appointment.status === 'CANCELLED';
      })
      .sort((a, b) => new Date(b.appointmentTime) - new Date(a.appointmentTime));
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

  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    
    try {
      // Call API to cancel appointment
      await axios.put(`http://localhost:8081/api/appointments/${appointmentId}/status`, 
        { status: 'CANCELLED' },
        {
          headers: {
            'Authorization': `Bearer ${AuthService.getToken()}`
          }
        }
      );
      
      // Update appointment in the local state
      setAppointments(appointments.map(appointment => {
        if (appointment.id === appointmentId) {
          return { ...appointment, status: 'CANCELLED' };
        }
        return appointment;
      }));
      
    } catch (err) {
      console.error('Error cancelling appointment:', err);
      alert('Failed to cancel appointment. Please try again.');
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
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Appointments</h1>
      
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`py-2 px-4 font-medium ${
            activeTab === 'upcoming' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Upcoming
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={`py-2 px-4 font-medium ${
            activeTab === 'past' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Past
        </button>
        <button
          onClick={() => setActiveTab('all')}
          className={`py-2 px-4 font-medium ${
            activeTab === 'all' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          All
        </button>
      </div>
      
      {/* Appointments List */}
      <div className="space-y-4">
        {filteredAppointments().length > 0 ? (
          filteredAppointments().map((appointment, index) => (
            <div key={index} className="bg-white shadow-md rounded-lg p-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                <div className="mb-4 md:mb-0">
                  <div className="flex items-center">
                    <h3 className="font-semibold text-lg text-gray-800">Dr. {appointment.doctorName}</h3>
                    <span className={`ml-3 px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </div>
                  <p className="text-gray-600">{appointment.doctorSpecialization}</p>
                  <p className="text-gray-600">{formatAppointmentDate(appointment.appointmentTime)}</p>
                  {appointment.reason && <p className="mt-2 text-gray-700 italic">"{appointment.reason}"</p>}
                </div>
                
                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  {activeTab === 'upcoming' && appointment.status !== 'CANCELLED' && (
                    <>
                      <button 
                        className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                        onClick={() => alert('Reschedule feature coming soon!')}
                      >
                        Reschedule
                      </button>
                      <button 
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                        onClick={() => handleCancelAppointment(appointment.id)}
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  
                  {activeTab === 'past' && appointment.status === 'COMPLETED' && (
                    <button 
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                      onClick={() => alert('Medical record view coming soon!')}
                    >
                      View Record
                    </button>
                  )}
                  
                  <button 
                    className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition"
                    onClick={() => alert(`Appointment details for ID: ${appointment.id}`)}
                  >
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white shadow-md rounded-lg p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-800">No {activeTab} appointments found</h3>
            {activeTab === 'upcoming' && (
              <p className="text-gray-600 mt-2">Schedule an appointment to get started</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllAppointments;
