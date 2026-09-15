import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../services/api';

const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('users'); // 'users' or 'audit-logs'
  const [currentUser, setCurrentUser] = useState(null);

  // User Management State
  const [users, setUsers] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [usersLoading, setUsersLoading] = useState(true);
  const [userError, setUserError] = useState('');
  const [userSuccessMessage, setUserSuccessMessage] = useState('');
  const [userFilter, setUserFilter] = useState({
    search: '',
    role: '',
    status: '',
    page: 1,
    limit: 10,
  });
  const [userPagination, setUserPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
    hasNext: false,
    hasPrev: false,
  });

  // Modal State for Block / Suspend
  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [suspensionReason, setSuspensionReason] = useState('Violation of Terms of Service');
  const [customReason, setCustomReason] = useState('');
  const [isSubmittingBlock, setIsSubmittingBlock] = useState(false);

  // Modal State for Deactivate (Soft Delete)
  const [deactivateModalOpen, setDeactivateModalOpen] = useState(false);
  const [selectedUserForDeactivate, setSelectedUserForDeactivate] = useState(null);
  const [deactivateReason, setDeactivateReason] = useState('');
  const [isSubmittingDeactivate, setIsSubmittingDeactivate] = useState(false);

  // Audit Logs State
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [logsLoading, setLogsLoading] = useState(true);
  const [logsError, setLogsError] = useState('');
  const [logFilter, setLogFilter] = useState({
    status: '',
    action: '',
    page: 1,
    limit: 20,
  });
  const [logPagination, setLogPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
    hasNext: false,
    hasPrev: false,
  });

  const navigate = useNavigate();

  useEffect(() => {
    checkAdminAccess();
  }, []);

  useEffect(() => {
    if (currentUser) {
      if (activeTab === 'users') {
        fetchUsers();
      } else if (activeTab === 'audit-logs' && stats) {
        fetchAuditLogs();
      }
    }
  }, [activeTab, userFilter, logFilter]);

  const checkAdminAccess = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo) {
      navigate('/login');
      return;
    }
    if (userInfo.role !== 'admin') {
      navigate('/');
      return;
    }
    setCurrentUser(userInfo);
    fetchUsers(userInfo);
    fetchStats(userInfo);
  };

  // ===================== USER MANAGEMENT =====================

  const fetchUsers = async (authInfo = currentUser) => {
    const token = authInfo?.token || currentUser?.token;
    if (!token) return;

    try {
      setUsersLoading(true);
      setUserError('');

      const queryParams = new URLSearchParams();
      if (userFilter.search) queryParams.append('search', userFilter.search);
      if (userFilter.role) queryParams.append('role', userFilter.role);
      if (userFilter.status) queryParams.append('status', userFilter.status);
      queryParams.append('page', userFilter.page);
      queryParams.append('limit', userFilter.limit);

      const response = await fetch(`${API_BASE_URL}/admin/users?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
        setUserPagination(data.pagination);
        if (data.stats) {
          setUserStats(data.stats);
        }
      } else if (response.status === 403) {
        navigate('/');
      } else {
        const errData = await response.json().catch(() => ({}));
        setUserError(errData.message || 'Failed to fetch users');
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setUserError('Network error while fetching users');
    } finally {
      setUsersLoading(false);
    }
  };

  const openBlockModal = (user) => {
    setSelectedUser(user);
    setSuspensionReason('Violation of Terms of Service');
    setCustomReason('');
    setBlockModalOpen(true);
  };

  const closeBlockModal = () => {
    setBlockModalOpen(false);
    setSelectedUser(null);
  };

  const handleBlockUser = async () => {
    if (!selectedUser) return;
    const token = currentUser?.token;
    if (!token) return;

    setIsSubmittingBlock(true);
    const finalReason =
      suspensionReason === 'Custom'
        ? customReason.trim() || 'Suspended by administrator'
        : suspensionReason;

    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${selectedUser._id}/block`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          isBlocked: true,
          reason: finalReason,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        showSuccessMessage(data.message || `Account for ${selectedUser.email} has been suspended`);
        closeBlockModal();
        fetchUsers();
        if (stats) fetchAuditLogs();
      } else {
        setUserError(data.message || 'Failed to suspend account');
      }
    } catch (err) {
      console.error('Error suspending user:', err);
      setUserError('Error suspending account');
    } finally {
      setIsSubmittingBlock(false);
    }
  };

  const handleUnblockUser = async (user) => {
    const token = currentUser?.token;
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${user._id}/block`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          isBlocked: false,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        showSuccessMessage(data.message || `Account for ${user.email} unblocked`);
        fetchUsers();
        if (stats) fetchAuditLogs();
      } else {
        setUserError(data.message || 'Failed to unblock account');
      }
    } catch (err) {
      console.error('Error unblocking user:', err);
      setUserError('Error unblocking account');
    }
  };

  const openDeactivateModal = (user) => {
    setSelectedUserForDeactivate(user);
    setDeactivateReason('');
    setDeactivateModalOpen(true);
  };

  const closeDeactivateModal = () => {
    setDeactivateModalOpen(false);
    setSelectedUserForDeactivate(null);
  };

  const handleDeactivateUser = async () => {
    if (!selectedUserForDeactivate) return;
    const token = currentUser?.token;
    if (!token) return;

    setIsSubmittingDeactivate(true);
    const newActiveState = !selectedUserForDeactivate.isActive;

    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/users/${selectedUserForDeactivate._id}/deactivate`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            isActive: newActiveState,
            reason: deactivateReason.trim() || undefined,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        showSuccessMessage(data.message || 'Account status updated');
        closeDeactivateModal();
        fetchUsers();
        if (stats) fetchAuditLogs();
      } else {
        setUserError(data.message || 'Failed to update deactivation status');
      }
    } catch (err) {
      console.error('Error deactivating user:', err);
      setUserError('Error updating account status');
    } finally {
      setIsSubmittingDeactivate(false);
    }
  };

  const showSuccessMessage = (msg) => {
    setUserSuccessMessage(msg);
    setTimeout(() => {
      setUserSuccessMessage('');
    }, 5000);
  };

  // ===================== AUDIT LOGS =====================

  const fetchStats = async (authInfo = currentUser) => {
    const token = authInfo?.token || currentUser?.token;
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/admin/audit-logs/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
        fetchAuditLogs(authInfo);
      } else if (response.status === 403) {
        navigate('/');
      } else {
        setLogsError('Failed to fetch statistics');
        setLogsLoading(false);
      }
    } catch (err) {
      console.error('Stats fetch error:', err);
      setLogsError('Failed to fetch statistics');
      setLogsLoading(false);
    }
  };

  const fetchAuditLogs = async (authInfo = currentUser) => {
    const token = authInfo?.token || currentUser?.token;
    if (!token) return;

    try {
      setLogsLoading(true);
      const queryParams = new URLSearchParams();
      if (logFilter.status) queryParams.append('status', logFilter.status);
      if (logFilter.action) queryParams.append('action', logFilter.action);
      queryParams.append('page', logFilter.page);
      queryParams.append('limit', logFilter.limit);

      const response = await fetch(`${API_BASE_URL}/admin/audit-logs?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setLogs(data.logs);
        setLogPagination(data.pagination);
      } else if (response.status === 403) {
        navigate('/');
      } else {
        setLogsError('Failed to fetch audit logs');
      }
    } catch (err) {
      setLogsError('Failed to fetch audit logs');
      console.error('Error fetching audit logs:', err);
    } finally {
      setLogsLoading(false);
    }
  };

  // Helpers
  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'worker':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'failure':
        return 'bg-red-100 text-red-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionColor = (action) => {
    if (action.includes('FAILED') || action.includes('EXCEEDED') || action.includes('BLOCKED')) {
      return 'text-red-600';
    }
    if (action.includes('SUCCESS') || action.includes('UNBLOCKED') || action.includes('REACTIVATED')) {
      return 'text-green-600';
    }
    return 'text-blue-600';
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] px-4 sm:px-8 md:px-16 lg:px-24 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-text-primary tracking-tight">Admin Console</h1>
            <p className="text-text-secondary mt-1">
              Manage platform users, suspend/unblock accounts, and audit security events
            </p>
          </div>

          {/* Quick status pill */}
          {currentUser && (
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-border shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-medium text-text-secondary">
                Logged in as <strong className="text-text-primary">{currentUser.fullName}</strong> ({currentUser.email})
              </span>
            </div>
          )}
        </div>

        {/* Global Feedback Notifications */}
        {userSuccessMessage && (
          <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-800 px-5 py-4 rounded-xl mb-6 shadow-sm animate-fade-in">
            <svg className="w-5 h-5 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-sm font-medium">{userSuccessMessage}</p>
          </div>
        )}

        {userError && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl mb-6 shadow-sm">
            <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm font-medium">{userError}</p>
          </div>
        )}

        {/* Tabs Bar */}
        <div className="flex items-center border-b border-border mb-8 gap-2">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 pb-3 px-4 font-semibold text-sm transition-all border-b-2 ${activeTab === 'users'
                ? 'border-primary text-primary font-bold'
                : 'border-transparent text-text-secondary hover:text-text-primary hover:border-border'
              }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            User Management
            {userStats && (
              <span className="ml-1.5 px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary font-bold">
                {userStats.totalUsers}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('audit-logs')}
            className={`flex items-center gap-2 pb-3 px-4 font-semibold text-sm transition-all border-b-2 ${activeTab === 'audit-logs'
                ? 'border-primary text-primary font-bold'
                : 'border-transparent text-text-secondary hover:text-text-primary hover:border-border'
              }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Audit Logs & Security
            {stats && (
              <span className="ml-1.5 px-2 py-0.5 rounded-full text-xs bg-gray-100 text-text-secondary">
                {stats.totalLogs}
              </span>
            )}
          </button>
        </div>

        {/* ======================= TAB 1: USER MANAGEMENT ======================= */}
        {activeTab === 'users' && (
          <div>
            {/* User Statistics Cards */}
            {userStats && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                <div className="bg-white rounded-2xl shadow-sm border border-border p-6 hover-card">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">
                        Total Users
                      </p>
                      <p className="text-3xl font-extrabold text-text-primary">{userStats.totalUsers}</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-primary flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-xs text-text-secondary">
                    <span>{userStats.workerCount} workers</span> • <span>{userStats.clientCount} clients</span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-border p-6 hover-card">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">
                        Active Accounts
                      </p>
                      <p className="text-3xl font-extrabold text-emerald-600">{userStats.activeUsers}</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-emerald-700">Healthy standing accounts</p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-border p-6 hover-card">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">
                        Suspended / Blocked
                      </p>
                      <p className="text-3xl font-extrabold text-red-600">{userStats.blockedUsers}</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                      </svg>
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-red-600">Restricted from login & actions</p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-border p-6 hover-card">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">
                        Soft Deactivated
                      </p>
                      <p className="text-3xl font-extrabold text-slate-600">{userStats.inactiveUsers}</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-slate-500">Deactivated without hard delete</p>
                </div>
              </div>
            )}

            {/* Filter and Search Bar */}
            <div className="bg-white rounded-2xl shadow-sm border border-border p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                    Search Users
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search by full name or email..."
                      value={userFilter.search}
                      onChange={(e) =>
                        setUserFilter((prev) => ({ ...prev, search: e.target.value, page: 1 }))
                      }
                      className="w-full pl-10 pr-4 py-2.5 border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                    <svg
                      className="w-4 h-4 text-text-secondary absolute left-3.5 top-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>

                {/* Role Filter */}
                <div>
                  <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                    Role
                  </label>
                  <select
                    value={userFilter.role}
                    onChange={(e) =>
                      setUserFilter((prev) => ({ ...prev, role: e.target.value, page: 1 }))
                    }
                    className="w-full px-3.5 py-2.5 border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  >
                    <option value="">All Roles</option>
                    <option value="worker">Worker</option>
                    <option value="client">Client</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                    Account Status
                  </label>
                  <select
                    value={userFilter.status}
                    onChange={(e) =>
                      setUserFilter((prev) => ({ ...prev, status: e.target.value, page: 1 }))
                    }
                    className="w-full px-3.5 py-2.5 border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  >
                    <option value="">All Statuses</option>
                    <option value="active">Active Accounts</option>
                    <option value="blocked">Suspended / Blocked</option>
                    <option value="inactive">Soft Deactivated</option>
                  </select>
                </div>
              </div>

              {(userFilter.search || userFilter.role || userFilter.status) && (
                <div className="mt-4 flex items-center justify-between pt-4 border-t border-border/60">
                  <span className="text-xs text-text-secondary">
                    Active filters applied
                  </span>
                  <button
                    onClick={() => setUserFilter({ search: '', role: '', status: '', page: 1, limit: 10 })}
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>

            {/* Users Table Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-border p-6 mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                <div>
                  <h2 className="text-lg font-bold text-text-primary">Platform Users</h2>
                  <p className="text-xs text-text-secondary mt-0.5">
                    View account status and manage suspension or deactivation
                  </p>
                </div>
                <span className="text-xs font-medium px-3 py-1 bg-surface-light border border-border rounded-lg text-text-secondary">
                  Showing {users.length} of {userPagination.total} accounts
                </span>
              </div>

              {usersLoading ? (
                <div className="text-center py-16">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-3"></div>
                  <p className="text-sm text-text-secondary">Loading users...</p>
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-12 h-12 rounded-full bg-surface-light border border-border text-text-secondary flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-text-primary">No users found</h3>
                  <p className="text-xs text-text-secondary mt-1">Try adjusting your search criteria or filters</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border text-left">
                        <th className="py-3 px-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                          User Details
                        </th>
                        <th className="py-3 px-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                          Role
                        </th>
                        <th className="py-3 px-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                          Status
                        </th>
                        <th className="py-3 px-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                          Suspension Reason
                        </th>
                        <th className="py-3 px-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                          Registered
                        </th>
                        <th className="py-3 px-4 text-right text-xs font-semibold text-text-secondary uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {users.map((u) => {
                        const isSelf = currentUser && currentUser._id === u._id;
                        const isSuspended = u.isBlocked === true;
                        const isDeactivated = u.isActive === false;

                        return (
                          <tr key={u._id} className="hover:bg-surface-light/60 transition-colors">
                            {/* User Avatar + Name & Email */}
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20 text-primary font-bold flex items-center justify-center text-sm shadow-sm flex-shrink-0">
                                  {getInitials(u.fullName)}
                                </div>
                                <div>
                                  <div className="font-semibold text-text-primary text-sm flex items-center gap-1.5">
                                    {u.fullName}
                                    {isSelf && (
                                      <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-medium">
                                        You
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-xs text-text-secondary font-mono mt-0.5">
                                    {u.email}
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Role */}
                            <td className="py-4 px-4">
                              <span
                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize border ${getRoleBadge(
                                  u.role
                                )}`}
                              >
                                {u.role}
                              </span>
                            </td>

                            {/* Account Status Badge */}
                            <td className="py-4 px-4">
                              {isSuspended ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
                                  <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                                  Suspended
                                </span>
                              ) : isDeactivated ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                                  Deactivated
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                  Active
                                </span>
                              )}
                            </td>

                            {/* Reason */}
                            <td className="py-4 px-4 text-xs text-text-secondary max-w-xs">
                              {u.blockReason ? (
                                <span className="text-red-700 bg-red-50/70 px-2 py-1 rounded border border-red-100 block truncate" title={u.blockReason}>
                                  {u.blockReason}
                                </span>
                              ) : (
                                <span className="text-text-light">—</span>
                              )}
                            </td>

                            {/* Registered Date */}
                            <td className="py-4 px-4 text-xs text-text-secondary">
                              {new Date(u.createdAt).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </td>

                            {/* Action Buttons */}
                            <td className="py-4 px-4 text-right">
                              {isSelf ? (
                                <span className="text-xs text-text-light italic">
                                  Admin Protected
                                </span>
                              ) : (
                                <div className="inline-flex items-center gap-2">
                                  {/* Suspend / Unblock Toggle */}
                                  {isSuspended ? (
                                    <button
                                      onClick={() => handleUnblockUser(u)}
                                      className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100 transition-colors"
                                      title="Restore full account access"
                                    >
                                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                                      </svg>
                                      Unblock
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => openBlockModal(u)}
                                      className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-50 text-red-700 border border-red-300 hover:bg-red-100 transition-colors"
                                      title="Suspend this user account"
                                    >
                                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                      </svg>
                                      Suspend
                                    </button>
                                  )}

                                  {/* Soft Deactivate Button */}
                                  <button
                                    onClick={() => openDeactivateModal(u)}
                                    className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg border transition-colors ${isDeactivated
                                        ? 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                                        : 'bg-white text-text-secondary border-border hover:bg-surface-light hover:text-red-700'
                                      }`}
                                    title={isDeactivated ? 'Reactivate account' : 'Soft deactivate account'}
                                  >
                                    {isDeactivated ? 'Reactivate' : 'Deactivate'}
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination Controls */}
              {userPagination.pages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                  <button
                    onClick={() =>
                      setUserFilter((prev) => ({ ...prev, page: prev.page - 1 }))
                    }
                    disabled={!userPagination.hasPrev}
                    className="px-4 py-2 rounded-xl border border-border text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface-light transition-all"
                  >
                    Previous
                  </button>
                  <span className="text-xs text-text-secondary">
                    Page <strong className="text-text-primary">{userPagination.page}</strong> of{' '}
                    <strong>{userPagination.pages}</strong>
                  </span>
                  <button
                    onClick={() =>
                      setUserFilter((prev) => ({ ...prev, page: prev.page + 1 }))
                    }
                    disabled={!userPagination.hasNext}
                    className="px-4 py-2 rounded-xl border border-border text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface-light transition-all"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======================= TAB 2: AUDIT LOGS ======================= */}
        {activeTab === 'audit-logs' && (
          <div>
            {logsError && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-5 py-4 rounded-xl mb-8">
                {logsError}
              </div>
            )}

            {/* Audit Log Stats Cards */}
            {stats && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-2xl shadow-sm border border-border p-6 hover-card">
                  <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                    Total Audit Logs
                  </h3>
                  <p className="text-4xl font-extrabold text-primary">{stats.totalLogs}</p>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-border p-6 hover-card">
                  <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                    Successful Events
                  </h3>
                  <p className="text-4xl font-extrabold text-emerald-600">
                    {stats.statusStats.find((s) => s._id === 'success')?.count || 0}
                  </p>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-border p-6 hover-card">
                  <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                    Failed Events
                  </h3>
                  <p className="text-4xl font-extrabold text-red-600">
                    {stats.statusStats.find((s) => s._id === 'failure')?.count || 0}
                  </p>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-border p-6 hover-card">
                  <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                    Warnings / Suspensions
                  </h3>
                  <p className="text-4xl font-extrabold text-amber-600">
                    {stats.statusStats.find((s) => s._id === 'warning')?.count || 0}
                  </p>
                </div>
              </div>
            )}

            {/* Audit Log Filters */}
            <div className="bg-white rounded-2xl shadow-sm border border-border p-6 mb-8">
              <h2 className="text-lg font-bold text-text-primary mb-4">Filter Audit Logs</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                    Status
                  </label>
                  <select
                    value={logFilter.status}
                    onChange={(e) =>
                      setLogFilter((prev) => ({ ...prev, status: e.target.value, page: 1 }))
                    }
                    className="w-full px-3.5 py-2.5 border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  >
                    <option value="">All Statuses</option>
                    <option value="success">Success</option>
                    <option value="failure">Failure</option>
                    <option value="warning">Warning</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                    Action
                  </label>
                  <select
                    value={logFilter.action}
                    onChange={(e) =>
                      setLogFilter((prev) => ({ ...prev, action: e.target.value, page: 1 }))
                    }
                    className="w-full px-3.5 py-2.5 border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  >
                    <option value="">All Actions</option>
                    <option value="ACCOUNT_BLOCKED">Account Blocked</option>
                    <option value="ACCOUNT_UNBLOCKED">Account Unblocked</option>
                    <option value="ACCOUNT_DEACTIVATED">Account Deactivated</option>
                    <option value="ACCOUNT_REACTIVATED">Account Reactivated</option>
                    <option value="LOGIN_SUCCESS">Login Success</option>
                    <option value="LOGIN_FAILED">Login Failed</option>
                    <option value="USER_REGISTERED">User Registered</option>
                    <option value="LOGOUT">Logout</option>
                    <option value="RATE_LIMIT_EXCEEDED">Rate Limit Exceeded</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => setLogFilter({ status: '', action: '', page: 1, limit: 20 })}
                    className="w-full bg-surface-light border border-border text-text-primary py-2.5 px-4 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Logs Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-border p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-text-primary">Recorded Security Logs</h2>
                <span className="text-xs font-medium px-3 py-1 bg-surface-light border border-border rounded-lg text-text-secondary">
                  Showing {logs.length} of {logPagination.total} logs
                </span>
              </div>

              {logsLoading ? (
                <div className="text-center py-16">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-3"></div>
                  <p className="text-sm text-text-secondary">Loading audit logs...</p>
                </div>
              ) : logs.length === 0 ? (
                <p className="text-text-secondary text-center py-12">No audit logs found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border text-left">
                        <th className="py-3 px-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                          Timestamp
                        </th>
                        <th className="py-3 px-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                          Action
                        </th>
                        <th className="py-3 px-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                          Status
                        </th>
                        <th className="py-3 px-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                          User
                        </th>
                        <th className="py-3 px-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                          IP Address
                        </th>
                        <th className="py-3 px-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                          Details
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {logs.map((log) => (
                        <tr key={log._id} className="hover:bg-surface-light/60 transition-colors">
                          <td className="py-3.5 px-4 text-xs text-text-secondary font-mono">
                            {new Date(log.timestamp).toLocaleString()}
                          </td>
                          <td className="py-3.5 px-4 text-xs font-bold">
                            <span className={getActionColor(log.action)}>
                              {log.action.replace(/_/g, ' ')}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                                log.status
                              )}`}
                            >
                              {log.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-xs text-text-secondary">
                            {log.userId ? (
                              <div>
                                <div className="font-semibold text-text-primary">
                                  {log.userId.fullName}
                                </div>
                                <div className="text-[11px] text-text-light font-mono">
                                  {log.userId.email}
                                </div>
                              </div>
                            ) : (
                              <span className="text-text-light italic">Anonymous / System</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-xs text-text-secondary font-mono">
                            {log.ipAddress || 'N/A'}
                          </td>
                          <td className="py-3.5 px-4 text-xs text-text-secondary">
                            <div className="max-w-xs overflow-hidden">
                              {log.details && typeof log.details === 'object' ? (
                                <div className="space-y-0.5">
                                  {Object.entries(log.details).map(([key, value]) => (
                                    <div key={key} className="truncate">
                                      <span className="font-medium text-text-primary">{key}:</span>{' '}
                                      <span className="text-text-secondary">
                                        {typeof value === 'string' ? value : JSON.stringify(value)}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-text-light italic">No details</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Log Pagination */}
              {logPagination.pages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                  <button
                    onClick={() =>
                      setLogFilter((prev) => ({ ...prev, page: prev.page - 1 }))
                    }
                    disabled={!logPagination.hasPrev}
                    className="px-4 py-2 rounded-xl border border-border text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface-light transition-all"
                  >
                    Previous
                  </button>
                  <span className="text-xs text-text-secondary">
                    Page <strong className="text-text-primary">{logPagination.page}</strong> of{' '}
                    <strong>{logPagination.pages}</strong>
                  </span>
                  <button
                    onClick={() =>
                      setLogFilter((prev) => ({ ...prev, page: prev.page + 1 }))
                    }
                    disabled={!logPagination.hasNext}
                    className="px-4 py-2 rounded-xl border border-border text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface-light transition-all"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>

            {/* Action Statistics Breakdown */}
            {stats && stats.actionStats.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-border p-6">
                <h2 className="text-lg font-bold text-text-primary mb-4">Event Types Breakdown</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {stats.actionStats.map((stat) => (
                    <div key={stat._id} className="bg-surface-light/80 rounded-xl p-4 border border-border/50">
                      <div className="text-xs text-text-secondary mb-1 truncate" title={stat._id}>
                        {stat._id.replace(/_/g, ' ')}
                      </div>
                      <div className="text-2xl font-bold text-primary">{stat.count}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================= SUSPENSION / BLOCK MODAL ======================= */}
        {blockModalOpen && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl border border-border max-w-md w-full p-6 relative">
              <div className="flex items-center gap-3 text-red-600 mb-4">
                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text-primary">Suspend User Account</h3>
                  <p className="text-xs text-text-secondary">
                    Block {selectedUser.fullName} ({selectedUser.email})
                  </p>
                </div>
              </div>

              <p className="text-sm text-text-secondary mb-4 leading-relaxed">
                Suspending this account will immediately revoke access and prevent login. Please specify a reason for this administrative action:
              </p>

              {/* Preset Reasons */}
              <div className="space-y-2 mb-4">
                {[
                  'Violation of Terms of Service',
                  'Spam or Fraudulent Activity',
                  'Multiple Client Complaints',
                  'Inappropriate Behavior / Harassment',
                  'Custom',
                ].map((reason) => (
                  <label
                    key={reason}
                    className={`flex items-center gap-3 p-2.5 rounded-xl border text-xs font-medium cursor-pointer transition-colors ${suspensionReason === reason
                        ? 'border-red-400 bg-red-50/50 text-red-900'
                        : 'border-border hover:bg-surface-light text-text-primary'
                      }`}
                  >
                    <input
                      type="radio"
                      name="suspensionReason"
                      value={reason}
                      checked={suspensionReason === reason}
                      onChange={(e) => setSuspensionReason(e.target.value)}
                      className="text-red-600 focus:ring-red-500"
                    />
                    <span>{reason === 'Custom' ? 'Enter a custom reason...' : reason}</span>
                  </label>
                ))}
              </div>

              {/* Custom Reason Textarea */}
              {suspensionReason === 'Custom' && (
                <div className="mb-4">
                  <textarea
                    rows="3"
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    placeholder="Provide detailed reason for suspending this user..."
                    className="w-full px-3 py-2 border border-border rounded-xl text-xs focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  ></textarea>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 mt-6">
                <button
                  onClick={closeBlockModal}
                  disabled={isSubmittingBlock}
                  className="px-4 py-2 rounded-xl border border-border text-xs font-semibold text-text-secondary hover:bg-surface-light transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBlockUser}
                  disabled={isSubmittingBlock}
                  className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSubmittingBlock ? (
                    <>
                      <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Suspending...
                    </>
                  ) : (
                    'Confirm Suspension'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ======================= SOFT DEACTIVATION MODAL ======================= */}
        {deactivateModalOpen && selectedUserForDeactivate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl border border-border max-w-md w-full p-6 relative">
              <div className="flex items-center gap-3 text-slate-700 mb-4">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text-primary">
                    {selectedUserForDeactivate.isActive ? 'Soft Deactivate Account' : 'Reactivate Account'}
                  </h3>
                  <p className="text-xs text-text-secondary">
                    {selectedUserForDeactivate.fullName} ({selectedUserForDeactivate.email})
                  </p>
                </div>
              </div>

              <div className="text-sm text-text-secondary mb-4 leading-relaxed space-y-2">
                <p>
                  {selectedUserForDeactivate.isActive
                    ? 'Account soft deactivation preserves all historical reviews, jobs, and audit trails while disabling future access.'
                    : 'Reactivating this account will restore access and enable normal platform activity.'}
                </p>
                <p className="text-xs text-text-light">
                  (Preferred over permanent deletion to maintain data integrity and compliance).
                </p>
              </div>

              {selectedUserForDeactivate.isActive && (
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                    Deactivation Reason (Optional)
                  </label>
                  <input
                    type="text"
                    value={deactivateReason}
                    onChange={(e) => setDeactivateReason(e.target.value)}
                    placeholder="e.g., Requested by user, inactive account"
                    className="w-full px-3 py-2 border border-border rounded-xl text-xs focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 mt-6">
                <button
                  onClick={closeDeactivateModal}
                  disabled={isSubmittingDeactivate}
                  className="px-4 py-2 rounded-xl border border-border text-xs font-semibold text-text-secondary hover:bg-surface-light transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeactivateUser}
                  disabled={isSubmittingDeactivate}
                  className={`px-4 py-2 rounded-xl text-white text-xs font-semibold transition-colors shadow-sm disabled:opacity-50 flex items-center gap-1.5 ${selectedUserForDeactivate.isActive
                      ? 'bg-slate-700 hover:bg-slate-800'
                      : 'bg-emerald-600 hover:bg-emerald-700'
                    }`}
                >
                  {isSubmittingDeactivate ? (
                    <>
                      <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Processing...
                    </>
                  ) : selectedUserForDeactivate.isActive ? (
                    'Confirm Deactivation'
                  ) : (
                    'Confirm Reactivation'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
