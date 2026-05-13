"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function CompetitorsContent() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [baseChannel, setBaseChannel] = useState(null);
  const [competitors, setCompetitors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0);
  const [loadingText, setLoadingText] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const channelId = searchParams.get("channelId");
    if (channelId) {
      analyzeCompetitors(channelId);
    } else {
      fetchUserChannel();
    }
  }, [searchParams]);

  const fetchUserChannel = async () => {
    try {
      const res = await fetch("/api/youtube/channel/user");
      const data = await res.json();
      if (data.success && data.channel) {
        analyzeCompetitors(data.channel.id);
      }
    } catch (err) {
      console.error("Error fetching user channel:", err);
    }
  };

  const formatNumber = (num) => {
    if (isNaN(num) || num === null || num === undefined) return "0";
    const n = parseInt(num);
    if (n >= 1000000000) return (n / 1000000000).toFixed(1) + 'B';
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return n.toString();
  };

  const analyzeCompetitors = async (channelId) => {
    setLoading(true);
    setLoadingStage(10);
    setLoadingText("Extracting Channel DNA...");
    setError(null);
    setCompetitors([]);

    try {
      // 1. Get base channel data
      const res = await fetch(`/api/youtube/channel?channelId=${channelId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch channel data");
      
      setBaseChannel(data.channel);

      setLoadingStage(40);
      setLoadingText("Identifying Niche Keywords...");

      // 2. Extract niche from top videos
      const topVideos = [...(data.videos || [])]
        .sort((a, b) => parseInt(b.statistics?.viewCount || 0) - parseInt(a.statistics?.viewCount || 0))
        .slice(0, 5);
      
      const nicheQuery = topVideos
        .map(v => v.snippet.title.replace(/[^\w\s]/gi, '').split(' ').slice(0, 3).join(' '))
        .join(' ');

      setLoadingStage(60);
      setLoadingText("Scanning Ecosystem Rivals...");

      // 3. Search for competitors
      const compRes = await fetch(`/api/youtube/channel?q=${encodeURIComponent(nicheQuery)}`);
      const compData = await compRes.json();
      if (!compRes.ok) throw new Error(compData.error || "Competitor search failed");
      
      const results = compData.items || [];
      const currentSubs = parseInt(data.channel.statistics.subscriberCount || 0);

      // 4. Filter and categorize
      const filtered = results.filter(c => c.id !== channelId);
      
      // Select 6 diverse competitors
      const sorted = filtered.sort((a, b) => {
        const sA = parseInt(a.statistics?.subscriberCount || 0);
        const sB = parseInt(b.statistics?.subscriberCount || 0);
        // Prioritize channels closer in size
        const diffA = Math.abs(sA - currentSubs);
        const diffB = Math.abs(sB - currentSubs);
        return diffA - diffB;
      });

      setCompetitors(sorted.slice(0, 6));
      setLoadingStage(100);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;
    setLoading(true);
    setError(null);
    setLoadingText("Searching...");
    
    try {
      const res = await fetch(`/api/youtube/channel?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Search failed");
      
      if (data.items && data.items.length > 0) {
        analyzeCompetitors(data.items[0].id);
      } else {
        throw new Error("No channels found");
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 lg:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic leading-[0.8]">
              Rival<br />
              <span className="text-white/20">Intelligence</span>
            </h1>
            <p className="mt-6 text-[#555] font-bold uppercase tracking-[0.3em] text-xs">
              Automated Ecosystem Mapping & Competitor Benchmarking
            </p>
          </div>

          <form onSubmit={handleSearch} className="relative w-full md:w-96 group">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter Channel Name or URL..."
              className="w-full bg-[#080808] border-b-2 border-white/10 px-0 py-4 text-lg font-black tracking-tight placeholder:text-[#333] focus:outline-none focus:border-white transition-all uppercase"
            />
            <button type="submit" className="absolute right-0 bottom-4 text-[#333] hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>
          </form>
        </div>

        {loading ? (
          <div className="py-24 text-center">
            <div className="inline-block relative">
              <div className="w-24 h-24 border-2 border-white/5 rounded-full border-t-white animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[10px] font-black uppercase tracking-widest">{loadingStage}%</span>
              </div>
            </div>
            <p className="mt-8 text-xl font-black uppercase italic tracking-tighter animate-pulse">{loadingText}</p>
          </div>
        ) : error ? (
          <div className="py-24 text-center">
            <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-[2rem] inline-block">
              <p className="text-red-500 font-black uppercase tracking-widest text-sm mb-2">Analysis Error</p>
              <p className="text-white/60 font-medium">{error}</p>
              <button onClick={() => window.location.reload()} className="mt-6 bg-white text-black px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">Retry Scan</button>
            </div>
          </div>
        ) : baseChannel ? (
          <div className="space-y-24">
            {/* Base Channel Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-tr from-white/10 to-transparent rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <img 
                  src={baseChannel.thumbnail} 
                  className="relative w-full aspect-square object-cover rounded-[3rem] border border-white/10 grayscale hover:grayscale-0 transition-all duration-700" 
                  alt="" 
                />
              </div>
              <div className="lg:col-span-2">
                <div className="flex items-center gap-4 mb-4">
                  <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.2em] text-[#666]">Target Subject</span>
                </div>
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none mb-6">
                  {baseChannel.title}
                </h2>
                <div className="grid grid-cols-3 gap-8">
                  <div>
                    <p className="text-[10px] font-black text-[#444] uppercase tracking-widest mb-1">Subscribers</p>
                    <p className="text-3xl font-black">{formatNumber(baseChannel.statistics.subscriberCount)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-[#444] uppercase tracking-widest mb-1">Total Views</p>
                    <p className="text-3xl font-black text-[#00dfd8]">{formatNumber(baseChannel.statistics.viewCount)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-[#444] uppercase tracking-widest mb-1">Uploads</p>
                    <p className="text-3xl font-black text-[#0070f3]">{formatNumber(baseChannel.statistics.videoCount)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Competitors Grid */}
            <div>
              <div className="flex items-center justify-between mb-12">
                <h3 className="text-2xl font-black uppercase tracking-tighter italic">Ecosystem Rivals</h3>
                <div className="h-px flex-1 bg-white/5 mx-8"></div>
                <p className="text-[10px] font-black text-[#444] uppercase tracking-[0.3em]">Neural Mapping Active</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {competitors.map((comp) => {
                  const subDiff = parseInt(comp.statistics?.subscriberCount || 0) - parseInt(baseChannel.statistics.subscriberCount);
                  const isLarger = subDiff > 0;
                  
                  return (
                    <div key={comp.id} className="bg-[#080808] border border-white/5 rounded-[2.5rem] p-8 hover:border-white/20 transition-all group">
                      <div className="flex items-center gap-4 mb-6">
                        <img src={comp.thumbnail} className="w-16 h-16 rounded-2xl border border-white/10 grayscale group-hover:grayscale-0 transition-all" alt="" />
                        <div className="overflow-hidden">
                          <h4 className="font-black text-xl tracking-tighter truncate uppercase italic">{comp.title}</h4>
                          <p className="text-[10px] font-bold text-[#444] truncate">{comp.custom_url}</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between items-end">
                          <div>
                            <p className="text-[9px] font-black text-[#444] uppercase tracking-widest mb-1">Subscribers</p>
                            <p className="text-xl font-black">{formatNumber(comp.statistics?.subscriberCount)}</p>
                          </div>
                          <div className={`text-[10px] font-black uppercase px-2 py-1 rounded ${isLarger ? 'text-green-500 bg-green-500/10' : 'text-blue-500 bg-blue-500/10'}`}>
                            {isLarger ? '+' : ''}{formatNumber(subDiff)}
                          </div>
                        </div>

                        <div className="pt-4 border-t border-white/5">
                           <Link 
                            href={`/channels?channelId=${comp.id}`}
                            className="w-full bg-white/5 hover:bg-white text-white hover:text-black py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2"
                           >
                             Deep Analysis
                             <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                           </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="py-24 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/10">
                <svg className="w-10 h-10 text-[#333]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-4">No Target Identified</h3>
              <p className="text-[#555] text-sm font-medium mb-10">Search for a channel or set your primary channel to begin automated competitor analysis.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Competitors() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-white/5 rounded-full border-t-white animate-spin"></div>
      </div>
    }>
      <CompetitorsContent />
    </Suspense>
  );
}
