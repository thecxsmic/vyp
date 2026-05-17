import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { ClerkProvider, Show, UserButton, SignIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { getSubscriptionStatus } from "@/lib/auth/subscription";
import { UserProvider } from "@/contexts/user";
import { ChannelProvider } from "@/contexts/channel";
import { BottomSheetProvider } from "@/contexts/bottomSheet";
import PaymentButton from "./components/PaymentButton";
import SubscriptionButton from "./components/SubscriptionButton";
import PinnedChannels from "./components/PinnedChannels";
import LayoutContent from "./components/LayoutContent";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Vyron Intelligence",
  description: "Advanced Content Ecosystem Tracking",
};

export default async function RootLayout({ children }) {
  const { userId } = await auth();
  const subscription = userId ? await getSubscriptionStatus(userId) : null;
  const isSubscribed = subscription?.isActive;

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="h-full bg-black text-[#ededed] selection:bg-[#0070f3] selection:text-white">
        <ClerkProvider>
          <UserProvider>
            <ChannelProvider>
              <BottomSheetProvider>
                <Show when="signed-in">
                  {isSubscribed ? (
                    <LayoutContent>{children}</LayoutContent>
                  ) : (
                    /* Pricing / Subscription Required Page */
                    <div className="min-h-screen bg-black flex items-center justify-center p-8">
                      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                         <div className="space-y-8">
                            {subscription?.isHalted ? (
                              <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-full">
                                 <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                                 <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Payment Failed / Halted</span>
                              </div>
                            ) : (
                              <div className="inline-flex items-center gap-2 bg-[#0070f3]/10 border border-[#0070f3]/20 px-4 py-2 rounded-full">
                                 <div className="w-2 h-2 rounded-full bg-[#0070f3] animate-pulse"></div>
                                 <span className="text-[10px] font-black text-[#0070f3] uppercase tracking-widest">Premium Intelligence Only</span>
                              </div>
                            )}
                            
                            <h1 className="text-5xl font-black tracking-tighter text-white uppercase leading-[0.9]">
                              {subscription?.isHalted ? "Billing Issue Detected." : subscription?.isExpired ? "Subscription Expired." : "Unlock the Neural Engine."}
                            </h1>
                            <p className="text-[#888] text-lg font-medium leading-relaxed">
                              {subscription?.isHalted 
                                ? "We were unable to process your recent payment. Please update your billing information or retry to restore access."
                                : "Vyron is a professional-grade ecosystem tracker. Access requires an active subscription to maintain neural compute integrity."}
                            </p>
                            
                            <ul className="space-y-4">
                               {[
                                 "Real-time Viral Coefficient Analysis",
                                 "Deep Channel Momentum Projection",
                                 "Advanced Vector-based Market Search",
                                 "7-Day Full Access Free Trial"
                               ].map((feature, i) => (
                                 <li key={i} className="flex items-center gap-3 text-sm font-bold text-[#444]">
                                   <svg className="w-5 h-5 text-[#0070f3]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                   {feature}
                                 </li>
                               ))}
                            </ul>
                         </div>

                         <div className="bg-[#080808] border border-white/5 p-10 rounded-[3rem] shadow-[0_40px_80px_rgba(0,0,0,0.5)] relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8">
                               <UserButton />
                            </div>
                            <p className="text-[10px] font-black text-[#666] uppercase tracking-[0.3em] mb-4">Selected Plan</p>
                            <h2 className="text-3xl font-black text-white uppercase mb-2">Neural Pro</h2>
                            <div className="flex items-baseline gap-2 mb-8">
                               <span className="text-5xl font-black text-white tracking-tighter">999</span>
                               <span className="text-sm font-bold text-[#444] uppercase tracking-widest">/ Month</span>
                            </div>
                            
                            <div className="space-y-6">
                              <SubscriptionButton />
                              <p className="text-[9px] text-center font-bold text-[#222] uppercase tracking-widest">
                                {subscription?.isHalted ? "Access blocked until payment is resolved." : "No commitment. Cancel anytime during trial."}
                              </p>
                            </div>

                            <div className="mt-10 pt-10 border-t border-white/5">
                               <div className="flex justify-between items-center">
                                  <span className="text-[10px] font-black text-[#444] uppercase tracking-widest">Compute Priority</span>
                                  <span className="text-[10px] font-black text-white uppercase tracking-widest">
                                    {subscription?.isHalted ? "Suspended" : "High / Tier 1"}
                                  </span>
                               </div>
                            </div>
                         </div>
                      </div>
                    </div>
                  )}
                </Show>
                <Show when="signed-out">
                  <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4">
                    <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
                      <div className="mb-8 text-center">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                          <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-black border-b-[8px] border-b-transparent ml-1"></div>
                        </div>
                        <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic">Vyron Intelligence</h1>
                        <p className="text-[10px] font-black text-[#444] uppercase tracking-[0.3em] mt-2">Authentication Required</p>
                      </div>
                      <SignIn 
                        routing="hash"
                        appearance={{
                          elements: {
                            rootBox: "mx-auto w-full",
                            card: "bg-[#080808] border border-white/5 shadow-2xl rounded-[2.5rem] w-full",
                            headerTitle: "text-white uppercase font-black tracking-tighter",
                            headerSubtitle: "text-[#888] font-medium",
                            socialButtonsBlockButton: "bg-white/5 border-white/5 text-white hover:bg-white/10 transition-all",
                            formButtonPrimary: "bg-white text-black hover:bg-[#ededed] transition-all uppercase font-black tracking-widest text-[10px]",
                            footerActionLink: "text-[#0070f3] hover:text-[#00dfd8] transition-colors",
                            formFieldLabel: "text-[#444] uppercase font-black text-[9px] tracking-widest",
                            formFieldInput: "bg-black border-white/10 text-white focus:border-[#0070f3] transition-all",
                            dividerText: "text-[#222] uppercase font-black text-[9px]",
                            dividerLine: "bg-white/5"
                          }
                        }} 
                      />
                    </div>
                  </div>
                </Show>
              </BottomSheetProvider>
            </ChannelProvider>
          </UserProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
