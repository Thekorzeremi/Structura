import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Settings, LogOut } from 'lucide-react';

export default function Profil_modal({ setIsOpen }) {
    const location = useLocation();
    
    const modalItems = [
        { icon: Settings, path: '/settings', name: 'Paramètres' },
        { icon: LogOut, path: '/logout', name: 'Se deconnecter' },
      ];

      return (
        <>
          <div 
            className="fixed inset-0" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute bottom-24 left-4 h-[25vh] w-[220px] flex flex-col bg-white rounded-sm shadow z-50">
            {modalItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className="flex items-center gap-2 text-black hover:text-gray-300"
                >
                  <item.icon size={20} />
                  {item.name}
                </Link>
              ))}
          </div>
        </>
      );
}