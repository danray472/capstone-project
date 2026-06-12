const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">V</span>
              </div>
              <span className="text-white text-lg font-bold">
                Vibarua<span className="text-accent font-light ml-1">Marketplace</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              Connecting clients with skilled casual workers. Find trusted plumbers, electricians, painters, and more.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="hover:text-accent transition-colors duration-200">Home</a>
              </li>
              <li>
                <a href="/workers" className="hover:text-accent transition-colors duration-200">Find Workers</a>
              </li>
              <li>
                <a href="/register" className="hover:text-accent transition-colors duration-200">Register</a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Contact
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                info@vibarua.com
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Nairobi, Kenya
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs">
            &copy; {currentYear} Vibarua Marketplace. All rights reserved.
          </p>
          <p className="text-xs text-gray-500">
            Built with ❤️ for the community
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
