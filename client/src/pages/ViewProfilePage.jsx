import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ViewProfilePage = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const url = id === 'me' 
          ? 'http://localhost:5000/api/profiles/me'
          : `http://localhost:5000/api/profiles/${id}`;

        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const headers = {
          'Content-Type': 'application/json',
        };

        if (userInfo && id === 'me') {
          headers['Authorization'] = `Bearer ${userInfo.token}`;
        }

        const response = await fetch(url, { headers });

        if (response.ok) {
          const data = await response.json();
          setProfile(data);
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
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] px-4 py-8">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-xl shadow-lg border border-border p-8">
          {/* Profile Header */}
          <div className="flex items-start gap-6 mb-8">
            {profile.profilePhoto ? (
              <img
                src={profile.profilePhoto}
                alt={profile.userId?.fullName || 'Profile'}
                className="w-24 h-24 rounded-full object-cover border-2 border-border"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center border-2 border-border">
                <span className="text-3xl font-bold text-primary">
                  {profile.userId?.fullName?.charAt(0) || 'W'}
                </span>
              </div>
            )}
            
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-text-primary mb-1">
                {profile.userId?.fullName || 'Unknown'}
              </h1>
              <p className="text-lg text-primary font-medium mb-2">
                {profile.profession}
              </p>
              <div className="flex flex-wrap gap-2 text-sm text-text-secondary">
                <span className="flex items-center gap-1">
                  📍 {profile.location}
                </span>
                <span className="flex items-center gap-1">
                  📞 {profile.phone}
                </span>
                <span className="flex items-center gap-1">
                  💼 {profile.experience} {profile.experience === 1 ? 'year' : 'years'} experience
                </span>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-text-primary mb-2">About</h2>
            <p className="text-text-secondary leading-relaxed">
              {profile.bio}
            </p>
          </div>

          {/* Skills */}
          {profile.skills && profile.skills.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-text-primary mb-2">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4 border-t border-border">
            {id === 'me' && (
              <button
                onClick={() => navigate('/profile/create')}
                className="flex-1 bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Edit Profile
              </button>
            )}
            <button
              onClick={() => navigate(-1)}
              className="flex-1 border border-border text-text-primary py-3 px-4 rounded-lg font-medium hover:bg-surface-dark transition-colors"
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
