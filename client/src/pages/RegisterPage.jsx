import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API_BASE_URL from '../services/api';
import mjengoImage from '../assets/mjengo.jpg';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'client',
    idNumber: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  const getStrengthColor = (strength) => {
    if (strength <= 2) return 'bg-red-500';
    if (strength <= 4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthText = (strength) => {
    if (strength <= 2) return 'Weak';
    if (strength <= 4) return 'Medium';
    return 'Strong';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (formData.role === 'worker' && (!formData.idNumber || !formData.idNumber.trim())) {
      setError('National ID / Passport Number is required for worker accounts');
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...submitData } = formData;
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('userInfo', JSON.stringify(data));
        // Redirect workers to create profile, clients to home
        if (data.role === 'worker') {
          navigate('/profile/create');
        } else {
          navigate('/');
        }
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={mjengoImage}
          alt="Register Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/60 to-black/80"></div>
      </div>

      <div className="relative flex items-center justify-center min-h-[calc(100vh-8rem)] px-4 py-8">
        <div className="w-full max-w-md">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/30 p-8">
            <h1 className="text-3xl font-bold text-white mb-2 text-center">
              Create Account
            </h1>
            <p className="text-white/90 text-center mb-8">
              Join Vibarua Marketplace today
            </p>

          {error && (
            <div className="bg-red-500/20 backdrop-blur-sm border border-red-400/30 text-white px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-white/90 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-white/30 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-white/5 text-white placeholder-white/60"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-white/30 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-white/5 text-white placeholder-white/60"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white/90 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength="6"
                  className="w-full px-4 py-3 pr-12 border border-white/30 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-white/5 text-white placeholder-white/60"
                  placeholder="Create a password (min 6 characters)"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${getStrengthColor(getPasswordStrength(formData.password))}`}
                        style={{ width: `${(getPasswordStrength(formData.password) / 6) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-white/70">{getStrengthText(getPasswordStrength(formData.password))}</span>
                  </div>
                  <ul className="text-xs text-white/70 space-y-1">
                    <li className={formData.password.length >= 8 ? 'text-green-400' : ''}>• At least 8 characters</li>
                    <li className={/[A-Z]/.test(formData.password) ? 'text-green-400' : ''}>• Uppercase letter</li>
                    <li className={/[a-z]/.test(formData.password) ? 'text-green-400' : ''}>• Lowercase letter</li>
                    <li className={/[0-9]/.test(formData.password) ? 'text-green-400' : ''}>• Number</li>
                    <li className={/[^A-Za-z0-9]/.test(formData.password) ? 'text-green-400' : ''}>• Special character</li>
                  </ul>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/90 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  minLength="6"
                  className="w-full px-4 py-3 pr-12 border border-white/30 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-white/5 text-white placeholder-white/60"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {formData.confirmPassword && (
                <p className={`text-xs mt-1 ${formData.password === formData.confirmPassword ? 'text-green-400' : 'text-red-400'}`}>
                  {formData.password === formData.confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-white/90 mb-2">
                I am a
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-white/30 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-white/5 text-white"
              >
                <option value="client">Client (looking for workers)</option>
                <option value="worker">Worker (offering services)</option>
              </select>
            </div>

            {formData.role === 'worker' && (
              <div className="bg-white/5 border border-white/20 rounded-xl p-4 transition-all">
                <label htmlFor="idNumber" className="block text-sm font-medium text-white mb-1.5 flex items-center justify-between">
                  <span>National ID / Passport Number <span className="text-red-400">*</span></span>
                  <span className="text-xs text-primary font-semibold">Required for Workers</span>
                </label>
                <input
                  type="text"
                  id="idNumber"
                  name="idNumber"
                  value={formData.idNumber}
                  onChange={handleChange}
                  required={formData.role === 'worker'}
                  className="w-full px-4 py-3 border border-white/30 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-white/5 text-white placeholder-white/60"
                  placeholder="e.g. 12345678"
                />
                <p className="text-xs text-white/70 mt-1.5">
                  You will upload a scanned copy of this ID during profile verification.
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-white/90 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
      </div>
    </div>
  );
};

export default RegisterPage;
