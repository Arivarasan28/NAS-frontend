import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import AuthService from '../services/AuthService';

const AppointmentFlowModal = ({ isOpen, onClose, doctor }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Dates for next 14 days
  const nextTwoWeeks = useMemo(() => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      dates.push({
        dateString: d.toISOString().split('T')[0],
        display: d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' }),
      });
    }
    return dates;
  }, []);

  useEffect(() => {
    if (!isOpen) {
      // reset state when closing
      setSelectedDate('');
      setSlots([]);
      setLoading(false);
      setSuccessMessage('');
      setErrorMessage('');
    }
  }, [isOpen]);

  // Fetch slots
  const fetchAvailableSlots = async (dateString) => {
    if (!doctor?.id || !dateString) return;
    try {
      setLoading(true);
      setErrorMessage('');
      setSlots([]);

      // Try a configurable ALL-SLOTS endpoint first (if provided), otherwise fall back to AVAILABLE only
      const tokenHeader = { headers: { Authorization: `Bearer ${AuthService.getToken()}` } };
      let data = [];

      const template = import.meta?.env?.VITE_ALL_SLOTS_BY_DOCTOR_DATE; // e.g. http://localhost:8081/api/appointments/slots/doctor/{doctorId}/date/{date}
      if (template) {
        try {
          const url = template
            .replace('{doctorId}', doctor.id)
            .replace('{date}', dateString);
          const allResp = await axios.get(url, tokenHeader);
          if (allResp?.data) {
            data = allResp.data;
          }
        } catch (e) {
          // ignore and fall back to available-only
        }
      }

      if (!data || data.length === 0) {
        const availResp = await axios.get(
          `http://localhost:8081/api/appointments/slots/available/doctor/${doctor.id}/date/${dateString}`,
          tokenHeader
        );
        data = (availResp.data || []).map(s => ({ ...s, status: s.status || 'AVAILABLE' }));
      }

      const normalized = (data || []).map(s => ({
        ...s,
        status: s.status || 'AVAILABLE',
      }));
      const sorted = normalized.sort((a, b) => new Date(a.appointmentTime) - new Date(b.appointmentTime));
      setSlots(sorted);
    } catch (err) {
      console.error('Error loading slots:', err);
      setErrorMessage('Failed to load available slots. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Badge classes by status
  const statusBadge = (status) => {
    const map = {
      AVAILABLE: 'bg-green-100 text-green-800 border-green-200',
      BOOKED: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      CONFIRMED: 'bg-blue-100 text-blue-800 border-blue-200',
      CANCELLED: 'bg-red-100 text-red-800 border-red-200',
    };
    return map[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // Select date handler
  const handleDateSelect = (dateString) => {
    setSelectedDate(dateString);
    fetchAvailableSlots(dateString);
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

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

      // Get patient id by user id
      const patientResp = await axios.get(`http://localhost:8081/api/patients/user/${userId}` , {
        headers: { Authorization: `Bearer ${AuthService.getToken()}` }
      });
      const patientId = patientResp.data.id;

      await axios.post(
        `http://localhost:8081/api/appointments/book/${appointmentId}/patient/${patientId}`,
        {},
        { headers: { Authorization: `Bearer ${AuthService.getToken()}` } }
      );

      setSuccessMessage('Appointment booked successfully!');
      // Remove the booked slot from available slots
      setSlots(prev => prev.map(s => (s.id === appointmentId ? { ...s, status: 'BOOKED' } : s)));
    } catch (err) {
      console.error('Booking error:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setErrorMessage(`Failed to book appointment: ${err.response.data.message}`);
      } else {
        setErrorMessage('Failed to book appointment. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !doctor) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative bg-white w-full max-w-3xl mx-4 rounded-lg shadow-xl overflow-hidden">
        <div className="flex justify-between items-center px-4 py-3 border-b">
          <h3 className="text-lg font-semibold">Book Appointment - Dr. {doctor.firstName || ''} {doctor.lastName || ''}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <div className="p-6 space-y-6">
          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {errorMessage}
            </div>
          )}

          {/* 1. Select a Date */}
          <div>
            <h4 className="text-md font-semibold text-gray-800 mb-3">1. Select a Date</h4>
            <div className="flex flex-nowrap overflow-x-auto pb-2 gap-2">
              {nextTwoWeeks.map(date => (
                <button
                  key={date.dateString}
                  onClick={() => handleDateSelect(date.dateString)}
                  className={`flex-shrink-0 border rounded-lg py-2 px-3 text-sm transition ${
                    selectedDate === date.dateString ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  {date.display}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Select a Time Slot */}
          <div>
            <h4 className="text-md font-semibold text-gray-800 mb-3">2. Select a Time Slot</h4>

            {loading ? (
              <div className="flex justify-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : selectedDate && slots.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {slots.map(slot => {
                  const isAvailable = (slot.status || 'AVAILABLE') === 'AVAILABLE';
                  return (
                    <div key={slot.id} className="border rounded-lg p-3 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-blue-800 font-medium">{formatTime(slot.appointmentTime)}</span>
                        <span className={`text-xs border px-2 py-0.5 rounded ${statusBadge(slot.status)}`}>
                          {slot.status || 'AVAILABLE'}
                        </span>
                      </div>
                      <button
                        onClick={() => bookAppointment(slot.id)}
                        className={`w-full rounded-md py-2 text-sm transition ${
                          isAvailable
                            ? 'bg-blue-500 hover:bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        }`}
                        disabled={loading || !isAvailable}
                        title={isAvailable ? 'Book this slot' : 'Not available'}
                      >
                        {isAvailable ? 'Book' : 'Unavailable'}
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : selectedDate ? (
              <div className="text-center p-6 border border-gray-200 rounded">
                <p className="text-gray-600">No available slots for this date. Please choose another date.</p>
              </div>
            ) : (
              <div className="text-center p-6 border border-gray-200 rounded">
                <p className="text-gray-600">Please select a date to view available slots.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentFlowModal;
