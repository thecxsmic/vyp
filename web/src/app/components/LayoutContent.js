'use client';

import { useState } from 'react';
import Link from 'next/link';
import { UserButton } from "@clerk/nextjs";
import { Plus } from 'lucide-react';
import PinnedChannels from "./PinnedChannels";
import ResearchNotesModal from "./ResearchNotesModal";

export default function LayoutContent({ children }) {
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);

  return (
    <div className="flex h-full overflow-hidden">
      {/* Research Notes Modal - Global */}
      <ResearchNotesModal 
        isOpen={isNotesModalOpen} 
        onClose={() => setIsNotesModalOpen(false)} 
      />

      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-[#050505] flex flex-col shrink-0 hidden md:flex">
        <div className="p-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-black border-b-[5px] border-b-transparent ml-0.5"></div>
            </div>
            <span className="font-black text-xl tracking-tighter text-white uppercase italic">Vyron</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto no-scrollbar">
          <p className="text-[10px] font-black text-[#333] uppercase tracking-[0.2em] px-4 mb-4">Core Intelligence</p>
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-[#888] hover:text-white hover:bg-white/5 transition-all">
            <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            Intelligence
          </Link>
          <Link href="/radar" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-[#888] hover:text-white hover:bg-white/5 transition-all">
            <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            Trend Radar
          </Link>
          <Link href="/channels" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-[#888] hover:text-white hover:bg-white/5 transition-all">
            <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            Ecosystem
          </Link>
          <Link href="/competitors" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-[#888] hover:text-white hover:bg-white/5 transition-all">
            <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            Competitors
          </Link>
          <Link href="/library" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-[#888] hover:text-white hover:bg-white/5 transition-all">
            <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            Research Hub
          </Link>

          <p className="text-[10px] font-black text-[#333] uppercase tracking-[0.2em] px-4 mb-4 mt-10">Research</p>
          <button 
            onClick={() => setIsNotesModalOpen(true)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-[#0070f3] bg-[#0070f3]/5 border border-[#0070f3]/10 hover:bg-[#0070f3]/10 transition-all group text-left"
          >
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
            Quick Note
          </button>
          
          <p className="text-[10px] font-black text-[#333] uppercase tracking-[0.2em] px-4 mb-4 mt-10">Advanced</p>
          <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-[#444] hover:text-[#888] transition-all">
              <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2m0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              Analytics
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-[#444] hover:text-[#888] transition-all">
              <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              Predictive
          </Link>

          <p className="text-[10px] font-black text-[#333] uppercase tracking-[0.2em] px-4 mb-4 mt-10">Pinned Channels</p>
          <PinnedChannels />
        </nav>

        <div className="p-4 mt-auto">
            <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                  <UserButton appearance={{ 
                    elements: { 
                      userButtonAvatarBox: "w-8 h-8 border border-white/10 hover:border-[#0070f3] transition-colors" 
                    } 
                  }} />
                  <div className="overflow-hidden">
                    <p className="text-[10px] font-black text-white uppercase truncate">Session Active</p>
                    <p className="text-[8px] font-bold text-[#444] uppercase tracking-widest">Administrator</p>
                  </div>
              </div>
            </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden bg-black">
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-black/50 backdrop-blur-xl shrink-0">
          <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-[#00dfd8] animate-pulse"></div>
              <span className="text-[10px] font-black text-[#444] uppercase tracking-[0.2em]">Neural Engine v4.2 // Active</span>
          </div>
          <div className="flex items-center gap-6">
              <div className="h-4 w-px bg-white/10"></div>
              <button className="text-[10px] font-black text-[#888] hover:text-white uppercase tracking-widest transition-colors">Documentation</button>
              <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#0070f3]"></div>
                <span className="text-[9px] font-black text-white uppercase tracking-widest">Neural Pro Active</span>
              </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto scroll-smooth">
          {children}
          <footer className="border-t border-white/5 py-12 px-8 mt-20">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-white/10 rounded-full flex items-center justify-center">
                    <div className="w-0 h-0 border-t-[3px] border-t-transparent border-l-[5px] border-l-white/50 border-b-[3px] border-b-transparent ml-0.5"></div>
                  </div>
                  <span className="text-[9px] font-black text-[#222] uppercase tracking-[0.3em]">Built for the future of content ecosystems</span>
              </div>
              <div className="flex gap-8 text-[9px] font-black text-[#333] uppercase tracking-widest">
                  <a href="#" className="hover:text-white transition-colors">Privacy</a>
                  <a href="#" className="hover:text-white transition-colors">Terms</a>
                  <a href="#" className="hover:text-white transition-colors">GitHub</a>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
