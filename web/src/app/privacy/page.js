"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from "@clerk/nextjs";
import { ArrowLeft, Shield, Scale, Info, RefreshCw } from 'lucide-react';

export default function PrivacyPage() {
  const { isSignedIn } = useAuth();
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    setIsDemo(document.cookie.includes("demo_mode=true"));
  }, []);

  const isUserLoggedIn = isSignedIn || isDemo;

  const legalNav = [
    { name: "Privacy Policy", href: "/privacy", icon: Shield, active: true },
    { name: "Terms of Service", href: "/terms", icon: Scale, active: false },
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
            <h1 className="font-display font-extrabold text-2.5xl md:text-3.5xl text-white uppercase tracking-tight leading-none">Privacy Policy</h1>
            <p className="text-zinc-500 text-xs mt-2">Last updated: June 28, 2026</p>
          </div>

          <div className="prose prose-invert prose-sm max-w-none text-zinc-455 space-y-6 leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-white text-base font-bold uppercase tracking-wider">1. Information We Collect</h2>
              <p>
                To provide the Vyron creator intelligence suite, we collect and process the following categories of personal and usage data:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>Account Credentials:</strong> We utilize Clerk for authentication. Your username, email address, profile metadata, and linked SSO social credentials are collected and managed securely by Clerk.</li>
                <li><strong>Connected Channel Data:</strong> If you connect your YouTube channel, we pull read-only channel metadata (channel title, ID, thumbnail) and public channel performance metrics (subscriber counts, public view volume) through the Google/YouTube API Services.</li>
                <li><strong>Workspace Inputs:</strong> We collect and save query strings, saved competitor handles/IDs, saved videos, outlines, and content notebook entries that you construct in the platform workspace.</li>
                <li><strong>Payment & Billing Data:</strong> Subscriptions are processed via Razorpay. We do not store credit card numbers on our servers; billing transactions, trial logs, and payment statuses are managed by Razorpay.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-white text-base font-bold uppercase tracking-wider">2. How We Use and Process Data</h2>
              <p>
                Your information is used solely to run the platform workspace, identify rising content trends, and compute analytics. Specifically:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>We analyze search term queries and vertical metrics to calculate customized Opportunity and Virality scores.</li>
                <li>We display saved reference assets, outlines, and metrics directly inside your private account library dashboard.</li>
                <li>We aggregate public competitor vertical channels to draw growth benchmarks and growth curves.</li>
              </ul>
              <p className="text-zinc-400">
                <strong>Important:</strong> We do not sell user data to third-party brokers. Your private notebook outlines and drafts are treated as confidential assets and are not shared with external actors.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-white text-base font-bold uppercase tracking-wider">3. Third-Party Data Processors</h2>
              <p>
                We coordinate with specific security-cleared third-party services to deliver core features:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>Authentication:</strong> Clerk handles authentication routing and profile data protection.</li>
                <li><strong>Payments & Trial Verification:</strong> Razorpay handles payment flows, billing logs, and membership states.</li>
                <li><strong>Data Retrieval Services:</strong> YouTube API Services are used to verify public statistics. By using Vyron, you agree to be bound by the <a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener noreferrer" className="text-brand-volt underline">YouTube Terms of Service</a> and the <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-brand-volt underline">Google Privacy Policy</a>.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-white text-base font-bold uppercase tracking-wider">4. Security Measures & Retention</h2>
              <p>
                We employ standard TLS encryption protocols to protect all data transferred between your browser and our APIs. Read-only channel authorization tokens are kept encrypted. We retain account metadata as long as your workspace account is active. You may request data deletion or revoke connected API tokens at any time through your settings panel.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-white text-base font-bold uppercase tracking-wider">5. User Rights (GDPR & CCPA Compliance)</h2>
              <p>
                Depending on your location, you have the right to request access to, rectification of, or complete deletion of the personal information stored in your Vyron workspace. You can cancel your workspace subscription or wipe linked YouTube indicators directly from the account portal. For queries, contact us at <span className="text-white font-mono">thecxsmic@gmail.com</span>.
              </p>
            </section>
          </div>
        </main>
      </div>

      {/* ── FOOTER ── */}
      <footer className="border-t border-zinc-900 py-6 text-center text-[9px] font-mono text-zinc-650 font-bold uppercase tracking-widest relative z-10 bg-black">
        © 2026 Vyron Intelligence Platform · All Systems Protected
      </footer>
    </div>
  );
}
