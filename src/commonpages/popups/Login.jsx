// import React from 'react';

// const Login = ({ isOpen, setIsOpen }) => {
//   if (!isOpen) return null;  // Don't render the modal if it's not open

//   return (
//     <div>
//       {/* Modal */}
//       <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
//         <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full relative">
//           {/* Close Button */}
//           <button
//             onClick={() => setIsOpen(false)}  // Close the modal
//             className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
//           >
//             &times;
//           </button>
//           <h2 className="text-2xl font-bold mb-4">Login</h2>
//           <form>
//             <div className="mb-4">
//               <label className="block text-gray-700 font-medium mb-2">Email</label>
//               <input
//                 type="email"
//                 className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-green-300"
//                 placeholder="Email"
//               />
//             </div>
//             <div className="mb-6">
//               <label className="block text-gray-700 font-medium mb-2">Password</label>
//               <input
//                 type="password"
//                 className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-green-300"
//                 placeholder="Password"
//               />
//             </div>
//             <button
//               type="submit"
//               className="w-full bg-green-600 text-white py-2 rounded-lg shadow-md hover:bg-green-700"
//             >
//               Login
//             </button>
//           </form>
//           <p className="text-sm text-center text-gray-500 mt-4">
//             Don't have an account?{' '}
//             <a
//               href="/createaccount"
//               className="text-green-600 hover:underline"
//             >
//               Create one here
//             </a>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;
