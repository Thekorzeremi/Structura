import React from 'react';
import { House, Calendar, Hammer, Users, Moon, Sun } from 'lucide-react';

const Navbar = () => {
  return (
    <div className="w-[75px] h-full fixed left-0 top-0 flex flex-col justify-between">
      <div className="h-auto p-2 flex flex-col items-center justify-center">
         <img className="rounded-full w-[48px] h-[48px] m-2" src="/assets/logo.png" alt="logo"/>
         <div className="w-full mt-4 h-auto flex flex-col items-center justify-center gap-y-2 ">
            <House className='m-3' size={20} />
            <Calendar className='m-3' size={20} />
            <Hammer className='m-3' size={20} />
            <Users className='m-3' size={20} />
         </div>
      </div>
      <div className="h-auto flex flex-col items-center gap-y-2 justify-center p-4">
        <Moon className='m-3' size={20} />
        <img className="rounded-full w-[48px] h-[48px] object-cover mt-4" src="/assets/profile_pic.png" alt="logo"/>
      </div>
    </div>
  );
};

export default Navbar;
