// // // import React from 'react';
// // // import { BrowserRouter, Routes, Route } from 'react-router-dom';
// // // import NavBar from './components/NavBar'; // Import the NavBar component
// // // import Home from './pages/Home';
// // // import About from './pages/About';
// // // import Contact from './pages/Contact';
// // // import AllDoctors from './pages/AllDoctors';
// // // import Footer from './components/Footer';
// // // // import CreateAccount from './popups/CreateAccount';
// // // // import AuthPopups from './popups/AuthPopups';
// // // import Login from './popups/Login';


// // // const App = () => {
// // //   const [isLoginOpen, setIsLoginOpen] = useState(false); // State to control modal visibility

// // //   return (
// // //     <BrowserRouter>
// // //       <NavBar /> {/* Use the NavBar here */}
// // //       <Routes>
// // //         <Route path="/" element={<Home />} />
// // //         <Route path="/about" element={<About />} />
// // //         <Route path="/alldoctors" element={<AllDoctors />} />
// // //         <Route path="/contact" element={<Contact />} />
// // //         {/* <Route path="/createaccount" element={<CreateAccount />} /> */}
// // //         {/* <Route path="/createaccount" element={<AuthPopups />} />
// // //         <Route path="/authpopups" element={<AuthPopups />} /> */}
// // //         <Route path="/login" element={<Login isOpen={isLoginOpen} setIsOpen={setIsLoginOpen} />} /> {/* Pass the state to Login */}
// // //         </Routes>
// // //       <Footer />

// // //     </BrowserRouter>
// // //   );
// // // }

// // // export default App;

// // import React, { useState } from 'react';
// // import { BrowserRouter, Routes, Route } from 'react-router-dom';
// // import NavBar from './components/NavBar'; // Import the NavBar component
// // import Home from './pages/Home';
// // import About from './pages/About';
// // import Contact from './pages/Contact';
// // import AllDoctors from './pages/AllDoctors';
// // import Footer from './components/Footer';
// // import Login from './popups/Login';
// // import CreateAccount from './popups/CreateAccount';
// // import AuthPopups from './popups/AuthPopups';

// // const App = () => {
// //   const [isLoginOpen, setIsLoginOpen] = useState(false); // State to control modal visibility
// //   const [isCreacteAccountOpen, setIsCreateAccountOpen] = useState(false);

// //   return (
// //     <BrowserRouter>
// //       <NavBar setIsLoginOpen={setIsLoginOpen} /> {/* Pass the function down to NavBar */}
// //       <Routes>
// //         <Route path="/" element={<Home />} />
// //         <Route path="/about" element={<About />} />
// //         <Route path="/alldoctors" element={<AllDoctors />} />
// //         <Route path="/contact" element={<Contact />} />
// //         <Route path="/authpopups" element={<AuthPopups isOpen={isOpen} setIsOpen={setIsLoginOpen} />} /> {/* Pass the state to Login */}
// //         {/* <Route path="createaccount" element={<CreateAccount isOpen={isCreacteAccountOpen} setIsCreateAccountOpen={setIsCreateAccountOpen}/> } /> */}
// //       </Routes>
// //       <Footer />
// //     </BrowserRouter>
// //   );
// // }

// // export default App;


// import React, { useState } from 'react';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import NavBar from './components/NavBar';
// import Home from './pages/Home';
// import About from './pages/About';
// import Contact from './pages/Contact';
// import AllDoctors from './pages/AllDoctors';
// import Footer from './components/Footer';
// import AuthPopups from './popups/AuthPopups';

// const App = () => {
//   const [isAuthPopupsOpen, setIsAuthPopupsOpen] = useState(false);

//   return (
//     <BrowserRouter>
//       <NavBar setIsAuthPopupsOpen={setIsAuthPopupsOpen} />
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/about" element={<About />} />
//         <Route path="/alldoctors" element={<AllDoctors />} />
//         <Route path="/contact" element={<Contact />} />
//       </Routes>
//       <AuthPopups isOpen={isAuthPopupsOpen} setIsAuthPopupsOpen={setIsAuthPopupsOpen} />
//       <Footer />
//     </BrowserRouter>
//   );
// };

// export default App;

