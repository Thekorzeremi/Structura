import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Phone } from 'lucide-react';
import { useEffect } from 'react';

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

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event;
}

export default function EventModal({ isOpen, onClose, event }: EventModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!event || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 animate-fadeIn" onClick={onClose}>
      <div 
        className="fixed inset-0 bg-black/30" 
        aria-hidden="true" 
      />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div 
          className="w-[800px] bg-white rounded-lg overflow-hidden animate-slideIn"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col divide-y divide-[#E5E5E5]">
            {/* Section Détails de l'affectation */}
            <div className="p-6 flex justify-between items-center">
              <div className="flex items-start gap-4">
                <img 
                  src={`/worksite/1.jpg`} 
                  className="w-16 h-16 object-cover rounded-full"
                  alt={event.worksite.title}
                />
                <div className="flex flex-col">
                  <span className="text-lg font-semibold">{event.worksite.title}</span>
                  <span className="text-sm text-black font-semibold">Période : <span className="text-sm text-gray-500 font-normal">{format(parseISO(event.start_date), 'dd/MM/yyyy (HH:mm)', { locale: fr })} - {format(parseISO(event.end_date), 'dd/MM/yyyy (HH:mm)', { locale: fr })}</span></span>
                  <span className="text-sm text-black font-semibold">Lieu : <span className="text-sm text-gray-500 font-normal">{event.worksite.place}</span></span>
                </div>
              </div>
              <div className="">
                <img src='/maps.png' onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.worksite.place)}`, '_blank')} className="w-80 hover:cursor-pointer h-16 object-cover rounded-lg" alt="Itinéraire" />
              </div>
            </div>

            {/* Section Chef de chantier */}
            <div className="p-6 flex gap-4 justify-between">
              <div className="flex items-start gap-4"> 
                <img src='/default_profile.jpg' className="w-16 h-16 object-cover rounded-full" alt="Chef de chantier" />
                <div className="flex flex-col">
                    <span className="text-lg font-semibold">Chef de Chantier</span>
                    <span className="text-sm text-black font-semibold">Identité : <span className="text-sm text-gray-500 font-normal">{event.worksite.manager.firstName} {event.worksite.manager.lastName}</span></span>
                    <span className="text-sm text-black font-semibold">Email : <span className="text-sm text-gray-500 font-normal">{event.worksite.manager.email}</span></span>
                </div>
              </div>
              <div className="flex items-end gap-4">
                <div onClick={() => window.location.href = "tel:+336000000000"} className="flex items-center gap-2 hover:cursor-pointer border rounded-lg p-2 border-green-500">
                  <Phone size={20} className="text-green-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}