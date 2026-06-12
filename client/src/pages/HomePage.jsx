import { useState, useEffect } from 'react';

const HomePage = () => {
  const [backendStatus, setBackendStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/test');
        const data = await response.json();
        setBackendStatus(data.message);
      } catch (error) {
        setBackendStatus('Backend not connected');
      } finally {
        setLoading(false);
      }
    };
    checkBackend();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
      {/* Hero Section */}
      <div className="text-center px-4 max-w-3xl mx-auto">
        {/* Animated Badge */}
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-8 border border-primary/20">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          Platform Status: Active
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl sm:text-6xl font-bold text-text-primary mb-6 leading-tight">
          Vibarua{' '}
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Marketplace
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl text-text-secondary mb-10 leading-relaxed">
          Connecting clients with skilled casual workers. Find trusted professionals for any job, anytime.
        </p>

        {/* Status Cards */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          {/* Frontend Status */}
          <div className="bg-white rounded-xl shadow-lg border border-border p-6 min-w-[240px] hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></div>
              <span className="text-sm font-medium text-text-secondary uppercase tracking-wider">Frontend</span>
            </div>
            <p className="text-lg font-semibold text-emerald-600">Frontend Running</p>
          </div>

          {/* Backend Status */}
          <div className="bg-white rounded-xl shadow-lg border border-border p-6 min-w-[240px] hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-3 h-3 rounded-full ${
                loading ? 'bg-yellow-500 animate-pulse' :
                backendStatus === 'Backend Running' ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50' : 'bg-red-500'
              }`}></div>
              <span className="text-sm font-medium text-text-secondary uppercase tracking-wider">Backend</span>
            </div>
            <p className={`text-lg font-semibold ${
              loading ? 'text-yellow-600' :
              backendStatus === 'Backend Running' ? 'text-emerald-600' : 'text-red-600'
            }`}>
              {loading ? 'Checking...' : backendStatus}
            </p>
          </div>
        </div>

        {/* Tech Stack Badges */}
        <div className="flex flex-wrap justify-center gap-3">
          {['React', 'Tailwind CSS', 'Node.js', 'Express', 'MongoDB'].map((tech) => (
            <span
              key={tech}
              className="px-4 py-2 bg-surface-dark/5 text-text-secondary rounded-lg text-sm font-medium border border-border hover:border-primary/30 hover:text-primary transition-all duration-200"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
