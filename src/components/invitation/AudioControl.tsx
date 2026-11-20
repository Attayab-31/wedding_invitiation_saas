'use client';

import { Volume2, VolumeX } from 'lucide-react';

interface AudioControlProps {
  isMuted: boolean;
  unavailable: boolean;
  onToggle: () => void;
}

export function AudioControl({ isMuted, unavailable, onToggle }: AudioControlProps) {
  return (
    <div className="fixed right-3 top-3 z-[100] sm:right-5 sm:top-5">
      <button
        type="button"
        aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
        aria-pressed={!isMuted}
        onClick={onToggle}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D8B66D]/60 bg-[#241811]/85 text-[#F3E4C5] shadow-lg backdrop-blur-sm transition hover:bg-[#49311F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F4D887] sm:h-11 sm:w-11"
      >
        {isMuted
          ? <VolumeX aria-hidden="true" className="h-4 w-4" />
          : <Volume2 aria-hidden="true" className="h-4 w-4" />}
      </button>
      {unavailable && (
        <span
          role="status"
          className="absolute right-0 top-12 whitespace-nowrap rounded-lg bg-[#241811]/90 px-2 py-1 text-[10px] text-[#F3E4C5] shadow-lg"
        >
          Audio unavailable
        </span>
      )}
    </div>
  );
}
