import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const WorkerDiscoveryPage = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProfession, setFilterProfession] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [sortBy, setSortBy] = useState('experience');
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
    fetchWorkers();
  }, []);

  const fetchWorkers = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/profiles');
      
      if (response.ok) {
        const data = await response.json();
        setWorkers(data);
      } else {
        setError('Failed to load workers');
      }
    } catch (err) {
      setError('Failed to load workers');
    } finally {
      setLoading(false);
    }
  };

  const filteredWorkers = workers
    .filter(worker => {
      const matchesSearch = 
        worker.profession?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        worker.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        worker.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesProfession = !filterProfession || worker.profession === filterProfession;
      const matchesLocation = !filterLocation || worker.location === filterLocation;
      
      return matchesSearch && matchesProfession && matchesLocation;
    })
    .sort((a, b) => {
      if (sortBy === 'experience') {
        return b.experience - a.experience;
      }
      return 0;
    });

  const uniqueLocations = [...new Set(workers.map(w => w.location).filter(Boolean))];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-text-secondary">Loading workers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-text-primary mb-2">Find Workers</h1>
          <p className="text-text-secondary">Discover skilled professionals for your needs</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-lg border border-border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <label htmlFor="search" className="block text-sm font-medium text-text-secondary mb-2">
                Search
              </label>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by profession, skills, or bio..."
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Profession Filter */}
            <div>
              <label htmlFor="profession" className="block text-sm font-medium text-text-secondary mb-2">
                Profession
              </label>
              <select
                id="profession"
                value={filterProfession}
                onChange={(e) => setFilterProfession(e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-white"
              >
                <option value="">All Professions</option>
                {professionCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-text-secondary mb-2">
                Location
              </label>
              <select
                id="location"
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-white"
              >
                <option value="">All Locations</option>
                {uniqueLocations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Sort */}
          <div className="mt-4 flex items-center gap-4">
            <label htmlFor="sort" className="text-sm font-medium text-text-secondary">
              Sort by:
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-white"
            >
              <option value="experience">Experience (High to Low)</option>
              <option value="experience-asc">Experience (Low to High)</option>
            </select>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Workers Grid */}
        {filteredWorkers.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg border border-border p-12 text-center">
            <p className="text-text-secondary text-lg">No workers found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkers.map((worker) => (
              <div
                key={worker._id}
                onClick={() => navigate(`/profile/${worker._id}`)}
                className="bg-white rounded-xl shadow-lg border border-border p-6 cursor-pointer hover:shadow-xl transition-all duration-300 hover:border-primary/30"
              >
                {/* Profile Photo */}
                <div className="flex items-center gap-4 mb-4">
                  {worker.profilePhoto ? (
                    <img
                      src={worker.profilePhoto}
                      alt="Profile"
                      className="w-16 h-16 rounded-full object-cover border-2 border-border"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border-2 border-border">
                      <span className="text-2xl font-bold text-primary">W</span>
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-text-primary">{worker.userData?.fullName || worker.profession}</h3>
                    <p className="text-sm text-text-secondary">{worker.profession}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-text-secondary">📍 {worker.location}</span>
                      <span className="text-yellow-500">
                        {'★'.repeat(Math.round(worker.averageRating || 0))}
                        {'☆'.repeat(5 - Math.round(worker.averageRating || 0))}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-text-secondary text-sm mb-4 line-clamp-2">
                  {worker.bio}
                </p>

                {/* Skills */}
                {worker.skills && worker.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {worker.skills.slice(0, 3).map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                    {worker.skills.length > 3 && (
                      <span className="text-xs text-text-secondary">+{worker.skills.length - 3} more</span>
                    )}
                  </div>
                )}

                {/* Experience */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-secondary">
                    💼 {worker.experience} {worker.experience === 1 ? 'year' : 'years'} experience
                  </span>
                  <span className="text-primary font-medium">View Profile →</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkerDiscoveryPage;
