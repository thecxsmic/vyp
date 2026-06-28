"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from "@clerk/nextjs";
import { ArrowLeft, Shield, Scale, Info, RefreshCw } from 'lucide-react';

export default function CookiesPage() {
  const { isSignedIn } = useAuth();
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    setIsDemo(document.cookie.includes("demo_mode=true"));
  }, []);

  const isUserLoggedIn = isSignedIn || isDemo;

  const legalNav = [
    { name: "Privacy Policy", href: "/privacy", icon: Shield, active: false },
    { name: "Terms of Service", href: "/terms", icon: Scale, active: false },
    { name: "Cookie Policy", href: "/cookies", icon: Info, active: true },
    { name: "Refund Policy", href: "/refund", icon: RefreshCw, active: false },
  ];

  return (
    <div className="min-h-screen bg-black text-zinc-300 flex flex-col font-sans selection:bg-brand-volt selection:text-black overflow-x-hidden">
      {/* ── TOP NAVBAR ── */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-900 bg-black/80 backdrop-blur-md px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <Link 
            href="/" 
            className="p-1.5 rounded-lg border border-zinc-800 text-zinc-400 hover:text-white bg-zinc-950 hover:bg-zinc-900 transition-all cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
          
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-brand-volt via-[#00b0ff] to-brand-mint shrink-0" />
            <span className="font-display font-extrabold text-sm text-white tracking-tight uppercase shrink-0">VYRON</span>
            <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-widest pl-2 border-l border-zinc-800 shrink-0">Legal</span>
          </div>
        </div>

        <Link 
          href="/" 
          className="text-zinc-400 hover:text-white transition-colors uppercase tracking-wider text-[10px] font-bold shrink-0"
        >
          {isUserLoggedIn ? "Dashboard →" : "Home →"}
        </Link>
      </header>

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-start relative z-10">
        {/* Sidebar Nav */}
        <aside className="md:col-span-3 flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible no-scrollbar gap-1 border-b md:border-b-0 md:border-r border-zinc-900/60 pb-4 md:pb-0 md:pr-6 shrink-0 sticky top-[72px]">
          <p className="hidden md:block text-[9px] font-black text-zinc-550 uppercase tracking-widest mb-3 px-3">Legal Center</p>
          {legalNav.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider text-left transition-all border shrink-0 md:shrink ${
                  item.active 
                    ? 'bg-zinc-900/60 border-zinc-800 text-white font-extrabold shadow-sm' 
                    : 'border-transparent text-zinc-400 hover:text-white hover:bg-zinc-950'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${item.active ? 'text-brand-volt' : 'text-zinc-500'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </aside>

        {/* Content */}
        <main className="md:col-span-9 space-y-6 text-left min-w-0 max-w-3xl">
          <div>
            <h1 className="font-display font-extrabold text-2.5xl md:text-3.5xl text-white uppercase tracking-tight leading-none">Cookie Policy</h1>
            <p className="text-zinc-500 text-xs mt-2">Last updated: June 28, 2026</p>
          </div>

          <div className="prose prose-invert prose-sm max-w-none text-zinc-455 space-y-6 leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-white text-base font-bold uppercase tracking-wider">1. What Are Cookies</h2>
              <p>
                Cookies are small text files placed on your device by websites you visit. They are used to make websites work, improve efficiency, and provide analytics information to service operators.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-white text-base font-bold uppercase tracking-wider">2. How Vyron Uses Cookies</h2>
              <p>
                We use cookies and local storage tokens to recognize authenticated users and preserve workspace states. Specifically:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>Essential Session Identification:</strong> Clerk implements cookies (e.g., session tokens) to maintain security gates and verify user authentication across requests.</li>
                <li><strong>Functional States:</strong> We utilize a local cookie (`demo_mode`) to track when users are operating in sandbox/preview environments.</li>
                <li><strong>Security & Anti-Abuse:</strong> Payment processing cookies from Razorpay are loaded to process billing securely.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-white text-base font-bold uppercase tracking-wider">3. Managing Your Preferences</h2>
              <p>
                Most web browsers allow you to modify cookie preferences through browser setting menus. Please note that disabling essential cookies will prevent authentication routing and block access to workspace features.
              </p>
            </section>
          </div>
        </main>
      </div>

      {/* ── FOOTER ── */}
      <footer className="border-t border-zinc-900 py-6 text-center text-[9px] font-mono text-zinc-655 font-bold uppercase tracking-widest relative z-10 bg-black">
        © 2026 Vyron Intelligence Platform · All Systems Protected
      </footer>
    </div>
  );
}
