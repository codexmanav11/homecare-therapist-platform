import { useState } from 'react';

// Lightweight hook for managing feature unlocks & future add-ons
export function useUpgradeRegistry(currentTier = 'PRO') {
  const [addons] = useState([
    { id: 'ai_copilot', name: 'AI Clinical Notes Copilot', tierRequired: 'PRO', status: 'ready' },
    { id: 'auto_whatsapp', name: 'WhatsApp Practice Reminders', tierRequired: 'STARTER', status: 'active' },
    { id: 'custom_domain', name: 'Branded Custom Domain (e.g. drsharma.in)', tierRequired: 'ELITE', status: 'upcoming' },
  ]);

  // Check if current therapist tier satisfies requirement
  const canUnlock = (requiredTier) => {
    const hierarchy = { FREE: 1, STARTER: 2, PRO: 3, ELITE: 4 };
    return (hierarchy[currentTier] || 1) >= (hierarchy[requiredTier] || 1);
  };

  return { addons, canUnlock };
}
