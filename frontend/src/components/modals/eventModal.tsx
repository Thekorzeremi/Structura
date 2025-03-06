import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Phone, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';

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

interface UpdatedEvent {
  type: string;
  status: string;
  start_date: string;
  end_date: string;
  user: {
    id: number;
  };
  worksite: {
    id: number;
  };
}

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event?: Event;
  isEditing?: boolean;
  onSave?: (event: UpdatedEvent) => void;
}

export default function EventModal({ isOpen, onClose, event, isEditing, onSave }: EventModalProps) {
  const [editedEvent, setEditedEvent] = useState<UpdatedEvent>({
    type: 'assignment',
    status: 'planifié',
    start_date: '',
    end_date: '',
    user: { id: 0 },
    worksite: { id: 0 }
  });

  useEffect(() => {
    if (event && isEditing) {
      setEditedEvent({
        type: event.type,
        status: event.status,
        start_date: event.start_date,
        end_date: event.end_date,
        user: { id: event.user.id },
        worksite: { id: event.worksite.id }
      });
    }
  }, [event, isEditing]);

  useEffect(() => {
    if (!isOpen) return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  if (!isEditing && event) {
    return (
      <div className="fixed inset-0 z-50 animate-fadeIn" onClick={onClose}>
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <div 
            className="w-[800px] bg-white rounded-lg overflow-hidden animate-slideIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col divide-y divide-[#E5E5E5]">
              {/* Section Détails de l'affectation */}
              <div className="p-6 space-y-6">
                <div className="flex justify-between items-start">
                  <div className="flex gap-6">
                    <img 
                      src={`/worksite/1.jpg`} 
                      className="w-24 h-24 object-cover rounded-lg"
                      alt={event.worksite.title}
                    />
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-semibold">{event.worksite.title}</h2>
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          event.status.toLowerCase() === 'en cours' ? 'bg-[#007AFF] text-white' :
                          event.status.toLowerCase() === 'terminé' ? 'bg-green-500 text-white' :
                          event.status.toLowerCase() === 'annulé' ? 'bg-red-500 text-white' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {event.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500">
                        <MapPin size={16} />
                        <span>{event.worksite.place}</span>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm">
                          <span className="text-gray-500">Du </span>
                          <span className="font-medium">{format(parseISO(event.start_date), 'dd/MM/yyyy (HH:mm)', { locale: fr })}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-500">Au </span>
                          <span className="font-medium">{format(parseISO(event.end_date), 'dd/MM/yyyy (HH:mm)', { locale: fr })}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.worksite.place)}`, '_blank')}
                    className="px-4 py-2 text-[#007AFF] border border-[#007AFF] rounded-lg hover:bg-[#007AFF] hover:text-white transition-colors"
                  >
                    Voir l'itinéraire
                  </button>
                </div>
              </div>

              {/* Section Chef de chantier */}
              <div className="p-6">
                <div className="flex justify-between items-center">
                  <div className="flex gap-6">
                    <img 
                      src="/default_profile.jpg" 
                      className="w-16 h-16 object-cover rounded-full"
                      alt="Chef de chantier"
                    />
                    <div className="space-y-3">
                      <h3 className="text-xl font-semibold">Chef de Chantier</h3>
                      <div className="space-y-1 text-sm">
                        <div>
                          <span className="text-gray-500">Identité : </span>
                          <span>{event.worksite.manager.firstName} {event.worksite.manager.lastName}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Email : </span>
                          <span>{event.worksite.manager.email}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => window.location.href = "tel:+336000000000"}
                    className="flex items-center gap-2 px-4 py-2 text-green-600 border border-green-600 rounded-lg hover:bg-green-50 transition-colors"
                  >
                    <Phone size={20} />
                    <span>Appeler</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Mode édition
  return (
    <div className="fixed inset-0 z-50 animate-fadeIn" onClick={onClose}>
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div 
          className="w-[600px] bg-white rounded-lg overflow-hidden animate-slideIn"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 space-y-6">
            <h2 className="text-2xl font-semibold">
              {event ? 'Modifier l\'affectation' : 'Nouvelle affectation'}
            </h2>
            <form className="space-y-4" onSubmit={(e) => {
              e.preventDefault();
              onSave?.(editedEvent);
            }}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Statut
                </label>
                <select
                  value={editedEvent.status}
                  onChange={(e) => setEditedEvent({ ...editedEvent, status: e.target.value })}
                  className="w-full px-3 py-2 border border-[#E5E5E5] rounded-lg focus:outline-none focus:border-[#007AFF]"
                >
                  <option value="planifié">Planifié</option>
                  <option value="en cours">En cours</option>
                  <option value="terminé">Terminé</option>
                  <option value="annulé">Annulé</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date de début
                </label>
                <input
                  type="datetime-local"
                  value={editedEvent.start_date.slice(0, 16)}
                  onChange={(e) => setEditedEvent({ ...editedEvent, start_date: e.target.value })}
                  className="w-full px-3 py-2 border border-[#E5E5E5] rounded-lg focus:outline-none focus:border-[#007AFF]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date de fin
                </label>
                <input
                  type="datetime-local"
                  value={editedEvent.end_date.slice(0, 16)}
                  onChange={(e) => setEditedEvent({ ...editedEvent, end_date: e.target.value })}
                  className="w-full px-3 py-2 border border-[#E5E5E5] rounded-lg focus:outline-none focus:border-[#007AFF]"
                />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-500 border border-[#E5E5E5] rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#007AFF] text-white rounded-lg hover:bg-[#0056b3] transition-colors"
                >
                  {event ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}