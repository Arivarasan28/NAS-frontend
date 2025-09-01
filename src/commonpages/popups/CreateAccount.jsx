// import React, { useState } from 'react';

// const CreateAccount = () => {
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <div>
//       {/* Button to open the modal */}
//       <button
//         onClick={() => setIsOpen(true)}
//         className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700"
//       >
//         Create Account
//       </button>

//       {/* Modal */}
//       {isOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
//           <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full relative">
//             {/* Close Button */}
//             <button
//               onClick={() => setIsOpen(false)}
//               className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
//             >
//               &times;
//             </button>
//             <h2 className="text-2xl font-bold mb-4">Create Account</h2>
//             <p className="text-sm text-gray-600 mb-6">
//               Please sign up to book appointments
//             </p>
//             <form>
//               <div className="mb-4">
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
//               <button
//                 type="submit"
//                 className="w-full bg-blue-600 text-white py-2 rounded-lg shadow-md hover:bg-blue-700"
//               >
//                 Create Account
//               </button>
//             </form>
//             <p className="text-sm text-center text-gray-500 mt-4">
//               Already have an account?{' '}
//               <a href="/login" className="text-blue-600 hover:underline">
//                 Login here
//               </a>
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CreateAccount;
