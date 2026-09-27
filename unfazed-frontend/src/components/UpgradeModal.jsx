import React from 'react';
import { ShieldAlert, Check, Sparkles, X, Zap } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';

export default function UpgradeModal({ isOpen, onClose, currentTier, onTierUpdated, blockedReason }) {
  if (!isOpen) return null;

  const handleUpgrade = async (tierName) => {
    try {
      await axiosInstance.patch(`/therapist/1/tier?tier=${tierName}`);
      onTierUpdated(tierName);
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  const tiers = [
    {
      name: 'STARTER',
      price: '₹1,499 / mo',
      clients: '15 Active Clients',
      soap: false,
      analytics: 'Basic',
      badge: 'Popular',
    },
    {
      name: 'PRO',
      price: '₹3,499 / mo',
      clients: '100 Active Clients',
      soap: true,
      analytics: 'Advanced (Revenue + No-Show)',
      badge: 'Recommended',
      highlighted: true,
    },
    {
      name: 'ELITE',
      price: '₹7,999 / mo',
      clients: 'Unlimited Clients',
      soap: true,
      analytics: 'Enterprise Custom',
      badge: 'Unlimited',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-4xl rounded-2xl p-6 border border-slate-700 shadow-2xl relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/50 hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {blockedReason && (
          <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 text-amber-400 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-amber-300">Feature Gated by Entitlement Engine</h4>
              <p className="text-xs text-amber-200/80">{blockedReason}</p>
            </div>
          </div>
        )}

        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Centralized Config-Driven Tier Entitlements
          </div>
          <h2 className="text-2xl font-extrabold text-white">Upgrade Your Unfazed Practice Tier</h2>
          <p className="text-sm text-slate-400 mt-1">Unlock client capacity, SOAP clinical templates, and advanced revenue analytics.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-2xl p-5 border flex flex-col justify-between transition-all ${
                tier.highlighted
                  ? 'bg-slate-900/90 border-blue-500 ring-2 ring-blue-500/30 shadow-xl shadow-blue-500/10'
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{tier.name}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-blue-400 border border-slate-700">
                    {tier.badge}
                  </span>
                </div>

                <div className="text-2xl font-extrabold text-white mb-4">{tier.price}</div>

                <ul className="space-y-2.5 text-xs text-slate-300 mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>{tier.clients}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className={`w-4 h-4 ${tier.soap ? 'text-emerald-400' : 'text-slate-600'} flex-shrink-0`} />
                    <span className={tier.soap ? 'text-white' : 'text-slate-500 line-through'}>
                      SOAP / DAP Clinical Templates
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Analytics: {tier.analytics}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>GST PDF Invoice Generation</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handleUpgrade(tier.name)}
                disabled={currentTier === tier.name}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  currentTier === tier.name
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : tier.highlighted
                    ? 'gradient-btn text-white'
                    : 'bg-slate-800 hover:bg-slate-700 text-white'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                {currentTier === tier.name ? 'Current Active Tier' : `Switch to ${tier.name}`}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
