import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

interface CookieConsentState {
  hasConsented: boolean;
  preferences: CookiePreferences;
  showBanner: boolean;
  setConsent: (preferences: CookiePreferences) => void;
  acceptAll: () => void;
  rejectAll: () => void;
  dismissBanner: () => void;
  resetConsent: () => void;
}

const defaultPreferences: CookiePreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
  preferences: false,
};

export const useCookieConsent = create<CookieConsentState>()(
  persist(
    (set) => ({
      hasConsented: false,
      preferences: defaultPreferences,
      showBanner: true,
      setConsent: (preferences) =>
        set({
          hasConsented: true,
          preferences: { ...preferences, necessary: true },
          showBanner: false,
        }),
      acceptAll: () =>
        set({
          hasConsented: true,
          preferences: {
            necessary: true,
            analytics: true,
            marketing: true,
            preferences: true,
          },
          showBanner: false,
        }),
      rejectAll: () =>
        set({
          hasConsented: true,
          preferences: defaultPreferences,
          showBanner: false,
        }),
      dismissBanner: () => set({ showBanner: false }),
      resetConsent: () =>
        set({
          hasConsented: false,
          preferences: defaultPreferences,
          showBanner: true,
        }),
    }),
    {
      name: 'cookie-consent-storage',
    }
  )
);
