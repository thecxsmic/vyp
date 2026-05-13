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

  const calculateEngagement = (statistics) => {
    if (!statistics) return 0;
    const views = parseInt(statistics.viewCount || 0);
    const subs = parseInt(statistics.subscriberCount || 0);
    if (subs === 0) return 0;
    // Simple engagement metric for comparison: views per subscriber ratio (proxy for reach)
    return (views / subs).toFixed(2);
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
      
      const channel = data.channel;
      const baseVideos = data.videos || [];
      setBaseChannel(channel);

      setLoadingStage(30);
      setLoadingText("Identifying Niche Keywords...");

      // 2. Extract niche from top videos
      const topVideos = [...baseVideos]
        .sort((a, b) => parseInt(b.statistics?.viewCount || 0) - parseInt(a.statistics?.viewCount || 0))
        .slice(0, 5);
      
      const nicheQuery = topVideos
        .map(v => v.snippet.title.replace(/[^\w\s]/gi, '').split(' ').slice(0, 3).join(' '))
        .join(' ');

      setLoadingStage(50);
      setLoadingText("Scanning Ecosystem Rivals...");

      // 3. Search for competitors
      const compRes = await fetch(`/api/youtube/channel?q=${encodeURIComponent(nicheQuery)}`);
      const compData = await compRes.json();
      if (!compRes.ok) throw new Error(compData.error || "Competitor search failed");
      
      const initialResults = compData.items || [];
      const currentSubs = parseInt(channel.statistics.subscriberCount || 0);

      setLoadingStage(70);
      setLoadingText("Crunching Rival Metrics...");

      // 4. Fetch full data for top competitors to get accurate stats
      const filtered = initialResults.filter(c => c.id !== channelId).slice(0, 5);
      
      const deepCompetitors = await Promise.all(filtered.map(async (c) => {
        try {
          const detailRes = await fetch(`/api/youtube/channel?channelId=${c.id}`);
          const detailData = await detailRes.json();
          if (detailData.success) {
            return {
              ...detailData.channel,
              videos: detailData.videos || [],
              matchType: getMatchType(parseInt(detailData.channel.statistics.subscriberCount), currentSubs)
            };
          }
          return null;
        } catch (e) {
          return null;
        }
      }));

      const validCompetitors = deepCompetitors.filter(c => c !== null);
      setCompetitors(validCompetitors.sort((a, b) => parseInt(b.statistics.subscriberCount) - parseInt(a.statistics.subscriberCount)));
      setLoadingStage(100);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getMatchType = (compSubs, baseSubs) => {
    if (compSubs > baseSubs * 10) return "Market Leader";
    if (compSubs > baseSubs * 2) return "Growth Target";
    if (compSubs >= baseSubs * 0.5) return "Direct Peer";
    return "Emerging Rival";
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
    <div className="min-h-screen bg-black text-white p-4 md:p-8 lg:p-12 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-[0.85]">
              Competitor<br />
              <span className="text-white/20">Matrix</span>
            </h1>
            <p className="mt-6 text-[#555] font-black uppercase tracking-[0.3em] text-[10px] bg-white/[0.03] w-fit px-4 py-2 rounded-lg border border-white/5">
              Strategic Ecosystem Benchmarking v2.0
            </p>
          </div>

          <form onSubmit={handleSearch} className="relative w-full md:w-96 group">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter Channel Name or URL..."
              className="w-full bg-[#080808] border-b-2 border-white/10 px-0 py-4 text-lg font-black tracking-tight placeholder:text-[#333] focus:outline-none focus:border-white transition-all uppercase italic"
            />
            <button type="submit" className="absolute right-0 bottom-4 text-[#333] hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>
          </form>
        </div>

        {loading ? (
          <div className="py-32 text-center">
            <div className="inline-block relative mb-8">
              <div className="w-32 h-32 border-[3px] border-white/5 rounded-full border-t-white animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-black uppercase tracking-widest">{loadingStage}%</span>
              </div>
            </div>
            <p className="text-2xl font-black uppercase italic tracking-tighter animate-pulse">{loadingText}</p>
          </div>
        ) : error ? (
          <div className="py-24 text-center">
            <div className="bg-red-500/10 border border-red-500/20 p-12 rounded-[3rem] inline-block max-w-xl">
              <p className="text-red-500 font-black uppercase tracking-widest text-xs mb-4">Neural Analysis Failed</p>
              <p className="text-white/60 font-medium text-lg mb-8">{error}</p>
              <button onClick={() => window.location.reload()} className="bg-white text-black px-10 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-transform">Re-Initialize Scan</button>
            </div>
          </div>
        ) : baseChannel ? (
          <div className="space-y-32">
            {/* Subject Profile */}
            <div className="bg-[#080808] border border-white/5 rounded-[4rem] p-8 md:p-12 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                 <svg className="w-64 h-64 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg>
              </div>

              <div className="flex flex-col lg:flex-row gap-12 items-center relative z-10">
                <div className="shrink-0">
                  <img 
                    src={baseChannel.thumbnail} 
                    className="w-48 h-48 md:w-64 md:h-64 object-cover rounded-[3rem] border border-white/10 grayscale hover:grayscale-0 transition-all duration-700 shadow-2xl" 
                    alt="" 
                  />
                </div>
                <div className="flex-1 text-center lg:text-left">
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-6">
                    <span className="bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-[#888]">Subject Authority</span>
                    <span className="bg-[#0070f3]/10 border border-[#0070f3]/20 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-[#0070f3]">Active Analysis</span>
                  </div>
                  <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none mb-8 bg-gradient-to-b from-white to-[#666] bg-clip-text text-transparent">
                    {baseChannel.title}
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div>
                      <p className="text-[10px] font-black text-[#444] uppercase tracking-widest mb-2">Subscribers</p>
                      <p className="text-3xl font-black">{formatNumber(baseChannel.statistics.subscriberCount)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-[#444] uppercase tracking-widest mb-2">Total Views</p>
                      <p className="text-3xl font-black text-[#00dfd8]">{formatNumber(baseChannel.statistics.viewCount)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-[#444] uppercase tracking-widest mb-2">Uploads</p>
                      <p className="text-3xl font-black text-[#0070f3]">{formatNumber(baseChannel.statistics.videoCount)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-[#444] uppercase tracking-widest mb-2">Engagement</p>
                      <p className="text-3xl font-black text-fuchsia-500">{calculateEngagement(baseChannel.statistics)}x</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Comparison Matrix */}
            <div>
              <div className="flex items-center justify-between mb-16">
                <div className="flex items-center gap-6">
                   <h3 className="text-3xl font-black uppercase tracking-tighter italic">Strategic Matrix</h3>
                   <span className="hidden md:block h-px w-32 bg-white/10"></span>
                   <p className="text-[10px] font-black text-[#444] uppercase tracking-[0.4em]">Multi-subject Benchmarking</p>
                </div>
              </div>

              <div className="overflow-x-auto pb-8">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="pb-8 text-left text-[10px] font-black text-[#444] uppercase tracking-widest pl-4">Subject</th>
                      <th className="pb-8 text-left text-[10px] font-black text-[#444] uppercase tracking-widest">Classification</th>
                      <th className="pb-8 text-left text-[10px] font-black text-[#444] uppercase tracking-widest">Subscribers</th>
                      <th className="pb-8 text-left text-[10px] font-black text-[#444] uppercase tracking-widest">Growth Gap</th>
                      <th className="pb-8 text-left text-[10px] font-black text-[#444] uppercase tracking-widest">Reach Factor</th>
                      <th className="pb-8 text-right text-[10px] font-black text-[#444] uppercase tracking-widest pr-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.03]">
                    {/* Base Channel Row */}
                    <tr className="bg-white/[0.02] group">
                      <td className="py-8 pl-4">
                        <div className="flex items-center gap-4">
                          <img src={baseChannel.thumbnail} className="w-12 h-12 rounded-xl border border-white/20" alt="" />
                          <div>
                            <p className="font-black text-sm uppercase italic text-white">YOU</p>
                            <p className="text-[9px] font-bold text-[#444] uppercase tracking-widest">{baseChannel.custom_url}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-8">
                        <span className="bg-white/5 text-white/40 text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-white/10">Control Group</span>
                      </td>
                      <td className="py-8 font-black text-lg">{formatNumber(baseChannel.statistics.subscriberCount)}</td>
                      <td className="py-8">
                        <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-white w-full opacity-20"></div>
                        </div>
                      </td>
                      <td className="py-8">
                        <p className="font-black text-lg text-fuchsia-500">{calculateEngagement(baseChannel.statistics)}x</p>
                      </td>
                      <td className="py-8 pr-4 text-right">
                        <span className="text-[9px] font-black text-[#333] uppercase">Primary Subject</span>
                      </td>
                    </tr>

                    {/* Competitor Rows */}
                    {competitors.map((comp) => {
                      const subDiff = parseInt(comp.statistics?.subscriberCount || 0) - parseInt(baseChannel.statistics.subscriberCount);
                      const isLarger = subDiff > 0;
                      const gapPercent = Math.min(100, Math.max(0, (parseInt(comp.statistics.subscriberCount) / (parseInt(baseChannel.statistics.subscriberCount) * 2)) * 100));
                      
                      return (
                        <tr key={comp.id} className="hover:bg-white/[0.01] transition-colors group">
                          <td className="py-10 pl-4">
                            <div className="flex items-center gap-4">
                              <img src={comp.thumbnail} className="w-12 h-12 rounded-xl border border-white/5 grayscale group-hover:grayscale-0 transition-all" alt="" />
                              <div className="max-w-[180px]">
                                <p className="font-black text-sm uppercase italic truncate">{comp.title}</p>
                                <p className="text-[9px] font-bold text-[#444] uppercase tracking-widest truncate">{comp.custom_url}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-10">
                            <span className={`text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest border ${
                              comp.matchType === 'Market Leader' ? 'bg-orange-500/10 border-orange-500/20 text-orange-500' :
                              comp.matchType === 'Growth Target' ? 'bg-green-500/10 border-green-500/20 text-green-500' :
                              comp.matchType === 'Direct Peer' ? 'bg-blue-500/10 border-blue-500/20 text-blue-500' : 'bg-zinc-500/10 border-zinc-500/20 text-zinc-500'
                            }`}>
                              {comp.matchType}
                            </span>
                          </td>
                          <td className="py-10 font-black text-lg">{formatNumber(comp.statistics?.subscriberCount)}</td>
                          <td className="py-10">
                            <div className="flex flex-col gap-2">
                               <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <div className={`h-full ${isLarger ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${gapPercent}%` }}></div>
                              </div>
                              <p className={`text-[9px] font-black uppercase ${isLarger ? 'text-green-500' : 'text-blue-500'}`}>
                                {isLarger ? '↑' : '↓'} {formatNumber(Math.abs(subDiff))}
                              </p>
                            </div>
                          </td>
                          <td className="py-10">
                            <div className="flex items-center gap-2">
                              <p className="font-black text-lg text-fuchsia-500">{calculateEngagement(comp.statistics)}x</p>
                              {parseFloat(calculateEngagement(comp.statistics)) > parseFloat(calculateEngagement(baseChannel.statistics)) && (
                                <span className="bg-fuchsia-500/10 text-fuchsia-500 text-[8px] font-black px-1.5 py-0.5 rounded">HIGH</span>
                              )}
                            </div>
                          </td>
                          <td className="py-10 pr-4 text-right">
                            <Link 
                              href={`/channels?channelId=${comp.id}`}
                              className="inline-flex items-center gap-2 bg-white/5 hover:bg-white text-white hover:text-black px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                            >
                              Detail
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Strategic Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="bg-[#080808] border border-white/5 rounded-[3rem] p-10">
                  <h4 className="text-xl font-black uppercase italic mb-8 flex items-center gap-4">
                    <div className="w-2 h-8 bg-fuchsia-500 rounded-full"></div>
                    Content Efficiency Gap
                  </h4>
                  <div className="space-y-6">
                    <p className="text-sm text-[#888] leading-relaxed">
                      Your current <span className="text-white font-bold italic">Reach Factor</span> is {calculateEngagement(baseChannel.statistics)}x. 
                      The top rival in this set is operating at <span className="text-white font-bold italic">{Math.max(...competitors.map(c => calculateEngagement(c.statistics)))}x</span>.
                    </p>
                    <div className="p-6 bg-white/[0.03] border border-white/5 rounded-2xl">
                       <p className="text-[10px] font-black text-[#444] uppercase tracking-widest mb-4">Strategic Recommendation</p>
                       <p className="text-sm font-bold text-white/80">
                         {parseFloat(calculateEngagement(baseChannel.statistics)) < 1 ? 
                          "Focus on content relevance. Your views-to-sub ratio suggests your core audience isn't clicking on new uploads. Analyze rival thumbnails immediately." :
                          "Your engagement is healthy. To close the growth gap, increase upload frequency while maintaining this reach factor to compound your authority."}
                       </p>
                    </div>
                  </div>
               </div>

               <div className="bg-[#080808] border border-white/5 rounded-[3rem] p-10">
                  <h4 className="text-xl font-black uppercase italic mb-8 flex items-center gap-4">
                    <div className="w-2 h-8 bg-[#0070f3] rounded-full"></div>
                    Market Positioning
                  </h4>
                  <div className="flex flex-wrap gap-4">
                    {competitors.map(c => (
                      <div key={c.id} className="flex-1 min-w-[140px] p-4 border border-white/5 rounded-2xl bg-white/[0.01]">
                        <p className="text-[8px] font-black text-[#444] uppercase tracking-widest mb-2 truncate">{c.title}</p>
                        <div className={`h-1 w-full rounded-full mb-2 ${
                          c.matchType === 'Market Leader' ? 'bg-orange-500' :
                          c.matchType === 'Growth Target' ? 'bg-green-500' :
                          c.matchType === 'Direct Peer' ? 'bg-blue-500' : 'bg-zinc-500'
                        }`}></div>
                        <p className="text-[10px] font-black uppercase text-white">{c.matchType}</p>
                      </div>
                    ))}
                  </div>
                  <p className="mt-8 text-xs text-[#555] font-medium leading-relaxed italic">
                    *Neural classification based on 10x/2x subscriber parity thresholds.
                  </p>
               </div>
            </div>
          </div>
        ) : (
          <div className="py-48 text-center">
            <div className="max-w-md mx-auto relative">
              <div className="absolute -inset-24 bg-white/5 rounded-full blur-[100px] opacity-20"></div>
              <div className="relative">
                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-12 border border-white/10 group-hover:scale-110 transition-transform">
                  <svg className="w-10 h-10 text-[#333]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2m0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                </div>
                <h3 className="text-3xl font-black uppercase tracking-tighter mb-6">Subject Required</h3>
                <p className="text-[#555] text-sm font-medium mb-12 leading-relaxed">Search for a channel or set your primary channel to begin deep ecosystem benchmarking.</p>
                <div className="flex justify-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-white/10"></div>
                  <div className="w-2 h-2 rounded-full bg-white/20"></div>
                  <div className="w-2 h-2 rounded-full bg-white/10"></div>
                </div>
              </div>
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
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-8">
        <div className="w-16 h-16 border-[3px] border-white/5 rounded-full border-t-white animate-spin"></div>
        <p className="text-[10px] font-black text-[#333] uppercase tracking-[0.5em]">Syncing Matrix Data</p>
      </div>
    }>
      <CompetitorsContent />
    </Suspense>
  );
}
