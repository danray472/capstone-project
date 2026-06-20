import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API_BASE_URL from '../services/api';

const ViewProfilePage = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        
        let url;
        if (id === 'me') {
          url = `${API_BASE_URL}/profiles/me`;
        } else {
          url = `${API_BASE_URL}/profiles/${id}`;
        }

        const headers = {};

        if (userInfo && id === 'me') {
          headers['Authorization'] = `Bearer ${userInfo.token}`;
        }

        const response = await fetch(url, { headers });

        if (response.ok) {
          const data = await response.json();
          setProfile(data);
          
          // Fetch reviews for this worker
          if (data._id) {
            const reviewsResponse = await fetch(`${API_BASE_URL}/reviews/worker/${data._id}`);
            if (reviewsResponse.ok) {
              const reviewsData = await reviewsResponse.json();
              setReviews(reviewsData);
            }
          }
        } else {
          setError('Profile not found');
        }
      } catch (err) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-text-secondary">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    // If viewing own profile and it doesn't exist, show create profile button
    if (id === 'me' && error === 'Profile not found') {
      return (
        <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] px-8 sm:px-16 md:px-24 lg:px-40 py-12 sm:py-20 md:py-24">
          <div className="w-full max-w-4xl">
            <div className="bg-white rounded-2xl shadow-lg border border-border p-12 text-center">
              <h1 className="text-3xl font-bold text-text-primary mb-4">You don't have a profile yet</h1>
              <p className="text-text-secondary mb-8">Create your worker profile to start receiving job requests</p>
              <button
                onClick={() => navigate('/profile/create')}
                className="bg-primary text-white py-3 px-8 rounded-lg font-medium hover:bg-primary-hover transition-colors"
              >
                Create Profile
              </button>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Profile not found'}</p>
          <button
            onClick={() => navigate(-1)}
            className="text-primary hover:underline"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] px-4 sm:px-8 md:px-16 lg:px-24 py-8 sm:py-12 md:py-16">
      <div className="w-full max-w-4xl">
        <div className="bg-white rounded-2xl shadow-lg border border-border p-6 sm:p-8 md:p-12">
          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row items-start gap-6 sm:gap-8 mb-8 sm:mb-12">
            {profile.profilePhoto ? (
              <img
                src={profile.profilePhoto}
                alt={profile.userData?.fullName || 'Profile'}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-border mx-auto sm:mx-0"
              />
            ) : (
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-primary/10 flex items-center justify-center border-4 border-border mx-auto sm:mx-0">
                <span className="text-3xl sm:text-4xl font-bold text-primary">
                  {profile.userData?.fullName?.charAt(0) || 'W'}
                </span>
              </div>
            )}
            
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-2">
                {profile.userData?.fullName || 'Unknown'}
              </h1>
              <p className="text-lg sm:text-xl text-primary font-medium mb-3">
                {profile.profession}
              </p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-3 text-sm text-text-secondary mb-3">
                <span className="flex items-center gap-2">
                  📍 {profile.location}
                </span>
                <span className="flex items-center gap-2">
                  📞 {profile.phone}
                </span>
                <span className="flex items-center gap-2">
                  💼 {profile.experience} {profile.experience === 1 ? 'year' : 'years'} experience
                </span>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-3 text-sm">
                <span className="text-yellow-400 text-lg sm:text-xl">
                  {'★'.repeat(Math.round(profile.averageRating || 0))}
                  {'☆'.repeat(5 - Math.round(profile.averageRating || 0))}
                </span>
                <span className="text-text-secondary">
                  {profile.averageRating || 0} ({profile.totalReviews || 0} {profile.totalReviews === 1 ? 'review' : 'reviews'})
                </span>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-semibold text-text-primary mb-3">About</h2>
            <p className="text-text-secondary leading-relaxed text-base sm:text-lg">
              {profile.bio}
            </p>
          </div>

          {/* Skills */}
          {profile.skills && profile.skills.length > 0 && (
            <div className="mb-6 sm:mb-8">
              <h2 className="text-lg sm:text-xl font-semibold text-text-primary mb-4">Skills</h2>
              <div className="flex flex-wrap gap-2 sm:gap-3 justify-center sm:justify-start">
                {profile.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 sm:px-4 py-2 bg-primary/10 text-primary rounded-full text-xs sm:text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Reviews */}
          {reviews.length > 0 && (
            <div className="mb-6 sm:mb-8">
              <h2 className="text-lg sm:text-xl font-semibold text-text-primary mb-4">Reviews</h2>
              <div className="space-y-4 sm:space-y-5">
                {reviews.map((review) => (
                  <div key={review._id} className="bg-surface rounded-xl p-4 sm:p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-yellow-400 text-base sm:text-lg">
                        {'★'.repeat(review.rating)}
                        {'☆'.repeat(5 - review.rating)}
                      </span>
                      <span className="text-xs sm:text-sm text-text-secondary">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-text-secondary text-sm sm:text-base">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6 border-t border-border">
            {id !== 'me' && (
              <>
                <button
                  onClick={() => navigate(`/jobs/create?workerId=${profile.userId}`)}
                  className="w-full sm:flex-1 bg-primary text-white py-3 px-4 sm:px-5 rounded-lg font-medium hover:bg-primary-hover transition-colors text-sm sm:text-base"
                >
                  Request Job
                </button>
                <button
                  onClick={() => navigate(`/reviews/leave?workerId=${profile._id}`)}
                  className="w-full sm:flex-1 border-2 border-border text-text-primary py-3 px-4 sm:px-5 rounded-lg font-medium hover:bg-surface-light transition-colors text-sm sm:text-base"
                >
                  Leave Review
                </button>
              </>
            )}
            {id === 'me' && (
              <button
                onClick={() => navigate('/profile/create')}
                className="w-full sm:flex-1 bg-primary text-white py-3 px-4 sm:px-5 rounded-lg font-medium hover:bg-primary-hover transition-colors text-sm sm:text-base"
              >
                Edit Profile
              </button>
            )}
            <button
              onClick={() => navigate(-1)}
              className="w-full sm:flex-1 border-2 border-border text-text-primary py-3 px-4 sm:px-5 rounded-lg font-medium hover:bg-surface-light transition-colors text-sm sm:text-base"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProfilePage;
