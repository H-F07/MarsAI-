import { Film, Heart, Eye } from "lucide-react";

export default function FilmCard({ film, onClick, onLike, isLiked = false }) {
  const getStatusColor = (status) => {
    const colors = {
      APPROVED: 'bg-green-100 text-green-800',
      PENDING: 'bg-yellow-100 text-yellow-800',
      REJECTED: 'bg-red-100 text-red-800',
      SELECTION_OFFICIELLE: 'bg-purple-100 text-purple-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative bg-gray-800 h-40 flex items-center justify-center">
        <Film className="w-12 h-12 text-gray-400" />
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg truncate">{film.title}</h3>
        {film.director && (
          <p className="text-sm text-gray-600">Par {film.director}</p>
        )}

        {film.status && (
          <div className="mt-2">
            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(film.status)}`}>
              {film.status}
            </span>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={onClick}
            className="text-sky-400 hover:text-sky-500 flex items-center gap-1 text-sm"
          >
            <Eye size={16} />
            Voir
          </button>
          <button
            onClick={onLike}
            className={`flex items-center gap-1 text-sm ${
              isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
            }`}
          >
            <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>
    </div>
  );
}
