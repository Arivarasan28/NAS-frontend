import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, AlertCircle, CheckCircle, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import AuthService from '../../../services/AuthService';
import AppointmentService from '../../../services/AppointmentService';
import PaymentService from '../../../services/PaymentService';
import DoctorCard from '../../../components/DoctorCard';
import PatientSelectionModal from '../components/PatientSelectionModal';
import ReceptionistLayout from '../components/ReceptionistLayout';

const ReceptionistAppointments = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [viewMode, setViewMode] = useState('today');
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date());
  const [slotsByDate, setSlotsByDate] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [bookingInProgress, setBookingInProgress] = useState(false);

  // Fetch all doctors on component mount
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

  // Get dates based on view mode
  const getDatesToDisplay = () => {
    const dates = [];
    const today = new Date();
    
    if (viewMode === 'today') {
      dates.push(today);
    } else if (viewMode === 'week') {
      for (let i = 0; i < 7; i++) {
        const date = new Date(currentWeekStart);
        date.setDate(currentWeekStart.getDate() + i);
        dates.push(date);
      }
    } else if (viewMode === 'future') {
      for (let i = 0; i < 14; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        dates.push(date);
      }
    }
    
    return dates.map(date => ({
      date: date,
      dateString: date.toISOString().split('T')[0],
      dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
      dayMonth: date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
      isToday: date.toDateString() === today.toDateString()
    }));
  };

  // Fetch smart available slots for multiple dates
  const fetchSlotsForDates = async () => {
    if (!selectedDoctor) return;
    
    try {
      setLoading(true);
      setSlotsByDate({});
      setErrorMessage('');
      
      const dates = getDatesToDisplay();
      const slotsMap = {};
      
      for (const dateInfo of dates) {
        try {
          const response = await AppointmentService.getSmartAvailableSlots(
            selectedDoctor.id, 
            dateInfo.dateString
          );
          
          const sortedSlots = response.data.sort((a, b) => 
            new Date(a.startTime) - new Date(b.startTime)
          );
          
          slotsMap[dateInfo.dateString] = sortedSlots;
        } catch (error) {
          slotsMap[dateInfo.dateString] = [];
        }
      }
      
      setSlotsByDate(slotsMap);
    } catch (error) {
      console.error('Error fetching smart slots:', error);
      setErrorMessage('Failed to load available slots. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch slots whenever doctor or view mode changes
  useEffect(() => {
    if (selectedDoctor) {
      fetchSlotsForDates();
    }
  }, [selectedDoctor, viewMode, currentWeekStart]);

  // Handle doctor selection
  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setSuccessMessage('');
    setErrorMessage('');
  };

  // Navigate week
  const navigateWeek = (direction) => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(currentWeekStart.getDate() + (direction * 7));
    setCurrentWeekStart(newDate);
  };

  // Format time from ISO string to readable format
  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Handle slot selection - opens patient selection modal
  const handleSlotSelection = async (slot, dateString) => {
    setSelectedSlot(slot);
    setSelectedDate(dateString);
    setShowPatientModal(true);
  };

  // Handle patient selection and book with cash payment
  const handlePatientSelected = async (patient) => {
    try {
      setBookingInProgress(true);
      setErrorMessage('');
      setSuccessMessage('');
      setShowPatientModal(false);

      // For receptionist: Create appointment directly with patient info (no reservation needed)
      const appointmentData = {
        doctorId: selectedDoctor.id,
        patientId: patient.id,
        appointmentTime: selectedSlot.startTime,
        reason: 'Walk-in Appointment',
        status: 'SCHEDULED' // Directly set to SCHEDULED for receptionist bookings
      };

      const appointmentResp = await axios.post(
        'http://localhost:8081/api/appointments',
        appointmentData,
        { headers: { Authorization: `Bearer ${AuthService.getToken()}` } }
      );

      const appointmentId = appointmentResp.data.id;

      // Try to create cash payment (optional - may fail due to role restrictions)
      const consultationFee = selectedDoctor?.fee || 500.00;
      let paymentCreated = false;
      
      try {
        const paymentCreateData = {
          appointmentId: appointmentId,
          paymentMethod: 'CASH',
          amount: consultationFee,
          notes: 'Cash payment at reception - Booked by receptionist'
        };

        await PaymentService.processPayment(paymentCreateData);
        paymentCreated = true;
      } catch (paymentError) {
        console.warn('Payment creation failed (may require PATIENT role):', paymentError);
        // Continue without payment - appointment is still created
      }

      setSuccessMessage(
        `Appointment booked successfully for ${patient.name} on ${selectedDate} at ${formatTime(selectedSlot.startTime)}! ${
          paymentCreated 
            ? `Payment: Cash (₹${consultationFee})` 
            : `Please collect cash payment: ₹${consultationFee}`
        }`
      );

      // Refresh available slots
      setTimeout(() => {
        fetchSlotsForDates();
      }, 1000);

      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);

    } catch (error) {
      console.error('Error booking appointment:', error);
      
      if (error.response?.status === 409) {
        setErrorMessage('This slot is currently being booked by another user. Please select a different time slot.');
        fetchSlotsForDates();
      } else if (error.response?.data?.message) {
        setErrorMessage(`Booking failed: ${error.response.data.message}`);
      } else {
        setErrorMessage('Failed to book appointment. Please try again.');
      }
    } finally {
      setBookingInProgress(false);
      setSelectedSlot(null);
      setSelectedDate(null);
    }
  };

  const datesToDisplay = getDatesToDisplay();

  return (
    <ReceptionistLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-800">Book Appointment for Patient</h1>
            </div>
            <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">Receptionist Booking System</p>
                <p>Select a doctor and available time slot. You'll be prompted to select a patient and complete the booking with cash payment.</p>
              </div>
            </div>
          </div>
          
          {/* Success message */}
          {successMessage && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                <p className="text-green-700 font-medium">{successMessage}</p>
              </div>
            </div>
          )}

          {/* Error message */}
          {errorMessage && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
                <p className="text-red-700 font-medium">{errorMessage}</p>
              </div>
            </div>
          )}
          
          {/* Step 1: Select a Doctor */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <User className="w-5 h-5" />
                Step 1: Select a Doctor
              </h2>
            </div>
            
            <div className="p-6">
              {loading && !doctors.length ? (
                <div className="flex flex-col items-center justify-center p-8 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
                  <p className="text-lg font-semibold text-blue-800">Loading Doctors...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {doctors.map(doctor => (
                    <DoctorCard
                      key={doctor.id}
                      doctor={doctor}
                      mode="display"
                      showBookButton={false}
                      onCardClick={handleDoctorSelect}
                    />
                  ))}
                </div>
              )}
              
              {!doctors.length && !loading && (
                <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
                  <p className="text-gray-600">No doctors found. Please try again later.</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Step 2: View Mode Selection & Slots */}
          {selectedDoctor && (
            <>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4">
                  <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Step 2: Choose View & Select Time Slot
                  </h2>
                </div>
                
                <div className="p-6">
                  {/* View Mode Buttons */}
                  <div className="flex flex-wrap gap-3 mb-6">
                    <button
                      onClick={() => setViewMode('today')}
                      className={`px-6 py-3 rounded-lg font-medium transition-all ${
                        viewMode === 'today'
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Today
                    </button>
                    <button
                      onClick={() => {
                        setViewMode('week');
                        setCurrentWeekStart(new Date());
                      }}
                      className={`px-6 py-3 rounded-lg font-medium transition-all ${
                        viewMode === 'week'
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      This Week
                    </button>
                    <button
                      onClick={() => setViewMode('future')}
                      className={`px-6 py-3 rounded-lg font-medium transition-all ${
                        viewMode === 'future'
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Next 14 Days
                    </button>
                  </div>

                  {/* Week Navigation */}
                  {viewMode === 'week' && (
                    <div className="flex items-center justify-between mb-4">
                      <button
                        onClick={() => navigateWeek(-1)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Previous Week
                      </button>
                      <button
                        onClick={() => navigateWeek(1)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
                      >
                        Next Week
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Loading State */}
                  {loading ? (
                    <div className="flex flex-col items-center justify-center p-12 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
                      <p className="text-lg font-semibold text-blue-800">Fetching Available Slots...</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {datesToDisplay.map(dateInfo => {
                        const slots = slotsByDate[dateInfo.dateString] || [];
                        
                        return (
                          <div key={dateInfo.dateString} className="border border-gray-200 rounded-lg p-4">
                            {/* Date Header */}
                            <div className="flex items-center gap-3 mb-4 pb-3 border-b">
                              <Calendar className="w-5 h-5 text-blue-600" />
                              <div>
                                <h3 className="font-semibold text-gray-800">
                                  {dateInfo.dayName}, {dateInfo.dayMonth}
                                  {dateInfo.isToday && (
                                    <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                                      Today
                                    </span>
                                  )}
                                </h3>
                                <p className="text-sm text-gray-600">{dateInfo.dateString}</p>
                              </div>
                            </div>

                            {/* Slots */}
                            {slots.length > 0 ? (
                              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2">
                                {slots.map((slot, index) => (
                                  <button
                                    key={index}
                                    onClick={() => handleSlotSelection(slot, dateInfo.dateString)}
                                    disabled={loading || bookingInProgress}
                                    className="border-2 border-blue-300 bg-white hover:bg-blue-50 hover:border-blue-500 hover:shadow-md rounded-lg py-2 px-3 text-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    <div className="flex flex-col items-center gap-1">
                                      <Clock className="w-3 h-3 text-blue-600" />
                                      <span className="block text-blue-800 font-semibold text-xs">
                                        {formatTime(slot.startTime)}
                                      </span>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-6 text-gray-500">
                                <p className="text-sm">No available slots for this date</p>
                                <p className="text-xs mt-1">Doctor may be on leave or not working</p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Patient Selection Modal */}
        {showPatientModal && selectedSlot && selectedDoctor && (
          <PatientSelectionModal
            isOpen={showPatientModal}
            onClose={() => {
              setShowPatientModal(false);
              setSelectedSlot(null);
              setSelectedDate(null);
            }}
            onSelectPatient={handlePatientSelected}
            appointmentDetails={{
              doctorName: (() => {
                const derived = [selectedDoctor?.firstName, selectedDoctor?.lastName].filter(Boolean).join(' ').trim();
                const rawName = (selectedDoctor?.name || selectedDoctor?.fullName || selectedDoctor?.user?.name || derived || '').toString().trim();
                const safe = rawName || 'Doctor';
                return `Dr. ${safe}`;
              })(),
              date: new Date(selectedSlot.startTime).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }),
              time: formatTime(selectedSlot.startTime)
            }}
          />
        )}
      </div>
    </ReceptionistLayout>
  );
};

export default ReceptionistAppointments;
