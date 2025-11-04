import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, UserPlus, Clock } from 'lucide-react';
import ReceptionistLayout from '../components/ReceptionistLayout';

const ReceptionistDashboard = () => {
  return (
    <ReceptionistLayout>
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Receptionist Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Book Appointments Card */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-transform">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                <Calendar className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-semibold">Book Appointments</h2>
            </div>
            <p className="text-blue-100 mb-4">Schedule appointments for patients with available doctors</p>
            <Link 
              to="/receptionist-appointments" 
              className="inline-block bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition font-medium"
            >
              Book Now
            </Link>
          </div>
          
          {/* Manage Patients Card */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-transform">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                <Users className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-semibold">Manage Patients</h2>
            </div>
            <p className="text-blue-100 mb-4">View, add, edit, and manage patient records</p>
            <Link 
              to="/receptionist-patients" 
              className="inline-block bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition font-medium"
            >
              View Patients
            </Link>
          </div>
          
          {/* Quick Stats Card */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-xl shadow-lg text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                <Clock className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-semibold">Quick Actions</h2>
            </div>
            <div className="space-y-3">
              <div className="bg-white bg-opacity-10 p-3 rounded-lg">
                <p className="text-sm text-blue-100">Today's Date</p>
                <p className="text-lg font-semibold">{new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Receptionist Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Smart Appointment Booking</h3>
                <p className="text-sm text-gray-600">Automatically generated slots based on doctor availability and working hours</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Patient Management</h3>
                <p className="text-sm text-gray-600">Complete CRUD operations for patient records with user account creation</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <UserPlus className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Walk-in Appointments</h3>
                <p className="text-sm text-gray-600">Book appointments for walk-in patients with cash payment option</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Real-time Availability</h3>
                <p className="text-sm text-gray-600">View real-time slot availability across multiple days and weeks</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ReceptionistLayout>
  );
};

export default ReceptionistDashboard;
