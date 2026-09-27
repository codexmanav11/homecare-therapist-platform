import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

export default function PatientPortal({ therapist, onSwitchRole }) {
  const [tab, setTab] = useState('book');
  const [slots, setSlots] = useState([]);
  const [selDate, setSelDate] = useState('2026-09-25');
  const [selSlot, setSelSlot] = useState(null);
  const [step, setStep] = useState(1); // 1=pick slot, 2=details, 3=done
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [sharedNotes, setSharedNotes] = useState([]);
  const [chatMsgs, setChatMsgs] = useState([]);
  const [chatText, setChatText] = useState('');

  useEffect(() => { fetchSlots(); }, [selDate]);
  useEffect(() => {
    axiosInstance.get('/public/notes/shared/1').then(r => setSharedNotes(r.data)).catch(() => {});
    axiosInstance.get('/chat/messages?therapistId=1&clientId=1').then(r => setChatMsgs(r.data)).catch(() => {});
  }, []);

  async function fetchSlots() {
    try {
      const r = await axiosInstance.get(`/public/scheduling/slots?therapistId=1&date=${selDate}`);
      setSlots(r.data);
      setSelSlot(null);
    } catch (e) { console.error(e); }
  }

  async function bookSlot() {
    if (!consent) { setError('Please accept the consent terms'); return; }
    if (!name || !email) { setError('Name and email are required'); return; }
    setLoading(true); setError('');
    try {
      const r = await axiosInstance.post('/scheduling/book', {
        therapistId: 1,
        clientName: name, clientEmail: email, clientPhone: phone,
        bookingDate: selDate, startTime: selSlot.startTime, endTime: selSlot.endTime,
        clientTimezone: 'Asia/Kolkata', paymentMethod: 'UPI'
      });
      setResult(r.data);
      setStep(3);
      fetchSlots(); // refresh slots
    } catch (e) {
      setError(typeof e.response?.data === 'string' ? e.response.data : 'Booking failed');
    } finally { setLoading(false); }
  }

  async function sendChat(e) {
    e.preventDefault();
    if (!chatText.trim()) return;
    try {
      const r = await axiosInstance.post('/chat/send', {
        therapistId: 1, clientId: 1, senderType: 'CLIENT', content: chatText
      });
      setChatMsgs(prev => [...prev, r.data]);
      setChatText('');
    } catch (e) { console.error(e); }
  }

  const tabs = [
    { id: 'book', label: 'Book Session' },
    { id: 'notes', label: 'My Notes' },
    { id: 'chat', label: 'Chat' },
  ];

  return (
    <div className="min-h-screen bg-[#f4f7fc] px-4 md:px-8 py-5">
      <div className="max-w-5xl mx-auto">
        {/* header */}
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-xl font-extrabold text-[#1047b8]">HomeCare</span>
            <span className="text-xs text-slate-400">Patient Portal</span>
            <nav className="bg-white border border-slate-200 rounded-full p-1 flex gap-1 ml-3">
              {tabs.map(t => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                    tab === t.id ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:text-slate-800'
                  }`}>{t.label}</button>
              ))}
            </nav>
          </div>
          <button onClick={onSwitchRole} className="text-xs text-slate-400 hover:text-blue-500 underline">
            Switch role
          </button>
        </header>

        {/* therapist info card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 flex items-center gap-4 mb-6">
          <img src={therapist?.avatarUrl || ''} alt=""
            className="w-14 h-14 rounded-xl object-cover border border-blue-200" />
          <div className="flex-1">
            <h2 className="font-bold text-slate-900">{therapist?.name}</h2>
            <p className="text-xs text-slate-500">{therapist?.title}</p>
            <div className="flex gap-2 mt-1 flex-wrap">
              {therapist?.specializations?.map(s => (
                <span key={s} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{s}</span>
              ))}
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-extrabold text-slate-900">₹{therapist?.consultationFee}</p>
            <p className="text-[10px] text-slate-400">per session</p>
          </div>
        </div>

        {/* book session */}
        {tab === 'book' && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200">
            {step === 1 && (
              <div>
                <h3 className="font-bold text-slate-900 mb-4">Select Date & Time</h3>
                <div className="flex items-center gap-3 mb-4">
                  <input type="date" value={selDate} onChange={e => { setSelDate(e.target.value); setStep(1); }}
                    className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs" />
                  <span className="text-xs text-slate-400">IST (Asia/Kolkata)</span>
                </div>
                <div className="grid grid-cols-4 gap-2 mb-5">
                  {slots.map(s => (
                    <button key={s.startTime} disabled={!s.available}
                      onClick={() => setSelSlot(s)}
                      className={`p-3 rounded-xl text-xs font-semibold border transition ${
                        !s.available ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed line-through'
                        : selSlot?.startTime === s.startTime ? 'bg-[#1047b8] text-white border-blue-400'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300'
                      }`}>
                      {s.startTime}
                      <span className="block text-[10px] mt-0.5">{s.available ? 'Available' : 'Taken'}</span>
                    </button>
                  ))}
                </div>
                <button disabled={!selSlot}
                  onClick={() => setStep(2)}
                  className="w-full py-2.5 bg-[#1047b8] text-white text-xs font-bold rounded-xl disabled:opacity-40">
                  Continue →
                </button>
              </div>
            )}

            {step === 2 && (
              <div>
                <h3 className="font-bold text-slate-900 mb-1">Your Details</h3>
                <p className="text-xs text-slate-400 mb-4">Session on {selDate} at {selSlot?.startTime}</p>

                {error && <p className="text-xs text-rose-500 bg-rose-50 p-2 rounded mb-3">{error}</p>}

                <div className="space-y-2 mb-4">
                  <input placeholder="Full name" value={name} onChange={e => setName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs" />
                  <div className="grid grid-cols-2 gap-2">
                    <input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs" />
                    <input placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs" />
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg mb-4 border border-slate-100">
                  <p className="text-[11px] text-slate-500 mb-2">
                    All sessions are confidential. Cancellations need 24h notice.
                  </p>
                  <label className="flex items-center gap-2 text-xs cursor-pointer">
                    <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)}
                      className="rounded" />
                    <span className="font-semibold text-slate-700">I accept the consent terms</span>
                  </label>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg mb-4 border border-slate-100 text-xs">
                  <div className="flex justify-between"><span>Fee:</span><span className="font-bold">₹{therapist?.consultationFee}</span></div>
                  <div className="flex justify-between text-slate-400"><span>GST (18%):</span><span>₹{(therapist?.consultationFee * 0.18).toFixed(0)}</span></div>
                  <div className="flex justify-between font-bold border-t border-slate-200 pt-1 mt-1">
                    <span>Total:</span><span className="text-blue-600">₹{(therapist?.consultationFee * 1.18).toFixed(0)}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => setStep(1)} className="px-4 py-2 bg-slate-100 text-xs font-semibold rounded-lg">Back</button>
                  <button onClick={bookSlot} disabled={loading}
                    className="flex-1 py-2.5 bg-[#1047b8] text-white text-xs font-bold rounded-xl disabled:opacity-60">
                    {loading ? 'Booking...' : 'Confirm & Pay'}
                  </button>
                </div>
              </div>
            )}

            {step === 3 && result && (
              <div className="text-center py-6">
                <div className="text-4xl mb-3">✅</div>
                <h3 className="text-lg font-extrabold text-slate-900 mb-1">Session Booked!</h3>
                <p className="text-xs text-slate-500 mb-4">Confirmation sent to {email}</p>
                <div className="bg-slate-50 p-4 rounded-xl text-left text-xs space-y-1 max-w-sm mx-auto border border-slate-100">
                  <div className="flex justify-between"><span className="text-slate-400">Date:</span><span className="font-bold">{result.bookingDate}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Time:</span><span className="font-bold">{result.startTime}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Meeting:</span>
                    <a href={result.meetingLink} target="_blank" rel="noreferrer" className="text-blue-600 underline">{result.meetingLink}</a>
                  </div>
                </div>
                <button onClick={() => { setStep(1); setSelSlot(null); setResult(null); setName(''); setEmail(''); setPhone(''); setConsent(false); }}
                  className="mt-4 px-4 py-2 bg-slate-100 text-xs font-semibold rounded-lg">Book Another</button>
              </div>
            )}
          </div>
        )}

        {/* shared notes */}
        {tab === 'notes' && (
          <div className="bg-white rounded-2xl p-5 border border-slate-200">
            <h3 className="font-bold text-slate-900 mb-1">Shared Notes from {therapist?.name}</h3>
            <p className="text-xs text-slate-400 mb-4">Only notes marked as shared by your therapist appear here.</p>
            {sharedNotes.length === 0 && <p className="text-xs text-slate-400">No shared notes yet.</p>}
            {sharedNotes.map(n => (
              <div key={n.id} className="p-3 mb-2 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-xs text-slate-500 mb-1">{n.createdAt}</p>
                <p className="text-xs text-slate-800">{n.bodyText}</p>
              </div>
            ))}
          </div>
        )}

        {/* patient chat */}
        {tab === 'chat' && (
          <div className="bg-white rounded-2xl p-5 border border-slate-200 flex flex-col h-[450px]">
            <h3 className="font-bold text-slate-900 mb-3 border-b border-slate-100 pb-2">
              Chat with {therapist?.name}
            </h3>
            <div className="flex-1 overflow-y-auto space-y-2 mb-3">
              {chatMsgs.map(m => (
                <div key={m.id} className={`flex ${m.senderType === 'CLIENT' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] p-2.5 rounded-xl text-xs ${
                    m.senderType === 'CLIENT'
                      ? 'bg-emerald-600 text-white rounded-br-none'
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
              <button type="submit" className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg">Send</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
