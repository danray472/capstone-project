import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const WorkerJobRequestsPage = () => {
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
      
      // First fetch the worker's profile to get the userId
      const profileResponse = await fetch('http://localhost:5000/api/profiles/me', {
        headers: {
          'Authorization': `Bearer ${userInfo.token}`,
        },
      });
      if (!profileResponse.ok) {
        setError('Failed to load worker profile');
        setLoading(false);
        return;
      }
      
      const profileData = await profileResponse.json();
      
      // Then fetch job requests using the userId (not profile._id)
      const response = await fetch(`http://localhost:5000/api/requests/worker/${profileData.userId}`, {
        headers: {
          'Authorization': `Bearer ${userInfo.token}`,
        },
      });

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
        fetchRequests();
      } else {
        setError('Failed to update status');
      }
    } catch (err) {
      setError('Failed to update status');
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
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary mb-3">Job Requests</h1>
          <p className="text-base sm:text-lg text-text-secondary">Manage incoming job requests from clients</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 sm:px-5 sm:py-4 rounded-xl mb-8 sm:mb-10 text-sm">
            {error}
          </div>
        )}

        {requests.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border border-border p-8 sm:p-12 md:p-16 text-center">
            <p className="text-text-secondary text-base sm:text-lg">No job requests yet.</p>
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
                    
                    {/* Location with Google Maps link */}
                    <div className="mb-3">
                      <p className="text-xs sm:text-sm text-text-secondary mb-1">📍 {request.location}</p>
                      {request.locationCoordinates && request.locationCoordinates.lat && request.locationCoordinates.lng && (
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${request.locationCoordinates.lat},${request.locationCoordinates.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-primary hover:text-primary-dark text-xs sm:text-sm font-medium"
                        >
                          <span>🗺️</span> Open in Google Maps
                        </a>
                      )}
                    </div>

                    {/* Client Contact Information */}
                    {request.clientContact && (request.clientContact.name || request.clientContact.email || request.clientContact.phone) && (
                      <div className="bg-surface-light/50 rounded-lg p-3 sm:p-4 mt-3">
                        <h4 className="text-xs sm:text-sm font-semibold text-text-primary mb-2">Client Contact Information</h4>
                        {request.clientContact.name && (
                          <p className="text-xs sm:text-sm text-text-secondary mb-1">
                            <span className="font-medium">Name:</span> {request.clientContact.name}
                          </p>
                        )}
                        {request.clientContact.email && (
                          <p className="text-xs sm:text-sm text-text-secondary mb-1">
                            <span className="font-medium">Email:</span> 
                            <a href={`mailto:${request.clientContact.email}`} className="text-primary hover:underline ml-1">
                              {request.clientContact.email}
                            </a>
                          </p>
                        )}
                        {request.clientContact.phone && (
                          <p className="text-xs sm:text-sm text-text-secondary">
                            <span className="font-medium">Phone:</span> 
                            <a href={`tel:${request.clientContact.phone}`} className="text-primary hover:underline ml-1">
                              {request.clientContact.phone}
                            </a>
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {request.status === 'pending' && (
                  <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-5 pt-4 sm:pt-5 border-t border-border">
                    <button
                      onClick={() => handleStatusUpdate(request._id, 'accepted')}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors text-xs sm:text-sm"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(request._id, 'rejected')}
                      className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors text-xs sm:text-sm"
                    >
                      Reject
                    </button>
                  </div>
                )}

                {request.status === 'accepted' && (
                  <div className="flex gap-3 mt-4 sm:mt-5 pt-4 sm:pt-5 border-t border-border">
                    <button
                      onClick={() => handleStatusUpdate(request._id, 'completed')}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors text-xs sm:text-sm"
                    >
                      Mark as Completed
                    </button>
                  </div>
                )}

                {request.status === 'completed' && reviews[request._id] && (
                  <div className="mt-4 sm:mt-5 pt-4 sm:pt-5 border-t border-border">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-yellow-500 text-base sm:text-lg">
                          {'★'.repeat(reviews[request._id].rating)}
                          {'☆'.repeat(5 - reviews[request._id].rating)}
                        </span>
                        <span className="text-xs sm:text-sm text-text-secondary">
                          Client Review
                        </span>
                      </div>
                      <p className="text-text-secondary text-sm sm:text-base">{reviews[request._id].comment}</p>
                    </div>
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

export default WorkerJobRequestsPage;
