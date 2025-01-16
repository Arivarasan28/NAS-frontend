// // import React from 'react'

// // const AllDoctors = () => {
// //   return (
// //     <div>
      
// //     </div>
// //   )
// // }

// // export default AllDoctors

// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import doctor from '../assets/images/doctor.png'


// const doctorsData = [
//   { id: 1, name: 'Dr. Richard James', specialty: 'General Physician', status: 'Available' },
//   { id: 2, name: 'Dr. Richard James', specialty: 'General Physician', status: 'Available' },
//   { id: 3, name: 'Dr. Richard James', specialty: 'General Physician', status: 'Available' },
//   { id: 4, name: 'Dr. Richard James', specialty: 'General Physician', status: 'Available' },
//   { id: 5, name: 'Dr. Richard James', specialty: 'General Physician', status: 'Available' },
//   { id: 6, name: 'Dr. Richard James', specialty: 'General Physician', status: 'Available' },
//   { id: 7, name: 'Dr. Richard James', specialty: 'General Physician', status: 'Available' },
//   { id: 8, name: 'Dr. Richard James', specialty: 'General Physician', status: 'Available' },
//   { id: 9, name: 'Dr. Richard James', specialty: 'General Physician', status: 'Available' },
//   { id: 10, name: 'Dr. Richard James', specialty: 'General Physician', status: 'Available' },
//   { id: 11, name: 'Dr. Richard James', specialty: 'General Physician', status: 'Available' },
//   { id: 12, name: 'Dr. Richard James', specialty: 'General Physician', status: 'Available' },
// ];

// const AllDoctors = () => {
//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-sm font-bold mb-4 text-gray-600">Browse through the doctor specialists</h1>
//       <div className="flex flex-wrap mb-6">
//         <div className="flex flex-col space-y-2 w-full md:w-1/4 text-gray-500">
//           <button className="py-2 px-4 bg-gray-100 hover:bg-gray-300 rounded-md text-left">
//             General Physician
//           </button>
//           <button className="py-2 px-4 bg-gray-100 hover:bg-gray-300 rounded-md text-left">
//             Gynecologist
//           </button>
//           <button className="py-2 px-4 bg-gray-100 hover:bg-gray-300 rounded-md text-left">
//             Dermatologist
//           </button>
//           <button className="py-2 px-4 bg-gray-100 hover:bg-gray-300 rounded-md text-left">
//             Pediatrician
//           </button>
//           <button className="py-2 px-4 bg-gray-100 hover:bg-gray-300 rounded-md text-left">
//             Neurologist
//           </button>
//           <button className="py-2 px-4 bg-gray-100 hover:bg-gray-300 rounded-md text-left">
//             Gastroenterologist
//           </button>
//         </div>
//         <div className="flex-grow">
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//             {doctorsData.map((doctor) => (
//               <div
//                 key={doctor.id}
//                 className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center"
//               >
//                 <img
//                   src={doctor.image}
//                   alt={doctor.name}
//                   className="w-24 h-24 rounded-full mb-4"
//                 />
//                 <h3 className="text-lg font-bold">{doctor.name}</h3>
//                 <p className="text-gray-600">{doctor.specialty}</p>
//                 <p
//                   className={`mt-2 text-sm font-semibold ${
//                     doctor.status === 'Available' ? 'text-green-500' : 'text-red-500'
//                   }`}
//                 >
//                   {doctor.status}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AllDoctors;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import doctorImage from '../assets/images/doctor.png';

const doctorsData = [
  { id: 1, name: 'Dr. Richard James', specialty: 'General Physician', status: 'Available', image: doctorImage },
  { id: 2, name: 'Dr. Jane Doe', specialty: 'Cardiologist', status: 'Available', image: doctorImage },
  { id: 3, name: 'Dr. Mark Lee', specialty: 'Dermatologist', status: 'Available', image: doctorImage },
  { id: 4, name: 'Dr. Lucy Smith', specialty: 'Pediatrician', status: 'Available', image: doctorImage },
  { id: 5, name: 'Dr. John Brown', specialty: 'Neurologist', status: 'Available', image: doctorImage },
  { id: 6, name: 'Dr. Emma Green', specialty: 'Gastroenterologist', status: 'Available', image: doctorImage },
  { id: 7, name: 'Dr. William Davis', specialty: 'General Physician', status: 'Available', image: doctorImage },
  { id: 8, name: 'Dr. Sarah Wilson', specialty: 'Cardiologist', status: 'Available', image: doctorImage },
  { id: 9, name: 'Dr. Michael Clark', specialty: 'Dermatologist', status: 'Available', image: doctorImage },
  { id: 10, name: 'Dr. Emily Scott', specialty: 'Pediatrician', status: 'Available', image: doctorImage },
  { id: 11, name: 'Dr. Daniel Lewis', specialty: 'Neurologist', status: 'Available', image: doctorImage },
  { id: 12, name: 'Dr. Olivia Taylor', specialty: 'Gastroenterologist', status: 'Available', image: doctorImage },
];

const AllDoctors = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-sm font-bold mb-4 text-gray-600">Browse through the doctor specialists</h1>
      <div className="flex flex-wrap mb-6">
        <div className="flex flex-col space-y-2 w-full md:w-1/4 text-gray-500">
          <button className="py-2 px-4 bg-gray-100 hover:bg-gray-300 rounded-md text-left">
            General Physician
          </button>
          <button className="py-2 px-4 bg-gray-100 hover:bg-gray-300 rounded-md text-left">
            Gynecologist
          </button>
          <button className="py-2 px-4 bg-gray-100 hover:bg-gray-300 rounded-md text-left">
            Dermatologist
          </button>
          <button className="py-2 px-4 bg-gray-100 hover:bg-gray-300 rounded-md text-left">
            Pediatrician
          </button>
          <button className="py-2 px-4 bg-gray-100 hover:bg-gray-300 rounded-md text-left">
            Neurologist
          </button>
          <button className="py-2 px-4 bg-gray-100 hover:bg-gray-300 rounded-md text-left">
            Gastroenterologist
          </button>
        </div>
        <div className="flex-grow">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {doctorsData.map((doctor) => (
              <div
                key={doctor.id}
                className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center transform transition-transform duration-300 hover:scale-105"
              >
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-24 h-24 rounded-full mb-4"
                />
                <h3 className="text-lg font-bold">{doctor.name}</h3>
                <p className="text-gray-600">{doctor.specialty}</p>
                <p
                  className={`mt-2 text-sm font-semibold ${
                    doctor.status === 'Available' ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {doctor.status}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllDoctors;
