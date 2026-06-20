import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const LeaveReviewPage = () => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const workerId = searchParams.get('workerId');
  const jobRequestId = searchParams.get('jobRequestId');

  const handleRatingClick = (value) => {
    setRating(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    if (comment.trim() === '') {
      setError('Please provide a comment');
      return;
    }

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo) {
      setError('Please login first');
      return;
    }

    if (!workerId) {
      setError('Worker ID is required');
      return;
    }

    if (!jobRequestId) {
      setError('Job Request ID is required');
      return;
    }

    setLoading(true);

    const payload = {
      clientId: userInfo._id,
      workerId,
      jobRequestId,
      rating,
      comment,
    };

    try {
      const response = await fetch('http://localhost:5000/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/workers');
      } else {
        setError(data.message || 'Failed to submit review');
      }
    } catch (err) {
      setError('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] px-6 sm:px-12 md:px-20 lg:px-32 py-10 sm:py-16 md:py-20">
      <div className="w-full max-w-3xl">
        <div className="bg-white rounded-2xl shadow-lg border border-border p-12">
          <h1 className="text-4xl font-bold text-text-primary mb-3 text-center">
            Leave a Review
          </h1>
          <p className="text-lg text-text-secondary text-center mb-10">
            Share your experience with this worker
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-5 py-4 rounded-xl mb-10">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-4">
                Rating
              </label>
              <div className="flex gap-3">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleRatingClick(value)}
                    className={`text-4xl transition-all ${
                      value <= rating ? 'text-yellow-400' : 'text-gray-300'
                    } hover:text-yellow-400`}
                  >
                    ★
                  </button>
                ))}
              </div>
              <p className="text-sm text-text-secondary mt-3">
                {rating > 0 ? `${rating} star${rating > 1 ? 's' : ''}` : 'Select a rating'}
              </p>
            </div>

            <div>
              <label htmlFor="comment" className="block text-sm font-medium text-text-secondary mb-3">
                Your Review
              </label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                maxLength={500}
                rows={6}
                className="w-full px-5 py-4 border-2 border-border rounded-xl focus:outline-none focus:border-primary transition-all resize-none"
                placeholder="Share your experience with this worker (e.g., Great work, very professional, completed on time)"
              />
              <p className="text-xs text-text-secondary mt-2">{comment.length}/500 characters</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LeaveReviewPage;
