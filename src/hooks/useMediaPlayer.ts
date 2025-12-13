import { create } from 'zustand';

type PlayerType = 'radio' | 'podcast' | null;

interface PodcastInfo {
  title: string;
  audioUrl: string;
  imageUrl?: string;
  slug?: string;
}

interface MediaPlayerState {
  activePlayer: PlayerType;
  isVisible: boolean;
  isPlaying: boolean;
  podcastInfo: PodcastInfo | null;
  setActivePlayer: (player: PlayerType) => void;
  setIsVisible: (visible: boolean) => void;
  setIsPlaying: (playing: boolean) => void;
  setPodcastInfo: (info: PodcastInfo | null) => void;
  togglePlay: () => void;
  switchToRadio: () => void;
  switchToPodcast: (info: PodcastInfo) => void;
  closePlayer: () => void;
}

export const useMediaPlayer = create<MediaPlayerState>((set) => ({
  activePlayer: null,
  isVisible: false,
  isPlaying: false,
  podcastInfo: null,
  setActivePlayer: (player) => set({ activePlayer: player }),
  setIsVisible: (visible) => set({ isVisible: visible }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setPodcastInfo: (info) => set({ podcastInfo: info }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  switchToRadio: () => set({ 
    activePlayer: 'radio', 
    isVisible: true, 
    isPlaying: true,
    podcastInfo: null 
  }),
  switchToPodcast: (info) => set({ 
    activePlayer: 'podcast', 
    isVisible: true, 
    isPlaying: true,
    podcastInfo: info 
  }),
  closePlayer: () => set({ 
    activePlayer: null, 
    isVisible: false, 
    isPlaying: false,
    podcastInfo: null 
  }),
}));
