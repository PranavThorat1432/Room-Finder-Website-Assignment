import { Link } from 'react-router-dom';

const RoomCard = ({ room, onDelete, showActions = false }) => {
  const handleDeleteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this listing?')) {
      onDelete(room.id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
      <Link to={`/rooms/${room.id}`} className="block">
      <div className="h-48 bg-gray-200 relative">
        {room.images && room.images.length > 0 ? (
          <img
            src={room.images[0]}
            alt={room.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <span className="text-gray-400">No image available</span>
          </div>
        )}
        {onDelete && (
          <button
            onClick={handleDeleteClick}
            className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors z-10"
            title="Delete listing"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-1">{room.title}</h3>
          <span className="text-lg font-bold text-indigo-600">₹{room.rent?.toLocaleString()}/month</span>
        </div>
        <p className="text-gray-600 text-sm mb-2 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {room.location}
        </p>
        <div className="flex flex-wrap gap-2 mt-2 mb-3">
          <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded">
            {room.property_type}
          </span>
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
            {room.tenant_preference}
          </span>
        </div>
        {showActions && (
          <div className="mt-4 flex justify-between">
            <Link
              to={`/rooms/${room.id}`}
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
            >
              View Details →
            </Link>
            <Link
              to={`/edit-room/${room.id}`}
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
            >
              Edit
            </Link>
          </div>
        )}
      </div>
      </Link>
    </div>
  );
};

export default RoomCard;
