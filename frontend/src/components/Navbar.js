import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { House, Calendar, Hammer, Users, Moon, Sun } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const [isDark, setIsDark] = useState(false);

  const navbarItems = [
    { icon: House, path: '/', name: 'Accueil' },
    { icon: Calendar, path: '/assignment', name: 'Affectations' },
    { icon: Hammer, path: '/worksite', name: 'Chantiers' },
    { icon: Users, path: '/people', name: 'Personnes' },
  ];

  return (
    <nav className="fixed left-0 top-0 h-screen w-[75px] flex flex-col items-center justify-between py-6">
      <div className="flex flex-col items-center">
        <img className="rounded-full w-[48px] h-[48px]" src="/assets/logo.png" alt="logo" />
        <ul className="flex flex-col rounded-lg p-3 gap-2">
          {navbarItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`p-3 rounded-xl transition-all duration-200 group relative ${
                  isActive ? 'text-[#267de1]' : 'text-black hover:text-gray-600'
                }`}
              >
                <Icon size={20} />
                <span className="absolute left-10 ml-4 bottom-3.5 px-2 py-1 bg-gray-200 text-black text-sm rounded-sm opacity-0 group-hover:opacity-100 transition-all ease-in-out duration-100 group-hover:delay-[800ms] pointer-events-none whitespace-nowrap">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </ul>
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="p-3 rounded-xl transition-all duration-200 group relative text-black hover:text-gray-600 hover:cursor-pointer">
          <span onClick={() => setIsDark(!isDark)}>
            {isDark ? <Moon size={20} /> : <Sun size={20} />}
            <span className="absolute left-10 ml-4 bottom-3.5 px-2 py-1 bg-gray-200 text-black text-sm rounded-sm opacity-0 group-hover:opacity-100 transition-all ease-in-out duration-100 group-hover:delay-[800ms] pointer-events-none whitespace-nowrap">
              {isDark ? 'Dark mode' : 'Light mode'}
            </span>
          </span>
        </div>
        <img className="rounded-full w-[48px] h-[48px]" src="/assets/logo.png" alt="logo" />
      </div>
    </nav>
  );
}
