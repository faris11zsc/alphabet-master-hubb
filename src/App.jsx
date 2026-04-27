import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, RotateCcw, Heart, Star, Trophy, Zap, ChevronLeft } from 'lucide-react';

// ==========================================
// ENHANCED ALPHABET CONFIGURATION
// ==========================================
const LETTER_CONFIG = {
  'hamza': { char: 'أ', shapes: ['أ', 'ـأ', 'إ'], sounds: ['ءا.m4a', 'ءو.m4a', 'ءي.m4a'], bg: "from-sky-500 via-blue-600 to-indigo-800", accent: "text-blue-600", border: "border-blue-200" },
  'ba': { char: 'ب', shapes: ['بـ', 'ـبـ', 'ـب'], sounds: ['ب.m4a', 'بو.m4a', 'بي.m4a'], bg: "from-emerald-500 via-green-600 to-teal-800", accent: "text-green-600", border: "border-green-200" },
  'ta': { char: 'ت', shapes: ['تـ', 'ـتـ', 'ـت'], sounds: ['تا.m4a', 'تو.m4a', 'تي.m4a'], bg: "from-rose-500 via-red-600 to-orange-700", accent: "text-red-600", border: "border-red-200" },
  'tha': { char: 'ث', shapes: ['ثـ', 'ـثـ', 'ـث'], sounds: ['ثا.m4a', 'ثو.m4a', 'ثي.m4a'], bg: "from-purple-500 via-indigo-600 to-violet-900", accent: "text-indigo-600", border: "border-indigo-200" },
  'jeem': { char: 'ج', shapes: ['جـ', 'ـجـ', 'ـج'], sounds: ['جا.m4a', 'جو.m4a', 'جي.m4a'], bg: "from-orange-500 via-amber-600 to-yellow-800", accent: "text-amber-600", border: "border-amber-200" },
  'haa': { char: 'ح', shapes: ['حـ', 'ـحـ', 'ـح'], sounds: ['حا.m4a', 'حو.m4a', 'حي.m4a'], bg: "from-teal-500 via-cyan-600 to-blue-700", accent: "text-cyan-600", border: "border-cyan-200" },
  'kha': { char: 'خ', shapes: ['خـ', 'ـخـ', 'ـخ'], sounds: ['خا.m4a', 'خو.m4a', 'خي.m4a'], bg: "from-slate-700 via-slate-800 to-black", accent: "text-slate-800", border: "border-slate-400" },
  'dal': { char: 'د', shapes: ['د', 'ـد', 'د'], sounds: ['دا.m4a', 'دو.m4a', 'دي.m4a'], bg: "from-red-500 via-rose-600 to-pink-800", accent: "text-rose-600", border: "border-rose-200" },
  'thal': { char: 'ذ', shapes: ['ذ', 'ـذ', 'ذ'], sounds: ['ذا.m4a', 'ذو.m4a', 'ذي.m4a'], bg: "from-yellow-400 via-orange-500 to-amber-700", accent: "text-orange-700", border: "border-orange-200" },
  'raa': { char: 'ر', shapes: ['ر', 'ـر', 'ر'], sounds: ['را.m4a', 'رو.m4a', 'ري.m4a'], bg: "from-lime-500 via-green-600 to-emerald-800", accent: "text-green-700", border: "border-green-200" },
  'zay': { char: 'ز', shapes: ['ز', 'ـز', 'ز'], sounds: ['زا.m4a', 'زو.m4a', 'زي.m4a'], bg: "from-green-500 via-teal-600 to-cyan-900", accent: "text-teal-800", border: "border-teal-200" },
  'seen': { char: 'س', shapes: ['سـ', 'ـسـ', 'ـس'], sounds: ['س.m4a', 'سو.m4a', 'سي.m4a'], bg: "from-blue-500 via-indigo-600 to-violet-800", accent: "text-indigo-700", border: "border-indigo-200" },
  'sheen': { char: 'ش', shapes: ['شـ', 'ـشـ', 'ـش'], sounds: ['شا.m4a', 'شو.m4a', 'شي.m4a'], bg: "from-violet-500 via-purple-600 to-fuchsia-900", accent: "text-purple-700", border: "border-purple-200" },
  'sad': { char: 'ص', shapes: ['صـ', 'ـصـ', 'ـص'], sounds: ['صا.m4a', 'صو.m4a', 'صي.m4a'], bg: "from-stone-500 via-stone-700 to-black", accent: "text-stone-700", border: "border-stone-400" },
  'dad': { char: 'ض', shapes: ['ضـ', 'ـضـ', 'ـض'], sounds: ['ضا.m4a', 'ضو.m4a', 'ضي.m4a'], bg: "from-emerald-600 via-green-800 to-black", accent: "text-green-900", border: "border-green-400" },
  'taa': { char: 'ط', shapes: ['طـ', 'ـطـ', 'ـط'], sounds: ['طا.m4a', 'طو.m4a', 'طي.m4a'], bg: "from-amber-600 via-orange-700 to-red-900", accent: "text-orange-900", border: "border-orange-400" },
  'zaa': { char: 'ظ', shapes: ['ظـ', 'ـظـ', 'ـظ'], sounds: ['ظا.m4a', 'ظو.m4a', 'ظي.m4a'], bg: "from-orange-800 via-stone-800 to-black", accent: "text-stone-900", border: "border-stone-500" },
  'ayn': { char: 'ع', shapes: ['عـ', 'ـعـ', 'ـع'], sounds: ['عا.m4a', 'عو.m4a', 'عي.m4a'], bg: "from-sky-600 via-blue-700 to-indigo-900", accent: "text-blue-900", border: "border-blue-300" },
  'ghayn': { char: 'غ', shapes: ['غـ', 'ـغـ', 'ـغ'], sounds: ['غا.m4a', 'غو.m4a', 'غي.m4a'], bg: "from-indigo-500 via-purple-700 to-black", accent: "text-purple-900", border: "border-purple-300" },
  'faa': { char: 'ف', shapes: ['فـ', 'ـفـ', 'ـف'], sounds: ['ف.m4a', 'فو.m4a', 'في.m4a'], bg: "from-pink-500 via-rose-600 to-red-800", accent: "text-rose-700", border: "border-rose-300" },
  'qaf': { char: 'ق', shapes: ['قـ', 'ـقـ', 'ـق'], sounds: ['ققا.m4a', 'قو.m4a', 'قي.m4a'], bg: "from-red-700 via-red-900 to-black", accent: "text-red-900", border: "border-red-500" },
  'kaf': { char: 'ك', shapes: ['كـ', 'ـكـ', 'ـك'], sounds: ['كا.m4a', 'كو.m4a', 'كي.m4a'], bg: "from-blue-400 via-blue-500 to-sky-700", accent: "text-blue-700", border: "border-blue-200" },
  'lam': { char: 'ل', shapes: ['لـ', 'ـلـ', 'ـل'], sounds: ['لا.m4a', 'لو.m4a', 'لي.m4a'], bg: "from-cyan-500 via-blue-500 to-indigo-700", accent: "text-blue-600", border: "border-cyan-200" },
  'meem': { char: 'م', shapes: ['مـ', 'ـمـ', 'ـم'], sounds: ['ما.m4a', 'مو.m4a', 'مي.m4a'], bg: "from-violet-600 via-fuchsia-700 to-purple-900", accent: "text-fuchsia-800", border: "border-fuchsia-200" },
  'noon': { char: 'ن', shapes: ['نـ', 'ـنـ', 'ـن'], sounds: ['نا.m4a', 'نو.m4a', 'ني.m4a'], bg: "from-green-500 via-emerald-700 to-teal-900", accent: "text-emerald-800", border: "border-emerald-200" },
  'haa2': { char: 'ه', shapes: ['هـ', 'ـهـ', 'ـه'], sounds: ['ها.m4a', 'هو.m4a', 'هي.m4a'], bg: "from-orange-400 via-yellow-500 to-amber-700", accent: "text-yellow-700", border: "border-yellow-200" },
  'waw': { char: 'و', shapes: ['و', 'ـو', 'و'], sounds: ['وا.m4a', 'وو.m4a', 'وي.m4a'], bg: "from-blue-700 via-indigo-900 to-black", accent: "text-indigo-800", border: "border-indigo-400" },
  'yaa': { char: 'ي', shapes: ['يـ', 'ـيـ', 'ـي'], sounds: ['ي.m4a', 'يو.m4a', 'يي.m4a'], bg: "from-teal-400 via-teal-600 to-emerald-800", accent: "text-teal-800", border: "border-teal-200" },
};

