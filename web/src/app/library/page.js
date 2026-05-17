'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Video, User, Lightbulb, BarChart3, Trash2, Edit3, ExternalLink, Calendar, Plus, BookOpen, Clock } from 'lucide-react';
import Link from 'next/link';

export default function LibraryPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchItems();
  }, [filter]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const url = filter === 'all' ? '/api/library' : `/api/library?type=${filter}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) setItems(data.items);
    } catch (err) {
      console.error('Failed to fetch library items:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this research item?')) return;
    try {
      const res = await fetch('/api/library', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id })
      });
      const data = await res.json();
      if (data.success) {
        setItems(items.filter(item => item.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete item:', err);
    }
  };

  const filteredItems = items.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getIcon = (type) => {
    switch (type) {
      case 'video': return <Video className="w-4 h-4 text-blue-500" />;
      case 'channel': return <User className="w-4 h-4 text-purple-500" />;
      case 'idea': return <Lightbulb className="w-4 h-4 text-yellow-500" />;
      case 'analysis': return <BarChart3 className="w-4 h-4 text-green-500" />;
      default: return <BookOpen className="w-4 h-4 text-zinc-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 sm:p-12 pb-32">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div>
               <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                    <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-black border-b-[6px] border-b-transparent ml-0.5"></div>
                  </div>
                  <h1 className="text-3xl font-black uppercase italic tracking-tighter">Research Hub</h1>
               </div>
               <p className="text-zinc-500 text-sm font-medium max-w-md leading-relaxed">Your centralized intelligence repository. All your inter-linked videos, channels, and ideas from the Vyp ecosystem.</p>
            </div>
            
            <div className="flex items-center gap-4">
               <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search your notes..."
                    className="bg-zinc-900 border border-zinc-800 rounded-2xl py-3 pl-12 pr-6 text-sm focus:outline-none focus:ring-1 focus:ring-white/20 transition-all w-64 md:w-80"
                  />
               </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
            {[
              { id: 'all', label: 'All Items' },
              { id: 'video', label: 'Saved Videos' },
              { id: 'channel', label: 'Channels' },
              { id: 'idea', label: 'Viral Ideas' },
              { id: 'analysis', label: 'Analyses' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-6 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                  filter === f.id ? 'bg-white text-black border-white' : 'bg-zinc-900 text-zinc-500 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </header>

        {/* Grid */}
        {loading ? (
          <div className="py-32 flex flex-col items-center justify-center gap-4">
             <div className="w-8 h-8 border-2 border-zinc-800 border-t-white rounded-full animate-spin"></div>
             <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Accessing Hub...</p>
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group bg-zinc-950 border border-zinc-900 rounded-[2rem] overflow-hidden flex flex-col hover:border-zinc-700 transition-all shadow-2xl"
              >
                <div className="p-8 flex-1 flex flex-col">
                  {/* Item Header */}
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                       <div className="p-2 bg-zinc-900 border border-zinc-800 rounded-xl group-hover:bg-zinc-800 transition-colors">
                          {getIcon(item.type)}
                       </div>
                       <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{item.type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="p-2 opacity-0 group-hover:opacity-100 hover:bg-red-500/10 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4 text-zinc-600 hover:text-red-500" />
                      </button>
                    </div>
                  </div>

                  {/* Title & Content */}
                  <h3 className="text-xl font-bold text-white mb-4 line-clamp-2 tracking-tight group-hover:text-white/90 transition-colors">{item.title}</h3>
                  
                  {item.content && (
                    <div className="bg-zinc-900/50 border border-zinc-900 rounded-2xl p-4 mb-6 flex-1">
                       <p className="text-xs text-zinc-400 line-clamp-4 leading-relaxed whitespace-pre-wrap">{item.content}</p>
                    </div>
                  )}

                  {!item.content && (
                    <div className="flex-1 flex items-center justify-center p-8 border border-dashed border-zinc-900 rounded-2xl mb-6">
                       <p className="text-[10px] text-zinc-700 font-bold uppercase tracking-widest">No Research Notes</p>
                    </div>
                  )}

                  {/* Footer Stats */}
                  <div className="mt-auto pt-6 border-t border-zinc-900 flex items-center justify-between">
                     <div className="flex items-center gap-2 text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(item.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                     </div>
                     {item.reference_id && (
                       <Link 
                        href={item.type === 'video' ? `/channels?channelId=${item.metadata.channelId}` : `/channels?channelId=${item.reference_id}`}
                        className="text-[10px] font-bold text-zinc-500 hover:text-white flex items-center gap-1.5 transition-colors uppercase tracking-widest"
                       >
                         View Source <ExternalLink className="w-3 h-3" />
                       </Link>
                     )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-48 flex flex-col items-center text-center">
             <div className="w-20 h-20 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center mb-8">
                <BookOpen className="w-8 h-8 text-zinc-700" />
             </div>
             <h2 className="text-xl font-bold uppercase italic tracking-tighter mb-4">No Research Found</h2>
             <p className="text-zinc-500 text-sm max-w-xs mx-auto leading-relaxed font-medium">Start exploring Trend Radar or search for videos to build your inter-linked intelligence repository.</p>
          </div>
        )}
      </div>
    </div>
  );
}
