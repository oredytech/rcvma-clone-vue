import { create } from 'zustand';

interface RadioPlayerState {
  isVisible: boolean;
  isPlaying: boolean;
  setIsVisible: (visible: boolean) => void;
  setIsPlaying: (playing: boolean) => void;
  toggleVisibility: () => void;
  togglePlay: () => void;
}

export const useRadioPlayer = create<RadioPlayerState>((set) => ({
  isVisible: false,
  isPlaying: false,
  setIsVisible: (visible) => set({ isVisible: visible }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  toggleVisibility: () => set((state) => ({ isVisible: !state.isVisible })),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
}));
