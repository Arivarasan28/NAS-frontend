import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle, XCircle, Clock, AlertCircle, Filter, Search, Trash2 } from 'lucide-react';
import DoctorLeaveService from '../../../services/DoctorLeaveService';
import AdminLayout from '../components/AdminLayout';

const AdminLeaveManagement = () => {
  const [leaves, setLeaves] = useState([]);
  const [filteredLeaves, setFilteredLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [approvalData, setApprovalData] = useState({
    status: 'APPROVED',
    adminNotes: ''
  });

  const leaveTypes = {
    SICK_LEAVE: { label: 'Sick Leave', icon: '🤒', color: 'text-red-600' },
    VACATION: { label: 'Vacation', icon: '🏖️', color: 'text-blue-600' },
    EMERGENCY: { label: 'Emergency', icon: '🚨', color: 'text-orange-600' },
    CONFERENCE: { label: 'Conference', icon: '📚', color: 'text-purple-600' },
    PERSONAL: { label: 'Personal', icon: '👤', color: 'text-gray-600' },
    MATERNITY: { label: 'Maternity', icon: '👶', color: 'text-pink-600' },
    PATERNITY: { label: 'Paternity', icon: '👨‍👶', color: 'text-indigo-600' },
    OTHER: { label: 'Other', icon: '📝', color: 'text-gray-600' }
  };

  const statusFilters = [
    { value: 'ALL', label: 'All Leaves', count: 0 },
    { value: 'PENDING', label: 'Pending', count: 0 },
    { value: 'APPROVED', label: 'Approved', count: 0 },
    { value: 'REJECTED', label: 'Rejected', count: 0 },
    { value: 'CANCELLED', label: 'Cancelled', count: 0 }
  ];

  useEffect(() => {
    fetchLeaves();
  }, [selectedStatus]);

  useEffect(() => {
    filterLeaves();
  }, [leaves, searchTerm, selectedStatus]);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      let data;
      
      if (selectedStatus === 'ALL') {
        // Fetch all leaves by getting each status
        const [pending, approved, rejected, cancelled] = await Promise.all([
          DoctorLeaveService.getLeavesByStatus('PENDING'),
          DoctorLeaveService.getLeavesByStatus('APPROVED'),
          DoctorLeaveService.getLeavesByStatus('REJECTED'),
          DoctorLeaveService.getLeavesByStatus('CANCELLED')
        ]);
        data = [...pending, ...approved, ...rejected, ...cancelled];
      } else {
        data = await DoctorLeaveService.getLeavesByStatus(selectedStatus);
      }
      
      setLeaves(data);
    } catch (error) {
      console.error('Error fetching leaves:', error);
      setError('Failed to load leaves');
    } finally {
      setLoading(false);
    }
  };

  const filterLeaves = () => {
    let filtered = leaves;

    // Filter by search term (doctor name or reason)
    if (searchTerm) {
      filtered = filtered.filter(leave =>
        leave.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        leave.reason.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredLeaves(filtered);
  };

  const handleApproveReject = (leave) => {
    setSelectedLeave(leave);
    setApprovalData({
      status: 'APPROVED',
      adminNotes: ''
    });
    setShowApprovalModal(true);
  };

  const submitApproval = async () => {
    try {
      setError('');
      const username = localStorage.getItem('username') || 'admin';
      
      await DoctorLeaveService.updateLeaveStatus(selectedLeave.id, {
        ...approvalData,
        approvedBy: username
      });
      
      setSuccess(`Leave ${approvalData.status.toLowerCase()} successfully`);
      setShowApprovalModal(false);
      setSelectedLeave(null);
      fetchLeaves();
    } catch (error) {
      console.error('Error updating leave status:', error);
      setError(error.response?.data?.message || 'Failed to update leave status');
    }
  };

  const handleDeleteLeave = async (leaveId) => {
    if (!window.confirm('Are you sure you want to delete this leave request? This action cannot be undone.')) {
      return;
    }

    try {
      await DoctorLeaveService.deleteLeave(leaveId);
      setSuccess('Leave deleted successfully');
      fetchLeaves();
    } catch (error) {
      console.error('Error deleting leave:', error);
      setError(error.response?.data?.message || 'Failed to delete leave');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { color: 'bg-yellow-100 text-yellow-800', icon: <Clock className="w-4 h-4" />, label: 'Pending' },
      APPROVED: { color: 'bg-green-100 text-green-800', icon: <CheckCircle className="w-4 h-4" />, label: 'Approved' },
      REJECTED: { color: 'bg-red-100 text-red-800', icon: <XCircle className="w-4 h-4" />, label: 'Rejected' },
      CANCELLED: { color: 'bg-gray-100 text-gray-800', icon: <XCircle className="w-4 h-4" />, label: 'Cancelled' }
    };

    const config = statusConfig[status] || statusConfig.PENDING;
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        {config.icon}
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const getStatusCounts = () => {
    const counts = {
      ALL: leaves.length,
      PENDING: leaves.filter(l => l.status === 'PENDING').length,
      APPROVED: leaves.filter(l => l.status === 'APPROVED').length,
      REJECTED: leaves.filter(l => l.status === 'REJECTED').length,
      CANCELLED: leaves.filter(l => l.status === 'CANCELLED').length
    };
    return counts;
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  const statusCounts = getStatusCounts();

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <Calendar className="w-8 h-8 text-blue-600" />
                Leave Management
              </h1>
              <p className="text-gray-600 mt-2">Review and manage doctor leave requests</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Total Requests</p>
              <p className="text-3xl font-bold text-blue-600">{leaves.length}</p>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              <p className="text-green-700">{success}</p>
            </div>
          </div>
        )}

        {/* Status Filter Tabs */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {statusFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setSelectedStatus(filter.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedStatus === filter.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.label}
                <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-white bg-opacity-20">
                  {statusCounts[filter.value]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by doctor name or reason..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Approval Modal */}
        {showApprovalModal && selectedLeave && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Review Leave Request
                </h2>

                {/* Leave Details */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-sm text-gray-500">Doctor</p>
                      <p className="font-semibold">{selectedLeave.doctorName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Leave Type</p>
                      <p className="font-semibold">
                        {leaveTypes[selectedLeave.leaveType]?.icon} {leaveTypes[selectedLeave.leaveType]?.label}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-sm text-gray-500">Start Date</p>
                      <p className="font-semibold">{formatDate(selectedLeave.startDate)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">End Date</p>
                      <p className="font-semibold">{formatDate(selectedLeave.endDate)}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Reason</p>
                    <p className="font-semibold">{selectedLeave.reason}</p>
                  </div>
                </div>

                {/* Decision */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Decision *
                  </label>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setApprovalData({ ...approvalData, status: 'APPROVED' })}
                      className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                        approvalData.status === 'APPROVED'
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <CheckCircle className="w-5 h-5 inline mr-2" />
                      Approve
                    </button>
                    <button
                      onClick={() => setApprovalData({ ...approvalData, status: 'REJECTED' })}
                      className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                        approvalData.status === 'REJECTED'
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <XCircle className="w-5 h-5 inline mr-2" />
                      Reject
                    </button>
                  </div>
                </div>

                {/* Admin Notes */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Admin Notes (Optional)
                  </label>
                  <textarea
                    value={approvalData.adminNotes}
                    onChange={(e) => setApprovalData({ ...approvalData, adminNotes: e.target.value })}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Add any notes or comments..."
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={submitApproval}
                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Submit Decision
                  </button>
                  <button
                    onClick={() => {
                      setShowApprovalModal(false);
                      setSelectedLeave(null);
                    }}
                    className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Leave Requests List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
              {selectedStatus === 'ALL' ? 'All Leave Requests' : `${selectedStatus} Requests`}
            </h2>
          </div>

          {filteredLeaves.length === 0 ? (
            <div className="p-12 text-center">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No leave requests found</p>
              <p className="text-gray-400 mt-2">
                {searchTerm ? 'Try adjusting your search' : 'No requests match the selected filter'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredLeaves.map((leave) => (
                <div key={leave.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">
                          {leaveTypes[leave.leaveType]?.icon || '📝'}
                        </span>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {leave.doctorName}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {leaveTypes[leave.leaveType]?.label || leave.leaveType}
                          </p>
                        </div>
                      </div>

                      <div className="ml-11">
                        <p className="text-sm text-gray-500 mb-2">
                          {formatDate(leave.startDate)} - {formatDate(leave.endDate)}
                          <span className="ml-2 text-blue-600 font-medium">
                            ({calculateDuration(leave.startDate, leave.endDate)} day{calculateDuration(leave.startDate, leave.endDate) > 1 ? 's' : ''})
                          </span>
                          {leave.isHalfDay && <span className="ml-2 text-purple-600">(Half Day)</span>}
                        </p>

                        <p className="text-gray-700 mb-3">{leave.reason}</p>

                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>Requested: {formatDate(leave.requestedAt)}</span>
                          {leave.approvedAt && (
                            <>
                              <span>
                                {leave.status === 'APPROVED' ? 'Approved' : 'Rejected'}: {formatDate(leave.approvedAt)}
                              </span>
                              <span>By: {leave.approvedBy}</span>
                            </>
                          )}
                        </div>

                        {leave.adminNotes && (
                          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm text-gray-700">
                              <span className="font-medium">Admin Notes:</span> {leave.adminNotes}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3 ml-4">
                      {getStatusBadge(leave.status)}
                      
                      <div className="flex gap-2">
                        {leave.status === 'PENDING' && (
                          <button
                            onClick={() => handleApproveReject(leave)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                          >
                            Review
                          </button>
                        )}
                        
                        <button
                          onClick={() => handleDeleteLeave(leave.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete leave"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
    </AdminLayout>
  );
};

export default AdminLeaveManagement;
