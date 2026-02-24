import { Calendar, Users, MapPin } from "lucide-react";

export default function EventCard({ event, onClick }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer"
    >
      <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
      
      <div className="space-y-2 text-sm text-gray-600">
        {event.startDate && (
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-sky-400" />
            <span>{formatDate(event.startDate)}</span>
          </div>
        )}
        
        {event.location && (
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-sky-400" />
            <span>{event.location}</span>
          </div>
        )}

        {event.registeredCount && (
          <div className="flex items-center gap-2">
            <Users size={16} className="text-sky-400" />
            <span>{event.registeredCount} inscrits</span>
          </div>
        )}
      </div>

      {event.description && (
        <p className="mt-3 text-sm text-gray-700 line-clamp-2">
          {event.description}
        </p>
      )}
    </div>
  );
}
