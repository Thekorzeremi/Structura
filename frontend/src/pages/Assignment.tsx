import { useEffect, useState } from 'react';
import { eventService } from '../services/eventService';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useAuth } from '../contexts/AuthContext';
import Select from '../components/ui/Select';
import EventModal from '../components/modals/eventModal';

interface Event {
  id: number;
  type: string;
  status: string;
  start_date: string;
  end_date: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  worksite: {
    id: number;
    title: string;
    start_date: string;
    end_date: string;
    description: string;
    place: string;
    manager: {
      id: number;
      email: string;
      firstName: string;
      lastName: string;
    };
  };
}

const filterItems = [
  { name: `En cours`, value: 'current' },
  { name: 'Passé', value: 'past' },
  { name: 'A venir', value: 'future' },
];

export default function Assignment() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('current');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
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

  const getFilteredEvents = () => {
    const now = new Date();
    return events
      .filter(event => event.type === 'assignment')
      .filter(event => {
        const endDate = parseISO(event.end_date);
        const startDate = parseISO(event.start_date);

        switch (filter) {
          case 'current':
            return startDate <= now && endDate >= now;
          case 'past':
            return endDate < now;
          case 'future':
            return startDate > now;
          default:
            return true;
        }
      });
  };

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
      {user?.roles?.includes('ROLE_ADMIN') ? (
        <div className="flex flex-col gap-6">
          <span className="text-3xl font-semibold">Gestion affectations</span>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <span className="text-3xl font-semibold">Mes affectations</span>
        </div> // Fermeture du div manquante
      )}

      <div className="mt-8">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#007AFF]"></div>
          </div>
        ) : events.length === 0 ? (
          <div className="text-gray-500 text-center py-8 text-sm">Aucune affectation trouvée</div>
        ) : (
          <div className="p-8 bg-white rounded-lg grid gap-4 mt-4">
            <Select items={filterItems} value={filter} onChange={value => setFilter(value)} />
            {getFilteredEvents().map(event => (
              <div
                key={event.id}
                className="bg-white rounded-lg p-4 shadow-sm border border-[#E5E5E5] hover:border-[#007AFF] transition-colors cursor-pointer"
                onClick={() => {
                  setSelectedEvent(event);
                  setModalOpen(true);
                }}
              >
                <div className="flex items-center gap-4 justify-between">
                  <div className="flex gap-4">
                    <img src={`/worksite/1.jpg`} className="w-12 h-12 object-cover rounded-full" />
                    <div className="flex flex-col">
                      <span className="text-lg font-semibold">{event.worksite.title}</span>
                      <span className="text-md text-gray-500">{event.worksite.place}</span>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500 font-bold">
                      Du <span className="font-normal">{event.start_date}</span>
                    </span>
                    <span className="text-xs text-gray-500 font-bold">
                      Au <span className="font-normal">{event.end_date}</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <EventModal
        event={selectedEvent || events[0]}
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedEvent(null);
        }}
      />
    </div>
  );

}
