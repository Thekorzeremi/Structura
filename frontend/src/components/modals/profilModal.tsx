import { Settings, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProfilModalProps {
  setIsOpen: (isOpen: boolean) => void;
}

export default function Profil_modal({ setIsOpen }: ProfilModalProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const modalItems = [
    { icon: LogOut, name: 'Se déconnecter', onClick: () => { 
      logout();
      setIsOpen(false); 
    }},
  ];

  return (
    <>
      <div className="fixed inset-0" onClick={() => setIsOpen(false)} />
      <div className="absolute bottom-20 left-4 h-auto w-[180px] flex flex-col bg-white rounded-sm shadow z-50">
        <div className="flex flex-row gap-x-3 ml-3 items-center p-2">
          <img className="rounded-full w-[28px] h-[28px]" src="/profile_pic.png" alt="logo" />
          <div className="flex flex-col items-start">
            <span className="text-black text-sm">
              {user ? `${user.firstName} ${user.lastName}` : 'Chargement...'}
            </span>
            {user?.job && (
              <span className="text-gray-500 text-xs">
                {user.job}
              </span>
            )}
          </div>
        </div>
        <div className="w-auto ml-4">
          {modalItems.map((item, index) => (
            <div
              key={index}
              onClick={item.onClick}
              className="flex items-center cursor-pointer p-2 gap-4 text-black text-sm hover:text-gray-500 h-[50px]"
            >
              <item.icon size={20} />
              {item.name}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
