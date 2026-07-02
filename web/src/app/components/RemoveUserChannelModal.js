"use client";

import { useState } from "react";

export default function RemoveUserChannelModal({ onClose, onChannelRemoved, channelTitle }) {
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleVerifyAndRemove = async (e) => {
    e.preventDefault();
    const normalizedInput = confirmText.trim().toLowerCase();
    const normalizedTitle = (channelTitle || "").trim().toLowerCase();

    if (normalizedInput !== normalizedTitle) {
      setError("The text you entered does not match the channel name.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/youtube/channel/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          action: "verify-remove",
          channelName: confirmText.trim()
        })
      });
      const data = await res.json();
      if (data.success) {
        onChannelRemoved();
      } else {
        throw new Error(data.error || "Failed to disconnect channel.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isMatched = confirmText.trim().toLowerCase() === (channelTitle || "").trim().toLowerCase();

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center md:p-4 backdrop-blur-2xl bg-black/80 animate-in fade-in duration-500">
      <div className="bg-[#050505] border-0 md:border border-white/10 w-full h-full md:h-auto md:max-w-md rounded-none md:rounded-[3rem] overflow-y-auto shadow-[0_0_100px_rgba(239,68,68,0.15)] flex flex-col justify-center animate-in zoom-in-95 duration-500">
        <div className="p-8 md:p-10">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-black text-white text-center mb-2 uppercase tracking-tighter">Disconnect Channel</h2>
          
          <div className="bg-red-500/5 border border-red-500/10 p-4 rounded-2xl mb-6 text-center">
            <p className="text-red-400 text-xs font-medium leading-relaxed">
              Disconnecting your channel will remove all cached metrics and associated dashboard reports. This action cannot be undone.
            </p>
          </div>

          <div className="mb-6">
            <p className="text-[10px] text-[#666] font-black uppercase tracking-widest text-center mb-2">Channel to remove</p>
            <p className="text-white font-black text-lg text-center bg-white/5 py-3 px-4 rounded-2xl border border-white/5 select-all">
              {channelTitle || "Unknown Channel"}
            </p>
          </div>

          {error && <p className="text-red-500 text-xs font-bold text-center mb-6 bg-red-500/10 py-2.5 px-4 rounded-xl border border-red-500/20">{error}</p>}

          <form onSubmit={handleVerifyAndRemove} className="space-y-4">
            <div>
              <label className="block text-[9px] text-[#888] font-black uppercase tracking-[0.2em] mb-2 text-center">
                Type the channel name above to confirm
              </label>
              <input 
                type="text" 
                placeholder="Enter channel name" 
                value={confirmText} 
                onChange={(e) => setConfirmText(e.target.value)} 
                className="w-full py-4 px-6 bg-[#000] border border-white/10 rounded-2xl outline-none text-white text-center text-sm font-bold focus:border-red-500 transition-all placeholder:text-[#333]"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading || !isMatched}
              className="w-full py-4 bg-red-500 text-white font-black hover:bg-red-600 disabled:opacity-30 disabled:pointer-events-none active:scale-[0.98] transition-all rounded-2xl text-xs uppercase tracking-wider cursor-pointer"
            >
              {loading ? "Disconnecting..." : "Verify & Disconnect"}
            </button>
            <button 
              type="button" 
              onClick={onClose}
              disabled={loading}
              className="w-full py-4 bg-white/5 text-white font-bold hover:bg-white/10 transition-all rounded-2xl text-xs uppercase tracking-wider border border-white/5 cursor-pointer"
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
