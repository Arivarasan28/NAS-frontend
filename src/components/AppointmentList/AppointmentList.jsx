import React, { useState, useEffect, useMemo } from 'react';
import { List, Grid, Download, RefreshCw } from 'lucide-react';
import AppointmentTable from './AppointmentTable';
import AppointmentCard from './AppointmentCard';
import AppointmentFilters from './AppointmentFilters';
import AppointmentStats from './AppointmentStats';
import Pagination from './Pagination';

const AppointmentList = ({
  appointments = [],
  loading = false,
  error = null,
  onEdit,
  onDelete,
  onView,
  onRefresh,
  doctors = [],
  patients = [],
  showStats = true,
  showFilters = true,
  showActions = true,
  showDoctorFilter = true,
  showPatientFilter = true,
  role = 'admin'
}) => {
  // State
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'card'
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: [],
    dateFrom: null,
    dateTo: null,
    doctorId: null,
    patientId: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState('appointmentDateTime');
  const [sortOrder, setSortOrder] = useState('desc');

  // Filtered and sorted appointments
  const filteredAppointments = useMemo(() => {
    let result = [...appointments];

    // Search filter
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      result = result.filter(apt => {
        const patientName = (apt.patient?.name || `${apt.patient?.firstName} ${apt.patient?.lastName}`).toLowerCase();
        const doctorName = (apt.doctor?.name || `${apt.doctor?.firstName} ${apt.doctor?.lastName}`).toLowerCase();
        const reason = (apt.reason || '').toLowerCase();
        
        return (
          patientName.includes(search) ||
          doctorName.includes(search) ||
          reason.includes(search)
        );
      });
    }

    // Status filter
    if (filters.status && filters.status.length > 0) {
      result = result.filter(apt => filters.status.includes(apt.status));
    }

    // Date range filter
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      result = result.filter(apt => {
        const aptDate = new Date(apt.appointmentDateTime || apt.appointmentTime);
        return aptDate >= fromDate;
      });
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999); // End of day
      result = result.filter(apt => {
        const aptDate = new Date(apt.appointmentDateTime || apt.appointmentTime);
        return aptDate <= toDate;
      });
    }

    // Doctor filter
    if (filters.doctorId) {
      result = result.filter(apt => apt.doctor?.id === parseInt(filters.doctorId));
    }

    // Patient filter
    if (filters.patientId) {
      result = result.filter(apt => apt.patient?.id === parseInt(filters.patientId));
    }

    // Sorting
    result.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'patient':
          aValue = (a.patient?.name || `${a.patient?.firstName} ${a.patient?.lastName}`).toLowerCase();
          bValue = (b.patient?.name || `${b.patient?.firstName} ${b.patient?.lastName}`).toLowerCase();
          break;
        case 'doctor':
          aValue = (a.doctor?.name || `${a.doctor?.firstName} ${a.doctor?.lastName}`).toLowerCase();
          bValue = (b.doctor?.name || `${b.doctor?.firstName} ${b.doctor?.lastName}`).toLowerCase();
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'appointmentDateTime':
        default:
          aValue = new Date(a.appointmentDateTime || a.appointmentTime);
          bValue = new Date(b.appointmentDateTime || b.appointmentTime);
          break;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [appointments, searchTerm, filters, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredAppointments.length / pageSize);
  const paginatedAppointments = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredAppointments.slice(startIndex, endIndex);
  }, [filteredAppointments, currentPage, pageSize]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters]);

  // Handlers
  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilters({
      status: [],
      dateFrom: null,
      dateTo: null,
      doctorId: null,
      patientId: null,
    });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleExport = () => {
    // TODO: Implement CSV export
    console.log('Export functionality to be implemented');
  };

  // Responsive view mode
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setViewMode('card');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Appointments</h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage and view all appointments
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Refresh Button */}
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          )}

          {/* Export Button */}
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            title="Export"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>

          {/* View Mode Toggle */}
          <div className="hidden md:flex items-center gap-1 bg-white border border-gray-300 rounded-lg p-1">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded transition ${
                viewMode === 'table' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('card')}
              className={`p-2 rounded transition ${
                viewMode === 'card' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Card View"
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Statistics */}
      {showStats && !loading && <AppointmentStats appointments={appointments} />}

      {/* Filters */}
      {showFilters && (
        <AppointmentFilters
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          doctors={doctors}
          patients={patients}
          showDoctorFilter={showDoctorFilter}
          showPatientFilter={showPatientFilter}
        />
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 font-medium">Error loading appointments</p>
          <p className="text-red-600 text-sm mt-1">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg shadow-md">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading appointments...</p>
        </div>
      )}

      {/* Content */}
      {!loading && !error && (
        <>
          {/* Results Count */}
          <div className="text-sm text-gray-600">
            Showing {paginatedAppointments.length} of {filteredAppointments.length} appointments
            {filteredAppointments.length !== appointments.length && (
              <span className="ml-1">(filtered from {appointments.length} total)</span>
            )}
          </div>

          {/* Table or Card View */}
          {viewMode === 'table' ? (
            <AppointmentTable
              appointments={paginatedAppointments}
              onEdit={onEdit}
              onDelete={onDelete}
              onView={onView}
              onSort={handleSort}
              sortBy={sortBy}
              sortOrder={sortOrder}
              showActions={showActions}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedAppointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onView={onView}
                  showActions={showActions}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {filteredAppointments.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              totalItems={filteredAppointments.length}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          )}
        </>
      )}
    </div>
  );
};

export default AppointmentList;
