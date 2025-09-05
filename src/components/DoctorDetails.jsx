import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaUserMd, FaMapMarkerAlt, FaEnvelope, FaPhone } from 'react-icons/fa';
import DoctorService from '../services/DoctorService';
// AuthService not needed here after removing booking/slots

const DoctorDetails = ({ doctorId: propDoctorId }) => {
  const { doctorId: routeDoctorId } = useParams();
  const doctorId = propDoctorId || routeDoctorId;
  
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDoctorDetails();
  }, [doctorId]);

  // Slots UI removed: details-only page

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

  // Slots UI/helpers removed; can be reintroduced when backend endpoints exist

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
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="p-6">
              <div className="flex items-center mb-6">
                <div className="w-32 h-32 rounded-full overflow-hidden mr-6 bg-gray-100">
                  <img 
                    src={'/default-profile.png'}
                    alt={`Dr. ${doctor.name || ''}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/default-profile.png';
                    }}
                  />
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-2">Dr. {doctor.name || ''}</h1>
                  <p className="text-xl text-blue-600 mb-1">
                    {(doctor.specializations && doctor.specializations.length > 0)
                      ? doctor.specializations.join(', ')
                      : (doctor.specialization || 'General')}
                  </p>
                  <p className="text-gray-600">Consultation Fee: {doctor.fee != null ? `₹${doctor.fee}` : 'Not specified'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                  <div className="space-y-3 text-gray-600">
                    <div className="flex items-center">
                      <FaMapMarkerAlt className="mr-2" />
                      <span>{'Address not provided'}</span>
                    </div>
                    <div className="flex items-center">
                      <FaEnvelope className="mr-2" />
                      <span>{doctor.email || 'Email not provided'}</span>
                    </div>
                    <div className="flex items-center">
                      <FaPhone className="mr-2" />
                      <span>{doctor.phone || 'Phone not provided'}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold mb-4">Professional Details</h2>
                  <div className="space-y-3 text-gray-600">
                    <div><strong>Specialization:</strong> {(doctor.specializations && doctor.specializations.length > 0) ? doctor.specializations.join(', ') : (doctor.specialization || 'Not specified')}</div>
                    {/* Add more fields when available in backend DTO */}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Appointment slots UI removed; re-enable when endpoints exist */}
        </>
      ) : null}
    </div>
  );
};

export default DoctorDetails;
