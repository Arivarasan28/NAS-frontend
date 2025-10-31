import React, { useState, useEffect } from 'react';
import DoctorLayout from '../components/DoctorLayout';
import AppointmentService from '../../../services/AppointmentService';
import AuthService from '../../../services/AuthService';
import DoctorService from '../../../services/DoctorService';
import { FaCalendarPlus, FaTrash, FaMagic, FaClock, FaCalendarAlt } from 'react-icons/fa';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

const DoctorAppointmentSlotsEnhanced = () => {
  const [loading, setLoading] = useState(false);
  const [fetchingDoctor, setFetchingDoctor] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [existingSlots, setExistingSlots] = useState([]);
  const [doctorId, setDoctorId] = useState(null);
  const [doctorInfo, setDoctorInfo] = useState(null);
  const [showManualForm, setShowManualForm] = useState(false);
  
  // Manual slot creation state
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [slotDuration, setSlotDuration] = useState(30);

  // Function to fetch the doctor ID and info
  const fetchDoctorInfo = async () => {
    setFetchingDoctor(true);
    setError(null);
    try {
      const userId = AuthService.getUserId();
      if (!userId) {
        setError('User ID not available. Please ensure you are logged in.');
        return null;
      }
      
      const response = await DoctorService.getDoctorByUserId(userId);
      
      if (response.data.message && response.data.error) {
        setError(`Doctor profile not found: ${response.data.message}`);
        return null;
      }
      
      const fetchedDoctorId = response.data.id;
      if (!fetchedDoctorId) {
        setError('Invalid doctor profile data received. Please contact an administrator.');
        return null;
      }
      
      setDoctorId(fetchedDoctorId);
      setDoctorInfo(response.data);
      return fetchedDoctorId;
    } catch (err) {
      console.error('Error fetching doctor profile:', err);
      setError('Could not find a doctor profile for your user account. Please contact an administrator.');
      return null;
    } finally {
      setFetchingDoctor(false);
    }
  };

  useEffect(() => {
    fetchDoctorInfo().then(id => {
      if (id) {
        fetchExistingSlots(id);
      }
    });
  }, []);
  
  useEffect(() => {
    if (doctorId) {
      fetchExistingSlots(doctorId);
    }
  }, [selectedDate, doctorId]);

  const fetchExistingSlots = async (docId = null) => {
    setLoading(true);
    try {
      const currentDoctorId = docId || doctorId;
      
      if (!currentDoctorId) {
        setError('Doctor ID not available. Please ensure your account is linked to a doctor profile.');
        setLoading(false);
        return;
      }
      
      const response = await AppointmentService.getAllAppointmentsByDoctorAndDate(currentDoctorId, selectedDate);
      setExistingSlots(response.data || []);
      setError(null);
    } catch (err) {
      if (err.response?.status === 404) {
        setExistingSlots([]);
      } else {
        setError('Failed to fetch appointments: ' + (err.response?.data?.message || err.message));
        console.error('Error fetching appointments:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  // Auto-generate slots based on working hours
  const handleAutoGenerateSlots = async () => {
    if (!doctorId) {
      setError('Doctor ID not available. Please ensure your account is linked to a doctor profile.');
      return;
    }

    if (!window.confirm('This will automatically create appointment slots based on your working hours for the selected date. Continue?')) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await AppointmentService.autoGenerateSlots(doctorId, selectedDate);
      
      setSuccess(response.data.message || `Successfully created appointment slots`);
      
      // Refresh the existing slots
      await fetchExistingSlots();
    } catch (err) {
      console.error('Error auto-generating slots:', err);
      if (err.response?.data?.message) {
        setError(`Failed to auto-generate slots: ${err.response.data.message}`);
      } else {
        setError(`Failed to auto-generate slots: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Manual slot creation
  const handleManualCreateSlots = async () => {
    if (!doctorId) {
      setError('Doctor ID not available. Please ensure your account is linked to a doctor profile.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const startDateTime = new Date(`${selectedDate}T${startTime}`);
      const endDateTime = new Date(`${selectedDate}T${endTime}`);

      const slotData = {
        doctorId: doctorId,
        date: selectedDate,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        durationMinutes: slotDuration
      };

      const response = await AppointmentService.createAppointmentSlots(slotData);
      
      setSuccess(`Successfully created ${response.data.length} appointment slots`);
      setShowManualForm(false);
      
      // Refresh the existing slots
      await fetchExistingSlots();
    } catch (err) {
      console.error('Error creating slots:', err);
      if (err.response?.data?.message) {
        setError(`Failed to create slots: ${err.response.data.message}`);
      } else {
        setError(`Failed to create slots: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (isoString) => {
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const handleDeleteSlot = async (slotId) => {
    if (!window.confirm('Are you sure you want to delete this available slot?')) {
      return;
    }
    
    setLoading(true);
    try {
      if (!doctorId) {
        setError('Doctor ID not available. Please ensure you are logged in as a doctor.');
        setLoading(false);
        return;
      }
      
      await AppointmentService.deleteAvailableSlot(slotId, doctorId);
      setSuccess('Appointment slot deleted successfully');
      
      await fetchExistingSlots();
    } catch (err) {
      setError('Failed to delete slot: ' + (err.response?.data?.message || err.message));
      console.error('Error deleting slot:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DoctorLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Manage Appointment Slots</h1>
          <p className="text-gray-600">Automatically generate slots based on your working hours or create custom slots</p>
        </div>
        
        {fetchingDoctor && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-lg" role="alert">
            <p className="flex items-center text-blue-700">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading doctor profile...
            </p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg flex items-start gap-3" role="alert">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-red-700">{error}</p>
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-lg flex items-start gap-3" role="alert">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <p className="text-green-700">{success}</p>
          </div>
        )}
        
        {/* Doctor Info Card */}
        {doctorInfo && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">Appointment Duration Setting</p>
                <p>Your appointments are set to <span className="font-bold">{doctorInfo.appointmentDurationMinutes || 30} minutes</span> per slot. This is used for auto-generating slots based on your working hours.</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Date Selection */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FaCalendarAlt className="text-blue-600" />
            <h2 className="text-xl font-semibold">Select Date</h2>
          </div>
          
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full md:w-auto border border-gray-300 rounded-md shadow-sm p-3 text-lg"
          />
        </div>
        
        {/* Action Buttons */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Create Appointment Slots</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Auto-generate button */}
            <button
              type="button"
              onClick={handleAutoGenerateSlots}
              disabled={loading}
              className="flex items-center justify-center gap-3 px-6 py-4 rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <FaMagic className="text-xl" />
              <div className="text-left">
                <p className="font-semibold">Auto-Generate Slots</p>
                <p className="text-xs opacity-90">Based on working hours & leaves</p>
              </div>
            </button>
            
            {/* Manual creation button */}
            <button
              type="button"
              onClick={() => setShowManualForm(!showManualForm)}
              className="flex items-center justify-center gap-3 px-6 py-4 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <FaClock className="text-xl" />
              <div className="text-left">
                <p className="font-semibold">Manual Slot Creation</p>
                <p className="text-xs opacity-75">Custom time range</p>
              </div>
            </button>
          </div>
        </div>
        
        {/* Manual Slot Creation Form */}
        {showManualForm && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6 border-2 border-blue-200">
            <h3 className="text-lg font-semibold mb-4">Manual Slot Creation</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Time
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slot Duration (minutes)
                </label>
                <select
                  value={slotDuration}
                  onChange={(e) => setSlotDuration(parseInt(e.target.value))}
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2"
                >
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>60 minutes</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleManualCreateSlots}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2 rounded-lg text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaCalendarPlus /> Create Slots
              </button>
              <button
                type="button"
                onClick={() => setShowManualForm(false)}
                className="px-6 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        
        {/* Existing Appointments */}
        {existingSlots.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Appointments for {selectedDate}</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-200 text-gray-700">
                    <th className="py-3 px-4 text-left">Time</th>
                    <th className="py-3 px-4 text-left">Patient</th>
                    <th className="py-3 px-4 text-left">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {existingSlots.map((slot) => (
                    <tr key={slot.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">
                        {formatTime(slot.appointmentTime)}
                      </td>
                      <td className="py-3 px-4">
                        {slot.patientName || <span className="text-gray-400 italic">No patient yet</span>}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            slot.status === 'BOOKED'
                              ? 'bg-yellow-100 text-yellow-800'
                              : slot.status === 'CONFIRMED'
                              ? 'bg-green-100 text-green-800'
                              : slot.status === 'CANCELLED'
                              ? 'bg-red-100 text-red-800'
                              : slot.status === 'AVAILABLE'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {slot.status || 'AVAILABLE'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {slot.status === 'AVAILABLE' && (
                          <button
                            onClick={() => handleDeleteSlot(slot.id)}
                            className="text-red-500 hover:text-red-700 p-2 rounded hover:bg-red-50"
                            title="Delete available slot"
                          >
                            <FaTrash />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {existingSlots.length === 0 && !loading && (
          <div className="bg-white p-12 rounded-lg shadow-md text-center">
            <FaCalendarAlt className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No appointments scheduled for this date</p>
            <p className="text-gray-500 mt-2">Use the buttons above to create appointment slots</p>
          </div>
        )}
      </div>
    </DoctorLayout>
  );
};

export default DoctorAppointmentSlotsEnhanced;
