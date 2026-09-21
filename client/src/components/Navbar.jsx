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
      const user = JSON.parse(localStorage.getItem('userInfo'));
      if (!user || !user.token) {
        setHasProfile(false);
        return;
      }
      const response = await fetch(`${API_BASE_URL}/profiles/me`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setHasProfile(response.ok);
    } catch (err) {
      setHasProfile(false);
    }
  };

  const handleLogout = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (userInfo && userInfo.token) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userInfo.token}`
          },
          body: JSON.stringify({ email: userInfo.email })
        });
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('userInfo');
      window.location.href = '/';
    }
  };

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-[linear-gradient(135deg,rgba(15,23,42,0.72),rgba(30,41,59,0.58),rgba(10,25,38,0.66))] shadow-[0_10px_30px_rgba(2,6,23,0.28)] backdrop-blur-xl'
        : 'bg-[#071827] shadow-[0_8px_22px_rgba(2,6,23,0.18)]'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 border-b border-white/10">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500/95 via-sky-400/90 to-cyan-300/80 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20 ring-1 ring-white/15 group-hover:scale-105 transition-all duration-300">
              <span className="text-white font-black text-lg">V</span>
            </div>
            <span className="text-white text-xl font-bold tracking-tight">
              Vibarua<span className="text-blue-200 font-light ml-1">Marketplace</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="glass-nav-link"
            >
              Home
            </Link>
            
            {userInfo ? (
              <>
                {userInfo.role === 'admin' ? (
                  <Link
                    to="/dashboard/admin"
                    className="glass-nav-link"
                  >
                    Admin Panel
                  </Link>
                ) : (
                  <Link
                    to={userInfo.role === 'client' ? '/dashboard/client' : '/dashboard/worker'}
                    className="glass-nav-link"
                  >
                    Dashboard
                  </Link>
                )}
                {userInfo.role === 'client' && (
                  <Link
                    to="/workers"
                    className="glass-nav-link"
                  >
                    Find Workers
                  </Link>
                )}
                {userInfo.role === 'worker' && (
                  <>
                    <Link
                      to="/jobs/worker"
                      className="glass-nav-link"
                    >
                      Job Requests
                    </Link>
                    <Link
                      to="/profile/me"
                      className="glass-nav-link"
                    >
                      My Profile
                    </Link>
                  </>
                )}
                {userInfo.role === 'client' && (
                  <Link
                    to="/jobs/my"
                    className="glass-nav-link"
                  >
                    My Jobs
                  </Link>
                )}
                <button
                  onClick={async () => await handleLogout()}
                  className="nav-ghost-button rounded-xl"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="glass-nav-link"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="nav-primary-button rounded-xl"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white/90 hover:text-white focus:outline-none p-2 border border-white/10 bg-white/5"
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
          <div className="glass-mobile-panel md:hidden mt-2 border border-white/10">
            <div className="px-4 py-4 space-y-3">
              <Link
                to="/"
                className="block text-white/80 hover:text-white transition-colors duration-200 text-sm font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              
              {userInfo ? (
                <>
                  {userInfo.role === 'admin' ? (
                    <Link
                      to="/dashboard/admin"
                      className="block text-white/80 hover:text-white transition-colors duration-200 text-sm font-medium py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  ) : (
                    <Link
                      to={userInfo.role === 'client' ? '/dashboard/client' : '/dashboard/worker'}
                      className="block text-white/80 hover:text-white transition-colors duration-200 text-sm font-medium py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  )}
                  {userInfo.role === 'client' && (
                    <Link
                      to="/workers"
                      className="block text-white/80 hover:text-white transition-colors duration-200 text-sm font-medium py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Find Workers
                    </Link>
                  )}
                  {userInfo.role === 'worker' && (
                    <>
                      <Link
                        to="/jobs/worker"
                        className="block text-white/80 hover:text-white transition-colors duration-200 text-sm font-medium py-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Job Requests
                      </Link>
                      <Link
                        to="/profile/me"
                        className="block text-white/80 hover:text-white transition-colors duration-200 text-sm font-medium py-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        My Profile
                      </Link>
                    </>
                  )}
                  {userInfo.role === 'client' && (
                    <Link
                      to="/jobs/my"
                      className="block text-white/80 hover:text-white transition-colors duration-200 text-sm font-medium py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      My Jobs
                    </Link>
                  )}
                  <button
                    onClick={async () => {
                      await handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="block text-left w-full text-white/80 hover:text-white transition-colors duration-200 text-sm font-medium py-2"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block text-white/80 hover:text-white transition-colors duration-200 text-sm font-medium py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block nav-primary-button text-center rounded-xl"
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
