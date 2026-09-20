import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../services/api';
import hairdresserImage from '../assets/hairdresser.jpg';

const ClientDashboardPage = () => {
  const [profile, setProfile] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (!userInfo) {
        navigate('/login');
        return;
      }

      setLoading(true);

      // Fetch client's job requests
      const requestsResponse = await fetch(`${API_BASE_URL}/requests/client/${userInfo._id}`);
      if (requestsResponse.ok) {
        const requestsData = await requestsResponse.json();
        setRequests(requestsData);
      }

      setLoading(false);
    } catch (err) {
      setError('Failed to load dashboard data');
      setLoading(false);
    }
  };

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const acceptedRequests = requests.filter(r => r.status === 'accepted');
  const completedRequests = requests.filter(r => r.status === 'completed');
  const rejectedRequests = requests.filter(r => r.status === 'rejected');
  const cancelledRequests = requests.filter(r => r.status === 'cancelled');

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-text-secondary">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={hairdresserImage}
          alt="Dashboard Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/60 to-black/80"></div>
      </div>

      <div className="relative px-8 sm:px-16 md:px-24 lg:px-40 py-12 sm:py-20 md:py-24">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <h1 className="text-5xl font-bold text-white mb-3">Client Dashboard</h1>
            <p className="text-lg text-white/90">Manage your job requests and activity</p>
          </div>

        {error && (
          <div className="bg-red-500/20 backdrop-blur-sm border border-red-400/30 text-white px-5 py-4 rounded-xl mb-10">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg border border-white/30 p-8 hover-card">
            <h3 className="text-lg font-semibold text-white mb-3">Total Requests</h3>
            <p className="text-5xl font-bold text-white">{requests.length}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg border border-white/30 p-8 hover-card">
            <h3 className="text-lg font-semibold text-white mb-3">Pending</h3>
            <p className="text-5xl font-bold text-yellow-300">{pendingRequests.length}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg border border-white/30 p-8 hover-card">
            <h3 className="text-lg font-semibold text-white mb-3">Accepted</h3>
            <p className="text-5xl font-bold text-green-300">{acceptedRequests.length}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg border border-white/30 p-8 hover-card">
            <h3 className="text-lg font-semibold text-white mb-3">Completed</h3>
            <p className="text-5xl font-bold text-blue-300">{completedRequests.length}</p>
          </div>
        </div>

        {/* Job Requests Section */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg border border-white/30 p-10 mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Job Requests</h2>

          {requests.length === 0 ? (
            <p className="text-white/80">No job requests yet.</p>
          ) : (
            <div className="space-y-6">
              {requests.map((request) => (
                <div
                  key={request._id}
                  className="border border-white/30 rounded-xl p-8 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                        <span className="text-sm text-white/80">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-white/90 mb-2">{request.description}</p>
                      <p className="text-sm text-white/80">📍 {request.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg border border-white/30 p-10">
          <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              onClick={() => navigate('/workers')}
              className="bg-white text-primary py-3 px-6 rounded-lg font-medium hover:bg-surface-light transition-colors"
            >
              Find Workers
            </button>
            <button
              onClick={() => navigate('/jobs/my')}
              className="border-2 border-white/50 text-white py-3 px-6 rounded-lg font-medium hover:shadow-lg transition-shadow"
            >
              View All Jobs
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default ClientDashboardPage;
