"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from "@clerk/nextjs";
import { ArrowLeft, Shield, Scale, Info, RefreshCw } from 'lucide-react';

export default function TermsPage() {
  const { isSignedIn } = useAuth();
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    setIsDemo(document.cookie.includes("demo_mode=true"));
  }, []);

  const isUserLoggedIn = isSignedIn || isDemo;

  const legalNav = [
    { name: "Privacy Policy", href: "/privacy", icon: Shield, active: false },
    { name: "Terms of Service", href: "/terms", icon: Scale, active: true },
    { name: "Cookie Policy", href: "/cookies", icon: Info, active: false },
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
            <h1 className="font-display font-extrabold text-2.5xl md:text-3.5xl text-white uppercase tracking-tight leading-none">Terms of Service</h1>
            <p className="text-zinc-500 text-xs mt-2">Last updated: June 28, 2026</p>
          </div>

          <div className="prose prose-invert prose-sm max-w-none text-zinc-455 space-y-6 leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-white text-base font-bold uppercase tracking-wider">1. Agreement to Terms</h2>
              <p>
                By accessing or using the Vyron platform (the &quot;Service&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, do not access or use the platform.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-white text-base font-bold uppercase tracking-wider">2. Registration & Accounts</h2>
              <p>
                To access the workspace tools, you must authenticate through our account login interface powered by Clerk. You agree to provide accurate registration details and maintain the security of your login sessions. You are entirely responsible for all activities occurring under your credentials.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-white text-base font-bold uppercase tracking-wider">3. Subscription, Trials & Billing</h2>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>Pro Plan:</strong> Subscription payments are processed via Razorpay. We offer Pro access at a recurring monthly rate of ₹499.</li>
                <li><strong>7-Day Free Trial:</strong> Users may enroll in a 7-day trial period to test intelligence features. You may cancel your trial within the setting interface before renewal to avoid payment.</li>
                <li><strong>Automatic Renewal:</strong> Following the trial, subscriptions automatically renew on a monthly cycle. Payments are routed through secure partner portals (Razorpay).</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-white text-base font-bold uppercase tracking-wider">4. Acceptable Use Policy</h2>
              <p>
                You agree not to abuse, scrap, or systematically crawl Vyron content APIs. You agree not to attempt to extract proprietary metrics calculators or break site security mechanisms. By linking YouTube channels or retrieving public metrics, you agree to comply strictly with the <a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener noreferrer" className="text-brand-volt underline">YouTube Terms of Service</a>.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-white text-base font-bold uppercase tracking-wider">5. Service Availability & Disclaimers</h2>
              <p>
                Vyron provides metric snapshots and opportunity indices for informational reference only. We do not guarantee search metric accuracy, channel milestone projections, or specific viral performance results. The service is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-white text-base font-bold uppercase tracking-wider">6. Contact Information</h2>
              <p>
                For legal queries regarding terms, licensing, or services, email support at <span className="text-white font-mono">[CONTACT_EMAIL]</span>.
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
