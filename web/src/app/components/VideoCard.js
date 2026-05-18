"use client";

import { useState, useEffect } from "react";
import { calculateViralityScore } from "@/lib/ranking/virality";
import { Bookmark, Save } from "lucide-react";
import ResearchNotesModal from "./ResearchNotesModal";

export default function VideoCard({ item, setHoverInfo, setSelectedVideo, formatNumber }) {
  const [color, setColor] = useState("0, 112, 243"); // Default blue
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const v = calculateViralityScore(item);

  useEffect(() => {
    const thumbUrl = item.snippet.thumbnails.medium.url;
    if (!thumbUrl) return;

    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = thumbUrl;

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        canvas.width = 1;
        canvas.height = 1;
        
        // Draw center of the image to avoid black bars
        ctx.drawImage(img, img.width / 4, img.height / 4, img.width / 2, img.height / 2, 0, 0, 1, 1);
        
        const imageData = ctx.getImageData(0, 0, 1, 1).data;
        let [r, g, b] = imageData;

        // Enhance color: ensure it's not too dark or too desaturated
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        if (brightness < 60) {
          const factor = 60 / (brightness || 1);
          r = Math.min(255, Math.round(r * factor + 20));
          g = Math.min(255, Math.round(g * factor + 20));
          b = Math.min(255, Math.round(b * factor + 20));
        }

        setColor(`${r}, ${g}, ${b}`);
      } catch (e) {
        console.warn("Color extraction failed for", thumbUrl, e);
      }
    };
  }, [item.snippet.thumbnails.medium.url]);

  return (
    <div 
      className="group relative border transition-all duration-300 flex flex-col md:flex-row min-h-[16rem] hover:border-white/20 rounded-2xl overflow-hidden bg-black"
      style={{ 
        borderColor: `rgba(${color}, 0.15)`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `rgba(${color}, 0.4)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = `rgba(${color}, 0.15)`;
      }}
    >
      <div className="relative md:w-[22rem] h-48 md:h-auto flex-shrink-0 overflow-hidden">
        <img 
          src={item.snippet.thumbnails.medium.url} 
          alt="" 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-40"></div>
        <div className="absolute bottom-4 left-4 flex flex-col gap-2">
           <div 
            onMouseEnter={() => setHoverInfo({ 
              title: `${v.level} Status`, 
              text: `Performance based on daily views and engagement.` 
            })} 
            onMouseLeave={() => setHoverInfo(null)} 
            className={`bg-black/60 backdrop-blur-md border border-white/10 text-white px-3 py-1 rounded-lg font-bold text-[10px] tracking-wider uppercase cursor-help flex items-center gap-2`}
           >
              <span className={v.color.split(' ')[1]}>{v.level}</span>
              <span className="w-px h-2.5 bg-white/20"></span>
              <span className="opacity-80">{v.score}</span>
           </div>
        </div>
      </div>

      <div className="p-6 md:p-8 flex-1 flex flex-col overflow-hidden relative z-10">
        <div className="flex-1">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-3">
            <h3 
              className="font-bold text-xl md:text-2xl tracking-tight leading-tight transition-colors line-clamp-2 text-white" 
              dangerouslySetInnerHTML={{ __html: item.snippet.title }}
            ></h3>
            {item.distance !== undefined && !isNaN(item.distance) && (
              <span 
                className="shrink-0 text-[10px] font-bold px-2 py-1 rounded-md tracking-wider border border-white/10 bg-white/5 text-accents-4"
              >
                {(item.distance * 100).toFixed(0)}% MATCH
              </span>
            )}
          </div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-accents-4 mb-4 flex items-center gap-2">
            <span className="text-accents-6 hover:text-white transition-colors cursor-pointer">{item.snippet.channelTitle}</span>
            <span className="w-1 h-1 bg-white/10 rounded-full"></span>
            <span className="font-medium">{new Date(item.snippet.publishedAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</span>
          </p>
          <p className="text-xs text-accents-4 line-clamp-2 font-medium leading-relaxed mb-6 group-hover:text-accents-5 transition-colors">{item.snippet.description}</p>
        </div>
        
        <div className="mt-auto flex flex-col sm:flex-row items-start sm:items-center justify-between border-t border-white/5 pt-6 gap-6">
           <div className="flex gap-10 w-full sm:w-auto justify-between sm:justify-start">
              <div className="flex flex-col">
                <span className="text-[10px] text-accents-4 font-bold uppercase tracking-wider mb-1">Daily Views</span>
                <span className="text-lg font-bold text-white tracking-tight">{formatNumber(v.dailyViews)}</span>
              </div>
              <div 
                onMouseEnter={() => setHoverInfo({ title: "Engagement", text: "Likes and comments compared to views." })} 
                onMouseLeave={() => setHoverInfo(null)} 
                className="flex flex-col cursor-help"
              >
                <span className="text-[10px] text-accents-4 font-bold uppercase tracking-wider mb-1">Engagement</span>
                <span className="text-lg font-bold text-white tracking-tight" style={{ color: `rgba(${color}, 1)` }}>{v.engagement}%</span>
              </div>
           </div>
           <div className="flex gap-3 w-full sm:w-auto">
              <button 
                onClick={() => setIsNotesModalOpen(true)}
                className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5 text-accents-4 hover:text-white"
              >
                <Save className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setSelectedVideo({ item, v, dominantColor: color })} 
                className="w-full sm:w-auto shrink-0 text-[10px] font-bold tracking-wider uppercase bg-white text-black px-6 py-2.5 rounded-xl hover:opacity-90 active:scale-95 transition-all shadow-lg"
              >
                Details
              </button>
           </div>
        </div>
      </div>

      <ResearchNotesModal
        isOpen={isNotesModalOpen}
        onClose={() => setIsNotesModalOpen(false)}
        item={{
          id: item.id.videoId || item.id,
          type: 'video',
          title: item.snippet.title,
          thumbnail: item.snippet.thumbnails.medium.url,
          metadata: {
            thumbnail: item.snippet.thumbnails.medium.url,
            channelId: item.snippet.channelId,
            channelTitle: item.snippet.channelTitle,
            publishedAt: item.snippet.publishedAt,
            statistics: item.statistics || {},
            vScore: v.score
          }
        }}
      />
    </div>
  );
}
