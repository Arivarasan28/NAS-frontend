import React from 'react';

const ReceptionistDashboard = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Receptionist Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-blue-600 mb-4">Today's Appointments</h2>
          <p className="text-gray-600">Manage today's scheduled appointments</p>
          <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
            View Appointments
          </button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-green-600 mb-4">Patient Registration</h2>
          <p className="text-gray-600">Register new patients to the system</p>
          <button className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition">
            Register Patient
          </button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-purple-600 mb-4">Doctor Schedule</h2>
          <p className="text-gray-600">View and manage doctor schedules</p>
          <button className="mt-4 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition">
            View Schedules
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceptionistDashboard;
