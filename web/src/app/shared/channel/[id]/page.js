"use client";

import { useState, useEffect, use } from "react";
import { calculateViralityScore } from "@/lib/ranking/virality";
import VideoCard from "../../../components/VideoCard";
import VideoDetailsModal from "../../../components/VideoDetailsModal";
import Link from "next/link";
import { 
  Zap, 
  BarChart3, 
  Target, 
  Users, 
  ArrowRight, 
  Activity, 
  Share2, 
  Lock, 
  Video 
} from "lucide-react";
import { motion } from "framer-motion";

function formatNumber(num) {
  if (!num) return "0";
  const parsed = parseInt(num, 10);
  if (isNaN(parsed)) return "0";
  if (parsed >= 1000000000) return (parsed / 1000000000).toFixed(1).replace(/\.0$/, "") + "B";
  if (parsed >= 1000000) return (parsed / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  if (parsed >= 1000) return (parsed / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  return parsed.toString();
}

function getAudienceTier(stats, videos) {
  const subs = parseInt(stats?.subscriberCount || 0, 10);
  let avgDaily = 0;
  if (videos && videos.length > 0) {
    const totalViews = videos.reduce((acc, v) => acc + parseInt(v.statistics?.viewCount || 0, 10), 0);
    const dates = videos.map(v => new Date(v.published_at || v.snippet?.publishedAt).getTime()).sort((a, b) => a - b);
    const daysDiff = Math.max(1, (Date.now() - dates[0]) / (1000 * 60 * 60 * 24));
    avgDaily = totalViews / daysDiff;
  }

  if (subs >= 100000000 || avgDaily >= 10000000) return { tier: 1, label: "Global Icon", sub: "God Tier Scale" };
  if (subs >= 50000000 || avgDaily >= 5000000) return { tier: 2, label: "Diamond", sub: "Market Leader" };
  if (subs >= 20000000 || avgDaily >= 2000000) return { tier: 3, label: "Titan", sub: "Elite Production" };
  if (subs >= 10000000 || avgDaily >= 1000000) return { tier: 4, label: "Gold", sub: "High Impact" };
  if (subs >= 5000000 || avgDaily >= 500000) return { tier: 5, label: "Elite", sub: "Established Pro" };
  if (subs >= 1000000 || avgDaily >= 250000) return { tier: 6, label: "Silver", sub: "Scale Achieved" };
  if (subs >= 500000 || avgDaily >= 100000) return { tier: 7, label: "Major", sub: "Consistent Growth" };
  if (subs >= 100000 || avgDaily >= 20000) return { tier: 8, label: "Established", sub: "Niche Presence" };
  if (subs >= 10000 || avgDaily >= 5000) return { tier: 9, label: "Micro", sub: "Emerging Talent" };
  return { tier: 10, label: "Nano", sub: "Early Stage" };
}

export default function SharedChannelPage({ params }) {
  const { id } = use(params);
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/youtube/channel?channelId=${id}`);
        const data = await res.json();
        
        if (data.success && data.channel) {
          setAnalysisData(data);
        } else {
          throw new Error(data.error || "Failed to load channel report.");
        }
      } catch (err) {
        console.error("Shared report load error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchReport();
  }, [id]);

  const handleShareOnTwitter = () => {
    if (!analysisData) return;
    const title = analysisData.channel.title;
    const tweetText = encodeURIComponent(
      `Check out the detailed metrics & virality analysis for YouTube channel "${title}" on @SvayIntelligence! 🚀📈`
    );
    const tweetUrl = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${tweetText}&url=${tweetUrl}`, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-full border-t-2 border-brand-volt animate-spin mb-4" />
        <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em] animate-pulse">Loading Svay Analysis Report...</p>
      </div>
    );
  }

  if (error || !analysisData) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-xl font-black text-red-500 uppercase tracking-wider mb-2">Report Not Available</h1>
        <p className="text-zinc-500 text-xs max-w-sm mb-6">
          {error || "The channel analysis report you are trying to view does not exist or has expired."}
        </p>
        <Link 
          href="/" 
          className="px-6 py-3 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl text-[10px] font-black uppercase tracking-wider text-white transition-all"
        >
          Go to Svay Homepage
        </Link>
      </div>
    );
  }

  const { channel, videos } = analysisData;
  const tierData = getAudienceTier(channel.statistics, videos);

  return (
    <div className="min-h-screen bg-black text-[#ededed] pb-24 relative overflow-x-hidden selection:bg-brand-volt selection:text-black">
      {/* Background gradients */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-volt/5 rounded-full filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-red-500/5 rounded-full filter blur-[120px] pointer-events-none" />

      {/* Standalone Premium Header */}
      <header className="border-b border-white/5 bg-black/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-geist-success via-[#00f0ff] to-geist-success" />
            <span className="font-logo font-black text-lg tracking-wider text-white uppercase">Svay</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-block text-[9px] font-black text-zinc-500 uppercase tracking-widest bg-white/5 border border-white/5 px-3 py-1.5 rounded-lg">
              Public Report
            </span>
            <Link 
              href="/" 
              className="px-4 py-2 bg-brand-volt text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-105 active:scale-95 transition-all"
            >
              Analyze Your Channel
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="max-w-4xl mx-auto px-4 pt-12 space-y-12 relative z-10">
        {/* Channel Banner Info */}
        <div className="bg-white/[0.01] border border-white/5 rounded-[2.5rem] p-6 md:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-brand-volt/20 to-transparent" />
          
          <div className="flex flex-col md:flex-row md:items-center gap-6 justify-between">
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5">
              <img 
                src={channel.thumbnail || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80"} 
                className="w-20 h-20 rounded-full border border-white/10 shadow-xl object-cover shrink-0" 
                alt="" 
              />
              <div className="space-y-1">
                <h1 className="text-3xl font-black text-white tracking-tight uppercase">{channel.title}</h1>
                <p className="text-zinc-500 font-mono text-xs">{channel.custom_url || channel.id}</p>
              </div>
            </div>
            
            <button
              onClick={handleShareOnTwitter}
              className="px-5 py-3 bg-white text-black rounded-2xl hover:scale-105 active:scale-95 transition-all text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4" /> Share on Twitter / X
            </button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 pt-8 border-t border-white/5">
            {[
              { label: "Subscribers", value: channel.statistics?.subscriberCount, color: "text-white" },
              { label: "Total Views", value: channel.statistics?.viewCount, color: "text-brand-mint" },
              { label: "Total Videos", value: channel.statistics?.videoCount, color: "text-brand-volt" },
              { 
                label: "Avg Views/Video", 
                value: Math.round(parseInt(channel.statistics?.viewCount || 0, 10) / Math.max(1, parseInt(channel.statistics?.videoCount || 0, 10))),
                color: "text-white"
              }
            ].map((stat, i) => (
              <div key={i} className="bg-white/[0.01] border border-white/5 p-4 rounded-2xl">
                <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">{stat.label}</p>
                <p className={`text-xl font-bold ${stat.color} tracking-tight`}>
                  {formatNumber(stat.value)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-white/5 gap-8 bg-black/80 backdrop-blur-md z-40 px-2 overflow-x-auto no-scrollbar">
          {[
            { id: "overview", label: "Overview" },
            { id: "performance", label: "Performance" },
            { id: "videos", label: "Recent Videos" },
            { id: "projections", label: "Projections 🔒" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 text-[10px] uppercase tracking-widest font-black transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                activeTab === tab.id 
                  ? "border-brand-volt text-white font-black" 
                  : "border-transparent text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dynamic Tab Contents */}
        <div className="min-h-[300px]">
          {activeTab === "overview" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: "Audience Level", value: tierData.label, sub: tierData.sub, icon: Users, color: "text-brand-volt" },
                  { label: "Visibility Index", value: `${(parseInt(channel.statistics?.viewCount || 0, 10) / 10000000).toFixed(2)}%`, sub: "Global Relevance", icon: Target, color: "text-brand-mint" },
                  { label: "Production Level", value: (parseInt(channel.statistics?.videoCount || 0, 10) / 10).toFixed(1), sub: "Output Intensity", icon: Zap, color: "text-white" }
                ].map((stat, i) => (
                  <div key={i} className="bg-white/[0.01] border border-white/5 p-6 rounded-2xl">
                    <div className={`w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center mb-4 ${stat.color}`}>
                      <stat.icon className="w-5 h-5" />
                    </div>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-white tracking-tight mb-1">{stat.value}</p>
                    <p className="text-[10px] text-zinc-400 font-medium">{stat.sub}</p>
                  </div>
                ))}
              </div>

              {/* DNA Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/[0.01] border border-white/5 p-8 rounded-3xl">
                  <h4 className="text-[10px] font-bold text-white uppercase tracking-widest mb-6">Channel DNA Metrics</h4>
                  <div className="space-y-5">
                    {[
                      { label: "Audience Loyalty", value: 85, color: "bg-brand-volt" },
                      { label: "Brand Authority", value: 78, color: "bg-brand-mint" },
                      { label: "Engagement Velocity", value: 68, color: "bg-white" }
                    ].map((dna, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-[9px] font-bold uppercase mb-2">
                          <span className="text-zinc-500">{dna.label}</span>
                          <span className="text-white">{dna.value}%</span>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                          <div className={`h-full ${dna.color} rounded-full`} style={{ width: `${dna.value}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white/[0.01] border border-white/5 p-8 rounded-3xl flex flex-col justify-between">
                  <div>
                    <h4 className="text-[10px] font-bold text-white uppercase tracking-widest mb-4">Svay Neural Summary</h4>
                    <p className="text-sm text-zinc-400 font-medium leading-relaxed">
                      This channel registers a <span className="text-white font-bold">{tierData.label}</span> classification in its category. 
                      The resonance index indicates <span className="text-brand-volt font-bold">Excellent Reach</span> with strong audience authority and robust consistency across uploads.
                    </p>
                  </div>
                  <div className="pt-6 mt-6 border-t border-white/5 flex items-center gap-3">
                    <Activity className="w-4 h-4 text-brand-volt" />
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">ECOSYSTEM REPORT BY SVAY SYSTEM</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "performance" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              {(() => {
                const videoStats = videos.map(v => calculateViralityScore(v));
                const avgScore = videoStats.reduce((acc, s) => acc + s.score, 0) / videoStats.length;
                const viralHits = videoStats.filter(s => s.score > 40).length;
                const hitRate = (viralHits / videoStats.length) * 100;
                const avgEngagement = videoStats.reduce((acc, s) => acc + parseFloat(s.engagement), 0) / videoStats.length;
                const avgDailyViews = videoStats.reduce((acc, s) => acc + s.dailyViews, 0) / videoStats.length;

                return (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { label: "Viral Efficiency", value: `${hitRate.toFixed(1)}%`, sub: "Hit Rate (>40 score)", color: "text-white" },
                      { label: "Avg Engagement", value: `${avgEngagement.toFixed(2)}%`, sub: "Interactive Resonance", color: "text-brand-mint" },
                      { label: "Daily Velocity", value: `+${formatNumber(avgDailyViews)}`, sub: "Avg Daily Views", color: "text-brand-volt" }
                    ].map((stat, i) => (
                      <div key={i} className="bg-white/[0.01] border border-white/5 p-6 rounded-2xl">
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">{stat.label}</p>
                        <p className={`text-2xl font-bold ${stat.color} tracking-tight`}>{stat.value}</p>
                        <p className="text-[9px] text-zinc-400 font-bold uppercase mt-1">{stat.sub}</p>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </motion.div>
          )}

          {activeTab === "videos" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              {videos.map((video) => (
                <VideoCard 
                  key={video.id}
                  video={video}
                  onClick={() => setSelectedVideo(video)}
                />
              ))}
            </motion.div>
          )}

          {activeTab === "projections" && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="bg-white/[0.01] border border-white/5 rounded-3xl p-8 text-center flex flex-col items-center justify-center py-16 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-volt/5 via-transparent to-red-500/5 filter blur-md pointer-events-none" />
              
              <div className="w-16 h-16 bg-brand-volt/10 rounded-full flex items-center justify-center mb-6 border border-brand-volt/20">
                <Lock className="w-6 h-6 text-brand-volt" />
              </div>

              <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">Growth Projections Locked</h3>
              <p className="text-zinc-500 text-xs max-w-sm leading-relaxed mb-8">
                Connect your YouTube channel and unlock advanced subscriber models, monthly revenue forecasting, and dynamic competitor analysis tools.
              </p>

              <Link 
                href="/"
                className="px-8 py-4 bg-brand-volt text-black text-xs font-black uppercase tracking-wider rounded-2xl hover:scale-105 active:scale-[0.98] transition-all flex items-center gap-2"
              >
                Claim Your Free Pro Trial <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
              </Link>
            </motion.div>
          )}
        </div>

        {/* Global CTA Banner */}
        <section className="bg-gradient-to-tr from-brand-volt/10 to-transparent border border-brand-volt/20 rounded-[2.5rem] p-8 md:p-12 text-center space-y-6 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-brand-volt/30 to-transparent" />
          
          <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter leading-none">
            Unlock Real-Time Virality Tracking
          </h2>
          <p className="text-zinc-400 text-xs md:text-sm max-w-lg mx-auto leading-relaxed">
            Svay is the ultimate workspace for content creators. Connect your channel in 1-click to track competitors, discover trending keywords, and forecast audience expansion.
          </p>
          <div className="pt-2">
            <Link 
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-black text-xs uppercase tracking-wider rounded-2xl hover:scale-105 active:scale-[0.98] transition-all"
            >
              Analyze Your Channel Now
            </Link>
          </div>
        </section>
      </main>

      {/* Video Details Modal */}
      {selectedVideo && (
        <VideoDetailsModal 
          video={selectedVideo} 
          onClose={() => setSelectedVideo(null)} 
        />
      )}
    </div>
  );
}
