import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, RotateCcw, Heart, Star, Trophy, Zap, ChevronLeft, Award } from 'lucide-react';

// ==========================================
// 4-MODE ALPHABET CONFIGURATION
// ==========================================
const ALPHABET_KEYS = [
  'hamza', 'ba', 'ta', 'tha', 'jeem', 'haa', 'kha', 
  'dal', 'thal', 'raa', 'zay', 'seen', 'sheen', 'sad', 
  'dad', 'taa', 'zaa', 'ayn', 'ghayn', 'faa', 'qaf', 
  'kaf', 'lam', 'meem', 'noon', 'haa2', 'waw', 'yaa'
];

const LETTER_CONFIG = {
  'hamza': { char: 'أ', mode: 'rain', shapes: ['ء', 'ئ', 'ئـ', 'ؤ', 'أ', 'إ'], sounds: ['ءا.m4a', 'ءو.m4a', 'ءي.m4a'], bg: "from-sky-800 to-indigo-950", accent: "text-blue-500" },
  'ba': { char: 'ب', mode: 'rain', shapes: ['ب', 'بـ', 'ـبـ', 'ـب'], sounds: ['ب.m4a', 'بو.m4a', 'بي.m4a'], bg: "from-emerald-800 to-teal-950", accent: "text-green-500" },
  'ta': { char: 'ت', mode: 'rain', shapes: ['ت', 'تـ', 'ـتـ', 'ـت'], sounds: ['تا.m4a', 'تو.m4a', 'تي.m4a'], bg: "from-rose-800 to-red-950", accent: "text-red-500" },
  'tha': { char: 'ث', mode: 'runner', shapes: ['ث', 'ثـ', 'ـثـ', 'ـث'], sounds: ['ثا.m4a', 'ثو.m4a', 'ثي.m4a'], bg: "from-purple-800 to-indigo-950", accent: "text-purple-400" },
  'jeem': { char: 'ج', mode: 'rain', shapes: ['ج', 'جـ', 'ـجـ', 'ـج'], sounds: ['جا.m4a', 'جو.m4a', 'جي.m4a'], bg: "from-orange-800 to-amber-950", accent: "text-orange-500" },
  'haa': { char: 'ح', mode: 'whack', shapes: ['ح', 'حـ', 'ـحـ', 'ـح'], sounds: ['حا.m4a', 'حو.m4a', 'حي.m4a'], bg: "from-teal-800 to-cyan-950", accent: "text-cyan-500" },
  'kha': { char: 'خ', mode: 'runner', shapes: ['خ', 'خـ', 'ـخـ', 'ـخ'], sounds: ['خا.m4a', 'خو.m4a', 'خي.m4a'], bg: "from-slate-800 to-black", accent: "text-slate-400" },
  'dal': { char: 'د', mode: 'rain', shapes: ['د', 'ـد', 'ـدـ'], sounds: ['دا.m4a', 'دو.m4a', 'دي.m4a'], bg: "from-red-800 to-rose-950", accent: "text-rose-500" },
  'thal': { char: 'ذ', mode: 'whack', shapes: ['ذ', 'ـذ', 'ـذـ'], sounds: ['ذا.m4a', 'ذو.m4a', 'ذي.m4a'], bg: "from-yellow-700 to-orange-950", accent: "text-yellow-500" },
  'raa': { char: 'ر', mode: 'rain', shapes: ['ر', 'ـر', 'ـرـ'], sounds: ['را.m4a', 'رو.m4a', 'ري.m4a'], bg: "from-lime-800 to-green-950", accent: "text-lime-500" },
  'zay': { char: 'ز', mode: 'whack', shapes: ['ز', 'ـز', 'ـزـ'], sounds: ['زا.m4a', 'زو.m4a', 'زي.m4a'], bg: "from-green-800 to-emerald-950", accent: "text-emerald-500" },
  'seen': { char: 'س', mode: 'rain', shapes: ['س', 'سـ', 'ـسـ', 'ـس'], sounds: ['س.m4a', 'سو.m4a', 'سي.m4a'], bg: "from-blue-800 to-violet-950", accent: "text-blue-400" },
  'sheen': { char: 'ش', mode: 'whack', shapes: ['ش', 'شـ', 'ـشـ', 'ـش'], sounds: ['شا.m4a', 'شو.m4a', 'شي.m4a'], bg: "from-violet-800 to-fuchsia-950", accent: "text-violet-400" },
  'sad': { char: 'ص', mode: 'rain', shapes: ['ص', 'صـ', 'ـصـ', 'ـص'], sounds: ['صا.m4a', 'صو.m4a', 'صي.m4a'], bg: "from-stone-800 to-black", accent: "text-stone-400" },
  'dad': { char: 'ض', mode: 'whack', shapes: ['ض', 'ضـ', 'ـضـ', 'ـض'], sounds: ['ضا.m4a', 'ضو.m4a', 'ضي.m4a'], bg: "from-emerald-900 to-black", accent: "text-emerald-600" },
  'taa': { char: 'ط', mode: 'whack', shapes: ['ط', 'طـ', 'ـطـ', 'ـط'], sounds: ['طا.m4a', 'طو.m4a', 'طي.m4a'], bg: "from-amber-800 to-orange-950", accent: "text-amber-600" },
  'zaa': { char: 'ظ', mode: 'runner', shapes: ['ظ', 'ظـ', 'ـظـ', 'ـظ'], sounds: ['ظا.m4a', 'ظو.m4a', 'ظي.m4a'], bg: "from-orange-900 to-black", accent: "text-orange-500" },
  'ayn': { char: 'ع', mode: 'runner', shapes: ['ع', 'عـ', 'ـعـ', 'ـع'], sounds: ['عا.m4a', 'عو.m4a', 'عي.m4a'], bg: "from-sky-900 to-black", accent: "text-sky-500" },
  'ghayn': { char: 'غ', mode: 'runner', shapes: ['غ', 'غـ', 'ـغـ', 'ـغ'], sounds: ['غا.m4a', 'غو.m4a', 'غي.m4a'], bg: "from-indigo-900 to-black", accent: "text-indigo-400" },
  'faa': { char: 'ف', mode: 'whack', shapes: ['ف', 'فـ', 'ـفـ', 'ـف'], sounds: ['فا.m4a', 'فو.m4a', 'في.m4a'], bg: "from-pink-900 to-black", accent: "text-pink-500" },
  'qaf': { char: 'ق', mode: 'lantern', shapes: ['ق', 'قـ', 'ـقـ', 'ـق'], sounds: ['ققا.m4a', 'قو.m4a', 'قي.m4a'], bg: "from-red-900 to-black", accent: "text-red-500" },
  'kaf': { char: 'ك', mode: 'runner', shapes: ['ك', 'كـ', 'ـكـ', 'ـك'], sounds: ['كا.m4a', 'كو.m4a', 'كي.m4a'], bg: "from-blue-900 to-black", accent: "text-blue-400" },
  'lam': { char: 'ل', mode: 'runner', shapes: ['ل', 'لـ', 'ـلـ', 'ـل'], sounds: ['لَ.m4a', 'لو.m4a', 'لي.m4a'], bg: "from-cyan-900 to-black", accent: "text-cyan-500" },
  'meem': { char: 'م', mode: 'lantern', shapes: ['م', 'مـ', 'ـمـ', 'ـم'], sounds: ['ما.m4a', 'مو.m4a', 'مي.m4a'], bg: "from-violet-900 to-black", accent: "text-fuchsia-500" },
  'noon': { char: 'ن', mode: 'lantern', shapes: ['ن', 'نـ', 'ـنـ', 'ـن'], sounds: ['نا.m4a', 'نو.m4a', 'ني.m4a'], bg: "from-green-900 to-black", accent: "text-green-500" },
  'haa2': { char: 'ه', mode: 'lantern', shapes: ['ه', 'هـ', 'ـهـ', 'ـه'], sounds: ['ها.m4a', 'هو.m4a', 'هي.m4a'], bg: "from-orange-800 to-black", accent: "text-yellow-500" },
  'waw': { char: 'و', mode: 'lantern', shapes: ['و', 'ـو', 'ـوـ'], sounds: ['وا.m4a', 'وو.m4a', 'وي.m4a'], bg: "from-blue-900 to-black", accent: "text-indigo-500" },
  'yaa': { char: 'ي', mode: 'lantern', shapes: ['ي', 'يـ', 'ـيـ', 'ـي'], sounds: ['ي.m4a', 'يو.m4a', 'يي.m4a'], bg: "from-teal-900 to-black", accent: "text-teal-400" },
};

