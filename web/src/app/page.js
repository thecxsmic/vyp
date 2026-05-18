"use client";

import { useState, useEffect } from "react";
import { calculateViralityScore } from "@/lib/ranking/virality";
import VideoCard from "./components/VideoCard";
import VideoDetailsModal from "./components/VideoDetailsModal";
import { Search, Zap, Activity, Users, Trophy, BookOpen, BarChart3, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [query, setQuery] = useState("");
  const [hoverInfo, setHoverInfo] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [filters, setFilters] = useState({
    region: "US",
    lang: "en",
    uploadDate: "",
    duration: "",
    order: "relevance",
    maxResults: 50,
    safeSearch: "moderate",
    hdOnly: false,
    captioned: false,
    disableCache: false,
    vectorOnly: false,
  });
  const [results, setResults] = useState(null);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [showMarketAnalysis, setShowMarketAnalysis] = useState(true);
  const [loadingStage, setLoadingStage] = useState(0);
  const [loadingText, setLoadingText] = useState("Searching...");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;
    setLoading(true);
    setLoadingStage(10);
    setLoadingText("Connecting...");
    setError(null);
    
    const progressInterval = setInterval(() => {
      setLoadingStage(prev => {
        if (prev < 90) {
          const next = prev + Math.random() * 15;
          if (next > 30 && next < 50) setLoadingText("Searching...");
          if (next > 50 && next < 70) setLoadingText("Analyzing...");
          if (next > 70) setLoadingText("Finalizing...");
          return next;
        }
        return prev;
      });
    }, 400);

    const params = new URLSearchParams({ q: query, ...filters });
    try {
      const res = await fetch(`/api/youtube/search?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "Search failed");
      setLoadingStage(100);
      setLoadingText("Complete.");
      setTimeout(() => {
        const seen = new Set();
        const uniqueItems = (data.items || []).filter(item => {
          const id = item.id?.videoId || item.id;
          if (!id || seen.has(id)) return false;
          seen.add(id);
          return true;
        });
        setResults(uniqueItems);
        setNextPageToken(data.nextPageToken);
      }, 300);
    } catch (err) {
      setError(err.message);
    } finally {
      clearInterval(progressInterval);
      setTimeout(() => setLoading(false), 800);
    }
  };

  const loadMore = async () => {
    if (!nextPageToken || loadingMore) return;
    
    setLoadingMore(true);
    const params = new URLSearchParams({ q: query, ...filters, pageToken: nextPageToken });
    try {
      const res = await fetch(`/api/youtube/search?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "Failed to load more");
      
      setResults(prev => {
        const combined = [...(prev || []), ...(data.items || [])];
        const seen = new Set();
        return combined.filter(item => {
          const id = item.id?.videoId || item.id;
          if (!id || seen.has(id)) return false;
          seen.add(id);
          return true;
        });
      });
      setNextPageToken(data.nextPageToken);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingMore(false);
    }
  };

  const updateFilter = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    
    setFilters((prev) => {
      const updated = { ...prev, [name]: newValue };
      if (results && name === 'order') {
        const sorted = [...results].sort((a, b) => {
          if (newValue === 'virality') {
            const vA = calculateViralityScore(a).score;
            const vB = calculateViralityScore(b).score;
            return vB - vA;
          }
          if (newValue === 'date') {
            return new Date(b.snippet.publishedAt) - new Date(a.snippet.publishedAt);
          }
          if (newValue === 'viewCount') {
            const viewsA = parseInt(a.statistics?.viewCount || 0);
            const viewsB = parseInt(b.statistics?.viewCount || 0);
            return viewsB - viewsA;
          }
          if (newValue === 'relevance') {
            const scoreA = a.score || a.distance || 0;
            const scoreB = b.score || b.distance || 0;
            return scoreB - scoreA;
          }
          return 0;
        });
        setResults(sorted);
      }
      return updated;
    });
  };

  const formatNumber = (num) => {
    if (isNaN(num) || num === null || num === undefined) return "0";
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num;
  };

  return (
    <div className="min-h-full bg-black text-white selection:bg-geist-success selection:text-white pb-24">
      {hoverInfo && !selectedVideo && (
        <div className="fixed bottom-8 right-8 z-[100] w-72 animate-in fade-in slide-in-from-bottom-4 duration-300 hidden md:block">
          <div className="bg-white text-black p-5 rounded-2xl shadow-2xl border border-white/20">
            <h4 className="text-[10px] uppercase tracking-wider font-bold mb-1 opacity-50">{hoverInfo.title}</h4>
            <p className="text-xs font-medium leading-relaxed">{hoverInfo.text}</p>
          </div>
        </div>
      )}

      <VideoDetailsModal 
        selectedVideo={selectedVideo} 
        setSelectedVideo={setSelectedVideo} 
        filters={filters} 
        formatNumber={formatNumber} 
      />

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white">Search</h1>
          <p className="text-accents-5 text-sm md:text-base max-w-xl mx-auto font-medium leading-relaxed px-4">Find videos and track their performance across the platform.</p>
        </div>

        <section className="mb-16">
          <form onSubmit={handleSearch} className="relative group max-w-2xl mx-auto">
            <div className="relative flex items-center bg-black border border-white/10 rounded-2xl overflow-hidden focus-within:border-geist-success transition-all duration-300 shadow-2xl">
              <div className="pl-6 text-accents-4 shrink-0"><Search className="w-5 h-5" /></div>
              <input type="text" placeholder="Search for videos..." value={query} onChange={(e) => setQuery(e.target.value)} className="w-full py-4 px-4 bg-transparent outline-none text-base font-medium placeholder-accents-3 text-white tracking-tight" />
              <button type="submit" disabled={loading} className="mr-2 bg-white text-black px-6 py-2 rounded-xl font-bold hover:opacity-90 active:scale-95 transition-all text-sm">
                Search
              </button>
            </div>
            {loading && (
              <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${loadingStage}%` }}
                  className="h-full bg-geist-success"
                />
              </div>
            )}
          </form>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
             {['region', 'order', 'uploadDate', 'duration'].map((filter) => (
                <div key={filter} className="w-[calc(50%-0.4rem)] md:w-auto">
                   <select name={filter} value={filters[filter]} onChange={updateFilter} className="w-full bg-black border border-white/10 hover:border-white/20 rounded-xl px-4 py-2 text-[11px] font-bold uppercase tracking-wider outline-none transition-all text-accents-4 hover:text-white cursor-pointer appearance-none">
                      {filter === 'region' && <>
                        <option value="US">USA</option>
                        <option value="GB">UK</option>
                        <option value="DE">Germany</option>
                        <option value="FR">France</option>
                        <option value="JP">Japan</option>
                        <option value="IN">India</option>
                      </>}
                      {filter === 'order' && <><option value="relevance">Relevance</option><option value="date">Newest</option><option value="viewCount">Views</option><option value="virality">Virality</option></>}
                      {filter === 'uploadDate' && <><option value="">Anytime</option><option value="today">Today</option><option value="week">This Week</option><option value="month">This Month</option></>}
                      {filter === 'duration' && <><option value="">Any Length</option><option value="short">Short</option><option value="medium">Medium</option><option value="long">Long</option></>}
                   </select>
                </div>
             ))}
             <div className="flex gap-6 pt-2 md:pt-0 md:pl-4 items-center w-full md:w-auto justify-center">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" name="vectorOnly" checked={filters.vectorOnly} onChange={updateFilter} className="sr-only" />
                  <div className={`w-4 h-4 rounded border transition-all ${filters.vectorOnly ? 'bg-geist-success border-geist-success' : 'border-white/20 group-hover:border-white/40'}`}>
                    {filters.vectorOnly && <svg className="w-3 h-3 text-white m-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-accents-4 group-hover:text-white transition-colors">Vector</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" checked={showMarketAnalysis} onChange={(e) => setShowMarketAnalysis(e.target.checked)} className="sr-only" />
                  <div className={`w-4 h-4 rounded border transition-all ${showMarketAnalysis ? 'bg-white border-white' : 'border-white/20 group-hover:border-white/40'}`}>
                    {showMarketAnalysis && <svg className="w-3 h-3 text-black m-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-accents-4 group-hover:text-white transition-colors">Analysis</span>
                </label>
             </div>
          </div>
        </section>

        {results && results.length > 0 && showMarketAnalysis && (
          <section className="mb-16 animate-in fade-in duration-700">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl flex flex-col justify-between">
                   <div>
                      <p className="text-[10px] font-bold text-accents-4 uppercase tracking-wider mb-2">Market Volume</p>
                      <div className="text-3xl font-bold text-white tracking-tight">
                        {formatNumber(results.reduce((acc, item) => acc + parseInt(item.statistics?.viewCount || 0), 0))}
                      </div>
                      <p className="text-[10px] text-accents-3 font-medium mt-1">Total views in niche</p>
                   </div>
                </div>

                <div className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl flex flex-col justify-between">
                   <div>
                      <p className="text-[10px] font-bold text-accents-4 uppercase tracking-wider mb-2">Competition</p>
                      <div className="text-3xl font-bold text-white tracking-tight">
                        {results.length > 25 ? 'High' : results.length > 10 ? 'Medium' : 'Low'}
                      </div>
                      <p className="text-[10px] text-accents-3 font-medium mt-1">Niche saturation</p>
                   </div>
                </div>

                <div className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl flex flex-col justify-between">
                   <div>
                      <p className="text-[10px] font-bold text-accents-4 uppercase tracking-wider mb-2">Opportunity</p>
                      <div className="text-3xl font-bold text-geist-success tracking-tight">
                        {(() => {
                           const avgVirality = results.reduce((acc, item) => acc + calculateViralityScore(item).score, 0) / results.length;
                           const confidenceFactor = Math.min(results.length / 10, 1);
                           const saturationPenalty = 1 - (results.length / 100);
                           return (avgVirality * saturationPenalty * confidenceFactor).toFixed(0);
                        })()}%
                      </div>
                      <p className="text-[10px] text-accents-3 font-medium mt-1">Growth potential</p>
                   </div>
                </div>
             </div>
          </section>
        )}

        <div className="grid grid-cols-1 gap-6">
          {results?.map((item) => (
            <VideoCard 
              key={item.id?.videoId || item.id} 
              item={item} 
              setHoverInfo={setHoverInfo} 
              setSelectedVideo={setSelectedVideo} 
              formatNumber={formatNumber} 
            />
          ))}
        </div>

        {nextPageToken && (
          <div className="flex justify-center mt-12">
            <button 
              onClick={loadMore}
              disabled={loadingMore}
              className="bg-white/5 hover:bg-white/10 text-white font-bold text-xs tracking-wider uppercase px-10 py-3.5 rounded-xl border border-white/10 transition-all flex items-center gap-3 disabled:opacity-50"
            >
              {loadingMore ? (
                <>
                  <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <span>Load More</span>
                  <Zap className="w-3 h-3" />
                </>
              )}
            </button>
          </div>
        )}
      </main>

      {loading && (
        <div className="fixed bottom-8 right-8 z-[100] animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="flex items-center gap-3 bg-black/80 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-full shadow-2xl">
            <div className="w-2.5 h-2.5 relative">
              <div className="absolute inset-0 border-2 border-white/20 rounded-full"></div>
              <div className="absolute inset-0 border-2 border-geist-success rounded-full border-t-transparent animate-spin"></div>
            </div>
            <span className="text-[10px] font-bold text-accents-4 uppercase tracking-wider">{loadingText}</span>
          </div>
        </div>
      )}
    </div>
  );
}
