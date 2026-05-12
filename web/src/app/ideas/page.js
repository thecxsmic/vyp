"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import IdeaGenerator from "../components/IdeaGenerator";

function IdeasContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [channelData, setChannelData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;

    setLoading(true);
    setError(null);
    setChannelData(null);

    try {
      const res = await fetch(`/api/youtube/channel?channelId=${encodeURIComponent(query)}`);
      let data = await res.json();
      
      // If not a direct ID, search for it first
      if (!res.ok || !data.channel) {
        const searchRes = await fetch(`/api/youtube/channel?q=${encodeURIComponent(query)}`);
        const searchData = await searchRes.json();
        
        if (searchData.items && searchData.items.length > 0) {
          // Select the first result and fetch full data
          const firstId = searchData.items[0].id;
          const fullRes = await fetch(`/api/youtube/channel?channelId=${firstId}`);
          data = await fullRes.json();
        } else {
          throw new Error("Channel not found. Try a Channel ID or full handle.");
        }
      }

      setChannelData(data);
      // Update URL without refresh
      const params = new URLSearchParams(searchParams);
      params.set("channelId", data.channel.id);
      router.push(`?${params.toString()}`, { scroll: false });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full bg-black text-[#ededed] font-sans pb-24">
      <main className="max-w-6xl mx-auto px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 bg-gradient-to-b from-white to-[#666666] bg-clip-text text-transparent uppercase">Content Strategy</h1>
          <p className="text-[#888888] text-sm md:text-lg max-w-xl mx-auto font-medium leading-relaxed px-4">Generate viral video concepts using GPT-OSS 120B Intelligence.</p>
        </div>

        <section className="mb-16">
          <form onSubmit={handleSearch} className="relative group max-w-3xl mx-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#0070f3] via-[#00dfd8] to-[#0070f3] rounded-3xl blur-xl opacity-20 group-focus-within:opacity-40 transition duration-1000"></div>
            <div className="relative flex items-center bg-[#000000] border border-[#333333] rounded-2xl md:rounded-3xl overflow-hidden focus-within:border-[#0070f3] transition-all duration-500 shadow-2xl">
              <div className="pl-4 md:pl-8 text-[#666666] shrink-0">
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input 
                type="text" 
                placeholder="Enter Channel Name or ID..." 
                value={query} 
                onChange={(e) => setQuery(e.target.value)} 
                className="w-full py-4 md:py-6 px-4 md:px-6 bg-transparent outline-none text-base md:text-xl font-bold placeholder-[#444444] text-white tracking-tight" 
              />
              <button 
                type="submit" 
                disabled={loading} 
                className="mr-2 md:mr-4 bg-white text-black px-4 md:px-10 py-2 md:py-3 rounded-xl md:rounded-2xl font-black hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 md:gap-3 shadow-xl text-xs md:text-base min-w-[120px]"
              >
                {loading ? "SEARCHING..." : "ANALYZE"}
              </button>
            </div>
          </form>
        </section>

        {error && (
          <div className="max-w-xl mx-auto bg-red-500/10 border border-red-500/20 p-6 rounded-2xl text-center mb-12">
            <p className="text-red-500 font-bold">{error}</p>
          </div>
        )}

        {channelData && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-[#080808] border border-white/5 p-6 rounded-[2rem] flex items-center gap-6 max-w-2xl mx-auto">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/10 shrink-0">
                <img src={channelData.channel.thumbnail} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xl font-black text-white truncate">{channelData.channel.title}</h4>
                <p className="text-[10px] text-[#666666] font-bold uppercase tracking-widest">{channelData.channel.custom_url}</p>
              </div>
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-black text-[#444444] uppercase tracking-widest mb-1">Subscribers</p>
                <p className="text-lg font-black text-white">
                  {parseInt(channelData.channel.statistics?.subscriberCount || 0).toLocaleString()}
                </p>
              </div>
            </div>

            <IdeaGenerator 
              channelId={channelData.channel.id} 
              channelData={channelData} 
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default function Ideas() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white font-black tracking-widest">LOADING STRATEGY...</div>}>
      <IdeasContent />
    </Suspense>
  );
}
