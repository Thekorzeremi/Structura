import { useEffect, useState } from 'react';
import { eventService } from '../services/eventService';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useAuth } from '../contexts/AuthContext';

interface Event {
  id: number;
  type: string;
  status: string;
  start_date: string;
  end_date: string;
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
  };
}

export default function Assignment() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { token, user } = useAuth();
  const decodedToken = token ? JSON.parse(atob(token.split('.')[1])) : null;
  const userEmail = decodedToken?.username;

  useEffect(() => {
    const fetchEvents = async () => {
      if (!userEmail) {
        setLoading(false);
        return;
      }

      try {
        const data = await eventService.getMyEvents(userEmail);
        setEvents(data);
        console.log('Events:', data);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, [userEmail]);

  const fetchMyAssignmentsOnly = () => {
    return events.filter((event) => event.type === 'assignment');
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'en cours':
        return 'bg-[#007AFF] text-white';
      case 'terminé':
        return 'bg-green-500 text-white';
      case 'annulé':
        return 'bg-red-500 text-white';
      case 'planifié':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="pl-8 pt-6">
      <span className="text-3xl font-semibold">
        {user?.roles?.some((role) => ['MANAGER', 'ADMIN'].includes(role))
          ? 'Gestion affectations'
          : 'Mes affectations'}
      </span>
      
      <div className="mt-8">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#007AFF]"></div>
          </div>
        ) : events.length === 0 ? (
          <div className="text-gray-500 text-center py-8 text-sm">
            Aucune affectation trouvée
          </div>
        ) : (
          <div className="grid gap-4">
            {fetchMyAssignmentsOnly().map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-lg p-4 shadow-sm border border-[#E5E5E5] hover:border-[#007AFF] transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                        {event.status}
                      </span>
                      <span className="text-sm font-medium text-gray-900">{event.type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-shrink-0">
                        <img
                          className="h-6 w-6 rounded-full"
                          src="/profile_pic.png"
                          alt={`${event.user.firstName} ${event.user.lastName}`}
                        />
                      </div>
                      <div className="text-xs text-gray-500">
                        {event.user.firstName} {event.user.lastName}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-900">
                      {format(new Date(event.start_date), 'dd MMM yyyy', { locale: fr })}
                    </div>
                    <div className="text-xs text-gray-500">
                      {format(new Date(event.start_date), 'HH:mm')} - {format(new Date(event.end_date), 'HH:mm')}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}