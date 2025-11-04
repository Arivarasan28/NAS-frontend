import React from 'react';
import { Search, Filter, X, Calendar } from 'lucide-react';

const AppointmentFilters = ({
  searchTerm,
  onSearchChange,
  filters,
  onFilterChange,
  onClearFilters,
  doctors = [],
  patients = [],
  showDoctorFilter = true,
  showPatientFilter = true
}) => {
  const statusOptions = [
    { value: 'SCHEDULED', label: 'Scheduled', color: 'blue' },
    { value: 'COMPLETED', label: 'Completed', color: 'green' },
    { value: 'CANCELLED', label: 'Cancelled', color: 'red' },
    { value: 'NO_SHOW', label: 'No Show', color: 'yellow' },
    { value: 'CONFIRMED', label: 'Confirmed', color: 'indigo' },
  ];

  const quickFilters = [
    { label: 'Today', value: 'today' },
    { label: 'Tomorrow', value: 'tomorrow' },
    { label: 'This Week', value: 'week' },
    { label: 'This Month', value: 'month' },
  ];

  const handleQuickFilter = (filterValue) => {
    const today = new Date();
    let dateFrom, dateTo;

    switch (filterValue) {
      case 'today':
        dateFrom = dateTo = today.toISOString().split('T')[0];
        break;
      case 'tomorrow':
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        dateFrom = dateTo = tomorrow.toISOString().split('T')[0];
        break;
      case 'week':
        dateFrom = today.toISOString().split('T')[0];
        const weekEnd = new Date(today);
        weekEnd.setDate(weekEnd.getDate() + 7);
        dateTo = weekEnd.toISOString().split('T')[0];
        break;
      case 'month':
        dateFrom = today.toISOString().split('T')[0];
        const monthEnd = new Date(today);
        monthEnd.setMonth(monthEnd.getMonth() + 1);
        dateTo = monthEnd.toISOString().split('T')[0];
        break;
      default:
        return;
    }

    onFilterChange({ ...filters, dateFrom, dateTo });
  };

  const hasActiveFilters = () => {
    return (
      filters.status?.length > 0 ||
      filters.dateFrom ||
      filters.dateTo ||
      filters.doctorId ||
      filters.patientId ||
      searchTerm
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6 space-y-4">
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by patient name, doctor, or reason..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        {hasActiveFilters() && (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Clear Filters</span>
          </button>
        )}
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2">
        <span className="text-sm font-medium text-gray-600 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Quick Filters:
        </span>
        {quickFilters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => handleQuickFilter(filter.value)}
            className="px-3 py-1 text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition"
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Advanced Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={filters.status?.[0] || ''}
            onChange={(e) => onFilterChange({ ...filters, status: e.target.value ? [e.target.value] : [] })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Statuses</option>
            {statusOptions.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        {/* Date From */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            From Date
          </label>
          <input
            type="date"
            value={filters.dateFrom || ''}
            onChange={(e) => onFilterChange({ ...filters, dateFrom: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Date To */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            To Date
          </label>
          <input
            type="date"
            value={filters.dateTo || ''}
            onChange={(e) => onFilterChange({ ...filters, dateTo: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Doctor Filter */}
        {showDoctorFilter && doctors.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Doctor
            </label>
            <select
              value={filters.doctorId || ''}
              onChange={(e) => onFilterChange({ ...filters, doctorId: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Doctors</option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  Dr. {doctor.name || `${doctor.firstName} ${doctor.lastName}`}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Patient Filter */}
        {showPatientFilter && patients.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Patient
            </label>
            <select
              value={filters.patientId || ''}
              onChange={(e) => onFilterChange({ ...filters, patientId: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Patients</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.name || `${patient.firstName} ${patient.lastName}`}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Active Filters Count */}
      {hasActiveFilters() && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Filter className="w-4 h-4" />
          <span>
            {[
              filters.status?.length > 0 && 'Status',
              (filters.dateFrom || filters.dateTo) && 'Date Range',
              filters.doctorId && 'Doctor',
              filters.patientId && 'Patient',
              searchTerm && 'Search'
            ].filter(Boolean).length} filter(s) active
          </span>
        </div>
      )}
    </div>
  );
};

export default AppointmentFilters;
