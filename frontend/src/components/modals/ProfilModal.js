import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Settings, LogOut } from 'lucide-react';

export default function Profil_modal({ setIsOpen }) {
    const location = useLocation();
    
    const modalItems = [
        { icon: Settings, path: '/settings', name: 'Paramètres' },
        { icon: LogOut, path: '/logout', name: 'Se déconnecter' },
      ];

      const profilInfos = [
        { first_name: 'Remi', last_name: 'Lacroix', job: 'Electricien' }
      ]

      return (
        <>
          <div 
            className="fixed inset-0" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute bottom-24 left-4 h-auto w-[200px] flex flex-col bg-white rounded-sm shadow z-50">
            <div className="flex flex-row gap-x-3 ml-3 items-center p-2">
              <img className="rounded-full w-[28px] h-[28px]" src="/assets/logo.png" alt="logo" />
              <div className="flex flex-col items-start">
                <span className="text-black text-sm">{profilInfos.map((info) => info.first_name)} {profilInfos.map((info) => info.last_name)}</span>
                <span className="text-gray-500 text-xs">{profilInfos.map((info) => info.job)}</span>
              </div>
            </div>
            <div className="w-auto ml-4">
                {modalItems.map((item, index) => (
                    <Link
                    key={index}
                    to={item.path}
                    className="flex items-center no-underline p-2 gap-4 text-black text-sm hover:text-gray-900 h-[50px]  " 
                    >
                    <item.icon size={20} />
                    {item.name}
                    </Link>
                ))}
            </div>
          </div>
        </>
      );
}