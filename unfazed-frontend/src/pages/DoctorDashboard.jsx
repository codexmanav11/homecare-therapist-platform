import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../api/axiosInstance';

// hardcoded reviews
const reviews = [
  { name: 'Meera Iyer', rating: 5, text: 'Dr. Sharma helped me through the toughest phase of my life. Very patient and empathetic.', date: '12 Sep 2026' },
  { name: 'Siddharth Joshi', rating: 5, text: 'Incredibly professional. The CBT techniques she taught me actually work in real situations.', date: '08 Sep 2026' },
  { name: 'Kavya Reddy', rating: 4, text: 'Felt heard for the first time in years. The breathing exercises changed my sleep quality.', date: '02 Sep 2026' },
  { name: 'Arjun Malhotra', rating: 5, text: 'I was sceptical about therapy but Dr. Aditi made me comfortable from the first session.', date: '28 Aug 2026' },
  { name: 'Neha Kapoor', rating: 4, text: 'Really helpful for my workplace burnout. I can manage my stress much better now.', date: '20 Aug 2026' },
  { name: 'Rahul Verma', rating: 5, text: 'My anxiety has reduced significantly. She gives practical homework that actually helps.', date: '15 Aug 2026' },
];

export default function DoctorDashboard({ therapist, onSwitchRole }) {
  const [authed, setAuthed] = useState(false);
  const [pwd, setPwd] = useState('');
  const [pwdErr, setPwdErr] = useState('');

  const [tab, setTab] = useState('overview');
  const [clients, setClients] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [notes, setNotes] = useState([]);
  const [payments, setPayments] = useState([]);
  const [chatMsgs, setChatMsgs] = useState([]);
  const [chatClient, setChatClient] = useState(null);
  const [chatText, setChatText] = useState('');

  const [schedDate, setSchedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [daySlots, setDaySlots] = useState([]);

  const [noteClient, setNoteClient] = useState('');
  const [noteType, setNoteType] = useState('PRIVATE');
  const [noteBody, setNoteBody] = useState('');

  const [showAdd, setShowAdd] = useState(false);
  const [addName, setAddName] = useState('');
  const [addEmail, setAddEmail] = useState('');
  const [addPhone, setAddPhone] = useState('');

  const loadAll = useCallback(async () => {
    try {
      const [c, b, n, p] = await Promise.all([
        axiosInstance.get('/clients/therapist/1'),
        axiosInstance.get('/scheduling/bookings/therapist/1'),
        axiosInstance.get('/notes/therapist/1'),
        axiosInstance.get('/payments/therapist/1'),
      ]);
      setClients(c.data);
      setBookings(b.data);
      setNotes(n.data);
      setPayments(p.data);
      if (c.data.length) {
        setNoteClient(String(c.data[0].id));
        if (!chatClient) setChatClient(c.data[0]);
      }
    } catch (e) { console.error(e); }
  }, [chatClient]);

  useEffect(() => { if (authed) loadAll(); }, [authed, loadAll]);
  useEffect(() => { if (authed) loadSlots(); }, [schedDate, authed]);

  // poll for new bookings every 8 seconds
  useEffect(() => {
    if (!authed) return;
    const interval = setInterval(() => {
      axiosInstance.get('/scheduling/bookings/therapist/1')
        .then(r => setBookings(r.data)).catch(() => {});
    }, 8000);
    return () => clearInterval(interval);
  }, [authed]);

  // load chat when client changes
  useEffect(() => {
    if (!chatClient) return;
    axiosInstance.get(`/chat/messages?therapistId=1&clientId=${chatClient.id}`)
      .then(r => setChatMsgs(r.data)).catch(() => {});
  }, [chatClient]);

  async function loadSlots() {
    try {
      const res = await axiosInstance.get(`/public/scheduling/slots?therapistId=1&date=${schedDate}`);
      setDaySlots(res.data);
    } catch (e) { console.error(e); }
  }

  function handleLogin(e) {
    e.preventDefault();
    if (pwd === '123456789') {
      setAuthed(true); setPwdErr('');
    } else {
      setPwdErr('Wrong password');
    }
  }

  async function addClient(e) {
    e.preventDefault();
    try {
      await axiosInstance.post('/clients/add', {
        therapistId: 1, name: addName, email: addEmail, phone: addPhone,
        tags: ['MANUAL'], consentSigned: true
      });
      loadAll();
      setShowAdd(false); setAddName(''); setAddEmail(''); setAddPhone('');
    } catch (e) { alert('Failed to add patient'); }
  }

  async function saveNote(e) {
    e.preventDefault();
    try {
      await axiosInstance.post('/notes/create?therapistId=1', {
        clientId: parseInt(noteClient), noteType, templateType: 'FREEFORM', bodyText: noteBody
      });
      setNoteBody('');
      loadAll();
    } catch (e) { alert('Failed'); }
  }

  async function sendChat(e) {
    e.preventDefault();
    if (!chatText.trim() || !chatClient) return;
    try {
      const r = await axiosInstance.post('/chat/send', {
        therapistId: 1, clientId: chatClient.id, senderType: 'THERAPIST', content: chatText
      });
      setChatMsgs(prev => [...prev, r.data]);
      setChatText('');
    } catch (e) { console.error(e); }
  }

  function downloadInvoice(id) {
    window.open(`http://localhost:8080/api/payments/invoice/${id}/pdf`, '_blank');
  }

  function getWeekDays() {
    const base = new Date(schedDate + 'T00:00:00');
    const dow = base.getDay();
    const mon = new Date(base);
    mon.setDate(base.getDate() - ((dow + 6) % 7));
    const days = [], names = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    for (let i = 0; i < 7; i++) {
      const d = new Date(mon);
      d.setDate(mon.getDate() + i);
      days.push({ label: names[i], date: d.getDate(), iso: d.toISOString().split('T')[0] });
    }
    return days;
  }

  // login screen
  if (!authed) {
    return (
      <div className="min-h-screen bg-[#f4f7fc] flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-8 max-w-sm w-full border border-slate-200 shadow-sm">
          <div className="text-center mb-6">
            <span className="text-xl font-extrabold text-[#1047b8]">HomeCare</span>
            <p className="text-xs text-slate-400 mt-1">Therapist Login</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Email</label>
              <input type="text" value="dr.sharma@unfazed.in" readOnly
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-500" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Password</label>
              <input type="password" value={pwd} onChange={e => setPwd(e.target.value)} placeholder="Enter password"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs" autoFocus />
            </div>
            {pwdErr && <p className="text-xs text-rose-500">{pwdErr}</p>}
            <button type="submit" className="w-full py-2.5 bg-[#1047b8] text-white text-xs font-bold rounded-xl">Login</button>
          </form>
          <button onClick={onSwitchRole} className="text-xs text-slate-400 hover:text-blue-500 underline mt-3 block mx-auto">
            ← Back to role selection
          </button>
        </div>
      </div>
    );
  }

  const booked = bookings.filter(b => b.bookingDate === schedDate);
  const upcoming = bookings.filter(b => b.status === 'CONFIRMED');
  const weekDays = getWeekDays();
  const totalRev = payments.reduce((s, p) => s + (p.netAmount || 0), 0);

  const tabs = [
    { id: 'overview', label: 'Dashboard' },
    { id: 'schedule', label: 'Schedule' },
    { id: 'patients', label: 'Patients' },
    { id: 'notes', label: 'Notes' },
    { id: 'billing', label: 'Billing' },
    { id: 'chat', label: 'Chat' },
    { id: 'reviews', label: 'Reviews' },
  ];

  return (
    <div className="min-h-screen bg-[#f4f7fc] px-4 md:px-8 py-5">
      <div className="max-w-7xl mx-auto">
        {/* header */}
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-xl font-extrabold text-[#1047b8]">HomeCare</span>
            <nav className="bg-white border border-slate-200 rounded-full p-1 flex gap-1 ml-4">
              {tabs.map(t => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                    tab === t.id ? 'bg-[#1047b8] text-white' : 'text-slate-500 hover:text-slate-800'
                  }`}>{t.label}</button>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => { setAuthed(false); onSwitchRole(); }} className="text-xs text-slate-400 hover:text-blue-500 underline">
              Logout
            </button>
            <div className="text-right">
              <p className="text-xs font-bold text-slate-800">Dr. {therapist?.name?.split(' ').pop() || 'Sharma'}</p>
              <p className="text-[10px] text-slate-400">{therapist?.title || ''}</p>
            </div>
            <img src={therapist?.avatarUrl || ''} alt=""
              className="w-9 h-9 rounded-full object-cover border-2 border-blue-200" />
          </div>
        </header>

        {/* ===== OVERVIEW ===== */}
        {tab === 'overview' && (
          <div className="space-y-6">
            {/* metric cards */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-[#64a1ff] text-white rounded-2xl p-5">
                <p className="text-xs opacity-80">Total Revenue</p>
                <p className="text-2xl font-extrabold mt-1">₹{totalRev.toLocaleString('en-IN')}</p>
                <p className="text-[10px] opacity-70 mt-1">{payments.length} invoices</p>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-slate-200">
                <p className="text-xs text-slate-500">Active Patients</p>
                <p className="text-2xl font-extrabold text-slate-900 mt-1">{clients.length}</p>
                <p className="text-[10px] text-slate-400 mt-1">across your practice</p>
              </div>
              <div className="bg-[#1047b8] text-white rounded-2xl p-5">
                <p className="text-xs opacity-80">Upcoming</p>
                <p className="text-2xl font-extrabold mt-1">{upcoming.length}</p>
                <p className="text-[10px] opacity-70 mt-1">confirmed sessions</p>
              </div>
              <div className="bg-emerald-500 text-white rounded-2xl p-5">
                <p className="text-xs opacity-80">Avg Rating</p>
                <p className="text-2xl font-extrabold mt-1">4.8 ★</p>
                <p className="text-[10px] opacity-70 mt-1">{reviews.length} reviews</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-5">
              {/* upcoming schedule */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200">
                <h3 className="font-bold text-slate-900 mb-3">Upcoming Schedule</h3>
                {upcoming.length === 0 && <p className="text-xs text-slate-400">No upcoming sessions</p>}
                {upcoming.slice(0, 5).map(b => (
                  <div key={b.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                    <div>
                      <p className="text-xs font-bold text-slate-800">{b.client?.name || 'Patient'}</p>
                      <p className="text-[11px] text-slate-400">{b.bookingDate} • {b.startTime}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-600">{b.status}</span>
                  </div>
                ))}
              </div>

              {/* recent notes */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200">
                <h3 className="font-bold text-slate-900 mb-3">Recent Notes</h3>
                {notes.slice(0, 4).map(n => (
                  <div key={n.id} className="py-2 border-b border-slate-50 last:border-0">
                    <div className="flex justify-between">
                      <p className="text-xs font-bold text-slate-800">{n.clientName}</p>
                      <span className={`text-[10px] font-bold px-1.5 rounded ${
                        n.noteType === 'PRIVATE' ? 'bg-rose-50 text-rose-500' : 'bg-emerald-50 text-emerald-600'
                      }`}>{n.noteType}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{n.bodyText || n.subjectiveContent}</p>
                  </div>
                ))}
              </div>

              {/* recent reviews */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200">
                <h3 className="font-bold text-slate-900 mb-3">Recent Reviews</h3>
                {reviews.slice(0, 3).map((r, i) => (
                  <div key={i} className="py-2 border-b border-slate-50 last:border-0">
                    <div className="flex justify-between">
                      <p className="text-xs font-bold text-slate-800">{r.name}</p>
                      <span className="text-[10px] text-amber-500">{'★'.repeat(r.rating)}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">{r.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===== SCHEDULE ===== */}
        {tab === 'schedule' && (
          <div className="grid grid-cols-12 gap-5">
            <div className="col-span-5 bg-white rounded-2xl p-5 border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900">My Schedule</h3>
                <input type="date" value={schedDate} onChange={e => setSchedDate(e.target.value)}
                  className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1" />
              </div>
              <div className="grid grid-cols-7 gap-1 mb-5">
                {weekDays.map(d => (
                  <button key={d.iso} onClick={() => setSchedDate(d.iso)}
                    className={`py-2 rounded-xl flex flex-col items-center text-xs transition ${
                      d.iso === schedDate ? 'border-2 border-[#1047b8] bg-white' : 'bg-slate-50 hover:bg-slate-100'
                    }`}>
                    <span className="text-[10px] text-slate-400">{d.label}</span>
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center mt-1 text-xs font-bold ${
                      d.iso === schedDate ? 'bg-[#1047b8] text-white' : 'text-slate-700'
                    }`}>{d.date}</span>
                  </button>
                ))}
              </div>
              <h4 className="text-xs font-bold text-slate-500 mb-2">Appointments on {schedDate}</h4>
              {booked.length === 0 && <p className="text-xs text-slate-400">No appointments</p>}
              {booked.map(b => (
                <div key={b.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 mb-2 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-800">{b.client?.name || 'Patient'}</p>
                    <p className="text-[11px] text-slate-400">{b.startTime} - {b.endTime}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    b.status === 'CONFIRMED' ? 'bg-[#64a1ff] text-white' : 'bg-emerald-100 text-emerald-700'
                  }`}>{b.status}</span>
                </div>
              ))}
            </div>
            <div className="col-span-7 bg-white rounded-2xl p-5 border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-4">Slot Availability — {schedDate}</h3>
              <div className="grid grid-cols-4 gap-2">
                {daySlots.map(s => (
                  <div key={s.startTime}
                    className={`p-3 rounded-xl text-center text-xs font-semibold border ${
                      s.available ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-slate-100 border-slate-200 text-slate-400 line-through'
                    }`}>
                    {s.startTime} - {s.endTime}
                    <p className="text-[10px] mt-0.5">{s.available ? 'Open' : 'Booked'}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===== PATIENTS ===== */}
        {tab === 'patients' && (
          <div className="bg-white rounded-2xl p-5 border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-900">Patient Records</h3>
              <button onClick={() => setShowAdd(true)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#1047b8] text-white">+ Add Patient</button>
            </div>
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold">
                <tr><th className="p-2">Name</th><th className="p-2">Contact</th><th className="p-2">Status</th><th className="p-2">Concern</th><th className="p-2">Consent</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {clients.map(c => (
                  <tr key={c.id}>
                    <td className="p-2 font-bold text-slate-900">{c.name}</td>
                    <td className="p-2 text-slate-500">{c.email}<br />{c.phone}</td>
                    <td className="p-2"><span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 text-[10px] font-bold">{c.status}</span></td>
                    <td className="p-2 text-slate-500 max-w-[200px] truncate">{c.presentingConcern}</td>
                    <td className="p-2 text-emerald-600 font-medium">{c.consentSigned ? '✓ Signed' : 'Pending'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ===== NOTES ===== */}
        {tab === 'notes' && (
          <div className="grid grid-cols-3 gap-5">
            <div className="col-span-2 bg-white rounded-2xl p-5 border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-3">Write Note</h3>
              <form onSubmit={saveNote} className="space-y-3">
                <div className="flex gap-3">
                  <select value={noteClient} onChange={e => setNoteClient(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs">
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <select value={noteType} onChange={e => setNoteType(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs">
                    <option value="PRIVATE">Private</option>
                    <option value="SHARED">Shared with patient</option>
                  </select>
                </div>
                <textarea rows={4} placeholder="Session notes..." value={noteBody} onChange={e => setNoteBody(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs" />
                <button type="submit" className="px-4 py-2 bg-[#1047b8] text-white text-xs font-bold rounded-lg">Save Note</button>
              </form>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-slate-200 max-h-[450px] overflow-y-auto">
              <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">All Notes</h4>
              {notes.map(n => (
                <div key={n.id} className="p-3 mb-2 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex justify-between text-[11px]">
                    <span className="font-bold text-slate-800">{n.clientName}</span>
                    <span className={`font-bold ${n.noteType === 'PRIVATE' ? 'text-rose-500' : 'text-emerald-600'}`}>{n.noteType}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">{n.bodyText || n.subjectiveContent}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== BILLING ===== */}
        {tab === 'billing' && (
          <div className="space-y-5">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl p-5 border border-slate-200 text-center">
                <p className="text-xs text-slate-500">Gross Revenue</p>
                <p className="text-xl font-extrabold text-slate-900 mt-1">₹{payments.reduce((s, p) => s + (p.grossAmount || 0), 0).toLocaleString('en-IN')}</p>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-slate-200 text-center">
                <p className="text-xs text-slate-500">GST Collected</p>
                <p className="text-xl font-extrabold text-amber-600 mt-1">₹{payments.reduce((s, p) => s + (p.gstAmount || 0), 0).toLocaleString('en-IN')}</p>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-slate-200 text-center">
                <p className="text-xs text-slate-500">Net Revenue</p>
                <p className="text-xl font-extrabold text-blue-600 mt-1">₹{totalRev.toLocaleString('en-IN')}</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-4">All Invoices</h3>
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold">
                  <tr><th className="p-2">Invoice</th><th className="p-2">Patient</th><th className="p-2">Gross</th><th className="p-2">GST</th><th className="p-2">Net</th><th className="p-2">Method</th><th className="p-2">Action</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payments.map(p => (
                    <tr key={p.id}>
                      <td className="p-2 font-bold text-slate-900">{p.invoiceNumber}</td>
                      <td className="p-2 text-slate-500">{p.client?.name || 'Patient'}</td>
                      <td className="p-2">₹{p.grossAmount?.toFixed(0)}</td>
                      <td className="p-2 text-amber-600">₹{p.gstAmount?.toFixed(0)}</td>
                      <td className="p-2 font-bold text-blue-600">₹{p.netAmount?.toFixed(0)}</td>
                      <td className="p-2 text-slate-500">{p.paymentMethod}</td>
                      <td className="p-2">
                        <button onClick={() => downloadInvoice(p.id)}
                          className="px-2 py-1 text-xs font-bold bg-blue-50 text-blue-600 rounded hover:bg-blue-100">PDF</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ===== CHAT ===== */}
        {tab === 'chat' && (
          <div className="grid grid-cols-4 gap-5 h-[500px]">
            <div className="bg-white rounded-2xl p-4 border border-slate-200 overflow-y-auto">
              <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Patients</h4>
              {clients.map(c => (
                <button key={c.id} onClick={() => setChatClient(c)}
                  className={`w-full text-left p-2.5 rounded-xl mb-1 text-xs transition ${
                    chatClient?.id === c.id ? 'bg-[#1047b8] text-white' : 'hover:bg-slate-50 text-slate-700'
                  }`}>
                  <p className="font-bold">{c.name}</p>
                  <p className={`text-[10px] ${chatClient?.id === c.id ? 'opacity-70' : 'text-slate-400'}`}>{c.email}</p>
                </button>
              ))}
            </div>
            <div className="col-span-3 bg-white rounded-2xl p-5 border border-slate-200 flex flex-col">
              <h3 className="font-bold text-slate-900 mb-3 border-b border-slate-100 pb-2">
                {chatClient?.name || 'Select a patient'}
              </h3>
              <div className="flex-1 overflow-y-auto space-y-2 mb-3">
                {chatMsgs.map(m => (
                  <div key={m.id} className={`flex ${m.senderType === 'THERAPIST' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] p-2.5 rounded-xl text-xs ${
                      m.senderType === 'THERAPIST'
                        ? 'bg-[#1047b8] text-white rounded-br-none'
                        : 'bg-slate-100 text-slate-800 rounded-bl-none'
                    }`}>{m.content}
                      <span className="block text-[10px] mt-1 opacity-60">{m.sentAt}</span>
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={sendChat} className="flex gap-2 border-t border-slate-100 pt-2">
                <input value={chatText} onChange={e => setChatText(e.target.value)} placeholder="Type message..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs" />
                <button type="submit" className="px-4 py-2 bg-[#1047b8] text-white text-xs font-bold rounded-lg">Send</button>
              </form>
            </div>
          </div>
        )}

        {/* ===== REVIEWS ===== */}
        {tab === 'reviews' && (
          <div className="space-y-5">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 flex items-center gap-8">
              <div className="text-center">
                <p className="text-3xl font-extrabold text-slate-900">4.8</p>
                <p className="text-amber-500 text-sm">★★★★★</p>
                <p className="text-[10px] text-slate-400 mt-1">{reviews.length} reviews</p>
              </div>
              <div className="flex-1 space-y-1">
                {[5, 4, 3, 2, 1].map(star => {
                  const count = reviews.filter(r => r.rating === star).length;
                  const pct = Math.round((count / reviews.length) * 100);
                  return (
                    <div key={star} className="flex items-center gap-2 text-xs">
                      <span className="w-4 text-right text-slate-500">{star}★</span>
                      <div className="flex-1 bg-slate-100 rounded-full h-2">
                        <div className="bg-amber-400 rounded-full h-2" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="w-6 text-slate-400">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {reviews.map((r, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                        {r.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">{r.name}</p>
                        <p className="text-[10px] text-slate-400">{r.date}</p>
                      </div>
                    </div>
                    <span className="text-xs text-amber-500">{'★'.repeat(r.rating)}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{r.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* add client modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-5">
            <h3 className="font-bold text-slate-900 mb-3">Add Patient</h3>
            <form onSubmit={addClient} className="space-y-2">
              <input placeholder="Name" value={addName} onChange={e => setAddName(e.target.value)} required
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs" />
              <input placeholder="Email" type="email" value={addEmail} onChange={e => setAddEmail(e.target.value)} required
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs" />
              <input placeholder="Phone" value={addPhone} onChange={e => setAddPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs" />
              <div className="flex gap-2 pt-1">
                <button type="button" onClick={() => setShowAdd(false)}
                  className="flex-1 py-2 bg-slate-100 text-xs font-semibold rounded-lg">Cancel</button>
                <button type="submit"
                  className="flex-1 py-2 bg-[#1047b8] text-white text-xs font-bold rounded-lg">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
