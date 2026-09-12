import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../services/api';

const CreateProfilePage = () => {
  const [formData, setFormData] = useState({
    profession: '',
    bio: '',
    location: '',
    phone: '',
    skills: '',
    experience: '',
    profilePhoto: '',
    idNumber: '',
    idDocument: '',
    documents: [],
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [existingProfile, setExistingProfile] = useState(null);
  
  // Profile Photo state
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  // Mandatory Scanned ID Document state
  const [idDocFile, setIdDocFile] = useState(null);
  const [idDocPreview, setIdDocPreview] = useState('');
  const [uploadingIdDoc, setUploadingIdDoc] = useState(false);

  // Supportive / Academic Documents state
  const [docTitle, setDocTitle] = useState('');
  const [docFile, setDocFile] = useState(null);
  const [uploadingDoc, setUploadingDoc] = useState(false);

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

      // Pre-fill idNumber from user session if available
      if (userInfo.idNumber) {
        setFormData((prev) => ({ ...prev, idNumber: userInfo.idNumber }));
      }

      try {
        const response = await fetch(`${API_BASE_URL}/profiles/me?userId=${userInfo._id}`, {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
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
            experience: data.experience !== undefined ? data.experience : '',
            profilePhoto: data.profilePhoto || '',
            idNumber: data.idNumber || data.userData?.idNumber || userInfo.idNumber || '',
            idDocument: data.idDocument || '',
            documents: data.documents || [],
          });
          if (data.idDocument) {
            setIdDocPreview(data.idDocument);
          }
        }
      } catch (err) {
        // Profile doesn't exist, which is normal when creating fresh
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

  // Handle Profile Photo
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
      const response = await fetch(`${API_BASE_URL}/upload/image`, {
        method: 'POST',
        body: uploadFormData,
      });

      const data = await response.json();

      if (response.ok) {
        setFormData((prev) => ({
          ...prev,
          profilePhoto: data.url,
        }));
        setImagePreview(data.url);
      } else {
        setError('Failed to upload profile photo');
      }
    } catch (err) {
      setError('Failed to upload profile photo');
    } finally {
      setUploading(false);
    }
  };

  // Handle Scanned ID Document (Required)
  const handleIdDocChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIdDocFile(file);
      if (file.type.startsWith('image/')) {
        setIdDocPreview(URL.createObjectURL(file));
      } else {
        setIdDocPreview('pdf');
      }
    }
  };

  const handleUploadIdDoc = async () => {
    if (!idDocFile) return;

    setUploadingIdDoc(true);
    setError('');
    const docFormData = new FormData();
    docFormData.append('document', idDocFile);

    try {
      const response = await fetch(`${API_BASE_URL}/upload/document`, {
        method: 'POST',
        body: docFormData,
      });

      const data = await response.json();

      if (response.ok) {
        setFormData((prev) => ({
          ...prev,
          idDocument: data.url,
        }));
      } else {
        setError(data.message || 'Failed to upload scanned ID');
      }
    } catch (err) {
      setError('Failed to upload scanned ID document');
    } finally {
      setUploadingIdDoc(false);
    }
  };

  // Handle Academic / Supportive Document Upload
  const handleAddSupportiveDoc = async () => {
    if (!docTitle.trim()) {
      setError('Please provide a title for the supportive document (e.g., Diploma, Certificate)');
      return;
    }
    if (!docFile) {
      setError('Please select a file for the supportive document');
      return;
    }

    setUploadingDoc(true);
    setError('');
    const uploadData = new FormData();
    uploadData.append('document', docFile);

    try {
      const response = await fetch(`${API_BASE_URL}/upload/document`, {
        method: 'POST',
        body: uploadData,
      });

      const data = await response.json();

      if (response.ok) {
        const newDoc = {
          title: docTitle.trim(),
          url: data.url,
          fileType: docFile.type.includes('pdf') ? 'pdf' : 'image',
          uploadedAt: new Date(),
        };

        setFormData((prev) => ({
          ...prev,
          documents: [...(prev.documents || []), newDoc],
        }));

        setDocTitle('');
        setDocFile(null);
        const fileInput = document.getElementById('supportiveDocInput');
        if (fileInput) fileInput.value = '';
      } else {
        setError(data.message || 'Failed to upload supportive document');
      }
    } catch (err) {
      setError('Failed to upload supportive document');
    } finally {
      setUploadingDoc(false);
    }
  };

  const handleRemoveDoc = (index) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (imageFile && !formData.profilePhoto) {
      setError('Please click "Upload" to upload your profile photo');
      return;
    }

    if (!formData.idNumber || !formData.idNumber.trim()) {
      setError('National ID Number is required');
      return;
    }

    if (!formData.idDocument) {
      setError('A scanned copy of your National ID / Passport is required for verification');
      return;
    }

    setLoading(true);

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo) {
      setError('Please login first');
      setLoading(false);
      return;
    }

    const skillsArray = formData.skills
      ? formData.skills.split(',').map((skill) => skill.trim()).filter((skill) => skill)
      : [];

    const payload = {
      userId: userInfo._id,
      ...formData,
      skills: skillsArray,
      experience: parseInt(formData.experience) || 0,
    };

    try {
      const url = `${API_BASE_URL}/profiles`;
      const method = existingProfile ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        // Update local session idNumber if updated
        if (formData.idNumber) {
          userInfo.idNumber = formData.idNumber;
          localStorage.setItem('userInfo', JSON.stringify(userInfo));
        }
        navigate(`/profile/${data._id}`);
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
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] px-4 sm:px-8 md:px-16 lg:px-24 py-8 sm:py-12 md:py-16">
      <div className="w-full max-w-3xl">
        <div className="bg-white rounded-2xl shadow-lg border border-border p-6 sm:p-8 md:p-12">
          <div className="text-center mb-8 sm:mb-10">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-text-primary mb-2">
              {existingProfile ? 'Edit Worker Profile' : 'Create Worker Profile'}
            </h1>
            <p className="text-sm sm:text-base text-text-secondary">
              Set up your professional credentials, upload supportive documents, and showcase your skills to clients
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 sm:px-5 py-3.5 rounded-xl mb-6 text-sm flex items-start gap-2">
              <span className="font-bold">Error:</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profession Dropdown */}
            <div>
              <label htmlFor="profession" className="block text-sm font-medium text-text-primary mb-2">
                Profession / Service Category <span className="text-red-500">*</span>
              </label>
              <select
                id="profession"
                name="profession"
                value={formData.profession}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 sm:py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm sm:text-base bg-white"
              >
                <option value="">Select your profession</option>
                {professionCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Bio */}
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-text-primary mb-2">
                Professional Bio <span className="text-red-500">*</span>
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                required
                rows="4"
                maxLength="500"
                className="w-full px-3.5 py-2.5 sm:py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm sm:text-base"
                placeholder="Describe your expertise, experience, and the quality of services you offer..."
              />
              <p className="text-xs text-text-secondary mt-1">{formData.bio.length}/500 characters</p>
            </div>

            {/* Location & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-text-primary mb-2">
                  Operating Location / City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2.5 sm:py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm sm:text-base"
                  placeholder="e.g. Nairobi, Westlands"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-text-primary mb-2">
                  Contact Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2.5 sm:py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm sm:text-base"
                  placeholder="e.g. 0712345678"
                />
              </div>
            </div>

            {/* Skills & Experience */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label htmlFor="skills" className="block text-sm font-medium text-text-primary mb-2">
                  Key Skills (comma separated)
                </label>
                <input
                  type="text"
                  id="skills"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 sm:py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm sm:text-base"
                  placeholder="e.g. Wiring, Repairs, Installation"
                />
              </div>

              <div>
                <label htmlFor="experience" className="block text-sm font-medium text-text-primary mb-2">
                  Years of Experience <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-3.5 py-2.5 sm:py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm sm:text-base"
                  placeholder="e.g. 5"
                />
              </div>
            </div>

            {/* ================= SECTION: NATIONAL ID VERIFICATION ================= */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4">
              <div className="flex items-center gap-2.5 border-b border-slate-200 pb-3">
                <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                  🪪
                </span>
                <div>
                  <h3 className="text-base font-bold text-text-primary">
                    Identity Verification (Required)
                  </h3>
                  <p className="text-xs text-text-secondary">
                    Your official identity document builds trust and is visible to clients for verification
                  </p>
                </div>
              </div>

              {/* ID Number */}
              <div>
                <label htmlFor="idNumber" className="block text-sm font-medium text-text-primary mb-1.5">
                  National ID / Passport Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="idNumber"
                  name="idNumber"
                  value={formData.idNumber}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2.5 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm bg-white"
                  placeholder="e.g. 12345678"
                />
              </div>

              {/* Scanned ID Upload */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5 flex items-center justify-between">
                  <span>Scanned Copy of National ID / Passport <span className="text-red-500">*</span></span>
                  {formData.idDocument && (
                    <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                      ✓ Scanned ID Attached
                    </span>
                  )}
                </label>

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp,application/pdf"
                    onChange={handleIdDocChange}
                    className="flex-1 px-3 py-2 border border-border rounded-xl text-xs sm:text-sm bg-white file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={handleUploadIdDoc}
                    disabled={!idDocFile || uploadingIdDoc}
                    className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-semibold hover:bg-primary-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {uploadingIdDoc ? 'Uploading ID...' : 'Upload Scanned ID'}
                  </button>
                </div>

                {/* ID Preview */}
                {formData.idDocument && (
                  <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-600 text-lg">📄</span>
                      <div>
                        <p className="text-xs font-semibold text-emerald-800">Scanned ID Verified & Uploaded</p>
                        <a
                          href={formData.idDocument}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-primary underline font-medium"
                        >
                          View Uploaded ID Scan
                        </a>
                      </div>
                    </div>
                    <span className="text-[10px] bg-emerald-200 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                      Ready
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* ================= SECTION: ACADEMIC & SUPPORTIVE DOCUMENTS ================= */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4">
              <div className="flex items-center gap-2.5 border-b border-slate-200 pb-3">
                <span className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm">
                  🎓
                </span>
                <div>
                  <h3 className="text-base font-bold text-text-primary">
                    Academic & Supportive Documents (Optional)
                  </h3>
                  <p className="text-xs text-text-secondary">
                    Add certificates, licenses, diplomas, or professional accreditations to stand out to clients
                  </p>
                </div>
              </div>

              {/* Upload New Supportive Document */}
              <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1">
                      Certificate / Document Title
                    </label>
                    <input
                      type="text"
                      value={docTitle}
                      onChange={(e) => setDocTitle(e.target.value)}
                      placeholder="e.g. Electrical Wireman License Grade 2"
                      className="w-full px-3 py-2 border border-border rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1">
                      Select Document File (PDF, PNG, JPG, WebP)
                    </label>
                    <input
                      type="file"
                      id="supportiveDocInput"
                      accept="image/png,image/jpeg,image/jpg,image/webp,application/pdf"
                      onChange={(e) => setDocFile(e.target.files[0])}
                      className="w-full px-3 py-1.5 border border-border rounded-xl text-xs bg-white file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={handleAddSupportiveDoc}
                    disabled={!docFile || !docTitle.trim() || uploadingDoc}
                    className="px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-semibold hover:bg-purple-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
                  >
                    {uploadingDoc ? (
                      <>
                        <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        Uploading Document...
                      </>
                    ) : (
                      '+ Add Document / Certificate'
                    )}
                  </button>
                </div>
              </div>

              {/* Uploaded Supportive Documents List */}
              {formData.documents && formData.documents.length > 0 && (
                <div className="space-y-2 mt-4">
                  <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider">
                    Attached Documents ({formData.documents.length})
                  </h4>
                  <div className="space-y-2">
                    {formData.documents.map((doc, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-white border border-border rounded-xl shadow-sm hover:border-purple-200 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">📜</span>
                          <div>
                            <p className="text-xs font-bold text-text-primary">{doc.title}</p>
                            <a
                              href={doc.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[11px] text-primary hover:underline"
                            >
                              Preview Document ({doc.fileType?.toUpperCase() || 'DOCUMENT'})
                            </a>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveDoc(idx)}
                          className="text-xs text-red-500 hover:text-red-700 font-semibold px-2 py-1 rounded hover:bg-red-50 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Photo Section */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Profile Photo (Optional)
              </label>

              {(imagePreview || formData.profilePhoto) && (
                <div className="mb-4 flex justify-center">
                  <img
                    src={imagePreview || formData.profilePhoto}
                    alt="Profile Preview"
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-primary/20 shadow-md"
                  />
                </div>
              )}

              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="file"
                    id="imageUpload"
                    accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
                    onChange={handleImageChange}
                    className="flex-1 px-3.5 py-2.5 border border-border rounded-xl text-xs sm:text-sm bg-white file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={handleImageUpload}
                    disabled={!imageFile || uploading}
                    className="px-5 py-2.5 bg-primary text-white rounded-xl text-xs font-semibold hover:bg-primary-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {uploading ? 'Uploading...' : 'Upload Photo'}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3.5 px-6 rounded-xl font-bold hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base shadow-md hover:shadow-lg"
            >
              {loading
                ? 'Saving Profile...'
                : existingProfile
                ? 'Update Profile & Documents'
                : 'Complete Profile & Submit Verification'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProfilePage;
