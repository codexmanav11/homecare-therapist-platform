import React from 'react';
import { LayoutGrid, Calendar, BarChart2, Clock, Search, Bell, ExternalLink, ShieldCheck } from 'lucide-react';

export default function HomeCareNavbar({ activeTab, setActiveTab, therapist, onOpenPublicPage, onOpenUpgrade }) {
  return (
    <header className="flex flex-col md:flex-row items-center justify-between gap-4 py-4 px-2 mb-6">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <span className="text-2xl font-extrabold tracking-tight text-[#1646bb]">HomeCare</span>
        </div>
        <button
          onClick={onOpenPublicPage}
          className="ml-2 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 flex items-center gap-1 transition-all"
        >
          <ExternalLink className="w-3 h-3" /> Public Page (/dr-sharma)
        </button>
      </div>

      {/* Center Navigation Pill Container */}
      <div className="hc-pill-nav flex items-center gap-1">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'dashboard'
              ? 'bg-[#1047b8] text-white shadow-md shadow-blue-600/20'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5" /> Dashboard
        </button>

        <button
          onClick={() => setActiveTab('schedule')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'schedule'
              ? 'bg-[#1047b8] text-white shadow-md shadow-blue-600/20'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" /> Schedule
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'analytics'
              ? 'bg-[#1047b8] text-white shadow-md shadow-blue-600/20'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <BarChart2 className="w-3.5 h-3.5" /> Analytics
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'history'
              ? 'bg-[#1047b8] text-white shadow-md shadow-blue-600/20'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Clock className="w-3.5 h-3.5" /> History
        </button>
      </div>

      {/* Right User Greetings & Action Icons */}
      <div className="flex items-center gap-4">
        {/* User Info */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <h4 className="text-xs font-extrabold text-slate-800">
              Hello, {therapist?.name?.split(' ')[1] || 'Marilyn'}!
            </h4>
            <p className="text-[10px] text-slate-400 font-semibold">
              {therapist?.title ? 'NIMHANS Practice' : 'Saint Joseph Hospital'}
            </p>
          </div>
          <div className="relative cursor-pointer" onClick={onOpenUpgrade} title="Click to view subscription tier">
            <img
              src={therapist?.avatarUrl || 'https://images.unsplash.com/photo-1594824813566-88855ce78906?w=100&auto=format&fit=crop&q=80'}
              alt="Practitioner"
              className="w-10 h-10 rounded-full object-cover border-2 border-blue-200 shadow-sm"
            />
            <div className="absolute -bottom-0.5 -right-0.5 bg-emerald-500 text-white rounded-full p-0.5">
              <ShieldCheck className="w-2.5 h-2.5" />
            </div>
          </div>
        </div>

        {/* Action Icon Buttons */}
        <div className="flex items-center gap-2">
          <button className="w-9 h-9 rounded-full bg-white border border-slate-200/80 flex items-center justify-center text-slate-600 hover:bg-slate-50 shadow-sm transition-all">
            <Search className="w-4 h-4" />
          </button>

          <button className="w-9 h-9 rounded-full bg-white border border-slate-200/80 flex items-center justify-center text-slate-600 hover:bg-slate-50 shadow-sm transition-all relative">
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full"></span>
          </button>
        </div>
      </div>
    </header>
  );
}
