import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle2, ShieldCheck, CreditCard, X, AlertCircle } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';

export default function BookingModal({ isOpen, onClose, therapist }) {
  const [selectedDate, setSelectedDate] = useState('2026-09-25');
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [step, setStep] = useState(1); // 1: Slot, 2: Intake & Consent, 3: Payment, 4: Success

  // Form State
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [consentChecked, setConsentChecked] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  useEffect(() => {
    if (isOpen && therapist) {
      fetchSlots(selectedDate);
    }
  }, [isOpen, selectedDate, therapist]);

  const fetchSlots = async (dateStr) => {
    try {
      const res = await axiosInstance.get(`/public/scheduling/slots?therapistId=${therapist.id}&date=${dateStr}`);
      setSlots(res.data);
      if (res.data.length > 0) {
        const firstAvail = res.data.find(s => s.available);
        if (firstAvail) setSelectedSlot(firstAvail);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  const handleBook = async () => {
    if (!consentChecked) {
      setErrorMessage('Digital consent must be acknowledged before booking.');
      return;
    }
    setLoading(true);
    setErrorMessage('');

    try {
      const payload = {
        therapistId: therapist.id,
        clientName,
        clientEmail,
        clientPhone,
        bookingDate: selectedDate,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        clientTimezone: 'Asia/Kolkata',
        paymentMethod,
      };

      const res = await axiosInstance.post('/scheduling/book', payload);
      setConfirmedBooking(res.data);
      setStep(4);
    } catch (err) {
      setErrorMessage(err.response?.data || 'Failed to complete booking. Please try another slot.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="glass-panel w-full max-w-2xl rounded-2xl p-6 border border-slate-700 shadow-2xl relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/50 hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6 flex items-center gap-3 border-b border-slate-800 pb-4">
          <img
            src={therapist?.avatarUrl || 'https://images.unsplash.com/photo-1594824813566-88855ce78906?w=100'}
            alt="Doctor"
            className="w-12 h-12 rounded-full border border-blue-500/40 object-cover"
          />
          <div>
            <h3 className="text-lg font-extrabold text-white">Book Therapy Session with {therapist?.name}</h3>
            <p className="text-xs text-slate-400">
              50-min Consultation • <span className="text-emerald-400 font-semibold">₹{therapist?.consultationFee}</span> (incl. GST)
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Step 1: Select Date & Time Slot */}
        {step === 1 && (
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-400" /> Select Date & Open Slot (India Standard Time)
            </h4>

            <div className="mb-4 flex items-center gap-3">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs font-medium text-white focus:outline-none focus:border-blue-500"
              />
              <span className="text-xs text-slate-400">Timezone: IST (Asia/Kolkata)</span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 mb-6">
              {slots.map((slot) => (
                <button
                  key={slot.startTime}
                  disabled={!slot.available}
                  onClick={() => setSelectedSlot(slot)}
                  className={`p-3 rounded-xl text-xs font-semibold border transition-all flex flex-col items-center justify-center ${
                    !slot.available
                      ? 'bg-slate-900/40 border-slate-800 text-slate-600 cursor-not-allowed line-through'
                      : selectedSlot?.startTime === slot.startTime
                      ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-500/30'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5 mb-1" />
                  <span>{slot.startTime}</span>
                </button>
              ))}
            </div>

            <button
              disabled={!selectedSlot}
              onClick={() => setStep(2)}
              className="w-full py-3 rounded-xl text-xs font-bold gradient-btn text-white disabled:opacity-50"
            >
              Continue to Client Intake →
            </button>
          </div>
        )}

        {/* Step 2: Intake & Digital Consent */}
        {step === 2 && (
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Client Details & Digital Consent
            </h4>

            <div className="space-y-3 mb-5">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Aarav Mehta"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="aarav@example.com"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Mobile Phone</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Consent Box */}
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
                <p className="font-bold text-white mb-1">Practice Confidentiality & Consent Terms</p>
                <p className="text-[11px] text-slate-400 mb-2">
                  All clinical communications are encrypted and confidential under Tele-Mental Health guidelines in India. Cancellations require 24h notice.
                </p>
                <label className="flex items-center gap-2 cursor-pointer pt-1 border-t border-slate-800">
                  <input
                    type="checkbox"
                    checked={consentChecked}
                    onChange={(e) => setConsentChecked(e.target.checked)}
                    className="rounded border-slate-700 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="font-semibold text-white">I accept consent terms & digital timestamping</span>
                </label>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700"
              >
                ← Back
              </button>
              <button
                disabled={!clientName || !clientEmail || !consentChecked}
                onClick={() => setStep(3)}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold gradient-btn text-white disabled:opacity-50"
              >
                Proceed to Checkout (Razorpay) →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Payment Simulator */}
        {step === 3 && (
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-purple-400" /> Advance Fee Checkout (Razorpay Test Gateway)
            </h4>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 mb-5 space-y-2 text-xs text-slate-300">
              <div className="flex justify-between">
                <span>Therapy Consultation Fee:</span>
                <span className="font-bold text-white">₹{therapist?.consultationFee}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>GST (18%):</span>
                <span>₹{(therapist?.consultationFee * 0.18).toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-800 pt-2 text-sm font-extrabold text-white">
                <span>Total Payable:</span>
                <span className="text-emerald-400">₹{(therapist?.consultationFee * 1.18).toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <label className="text-[11px] text-slate-400 block">Select Payment Mode</label>
              <div className="grid grid-cols-3 gap-3">
                {['UPI', 'CARD', 'NETBANKING'].map((method) => (
                  <button
                    key={method}
                    onClick={() => setPaymentMethod(method)}
                    className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                      paymentMethod === method
                        ? 'bg-purple-600/20 border-purple-500 text-purple-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setStep(2)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700"
              >
                ← Back
              </button>
              <button
                disabled={loading}
                onClick={handleBook}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold gradient-btn text-white flex items-center justify-center gap-2"
              >
                {loading ? 'Processing Payment...' : `Pay ₹${(therapist?.consultationFee * 1.18).toFixed(2)} & Confirm`}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Booking Success */}
        {step === 4 && confirmedBooking && (
          <div className="text-center py-4">
            <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-extrabold text-white mb-2">Session Booking Confirmed!</h3>
            <p className="text-xs text-slate-300 mb-4">
              A confirmation email & WhatsApp message has been queued for <span className="font-bold text-white">{clientEmail}</span>.
            </p>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-left text-xs space-y-2 mb-6">
              <div className="flex justify-between">
                <span className="text-slate-400">Therapist:</span>
                <span className="font-bold text-white">{therapist?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Date & Time:</span>
                <span className="font-bold text-white">{confirmedBooking.bookingDate} at {confirmedBooking.startTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Video Link:</span>
                <a href={confirmedBooking.meetingLink} target="_blank" rel="noreferrer" className="text-blue-400 underline font-semibold">
                  Join Meeting Room
                </a>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-slate-800 text-white hover:bg-slate-700"
            >
              Done & Return to Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