const App = () => {
  const [selectedLetterKey, setSelectedLetterKey] = useState(null);
  const [gameState, setGameState] = useState('splash');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [elements, setElements] = useState([]);
  const [floatingTexts, setFloatingTexts] = useState([]);
  const [showLevelUp, setShowLevelUp] = useState(false);
  
  const [scores, setScores] = useState(() => {
    try {
      const saved = localStorage.getItem('alphabetMasterScores');
      return saved ? JSON.parse(saved) : {};
    } catch (e) { return {}; }
  });

  const audioRefs = useRef({});
  const bgMusicRef = useRef(null);
  const currentLetter = selectedLetterKey ? LETTER_CONFIG[selectedLetterKey] : null;

  const masteredCount = Object.keys(LETTER_CONFIG).filter(key => (scores[key] || 0) >= 70).length;

  useEffect(() => {
    bgMusicRef.current = new Audio('/audio/abc_song.mp3');
    bgMusicRef.current.loop = true;
    bgMusicRef.current.preload = "auto";
  }, []);

  // TURBO UNLOCKER: Silent fire to wake up browser audio engine
  const unlockAllAudio = useCallback(() => {
    ALPHABET_KEYS.forEach(key => {
      const config = LETTER_CONFIG[key];
      config.sounds.forEach(filename => {
        if (!audioRefs.current[filename]) {
          const audio = new Audio(`/audio/${filename}`);
          audio.preload = "auto";
          audio.volume = 0;
          audio.play().then(() => {
            audio.pause();
            audio.currentTime = 0;
            audio.volume = 1;
          }).catch(() => {});
          audioRefs.current[filename] = audio;
        }
      });
    });
  }, []);

  // DASHBOARD MUSIC LOGIC: Stop if NOT in menu
  useEffect(() => {
    if (gameState === 'menu') {
      bgMusicRef.current?.play().catch(() => {});
      unlockAllAudio();
    } else {
      bgMusicRef.current?.pause();
      if (bgMusicRef.current) bgMusicRef.current.currentTime = 0;
    }
  }, [gameState, unlockAllAudio]);

  const getLevelData = (s) => {
    if (s < 10) return { level: 1, name: "Beginner", speed: 2.0, spawnRate: 1000, color: "text-sky-300" };
    if (s < 20) return { level: 2, name: "Novice", speed: 1.7, spawnRate: 850, color: "text-green-300" };
    if (s < 30) return { level: 3, name: "Rookie", speed: 1.5, spawnRate: 750, color: "text-yellow-300" };
    if (s < 40) return { level: 4, name: "Fast", speed: 1.3, spawnRate: 650, color: "text-orange-300" };
    if (s < 50) return { level: 5, name: "Expert", speed: 1.1, spawnRate: 550, color: "text-red-300" };
    if (s < 60) return { level: 6, name: "Pro", speed: 1.0, spawnRate: 480, color: "text-pink-300" };
    if (s < 70) return { level: 7, name: "Master", speed: 0.9, spawnRate: 420, color: "text-purple-300" };
    return { level: 8, name: "Grandmaster", speed: 0.8, spawnRate: 350, color: "text-indigo-300" };
  };

  const currentLevel = getLevelData(score);

  useEffect(() => {
    const thresholds = [10, 20, 30, 40, 50, 60, 70];
    if (score > 0 && thresholds.includes(score)) {
      setShowLevelUp(true);
      setTimeout(() => setShowLevelUp(false), 2000);
    }
  }, [score]);

  const startGame = (letterKey) => {
    setSelectedLetterKey(letterKey);
    setScore(0);
    setLives(3);
    setElements([]);
    setFloatingTexts([]);
    setGameState('playing');
  };

  const backToMenu = () => {
    setGameState('menu');
    setSelectedLetterKey(null);
  };

  useEffect(() => {
    if (gameState !== 'playing' || !currentLetter) return;
    const spawnInterval = setInterval(() => {
      setElements((prev) => {
        const id = Date.now() + Math.random();
        const shape = currentLetter.shapes[Math.floor(Math.random() * currentLetter.shapes.length)];
        if (currentLetter.mode === 'whack') {
          const holeIndex = Math.floor(Math.random() * 9);
          if (prev.find(e => e.holeIndex === holeIndex)) return prev;
          return [...prev, { id, holeIndex, shape, type: 'whack' }];
        } else if (currentLetter.mode === 'runner') {
          return [...prev, { id, top: Math.floor(Math.random() * 70) + 15, shape, duration: currentLevel.speed * 1.5, type: 'runner' }];
        } else if (currentLetter.mode === 'lantern') {
          return [...prev, { id, left: Math.floor(Math.random() * 80) + 10, shape, duration: currentLevel.speed * 1.8, type: 'lantern' }];
        } else {
          return [...prev, { id, left: Math.floor(Math.random() * 80) + 10, shape, duration: currentLevel.speed, type: 'rain' }];
        }
      });

      if (currentLetter.mode === 'whack') {
        const idToClear = Date.now();
        setTimeout(() => {
          setElements(prev => {
            const el = prev.find(e => e.type === 'whack' && e.id < idToClear + 100);
            if (el) handleMiss(el.id);
            return prev;
          });
        }, currentLevel.speed * 1200);
      }
    }, currentLevel.spawnRate);
    return () => clearInterval(spawnInterval);
  }, [gameState, score, selectedLetterKey, currentLevel.spawnRate, currentLevel.speed]);

  const handleCatch = (id, clientX, clientY) => {
    if (gameState !== 'playing') return;
    
    // Instant Trigger from Cache
    const sounds = currentLetter.sounds;
    const randomSound = sounds[Math.floor(Math.random() * sounds.length)];
    const cachedAudio = audioRefs.current[randomSound];
    if (cachedAudio) {
      const playInstance = cachedAudio.cloneNode();
      playInstance.play().catch(() => {});
    }

    setElements((prev) => prev.filter((l) => l.id !== id));
    setScore((prev) => prev + 1);
    const newFloatingText = { id: Date.now(), x: clientX, y: clientY };
    setFloatingTexts((prev) => [...prev, newFloatingText]);
    setTimeout(() => {
      setFloatingTexts((prev) => prev.filter((t) => t.id !== newFloatingText.id));
    }, 800);
  };

  const handleMiss = (id) => {
    if (gameState !== 'playing') return;
    setElements((prev) => {
      const exists = prev.find(l => l.id === id);
      if (!exists) return prev;
      setLives((l) => {
        const newLives = l - 1;
        if (newLives <= 0) {
          setGameState('gameover');
          setScores(prevScores => {
            const currentBest = prevScores[selectedLetterKey] || 0;
            if (score > currentBest) {
              const nextScores = { ...prevScores, [selectedLetterKey]: score };
              localStorage.setItem('alphabetMasterScores', JSON.stringify(nextScores));
              return nextScores;
            }
            return prevScores;
          });
        }
        return newLives;
      });
      return prev.filter((l) => l.id !== id);
    });
  };

  return (
    <div className="relative w-full h-screen overflow-hidden font-sans touch-none select-none transition-all duration-1000 bg-[#F5F5DC]">
      
      <style>
        {`
          @keyframes fall { 0% { transform: translateY(-120px); } 100% { transform: translateY(115vh); } }
          @keyframes popOut { 0% { transform: scale(1); opacity: 1; } 100% { transform: scale(2); opacity: 0; } }
          @keyframes slideUp { 0% { transform: translateY(40px); opacity: 0; } 20% { transform: translateY(0); opacity: 1; } 80% { transform: translateY(0); opacity: 1; } 100% { transform: translateY(-40px); opacity: 0; } }
          @keyframes rotateShamsa { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          @keyframes hitPulse { 0% { transform: scale(1); } 50% { transform: scale(1.15); } 100% { transform: scale(1); } }
          @keyframes whackUp { 0% { transform: translateY(100%); } 15% { transform: translateY(-25%); } 85% { transform: translateY(-25%); } 100% { transform: translateY(100%); } }
          @keyframes runLeft { 0% { transform: translateX(100vw); } 100% { transform: translateX(-150px); } }
          @keyframes floatUp { 0% { transform: translateY(100vh) scale(0.8); } 100% { transform: translateY(-150px) scale(1.2); } }
          .letter-fall { animation: fall linear forwards; }
          .score-float { animation: popOut 0.8s ease-out forwards; }
          .level-up-banner { animation: slideUp 2s ease-in-out forwards; }
          .letter-whack { animation: whackUp ease-in-out forwards; }
          .letter-run { animation: runLeft linear forwards; }
          .letter-float { animation: floatUp linear forwards; }
          .arabic-font { font-family: 'Amiri', serif; }
          .shamsa-medallion {
            background: radial-gradient(circle, #800000 10%, #008080 30%, #40E0D0 50%, transparent 70%);
            border: 4px solid #D4AF37;
            box-shadow: 0 0 50px rgba(212, 175, 55, 0.4);
          }
          .ultra-sensitive-hitbox { padding: 4rem; margin: -4rem; }
          .dune-hole { background: radial-gradient(ellipse at center, rgba(0,0,0,0.4) 0%, transparent 70%); }
          .fanous-shape { clip-path: polygon(50% 0%, 100% 20%, 100% 80%, 50% 100%, 0% 80%, 0% 20%); }
          .scroll-shape { border-radius: 40px 10px 40px 10px; border-left: 10px solid #D4AF37; border-right: 10px solid #D4AF37; }
        `}
      </style>

      {/* SPLASH SCREEN (Clean portal) */}
      {gameState === 'splash' && (
        <div className="absolute inset-0 z-[500] flex flex-col items-center justify-center bg-[#F5F5DC] overflow-hidden p-6">
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.05] pointer-events-none scale-[2]">
             <div className="relative w-96 h-96 shamsa-medallion rounded-full animate-[rotateShamsa_120s_linear_infinite]" />
          </div>
          <button onClick={() => { setGameState('menu'); }} className="group relative px-24 py-12 bg-[#800000] text-[#D4AF37] text-6xl font-black rounded-[3.5rem] shadow-2xl border-4 border-[#D4AF37] z-[510] tracking-widest italic uppercase active:scale-95 transition-transform">ENTER HUB</button>
        </div>
      )}

      {/* DASHBOARD (Alphabetical) */}
      {gameState === 'menu' && (
        <div className="absolute inset-0 z-[100] flex flex-col items-center justify-start p-8 bg-[#F5F5DC] overflow-y-auto scroll-smooth pb-32">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 pointer-events-none scale-150">
             <div className="relative w-96 h-96 shamsa-medallion rounded-full animate-[rotateShamsa_120s_linear_infinite]" />
          </div>

          <div className="w-full max-w-md bg-stone-200 h-2 rounded-full mb-8 relative z-20 overflow-hidden shadow-inner flex items-center">
            <div className="h-full bg-gradient-to-r from-[#008080] to-[#40E0D0] transition-all duration-1000" style={{ width: `${(masteredCount / 28) * 100}%` }} />
            <div className="absolute right-2 text-[8px] font-black text-stone-600 uppercase tracking-tighter">{masteredCount} / 28 Mastered</div>
          </div>

          <div className="text-center mb-16 relative z-10">
            <h1 className="text-7xl font-black text-[#800000] drop-shadow-sm mb-4 tracking-tighter arabic-font">Alphabet Master</h1>
            <div className="h-1 w-48 bg-[#D4AF37] mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-4 md:grid-cols-7 gap-6 w-full max-w-5xl relative z-10">
            {ALPHABET_KEYS.map((key) => {
              const letterScore = scores[key] || 0;
              const isMastered = letterScore >= 70;
              return (
                <button key={key} onClick={() => startGame(key)} className="aspect-square bg-[#008080]/10 hover:bg-[#008080]/20 border border-[#D4AF37]/30 rounded-3xl flex flex-col items-center justify-center transition-all transform hover:scale-105 active:scale-90 group shadow-lg relative overflow-hidden">
                  {isMastered && <div className="absolute top-1 right-1 text-yellow-500 animate-bounce"><Star size={14} fill="currentColor" /></div>}
                  <span className="text-5xl font-bold text-[#800000] group-hover:text-[#40E0D0] transition-colors arabic-font drop-shadow-sm uppercase">{LETTER_CONFIG[key].char}</span>
                  <span className="text-[9px] text-stone-500 uppercase mt-2 font-black tracking-widest">{key}</span>
                </button>
              );
            })}
          </div>
          <div className="h-[60vh] w-full shrink-0" />
        </div>
      )}

      {/* GAMEPLAY ENGINE */}
      {gameState === 'playing' && (
        <div className={`absolute inset-0 bg-gradient-to-br ${currentLetter?.bg}`}>
          <button onClick={backToMenu} className="absolute top-8 left-8 z-[110] bg-white/10 p-4 rounded-3xl text-white backdrop-blur-lg border border-white/20">
            <ChevronLeft size={28} />
          </button>
          
          <div className="absolute top-8 right-8 flex flex-col items-end gap-3 z-50 pointer-events-none">
            <div className="bg-white/95 px-6 py-3 rounded-full shadow-2xl flex items-center gap-3">
              <Star className="text-amber-500 fill-amber-500 w-8 h-8" />
              <span className="text-3xl font-black text-slate-800 tracking-tighter">{score}</span>
            </div>
            <div className="flex gap-1.5">
              {[...Array(3)].map((_, i) => (
                <Heart key={i} className={`w-8 h-8 ${i < lives ? 'text-red-500 fill-red-500' : 'text-white/20'}`} />
              ))}
            </div>
          </div>

          {/* ENGINE: SAND WHACK (Exaggerated & Fully Visible) */}
          {currentLetter.mode === 'whack' && (
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <div className="grid grid-cols-3 grid-rows-3 gap-10 w-full max-w-lg aspect-square overflow-visible">
                {[...Array(9)].map((_, i) => {
                  const el = elements.find(e => e.holeIndex === i);
                  return (
                    <div key={i} className="relative w-full h-full dune-hole rounded-full flex items-end justify-center border-b-4 border-white/20 overflow-visible">
                      {el && (
                        <button
                          onPointerDown={(e) => handleCatch(el.id, e.clientX, e.clientY)}
                          style={{ animationDuration: `${currentLevel.speed * 0.9}s` }}
                          className="letter-whack relative w-full h-full bg-white rounded-t-[2rem] shadow-2xl flex items-center justify-center ultra-sensitive-hitbox outline-none touch-none active:scale-95"
                        >
                          <span className={`text-8xl font-black ${currentLetter.accent} arabic-font`}>{el.shape}</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ENGINE: RAIN */}
          {currentLetter.mode === 'rain' && (
            <div className="absolute inset-0">
              {elements.map((l) => (
                <button key={l.id} onPointerDown={(e) => handleCatch(l.id, e.clientX, e.clientY)} onAnimationEnd={() => handleMiss(l.id)} style={{ left: `${l.left}%`, animationDuration: `${l.duration}s` }} className="letter-fall absolute cursor-pointer ultra-sensitive-hitbox outline-none touch-none z-10">
                  <div className="w-24 h-24 bg-white rounded-[2rem] shadow-2xl flex items-center justify-center border-b-8 border-slate-200 transition-transform active:scale-90 active:animate-[hitPulse_0.2s_ease-out]">
                    <span className={`text-7xl font-bold ${currentLetter.accent} arabic-font`}>{l.shape}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* ENGINE: RUNNER */}
          {currentLetter.mode === 'runner' && (
            <div className="absolute inset-0">
              {elements.map((l) => (
                <button key={l.id} onPointerDown={(e) => handleCatch(l.id, e.clientX, e.clientY)} onAnimationEnd={() => handleMiss(l.id)} style={{ top: `${l.top}%`, animationDuration: `${l.duration}s` }} className="letter-run absolute cursor-pointer ultra-sensitive-hitbox outline-none touch-none z-10">
                  <div className="w-24 h-32 bg-[#FDF5E6] scroll-shape shadow-2xl flex items-center justify-center transition-transform active:scale-90 active:animate-[hitPulse_0.2s_ease-out]">
                    <span className={`text-7xl font-bold ${currentLetter.accent} arabic-font`}>{l.shape}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* ENGINE: LANTERN */}
          {currentLetter.mode === 'lantern' && (
            <div className="absolute inset-0">
              {elements.map((l) => (
                <button key={l.id} onPointerDown={(e) => handleCatch(l.id, e.clientX, e.clientY)} onAnimationEnd={() => handleMiss(l.id)} style={{ left: `${l.left}%`, animationDuration: `${l.duration}s` }} className="letter-float absolute cursor-pointer ultra-sensitive-hitbox outline-none touch-none z-10">
                  <div className="w-24 h-36 bg-white/90 fanous-shape shadow-2xl flex flex-col items-center justify-center border-t-8 border-yellow-500 transition-transform active:scale-90 active:animate-[hitPulse_0.2s_ease-out]">
                    <span className={`text-7xl font-bold ${currentLetter.accent} arabic-font`}>{l.shape}</span>
                    <div className="w-3 h-6 bg-yellow-500 rounded-t-full mt-2" />
                  </div>
                </button>
              ))}
            </div>
          )}

          {floatingTexts.map((t) => (
            <div key={t.id} className="score-float absolute pointer-events-none text-5xl font-black text-white z-20" style={{ left: t.x - 20, top: t.y - 40 }}>+1</div>
          ))}
        </div>
      )}

      {/* GAME OVER */}
      {gameState === 'gameover' && (
        <div className="absolute inset-0 z-[600] flex items-center justify-center bg-black/95 backdrop-blur-3xl p-6">
          <div className="bg-white p-12 rounded-[3.5rem] text-center max-w-sm w-full shadow-[0_20px_60px_rgba(0,0,0,0.8)] border-b-[12px] border-slate-200">
            <h2 className="text-5xl font-black text-slate-800 mb-6 tracking-tighter italic uppercase">GAME OVER</h2>
            <div className="bg-slate-50 p-8 rounded-[2.5rem] mb-10 shadow-inner">
              <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] mb-2">Final Score</p>
              <p className="text-7xl font-black text-slate-900 leading-none">{score}</p>
              <div className="h-px bg-slate-200 w-full my-6" />
              <p className="flex justify-center items-center gap-2 text-slate-500 font-bold"><Trophy size={18} className="text-amber-500 fill-amber-500" />Letter Best: {scores[selectedLetterKey] || score}</p>
            </div>
            <button onClick={() => startGame(selectedLetterKey)} className="w-full bg-slate-900 hover:bg-black text-white py-6 rounded-3xl text-2xl font-black shadow-xl transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-3 mb-4"><RotateCcw size={24} /> TRY AGAIN</button>
            <button onClick={backToMenu} className="w-full text-slate-400 font-black uppercase tracking-widest text-[10px] hover:text-slate-600 transition-colors">Return to Menu</button>
          </div>
        </div>
      )}

      {/* BRANDING LOGO (Ghost Watermark) */}
      <div className={`absolute bottom-8 left-8 z-[1000] transition-all duration-500 ${gameState === 'playing' ? 'opacity-[0.01] pointer-events-none' : 'opacity-[0.05]'}`}>
        <a href="https://api.whatsapp.com/send/?phone=201554712241&text&type=phone_number&app_absent=0" target="_blank" rel="noopener noreferrer">
          <img src="/logo.png" className="w-24 h-auto mb-2 contrast-125 hover:scale-105 transition-transform" />
        </a>
        <p className="text-stone-800 text-[10px] font-black tracking-[0.4em] uppercase">by <span className="font-bold">FarisAura</span></p>
      </div>

    </div>
  );
};

export default App;
