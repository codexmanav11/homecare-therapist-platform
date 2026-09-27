import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Star, TrendingDown, TrendingUp, Calendar, Plus, Download, FileText, UserPlus, CheckCircle, Clock } from 'lucide-react';

export default function HomeCareDashboardView({
  therapist,
  analytics,
  clients,
  bookings,
  notes,
  payments,
  onOpenBookingModal,
  onOpenAddClient,
  onDownloadInvoice,
  onOpenUpgrade
}) {
  const [selectedDay, setSelectedDay] = useState(21);
  const [timeFilter, setTimeFilter] = useState('1y');

  // Days list for schedule picker
  const days = [
    { day: 'Mon', date: 20 },
    { day: 'Tue', date: 21 },
    { day: 'Wed', date: 22 },
    { day: 'Thu', date: 23 },
    { day: 'Fri', date: 24 },
  ];

  // Patients/Appointments list for the schedule widget
  const schedulePatients = [
    {
      id: 1,
      name: 'Nuraiz Donin',
      type: 'Patient',
      time: '21 May 2024, 12:30 PM',
      status: 'Confirmed',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 2,
      name: 'Hanna Kenter',
      type: 'Patient',
      time: '21 May 2024, 1:00 PM',
      status: 'Confirmed',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 3,
      name: 'Phillip Donin',
      type: 'Patient',
      time: '21 May 2024, 2:30 AM',
      status: 'Canceled',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <div className="space-y-6">
      {/* TOP ROW: 3 METRIC CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* CARD 1: EARNED FUNDS */}
        <div className="bg-[#64a1ff] text-white rounded-[2rem] p-6 shadow-sm border border-blue-300/40 relative overflow-hidden flex flex-col justify-between min-h-[160px]">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold opacity-90">Earned funds</span>
            <span className="text-[11px] font-bold bg-white/20 px-3 py-1 rounded-full backdrop-blur-md">
              + $500 This day
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div>
              <div className="text-3xl font-extrabold tracking-tight">$ 4,3k</div>
              <p className="text-[11px] font-medium opacity-80 mt-0.5">Last month</p>
            </div>
            <div>
              <div className="text-3xl font-extrabold tracking-tight">$ 2,1k</div>
              <p className="text-[11px] font-medium opacity-80 mt-0.5">This month</p>
            </div>
          </div>
        </div>

        {/* CARD 2: RATINGS */}
        <div className="hc-card p-6 flex flex-col justify-between min-h-[160px]">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-800">Ratings</span>
            <button className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-0.5">
              All reviews <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="flex items-baseline gap-2">
              <Star className="w-6 h-6 text-amber-400 fill-amber-400 self-center" />
              <div>
                <div className="text-3xl font-extrabold text-slate-900 tracking-tight">4,5</div>
                <p className="text-[11px] font-medium text-slate-400 mt-0.5">Total rate</p>
              </div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-slate-900 tracking-tight">100</div>
              <p className="text-[11px] font-medium text-slate-400 mt-0.5">Reviews</p>
            </div>
          </div>
        </div>

        {/* CARD 3: VISITS */}
        <div className="bg-[#1047b8] text-white rounded-[2rem] p-6 shadow-sm border border-blue-900 flex flex-col justify-between min-h-[160px]">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold opacity-90">Visits</span>
            <button className="text-xs font-semibold opacity-90 hover:underline flex items-center gap-0.5">
              Show history <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div>
              <div className="text-3xl font-extrabold tracking-tight flex items-center gap-1">
                135 <TrendingDown className="w-5 h-5 text-blue-300 stroke-[2.5]" />
              </div>
              <p className="text-[11px] font-medium opacity-80 mt-0.5">Last month</p>
            </div>
            <div>
              <div className="text-3xl font-extrabold tracking-tight flex items-center gap-1">
                154 <TrendingUp className="w-5 h-5 text-blue-300 stroke-[2.5]" />
              </div>
              <p className="text-[11px] font-medium opacity-80 mt-0.5">This month</p>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM ROW: MY SCHEDULE & ANALYTICS IN GRAPHS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT: MY SCHEDULE WIDGET (4 cols) */}
        <div className="lg:col-span-5 hc-card p-6 flex flex-col justify-between">
          <div>
            {/* Header & Month Selector */}
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-extrabold text-slate-900">My Schedule</h3>
              <div className="flex items-center gap-1 bg-slate-100/80 px-3 py-1 rounded-full text-xs font-bold text-slate-700 cursor-pointer">
                <span>May</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </div>
            </div>

            {/* Day Selector Pill Row */}
            <div className="grid grid-cols-5 gap-2 mb-6">
              {days.map((item) => {
                const isSelected = selectedDay === item.date;
                return (
                  <button
                    key={item.date}
                    onClick={() => setSelectedDay(item.date)}
                    className={`py-2 px-1 rounded-2xl flex flex-col items-center justify-center transition-all ${
                      isSelected
                        ? 'border-2 border-[#1047b8] bg-white shadow-sm'
                        : 'bg-slate-50/80 hover:bg-slate-100 text-slate-600'
                    }`}
                  >
                    <span className="text-[11px] font-semibold text-slate-500 mb-1">{item.day}</span>
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        isSelected ? 'bg-[#1047b8] text-white' : 'text-slate-800'
                      }`}
                    >
                      {item.date}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Appointments List */}
            <div className="space-y-3.5">
              {schedulePatients.map((patient) => (
                <div
                  key={patient.id}
                  className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 flex items-center justify-between transition-all hover:bg-slate-100/70"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={patient.avatar}
                      alt={patient.name}
                      className="w-11 h-11 rounded-xl object-cover shadow-xs border border-slate-200"
                    />
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-900">{patient.name}</h4>
                      <p className="text-[10px] text-slate-400 font-semibold">{patient.type}</p>
                      <p className="text-[11px] font-semibold text-slate-500 mt-0.5">{patient.time}</p>
                    </div>
                  </div>

                  <div>
                    {patient.status === 'Confirmed' ? (
                      <span className="px-3.5 py-1.5 rounded-xl text-[11px] font-bold bg-[#64a1ff] text-white shadow-xs">
                        Confirmed
                      </span>
                    ) : (
                      <span className="px-3.5 py-1.5 rounded-xl text-[11px] font-bold bg-slate-200/80 text-slate-500">
                        Canceled
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions Footer inside Schedule */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex gap-2">
            <button
              onClick={onOpenBookingModal}
              className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-[#1047b8] text-white hover:bg-[#0e3b9e] transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" /> Book Slot
            </button>
            <button
              onClick={onOpenAddClient}
              className="py-2.5 px-3 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" /> Add Patient
            </button>
          </div>
        </div>

        {/* RIGHT: ANALYTICS IN GRAPHS WIDGET (7 cols) */}
        <div className="lg:col-span-7 hc-card p-6 flex flex-col justify-between">
          <div>
            {/* Header & Filter Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <h3 className="text-base font-extrabold text-slate-900">Analytics in graphs</h3>

              <div className="flex items-center gap-2">
                {/* Time range pills */}
                <div className="bg-slate-100/90 p-1 rounded-full flex items-center gap-1">
                  {['1 y', '6 m', '1 m'].map((range) => {
                    const key = range.replace(' ', '');
                    const isSelected = timeFilter === key;
                    return (
                      <button
                        key={key}
                        onClick={() => setTimeFilter(key)}
                        className={`px-3.5 py-1 rounded-full text-xs font-bold transition-all ${
                          isSelected ? 'bg-[#1047b8] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {range}
                      </button>
                    );
                  })}
                </div>

                {/* All Visits dropdown */}
                <div className="flex items-center gap-1 bg-slate-100/90 px-3 py-1.5 rounded-full text-xs font-bold text-slate-700 cursor-pointer">
                  <span>All Visits</span>
                  <div className="w-5 h-5 rounded-full bg-[#1047b8] text-white flex items-center justify-center ml-1">
                    <ChevronDown className="w-3 h-3" />
                  </div>
                </div>
              </div>
            </div>

            {/* SVG Smooth Curved Area Chart */}
            <div className="relative w-full h-64 pt-6 pb-2">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 700 200" preserveAspectRatio="none">
                <defs>
                  {/* Subtle Gradient Shading underneath the smooth wave curve */}
                  <linearGradient id="graphGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#64a1ff" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#64a1ff" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal Dotted Gridlines */}
                <line x1="0" y1="30" x2="700" y2="30" stroke="#e2e8f0" strokeDasharray="4 4" strokeWidth="1.5" />
                <line x1="0" y1="80" x2="700" y2="80" stroke="#e2e8f0" strokeDasharray="4 4" strokeWidth="1.5" />
                <line x1="0" y1="130" x2="700" y2="130" stroke="#e2e8f0" strokeDasharray="4 4" strokeWidth="1.5" />
                <line x1="0" y1="180" x2="700" y2="180" stroke="#e2e8f0" strokeDasharray="4 4" strokeWidth="1.5" />

                {/* Smooth Area Wave Path */}
                <path
                  d="M 0 120 Q 100 60 170 100 T 310 100 T 440 20 T 570 90 T 700 120 L 700 180 L 0 180 Z"
                  fill="url(#graphGradient)"
                />

                {/* Smooth Wave Line */}
                <path
                  d="M 0 120 Q 100 60 170 100 T 310 100 T 440 20 T 570 90 T 700 120"
                  fill="none"
                  stroke="#1047b8"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* Vertical Dotted Reference Line at Peak (May) */}
                <line x1="440" y1="20" x2="440" y2="180" stroke="#1047b8" strokeDasharray="4 4" strokeWidth="2" />

                {/* Dotted Point Circle at Peak */}
                <circle cx="440" cy="20" r="5" fill="#1047b8" />
              </svg>

              {/* Peak Value Badge Tooltip ("138 Aver. visits") */}
              <div className="absolute top-0 left-[60%] -translate-x-1/2 bg-white text-slate-800 text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-md border border-slate-200 flex items-center gap-1">
                <span className="text-[#1047b8]">138</span>
                <span className="text-slate-400 font-medium">Aver. visits</span>
              </div>
            </div>

            {/* X-Axis Month Labels */}
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400 px-2 mt-2 border-t border-slate-200/80 pt-3">
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span className="text-slate-900 font-extrabold underline underline-offset-4 decoration-[#1047b8] decoration-2">
                May
              </span>
              <span>Jun</span>
              <span>Jul</span>
              <span>Aug</span>
            </div>
          </div>

          {/* Integration Stats Footer inside Analytics */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
            <span className="flex items-center gap-1 font-medium">
              <CheckCircle className="w-4 h-4 text-emerald-500" /> Spring Boot API Synced
            </span>
            <button
              onClick={() => onDownloadInvoice(payments[0]?.id || 1)}
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Download Tax Receipts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
