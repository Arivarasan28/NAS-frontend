import React from 'react';
import { Edit, Trash2, Eye, ArrowUpDown } from 'lucide-react';

const AppointmentTable = ({ 
  appointments, 
  onEdit, 
  onDelete, 
  onView,
  onSort,
  sortBy,
  sortOrder,
  showActions = true 
}) => {
  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      SCHEDULED: 'bg-blue-100 text-blue-800',
      COMPLETED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
      NO_SHOW: 'bg-yellow-100 text-yellow-800',
      CONFIRMED: 'bg-indigo-100 text-indigo-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const handleSort = (field) => {
    if (onSort) {
      onSort(field);
    }
  };

  const SortIcon = ({ field }) => {
    if (sortBy !== field) {
      return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
    }
    return (
      <ArrowUpDown 
        className={`w-4 h-4 ${sortOrder === 'asc' ? 'text-blue-600' : 'text-blue-600 rotate-180'}`} 
      />
    );
  };

  if (appointments.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <p className="text-gray-500 text-lg">No appointments found</p>
        <p className="text-gray-400 text-sm mt-2">Try adjusting your filters or search criteria</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-50">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-blue-100 transition"
                onClick={() => handleSort('patient')}
              >
                <div className="flex items-center gap-2">
                  Patient
                  <SortIcon field="patient" />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-blue-100 transition"
                onClick={() => handleSort('doctor')}
              >
                <div className="flex items-center gap-2">
                  Doctor
                  <SortIcon field="doctor" />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-blue-100 transition"
                onClick={() => handleSort('appointmentDateTime')}
              >
                <div className="flex items-center gap-2">
                  Date & Time
                  <SortIcon field="appointmentDateTime" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Reason
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-blue-100 transition"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center gap-2">
                  Status
                  <SortIcon field="status" />
                </div>
              </th>
              {showActions && (
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {appointments.map((appointment) => (
              <tr 
                key={appointment.id} 
                className="hover:bg-gray-50 transition"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <div className="text-sm font-medium text-gray-900">
                      {appointment.patient?.name 
                        || `${appointment.patient?.firstName || ''} ${appointment.patient?.lastName || ''}`.trim()
                        || appointment.patientName
                        || '-'}
                    </div>
                    {appointment.patient?.phone && (
                      <div className="text-xs text-gray-500">
                        {appointment.patient.phone}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <div className="text-sm text-gray-900">
                      Dr. {appointment.doctor?.name 
                        || `${appointment.doctor?.firstName || ''} ${appointment.doctor?.lastName || ''}`.trim()
                        || appointment.doctorName
                        || '-'}
                    </div>
                    {(appointment.doctor?.specialization || appointment.doctorSpecialization) && (
                      <div className="text-xs text-gray-500">
                        {appointment.doctor?.specialization || appointment.doctorSpecialization}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDateTime(appointment.appointmentDateTime || appointment.appointmentTime)}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 max-w-xs truncate" title={appointment.reason}>
                    {appointment.reason || '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                    {appointment.status}
                  </span>
                </td>
                {showActions && (
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <div className="flex items-center justify-center gap-2">
                      {onView && (
                        <button
                          onClick={() => onView(appointment)}
                          className="text-blue-600 hover:text-blue-900 transition"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      {onEdit && (
                        <button
                          onClick={() => onEdit(appointment)}
                          className="text-blue-600 hover:text-blue-900 transition"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(appointment.id)}
                          className="text-red-600 hover:text-red-900 transition"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AppointmentTable;