const App = () => {
  const [selectedLetterKey, setSelectedLetterKey] = useState(null);
  const [gameState, setGameState] = useState('menu');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [fallingLetters, setFallingLetters] = useState([]);
  const [floatingTexts, setFloatingTexts] = useState([]);
  const [showLevelUp, setShowLevelUp] = useState(false);

  const [highScore, setHighScore] = useState(() => {
    try {
      const saved = localStorage.getItem('alphabetHighScore');
      return saved ? parseInt(saved, 10) : 0;
    } catch (e) { return 0; }
  });

  const audioRefs = useRef([]);
  const bgMusicRef = useRef(null);
  const currentLetter = selectedLetterKey ? LETTER_CONFIG[selectedLetterKey] : null;

  // Setup Dashboard Background Music
  useEffect(() => {
    bgMusicRef.current = new Audio('/audio/abc_song.mp3');
    bgMusicRef.current.loop = true;
    
    // Attempt play on mount (usually fails due to browser policy)
    if (gameState === 'menu') {
      bgMusicRef.current.play().catch(() => {});
    }

    return () => {
      bgMusicRef.current?.pause();
    };
  }, []);

  // Control Music based on state
  useEffect(() => {
    if (gameState === 'menu') {
      bgMusicRef.current?.play().catch(() => {});
    } else {
      bgMusicRef.current?.pause();
      if (bgMusicRef.current) bgMusicRef.current.currentTime = 0;
    }
  }, [gameState]);

  // Global click handler to trigger music (bypasses browser autoplay block)
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (gameState === 'menu' && bgMusicRef.current?.paused) {
        bgMusicRef.current.play().catch(() => {});
      }
    };
    window.addEventListener('click', handleFirstInteraction);
    return () => window.removeEventListener('click', handleFirstInteraction);
  }, [gameState]);

  // Setup Audio for the selected letter
  useEffect(() => {
    if (currentLetter) {
      audioRefs.current = currentLetter.sounds.map(filename => {
        const audio = new Audio(`/audio/${filename}`);
        audio.preload = "auto";
        return audio;
      });
    }
  }, [selectedLetterKey]);

  // Level thresholds (10-tier logic)
  const getLevelData = (s) => {
    if (s < 10) return { level: 1, name: "Beginner", speed: 2.5, spawnRate: 1000, color: "text-sky-300" };
    if (s < 20) return { level: 2, name: "Novice", speed: 2.2, spawnRate: 850, color: "text-green-300" };
    if (s < 30) return { level: 3, name: "Rookie", speed: 2.0, spawnRate: 750, color: "text-yellow-300" };
    if (s < 40) return { level: 4, name: "Fast", speed: 1.8, spawnRate: 650, color: "text-orange-300" };
    if (s < 50) return { level: 5, name: "Expert", speed: 1.6, spawnRate: 550, color: "text-red-300" };
    if (s < 60) return { level: 6, name: "Pro", speed: 1.4, spawnRate: 480, color: "text-pink-300" };
    if (s < 70) return { level: 7, name: "Master", speed: 1.2, spawnRate: 420, color: "text-purple-300" };
    if (s < 80) return { level: 8, name: "Grandmaster", speed: 1.0, spawnRate: 380, color: "text-indigo-300" };
    if (s < 90) return { level: 9, name: "Epic", speed: 0.9, spawnRate: 340, color: "text-cyan-300" };
    return { level: 10, name: "Impossible", speed: 0.8, spawnRate: 300, color: "text-white" };
  };

  const currentLevel = getLevelData(score);

  // Trigger level up animation
  useEffect(() => {
    const thresholds = [10, 20, 30, 40, 50, 60, 70, 80, 90];
    if (score > 0 && thresholds.includes(score)) {
      setShowLevelUp(true);
      setTimeout(() => setShowLevelUp(false), 2000);
    }
  }, [score]);

  const unlockAudioEngine = useCallback(() => {
    audioRefs.current.forEach(audio => {
      audio.muted = true;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          audio.pause();
          audio.currentTime = 0;
          audio.muted = false;
        }).catch(() => {});
      }
    });
  }, []);

  const playRandomSound = useCallback(() => {
    if (audioRefs.current.length > 0) {
      const randomIndex = Math.floor(Math.random() * audioRefs.current.length);
      const playInstance = audioRefs.current[randomIndex].cloneNode();
      playInstance.muted = false;
      playInstance.play().catch(e => console.warn("Audio blocked", e));
    }
  }, []);

  const startGame = (letterKey) => {
    setSelectedLetterKey(letterKey);
    setScore(0);
    setLives(3);
    setFallingLetters([]);
    setFloatingTexts([]);
    setGameState('playing');
    unlockAudioEngine();
  };

  const backToMenu = () => {
    setGameState('menu');
    setSelectedLetterKey(null);
  };

  useEffect(() => {
    if (gameState !== 'playing') return;
    const spawnInterval = setInterval(() => {
      setFallingLetters((prev) => [
        ...prev,
        {
          id: Date.now() + Math.random(),
          left: Math.floor(Math.random() * 80) + 10,
          duration: currentLevel.speed,
          shape: currentLetter.shapes[Math.floor(Math.random() * currentLetter.shapes.length)]
        },
      ]);
    }, currentLevel.spawnRate);
    return () => clearInterval(spawnInterval);
  }, [gameState, score, selectedLetterKey, currentLevel.spawnRate]);

  const handleCatch = (id, clientX, clientY) => {
    if (gameState !== 'playing') return;
    playRandomSound();
    setFallingLetters((prev) => prev.filter((l) => l.id !== id));
    setScore((prev) => prev + 1);
    const newFloatingText = { id: Date.now(), x: clientX, y: clientY };
    setFloatingTexts((prev) => [...prev, newFloatingText]);
    setTimeout(() => {
      setFloatingTexts((prev) => prev.filter((t) => t.id !== newFloatingText.id));
    }, 800);
  };

  const handleMiss = (id) => {
    if (gameState !== 'playing') return;
    setFallingLetters((prev) => prev.filter((l) => l.id !== id));
    setLives((prev) => {
      const newLives = prev - 1;
      if (newLives <= 0) {
        setGameState('gameover');
        if (score > highScore) {
          setHighScore(score);
          localStorage.setItem('alphabetHighScore', score.toString());
        }
      }
      return newLives;
    });
  };

  return (
    <div className={`relative w-full h-screen overflow-hidden font-sans touch-none select-none transition-all duration-1000 bg-gradient-to-br ${currentLetter ? currentLetter.bg : 'from-slate-900 via-slate-800 to-black'}`}>
      
      <style>
        {`
          @keyframes fall { 0% { transform: translateY(-120px) rotate(0deg); } 100% { transform: translateY(115vh) rotate(10deg); } }
          @keyframes popOut { 0% { transform: scale(1) translateY(0); opacity: 1; } 100% { transform: scale(1.8) translateY(-50px); opacity: 0; } }
          @keyframes slideUp { 0% { transform: translateY(40px) scale(0.9); opacity: 0; } 20% { transform: translateY(0) scale(1); opacity: 1; } 80% { transform: translateY(0) scale(1); opacity: 1; } 100% { transform: translateY(-40px) scale(1.1); opacity: 0; } }
          .letter-fall { animation: fall linear forwards; }
          .score-float { animation: popOut 0.8s ease-out forwards; }
          .level-up-banner { animation: slideUp 2s ease-in-out forwards; }
          .arabic-font { font-family: 'Amiri', serif; }
        `}
      </style>

      {/* MENU SCREEN */}
      {gameState === 'menu' && (
        <div className="absolute inset-0 z-[100] flex flex-col items-center justify-start bg-black/40 backdrop-blur-xl p-8 overflow-y-auto pb-24">
          <div className="text-center mb-12 mt-12">
            <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-500 drop-shadow-2xl mb-3 tracking-tighter">ALPHABET MASTER</h1>
            <p className="text-white/40 font-bold tracking-[0.3em] uppercase text-sm">Select Your Letter</p>
          </div>

          <div className="grid grid-cols-4 md:grid-cols-7 gap-5 w-full max-w-5xl">
            {Object.keys(LETTER_CONFIG).map((key) => (
              <button
                key={key}
                onClick={() => startGame(key)}
                className="aspect-square bg-white/5 hover:bg-white/15 border border-white/10 rounded-3xl flex flex-col items-center justify-center transition-all transform hover:scale-105 active:scale-90 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="text-5xl font-bold text-white group-hover:text-amber-400 transition-colors arabic-font drop-shadow-md relative z-10">
                  {LETTER_CONFIG[key].char}
                </span>
                <span className="text-[9px] text-white/30 uppercase mt-2 font-black tracking-widest relative z-10">{key}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* GAMEPLAY UI */}
      {gameState === 'playing' && (
        <>
          <button onClick={backToMenu} className="absolute top-8 left-8 z-[110] bg-white/10 hover:bg-white/30 p-4 rounded-3xl text-white transition-all backdrop-blur-lg border border-white/20">
            <ChevronLeft size={28} />
          </button>
          
          <div className="absolute top-8 right-8 flex flex-col items-end gap-3 z-50 pointer-events-none">
            <div className="bg-white/95 backdrop-blur-xl px-6 py-3 rounded-[2rem] shadow-2xl flex items-center gap-3 border-b-4 border-black/10">
              <Star className="text-amber-500 fill-amber-500 w-8 h-8 animate-pulse" />
              <span className="text-3xl font-black text-slate-800 tracking-tighter">{score}</span>
            </div>
            
            <div className="flex flex-col items-end gap-1">
              <div className="flex gap-1.5">
                {[...Array(3)].map((_, i) => (
                  <Heart key={i} className={`w-8 h-8 transition-all duration-500 ${i < lives ? 'text-red-500 fill-red-500 drop-shadow-md scale-110' : 'text-white/20 opacity-20'}`} />
                ))}
              </div>
              <div className={`text-xs font-black uppercase tracking-widest ${currentLevel.color} drop-shadow-sm`}>
                {currentLevel.name}
              </div>
            </div>
          </div>

          {/* LEVEL UP BANNER (Pointer Events None) */}
          {showLevelUp && (
            <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
              <div className="level-up-banner flex flex-col items-center text-center">
                <div className="text-white/20 font-black text-9xl italic uppercase absolute -top-12 opacity-10">LEVEL {currentLevel.level}</div>
                <h2 className="text-7xl md:text-9xl font-black text-white drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] tracking-tighter">
                  LEVEL {currentLevel.level}
                </h2>
                <div className={`mt-2 px-8 py-2 rounded-full border-2 border-white/20 bg-white/10 backdrop-blur-sm text-2xl font-black uppercase tracking-[0.4em] ${currentLevel.color}`}>
                  {currentLevel.name}
                </div>
              </div>
            </div>
          )}

          <div className="absolute inset-0">
            {fallingLetters.map((l) => (
              <button
                key={l.id}
                onPointerDown={(e) => handleCatch(l.id, e.clientX, e.clientY)}
                onAnimationEnd={() => handleMiss(l.id)}
                style={{ left: `${l.left}%`, animationDuration: `${l.duration}s` }}
                className="letter-fall absolute cursor-pointer p-10 -ml-10 outline-none touch-none z-10 group"
              >
                <div className={`w-24 h-24 bg-white rounded-[2rem] shadow-[0_15px_30px_rgba(0,0,0,0.3)] flex items-center justify-center border-b-8 border-slate-200 transition-transform active:scale-75 group-hover:border-slate-300`}>
                  <span className={`text-6xl font-bold ${currentLetter.accent} arabic-font drop-shadow-sm`}>{l.shape}</span>
                </div>
              </button>
            ))}
          </div>

          {floatingTexts.map((t) => (
            <div key={t.id} className="score-float absolute pointer-events-none text-5xl font-black text-white z-20" style={{ left: t.x - 20, top: t.y - 40 }}>+1</div>
          ))}
        </>
      )}

      {/* GAME OVER */}
      {gameState === 'gameover' && (
        <div className="absolute inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-2xl p-6">
          <div className="bg-white p-12 rounded-[3.5rem] text-center max-w-sm w-full shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-b-[12px] border-slate-200">
            <h2 className="text-5xl font-black text-slate-800 mb-6 tracking-tighter italic">GAME OVER</h2>
            <div className="bg-slate-50 p-8 rounded-[2.5rem] mb-10 shadow-inner">
              <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] mb-2">Final Score</p>
              <p className="text-7xl font-black text-slate-900 leading-none">{score}</p>
              <div className="h-px bg-slate-200 w-full my-6" />
              <p className="flex justify-center items-center gap-2 text-slate-500 font-bold">
                <Trophy size={18} className="text-amber-500 fill-amber-500" />
                Best: {highScore}
              </p>
            </div>
            <button onClick={() => startGame(selectedLetterKey)} className="w-full bg-slate-900 hover:bg-black text-white py-6 rounded-3xl text-2xl font-black shadow-xl transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-3">
              <RotateCcw size={24} /> TRY AGAIN
            </button>
            <button onClick={backToMenu} className="mt-6 text-slate-400 font-black uppercase tracking-widest text-xs hover:text-slate-600 transition-colors">Return to Menu</button>
          </div>
        </div>
      )}

      {/* WATERMARK BRANDING */}
      <div className={`absolute bottom-8 left-8 z-[250] transition-all duration-500 ${gameState === 'menu' ? 'opacity-60' : 'opacity-20 pointer-events-none'}`}>
        {gameState === 'menu' ? (
          <a href="https://wa.me/201554712241" target="_blank" rel="noopener noreferrer" className="cursor-pointer group">
            <img src="/logo.png" alt="LightKnight Logo" className="w-24 h-auto mb-2 drop-shadow-xl contrast-125 group-hover:scale-110 transition-transform" />
          </a>
        ) : (
          <img src="/logo.png" alt="LightKnight Logo" className="w-24 h-auto mb-2 drop-shadow-xl contrast-125" />
        )}
        <p className="text-white/60 text-[10px] font-black tracking-[0.4em] uppercase drop-shadow-md">
          by <span className="text-white">FarisAura</span>
        </p>
      </div>

    </div>
  );
};

export default App;
