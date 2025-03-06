import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { House, Calendar, Hammer, Users, Moon, Sun } from 'lucide-react';
import Profil_modal from './modals/profilModal';

export default function Navbar() {
    const { roles } = useAuth();
    const [isDark, setIsDark] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const location = useLocation();

    const navbarItems = [
        { icon: House, path: '/', name: 'Accueil', roles: ['ROLE_USER', 'ROLE_ADMIN'] },
        {
            icon: Calendar,
            path: '/assignment',
            name: 'Affectations',
            roles: ['ROLE_USER', 'ROLE_ADMIN'],
        },
        { icon: Hammer, path: '/worksite', name: 'Chantiers', roles: ['ROLE_ADMIN'] },
        { icon: Users, path: '/people', name: 'Personnes', roles: ['ROLE_ADMIN'] },
    ];

    const filteredNavbarItems = roles
        ? navbarItems.filter((item) => item.roles.some((role) => roles.includes(role)))
        : navbarItems;

    return (
        <nav className="fixed left-0 top-0 h-screen w-[75px] flex flex-col items-center justify-between py-6 bg-[#f7f9fc]">
            <div className="absolute h-full top-0 w-[1px] bg-gray-300 left-[75px]"></div>
            <div className="flex flex-col items-center">
                <img className="rounded-full w-[48px] h-[48px]" src="/logo.png" alt="logo" />
                <ul className="flex flex-col rounded-lg p-3 gap-2">
                    {filteredNavbarItems.map((item) => {
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
                                <span className="absolute left-8 ml-7 bottom-3 px-2 py-1 bg-gray-200 text-black text-sm rounded-sm opacity-0 group-hover:opacity-100 transition-all ease-in-out duration-100 group-hover:delay-[800ms] pointer-events-none whitespace-nowrap">
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
                        <span className="absolute left-8 ml-7 bottom-3 px-2 py-1 bg-gray-200 text-black text-sm rounded-sm opacity-0 group-hover:opacity-100 transition-all ease-in-out duration-100 group-hover:delay-[800ms] pointer-events-none whitespace-nowrap">
                            {isDark ? 'Dark mode' : 'Light mode'}
                        </span>
                    </span>
                </div>
                    <img
                        className="rounded-full w-[48px] h-[48px] object-cover cursor-pointer"
                        src="/profile_pic.png"
                        alt="logo"
                        onClick={() => setIsProfileModalOpen(!isProfileModalOpen)}
                    />
                    {isProfileModalOpen && <Profil_modal setIsOpen={setIsProfileModalOpen} />}
            </div>
        </nav>
    );
}
