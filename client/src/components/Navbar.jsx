import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-secondary shadow-lg sticky top-0 z-50">
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
            <Link
              to="/workers"
              className="text-gray-300 hover:text-white transition-colors duration-200 text-sm font-medium"
            >
              Find Workers
            </Link>
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
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-gray-300 hover:text-white focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
