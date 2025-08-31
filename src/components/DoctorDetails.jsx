import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaUserMd, FaCalendarAlt, FaMapMarkerAlt, FaEnvelope, FaPhone, FaClock } from 'react-icons/fa';
import DoctorService from '../services/DoctorService';
import AppointmentService from '../services/AppointmentService';
import AuthService from '../services/AuthService';

const DoctorDetails = ({ doctorId: propDoctorId }) => {
  const { doctorId: routeDoctorId } = useParams();
  const navigate = useNavigate();
  const doctorId = propDoctorId || routeDoctorId;
  
  const [doctor, setDoctor] = useState(null);
  const [appointmentSlots, setAppointmentSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [slotLoading, setSlotLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [isPatient, setIsPatient] = useState(false);

  useEffect(() => {
    // Check if user is logged in as a patient
    const userRole = AuthService.getUserRole();
    setIsPatient(userRole === 'PATIENT');
    
    fetchDoctorDetails();
  }, [doctorId]);

  useEffect(() => {
    if (doctor) {
      fetchAppointmentSlots();
    }
  }, [doctor, selectedDate]);

  const fetchDoctorDetails = async () => {
    setLoading(true);
    try {
      if (!doctorId) throw new Error('Doctor ID is missing');
      const response = await DoctorService.getDoctorById(doctorId);
      setDoctor(response.data);
      setError(null);
    } catch (err) {
      let errorMessage = 'Failed to fetch doctor details';
      
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (err.response.status === 403) {
          errorMessage = 'You do not have permission to view this doctor\'s details. Please log in with appropriate credentials.';
        } else if (err.response.status === 401) {
          errorMessage = 'Authentication required. Please log in to view doctor details.';
        } else if (err.response.data && err.response.data.message) {
          errorMessage += ': ' + err.response.data.message;
        }
      } else if (err.request) {
        // The request was made but no response was received
        errorMessage = 'No response from server. Please check your connection and try again.';
      } else {
        // Something happened in setting up the request that triggered an Error
        errorMessage += ': ' + err.message;
      }
      
      setError(errorMessage);
      console.error('Error fetching doctor details:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointmentSlots = async () => {
    setSlotLoading(true);
    try {
      // Fetch available appointment slots for this doctor on the selected date
      if (!doctorId) {
        setAppointmentSlots([]);
        return;
      }
      const response = await AppointmentService.getAvailableSlotsByDoctorAndDate(doctorId, selectedDate);
      setAppointmentSlots(response.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching appointment slots:', err);
      // We'll show a more user-friendly message for appointment slots
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        // We don't set the main error for auth issues with slots, as the doctor details are more important
        // Instead, we'll handle this in the UI with a more specific message
        setAppointmentSlots([]);
      } else {
        // For other errors, we'll just show empty slots
        setAppointmentSlots([]);
      }
    } finally {
      setSlotLoading(false);
    }
  };

  const handleBookAppointment = async (slotId) => {
    if (!isPatient) {
      setError('You must be logged in as a patient to book appointments');
      return;
    }

    try {
      const patientId = AuthService.getUserId();
      if (!patientId) {
        setError('User not authenticated or patient ID not available');
        return;
      }

      await AppointmentService.bookAppointment(slotId, patientId);
      setBookingSuccess('Appointment booked successfully!');
      setError(null); // Clear any previous errors
      
      // Refresh the slots
      fetchAppointmentSlots();
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setBookingSuccess(null);
      }, 3000);
    } catch (err) {
      let errorMessage = 'Failed to book appointment';
      
      if (err.response) {
        if (err.response.status === 403) {
          errorMessage = 'You do not have permission to book this appointment.';
        } else if (err.response.status === 401) {
          errorMessage = 'Authentication required. Please log in again to book this appointment.';
        } else if (err.response.status === 409) {
          errorMessage = 'This appointment slot is no longer available. Please refresh and try another slot.';
        } else if (err.response.data && err.response.data.message) {
          errorMessage += ': ' + err.response.data.message;
        }
      } else if (err.request) {
        errorMessage = 'No response from server. Please check your connection and try again.';
      } else {
        errorMessage += ': ' + err.message;
      }
      
      setError(errorMessage);
      setBookingSuccess(null); // Clear any success message
      console.error('Error booking appointment:', err);
    }
  };

  const formatTime = (isoString) => {
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-green-100 text-green-800';
      case 'BOOKED':
        return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4">Loading doctor details...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      ) : doctor ? (
        <>
          {bookingSuccess && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {bookingSuccess}
            </div>
          )}
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="p-6">
              <div className="flex items-center mb-6">
                <div className="w-32 h-32 rounded-full overflow-hidden mr-6 bg-gray-100">
                  <img 
                    src={doctor.profilePictureUrl || '/default-profile.png'}
                    alt={`Dr. ${doctor.firstName || ''} ${doctor.lastName || ''}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/default-profile.png';
                    }}
                  />
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-2">Dr. {doctor.firstName || ''} {doctor.lastName || ''}</h1>
                  <p className="text-xl text-blue-600 mb-1">{doctor.specialty || 'General'}</p>
                  <p className="text-gray-600">{doctor.qualification || 'Qualification not specified'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                  <div className="space-y-3 text-gray-600">
                    <div className="flex items-center">
                      <FaMapMarkerAlt className="mr-2" />
                      <span>{doctor.address || 'Address not provided'}</span>
                    </div>
                    <div className="flex items-center">
                      <FaEnvelope className="mr-2" />
                      <span>{doctor.email || 'Email not provided'}</span>
                    </div>
                    <div className="flex items-center">
                      <FaPhone className="mr-2" />
                      <span>{doctor.phoneNumber || 'Phone not provided'}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold mb-4">Professional Details</h2>
                  <div className="space-y-3 text-gray-600">
                    <div><strong>Experience:</strong> {doctor.yearsOfExperience ? `${doctor.yearsOfExperience} years` : 'Not specified'}</div>
                    <div><strong>Education:</strong> {doctor.education || 'Not specified'}</div>
                    <div><strong>Languages:</strong> {doctor.languages || 'Not specified'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-6 flex items-center">
                <FaCalendarAlt className="mr-2 text-blue-500" />
                Available Appointment Slots
              </h2>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="border border-gray-300 rounded-md shadow-sm p-2"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              {slotLoading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="mt-2">Loading slots...</p>
                </div>
              ) : appointmentSlots.length === 0 ? (
                <div className="text-center py-6 bg-gray-50 rounded-lg">
                  <FaClock className="mx-auto text-4xl text-gray-400" />
                  <p className="mt-4 text-gray-600">No available appointment slots for this date.</p>
                  {!AuthService.isLoggedIn() && (
                    <p className="mt-2 text-sm text-blue-600">
                      <button 
                        onClick={() => navigate('/login')} 
                        className="underline hover:text-blue-800"
                      >
                        Log in
                      </button> to see all available slots.
                    </p>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {appointmentSlots.map((slot) => (
                    <div 
                      key={slot.id} 
                      className={`border rounded-lg p-4 text-center ${
                        slot.status === 'AVAILABLE' ? 'border-green-300' : 'border-gray-300'
                      }`}
                    >
                      <div className="font-semibold mb-2">{formatTime(slot.appointmentTime)}</div>
                      <div className={`text-xs px-2 py-1 rounded mb-3 ${getStatusColor(slot.status)}`}>
                        {slot.status}
                      </div>
                      
                      {slot.status === 'AVAILABLE' && isPatient ? (
                        <button
                          onClick={() => handleBookAppointment(slot.id)}
                          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-sm"
                        >
                          Book
                        </button>
                      ) : slot.status === 'AVAILABLE' && !isPatient ? (
                        <button
                          onClick={() => navigate('/login')}
                          className="w-full bg-gray-500 hover:bg-gray-600 text-white py-1 px-3 rounded text-sm"
                        >
                          Login to Book
                        </button>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div> */}
        </>
      ) : null}
    </div>
  );
};

export default DoctorDetails;
