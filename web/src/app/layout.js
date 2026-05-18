import { Inter, Space_Grotesk } from "next/font/google";
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

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
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
      className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased dark`}
    >
      <body className="h-full bg-black text-[#ededed] selection:bg-[#0070f3] selection:text-white font-sans">
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
                              <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-full">
                                 <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                                 <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider">Payment Required</span>
                              </div>
                            ) : (
                              <div className="inline-flex items-center gap-2 bg-geist-success/10 border border-geist-success/20 px-3 py-1.5 rounded-full">
                                 <div className="w-1.5 h-1.5 rounded-full bg-geist-success animate-pulse"></div>
                                 <span className="text-[10px] font-bold text-geist-success uppercase tracking-wider">Pro Access Only</span>
                              </div>
                            )}
                            
                            <h1 className="font-display text-5xl font-black tracking-tight text-white leading-[1.1] uppercase">
                              {subscription?.isHalted ? "Update Billing." : subscription?.isExpired ? "Plan Expired." : "Upgrade to Pro."}
                            </h1>
                            <p className="text-accents-5 text-lg font-medium leading-relaxed">
                              {subscription?.isHalted 
                                ? "We couldn't process your payment. Please update your billing info to continue."
                                : "Unlock advanced tracking, real-time viral analysis, and deep insights with Vyron Pro."}
                            </p>
                            
                            <ul className="space-y-4">
                               {[
                                 "Real-time viral analysis",
                                 "Channel growth projections",
                                 "Advanced ecosystem search",
                                 "7-day free trial included"
                               ].map((feature, i) => (
                                 <li key={i} className="flex items-center gap-3 text-sm font-medium text-accents-4">
                                   <svg className="w-5 h-5 text-geist-success" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                                   {feature}
                                 </li>
                               ))}
                            </ul>
                         </div>

                         <div className="bg-[#080808] border border-white/5 p-10 rounded-[2rem] shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8">
                               <UserButton />
                            </div>
                            <p className="text-[10px] font-bold text-accents-4 uppercase tracking-wider mb-4">Selected Plan</p>
                            <h2 className="font-display text-3xl font-black text-white mb-2 uppercase">Pro Plan</h2>
                            <div className="flex items-baseline gap-2 mb-8">
                               <span className="text-5xl font-bold text-white tracking-tight">999</span>
                               <span className="text-sm font-medium text-accents-4 uppercase tracking-wider">/ Month</span>
                            </div>
                            
                            <div className="space-y-6">
                              <SubscriptionButton />
                              <p className="text-[10px] text-center font-medium text-accents-3 uppercase tracking-wider">
                                {subscription?.isHalted ? "Access restricted until resolved." : "Cancel anytime during trial."}
                              </p>
                            </div>

                            <div className="mt-10 pt-10 border-t border-white/5">
                               <div className="flex justify-between items-center">
                                  <span className="text-[10px] font-bold text-accents-3 uppercase tracking-wider">Support</span>
                                  <span className="text-[10px] font-bold text-white uppercase tracking-wider">Priority</span>
                               </div>
                            </div>
                         </div>
                      </div>
                    </div>
                  )}
                </Show>
                <Show when="signed-out">
                  <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4">
                    <div className="w-full max-w-md">
                      <div className="mb-10 text-center">
                        <div className="w-16 h-16 bg-gradient-to-tr from-geist-success via-[#00dfd8] to-geist-success animate-logo-gradient rounded-2xl mx-auto mb-6 shadow-2xl" />
                        <h1 className="font-display text-3xl font-black tracking-tight text-white uppercase">Vyron</h1>
                        <p className="text-xs font-medium text-accents-4 uppercase tracking-[0.2em] mt-3">Sign in to continue</p>
                      </div>
                      <SignIn 
                        routing="hash"
                        appearance={{
                          elements: {
                            rootBox: "mx-auto w-full",
                            card: "bg-black border border-white/10 shadow-2xl rounded-2xl w-full",
                            headerTitle: "text-white font-bold tracking-tight",
                            headerSubtitle: "text-accents-5 font-medium",
                            socialButtonsBlockButton: "bg-white/5 border-white/10 text-white hover:bg-white/10 transition-all rounded-lg",
                            formButtonPrimary: "bg-white text-black hover:bg-accents-7 transition-all font-bold rounded-lg py-2.5",
                            footerActionLink: "text-geist-success hover:opacity-80 transition-opacity",
                            formFieldLabel: "text-accents-4 font-bold text-[11px] uppercase tracking-wider",
                            formFieldInput: "bg-black border-white/10 text-white focus:border-geist-success transition-all rounded-lg",
                            dividerText: "text-accents-3 uppercase font-bold text-[10px]",
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
