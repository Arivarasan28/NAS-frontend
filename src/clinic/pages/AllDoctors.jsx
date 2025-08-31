import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserMd, FaCalendarAlt, FaMapMarkerAlt, FaEnvelope, FaPhone } from 'react-icons/fa';
import DoctorService from '../../services/DoctorService';
import AuthService from '../../services/AuthService';
import axios from 'axios';

const AllDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('');
  const [specialties, setSpecialties] = useState([]);
  
  // Booking state - copied from working BookAppointment component
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [bookingMode, setBookingMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const response = await DoctorService.getAllDoctors();
      setDoctors(response.data);
      
      // Extract unique specialties for filtering
      const uniqueSpecialties = [...new Set(response.data.map(doctor => doctor.specialty))];
      setSpecialties(uniqueSpecialties);
      
      setError(null);
    } catch (err) {
      let errorMessage = 'Failed to fetch doctors';
      
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (err.response.status === 403) {
          errorMessage = 'You do not have permission to view doctors. Please log in with appropriate credentials.';
        } else if (err.response.status === 401) {
          errorMessage = 'Authentication required. Please log in to view doctors.';
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
      console.error('Error fetching doctors:', err);
    } finally {
      setLoading(false);
    }
  };

  // Generate array of next 14 days for date picker - copied from working BookAppointment
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

  // Fetch available slots when doctor and date are selected - copied from working BookAppointment
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

  // Fetch available slots whenever doctor or date changes - copied from working BookAppointment
  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      fetchAvailableSlots();
    }
  }, [selectedDoctor, selectedDate]);

  // Handle doctor selection for booking - copied from working BookAppointment
  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setAvailableSlots([]);
    setBookingMode(true);
    if (selectedDate) fetchAvailableSlots();
  };

  // Handle date selection - copied from working BookAppointment
  const handleDateSelect = (dateString) => {
    setSelectedDate(dateString);
    setAvailableSlots([]);
    if (selectedDoctor) fetchAvailableSlots();
  };

  // Format time from ISO string to readable format - copied from working BookAppointment
  const formatAppointmentTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Book an appointment - copied from working BookAppointment
  const bookAppointment = async (appointmentId) => {
    // Check if user is logged in as patient
    const userRole = AuthService.getUserRole();
    if (userRole !== 'PATIENT') {
      setErrorMessage('Please log in as a patient to book appointments.');
      return;
    }

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
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      
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

  // Filter doctors based on search term and specialty
  const filteredDoctors = doctors.filter(doctor => {
    // Safely check if properties exist before calling toLowerCase()
    const firstName = doctor.firstName || '';
    const lastName = doctor.lastName || '';
    const specialty = doctor.specialty || '';
    
    const matchesSearch = 
      firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      specialty.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSpecialty = specialtyFilter === '' || specialty === specialtyFilter;
    
    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Our Doctors</h1>
      
      {/* Success message - copied from working BookAppointment */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          <p>{successMessage}</p>
        </div>
      )}
      
      {/* Error message - copied from working BookAppointment */}
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>{errorMessage}</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {!bookingMode ? (
        <>
          <div className="mb-8 flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-2/3">
              <input
                type="text"
                placeholder="Search by name or specialty..."
                className="w-full p-3 border border-gray-300 rounded-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-1/3">
              <select
                className="w-full p-3 border border-gray-300 rounded-md"
                value={specialtyFilter}
                onChange={(e) => setSpecialtyFilter(e.target.value)}
              >
                <option value="">All Specialties</option>
                {specialties.map((specialty, index) => (
                  <option key={index} value={specialty}>
                    {specialty}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4">Loading doctors...</p>
            </div>
          ) : filteredDoctors.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <FaUserMd className="mx-auto text-4xl text-gray-400" />
              <p className="mt-4 text-gray-600">No doctors found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDoctors.map((doctor) => (
                <div key={doctor.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-20 h-20 rounded-full overflow-hidden mr-4 bg-gray-100">
                        <img 
                          src={doctor.profilePictureUrl || '/default-profile.png'} 
                          alt={`Dr. ${doctor.firstName} ${doctor.lastName}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/default-profile.png';
                          }}
                        />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold">Dr. {doctor.firstName || ''} {doctor.lastName || ''}</h2>
                        <p className="text-blue-600">{doctor.specialty || 'General'}</p>
                      </div>
                    </div>
                    
                    <div className="mb-4 text-gray-600">
                      <div className="flex items-center mb-2">
                        <FaMapMarkerAlt className="mr-2" />
                        <span>{doctor.address || 'Address not provided'}</span>
                      </div>
                      <div className="flex items-center mb-2">
                        <FaEnvelope className="mr-2" />
                        <span>{doctor.email || 'Email not provided'}</span>
                      </div>
                      <div className="flex items-center">
                        <FaPhone className="mr-2" />
                        <span>{doctor.phoneNumber || 'Phone not provided'}</span>
                      </div>
                    </div>
                    
                    {/* Updated button to use booking functionality instead of navigation */}
                    {AuthService.getUserRole() === 'PATIENT' ? (
                      <button 
                        onClick={() => handleDoctorSelect(doctor)}
                        className="block w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded text-center transition-colors flex items-center justify-center"
                      >
                        <FaCalendarAlt className="mr-2" />
                        Book Appointment
                      </button>
                    ) : (
                      <Link 
                        to={`/doctors/${doctor.id}`} 
                        className="block w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded text-center transition-colors flex items-center justify-center"
                      >
                        <FaCalendarAlt className="mr-2" />
                        View Profile & Book Appointment
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        /* Booking flow UI - copied from working BookAppointment component */
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Book Appointment with Dr. {selectedDoctor?.firstName} {selectedDoctor?.lastName}</h2>
            <button 
              onClick={() => {
                setBookingMode(false);
                setSelectedDoctor(null);
                setSelectedDate('');
                setAvailableSlots([]);
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              Back to Doctors
            </button>
          </div>

          {selectedDoctor && (
            <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">1. Select a Date</h3>
                
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
                <h3 className="text-xl font-semibold text-gray-800 mb-4">2. Select an Available Time Slot</h3>
                
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
      )}
    </div>
  );
};

export default AllDoctors;
