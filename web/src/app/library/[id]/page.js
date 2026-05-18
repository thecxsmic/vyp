'use client';

import { useState, useEffect, useMemo, use } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Save, Trash2, Video, User, Lightbulb, 
  BarChart3, FileText, Loader2, Eye, Users, TrendingUp, 
  Calendar, Target, Zap, Activity, ExternalLink, MessageSquare, 
  ThumbsUp, Flame, Rocket, Edit3, Radio, ShieldCheck, 
  History, Globe, Cpu, Share2, Network, ChevronRight
} from 'lucide-react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

function NeuralGraphPreview() {
  return (
    <div className="relative w-full h-40 overflow-hidden bg-zinc-900/20 border border-zinc-800/50 rounded-[2rem] flex items-center justify-center group shadow-inner">
       <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent opacity-50"></div>
       <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 200 100">
          <motion.circle 
            cx="40" cy="50" r="1.5" fill="#3b82f6" 
            animate={{ opacity: [0.2, 1, 0.2], scale: [1, 1.5, 1] }} 
            transition={{ duration: 3, repeat: Infinity }}
          />
          <motion.circle 
            cx="160" cy="50" r="1.5" fill="#8b5cf6" 
            animate={{ opacity: [0.2, 1, 0.2], scale: [1, 1.5, 1] }} 
            transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
          />
          <motion.circle 
            cx="100" cy="30" r="1.5" fill="#fff" 
            animate={{ opacity: [0.2, 1, 0.2], scale: [1, 1.5, 1] }} 
            transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
          />
          <motion.path 
            d="M 40 50 L 100 30 L 160 50" 
            fill="none" stroke="#3f3f46" strokeWidth="0.5"
            strokeDasharray="4 4"
            animate={{ strokeDashoffset: [0, -20] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
       </svg>
       <div className="relative z-10 flex flex-col items-center gap-3">
          <div className="flex -space-x-3">
             <motion.div 
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center backdrop-blur-md shadow-lg"
             >
                <Network className="w-5 h-5 text-blue-400" />
             </motion.div>
             <motion.div 
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center backdrop-blur-md shadow-lg"
             >
                <Cpu className="w-5 h-5 text-purple-400" />
             </motion.div>
          </div>
          <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] group-hover:text-zinc-400 transition-colors">Neural Graph Active</p>
       </div>
    </div>
  );
}

export default function NotePage({ params }) {
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;
  const router = useRouter();
  
  const [item, setItem] = useState(null);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchNote();
  }, [id]);

  const fetchNote = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/library?id=${id}`);
      const data = await res.json();
      if (data.success && data.item) {
        setItem(data.item);
        setContent(data.item.content || '');
        setTitle(data.item.title || '');
      } else {
        router.push('/library');
      }
    } catch (err) {
      console.error('Failed to fetch note:', err);
      router.push('/library');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/library', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: id,
          type: item.type,
          reference_id: item.reference_id,
          title: title,
          content: content,
          metadata: item.metadata
        })
      });
      const data = await res.json();
      if (data.success) {
        // Success feedback could be added here
      }
    } catch (err) {
      console.error('Failed to save note:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this research note?')) return;
    
    setDeleting(true);
    try {
      const res = await fetch('/api/library', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: id,
          action: 'delete'
        })
      });
      const data = await res.json();
      if (data.success) {
        router.push('/library');
      }
    } catch (err) {
      console.error('Failed to delete note:', err);
      setDeleting(false);
    }
  };

  const formatNumber = (num) => {
    if (isNaN(num) || num === null || num === undefined) return "0";
    const n = parseInt(num);
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return n.toString();
  };

  const getIcon = () => {
    switch (item?.type) {
      case 'video': return <Video className="w-6 h-6 text-blue-500" />;
      case 'channel': return <User className="w-6 h-6 text-purple-500" />;
      case 'idea': return <Lightbulb className="w-6 h-6 text-yellow-500" />;
      default: return <FileText className="w-6 h-6 text-zinc-500" />;
    }
  };

  const getIdeaDetails = () => {
    if (item?.type !== 'idea') return null;
    const m = item.metadata || {};
    const rationale = m.why || m.opportunity || m.rationale || m.predictedViews;
    const effort = m.effort || m.difficulty || (m.viralScore ? `${m.viralScore} Viral Score` : null);
    const timing = m.timing || m.momentum || m.topic;
    const action = m.actionableIdea || m.description;

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 px-1">
           <Target className="w-4 h-4 text-zinc-500" />
           <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Core Strategy</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {rationale && (
             <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 space-y-3 shadow-sm hover:border-zinc-700 transition-colors">
                <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest flex items-center gap-2">
                  <Rocket className="w-3.5 h-3.5 text-purple-500" />
                  Opportunity
                </p>
                <p className="text-[13px] text-zinc-300 leading-relaxed italic">"{rationale}"</p>
             </div>
           )}
           {action && (
             <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 space-y-3 shadow-sm hover:border-zinc-700 transition-colors">
                <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest flex items-center gap-2">
                  <Flame className="w-3.5 h-3.5 text-orange-500" />
                  Action Plan
                </p>
                <p className="text-[13px] text-zinc-300 leading-relaxed">{action}</p>
             </div>
           )}
        </div>

        <div className="flex flex-wrap gap-3">
           {effort && (
             <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl px-5 py-3 flex items-center gap-3 hover:bg-zinc-900/60 transition-colors">
                <Zap className="w-4 h-4 text-yellow-500" />
                <div>
                   <p className="text-[8px] font-black text-zinc-600 uppercase tracking-tighter">Effort</p>
                   <p className="text-[11px] font-bold text-zinc-200 uppercase">{effort}</p>
                </div>
             </div>
           )}
           {timing && (
             <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl px-5 py-3 flex items-center gap-3 hover:bg-zinc-900/60 transition-colors">
                <Activity className="w-4 h-4 text-blue-500" />
                <div>
                   <p className="text-[8px] font-black text-zinc-600 uppercase tracking-tighter">Momentum</p>
                   <p className="text-[11px] font-bold text-zinc-200 uppercase">{timing}</p>
                </div>
             </div>
           )}
           {m.viralScore && (
             <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl px-5 py-3 flex items-center gap-3 hover:bg-zinc-900/60 transition-colors">
                <TrendingUp className="w-4 h-4 text-red-500" />
                <div>
                   <p className="text-[8px] font-black text-zinc-600 uppercase tracking-tighter">Viral Score</p>
                   <p className="text-[11px] font-bold text-zinc-200 uppercase">{m.viralScore}/100</p>
                </div>
             </div>
           )}
        </div>
      </div>
    );
  };

  const getVideoDetails = () => {
    if (item?.type !== 'video') return null;
    const stats = item.metadata?.statistics || {};
    
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 px-1">
           <BarChart3 className="w-4 h-4 text-zinc-500" />
           <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Engagement Metrics</h4>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           {[
             { label: 'Views', value: stats.viewCount, icon: Eye, color: 'text-zinc-400' },
             { label: 'Likes', value: stats.likeCount, icon: ThumbsUp, color: 'text-zinc-400' },
             { label: 'Comments', value: stats.commentCount, icon: MessageSquare, color: 'text-zinc-400' },
             { label: 'Virality', value: `${item.metadata?.vScore || 0}%`, icon: TrendingUp, color: 'text-blue-500' }
           ].map((stat, i) => (
             <div key={i} className="bg-zinc-900/40 border border-zinc-800 rounded-[1.5rem] p-5 hover:border-zinc-700 transition-all group">
                <div className="flex items-center gap-2 text-zinc-600 mb-2 group-hover:text-zinc-400 transition-colors">
                   <stat.icon className={`w-4 h-4 ${stat.color}`} />
                   <span className="text-[9px] font-black uppercase tracking-widest">{stat.label}</span>
                </div>
                <p className={`text-2xl font-black italic tracking-tighter ${stat.color === 'text-blue-500' ? 'text-blue-500' : 'text-white'}`}>
                   {typeof stat.value === 'string' && stat.value.includes('%') ? stat.value : formatNumber(stat.value)}
                </p>
             </div>
           ))}
        </div>

        {item.metadata?.description && (
          <div className="bg-zinc-900/20 border border-zinc-800/50 rounded-3xl p-8 shadow-inner">
             <div className="flex items-center gap-2 mb-4">
                <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Original Description Metadata</p>
                <div className="flex-1 h-px bg-zinc-800/50"></div>
             </div>
             <p className="text-[13px] text-zinc-500 leading-relaxed line-clamp-6 whitespace-pre-wrap italic">{item.metadata.description}</p>
          </div>
        )}
      </div>
    );
  };

  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'clean']
    ],
  }), []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 lg:p-12 pb-32">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group px-4 py-2 bg-zinc-900/40 rounded-full border border-zinc-800/50"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest">Back to Library</span>
          </button>
          
          <div className="flex items-center gap-4">
             <button
                onClick={handleDelete}
                disabled={deleting}
                className="p-3 bg-zinc-900/50 hover:bg-red-500/10 text-zinc-500 hover:text-red-500 border border-zinc-800 rounded-2xl transition-all"
                title="Delete Note"
              >
                {deleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-8 py-3 bg-white text-black rounded-2xl text-sm font-black hover:bg-zinc-200 transition-all disabled:opacity-50 shadow-xl shadow-white/5"
              >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Save Intelligence
              </button>
          </div>
        </div>

        {/* Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          <div className="lg:col-span-2 space-y-12">
            <div className="flex items-start gap-6">
               <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-[2rem] shrink-0 shadow-2xl">
                  {getIcon()}
               </div>
               <div className="flex-1 min-w-0 pt-1">
                  <input 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-transparent border-none p-0 text-4xl font-black italic tracking-tighter focus:ring-0 placeholder-zinc-900 transition-all"
                    placeholder="Intelligence Label"
                  />
                  <div className="flex items-center gap-3 mt-4">
                    <span className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-[9px] font-black uppercase tracking-widest text-zinc-500">
                      {item.type}
                    </span>
                    <div className="w-1 h-1 rounded-full bg-zinc-800"></div>
                    <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest flex items-center gap-1.5">
                      <History className="w-3 h-3" /> Updated {new Date(item.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
               </div>
            </div>

            {/* Reference Context */}
            <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-[2.5rem] overflow-hidden shadow-2xl relative group">
               <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <div className="flex flex-col md:flex-row">
                  {(item.metadata?.thumbnail || (item.type === 'video' && item.reference_id)) && (
                    <div className="w-full md:w-80 aspect-video md:aspect-auto bg-zinc-800 relative shrink-0 overflow-hidden">
                       <img 
                        src={item.metadata?.thumbnail || (item.type === 'video' ? `https://i.ytimg.com/vi/${item.reference_id}/mqdefault.jpg` : null)} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                        alt="" 
                       />
                       <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent"></div>
                       <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                          <span className="text-[8px] font-black uppercase tracking-widest text-white">Live Source</span>
                       </div>
                    </div>
                  )}
                  <div className="p-10 flex-1 flex flex-col justify-center min-w-0 relative z-10">
                     <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                        <Activity className="w-3.5 h-3.5" /> Context Reference
                     </p>
                     
                     <div className="space-y-6">
                        {(item.metadata?.channelTitle || item.type === 'idea') && (
                          <div className="space-y-2">
                             <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Intelligence Origin</p>
                             <div className="flex items-center gap-3">
                                <p className="text-2xl font-bold text-zinc-200 tracking-tight">
                                   {item.metadata?.channelTitle || (item.type === 'idea' ? 'Trend Radar Intelligence' : 'Linked Reference')}
                                </p>
                                {item.type === 'idea' && (
                                   <div className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded text-[8px] font-black text-blue-500 uppercase tracking-widest">
                                      Neural AI
                                   </div>
                                )}
                             </div>
                          </div>
                        )}
                        
                        <div className="flex gap-4 pt-2">
                           {item.type === 'idea' && (
                             <div className="flex items-center gap-2.5 px-5 py-2.5 bg-zinc-800/50 border border-zinc-700/50 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-400">
                                <Radio className="w-3.5 h-3.5 text-blue-500" />
                                Neural Engine v4.2
                             </div>
                           )}
                           {item.type === 'video' && (
                             <a 
                               href={`https://youtube.com/watch?v=${item.reference_id}`}
                               target="_blank"
                               rel="noopener noreferrer"
                               className="flex items-center gap-2.5 px-6 py-3 bg-white text-black hover:bg-zinc-200 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98]"
                             >
                               <ExternalLink className="w-4 h-4" />
                               YouTube Original
                             </a>
                           )}
                           {item.type === 'channel' && (
                             <a 
                               href={`/channels?channelId=${item.reference_id}`}
                               className="flex items-center gap-2.5 px-6 py-3 bg-white text-black hover:bg-zinc-200 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98]"
                             >
                               <BarChart3 className="w-4 h-4" />
                               Analyze Ecosystem
                             </a>
                           )}
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Injected Details */}
            {item.type === 'idea' && getIdeaDetails()}
            {item.type === 'video' && getVideoDetails()}
          </div>

          <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-[2.5rem] p-8 space-y-10 shadow-2xl lg:sticky lg:top-12 backdrop-blur-xl">
             <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 flex items-center gap-3">
                   <ShieldCheck className="w-4 h-4" /> Intelligence Meta
                </h4>
                <div className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-[8px] font-black text-green-500 uppercase tracking-widest flex items-center gap-1.5">
                   <div className="w-1 h-1 rounded-full bg-green-500"></div>
                   Synced
                </div>
             </div>
             
             <div className="space-y-4">
                {[
                  { label: 'Global Release', value: item.metadata?.publishedAt ? new Date(item.metadata.publishedAt).toLocaleDateString(undefined, { dateStyle: 'long' }) : null, icon: Globe, color: 'text-blue-500' },
                  { label: 'Intelligence Entry', value: new Date(item.created_at).toLocaleDateString(undefined, { dateStyle: 'long' }), icon: History, color: 'text-purple-500' },
                  { label: 'Channel Reach', value: item.metadata?.statistics?.subscriberCount ? `${formatNumber(item.metadata.statistics.subscriberCount)} Subscribers` : null, icon: Users, color: 'text-green-500' }
                ].filter(stat => stat.value).map((stat, i) => (
                   <div key={i} className="bg-black/40 border border-zinc-800/50 rounded-2xl p-5 flex items-center gap-5 group hover:border-zinc-700 transition-all shadow-sm">
                      <div className="w-11 h-11 rounded-[1.2rem] bg-zinc-900 flex items-center justify-center shrink-0 border border-zinc-800/50">
                         <stat.icon className={`w-5 h-5 text-zinc-600 group-hover:${stat.color} transition-colors duration-500`} />
                      </div>
                      <div className="min-w-0">
                         <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest block mb-1">{stat.label}</span>
                         <p className="text-[13px] font-bold text-zinc-100 group-hover:text-white transition-colors">{stat.value}</p>
                      </div>
                   </div>
                ))}
             </div>

             <div className="pt-10 border-t border-zinc-800/50 space-y-6">
                <div className="flex items-center justify-between px-1">
                   <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] flex items-center gap-2">
                      <Network className="w-3.5 h-3.5" /> Graph Topology
                   </p>
                   <Share2 className="w-3.5 h-3.5 text-zinc-800 hover:text-zinc-600 cursor-pointer transition-colors" />
                </div>
                <NeuralGraphPreview />
             </div>
          </div>
        </div>

        {/* Editor Section */}
        <div className="space-y-8">
          <div className="flex items-center justify-between px-6">
             <label className="text-xs font-black text-zinc-500 uppercase tracking-[0.4em] flex items-center gap-4">
                <div className="w-8 h-8 rounded-xl bg-zinc-900 flex items-center justify-center border border-zinc-800/50">
                   <Edit3 className="w-4 h-4" /> 
                </div>
                Strategy & Intelligence Observations
             </label>
             <AnimatePresence>
                {saving && (
                   <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full"
                   >
                      <Loader2 className="w-3 h-3 text-blue-500 animate-spin" />
                      <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">Saving Intelligence...</span>
                   </motion.div>
                )}
             </AnimatePresence>
          </div>
          <div className="bg-zinc-900/10 border border-zinc-800/50 rounded-[3rem] overflow-hidden min-h-[700px] rich-text-editor full-editor shadow-2xl backdrop-blur-sm">
            <ReactQuill 
              theme="snow"
              value={content}
              onChange={setContent}
              modules={modules}
              placeholder="Start drafting your viral strategy, hook ideas, or research notes..."
              className="quill-dark h-[630px]"
            />
          </div>
        </div>
      </div>

      <style jsx global>{`
        .full-editor .ql-toolbar {
          background: #09090b;
          border: none !important;
          border-bottom: 1px solid #18181b !important;
          padding: 2rem !important;
          border-top-left-radius: 3rem;
          border-top-right-radius: 3rem;
        }
        .full-editor .ql-container {
          border: none !important;
          padding: 2rem !important;
          font-family: inherit;
          font-size: 1.125rem;
          background: transparent;
        }
        .full-editor .ql-editor {
          color: #e4e4e7;
          line-height: 2;
          padding: 2rem !important;
        }
        .full-editor .ql-editor.ql-blank::before {
          color: #27272a !important;
          font-style: normal;
          left: 4rem;
          top: 4rem;
        }
        .quill-dark .ql-stroke {
          stroke: #52525b !important;
        }
        .quill-dark .ql-fill {
          fill: #52525b !important;
        }
        .quill-dark .ql-picker {
          color: #52525b !important;
        }
        .quill-dark .ql-active .ql-stroke {
          stroke: #fff !important;
        }
        .quill-dark .ql-active .ql-fill {
          fill: #fff !important;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #27272a;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
