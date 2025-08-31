import React, { useState, useEffect } from 'react';
import DoctorLayout from '../components/DoctorLayout';
import AppointmentService from '../../../services/AppointmentService';
import AuthService from '../../../services/AuthService';
import DoctorService from '../../../services/DoctorService';
import { FaCalendarPlus, FaTrash } from 'react-icons/fa';

const DoctorAppointmentSlots = () => {
  const [loading, setLoading] = useState(false);
  const [fetchingDoctor, setFetchingDoctor] = useState(false);
  const [creatingSlots, setCreatingSlots] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [slotDuration, setSlotDuration] = useState(30);
  const [existingSlots, setExistingSlots] = useState([]);
  const [previewSlots, setPreviewSlots] = useState([]);
  const [doctorId, setDoctorId] = useState(null);

  // Function to fetch the doctor ID associated with the logged-in user ID
  const fetchDoctorId = async () => {
    setFetchingDoctor(true);
    setError(null);
    try {
      const userId = AuthService.getUserId();
      if (!userId) {
        setError('User ID not available. Please ensure you are logged in.');
        return null;
      }
      
      console.log('Fetching doctor profile for user ID:', userId);
      const response = await DoctorService.getDoctorByUserId(userId);
      
      // Check if the response contains an error message
      if (response.data.message && response.data.error) {
        setError(`Doctor profile not found: ${response.data.message}`);
        return null;
      }
      
      const fetchedDoctorId = response.data.id;
      if (!fetchedDoctorId) {
        setError('Invalid doctor profile data received. Please contact an administrator.');
        return null;
      }
      
      console.log('Found doctor ID:', fetchedDoctorId, 'for user ID:', userId);
      setDoctorId(fetchedDoctorId);
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
    // Fetch doctor ID when component mounts
    fetchDoctorId().then(id => {
      if (id) {
        fetchExistingSlots(id);
      }
    });
  }, []);
  
  useEffect(() => {
    // Fetch slots when date changes, but only if we have a doctor ID
    if (doctorId) {
      fetchExistingSlots(doctorId);
    }
  }, [selectedDate, doctorId]);

  useEffect(() => {
    // Generate preview slots when inputs change
    generatePreviewSlots();
  }, [selectedDate, startTime, endTime, slotDuration]);

  const fetchExistingSlots = async (docId = null) => {
    setLoading(true);
    try {
      // Use the provided doctor ID or the one from state
      const currentDoctorId = docId || doctorId;
      
      if (!currentDoctorId) {
        setError('Doctor ID not available. Please ensure your account is linked to a doctor profile.');
        setLoading(false);
        return;
      }
      
      console.log('Fetching appointments for doctor ID:', currentDoctorId, 'date:', selectedDate);
      
      // Fetch ALL appointments for the doctor on the selected date, not just available ones
      const response = await AppointmentService.getAllAppointmentsByDoctorAndDate(currentDoctorId, selectedDate);
      
      console.log('Fetched appointments:', response.data);
      setExistingSlots(response.data || []);
      setError(null);
    } catch (err) {
      if (err.response?.status === 404) {
        // If no appointments are found, just set empty array instead of showing error
        console.log('No appointments found for the selected date');
        setExistingSlots([]);
      } else {
        setError('Failed to fetch appointments: ' + (err.response?.data?.message || err.message));
        console.error('Error fetching appointments:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  const generatePreviewSlots = () => {
    if (!selectedDate || !startTime || !endTime || !slotDuration) {
      setPreviewSlots([]);
      return;
    }

    const slots = [];
    const startDateTime = new Date(`${selectedDate}T${startTime}`);
    const endDateTime = new Date(`${selectedDate}T${endTime}`);
    
    let currentSlot = new Date(startDateTime);
    
    while (currentSlot < endDateTime) {
      const slotEndTime = new Date(currentSlot.getTime() + slotDuration * 60000);
      
      // Check if this slot would exceed the end time
      if (slotEndTime > endDateTime) {
        break;
      }
      
      slots.push({
        startTime: currentSlot.toISOString(),
        endTime: slotEndTime.toISOString()
      });
      
      // Move to next slot
      currentSlot = slotEndTime;
    }
    
    setPreviewSlots(slots);
  };

  const handleCreateSlots = async () => {
    if (!doctorId) {
      setError('Doctor ID not available. Please ensure your account is linked to a doctor profile.');
      return;
    }

    setCreatingSlots(true);
    setError(null);
    setSuccess(null);

    try {
      // Convert date and times to ISO format
      const startDateTime = new Date(`${selectedDate}T${startTime}`);
      const endDateTime = new Date(`${selectedDate}T${endTime}`);

      const slotData = {
        doctorId: doctorId,
        date: selectedDate,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        durationMinutes: slotDuration
      };

      console.log('Creating slots with data:', slotData);
      const response = await AppointmentService.createAppointmentSlots(slotData);
      
      console.log('Created slots:', response.data);
      setSuccess(`Successfully created ${response.data.length} appointment slots`);
      
      // Refresh the existing slots
      fetchExistingSlots();
      
      // Clear the preview
      setPreviewSlots([]);
    } catch (err) {
      console.error('Error creating slots:', err);
      if (err.response?.status === 404) {
        setError('Doctor profile not found. Please contact an administrator.');
      } else if (err.response?.status === 400) {
        setError(`Invalid input: ${err.response.data.message || 'Please check your date and time values'}`);
      } else if (err.response?.data?.message) {
        setError(`Failed to create slots: ${err.response.data.message}`);
      } else {
        setError(`Failed to create slots: ${err.message}`);
      }
    } finally {
      setCreatingSlots(false);
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
      const doctorId = AuthService.getUserId(); // For doctors, userId is the doctorId
      if (!doctorId) {
        setError('Doctor ID not available. Please ensure you are logged in as a doctor.');
        setLoading(false);
        return;
      }
      
      await AppointmentService.deleteAvailableSlot(slotId, doctorId);
      setSuccess('Appointment slot deleted successfully');
      
      // Refresh the existing slots
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
        <h1 className="text-2xl font-bold mb-6">Manage Appointment Slots</h1>
        
        {fetchingDoctor && (
          <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-6" role="alert">
            <p className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading doctor profile...
            </p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
            <p>{error}</p>
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6" role="alert">
            <p>{success}</p>
          </div>
        )}
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Create New Appointment Slots</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
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
            
            <div className="flex items-end">
              <button
                type="button"
                onClick={handleCreateSlots}
                disabled={loading || creatingSlots || previewSlots.length === 0}
                className={`flex items-center gap-2 px-4 py-2 rounded text-white ${
                  loading || creatingSlots || previewSlots.length === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-500 hover:bg-green-600'
                }`}
              >
                {creatingSlots ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  <>
                    <FaCalendarPlus /> Create {previewSlots.length} Slots
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
        
        {previewSlots.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Preview Slots</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {previewSlots.map((slot, index) => (
                <div
                  key={index}
                  className="border border-blue-200 bg-blue-50 rounded p-2 text-center"
                >
                  {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {existingSlots.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Existing Appointments for {selectedDate}</h2>
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
                      <td className="py-3 px-4">
                        {new Date(slot.appointmentTime).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="py-3 px-4">
                        {slot.patientName || 'No patient yet'}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
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
                            className="text-red-500 hover:text-red-700"
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
      </div>
    </DoctorLayout>
  );
};

export default DoctorAppointmentSlots;
