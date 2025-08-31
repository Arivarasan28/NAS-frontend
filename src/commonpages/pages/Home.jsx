import React from 'react';
import { useNavigate } from 'react-router-dom';
import doctor from "../../assets/images/doctor.png";
import AuthService from '../../services/AuthService';

const Home = ({ setIsAuthPopupsOpen, setAuthPopupType }) => {
  
  const navigate = useNavigate();

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

  const specialities = [
    { name: 'General Physician', icon: '👨‍⚕️' },
    { name: 'Cardiologist', icon: '❤️' },
    { name: 'Dermatologist', icon: '🩺' },
    { name: 'Pediatrician', icon: '👶' },
    { name: 'Neurologist', icon: '🧠' },
    { name: 'Gastroenterologist', icon: '🍴' },
  ];

  const doctors = new Array(9).fill({
    name: 'Dr. Richard James',
    specialty: 'General Physician',
    image: doctor,
  });

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
        <div className="flex justify-center gap-8">
          {specialities.map((speciality, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="text-4xl">{speciality.icon}</div>
              <p className="mt-2 text-sm font-semibold">{speciality.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Top Doctors Section */}
      <section className="py-12 px-40">
        <h2 className="text-center text-2xl font-bold mb-8">Top Doctors to Book</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {doctors.map((doctor, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center transform transition-transform duration-300 hover:scale-105"
            >
              <img
                src={doctor.image}
                alt={doctor.name}
                className="w-24 h-24 rounded-full mb-4"
              />
              <h3 className="text-lg font-semibold">{doctor.name}</h3>
              <p className="text-gray-600">{doctor.specialty}</p>
              <button onClick={handleBookAppointmentClick} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                Book Now
              </button>
            </div>
          ))}
        </div>
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

