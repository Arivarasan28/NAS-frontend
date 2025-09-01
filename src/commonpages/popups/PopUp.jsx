// import React from 'react';
// import doctor from '../assets/images/doctor.png';

// const Home = ({ setIsAuthPopupsOpen, setAuthPopupType }) => {
//   const specialities = [
//     { name: 'General Physician', icon: '👨‍⚕️' },
//     { name: 'Cardiologist', icon: '❤️' },
//     { name: 'Dermatologist', icon: '🩺' },
//     { name: 'Pediatrician', icon: '👶' },
//     { name: 'Neurologist', icon: '🧠' },
//     { name: 'Gastroenterologist', icon: '🍴' },
//   ];

//   const doctors = new Array(9).fill({
//     name: 'Dr. Richard James',
//     specialty: 'General Physician',
//     image: doctor,
//   });

//   return (
//     <div className="bg-gray-100">
//       {/* Hero Section */}
//       <section className="bg-customBlue1 text-white text-center py-16 max-w-7xl mx-auto">
//         <h1 className="text-4xl font-bold">Book Appointment With Trusted Doctors</h1>
//         <p className="mt-4 text-lg">
//           Simple steps to find the right doctor with trusted reviews and schedule
//           your appointment in no time.
//         </p>
//         <button
//           className="mt-6 px-6 py-3 bg-white text-blue-500 font-semibold rounded-lg hover:bg-gray-200"
//           onClick={() => {
//             setAuthPopupType('signup'); // Set popup type to "signup"
//             setIsAuthPopupsOpen(true); // Open the popup
//           }}
//         >
//           Create Account
//         </button>
//       </section>

//       {/* Remaining sections unchanged */}
//     </div>
//   );
// };

// export default Home;
