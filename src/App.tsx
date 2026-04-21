import { useState, useEffect } from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { Terminal, Database, Shield, Zap, Cpu, Wifi } from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [systemLogs, setSystemLogs] = useState<string[]>([]);

  useEffect(() => {
    const logs = [
      "SYSTEM_BOOT: SUCCESS",
      "NEURAL_LINK: ESTABLISHED",
      "VOID_CONNECTION: ACTIVE",
      "SNAKE_MODULE: LOADED",
      "AUDIO_SYNC: SYNCED"
    ];
    let i = 0;
    const interval = setInterval(() => {
      if (i < logs.length) {
        setSystemLogs(prev => [logs[i], ...prev].slice(0, 8));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleScoreUpdate = (newScore: number) => {
    setScore(newScore);
    if (newScore > highScore) setHighScore(newScore);
    if (newScore > 0 && newScore % 50 === 0) {
      setSystemLogs(prev => [`SCORE_CHKPNT: ${newScore}`, ...prev].slice(0, 8));
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden void-grid">
      <div className="noise" />
      <div className="scanline" />

      {/* Header Bar */}
      <header className="h-12 border-b-2 border-neon-cyan/30 flex items-center justify-between px-6 bg-void/80 backdrop-blur-sm z-20 relative">
        <div className="flex items-center gap-4">
          <Terminal size={18} className="text-neon-magenta animate-pulse" />
          <h1 className="text-xs font-pixel tracking-tighter glitch-text">NEON_VOID // V.1.0.42</h1>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-neon-yellow">
            <Zap size={14} />
            <span className="text-[10px] font-pixel">TPS: 64.0</span>
          </div>
          <div className="flex items-center gap-2 text-neon-cyan">
            <Wifi size={14} />
            <span className="text-[10px] font-pixel">MS: 12ms</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 lg:p-8 h-[calc(100vh-3rem)] grid grid-cols-1 lg:grid-cols-12 gap-8 z-20 relative">
        {/* Left Sidebar - System Status */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <section className="glitch-border p-4 bg-void/40 backdrop-blur-sm flex-1 flex flex-col">
            <h2 className="text-[10px] font-pixel text-neon-magenta mb-4 flex items-center gap-2">
              <Database size={12} /> SYSTEM_STATUS
            </h2>
            <div className="flex-1 font-mono text-[10px] space-y-2 opacity-80 overflow-hidden">
              {systemLogs.map((log, i) => (
                <motion.p 
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="border-l-2 border-neon-cyan/20 pl-2 py-1"
                >
                  <span className="text-neon-magenta">{">"}</span> {log}
                </motion.p>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-neon-cyan/20 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-pixel opacity-50">CPU_TEMP:</span>
                <span className="text-[10px] font-mono text-neon-yellow">42°C</span>
              </div>
              <div className="h-1 bg-white/10 overflow-hidden">
                <div className="h-full bg-neon-yellow w-3/4 shadow-[0_0_5px_theme('colors.neon-yellow')]" />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-pixel opacity-50">BANDWIDTH:</span>
                <span className="text-[10px] font-mono text-neon-cyan">1.2 GB/S</span>
              </div>
            </div>
          </section>

          <MusicPlayer />
        </div>

        {/* Center - Main Game Window */}
        <div className="lg:col-span-6 flex flex-col gap-6 items-center justify-center">
          <div className="w-full flex justify-between items-end mb-2">
            <div className="flex flex-col">
              <span className="text-[10px] font-pixel text-neon-magenta opacity-70 mb-1">DATA_HARVESTED</span>
              <div className="text-3xl font-pixel text-neon-cyan glitch-text">{score.toString().padStart(6, '0')}</div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-pixel text-neon-yellow opacity-70 mb-1">LOCAL_MAXIMA</span>
              <div className="text-xl font-pixel text-neon-yellow">{highScore.toString().padStart(6, '0')}</div>
            </div>
          </div>

          <SnakeGame onScoreUpdate={handleScoreUpdate} />

          <div className="flex gap-4 w-full opacity-50 justify-center">
            <div className="flex items-center gap-2 text-[9px] font-pixel">
              <div className="w-2 h-2 bg-neon-cyan"></div> WASD / ARROWS : CONTROL
            </div>
            <div className="flex items-center gap-2 text-[9px] font-pixel">
              <div className="w-2 h-2 bg-neon-magenta"></div> EXECUTE() : BEGIN
            </div>
          </div>
        </div>

        {/* Right Sidebar - Hardware Specs */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <section className="glitch-border p-4 bg-neon-magenta/5 border-neon-magenta/30 flex-1">
            <h2 className="text-[10px] font-pixel text-neon-magenta mb-4 flex items-center gap-2">
              <Shield size={12} /> ENCRYPT_CORE
            </h2>
            <div className="space-y-4">
              <div className="p-2 border border-neon-magenta/20 flex items-center gap-3">
                <Cpu size={16} className="text-neon-magenta" />
                <div className="flex-1">
                  <div className="text-[9px] font-pixel mb-1">X-VOID PROCESSR</div>
                  <div className="text-[8px] font-mono opacity-60">128 THREADS // 5.8GHZ</div>
                </div>
              </div>
              
              <div className="p-3 bg-neon-cyan/5 border border-neon-cyan/20">
                <div className="text-[9px] font-pixel mb-2 text-neon-cyan italic">THREAT_LEVEL: NIL</div>
                <div className="grid grid-cols-4 gap-1">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className={`h-4 border border-neon-cyan/30 ${i < 4 ? 'bg-neon-cyan/50' : ''}`} />
                  ))}
                </div>
              </div>

              <div className="font-mono text-[9px] opacity-40 leading-relaxed text-justify">
                WARNING: CONTINUED EXPOSURE TO THE VOID MAY CAUSE TEMPORAL DISPLACEMENT. DO NOT ATTEMPT TO EXIT THE TERMINAL DURING ACTIVE STREAM. ALL DATA IS SUBJECT TO DECRYPTION PROTOCOL 7.
              </div>
            </div>
          </section>

          {/* User Profile Hook */}
          <div className="p-4 border-2 border-neon-yellow/30 bg-neon-yellow/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-neon-yellow/20 flex items-center justify-center border border-neon-yellow glitch-text">
                <span className="font-pixel text-xs text-neon-yellow">U</span>
              </div>
              <div className="flex-1">
                <div className="text-[9px] font-pixel">VISITOR_081</div>
                <div className="text-[8px] font-mono text-neon-yellow">LEVEL: 04 // ROOKIE</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Extreme Low Footer */}
      <footer className="absolute bottom-0 w-full h-4 bg-neon-magenta/20 backdrop-blur-sm z-30 flex items-center justify-center overflow-hidden">
        <div className="text-[7px] font-pixel text-neon-magenta whitespace-nowrap animate-marquee flex gap-8">
          {[...Array(10)].map((_, i) => (
            <span key={i}>TERMINAL_ENCRYPTED_SUCCESSFUL // CONNECTION_PRIVATE // NO_ESCAPE // TERMINAL_ENCRYPTED_SUCCESSFUL</span>
          ))}
        </div>
      </footer>
    </div>
  );
}
