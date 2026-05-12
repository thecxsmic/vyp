"use client";

import { useState } from "react";

export default function IdeaGenerator({ channelId, channelData }) {
  const [ideas, setIdeas] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateIdeas = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/video-ideas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          channelId,
          channelData: channelData ? {
            channel: {
              title: channelData.channel.title,
              subscriberCount: parseInt(channelData.channel.statistics?.subscriberCount || 0),
              videoCount: parseInt(channelData.channel.statistics?.videoCount || 0),
              viewCount: parseInt(channelData.channel.statistics?.viewCount || 0),
              description: channelData.channel.description,
              publishedAt: channelData.channel.publishedAt,
              statistics: channelData.channel.statistics
            },
            recentVideos: channelData.videos?.map(v => ({
              title: v.snippet?.title || v.title,
              viewCount: parseInt(v.statistics?.viewCount || 0),
              likeCount: parseInt(v.statistics?.likeCount || 0),
              commentCount: parseInt(v.statistics?.commentCount || 0),
              publishedAt: v.snippet?.publishedAt || v.published_at
            }))
          } : null
        }),
      });

      const data = await response.json();
      if (!data.success) throw new Error(data.error || "Failed to generate ideas");
      setIdeas(data.ideas);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {!ideas && !loading && (
        <div className="bg-[#080808] border border-white/5 p-12 rounded-[3rem] text-center">
          <div className="w-20 h-20 bg-[#0070f3]/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <svg className="w-10 h-10 text-[#0070f3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter">AI Strategy Engine</h3>
          <p className="text-[#888888] text-sm max-w-md mx-auto mb-10 font-medium">
            Generate 6 data-driven video ideas tailored to this channel's audience, performance patterns, and niche DNA using Groq GPT-OSS 120B.
          </p>
          <button
            onClick={generateIdeas}
            className="bg-white text-black px-12 py-4 rounded-2xl font-black hover:scale-105 active:scale-95 transition-all shadow-[0_20px_40px_rgba(255,255,255,0.1)] uppercase tracking-widest text-sm"
          >
            Generate Viral Concepts
          </button>
        </div>
      )}

      {loading && (
        <div className="bg-[#080808] border border-white/5 p-20 rounded-[3rem] text-center">
          <div className="flex flex-col items-center gap-6">
            <div className="w-12 h-12 border-4 border-[#0070f3]/20 border-t-[#0070f3] rounded-full animate-spin"></div>
            <div>
              <p className="text-sm font-black text-white uppercase tracking-[0.3em]">Neural Synthesis in Progress</p>
              <p className="text-[10px] text-[#444444] font-bold uppercase mt-2">Analyzing niche trends & audience patterns...</p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-[2rem] text-center">
          <p className="text-red-500 font-bold mb-4">{error}</p>
          <button onClick={generateIdeas} className="text-xs font-black uppercase text-white hover:underline">Try Again</button>
        </div>
      )}

      {ideas && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ideas.map((idea, i) => (
            <div key={i} className="bg-[#080808] border border-white/5 p-8 rounded-[2.5rem] hover:border-white/10 transition-all flex flex-col h-full group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-10 transition-opacity">
                <svg className="w-24 h-24 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM5.884 6.607a1 1 0 01-.226 1.396l-1.108.812a1 1 0 01-1.17-1.622l1.108-.812a1 1 0 011.396.226zM15.342 6.607a1 1 0 00.226 1.396l1.108.812a1 1 0 001.17-1.622l-1.108-.812a1 1 0 00-1.396.226zM4.343 12.103a1 1 0 011.396.226l1.108.812a1 1 0 01-1.17 1.622l-1.108-.812a1 1 0 01-.226-1.396zM14.261 12.103a1 1 0 00-1.396.226l-1.108.812a1 1 0 001.17 1.622l1.108-.812a1 1 0 00.226-1.396zM10 14a1 1 0 100 2 1 1 0 000-2z" /></svg>
              </div>

              <div className="flex justify-between items-start mb-6">
                <div className="flex flex-col gap-2">
                   <span className="bg-[#0070f3]/10 text-[#0070f3] text-[8px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest w-fit border border-[#0070f3]/20">
                    {idea.category}
                  </span>
                  {idea.trending && (
                    <span className="bg-[#00dfd8]/10 text-[#00dfd8] text-[8px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest w-fit border border-[#00dfd8]/20">
                      Trending Topic
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-black text-[#444444] uppercase tracking-widest mb-1">Fit Score</p>
                  <p className="text-xl font-black text-white">{(idea.personalizationScore * 100).toFixed(0)}%</p>
                </div>
              </div>

              <h4 className="text-xl font-black text-white mb-4 tracking-tight leading-tight group-hover:text-[#0070f3] transition-colors">
                {idea.title}
              </h4>
              
              <p className="text-xs text-[#888888] font-medium leading-relaxed mb-8 flex-1">
                {idea.description}
              </p>

              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/5 mt-auto">
                <div>
                  <p className="text-[9px] font-black text-[#444444] uppercase tracking-widest mb-1">Proj. Views</p>
                  <p className="text-xs font-black text-white">{idea.estimatedViews}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black text-[#444444] uppercase tracking-widest mb-1">Difficulty</p>
                  <p className={`text-xs font-black ${
                    idea.difficulty === 'Easy' ? 'text-green-400' : 
                    idea.difficulty === 'Medium' ? 'text-yellow-400' : 'text-red-400'
                  }`}>{idea.difficulty}</p>
                </div>
              </div>
              
              <div className="mt-6 flex flex-wrap gap-2">
                {idea.tags.map((tag, idx) => (
                  <span key={idx} className="text-[8px] font-bold text-[#444444] hover:text-white transition-colors">#{tag}</span>
                ))}
              </div>
            </div>
          ))}
          
          <div className="md:col-span-2 flex justify-center pt-8">
             <button
              onClick={() => setIdeas(null)}
              className="text-[10px] font-black text-[#444444] hover:text-white uppercase tracking-[0.3em] transition-colors"
            >
              Clear and Re-generate
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
