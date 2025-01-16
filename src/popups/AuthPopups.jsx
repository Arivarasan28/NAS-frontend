

// import React, { useState } from 'react';

// const AuthPopups = ({ isOpen, setIsAuthPopupsOpen }) => {
//   const [isSignupOpen, setIsSignupOpen] = useState(false);

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
//       <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full relative">
//         {/* Close Button */}
//         <button
//           onClick={() => setIsAuthPopupsOpen(false)}
//           className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
//         >
//           &times;
//         </button>

//         {isSignupOpen ? (
//           <>
//             <h2 className="text-2xl font-bold mb-4">Create Account</h2>
//             <form>
//             <div className="mb-4">
//                 <label className="block text-gray-700 font-medium mb-2">Full Name</label>
//                 <input
//                   type="text"
//                   className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
//                   placeholder="Full Name"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-gray-700 font-medium mb-2">Email</label>
//                 <input
//                   type="email"
//                   className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
//                   placeholder="Email"
//                 />
//               </div>
//               <div className="mb-6">
//                 <label className="block text-gray-700 font-medium mb-2">Password</label>
//                 <input
//                   type="password"
//                   className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
//                   placeholder="Password"
//                 />
//               </div>
//               <button type="submit" className="w-full bg-customBlue2 text-white py-2 rounded-lg shadow-md hover:bg-customBlue1">
//                 Create Account
//               </button>
//             </form>
//             <p className="text-sm text-center text-gray-500 mt-4">
//               Already have an account?{' '}
//               <span
//                 onClick={() => setIsSignupOpen(false)}
//                 className="text-customBlue2 hover:underline cursor-pointer"
//               >
//                 Login here
//               </span>
//             </p>
//           </>
//         ) : (
//           <>
//             <h2 className="text-2xl font-bold mb-4">Login</h2>
//             <form>
//             <div className="mb-4">
//                 <label className="block text-gray-700 font-medium mb-2">Email</label>
//                 <input
//                   type="email"
//                   className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-green-300"
//                   placeholder="Email"
//                 />
//               </div>
//               <div className="mb-6">
//                 <label className="block text-gray-700 font-medium mb-2">Password</label>
//                 <input
//                   type="password"
//                   className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-green-300"
//                   placeholder="Password"
//                 />
//               </div>
//               <button type="submit" className="w-full bg-customBlue2 text-white py-2 rounded-lg shadow-md hover:bg-customBlue1">
//                 Login
//               </button>
//             </form>
//             <p className="text-sm text-center text-gray-500 mt-4">
//               Don't have an account?{' '}
//               <span
//                 onClick={() => setIsSignupOpen(true)}
//                 className="text-customBlue2 hover:underline cursor-pointer"
//               >
//                 Create one here
//               </span>
//             </p>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AuthPopups;

import React, { useState } from 'react';

const AuthPopups = ({ isOpen, setIsAuthPopupsOpen, popupType, setPopupType }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full relative">
        {/* Close Button */}
        <button
          onClick={() => setIsAuthPopupsOpen(false)}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>

        {popupType === 'signup' ? (
          <>
            <h2 className="text-2xl font-bold mb-4">Create Account</h2>
            <form>
              {/* Signup Form */}
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                  placeholder="Full Name"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                  placeholder="Email"
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">Password</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                  placeholder="Password"
                />
              </div>
              <button type="submit" className="w-full bg-customBlue2 text-white py-2 rounded-lg shadow-md hover:bg-customBlue1">
                Create Account
              </button>
            </form>
            <p className="text-sm text-center text-gray-500 mt-4">
              Already have an account?{' '}
              <span
                onClick={() => setPopupType('login')}
                className="text-customBlue2 hover:underline cursor-pointer"
              >
                Login here
              </span>
            </p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4">Login</h2>
            <form>
              {/* Login Form */}
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-green-300"
                  placeholder="Email"
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">Password</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-green-300"
                  placeholder="Password"
                />
              </div>
              <button type="submit" className="w-full bg-customBlue2 text-white py-2 rounded-lg shadow-md hover:bg-customBlue1">
                Login
              </button>
            </form>
            <p className="text-sm text-center text-gray-500 mt-4">
              Don't have an account?{' '}
              <span
                onClick={() => setPopupType('signup')}
                className="text-customBlue2 hover:underline cursor-pointer"
              >
                Create one here
              </span>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthPopups;
