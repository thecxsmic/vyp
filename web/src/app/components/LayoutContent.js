'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton } from "@clerk/nextjs";
import { Plus, Menu, X, Search, Zap, Users, Trophy, BookOpen, BarChart3, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PinnedChannels from "./PinnedChannels";
import ResearchNotesModal from "./ResearchNotesModal";

const navItems = [
  { name: 'Search', href: '/', icon: Search },
  { name: 'Trends', href: '/radar', icon: Zap },
  { name: 'Channels', href: '/channels', icon: Users },
  { name: 'Competitors', href: '/competitors', icon: Trophy },
  { name: 'Library', href: '/library', icon: BookOpen },
];

const secondaryNavItems = [
  { name: 'Analytics', href: '#', icon: BarChart3 },
  { name: 'Predictions', href: '#', icon: Activity },
];

export default function LayoutContent({ children }) {
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const SidebarContent = () => (
    <>
      <div className="p-6">
        <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-80 group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-geist-success via-[#00dfd8] to-geist-success animate-logo-gradient shadow-[0_0_15px_rgba(0,112,243,0.3)] group-hover:shadow-[0_0_20px_rgba(0,112,243,0.5)] transition-shadow" />
          <span className="font-bold text-xl tracking-tight text-white">Vyron</span>
        </Link>
      </div>

      <nav className="flex-1 px-3 space-y-0.5 mt-2 overflow-y-auto no-scrollbar">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.name}
              href={item.href} 
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                isActive 
                  ? 'text-white bg-white/10' 
                  : 'text-accents-5 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-accents-4'}`} strokeWidth={2} />
              {item.name}
            </Link>
          );
        })}

        <div className="pt-8 pb-2 px-3">
          <p className="text-[10px] font-bold text-accents-4 uppercase tracking-wider">Research</p>
        </div>
        
        <button 
          onClick={() => setIsNotesModalOpen(true)}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-geist-success hover:bg-geist-success/5 transition-all group text-left"
        >
          <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" strokeWidth={2.5} />
          New Note
        </button>
      </nav>

      <div className="p-4 border-t border-white/5 mt-auto">
        <div className="flex items-center gap-3 px-2">
            <UserButton appearance={{ 
              elements: { 
                userButtonAvatarBox: "w-8 h-8 border border-white/10" 
              } 
            }} />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">Pro Account</p>
              <p className="text-[10px] text-accents-4 font-medium uppercase tracking-tighter">Status: Active</p>
            </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex h-full overflow-hidden bg-black text-white font-sans selection:bg-geist-success selection:text-white">
      <ResearchNotesModal 
        isOpen={isNotesModalOpen} 
        onClose={() => setIsNotesModalOpen(false)} 
      />

      {/* Desktop Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-black flex flex-col shrink-0 hidden md:flex">
        <SidebarContent />
      </aside>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] md:hidden"
            />
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 bg-black border-r border-white/10 z-[101] flex flex-col md:hidden shadow-2xl"
            >
              <SidebarContent />
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute top-6 right-4 p-2 text-accents-4 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-14 border-b border-white/5 flex items-center justify-between px-4 md:px-8 bg-black/80 backdrop-blur-md shrink-0 sticky top-0 z-50">
          <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 -ml-2 text-accents-4 hover:text-white md:hidden transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-geist-success shadow-[0_0_8px_rgba(0,112,243,0.5)]"></div>
                <span className="text-xs font-medium text-accents-5">System Online</span>
              </div>
          </div>
          <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                <Zap className="w-3 h-3 text-geist-success" fill="currentColor" />
                <span className="text-[10px] font-bold text-white uppercase tracking-tight">Pro</span>
              </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto scroll-smooth custom-scrollbar relative">
          <div className="max-w-[1600px] mx-auto min-h-full flex flex-col">
            <div className="flex-1">
              {children}
            </div>
            
            <footer className="border-t border-white/5 py-10 px-8 mt-auto">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-2.5">
                    <div className="w-4 h-4 bg-white/10 rounded-full flex items-center justify-center">
                      <div className="w-0 h-0 border-t-[2.5px] border-t-transparent border-l-[4px] border-l-white/40 border-b-[2.5px] border-b-transparent ml-0.5"></div>
                    </div>
                    <span className="text-[10px] font-medium text-accents-4 tracking-tight">© 2026 Vyron Intelligence. All rights reserved.</span>
                </div>
                <div className="flex gap-6 text-[11px] font-medium text-accents-4">
                    <a href="#" className="hover:text-white transition-colors">Privacy</a>
                    <a href="#" className="hover:text-white transition-colors">Terms</a>
                    <a href="#" className="hover:text-white transition-colors">GitHub</a>
                </div>
              </div>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
