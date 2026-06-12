import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateProfilePage = () => {
  const [formData, setFormData] = useState({
    profession: '',
    bio: '',
    location: '',
    phone: '',
    skills: '',
    experience: '',
    profilePhoto: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [existingProfile, setExistingProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkExistingProfile = async () => {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (!userInfo) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/profiles/me', {
          headers: {
            'Authorization': `Bearer ${userInfo.token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setExistingProfile(data);
          setFormData({
            profession: data.profession || '',
            bio: data.bio || '',
            location: data.location || '',
            phone: data.phone || '',
            skills: data.skills ? data.skills.join(', ') : '',
            experience: data.experience || '',
            profilePhoto: data.profilePhoto || '',
          });
        }
      } catch (err) {
        // Profile doesn't exist, which is fine for creating
      }
    };

    checkExistingProfile();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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

    const skillsArray = formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill);

    const payload = {
      ...formData,
      skills: skillsArray,
      experience: parseInt(formData.experience),
    };

    try {
      const url = existingProfile ? 'http://localhost:5000/api/profiles' : 'http://localhost:5000/api/profiles';
      const method = existingProfile ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/profile/me');
      } else {
        setError(data.message || 'Failed to save profile');
      }
    } catch (err) {
      setError('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] px-4 py-8">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-xl shadow-lg border border-border p-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2 text-center">
            {existingProfile ? 'Edit Profile' : 'Create Worker Profile'}
          </h1>
          <p className="text-text-secondary text-center mb-8">
            {existingProfile ? 'Update your professional information' : 'Tell clients about your skills and experience'}
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="profession" className="block text-sm font-medium text-text-secondary mb-2">
                Profession
              </label>
              <input
                type="text"
                id="profession"
                name="profession"
                value={formData.profession}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                placeholder="e.g., Plumber, Electrician, Painter"
              />
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-text-secondary mb-2">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                required
                maxLength={500}
                rows={4}
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                placeholder="Describe your experience and what you offer"
              />
              <p className="text-xs text-text-secondary mt-1">{formData.bio.length}/500 characters</p>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-text-secondary mb-2">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                placeholder="e.g., Nairobi, Kenya"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-text-secondary mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                placeholder="e.g., +254 712 345 678"
              />
            </div>

            <div>
              <label htmlFor="skills" className="block text-sm font-medium text-text-secondary mb-2">
                Skills (comma separated)
              </label>
              <input
                type="text"
                id="skills"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                placeholder="e.g., pipe repair, installation, maintenance"
              />
            </div>

            <div>
              <label htmlFor="experience" className="block text-sm font-medium text-text-secondary mb-2">
                Years of Experience
              </label>
              <input
                type="number"
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                required
                min="0"
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                placeholder="e.g., 5"
              />
            </div>

            <div>
              <label htmlFor="profilePhoto" className="block text-sm font-medium text-text-secondary mb-2">
                Profile Photo URL (optional)
              </label>
              <input
                type="url"
                id="profilePhoto"
                name="profilePhoto"
                value={formData.profilePhoto}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                placeholder="https://example.com/photo.jpg"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : existingProfile ? 'Update Profile' : 'Create Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProfilePage;
