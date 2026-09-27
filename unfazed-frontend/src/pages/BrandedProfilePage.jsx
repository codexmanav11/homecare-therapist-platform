import React, { useState, useEffect } from 'react';
import { Calendar, ShieldCheck, Award, Globe, MessageSquare, Check, Sparkles, FileText, Send, Star, ExternalLink } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';
import BookingModal from '../components/BookingModal';

export default function BrandedProfilePage({ therapist, onOpenUpgrade }) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'shared-notes', 'client-chat'
  
  // Client Portal State
  const [sharedNotes, setSharedNotes] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    fetchSharedNotes();
    fetchChatMessages();
  }, []);

  const fetchSharedNotes = async () => {
    try {
      const res = await axiosInstance.get('/public/notes/shared/1');
      setSharedNotes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchChatMessages = async () => {
    try {
      const res = await axiosInstance.get('/chat/messages?therapistId=1&clientId=1');
      setChatMessages(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const res = await axiosInstance.post('/chat/send', {
        therapistId: 1,
        clientId: 1,
        senderType: 'CLIENT',
        content: newMessage,
      });
      setChatMessages((prev) => [...prev, res.data]);
      setNewMessage('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Branded Therapist Banner & Profile Header */}
      <div className="glass-panel rounded-3xl p-8 border border-slate-800 relative overflow-hidden">
        {/* Background Glow Accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Avatar */}
          <div className="relative">
            <img
              src={therapist?.avatarUrl || 'https://images.unsplash.com/photo-1594824813566-88855ce78906?w=400'}
              alt={therapist?.name}
              className="w-36 h-36 rounded-3xl object-cover border-2 border-blue-500/40 shadow-2xl shadow-blue-500/20"
            />
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-slate-950 p-1.5 rounded-full shadow-lg" title="Verified RCI Licensed Practitioner">
              <ShieldCheck className="w-5 h-5 font-bold" />
            </div>
          </div>

          {/* Profile Bio Details */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Licensed Clinical Practice
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <Star className="w-3 h-3 fill-emerald-400" /> 4.9/5 (120+ Sessions)
              </span>
            </div>

            <h1 className="text-3xl font-extrabold text-white tracking-tight">{therapist?.name || 'Dr. Aditi Sharma'}</h1>
            <p className="text-sm font-semibold text-purple-400 mt-0.5">{therapist?.title || 'M.Phil Clinical Psychology (NIMHANS)'}</p>

            <p className="text-xs text-slate-300 mt-3 leading-relaxed max-w-2xl">
              {therapist?.bio}
            </p>

            {/* Specializations & Languages */}
            <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-2">
              {therapist?.specializations?.map((spec) => (
                <span key={spec} className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-900 text-slate-300 border border-slate-800">
                  {spec}
                </span>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-center md:justify-start gap-6 text-xs text-slate-400">
              <span className="flex items-center gap-1.5"><Award className="w-4 h-4 text-amber-400" /> {therapist?.experienceYears || 8}+ Years Exp.</span>
              <span className="flex items-center gap-1.5"><Globe className="w-4 h-4 text-blue-400" /> {therapist?.languages?.join(', ') || 'English, Hindi'}</span>
              <span className="flex items-center gap-1.5 text-white font-bold"><Calendar className="w-4 h-4 text-emerald-400" /> ₹{therapist?.consultationFee || 1800} / Session</span>
            </div>
          </div>

          {/* Booking CTA Button */}
          <div className="flex flex-col items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => setIsBookingOpen(true)}
              className="w-full md:w-auto px-8 py-3.5 rounded-2xl text-xs font-extrabold gradient-btn text-white shadow-xl flex items-center justify-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4" /> Book Consultation Now
            </button>
            <span className="text-[10px] text-slate-400">Instant Confirmation • GST Invoice</span>
          </div>
        </div>
      </div>

      {/* Client Portal Tab Navigation */}
      <div className="glass-panel rounded-2xl p-2 flex items-center gap-2 border border-slate-800 max-w-md mx-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'overview' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          Practice Overview
        </button>
        <button
          onClick={() => setActiveTab('shared-notes')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'shared-notes' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          Client Portal (Shared Notes)
        </button>
        <button
          onClick={() => setActiveTab('client-chat')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'client-chat' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          Live Chat
        </button>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card rounded-2xl p-6 border border-slate-800">
            <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> RCI Licensed & Encrypted
            </h3>
            <p className="text-xs text-slate-400">
              Practicing under official Tele-mental health code of ethics. End-to-end client confidentiality guaranteed.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-slate-800">
            <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-400" /> Instant Calendar Sync
            </h3>
            <p className="text-xs text-slate-400">
              Select open slots in your local timezone with immediate booking confirmation and automated meeting links.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-slate-800">
            <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-400" /> Automated GST Invoicing
            </h3>
            <p className="text-xs text-slate-400">
              Receive tax-compliant PDF receipts after every session for insurance claims and reimbursements.
            </p>
          </div>
        </div>
      )}

      {/* Tab 2: Shared Notes Viewer (Strict API segregation test) */}
      {activeTab === 'shared-notes' && (
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-400" /> Shared Clinical Takeaways & Resources
              </h3>
              <p className="text-xs text-slate-400">Only notes explicitly marked as 'SHARED' by {therapist?.name} appear here.</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Private Notes Filtered
            </span>
          </div>

          <div className="space-y-3">
            {sharedNotes.map((note) => (
              <div key={note.id} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-purple-300">Session Note #{note.id}</span>
                  <span className="text-slate-500">{note.createdAt}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{note.bodyText}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Client Portal Live Chat */}
      {activeTab === 'client-chat' && (
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col h-96">
          <div className="border-b border-slate-800 pb-3 mb-4 flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-400" /> Direct Messaging with {therapist?.name}
            </h3>
            <span className="text-xs text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Online
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-4">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col max-w-[80%] ${
                  msg.senderType === 'CLIENT' ? 'ml-auto items-end' : 'mr-auto items-start'
                }`}
              >
                <div
                  className={`p-3 rounded-2xl text-xs ${
                    msg.senderType === 'CLIENT'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'
                  }`}
                >
                  {msg.content}
                </div>
                <span className="text-[10px] text-slate-500 mt-1">{msg.sentAt}</span>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="flex items-center gap-2 border-t border-slate-800 pt-3">
            <input
              type="text"
              placeholder="Type your message to Dr. Aditi..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="p-2.5 rounded-xl gradient-btn text-white"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        therapist={therapist}
      />
    </div>
  );
}
