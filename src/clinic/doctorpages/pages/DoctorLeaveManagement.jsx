import React, { useState, useEffect } from 'react';
import { Calendar, Plus, X, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import DoctorLeaveService from '../../../services/DoctorLeaveService';
import DoctorService from '../../../services/DoctorService';
import DoctorLayout from '../components/DoctorLayout';

const DoctorLeaveManagement = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [doctorId, setDoctorId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [leaveRequest, setLeaveRequest] = useState({
    leaveType: 'VACATION',
    startDate: '',
    endDate: '',
    reason: '',
    isHalfDay: false
  });

  const leaveTypes = [
    { value: 'SICK_LEAVE', label: 'Sick Leave', icon: '🤒' },
    { value: 'VACATION', label: 'Vacation', icon: '🏖️' },
    { value: 'EMERGENCY', label: 'Emergency', icon: '🚨' },
    { value: 'CONFERENCE', label: 'Conference', icon: '📚' },
    { value: 'PERSONAL', label: 'Personal', icon: '👤' },
    { value: 'MATERNITY', label: 'Maternity', icon: '👶' },
    { value: 'PATERNITY', label: 'Paternity', icon: '👨‍👶' },
    { value: 'OTHER', label: 'Other', icon: '📝' }
  ];

  useEffect(() => {
    fetchDoctorProfile();
  }, []);

  useEffect(() => {
    if (doctorId) {
      fetchLeaves();
    }
  }, [doctorId]);

  const fetchDoctorProfile = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setError('User ID not found. Please login again.');
        setLoading(false);
        return;
      }
      const response = await DoctorService.getDoctorByUserId(userId);
      setDoctorId(response.data.id);
    } catch (error) {
      console.error('Error fetching doctor profile:', error);
      setError('Failed to load doctor profile');
      setLoading(false);
    }
  };

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const data = await DoctorLeaveService.getLeavesByDoctorId(doctorId);
      setLeaves(data);
    } catch (error) {
      console.error('Error fetching leaves:', error);
      setError('Failed to load leaves');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestLeave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const leaveData = {
        ...leaveRequest,
        doctorId: doctorId
      };
      
      await DoctorLeaveService.requestLeave(leaveData);
      setSuccess('Leave request submitted successfully!');
      setShowRequestForm(false);
      setLeaveRequest({
        leaveType: 'VACATION',
        startDate: '',
        endDate: '',
        reason: '',
        isHalfDay: false
      });
      fetchLeaves();
    } catch (error) {
      console.error('Error requesting leave:', error);
      setError(error.response?.data?.message || 'Failed to submit leave request');
    }
  };

  const handleCancelLeave = async (leaveId) => {
    if (!window.confirm('Are you sure you want to cancel this leave request?')) {
      return;
    }

    try {
      await DoctorLeaveService.cancelLeave(leaveId, doctorId);
      setSuccess('Leave cancelled successfully');
      fetchLeaves();
    } catch (error) {
      console.error('Error cancelling leave:', error);
      setError(error.response?.data?.message || 'Failed to cancel leave');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { color: 'bg-yellow-100 text-yellow-800', icon: <Clock className="w-4 h-4" />, label: 'Pending' },
      APPROVED: { color: 'bg-green-100 text-green-800', icon: <CheckCircle className="w-4 h-4" />, label: 'Approved' },
      REJECTED: { color: 'bg-red-100 text-red-800', icon: <XCircle className="w-4 h-4" />, label: 'Rejected' },
      CANCELLED: { color: 'bg-gray-100 text-gray-800', icon: <X className="w-4 h-4" />, label: 'Cancelled' }
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

  if (loading) {
    return (
      <DoctorLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DoctorLayout>
    );
  }

  return (
    <DoctorLayout>
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
              <p className="text-gray-600 mt-2">Manage your leave requests and view history</p>
            </div>
            <button
              onClick={() => setShowRequestForm(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Request Leave
            </button>
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

        {/* Request Leave Form Modal */}
        {showRequestForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Request Leave</h2>
                  <button
                    onClick={() => setShowRequestForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleRequestLeave} className="space-y-4">
                  {/* Leave Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Leave Type *
                    </label>
                    <select
                      value={leaveRequest.leaveType}
                      onChange={(e) => setLeaveRequest({ ...leaveRequest, leaveType: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      {leaveTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.icon} {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Date Range */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Date *
                      </label>
                      <input
                        type="date"
                        value={leaveRequest.startDate}
                        onChange={(e) => setLeaveRequest({ ...leaveRequest, startDate: e.target.value })}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Date *
                      </label>
                      <input
                        type="date"
                        value={leaveRequest.endDate}
                        onChange={(e) => setLeaveRequest({ ...leaveRequest, endDate: e.target.value })}
                        min={leaveRequest.startDate || new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  {/* Half Day */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isHalfDay"
                      checked={leaveRequest.isHalfDay}
                      onChange={(e) => setLeaveRequest({ ...leaveRequest, isHalfDay: e.target.checked })}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="isHalfDay" className="ml-2 text-sm text-gray-700">
                      Half Day Leave
                    </label>
                  </div>

                  {/* Reason */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reason *
                    </label>
                    <textarea
                      value={leaveRequest.reason}
                      onChange={(e) => setLeaveRequest({ ...leaveRequest, reason: e.target.value })}
                      rows="4"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Please provide a reason for your leave request..."
                      required
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Submit Request
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowRequestForm(false)}
                      className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Leave History */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Leave History</h2>
          </div>

          {leaves.length === 0 ? (
            <div className="p-12 text-center">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No leave requests yet</p>
              <p className="text-gray-400 mt-2">Click "Request Leave" to submit your first request</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {leaves.map((leave) => (
                <div key={leave.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">
                          {leaveTypes.find(t => t.value === leave.leaveType)?.icon || '📝'}
                        </span>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {leaveTypes.find(t => t.value === leave.leaveType)?.label || leave.leaveType}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {formatDate(leave.startDate)} - {formatDate(leave.endDate)}
                            <span className="ml-2 text-blue-600 font-medium">
                              ({calculateDuration(leave.startDate, leave.endDate)} day{calculateDuration(leave.startDate, leave.endDate) > 1 ? 's' : ''})
                            </span>
                            {leave.isHalfDay && <span className="ml-2 text-purple-600">(Half Day)</span>}
                          </p>
                        </div>
                      </div>

                      <p className="text-gray-700 mb-3">{leave.reason}</p>

                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Requested: {formatDate(leave.requestedAt)}</span>
                        {leave.approvedAt && (
                          <span>
                            {leave.status === 'APPROVED' ? 'Approved' : 'Rejected'}: {formatDate(leave.approvedAt)}
                          </span>
                        )}
                        {leave.approvedBy && <span>By: {leave.approvedBy}</span>}
                      </div>

                      {leave.adminNotes && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Admin Notes:</span> {leave.adminNotes}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-3 ml-4">
                      {getStatusBadge(leave.status)}
                      
                      {(leave.status === 'PENDING' || leave.status === 'APPROVED') && (
                        <button
                          onClick={() => handleCancelLeave(leave.id)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Cancel Leave
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
    </DoctorLayout>
  );
};

export default DoctorLeaveManagement;
