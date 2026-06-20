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
  const [uploading, setUploading] = useState(false);
  const [existingProfile, setExistingProfile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const navigate = useNavigate();

  const professionCategories = [
    'Mama Fua / Laundry Worker',
    'House Cleaner',
    'Private Chef / Cook',
    'Day Nanny / Babysitter',
    'Plumber (Fundi wa Mabomba)',
    'Electrician (Fundi Stima)',
    'Carpenter (Fundi Mbao)',
    'Painter (Fundi wa Rangi)',
    'Appliance Repair Technician',
    'Mason / Bricklayer (Fundi Mjengo)',
    'Casual Laborer (Kibarua)',
    'Welder / Metal Fabricator',
    'Gardener / Landscaper',
    'Fumigation & Pest Control',
    'Hairdresser / Loctician',
    'Mobile Barber (Kinyozi)',
    'Nail Technician',
    'House Movers',
    'Errand Runner',
  ];

  useEffect(() => {
    const checkExistingProfile = async () => {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (!userInfo) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/profiles/me?userId=${userInfo._id}`, {
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile) return;

    setUploading(true);
    const uploadFormData = new FormData();
    uploadFormData.append('image', imageFile);

    try {
      const response = await fetch('http://localhost:5000/api/upload/image', {
        method: 'POST',
        body: uploadFormData,
      });

      const data = await response.json();

      if (response.ok) {
        setFormData({
          ...formData,
          profilePhoto: data.url,
        });
        setImagePreview(data.url);
      } else {
        setError('Failed to upload image');
      }
    } catch (err) {
      setError('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (imageFile && !formData.profilePhoto) {
      setError('Please upload the image first');
      return;
    }

    setLoading(true);

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo) {
      setError('Please login first');
      setLoading(false);
      return;
    }

    const skillsArray = formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill);

    const payload = {
      userId: userInfo._id,
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
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] px-4 py-6 sm:py-8">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-xl shadow-lg border border-border p-4 sm:p-6 md:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-2 text-center">
            {existingProfile ? 'Edit Profile' : 'Create Worker Profile'}
          </h1>
          <p className="text-sm sm:text-base text-text-secondary text-center mb-6 sm:mb-8">
            {existingProfile ? 'Update your professional information' : 'Tell clients about your skills and experience'}
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <label htmlFor="profession" className="block text-sm font-medium text-text-secondary mb-2">
                Profession
              </label>
              <select
                id="profession"
                name="profession"
                value={formData.profession}
                onChange={handleChange}
                required
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-white text-sm sm:text-base"
              >
                <option value="">Select your profession</option>
                {professionCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
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
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none text-sm sm:text-base"
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
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm sm:text-base"
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
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm sm:text-base"
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
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm sm:text-base"
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
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm sm:text-base"
                placeholder="e.g., 5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Profile Photo
              </label>
              
              {/* Image Preview */}
              {(imagePreview || formData.profilePhoto) && (
                <div className="mb-4 flex justify-center">
                  <img
                    src={imagePreview || formData.profilePhoto}
                    alt="Profile Preview"
                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-2 border-border"
                  />
                </div>
              )}

              {/* File Upload */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-text-secondary mb-1">Upload Image (PNG, JPG, JPEG, GIF, WebP)</label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="file"
                      id="imageUpload"
                      accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
                      onChange={handleImageChange}
                      className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm sm:text-base"
                    />
                    <button
                      type="button"
                      onClick={handleImageUpload}
                      disabled={!imageFile || uploading}
                      className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                    >
                      {uploading ? 'Uploading...' : 'Upload'}
                    </button>
                  </div>
                </div>

                <div className="text-xs text-text-secondary text-center">or</div>

                <div>
                  <label className="block text-xs text-text-secondary mb-1">Paste Image URL</label>
                  <input
                    type="url"
                    id="profilePhoto"
                    name="profilePhoto"
                    value={formData.profilePhoto}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm sm:text-base"
                    placeholder="https://example.com/photo.jpg"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
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
