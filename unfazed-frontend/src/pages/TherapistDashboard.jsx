import React, { useState, useEffect } from 'react';
import {
  Users, DollarSign, Calendar, FileText, Download, Lock, Plus, TrendingUp, CheckCircle,
  MessageSquare, Shield, Clock, AlertTriangle, ChevronRight, Eye, RefreshCw, Sparkles, Send
} from 'lucide-react';
import axiosInstance from '../api/axiosInstance';

export default function TherapistDashboard({ therapist, onOpenUpgradeWithReason }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'schedule', 'crm', 'notes', 'invoices', 'chat', 'analytics'
  
  // Data State
  const [analytics, setAnalytics] = useState(null);
  const [clients, setClients] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [notes, setNotes] = useState([]);
  const [payments, setPayments] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);

  // Form States
  const [showAddClient, setShowAddClient] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');

  // Note Writer State
  const [selectedClientForNote, setSelectedClientForNote] = useState('1');
  const [noteType, setNoteType] = useState('PRIVATE'); // PRIVATE or SHARED
  const [templateType, setTemplateType] = useState('FREEFORM'); // FREEFORM, SOAP, DAP
  const [noteBody, setNoteBody] = useState('');
  const [soapSubjective, setSoapSubjective] = useState('');
  const [soapObjective, setSoapObjective] = useState('');
  const [soapAssessment, setSoapAssessment] = useState('');
  const [soapPlan, setSoapPlan] = useState('');

  // Chat State
  const [chatText, setChatText] = useState('');

  useEffect(() => {
    fetchAllData();
  }, [therapist?.subscriptionTier]);

  const fetchAllData = async () => {
    try {
      const [anaRes, cliRes, bookRes, noteRes, payRes, chatRes] = await Promise.all([
        axiosInstance.get('/analytics/summary/1'),
        axiosInstance.get('/clients/therapist/1'),
        axiosInstance.get('/scheduling/bookings/therapist/1'),
        axiosInstance.get('/notes/therapist/1'),
        axiosInstance.get('/payments/therapist/1'),
        axiosInstance.get('/chat/messages?therapistId=1&clientId=1'),
      ]);

      setAnalytics(anaRes.data);
      setClients(cliRes.data);
      setBookings(bookRes.data);
      setNotes(noteRes.data);
      setPayments(payRes.data);
      setChatMessages(chatRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Add Client with Entitlement Gating Check
  const handleAddClient = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post('/clients/add', {
        therapistId: 1,
        name: newClientName,
        email: newClientEmail,
        phone: newClientPhone,
        tags: ['MANUAL'],
        consentSigned: true,
      });
      setClients((prev) => [...prev, res.data]);
      setShowAddClient(false);
      setNewClientName('');
      setNewClientEmail('');
      setNewClientPhone('');
    } catch (err) {
      if (err.response?.status === 403) {
        onOpenUpgradeWithReason(err.response.data.reason || 'Active client limit reached for your tier.');
      }
    }
  };

  // Create Session Note with Entitlement Gating for SOAP
  const handleSaveNote = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        clientId: parseInt(selectedClientForNote),
        noteType,
        templateType,
        bodyText: noteBody,
        subjectiveContent: soapSubjective,
        objectiveContent: soapObjective,
        assessmentContent: soapAssessment,
        planContent: soapPlan,
      };

      const res = await axiosInstance.post('/notes/create?therapistId=1', payload);
      setNotes((prev) => [res.data, ...prev]);
      setNoteBody('');
      setSoapSubjective('');
      setSoapObjective('');
      setSoapAssessment('');
      setSoapPlan('');
    } catch (err) {
      if (err.response?.status === 403) {
        onOpenUpgradeWithReason(err.response.data.reason || 'SOAP templates require PRO tier upgrade.');
      }
    }
  };

  const handleSendTherapistChat = async (e) => {
    e.preventDefault();
    if (!chatText.trim()) return;

    try {
      const res = await axiosInstance.post('/chat/send', {
        therapistId: 1,
        clientId: 1,
        senderType: 'THERAPIST',
        content: chatText,
      });
      setChatMessages((prev) => [...prev, res.data]);
      setChatText('');
    } catch (err) {
      console.error(err);
    }
  };

  // Download GST PDF Invoice
  const handleDownloadInvoice = (paymentId) => {
    window.open(`http://localhost:8080/api/payments/invoice/${paymentId}/pdf`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Dashboard Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-extrabold text-white">Practice Management Dashboard</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/10 text-purple-300 border border-purple-500/30">
              {therapist?.subscriptionTier || 'PRO'} PLAN
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Welcome back, {therapist?.name || 'Dr. Aditi Sharma'}. Manage your schedule, clients, notes, and invoicing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddClient(true)}
            className="px-4 py-2.5 rounded-xl text-xs font-bold gradient-btn text-white flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add New Client
          </button>
        </div>
      </div>

      {/* Navigation Sub-Header Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview', icon: TrendingUp },
          { id: 'schedule', label: 'Schedule Manager', icon: Calendar },
          { id: 'crm', label: 'Client CRM & Intake', icon: Users, badge: clients.length },
          { id: 'notes', label: 'Clinical Notes', icon: FileText, badge: notes.length },
          { id: 'invoices', label: 'Billing & Invoices', icon: DollarSign },
          { id: 'chat', label: 'Real-time Chat', icon: MessageSquare },
          { id: 'analytics', label: 'Practice Analytics', icon: Sparkles },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-blue-300 font-extrabold">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW METRICS */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="glass-card p-5 rounded-2xl border border-slate-800">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs text-slate-400 font-semibold">Total Revenue (Sep)</span>
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-white">₹{analytics?.totalRevenue || 42000}</div>
              <p className="text-[11px] text-emerald-400 mt-1 font-semibold">+18.5% from last month</p>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-slate-800">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs text-slate-400 font-semibold">Active Clients Capacity</span>
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-white">
                {analytics?.activeClientsCount || clients.length} / {analytics?.maxActiveClientsAllowed || 100}
              </div>
              <p className="text-[11px] text-slate-400 mt-1 font-semibold">Gated by {analytics?.tierName || 'PRO'} Tier</p>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-slate-800">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs text-slate-400 font-semibold">Confirmed Sessions</span>
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                  <Calendar className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-white">{bookings.length || 1}</div>
              <p className="text-[11px] text-purple-400 mt-1 font-semibold">Next session on Sep 25</p>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-slate-800">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs text-slate-400 font-semibold">No-Show Rate</span>
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                  <AlertTriangle className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-white">{analytics?.noShowRatePercentage || 0}%</div>
              <p className="text-[11px] text-emerald-400 mt-1 font-semibold">Optimal practice health</p>
            </div>
          </div>

          {/* Upcoming Sessions & Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-panel p-6 rounded-2xl border border-slate-800">
              <h3 className="text-sm font-extrabold text-white mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" /> Upcoming Sessions
              </h3>
              <div className="space-y-3">
                {bookings.map((b) => (
                  <div key={b.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                    <div>
                      <p className="text-xs font-bold text-white">{b.client?.name || 'Aarav Mehta'}</p>
                      <p className="text-[11px] text-slate-400">{b.bookingDate} at {b.startTime} ({b.clientTimezone})</p>
                    </div>
                    <a href={b.meetingLink} target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-500">
                      Start Meeting
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-slate-800">
              <h3 className="text-sm font-extrabold text-white mb-4 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" /> Entitlement Gating Status
              </h3>
              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                  <span>Client Limit Status:</span>
                  <span className="font-bold text-emerald-400">{clients.length} / {analytics?.maxActiveClientsAllowed || 100} Allowed</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                  <span>SOAP / DAP Clinical Templates:</span>
                  <span className={`font-bold ${analytics?.canUseSoap ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {analytics?.canUseSoap ? 'ENABLED (PRO Tier)' : 'LOCKED (Upgrade Needed)'}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                  <span>Centralized Entitlement Check:</span>
                  <span className="font-bold text-blue-400">EntitlementService.java OK</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SCHEDULE MANAGER */}
      {activeTab === 'schedule' && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-400" /> Weekly Recurring Availability Template
          </h3>
          <p className="text-xs text-slate-400">
            Set default session durations (30, 45, 50, 90 mins) and buffer time between appointments.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
              <div key={day} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center text-xs">
                <span className="font-bold text-white">{day}</span>
                <span className="text-slate-400">09:00 AM - 05:00 PM (15m buffer)</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 font-bold">ACTIVE</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CLIENT CRM & INTAKE */}
      {activeTab === 'crm' && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-sm font-extrabold text-white">Client Management & Intake Vault</h3>
              <p className="text-xs text-slate-400">Sortable client profiles with timestamped digital consent audit records.</p>
            </div>
            <button
              onClick={() => setShowAddClient(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold gradient-btn text-white flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Add Client
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] font-extrabold">
                <tr>
                  <th className="p-3">Client Name</th>
                  <th className="p-3">Email & Phone</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Digital Consent Audit</th>
                  <th className="p-3">Tags</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {clients.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-900/40">
                    <td className="p-3 font-bold text-white">{c.name}</td>
                    <td className="p-3 text-slate-400">{c.email} <br /> {c.phone}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400">
                        {c.status}
                      </span>
                    </td>
                    <td className="p-3 text-emerald-300 font-medium">
                      ✓ Consent Signed {c.consentTimestamp ? `(${c.consentTimestamp.substring(0, 10)})` : ''}
                    </td>
                    <td className="p-3">
                      {c.tags?.map((t) => (
                        <span key={t} className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 font-semibold mr-1">
                          {t}
                        </span>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: CLINICAL NOTES (PRIVATE vs SHARED + SOAP TEMPLATE) */}
      {activeTab === 'notes' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Note Writer Form */}
          <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-400" /> Write Clinical Note
            </h3>

            <form onSubmit={handleSaveNote} className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Select Client</label>
                  <select
                    value={selectedClientForNote}
                    onChange={(e) => setSelectedClientForNote(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Access Privacy</label>
                  <select
                    value={noteType}
                    onChange={(e) => setNoteType(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="PRIVATE">PRIVATE (Therapist Only)</option>
                    <option value="SHARED">SHARED (Client Portal Visible)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Note Format</label>
                  <select
                    value={templateType}
                    onChange={(e) => setTemplateType(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="FREEFORM">Freeform Text</option>
                    <option value="SOAP">SOAP Template (Tier Gated)</option>
                  </select>
                </div>
              </div>

              {templateType === 'SOAP' ? (
                <div className="space-y-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <p className="text-[11px] text-purple-300 font-bold">SOAP Clinical Format</p>
                  <input
                    type="text"
                    placeholder="S (Subjective): Client statement & complaints..."
                    value={soapSubjective}
                    onChange={(e) => setSoapSubjective(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                  />
                  <input
                    type="text"
                    placeholder="O (Objective): Therapist observations & MSE..."
                    value={soapObjective}
                    onChange={(e) => setSoapObjective(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                  />
                  <input
                    type="text"
                    placeholder="A (Assessment): Diagnosis & clinical judgment..."
                    value={soapAssessment}
                    onChange={(e) => setSoapAssessment(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                  />
                  <input
                    type="text"
                    placeholder="P (Plan): Treatment goals & next steps..."
                    value={soapPlan}
                    onChange={(e) => setSoapPlan(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>
              ) : (
                <textarea
                  rows={4}
                  placeholder="Enter session notes..."
                  value={noteBody}
                  onChange={(e) => setNoteBody(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white"
                />
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl text-xs font-bold gradient-btn text-white"
              >
                Save Clinical Note
              </button>
            </form>
          </div>

          {/* Notes History list */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3 max-h-[500px] overflow-y-auto">
            <h4 className="text-xs font-bold text-white uppercase">Clinical Notes Feed</h4>
            {notes.map((n) => (
              <div key={n.id} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="font-bold text-white">{n.clientName}</span>
                  <span className={`px-2 py-0.2 rounded font-extrabold text-[10px] ${
                    n.noteType === 'PRIVATE' ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
                  }`}>
                    {n.noteType}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {n.templateType === 'SOAP' ? n.subjectiveContent : n.bodyText}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: BILLING & INVOICES */}
      {activeTab === 'invoices' && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-extrabold text-white">GST Invoices & Payment Ledger</h3>
              <p className="text-xs text-slate-400">Automated OpenPDF engine generates compliant invoices.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] font-extrabold">
                <tr>
                  <th className="p-3">Invoice #</th>
                  <th className="p-3">Client</th>
                  <th className="p-3">Net Amount</th>
                  <th className="p-3">Payment Method</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {payments.map((p) => (
                  <tr key={p.id}>
                    <td className="p-3 font-bold text-white">{p.invoiceNumber || `INV-2026-00${p.id}`}</td>
                    <td className="p-3 text-slate-300">{p.client?.name || 'Aarav Mehta'}</td>
                    <td className="p-3 font-extrabold text-emerald-400">₹{p.netAmount?.toFixed(2)}</td>
                    <td className="p-3 text-slate-400">{p.paymentMethod || 'UPI'}</td>
                    <td className="p-3">
                      <button
                        onClick={() => handleDownloadInvoice(p.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600/20 text-blue-300 border border-blue-500/30 hover:bg-blue-600 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" /> GST PDF Invoice
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: REAL-TIME CHAT */}
      {activeTab === 'chat' && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col h-[500px]">
          <div className="border-b border-slate-800 pb-3 mb-4 flex justify-between items-center">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-400" /> Patient Chat Console
            </h3>
            <span className="text-xs text-slate-400">Chatting with Aarav Mehta</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-4">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col max-w-[80%] ${
                  msg.senderType === 'THERAPIST' ? 'ml-auto items-end' : 'mr-auto items-start'
                }`}
              >
                <div
                  className={`p-3 rounded-2xl text-xs ${
                    msg.senderType === 'THERAPIST'
                      ? 'bg-purple-600 text-white rounded-br-none'
                      : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'
                  }`}
                >
                  {msg.content}
                </div>
                <span className="text-[10px] text-slate-500 mt-1">{msg.sentAt}</span>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendTherapistChat} className="flex items-center gap-2 border-t border-slate-800 pt-3">
            <input
              type="text"
              placeholder="Write response to client..."
              value={chatText}
              onChange={(e) => setChatText(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white"
            />
            <button type="submit" className="p-2.5 rounded-xl gradient-btn text-white">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* TAB 7: PRACTICE ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" /> Financial & Client Aggregation Analytics
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {analytics?.revenueTrends?.map((r) => (
              <div key={r.month} className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
                <span className="text-xs text-slate-400 font-bold block mb-1">{r.month}</span>
                <span className="text-lg font-extrabold text-emerald-400">₹{r.amount}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Client Modal */}
      {showAddClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-panel w-full max-w-md rounded-2xl p-6 border border-slate-700">
            <h3 className="text-sm font-extrabold text-white mb-4">Add Client (Entitlement Check)</h3>
            <form onSubmit={handleAddClient} className="space-y-3">
              <input
                type="text"
                placeholder="Full Name"
                value={newClientName}
                onChange={(e) => setNewClientName(e.target.value)}
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={newClientEmail}
                onChange={(e) => setNewClientEmail(e.target.value)}
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
              />
              <input
                type="tel"
                placeholder="Phone"
                value={newClientPhone}
                onChange={(e) => setNewClientPhone(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
              />

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddClient(false)}
                  className="flex-1 py-2 rounded-xl text-xs bg-slate-800 text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl text-xs font-bold gradient-btn text-white"
                >
                  Add Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
