import { useState } from 'react';
import { Outlet } from 'react-router';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { MobileNav } from '../components/MobileNav';
import { Sheet, SheetContent } from '../components/ui/sheet';

export function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuClick={() => setMobileMenuOpen(true)} />
      
      <div className="flex">
        {/* Sidebar desktop */}
        <div className="hidden md:block sticky top-16 h-[calc(100vh-4rem)]">
          <Sidebar />
        </div>

        {/* Sidebar mobile */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent side="left" className="p-0 w-64">
            <Sidebar />
          </SheetContent>
        </Sheet>

        {/* Contenu principal */}
        <main className="flex-1 min-h-[calc(100vh-4rem)] pb-20 md:pb-6">
          <Outlet />
        </main>
      </div>

      {/* Navigation mobile */}
      <MobileNav />
    </div>
  );
}
