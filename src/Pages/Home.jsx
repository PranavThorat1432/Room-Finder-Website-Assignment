import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getRooms } from '../services/roomService';
import RoomCard from '../components/RoomCard';

const Home = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        propertyType: '',
        minPrice: '',
        maxPrice: '',
        tenantPreference: ''
    });
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                setLoading(true);
                const data = await getRooms();
                setRooms(data || []);
            } catch (error) {
                console.error('Error fetching rooms:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRooms();
    }, []);

        const filteredRooms = rooms.filter(room => {
            const matchesSearch = room.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                room.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                room.description?.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesPropertyType = !filters.propertyType || room.property_type === filters.propertyType;
            const matchesMinPrice = !filters.minPrice || room.rent >= Number(filters.minPrice);
            const matchesMaxPrice = !filters.maxPrice || room.rent <= Number(filters.maxPrice);
            const matchesTenantPreference = !filters.tenantPreference || 
                                        room.tenant_preference === filters.tenantPreference;
            
            return matchesSearch && matchesPropertyType && matchesMinPrice && 
                matchesMaxPrice && matchesTenantPreference;
        });

    const propertyTypes = ['1BHK', '2BHK', '3BHK', '4BHK', 'PG', 'Hostel', 'Independent House'];
    const tenantPreferences = ['Family', 'Bachelors', 'Girls', 'Working Professional', 'Students'];

  return (
    <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-indigo-700 text-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
                <span className="block">Find Your Perfect</span>
                <span className="block text-indigo-200">Room or Roommate</span>
                </h1>
                <p className="mt-3 max-w-md mx-auto text-base text-indigo-100 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                Discover thousands of rooms and properties for rent across the country.
                </p>
            </div>

            {/* Search Bar */}
            <div className="mt-8 max-w-3xl mx-auto">
                <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                    <div className="px-4 py-5 sm:p-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <label htmlFor="search" className="sr-only">Search</label>
                                <div className="relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        id="search"
                                        className="text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 sm:text-sm"
                                        placeholder="Search by location, property type, or keywords..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowFilters(!showFilters)}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <svg className="-ml-1 mr-2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 7.707A1 1 0 013 7V3z" clipRule="evenodd" />
                                </svg>
                                Filters
                            </button>
                        </div>

                        {/* Advanced Filters */}
                        {showFilters && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                <div>
                                    <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 mb-1">
                                    Property Type
                                    </label>
                                    <select
                                    id="propertyType"
                                    className="text-gray-900 mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                    value={filters.propertyType}
                                    onChange={(e) => setFilters({...filters, propertyType: e.target.value})}
                                    >
                                    <option value="">All Types</option>
                                    {propertyTypes.map((type) => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                    </select>
                                </div>
                            
                                <div>
                                    <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700 mb-1">
                                    Min Price (₹)
                                    </label>
                                    <input
                                    type="number"
                                    id="minPrice"
                                    className="text-gray-900 mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="Min"
                                    value={filters.minPrice}
                                    onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                                    />
                                </div>
                            
                                <div>
                                    <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 mb-1">
                                    Max Price (₹)
                                    </label>
                                    <input
                                    type="number"
                                    id="maxPrice"
                                    className="text-gray-900 mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="Max"
                                    value={filters.maxPrice}
                                    onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                                    />
                                </div>
                            
                                <div>
                                    <label htmlFor="tenantPreference" className="block text-sm font-medium text-gray-700 mb-1">
                                    Tenant Preference
                                    </label>
                                    <select
                                    id="tenantPreference"
                                    className="text-gray-900 mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                    value={filters.tenantPreference}
                                    onChange={(e) => setFilters({...filters, tenantPreference: e.target.value})}
                                    >
                                    <option value="">Any</option>
                                    {tenantPreferences.map((pref) => (
                                        <option key={pref} value={pref}>{pref}</option>
                                    ))}
                                    </select>
                                </div>
                            </div>
                            
                            <div className="mt-4 flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setFilters({
                                    propertyType: '',
                                    minPrice: '',
                                    maxPrice: '',
                                    tenantPreference: ''
                                    })}
                                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500 mr-4"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        </div>
                        )}
                    </div>
                </div>
            </div>
            
            {user ? (
                <div className="mt-6 flex justify-center space-x-4">
                <Link
                    to="/my-listings"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    View My Listings
                </Link>
                <Link
                    to="/add-room"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Add New Listing
                </Link>
                </div>
            ) : (
                <div className="mt-6 flex justify-center space-x-4">
                <Link
                    to="/login"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Sign In
                </Link>
                <Link
                    to="/signup"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Sign Up
                </Link>
                </div>
            )}
            </div>
        </div>

        {/* Listings Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">
                    {searchTerm || Object.values(filters).some(Boolean) 
                    ? `Search Results (${filteredRooms.length})` 
                    : 'Featured Listings'}
                </h2>
                {searchTerm || Object.values(filters).some(Boolean) ? (
                    <button
                    onClick={() => {
                        setSearchTerm('');
                        setFilters({
                        propertyType: '',
                        minPrice: '',
                        maxPrice: '',
                        tenantPreference: ''
                        });
                    }}
                    className="text-sm text-indigo-600 hover:text-indigo-800"
                    >
                    Clear all filters
                    </button>
                ) : null}
            </div>

            {loading ? (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
            ) : filteredRooms.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredRooms.map((room) => (
                <RoomCard 
                    key={room.id} 
                    room={room} 
                    onDelete={user?.id === room.owner_id ? (id) => {
                    setRooms(prev => prev.filter(r => r.id !== id));
                    } : null}
                    showActions={false}
                />
                ))}
            </div>
            ) : (
            <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
                <svg
                className="mx-auto h-16 w-16 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1"
                >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">No listings found</h3>
                <p className="mt-1 text-sm text-gray-500">
                {searchTerm || Object.values(filters).some(Boolean)
                    ? 'Try adjusting your search or filter to find what you\'re looking for.'
                    : 'There are currently no listings available. Check back later or add your own listing.'}
                </p>
                {!searchTerm && !Object.values(filters).some(Boolean) && user && (
                <div className="mt-6">
                    <Link
                    to="/add-room"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                    <svg
                        className="-ml-1 mr-2 h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                        fillRule="evenodd"
                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                        clipRule="evenodd"
                        />
                    </svg>
                    Add New Listing
                    </Link>
                </div>
                )}
            </div>
            )}
        </div>

      {/* CTA Section */}
        <div className="bg-indigo-700">
            <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                    <span className="block">Ready to find your perfect room?</span>
                    <span className="block">Start browsing now.</span>
                </h2>
                <p className="mt-4 text-lg leading-6 text-indigo-200">
                    Join thousands of happy renters who found their ideal living space with us.
                </p>
                <Link
                    to={user ? "/add-room" : "/signup"}
                    className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 sm:w-auto"
                >
                    {user ? 'List Your Property' : 'Get Started'}
                </Link>
            </div>
        </div>
    </div>
  );
};

export default Home;