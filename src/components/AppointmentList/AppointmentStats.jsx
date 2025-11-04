import React from 'react';
import { Calendar, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

const AppointmentStats = ({ appointments }) => {
  const stats = {
    total: appointments.length,
    scheduled: appointments.filter(a => a.status === 'SCHEDULED').length,
    completed: appointments.filter(a => a.status === 'COMPLETED').length,
    cancelled: appointments.filter(a => a.status === 'CANCELLED').length,
    noShow: appointments.filter(a => a.status === 'NO_SHOW').length,
  };

  const today = new Date().toDateString();
  stats.today = appointments.filter(a => {
    const appointmentDate = new Date(a.appointmentDateTime || a.appointmentTime);
    return appointmentDate.toDateString() === today;
  }).length;

  const statCards = [
    {
      label: 'Total Appointments',
      value: stats.total,
      icon: Calendar,
      color: 'blue',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-200'
    },
    {
      label: "Today's Appointments",
      value: stats.today,
      icon: Clock,
      color: 'indigo',
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
      borderColor: 'border-indigo-200'
    },
    {
      label: 'Scheduled',
      value: stats.scheduled,
      icon: AlertCircle,
      color: 'blue',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-200'
    },
    {
      label: 'Completed',
      value: stats.completed,
      icon: CheckCircle,
      color: 'green',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      borderColor: 'border-green-200'
    },
    {
      label: 'Cancelled',
      value: stats.cancelled,
      icon: XCircle,
      color: 'red',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
      borderColor: 'border-red-200'
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className={`${stat.bgColor} border ${stat.borderColor} rounded-lg p-4 transition-transform hover:scale-105`}
          >
            <div className="flex items-center justify-between mb-2">
              <Icon className={`w-5 h-5 ${stat.iconColor}`} />
              <span className={`text-2xl font-bold ${stat.iconColor}`}>
                {stat.value}
              </span>
            </div>
            <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
          </div>
        );
      })}
    </div>
  );
};

export default AppointmentStats;
