import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { MobileNav } from '../components/MobileNav';
import { useIsMobile } from '../hooks/useMediaQuery';
import { AnimatedBackground } from '../components/effects/AnimatedBackground';
import { ScanLines } from '../components/effects/ScanLines';
import { AIPresence } from '../components/effects/AIPresence';

export default function AdminLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div className="flex min-h-screen bg-jarvis-bg-dark relative">
      {/* Animated Background Effects */}
      <AnimatedBackground />
      <ScanLines />
      <AIPresence />

      {/* Desktop Sidebar */}
      {!isMobile && <Sidebar />}

      {/* Mobile Header */}
      {isMobile && (
        <header className="fixed top-0 left-0 right-0 z-40 bg-jarvis-bg-sidebar border-b border-jarvis-red/20 px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-display text-jarvis-orange glow-orange">JARVIS</h1>
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="text-jarvis-text-muted hover:text-jarvis-orange transition-colors p-1"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </header>
      )}

      {/* Mobile Drawer */}
      {isMobile && (
        <MobileNav isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      )}

      {/* Main Content */}
      <main className={`flex-1 overflow-y-auto ${isMobile ? 'pt-14' : ''}`}>
        <div className="container mx-auto px-6 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
