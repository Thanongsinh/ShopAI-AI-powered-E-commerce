import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Palette = '#6366F1' | '#EC4899' | '#10B981' | '#F59E0B';
export type CardStyle = 'rounded' | 'sharp';
export type Density = 'comfortable' | 'compact';

interface TweaksState {
  primary: Palette;
  showAI: boolean;
  cardStyle: CardStyle;
  density: Density;
  set: <K extends keyof Omit<TweaksState, 'set'>>(k: K, v: TweaksState[K]) => void;
}

export const PALETTES: Record<Palette, { primary: string; dark: string; light: string }> = {
  '#6366F1': { primary: '#6366F1', dark: '#4F46E5', light: '#EEF2FF' },
  '#EC4899': { primary: '#EC4899', dark: '#DB2777', light: '#FDF2F8' },
  '#10B981': { primary: '#10B981', dark: '#059669', light: '#ECFDF5' },
  '#F59E0B': { primary: '#F59E0B', dark: '#D97706', light: '#FFFBEB' },
};

export const useTweaks = create<TweaksState>()(
  persist(
    (set) => ({
      primary: '#6366F1',
      showAI: true,
      cardStyle: 'rounded',
      density: 'comfortable',
      set: (k, v) => set({ [k]: v } as Pick<TweaksState, typeof k>),
    }),
    { name: 'shopai.tweaks' },
  ),
);

export function applyPalette(p: Palette) {
  const { primary, dark, light } = PALETTES[p];
  const r = document.documentElement.style;
  r.setProperty('--c-primary', primary);
  r.setProperty('--c-primary-dark', dark);
  r.setProperty('--c-primary-light', light);
  const meta = document.getElementById('meta-theme') as HTMLMetaElement | null;
  if (meta) meta.content = primary;
}
