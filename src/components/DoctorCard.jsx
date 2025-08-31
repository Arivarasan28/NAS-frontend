import React from 'react';
import { FaUserMd, FaCalendarAlt, FaMapMarkerAlt, FaEnvelope, FaPhone } from 'react-icons/fa';

const DoctorCard = ({ 
  doctor, 
  isSelected = false, 
  onSelect, 
  onBookAppointment,
  mode = 'selection', // 'selection' for BookAppointment, 'display' for AllDoctors
  showBookButton = false,
  userRole = null,
  onCardClick
}) => {
  // Handle different doctor object structures
  const derivedName = [doctor?.firstName, doctor?.lastName].filter(Boolean).join(' ').trim();
  const emailLocal = ((doctor?.email || doctor?.emailId || '') + '').split('@')[0] || '';
  const rawName = (doctor?.name || doctor?.fullName || doctor?.doctorName || doctor?.user?.name || derivedName || emailLocal || '').toString();
  const doctorName = rawName.trim() || 'Doctor';
  const doctorSpecialty = doctor?.specialization || doctor?.specialty || 'General';
  const doctorEmail = doctor?.email || doctor?.emailId || 'Email not provided';
  const doctorPhone = doctor?.phoneNumber || doctor?.phone || 'Phone not provided';
  const profilePicture = (
    doctor?.profilePictureUrl ||
    (doctor?.profilePictureName ? `/uploads/profile_pictures/${doctor.profilePictureName}` : null) ||
    '/default-profile.png'
  );

  if (mode === 'selection') {
    // Simplified card for doctor selection in BookAppointment
    return (
      <div 
        onClick={() => onSelect && onSelect(doctor)}
        className={`border rounded-lg p-4 cursor-pointer transition ${
          isSelected 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-200 hover:border-blue-300'
        }`}
      >
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mr-4 text-gray-600 font-bold">
            {doctorName ? doctorName.charAt(0).toUpperCase() : 'D'}
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Dr. {doctorName}</h3>
            <p className="text-sm text-gray-600">{doctorSpecialty}</p>
          </div>
        </div>
      </div>
    );
  }

  // Full display card for AllDoctors/BookAppointment pages
  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => onCardClick && onCardClick(doctor)}
      role="button"
      tabIndex={0}
    >
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="w-20 h-20 rounded-full overflow-hidden mr-4 bg-gray-100">
            <img 
              src={profilePicture} 
              alt={`Dr. ${doctorName}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/default-profile.png';
              }}
            />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Dr. {doctorName}</h2>
            <p className="text-blue-600">{doctorSpecialty}</p>
          </div>
        </div>
        
        <div className="mb-4 text-gray-600">
          <div className="flex items-center mb-2">
            <FaEnvelope className="mr-2" />
            <span>{doctorEmail}</span>
          </div>
          <div className="flex items-center">
            <FaPhone className="mr-2" />
            <span>{doctorPhone}</span>
          </div>
        </div>
        
        {showBookButton && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onBookAppointment && onBookAppointment(doctor);
            }}
            className="block w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded text-center transition-colors flex items-center justify-center"
          >
            <FaCalendarAlt className="mr-2" />
            {userRole === 'PATIENT' ? 'Book Appointment' : 'Login & Book Appointment'}
          </button>
        )}
      </div>
    </div>
  );
};

export default DoctorCard;
