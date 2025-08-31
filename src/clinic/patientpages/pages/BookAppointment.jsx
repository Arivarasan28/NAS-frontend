import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthService from '../../../services/AuthService';
import DoctorCard from '../../../components/DoctorCard';
import DoctorDetails from '../../../components/DoctorDetails';
import AppointmentFlowModal from '../../../components/AppointmentFlowModal';

const BookAppointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Modal state for doctor details popup
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsDoctor, setDetailsDoctor] = useState(null);

  // Modal state for booking flow (date & time selection)
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingDoctor, setBookingDoctor] = useState(null);

  // On component mount, fetch all doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8081/api/doctor/', {
          headers: {
            'Authorization': `Bearer ${AuthService.getToken()}`
          }
        });
        setDoctors(response.data);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        setErrorMessage('Failed to load doctors. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Generate array of next 14 days for date picker
  const getNextTwoWeeks = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateString = date.toISOString().split('T')[0];
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      const dayMonth = date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
      
      dates.push({
        dateString,
        display: `${dayName}, ${dayMonth}`
      });
    }
    
    return dates;
  };

  // Fetch available slots when doctor and date are selected
  const fetchAvailableSlots = async () => {
    if (!selectedDoctor || !selectedDate) return;
    
    try {
      setLoading(true);
      setAvailableSlots([]);
      
      const response = await axios.get(
        `http://localhost:8081/api/appointments/slots/available/doctor/${selectedDoctor.id}/date/${selectedDate}`,
        {
          headers: {
            'Authorization': `Bearer ${AuthService.getToken()}`
          }
        }
      );
      
      // Sort slots by appointment time
      const sortedSlots = response.data.sort((a, b) => 
        new Date(a.appointmentTime) - new Date(b.appointmentTime)
      );
      
      setAvailableSlots(sortedSlots);
    } catch (error) {
      console.error('Error fetching available slots:', error);
      setErrorMessage('Failed to load available slots. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch available slots whenever doctor or date changes
  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      fetchAvailableSlots();
    }
  }, [selectedDoctor, selectedDate]);

  // Handle doctor selection
  const handleDoctorSelect = (doctor) => {
    // Open booking modal for modern flow
    setBookingDoctor(doctor);
    setBookingOpen(true);
  };

  // Open details modal when clicking card (not the action button)
  const onCardClick = (doctor) => {
    setDetailsDoctor(doctor);
    setDetailsOpen(true);
  };

  const closeDetails = () => {
    setDetailsOpen(false);
    setDetailsDoctor(null);
  };

  // Handle date selection
  const handleDateSelect = (dateString) => {
    setSelectedDate(dateString);
    setAvailableSlots([]);
    if (selectedDoctor) fetchAvailableSlots();
  };

  // Format time from ISO string to readable format
  const formatAppointmentTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Book an appointment
  const bookAppointment = async (appointmentId) => {
    try {
      setLoading(true);
      setSuccessMessage('');
      setErrorMessage('');
      
      const userId = AuthService.getUserId();
      
      if (!userId) {
        setErrorMessage('User ID not found. Please login again.');
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
      
      const response = await axios.post(
        `http://localhost:8081/api/appointments/book/${appointmentId}/patient/${patientId}`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${AuthService.getToken()}`
          }
        }
      );
      
      setSuccessMessage('Appointment booked successfully!');
      
      // Remove the booked slot from available slots
      setAvailableSlots(availableSlots.filter(slot => slot.id !== appointmentId));
      
      // Redirect to dashboard after a delay
      setTimeout(() => {
        navigate('/patient-dashboard');
      }, 2000);
      
    } catch (error) {
      console.error('Error booking appointment:', error);
      if (error.response && error.response.data) {
        setErrorMessage(`Failed to book appointment: ${error.response.data.message}`);
      } else {
        setErrorMessage('Failed to book appointment. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Book an Appointment</h1>
      
      {/* Success message */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          <p>{successMessage}</p>
        </div>
      )}

      {/* Doctor Details Modal */}
      {detailsOpen && detailsDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={closeDetails} />
          <div className="relative bg-white w-full max-w-4xl mx-4 rounded-lg shadow-xl overflow-hidden">
            <div className="flex justify-between items-center px-4 py-3 border-b">
              <h3 className="text-lg font-semibold">Doctor Details</h3>
              <button onClick={closeDetails} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            <div className="max-h-[80vh] overflow-y-auto p-4">
              <DoctorDetails doctorId={detailsDoctor.id} />
            </div>
          </div>
        </div>
      )}

      {/* Appointment Booking Modal */}
      {bookingOpen && bookingDoctor && (
        <AppointmentFlowModal
          isOpen={bookingOpen}
          onClose={() => { setBookingOpen(false); setBookingDoctor(null); }}
          doctor={bookingDoctor}
        />
      )}
      
      {/* Error message */}
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>{errorMessage}</p>
        </div>
      )}
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">1. Select a Doctor</h2>
          
          {loading && !doctors.length ? (
            <div className="flex justify-center p-4">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {doctors.map(doctor => (
                <DoctorCard
                  key={doctor.id}
                  doctor={doctor}
                  mode="display"
                  showBookButton={true}
                  onBookAppointment={handleDoctorSelect}
                  userRole={AuthService.getUserRole()}
                  onCardClick={onCardClick}
                />
              ))}
            </div>
          )}
          
          {!doctors.length && !loading && (
            <div className="text-center p-4 border border-gray-200 rounded">
              <p className="text-gray-600">No doctors found. Please try again later.</p>
            </div>
          )}
        </div>
      </div>
      
      {selectedDoctor && (
        <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">2. Select a Date</h2>
            
            <div className="flex flex-nowrap overflow-x-auto pb-4 space-x-2">
              {getNextTwoWeeks().map(date => (
                <div
                  key={date.dateString}
                  onClick={() => handleDateSelect(date.dateString)}
                  className={`flex-shrink-0 border rounded-lg p-3 cursor-pointer transition ${
                    selectedDate === date.dateString 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <p className="text-sm font-medium text-center">{date.display}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {selectedDoctor && selectedDate && (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">3. Select an Available Time Slot</h2>
            
            {loading ? (
              <div className="flex justify-center p-4">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <>
                {availableSlots.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot.id}
                        onClick={() => bookAppointment(slot.id)}
                        className="border border-blue-300 bg-white hover:bg-blue-50 rounded-lg py-3 px-4 text-center transition"
                        disabled={loading}
                      >
                        <span className="block text-blue-800 font-medium">{formatAppointmentTime(slot.appointmentTime)}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-8 border border-gray-200 rounded">
                    <p className="text-gray-600">No available slots for this date. Please select another date.</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookAppointment;