import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './commonpages/components/NavBar';
import Home from './commonpages/pages/Home';
import About from './commonpages/pages/About';
import Contact from './commonpages/pages/Contact';
import AllDoctors from './clinic/pages/AllDoctors';
import DoctorDetails from './clinic/pages/DoctorDetails';
import Footer from './commonpages/components/Footer';
import AuthPopups from './commonpages/popups/AuthPopups';
import AdminDashboard from './clinic/adminpages/pages/AdminDashboard';
import AdminAppointments from './clinic/adminpages/pages/AdminAppointments';
import AdminDoctors from './clinic/adminpages/pages/AdminDoctors';
import AdminPatients from './clinic/adminpages/pages/AdminPatients';
import RegisterUser from './clinic/adminpages/pages/RegisterUser';
import DoctorDashboard from './clinic/doctorpages/pages/DoctorDashboard';
import DoctorAppointments from './clinic/doctorpages/pages/DoctorAppointments';
import DoctorAppointmentSlots from './clinic/doctorpages/pages/DoctorAppointmentSlots';
import DoctorProfile from './clinic/doctorpages/pages/DoctorProfile';
import AdminProtectedRoutes from './utils/AdminProtectedRoutes';
import ReceptionistDashboard from './clinic/receptionistpages/pages/ReceptionistDashboard';
import PatientProfile from './clinic/patientpages/pages/PatientProfile';
import PatientDashboard from './clinic/patientpages/pages/PatientDashboard';
import BookAppointment from './clinic/patientpages/pages/BookAppointment';
import AllAppointments from './clinic/patientpages/pages/AllAppointments';
import PatientLayout from './clinic/patientpages/components/PatientLayout';
import ProtectedRoutes from './utils/ProtectedRoutes';

const App = () => {
  const [isAuthPopupsOpen, setIsAuthPopupsOpen] = useState(false);
  const [authPopupType, setAuthPopupType] = useState('login'); // 'login' or 'signup'

  return (
    <BrowserRouter>
      <NavBar setIsAuthPopupsOpen={setIsAuthPopupsOpen} />
      <Routes>
        <Route 
          path="/" 
          element={
            <Home 
              setIsAuthPopupsOpen={setIsAuthPopupsOpen} 
              setAuthPopupType={setAuthPopupType} 
            />
          } 
        />
        <Route path="/about" element={<About />} />
        <Route path="/doctors" element={<AllDoctors />} />
        <Route path="/doctors/:doctorId" element={<DoctorDetails />} />
        <Route path="/contact" element={<Contact />} />



        {/* <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-appointments" element={<AdminAppointments />} />
        <Route path="/admin-doctors" element={<AdminDoctors />} />
        <Route path="/admin-patients" element={<AdminPatients />} /> */}

        {/* Admin Routes */}
        <Route element={<ProtectedRoutes allowedRole="ADMIN" />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin-appointments" element={<AdminAppointments />} />
          <Route path="/admin-doctors" element={<AdminDoctors />} />
          <Route path="/admin-patients" element={<AdminPatients />} />
          <Route path="/admin-register-user" element={<RegisterUser />} />
        </Route>

        {/* Doctor Routes */}
        <Route element={<ProtectedRoutes allowedRole="DOCTOR" />}>
          <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
          <Route path="/doctor-appointments" element={<DoctorAppointments />} />
          <Route path="/doctor-slots" element={<DoctorAppointmentSlots />} />
          <Route path="/doctor-profile" element={<DoctorProfile />} />
        </Route>
        
        {/* Receptionist Routes */}
        <Route element={<ProtectedRoutes allowedRole="RECEPTIONIST" />}>
          <Route path="/receptionist-dashboard" element={<ReceptionistDashboard />} />
        </Route>
        
        {/* Patient Routes */}
        <Route element={<ProtectedRoutes allowedRole="PATIENT" />}>
          <Route element={<PatientLayout />}>
            <Route path="/patient-dashboard" element={<PatientDashboard />} />
            <Route path="/book-appointment" element={<BookAppointment />} />
            <Route path="/all-appointments" element={<AllAppointments />} />
            <Route path="/patient-profile" element={<PatientProfile />} />
            <Route path="/medical-records" element={<div className="p-6">Medical Records Coming Soon</div>} />
          </Route>
        </Route>
      </Routes>
      <AuthPopups 
        isOpen={isAuthPopupsOpen} 
        setIsAuthPopupsOpen={setIsAuthPopupsOpen} 
        popupType={authPopupType} 
        setPopupType={setAuthPopupType} 
      />
      <Footer />
    </BrowserRouter>
  );
};

export default App;
