import React from 'react';
import { Sparkles, Shield, User, ExternalLink, Calendar, LogOut, CheckCircle2 } from 'lucide-react';

export default function Navbar({ currentView, setCurrentView, therapist, onOpenUpgrade }) {
  return (
    <nav className="glass-panel sticky top-0 z-40 px-6 py-3.5 border-b border-slate-800 flex items-center justify-between">
      {/* Brand Logo & Tagline */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl gradient-btn flex items-center justify-center shadow-lg shadow-blue-500/20">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-xl tracking-tight text-white">Unfazed</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <CheckCircle2 className="w-2.5 h-2.5" /> Spring Boot API
            </span>
          </div>
          <p className="text-xs text-slate-400">Private Practice Platform for Therapists</p>
        </div>
      </div>

      {/* View Switcher Controls */}
      <div className="flex items-center bg-slate-900/80 p-1 rounded-xl border border-slate-800">
        <button
          onClick={() => setCurrentView('dashboard')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
            currentView === 'dashboard'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <User className="w-3.5 h-3.5" /> Therapist Dashboard
        </button>

        <button
          onClick={() => setCurrentView('branded-link')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
            currentView === 'branded-link'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <ExternalLink className="w-3.5 h-3.5" /> Public Page (/dr-sharma)
        </button>
      </div>

      {/* Subscription Tier Badge & Account */}
      <div className="flex items-center gap-3">
        {therapist && (
          <button
            onClick={onOpenUpgrade}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 transition-all cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span>{therapist.subscriptionTier || 'PRO'} TIER</span>
            <span className="text-[10px] bg-amber-500/20 text-amber-200 px-1.5 py-0.2 rounded font-normal">Upgrade</span>
          </button>
        )}

        <div className="flex items-center gap-2 pl-3 border-l border-slate-800">
          <img
            src={therapist?.avatarUrl || 'https://images.unsplash.com/photo-1594824813566-88855ce78906?w=100&auto=format&fit=crop&q=80'}
            alt="Doctor Avatar"
            className="w-8 h-8 rounded-full border border-blue-500/40 object-cover"
          />
          <div className="text-left hidden sm:block">
            <p className="text-xs font-bold text-white">{therapist?.name || 'Dr. Aditi Sharma'}</p>
            <p className="text-[10px] text-slate-400">unfazed.in/dr-sharma</p>
          </div>
        </div>
      </div>
    </nav>
  );
}
