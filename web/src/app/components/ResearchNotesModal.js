'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, FileText, Video, User, Lightbulb, BarChart3, Loader2 } from 'lucide-react';

export default function ResearchNotesModal({ isOpen, onClose, item, onSave }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/library', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: item.type,
          reference_id: item.id || item.channelId,
          title: item.title,
          content: content,
          metadata: item.metadata || {}
        })
      });
      const data = await res.json();
      if (data.success) {
        if (onSave) onSave(data.id);
        onClose();
      }
    } catch (err) {
      console.error('Failed to save research note:', err);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = () => {
    switch (item.type) {
      case 'video': return <Video className="w-5 h-5 text-blue-500" />;
      case 'channel': return <User className="w-5 h-5 text-purple-500" />;
      case 'idea': return <Lightbulb className="w-5 h-5 text-yellow-500" />;
      case 'analysis': return <BarChart3 className="w-5 h-5 text-green-500" />;
      default: return <FileText className="w-5 h-5 text-zinc-500" />;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-zinc-800 rounded-xl">
                {getIcon()}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Save to Research Hub</h3>
                <p className="text-xs text-zinc-500 truncate max-w-[300px]">{item.title}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
              <X className="w-5 h-5 text-zinc-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">Research Notes</label>
              <textarea
                autoFocus
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your observations, hooks, or notes about this item..."
                className="w-full h-48 bg-black/40 border border-zinc-800 rounded-2xl p-4 text-sm text-zinc-300 focus:outline-none focus:ring-1 focus:ring-white/20 transition-all resize-none"
              />
            </div>

            <div className="bg-zinc-800/30 border border-zinc-800/50 rounded-2xl p-4">
               <p className="text-[10px] font-medium text-zinc-500 mb-2 uppercase tracking-tight">Inter-linked Preview</p>
               <div className="flex items-center gap-3">
                  {item.thumbnail && <img src={item.thumbnail} className="w-12 h-12 rounded-lg object-cover" alt="" />}
                  <div className="min-w-0">
                     <p className="text-xs font-bold text-zinc-200 truncate">{item.title}</p>
                     <p className="text-[10px] text-zinc-500 capitalize">{item.type} • Linked Reference</p>
                  </div>
               </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-zinc-800 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-zinc-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-6 py-2.5 bg-white text-black rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-zinc-200 transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save to Hub
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
