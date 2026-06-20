import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const CreateJobRequestPage = () => {
  const [formData, setFormData] = useState({
    description: '',
    location: '',
  });
  const [locationCoordinates, setLocationCoordinates] = useState({ lat: null, lng: null });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const workerId = searchParams.get('workerId');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleGeocodeLocation = async () => {
    if (!formData.location) return;
    
    setGeocoding(true);
    try {
      // Using OpenStreetMap's Nominatim API for geocoding (free, no API key required)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(formData.location)}&limit=1`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        setLocationCoordinates({
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        });
      }
    } catch (err) {
      console.error('Geocoding error:', err);
    } finally {
      setGeocoding(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo) {
      setError('Please login first');
      setLoading(false);
      return;
    }

    if (!workerId) {
      setError('Worker ID is required');
      setLoading(false);
      return;
    }

    const payload = {
      clientId: userInfo._id,
      workerId,
      ...formData,
      locationCoordinates,
      clientContact: {
        name: userInfo.fullName || '',
        email: userInfo.email || '',
        phone: userInfo.phone || '',
      },
    };

    try {
      const response = await fetch('http://localhost:5000/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/jobs/my');
      } else {
        setError(data.message || 'Failed to create job request');
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
            Create Job Request
          </h1>
          <p className="text-lg text-text-secondary text-center mb-10">
            Send a job request to a worker
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-5 py-4 rounded-xl mb-10">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-text-secondary mb-3">
                Job Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                maxLength={1000}
                rows={6}
                className="w-full px-5 py-4 border-2 border-border rounded-xl focus:outline-none focus:border-primary transition-all resize-none"
                placeholder="Describe the job you need done (e.g., I need my living room painted, or I need help moving furniture)"
              />
              <p className="text-xs text-text-secondary mt-2">{formData.description.length}/1000 characters</p>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-text-secondary mb-3">
                Location
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  onBlur={handleGeocodeLocation}
                  required
                  className="flex-1 px-5 py-4 border-2 border-border rounded-xl focus:outline-none focus:border-primary transition-all"
                  placeholder="e.g., Nairobi, Westlands"
                />
                <button
                  type="button"
                  onClick={handleGeocodeLocation}
                  disabled={geocoding || !formData.location}
                  className="px-4 py-4 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Get coordinates for this location"
                >
                  {geocoding ? '🔄' : '📍'}
                </button>
              </div>
              {locationCoordinates.lat && locationCoordinates.lng && (
                <p className="text-xs text-green-600 mt-2">✓ Location coordinates captured</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending Request...' : 'Send Job Request'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateJobRequestPage;
