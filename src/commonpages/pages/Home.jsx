import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import doctor from "../../assets/images/doctor.png";
import AuthService from '../../services/AuthService';
import SpecializationService from '../../services/SpecializationService';
import DoctorService from '../../services/DoctorService';

const Home = ({ setIsAuthPopupsOpen, setAuthPopupType }) => {
  
  const navigate = useNavigate();
  const [specialities, setSpecialities] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState({ specs: false, docs: false });

  const handleBookAppointmentClick = () => {
    const isLoggedIn = AuthService.isLoggedIn();
    const role = AuthService.getUserRole();
    if (isLoggedIn && role === 'PATIENT') {
      navigate('/book-appointment');
    } else {
      setAuthPopupType('login');
      setIsAuthPopupsOpen(true);
    }
  };

  const handleBookNow = (doc) => {
    const isLoggedIn = AuthService.isLoggedIn();
    const role = AuthService.getUserRole();
    if (isLoggedIn && role === 'PATIENT') {
      const target = doc?.id ? `/book-appointment?doctorId=${doc.id}` : '/book-appointment';
      navigate(target);
    } else {
      setAuthPopupType('login');
      setIsAuthPopupsOpen(true);
    }
  };

  useEffect(() => {
    const loadSpecializations = async () => {
      try {
        setLoading(prev => ({ ...prev, specs: true }));
        const res = await SpecializationService.getAll();
        // Expecting array of { id, name, description }
        setSpecialities((res.data || []).map(s => ({ name: s.name })));
      } catch (e) {
        console.error('Failed to load specializations', e);
      } finally {
        setLoading(prev => ({ ...prev, specs: false }));
      }
    };

    const loadDoctors = async () => {
      try {
        setLoading(prev => ({ ...prev, docs: true }));
        // Attempt with auth header, but endpoint is public; safe to call directly
        const res = await DoctorService.getAllDoctors();
        setDoctors(res.data || []);
      } catch (e) {
        console.error('Failed to load doctors', e);
        setDoctors([]);
      } finally {
        setLoading(prev => ({ ...prev, docs: false }));
      }
    };

    loadSpecializations();
    loadDoctors();
  }, []);

  const handleSpecialityClick = (name) => {
    if (!name) return;
    navigate(`/doctors?specialization=${encodeURIComponent(name)}`);
  };

  return (
    <div className="bg-gray-100 py-8">
      {/* Hero Section */}
      <section className="bg-customBlue1 text-white text-center py-16 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold">Book Appointment With Trusted Doctors</h1>
        <p className="mt-4 text-lg">
          Simple steps to find the right doctor with trusted reviews and schedule
          your appointment in no time.
        </p>
        <button onClick={handleBookAppointmentClick} className="mt-6 px-6 py-3 bg-white text-blue-500 font-semibold rounded-lg hover:bg-gray-200">
          Book Appointment
        </button>
      </section>

      {/* Specialities Section */}
      <section className="py-12">
        <h2 className="text-center text-2xl font-bold mb-8">Find by Speciality</h2>
        {loading.specs ? (
          <div className="text-center text-gray-600">Loading specialities...</div>
        ) : (
          <div className="flex flex-wrap justify-center gap-4 px-4">
            {specialities.slice(0, 10).map((speciality, index) => (
              <button
                key={index}
                onClick={() => handleSpecialityClick(speciality.name)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full shadow-sm hover:shadow transition"
                title={`Find ${speciality.name}`}
              >
                <span className="text-sm font-medium">{speciality.name}</span>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Top Doctors Section */}
      <section className="py-12 px-40">
        <h2 className="text-center text-2xl font-bold mb-8">Top Doctors to Book</h2>
        {loading.docs ? (
          <div className="text-center text-gray-600">Loading top doctors...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {doctors.slice(0, 8).map((doc, index) => (
              <div
                key={doc.id ?? index}
                className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center transform transition-transform duration-300 hover:scale-105"
              >
                <img
                  src={doctor}
                  alt={doc.name || 'Doctor'}
                  className="w-24 h-24 rounded-full mb-4 object-cover"
                />
                <h3 className="text-lg font-semibold">{doc.name || 'Doctor'}</h3>
                <p className="text-gray-600">{doc.specialization || (doc.specializations && doc.specializations[0]) || 'General'}</p>
                <button onClick={() => handleBookNow(doc)} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                  Book Now
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="flex justify-center mt-8">
          <button 
            onClick={() => navigate('/doctors')}
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
            More
          </button>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="bg-customBlue1 text-white text-center py-16 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold">Book Appointment With 100+ Trusted Doctors</h2>
        <button 
          onClick={() => {
            setAuthPopupType('signup'); // Set popup type to "signup"
            setIsAuthPopupsOpen(true); // Open the popup
          }}
          className="mt-6 px-6 py-3 bg-white text-blue-500 font-semibold rounded-lg hover:bg-gray-200"
        >
          Create Account
        </button>
      </section>
    </div>
  );
};

export default Home;

