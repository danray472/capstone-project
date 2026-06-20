import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const WorkerDashboardPage = () => {
  const [profile, setProfile] = useState(null);
  const [requests, setRequests] = useState([]);
  const [reviews, setReviews] = useState({});
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

      // Fetch worker's profile
      const profileResponse = await fetch('http://localhost:5000/api/profiles/me', {
        headers: {
          'Authorization': `Bearer ${userInfo.token}`,
        },
      });
      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        setProfile(profileData);

        // Fetch worker's job requests using userId (not profile._id)
        const requestsResponse = await fetch(`http://localhost:5000/api/requests/worker/${profileData.userId}`, {
          headers: {
            'Authorization': `Bearer ${userInfo.token}`,
          },
        });
        if (requestsResponse.ok) {
          const requestsData = await requestsResponse.json();
          setRequests(requestsData);

          // Fetch reviews for completed jobs
          const completedJobs = requestsData.filter(r => r.status === 'completed');
          const reviewPromises = completedJobs.map(job =>
            fetch(`http://localhost:5000/api/reviews/job/${job._id}`).then(res => res.ok ? res.json() : null)
          );
          const reviewResults = await Promise.all(reviewPromises);
          const reviewsMap = {};
          completedJobs.forEach((job, index) => {
            if (reviewResults[index]) {
              reviewsMap[job._id] = reviewResults[index];
            }
          });
          setReviews(reviewsMap);
        }
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

  const handleStatusUpdate = async (requestId, newStatus) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const response = await fetch(`http://localhost:5000/api/requests/${requestId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchData();
      } else {
        setError('Failed to update status');
      }
    } catch (err) {
      setError('Failed to update status');
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
    <div className="min-h-[calc(100vh-8rem)] px-8 sm:px-16 md:px-24 lg:px-40 py-12 sm:py-20 md:py-24">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-text-primary mb-3">Worker Dashboard</h1>
          <p className="text-lg text-text-secondary">Manage your profile and job requests</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-5 py-4 rounded-xl mb-10">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="bg-white rounded-2xl shadow-lg border border-border p-8 hover-card">
            <h3 className="text-lg font-semibold text-text-primary mb-3">Total Requests</h3>
            <p className="text-5xl font-bold text-primary">{requests.length}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-border p-8 hover-card">
            <h3 className="text-lg font-semibold text-text-primary mb-3">Pending</h3>
            <p className="text-5xl font-bold text-yellow-600">{pendingRequests.length}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-border p-8 hover-card">
            <h3 className="text-lg font-semibold text-text-primary mb-3">Accepted</h3>
            <p className="text-5xl font-bold text-green-600">{acceptedRequests.length}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-border p-8 hover-card">
            <h3 className="text-lg font-semibold text-text-primary mb-3">Completed</h3>
            <p className="text-5xl font-bold text-blue-600">{completedRequests.length}</p>
          </div>
        </div>

        {/* Profile Summary */}
        {profile && (
          <div className="bg-white rounded-2xl shadow-lg border border-border p-10 mb-12 hover-card">
            <h2 className="text-2xl font-bold text-text-primary mb-6">Profile Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <p className="text-sm text-text-secondary mb-2">Profession</p>
                <p className="text-lg font-semibold text-text-primary">{profile.profession}</p>
              </div>
              <div>
                <p className="text-sm text-text-secondary mb-2">Location</p>
                <p className="text-lg font-semibold text-text-primary">{profile.location}</p>
              </div>
              <div>
                <p className="text-sm text-text-secondary mb-2">Experience</p>
                <p className="text-lg font-semibold text-text-primary">{profile.experience} years</p>
              </div>
              <div>
                <p className="text-sm text-text-secondary mb-2">Rating</p>
                <p className="text-lg font-semibold text-text-primary">
                  {profile.averageRating > 0 ? `${profile.averageRating} ⭐` : 'No ratings yet'}
                </p>
              </div>
              <div>
                <p className="text-sm text-text-secondary mb-2">Total Reviews</p>
                <p className="text-lg font-semibold text-text-primary">{profile.totalReviews}</p>
              </div>
            </div>
          </div>
        )}

        {/* Job Requests Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-border p-10 mb-12">
          <h2 className="text-2xl font-bold text-text-primary mb-6">Job Requests</h2>

          {requests.length === 0 ? (
            <p className="text-text-secondary">No job requests yet.</p>
          ) : (
            <div className="space-y-6">
              {requests.map((request) => (
                <div
                  key={request._id}
                  className="border border-border rounded-xl p-8 hover:bg-surface-light transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                        <span className="text-sm text-text-secondary">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-text-secondary mb-2">{request.description}</p>
                      <p className="text-sm text-text-secondary">📍 {request.location}</p>
                    </div>
                  </div>

                  {request.status === 'pending' && (
                    <div className="flex gap-3 mt-5 pt-5 border-t border-border">
                      <button
                        onClick={() => handleStatusUpdate(request._id, 'accepted')}
                        className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors text-sm"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(request._id, 'rejected')}
                        className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors text-sm"
                      >
                        Reject
                      </button>
                    </div>
                  )}

                  {request.status === 'accepted' && (
                    <div className="flex gap-3 mt-5 pt-5 border-t border-border">
                      <button
                        onClick={() => handleStatusUpdate(request._id, 'completed')}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
                      >
                        Mark as Completed
                      </button>
                    </div>
                  )}

                  {request.status === 'completed' && reviews[request._id] && (
                    <div className="mt-5 pt-5 border-t border-border">
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-yellow-500 text-lg">
                            {'★'.repeat(reviews[request._id].rating)}
                            {'☆'.repeat(5 - reviews[request._id].rating)}
                          </span>
                          <span className="text-sm text-text-secondary">
                            Client Review
                          </span>
                        </div>
                        <p className="text-text-secondary">{reviews[request._id].comment}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-lg border border-border p-10">
          <h2 className="text-2xl font-bold text-text-primary mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              onClick={() => navigate('/profile/me')}
              className="bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-hover transition-colors"
            >
              View Profile
            </button>
            <button
              onClick={() => navigate('/jobs/worker')}
              className="border-2 border-border text-text-primary py-3 px-6 rounded-lg font-medium hover:bg-surface-light transition-colors"
            >
              View All Requests
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerDashboardPage;
