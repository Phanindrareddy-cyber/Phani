import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Music, Activity } from 'lucide-react';
import { DUMMY_TRACKS, Track } from '../types';

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleNext);
    
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleNext);
    };
  }, []);

  const handleTogglePlay = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  return (
    <div className="glitch-border bg-void/50 p-6 backdrop-blur-md relative overflow-hidden group">
      {/* Background Visualizer Animation */}
      <div className="absolute inset-0 flex items-end justify-around px-4 opacity-10 pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <div 
            key={i} 
            className="w-1 bg-neon-cyan animate-bounce" 
            style={{ 
              height: `${Math.random() * 80 + 20}%`, 
              animationDuration: `${Math.random() * 0.5 + 0.3}s`,
              animationDelay: `${i * 0.1}s` 
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <div className={`p-4 bg-neon-magenta/20 border-2 border-neon-magenta text-neon-magenta ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '8s' }}>
              <Music size={24} />
            </div>
            <div className="absolute -top-2 -right-2">
              <Activity size={16} className="text-neon-cyan animate-pulse" />
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <h3 className="text-sm font-pixel text-neon-cyan truncate glitch-text mb-1">{currentTrack.title}</h3>
            <p className="text-[10px] font-mono text-neon-magenta tracking-widest uppercase opacity-70">
              ORIGIN: {currentTrack.artist}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-white/10 w-full mb-6 relative group/seek cursor-pointer">
          <div 
            className="h-full bg-neon-cyan shadow-[0_0_10px_theme('colors.neon-cyan')]" 
            style={{ width: `${progress}%` }}
          />
          <div 
            className="absolute top-0 h-full w-0.5 bg-white shadow-xl opacity-0 group-hover/seek:opacity-100 transition-opacity"
            style={{ left: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={handlePrev}
              className="p-2 text-neon-cyan hover:text-white transition-colors hover:scale-110 active:scale-95"
            >
              <SkipBack size={20} />
            </button>
            <button 
              onClick={handleTogglePlay}
              className="p-3 bg-neon-cyan text-void rounded-full hover:bg-white transition-all shadow-lg hover:shadow-cyan-500/50 active:scale-90"
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-0.5" />}
            </button>
            <button 
              onClick={handleNext}
              className="p-2 text-neon-cyan hover:text-white transition-colors hover:scale-110 active:scale-95"
            >
              <SkipForward size={20} />
            </button>
          </div>
          
          <div className="text-[10px] font-mono p-2 border border-neon-cyan/30 text-neon-cyan">
            {isPlaying ? "STREAMING..." : "PAUSED"}
          </div>
        </div>
      </div>

      <audio 
        ref={audioRef} 
        src={currentTrack.url} 
        onEnded={handleNext}
      />
    </div>
  );
};
