import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API_BASE_URL from '../services/api';
import manImage from '../assets/man.jpg';

const ViewProfilePage = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPreviewDoc, setSelectedPreviewDoc] = useState(null);
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
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-white/80">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    if (id === 'me' && error === 'Profile not found') {
      return (
        <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] px-8 sm:px-16 md:px-24 lg:px-40 py-12 sm:py-20 md:py-24">
          <div className="w-full max-w-4xl">
            <div className="bg-white rounded-2xl shadow-lg border border-border p-12 text-center">
              <h1 className="text-3xl font-bold text-text-primary mb-4">You don't have a profile yet</h1>
              <p className="text-text-secondary mb-8">
                Create your worker profile and upload your verification documents to start receiving job requests
              </p>
              <button
                onClick={() => navigate('/profile/create')}
                className="bg-primary text-white py-3 px-8 rounded-xl font-medium hover:bg-primary-hover transition-colors shadow-sm"
              >
                Create Profile & Upload Documents
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
            className="text-primary hover:underline font-semibold"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const workerIdNumber = profile.idNumber || profile.userData?.idNumber;
  const currentUser = JSON.parse(localStorage.getItem('userInfo') || 'null');
  const isOwnProfile = id === 'me' || (
    Boolean(currentUser) && Boolean(profile) && (
      String(profile.userId) === String(currentUser._id) ||
      String(profile._id) === String(currentUser._id)
    )
  );

  return (
    <div className="min-h-[calc(100vh-8rem)] relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={manImage}
          alt="Profile Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/60 to-black/80"></div>
      </div>

      <div className="relative flex items-center justify-center min-h-[calc(100vh-8rem)] px-4 sm:px-8 md:px-16 lg:px-24 py-8 sm:py-12 md:py-16">
        <div className="w-full max-w-4xl">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/30 p-6 sm:p-8 md:p-12">
          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row items-start gap-6 sm:gap-8 mb-8 sm:mb-12">
            {profile.profilePhoto ? (
              <img
                src={profile.profilePhoto}
                alt={profile.userData?.fullName || 'Profile'}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white/30 mx-auto sm:mx-0 shadow-md"
              />
            ) : (
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-white/20 flex items-center justify-center border-4 border-white/30 mx-auto sm:mx-0 shadow-sm">
                <span className="text-3xl sm:text-4xl font-bold text-white">
                  {profile.userData?.fullName?.charAt(0) || 'W'}
                </span>
              </div>
            )}

            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  {profile.userData?.fullName || 'Unknown Worker'}
                </h1>

                {/* ID Badge in Header */}
                {workerIdNumber && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 backdrop-blur-sm text-emerald-300 border border-emerald-400/30 rounded-full text-xs font-semibold mx-auto sm:mx-0">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    ID: {workerIdNumber} (Verified)
                  </div>
                )}
              </div>

              <p className="text-lg sm:text-xl text-primary font-semibold mb-3">
                {profile.profession}
              </p>

              <div className="flex flex-wrap justify-center sm:justify-start gap-3 text-sm text-white/80 mb-3">
                <span className="flex items-center gap-1.5 bg-white/5 backdrop-blur-sm px-3 py-1 rounded-lg border border-white/20">
                  📍 {profile.location}
                </span>
                <span className="flex items-center gap-1.5 bg-white/5 backdrop-blur-sm px-3 py-1 rounded-lg border border-white/20">
                  📞 {profile.phone}
                </span>
                <span className="flex items-center gap-1.5 bg-white/5 backdrop-blur-sm px-3 py-1 rounded-lg border border-white/20">
                  💼 {profile.experience} {profile.experience === 1 ? 'year' : 'years'} experience
                </span>
              </div>

              <div className="flex items-center justify-center sm:justify-start gap-3 text-sm">
                <span className="text-yellow-400 text-lg sm:text-xl">
                  {'★'.repeat(Math.round(profile.averageRating || 0))}
                  {'☆'.repeat(5 - Math.round(profile.averageRating || 0))}
                </span>
                <span className="text-white/80 font-medium">
                  {profile.averageRating || 0} ({profile.totalReviews || 0}{' '}
                  {profile.totalReviews === 1 ? 'review' : 'reviews'})
                </span>
              </div>
            </div>
          </div>

          {/* About / Bio */}
          <div className="mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-3">About</h2>
            <p className="text-white/90 leading-relaxed text-base">
              {profile.bio}
            </p>
          </div>

          {/* Skills */}
          {profile.skills && profile.skills.length > 0 && (
            <div className="mb-6 sm:mb-8">
              <h2 className="text-lg sm:text-xl font-bold text-white mb-3">Skills & Expertise</h2>
              <div className="flex flex-wrap gap-2 sm:gap-2.5 justify-center sm:justify-start">
                {profile.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3.5 py-1.5 bg-white/10 backdrop-blur-sm text-white border border-white/30 rounded-full text-xs sm:text-sm font-semibold"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ================= VERIFICATION & SUPPORTIVE DOCUMENTS ================= */}
          <div className="mb-8 p-5 sm:p-6 bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/20">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">🪪</span>
                <div>
                  <h2 className="text-lg font-bold text-white">Credentials & Supportive Documents</h2>
                  <p className="text-xs text-white/70">Official identification and verified supportive certifications</p>
                </div>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-500/20 backdrop-blur-sm text-emerald-300 rounded-full border border-emerald-400/30">
                Verified Identity
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* National ID Card */}
              <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/20 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white/70 uppercase tracking-wider">
                      National ID / Passport
                    </span>
                    <span className="text-[10px] bg-emerald-500/20 backdrop-blur-sm text-emerald-300 font-semibold px-2 py-0.5 rounded-full">
                      Mandatory Verified
                    </span>
                  </div>
                  <p className="text-base font-bold text-white font-mono mb-1">
                    {workerIdNumber || 'ID Number Registered'}
                  </p>
                  <p className="text-xs text-white/70 mb-3">
                    Government issued identification submitted for client verification
                  </p>
                </div>

                {profile.idDocument ? (
                  <a
                    href={profile.idDocument.includes('?') ? `${profile.idDocument}&fl_attachment=true` : `${profile.idDocument}?fl_attachment=true`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 w-full px-3 py-2 bg-white/15 hover:bg-white/25 border border-white/30 backdrop-blur-sm text-white font-semibold rounded-lg text-xs transition-colors shadow-sm"
                  >
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v12m0 0l-4-4m4 4l4-4M4 17.5V19a2 2 0 002 2h12a2 2 0 002-2v-1.5" />
                    </svg>
                    Download Scanned ID Document
                  </a>
                ) : (
                  <span className="text-xs text-amber-300 bg-amber-500/20 backdrop-blur-sm p-2 rounded-lg block text-center font-medium">
                    Physical ID on file
                  </span>
                )}
              </div>

              {/* Supportive Academic & Professional Documents */}
              <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/20 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white/70 uppercase tracking-wider">
                      Academic & Supportive Certificates
                    </span>
                    <span className="text-[10px] bg-purple-500/20 backdrop-blur-sm text-purple-300 font-semibold px-2 py-0.5 rounded-full">
                      {profile.documents?.length || 0} Attached
                    </span>
                  </div>
                  <p className="text-xs text-white/70 mb-3">
                    Diplomas, vocational licenses, and academic certificates
                  </p>
                </div>

                {profile.documents && profile.documents.length > 0 ? (
                  <div className="space-y-2">
                    {profile.documents.map((doc, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 bg-white/5 backdrop-blur-sm rounded-lg border border-white/20 text-xs"
                      >
                        <div className="flex items-center gap-2 truncate pr-2">
                          <span className="text-sm">📜</span>
                          <span className="font-semibold text-white truncate" title={doc.title}>
                            {doc.title}
                          </span>
                        </div>
                        <a
                          href={doc.url.includes('?') ? `${doc.url}&fl_attachment=true` : `${doc.url}?fl_attachment=true`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-white hover:text-white/80 underline font-bold flex-shrink-0 text-[11px]"
                        >
                          Download Document &rarr;
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-white/70 italic py-2 text-center bg-white/5 backdrop-blur-sm rounded-lg">
                    No additional certificates uploaded yet
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Reviews */}
          {reviews.length > 0 && (
            <div className="mb-6 sm:mb-8">
              <h2 className="text-lg sm:text-xl font-bold text-white mb-4">
                Client Reviews ({reviews.length})
              </h2>
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review._id} className="bg-white/5 backdrop-blur-sm rounded-xl p-4 sm:p-5 border border-white/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-yellow-400 text-base">
                        {'★'.repeat(review.rating)}
                        {'☆'.repeat(5 - review.rating)}
                      </span>
                      <span className="text-xs text-white/70">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-white/90 text-sm leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6 border-t border-white/20">
            {!isOwnProfile && (
              <>
                <button
                  onClick={() => navigate(`/jobs/create?workerId=${profile.userId}`)}
                  className="w-full sm:flex-1 bg-primary text-white py-3 px-4 sm:px-5 rounded-xl font-semibold hover:bg-primary-hover transition-colors text-sm sm:text-base shadow-sm"
                >
                  Request Job
                </button>
                <button
                  onClick={() => navigate(`/reviews/leave?workerId=${profile._id}`)}
                  className="w-full sm:flex-1 border border-white/30 text-white py-3 px-4 sm:px-5 rounded-xl font-semibold hover:bg-white/10 transition-colors text-sm sm:text-base"
                >
                  Leave Review
                </button>
              </>
            )}
            {isOwnProfile && (
              <button
                onClick={() => navigate('/profile/create')}
                className="w-full sm:flex-1 bg-primary text-white py-3 px-4 sm:px-5 rounded-xl font-semibold hover:bg-primary-hover transition-colors text-sm sm:text-base shadow-sm"
              >
                Edit Profile & Documents
              </button>
            )}
            <button
              onClick={() => navigate(-1)}
              className="w-full sm:flex-1 border border-white/30 text-white/80 py-3 px-4 sm:px-5 rounded-xl font-medium hover:bg-white/10 transition-colors text-sm sm:text-base"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default ViewProfilePage;
