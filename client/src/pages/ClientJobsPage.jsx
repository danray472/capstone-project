import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ClientJobsPage = () => {
  const [requests, setRequests] = useState([]);
  const [reviews, setReviews] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (!userInfo) {
        navigate('/login');
        return;
      }

      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/requests/client/${userInfo._id}`);

      if (response.ok) {
        const data = await response.json();
        setRequests(data);

        // Fetch reviews for completed jobs
        const completedJobs = data.filter(r => r.status === 'completed');
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
      } else {
        setError('Failed to load job requests');
      }
    } catch (err) {
      setError('Failed to load job requests');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRequest = async (requestId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/requests/${requestId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'cancelled' }),
      });

      if (response.ok) {
        fetchRequests();
      } else {
        setError('Failed to cancel request');
      }
    } catch (err) {
      setError('Failed to cancel request');
    }
  };

  const handleMarkComplete = async (requestId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/requests/${requestId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'completed' }),
      });

      if (response.ok) {
        fetchRequests();
      } else {
        setError('Failed to mark job as completed');
      }
    } catch (err) {
      setError('Failed to mark job as completed');
    }
  };

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
          <p className="mt-4 text-text-secondary">Loading job requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] px-4 sm:px-8 md:px-16 lg:px-24 py-8 sm:py-12 md:py-16">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary mb-3">My Job Requests</h1>
          <p className="text-base sm:text-lg text-text-secondary">View and manage your job requests</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 sm:px-5 sm:py-4 rounded-xl mb-8 sm:mb-10 text-sm">
            {error}
          </div>
        )}

        {requests.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border border-border p-8 sm:p-12 md:p-16 text-center">
            <p className="text-text-secondary text-base sm:text-lg mb-6">No job requests yet.</p>
            <button
              onClick={() => navigate('/workers')}
              className="bg-primary text-white py-3 px-6 sm:py-4 sm:px-8 rounded-xl font-medium hover:bg-primary-hover transition-colors text-sm sm:text-base"
            >
              Find Workers
            </button>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {requests.map((request) => (
              <div
                key={request._id}
                className="bg-white rounded-2xl shadow-lg border border-border p-4 sm:p-6 md:p-10 hover-card"
              >
                <div className="flex flex-col sm:flex-row items-start justify-between mb-4 sm:mb-6 gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
                      <span className={`px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(request.status)}`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                      <span className="text-xs sm:text-sm text-text-secondary">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-text-secondary mb-2 text-sm sm:text-base">{request.description}</p>
                    <p className="text-xs sm:text-sm text-text-secondary">📍 {request.location}</p>
                  </div>
                </div>

                {request.status === 'pending' && (
                  <div className="flex gap-3 mt-4 sm:mt-5 pt-4 sm:pt-5 border-t border-border">
                    <button
                      onClick={() => handleCancelRequest(request._id)}
                      className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors text-xs sm:text-sm"
                    >
                      Cancel Request
                    </button>
                  </div>
                )}

                {request.status === 'accepted' && (
                  <div className="flex gap-3 mt-4 sm:mt-5 pt-4 sm:pt-5 border-t border-border">
                    <button
                      onClick={() => handleMarkComplete(request._id)}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors text-xs sm:text-sm"
                    >
                      Mark as Completed
                    </button>
                  </div>
                )}

                {request.status === 'rejected' && (
                  <div className="mt-4 sm:mt-5 pt-4 sm:pt-5 border-t border-border">
                    <p className="text-red-600 font-medium text-sm sm:text-base">Worker has declined your request.</p>
                  </div>
                )}

                {request.status === 'completed' && (
                  <div className="mt-4 sm:mt-5 pt-4 sm:pt-5 border-t border-border">
                    {reviews[request._id] ? (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-yellow-500 text-base sm:text-lg">
                            {'★'.repeat(reviews[request._id].rating)}
                            {'☆'.repeat(5 - reviews[request._id].rating)}
                          </span>
                          <span className="text-xs sm:text-sm text-text-secondary">
                            Your Review
                          </span>
                        </div>
                        <p className="text-text-secondary text-sm sm:text-base">{reviews[request._id].comment}</p>
                      </div>
                    ) : (
                      <button
                        onClick={async () => {
                          // Fetch worker profile to get profile._id
                          try {
                            const response = await fetch(`http://localhost:5000/api/profiles`);
                            if (response.ok) {
                              const profiles = await response.json();
                              const workerProfile = profiles.find(p => p.userId === request.workerId);
                              if (workerProfile) {
                                navigate(`/reviews/leave?workerId=${workerProfile._id}&jobRequestId=${request._id}`);
                              } else {
                                setError('Worker profile not found');
                              }
                            }
                          } catch (err) {
                            setError('Failed to load worker profile');
                          }
                        }}
                        className="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-yellow-700 transition-colors text-xs sm:text-sm"
                      >
                        Rate & Review Worker
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientJobsPage;
