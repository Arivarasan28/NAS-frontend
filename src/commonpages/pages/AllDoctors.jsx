
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import AuthService from '../../services/AuthService';
import DoctorCard from '../../components/DoctorCard';
import DoctorDetails from '../../components/DoctorDetails';

const AllDoctors = ({ setIsAuthPopupsOpen, setAuthPopupType }) => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [specialtyFilter, setSpecialtyFilter] = useState('');
  const [specialties, setSpecialties] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  // Modal state for doctor details popup
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsDoctor, setDetailsDoctor] = useState(null);

  // On component mount, fetch all doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const token = AuthService.getToken();
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const doFetch = async (opts = {}) =>
          axios.get('http://localhost:8081/api/doctor/', opts);

        let response;
        try {
          response = await doFetch({ headers });
        } catch (err) {
          // If unauthorized/forbidden, retry without auth for public access
          if (err?.response && (err.response.status === 401 || err.response.status === 403)) {
            response = await doFetch();
          } else {
            throw err;
          }
        }

        // Use API data directly so DoctorCard can apply its own name fallbacks
        setDoctors(response.data || []);

        // Extract unique specialties for filtering
        const uniqueSpecialties = [...new Set((response.data || []).map(d => d?.specialization).filter(Boolean))];
        setSpecialties(uniqueSpecialties);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        // Error is logged to console, page will show empty state
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Pick up specialization from query string and set initial filter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const spec = params.get('specialization') || '';
    if (spec !== specialtyFilter) {
      setSpecialtyFilter(spec);
    }
  }, [location.search]);


  // Unified action when clicking the card button
  const onCardAction = (doctor) => {
    const role = AuthService.getUserRole();
    const isLoggedIn = AuthService.isLoggedIn();
    
    if (isLoggedIn && role === 'PATIENT') {
      // Navigate to automatic booking page with pre-selected doctor
      navigate(`/book-appointment?doctorId=${doctor.id}`);
    } else {
      // Open login popup for non-logged in or non-patient users
      if (typeof setAuthPopupType === 'function') setAuthPopupType('login');
      if (typeof setIsAuthPopupsOpen === 'function') setIsAuthPopupsOpen(true);
    }
  };

  // Open details modal when clicking card (not the button)
  const onCardClick = (doctor) => {
    setDetailsDoctor(doctor);
    setDetailsOpen(true);
  };

  const closeDetails = () => {
    setDetailsOpen(false);
    setDetailsDoctor(null);
  };


  // Filter doctors based on specialty
  const filteredDoctors = doctors.filter(doctor => {
    return specialtyFilter === '' || doctor.specialization === specialtyFilter;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Our Doctors</h1>
      

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


      {/* Specialty Filter */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="w-full">
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
          <p className="mt-4 text-gray-600">No doctors found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map(doctor => (
            <DoctorCard
              key={doctor.id}
              doctor={doctor}
              mode="display"
              showBookButton={true}
              onBookAppointment={onCardAction}
              userRole={AuthService.getUserRole()}
              onCardClick={onCardClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AllDoctors;
