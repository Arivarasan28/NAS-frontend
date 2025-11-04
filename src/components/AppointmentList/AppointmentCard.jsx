import React from 'react';
import { Calendar, Clock, User, Stethoscope, FileText, MoreVertical, Edit, Trash2, Eye } from 'lucide-react';

const AppointmentCard = ({ appointment, onEdit, onDelete, onView, showActions = true }) => {
  const [showMenu, setShowMenu] = React.useState(false);

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return {
      date: date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
  };

  const getStatusColor = (status) => {
    const colors = {
      SCHEDULED: 'bg-blue-100 text-blue-800 border-blue-200',
      COMPLETED: 'bg-green-100 text-green-800 border-green-200',
      CANCELLED: 'bg-red-100 text-red-800 border-red-200',
      NO_SHOW: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      CONFIRMED: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const { date, time } = formatDateTime(appointment.appointmentDateTime || appointment.appointmentTime);
  const displayPatientName = appointment.patient?.name 
    || `${appointment.patient?.firstName || ''} ${appointment.patient?.lastName || ''}`.trim()
    || appointment.patientName
    || '-';
  const displayDoctorName = appointment.doctor?.name 
    || `${appointment.doctor?.firstName || ''} ${appointment.doctor?.lastName || ''}`.trim()
    || appointment.doctorName
    || '-';
  const displayDoctorSpec = appointment.doctor?.specialization || appointment.doctorSpecialization;

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 hover:shadow-lg transition-shadow relative">
      {/* Status Badge */}
      <div className="absolute top-4 right-4">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(appointment.status)}`}>
          {appointment.status}
        </span>
      </div>

      {/* Patient Info */}
      <div className="mb-3">
        <div className="flex items-start gap-2 mb-1">
          <User className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-lg text-gray-800">
              {displayPatientName}
            </h3>
            {appointment.patient?.phone && (
              <p className="text-sm text-gray-600">{appointment.patient.phone}</p>
            )}
          </div>
        </div>
      </div>

      {/* Doctor Info */}
      <div className="flex items-center gap-2 mb-3 text-gray-700">
        <Stethoscope className="w-4 h-4 text-blue-600" />
        <span className="text-sm font-medium">
          Dr. {displayDoctorName}
        </span>
        {displayDoctorSpec && (
          <span className="text-xs text-gray-500">
            ({displayDoctorSpec})
          </span>
        )}
      </div>

      {/* Date & Time */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="flex items-center gap-2 text-gray-700">
          <Calendar className="w-4 h-4 text-blue-600" />
          <span className="text-sm">{date}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-700">
          <Clock className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium">{time}</span>
        </div>
      </div>

      {/* Reason */}
      {appointment.reason && (
        <div className="flex items-start gap-2 mb-3 text-gray-700">
          <FileText className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm line-clamp-2">{appointment.reason}</p>
        </div>
      )}

      {/* Actions */}
      {showActions && (
        <div className="flex items-center justify-end gap-2 pt-3 border-t">
          {onView && (
            <button
              onClick={() => onView(appointment)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition"
            >
              <Eye className="w-4 h-4" />
              View
            </button>
          )}
          {onEdit && (
            <button
              onClick={() => onEdit(appointment)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(appointment.id)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AppointmentCard;
