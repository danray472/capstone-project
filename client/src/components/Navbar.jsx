import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import API_BASE_URL from '../services/api';

const Navbar = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [hasProfile, setHasProfile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('userInfo'));
    setUserInfo(user);
    
    // Check if worker has a profile
    if (user && user.role === 'worker') {
      checkWorkerProfile();
    }

    // Scroll detection
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location]);

  const checkWorkerProfile = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/profiles/me`);
      setHasProfile(response.ok);
    } catch (err) {
      setHasProfile(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    window.location.href = '/';
  };

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-secondary/90 backdrop-blur-xl shadow-lg' 
        : 'bg-secondary/60 backdrop-blur-md'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-300">
              <span className="text-white font-bold text-lg">V</span>
            </div>
            <span className="text-white text-xl font-bold tracking-tight">
              Vibarua<span className="text-accent font-light ml-1">Marketplace</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-gray-300 hover:text-white transition-colors duration-200 text-sm font-medium"
            >
              Home
            </Link>
            
            {userInfo ? (
              <>
                <Link
                  to={userInfo.role === 'client' ? '/dashboard/client' : '/dashboard/worker'}
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-sm font-medium"
                >
                  Dashboard
                </Link>
                {userInfo.role === 'client' && (
                  <Link
                    to="/workers"
                    className="text-gray-300 hover:text-white transition-colors duration-200 text-sm font-medium"
                  >
                    Find Workers
                  </Link>
                )}
                {userInfo.role === 'worker' && (
                  <>
                    <Link
                      to="/jobs/worker"
                      className="text-gray-300 hover:text-white transition-colors duration-200 text-sm font-medium"
                    >
                      Job Requests
                    </Link>
                    <Link
                      to="/profile/me"
                      className="text-gray-300 hover:text-white transition-colors duration-200 text-sm font-medium"
                    >
                      My Profile
                    </Link>
                  </>
                )}
                {userInfo.role === 'client' && (
                  <Link
                    to="/jobs/my"
                    className="text-gray-300 hover:text-white transition-colors duration-200 text-sm font-medium"
                  >
                    My Jobs
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-sm font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-lg hover:shadow-primary/25"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-300 hover:text-white focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-secondary border-t border-gray-700">
            <div className="px-4 py-4 space-y-3">
              <Link
                to="/"
                className="block text-gray-300 hover:text-white transition-colors duration-200 text-sm font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              
              {userInfo ? (
                <>
                  <Link
                    to={userInfo.role === 'client' ? '/dashboard/client' : '/dashboard/worker'}
                    className="block text-gray-300 hover:text-white transition-colors duration-200 text-sm font-medium py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  {userInfo.role === 'client' && (
                    <Link
                      to="/workers"
                      className="block text-gray-300 hover:text-white transition-colors duration-200 text-sm font-medium py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Find Workers
                    </Link>
                  )}
                  {userInfo.role === 'worker' && (
                    <>
                      <Link
                        to="/jobs/worker"
                        className="block text-gray-300 hover:text-white transition-colors duration-200 text-sm font-medium py-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Job Requests
                      </Link>
                      <Link
                        to="/profile/me"
                        className="block text-gray-300 hover:text-white transition-colors duration-200 text-sm font-medium py-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        My Profile
                      </Link>
                    </>
                  )}
                  {userInfo.role === 'client' && (
                    <Link
                      to="/jobs/my"
                      className="block text-gray-300 hover:text-white transition-colors duration-200 text-sm font-medium py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      My Jobs
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="block text-gray-300 hover:text-white transition-colors duration-200 text-sm font-medium py-2 w-full text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block text-gray-300 hover:text-white transition-colors duration-200 text-sm font-medium py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
