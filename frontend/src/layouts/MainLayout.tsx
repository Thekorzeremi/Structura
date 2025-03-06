import { ReactNode } from 'react';
import Navbar from '../components/Navbar';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex">
      <Navbar />
      <main className="flex-1 ml-[75px] min-h-screen bg-[#f7f9fc]">
        {children}
      </main>
    </div>
  );
}
