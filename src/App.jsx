import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, RotateCcw, Heart, Star, Trophy, Zap, ChevronLeft } from 'lucide-react';

// ==========================================
// ENHANCED ALPHABET CONFIGURATION
// ==========================================
const LETTER_CONFIG = {
  'hamza': { char: 'أ', shapes: ['أ', 'ـأ', 'إ'], sounds: ['ءا.m4a', 'ءو.m4a', 'ءي.m4a'], bg: "from-sky-700 via-blue-800 to-indigo-950", accent: "text-blue-600" },
  'ba': { char: 'ب', shapes: ['بـ', 'ـبـ', 'ـب'], sounds: ['ب.m4a', 'بو.m4a', 'بي.m4a'], bg: "from-emerald-700 via-green-800 to-teal-950", accent: "text-green-600" },
  'ta': { char: 'ت', shapes: ['تـ', 'ـتـ', 'ـت'], sounds: ['تا.m4a', 'تو.m4a', 'تي.m4a'], bg: "from-rose-700 via-red-800 to-orange-950", accent: "text-red-600" },
  'tha': { char: 'ث', shapes: ['ثـ', 'ـثـ', 'ـث'], sounds: ['ثا.m4a', 'ثو.m4a', 'ثي.m4a'], bg: "from-purple-700 via-indigo-800 to-black", accent: "text-indigo-600" },
  'jeem': { char: 'ج', shapes: ['جـ', 'ـجـ', 'ـج'], sounds: ['جا.m4a', 'جو.m4a', 'جي.m4a'], bg: "from-orange-700 via-amber-800 to-yellow-950", accent: "text-amber-600" },
  'haa': { char: 'ح', shapes: ['حـ', 'ـحـ', 'ـح'], sounds: ['حا.m4a', 'حو.m4a', 'حي.m4a'], bg: "from-teal-700 via-cyan-800 to-blue-900", accent: "text-cyan-600" },
  'kha': { char: 'خ', shapes: ['خـ', 'ـخـ', 'ـخ'], sounds: ['خا.m4a', 'خو.m4a', 'خي.m4a'], bg: "from-slate-800 via-slate-900 to-black", accent: "text-slate-800" },
  'dal': { char: 'د', shapes: ['د', 'ـد', 'د'], sounds: ['دا.m4a', 'دو.m4a', 'دي.m4a'], bg: "from-red-700 via-rose-800 to-pink-950", accent: "text-rose-600" },
  'thal': { char: 'ذ', shapes: ['ذ', 'ـذ', 'ذ'], sounds: ['ذا.m4a', 'ذو.m4a', 'ذي.m4a'], bg: "from-yellow-600 via-orange-700 to-amber-900", accent: "text-orange-700" },
  'raa': { char: 'ر', shapes: ['ر', 'ـر', 'ر'], sounds: ['را.m4a', 'رو.m4a', 'ري.m4a'], bg: "from-lime-700 via-green-800 to-emerald-950", accent: "text-green-700" },
  'zay': { char: 'ز', shapes: ['ز', 'ـز', 'ز'], sounds: ['زا.m4a', 'زو.m4a', 'زي.m4a'], bg: "from-green-700 via-teal-800 to-cyan-950", accent: "text-teal-800" },
  'seen': { char: 'س', shapes: ['سـ', 'ـسـ', 'ـس'], sounds: ['س.m4a', 'سو.m4a', 'سي.m4a'], bg: "from-blue-700 via-indigo-800 to-violet-950", accent: "text-indigo-700" },
  'sheen': { char: 'ش', shapes: ['شـ', 'ـشـ', 'ـش'], sounds: ['شا.m4a', 'شو.m4a', 'شي.m4a'], bg: "from-violet-700 via-purple-800 to-fuchsia-950", accent: "text-purple-700" },
  'sad': { char: 'ص', shapes: ['صـ', 'ـصـ', 'ـص'], sounds: ['صا.m4a', 'صو.m4a', 'صي.m4a'], bg: "from-stone-700 via-stone-900 to-black", accent: "text-stone-700" },
  'dad': { char: 'ض', shapes: ['ضـ', 'ـضـ', 'ـض'], sounds: ['ضا.m4a', 'ضو.m4a', 'ضي.m4a'], bg: "from-emerald-800 via-green-950 to-black", accent: "text-green-900" },
  'taa': { char: 'ط', shapes: ['طـ', 'ـطـ', 'ـط'], sounds: ['طا.m4a', 'طو.m4a', 'طي.m4a'], bg: "from-amber-800 via-orange-900 to-red-950", accent: "text-orange-900" },
  'zaa': { char: 'ظ', shapes: ['ظـ', 'ـظـ', 'ـظ'], sounds: ['ظا.m4a', 'ظو.m4a', 'ظي.m4a'], bg: "from-orange-900 via-stone-900 to-black", accent: "text-stone-900" },
  'ayn': { char: 'ع', shapes: ['عـ', 'ـعـ', 'ـع'], sounds: ['عا.m4a', 'عو.m4a', 'عي.m4a'], bg: "from-sky-700 via-blue-900 to-black", accent: "text-blue-900" },
  'ghayn': { char: 'غ', shapes: ['غـ', 'ـغـ', 'ـغ'], sounds: ['غا.m4a', 'غو.m4a', 'غي.m4a'], bg: "from-indigo-700 via-purple-900 to-black", accent: "text-purple-900" },
  'faa': { char: 'ف', shapes: ['فـ', 'ـفـ', 'ـف'], sounds: ['ف.m4a', 'فو.m4a', 'في.m4a'], bg: "from-pink-700 via-rose-900 to-black", accent: "text-rose-700" },
  'qaf': { char: 'ق', shapes: ['قـ', 'ـقـ', 'ـق'], sounds: ['ققا.m4a', 'قو.m4a', 'قي.m4a'], bg: "from-red-800 via-red-950 to-black", accent: "text-red-900" },
  'kaf': { char: 'ك', shapes: ['كـ', 'ـكـ', 'ـك'], sounds: ['كا.m4a', 'كو.m4a', 'كي.m4a'], bg: "from-blue-600 via-blue-800 to-black", accent: "text-blue-700" },
  'lam': { char: 'ل', shapes: ['لـ', 'ـلـ', 'ـل'], sounds: ['لا.m4a', 'لو.m4a', 'لي.m4a'], bg: "from-cyan-700 via-blue-800 to-black", accent: "text-blue-600" },
  'meem': { char: 'م', shapes: ['مـ', 'ـمـ', 'ـم'], sounds: ['ما.m4a', 'مو.m4a', 'مي.m4a'], bg: "from-violet-700 via-fuchsia-900 to-black", accent: "text-fuchsia-800" },
  'noon': { char: 'ن', shapes: ['نـ', 'ـنـ', 'ـن'], sounds: ['نا.m4a', 'نو.m4a', 'ني.m4a'], bg: "from-green-700 via-emerald-900 to-black", accent: "text-emerald-800" },
  'haa2': { char: 'ه', shapes: ['هـ', 'ـهـ', 'ـه'], sounds: ['ها.m4a', 'هو.m4a', 'هي.m4a'], bg: "from-orange-600 via-yellow-700 to-black", accent: "text-yellow-700" },
  'waw': { char: 'و', shapes: ['و', 'ـو', 'و'], sounds: ['وا.m4a', 'وو.m4a', 'وي.m4a'], bg: "from-blue-800 via-indigo-950 to-black", accent: "text-indigo-800" },
  'yaa': { char: 'ي', shapes: ['يـ', 'ـيـ', 'ـي'], sounds: ['ي.m4a', 'يو.m4a', 'يي.m4a'], bg: "from-teal-600 via-emerald-900 to-black", accent: "text-teal-800" },
};

const App = () => {
  const [selectedLetterKey, setSelectedLetterKey] = useState(null);
  const [gameState, setGameState] = useState('splash');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [fallingLetters, setFallingLetters] = useState([]);
  const [floatingTexts, setFloatingTexts] = useState([]);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [highScore, setHighScore] = useState(() => {
    try {
      const saved = localStorage.getItem('alphabetHighScore');
      return saved ? parseInt(saved, 10) : 0;
    } catch (e) { return 0; }
  });

  const audioRefs = useRef([]);
  const bgMusicRef = useRef(null);
  const currentLetter = selectedLetterKey ? LETTER_CONFIG[selectedLetterKey] : null;

  // Detect Device Type
  useEffect(() => {
    const checkDevice = () => setIsMobile(window.innerWidth < 768);
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // Background Music Setup
  useEffect(() => {
    bgMusicRef.current = new Audio('/audio/abc_song.mp3');
    bgMusicRef.current.loop = true;
    return () => bgMusicRef.current?.pause();
  }, []);

  useEffect(() => {
    if (gameState === 'menu') {
      bgMusicRef.current?.play().catch(() => {});
    } else {
      bgMusicRef.current?.pause();
    }
  }, [gameState]);

  // --- HARDER 8-LEVEL CAP LOGIC ---
  const getLevelData = (s) => {
    // Speed and Spawn rate cap at Level 8 (score 70-80)
    if (s < 10) return { level: 1, name: "Beginner", speed: 2.0, spawnRate: 850, color: "text-sky-300" };
    if (s < 20) return { level: 2, name: "Novice", speed: 1.7, spawnRate: 700, color: "text-green-300" };
    if (s < 30) return { level: 3, name: "Rookie", speed: 1.5, spawnRate: 600, color: "text-yellow-300" };
    if (s < 40) return { level: 4, name: "Fast", speed: 1.3, spawnRate: 500, color: "text-orange-300" };
    if (s < 50) return { level: 5, name: "Expert", speed: 1.1, spawnRate: 450, color: "text-red-300" };
    if (s < 60) return { level: 6, name: "Pro", speed: 1.0, spawnRate: 400, color: "text-pink-300" };
    if (s < 70) return { level: 7, name: "Master", speed: 0.9, spawnRate: 350, color: "text-purple-300" };
    // Level 8 and beyond use the same maximum speed
    return { level: 8, name: "Grandmaster", speed: 0.8, spawnRate: 300, color: "text-indigo-300" };
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
    setFallingLetters([]);
    setFloatingTexts([]);
    setGameState('playing');
    
    // Setup Audio for the selected letter
    const config = LETTER_CONFIG[letterKey];
    audioRefs.current = config.sounds.map(filename => {
      const audio = new Audio(`/audio/${filename}`);
      audio.preload = "auto";
      return audio;
    });
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
          shape: LETTER_CONFIG[selectedLetterKey].shapes[Math.floor(Math.random() * 3)]
        },
      ]);
    }, currentLevel.spawnRate);
    return () => clearInterval(spawnInterval);
  }, [gameState, score, selectedLetterKey, currentLevel.spawnRate]);

  const handleCatch = (id, clientX, clientY) => {
    if (gameState !== 'playing') return;
    
    if (audioRefs.current.length > 0) {
      const randomIndex = Math.floor(Math.random() * audioRefs.current.length);
      const playInstance = audioRefs.current[randomIndex].cloneNode();
      playInstance.play().catch(() => {});
    }

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
    <div className="relative w-full h-screen overflow-hidden font-sans touch-none select-none transition-all duration-1000 bg-[#F5F5DC]">
      
      <style>
        {`
          @keyframes fall { 0% { transform: translateY(-120px); } 100% { transform: translateY(115vh); } }
          @keyframes popOut { 0% { transform: scale(1); opacity: 1; } 100% { transform: scale(2); opacity: 0; } }
          @keyframes slideUp { 0% { transform: translateY(40px); opacity: 0; } 20% { transform: translateY(0); opacity: 1; } 80% { transform: translateY(0); opacity: 1; } 100% { transform: translateY(-40px); opacity: 0; } }
          @keyframes rotateShamsa { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          .letter-fall { animation: fall linear forwards; }
          .score-float { animation: popOut 0.8s ease-out forwards; }
          .level-up-banner { animation: slideUp 2s ease-in-out forwards; }
          .arabic-font { font-family: 'Amiri', serif; }
          .shamsa-medallion {
            background: radial-gradient(circle, #800000 10%, #008080 30%, #40E0D0 50%, transparent 70%);
            border: 4px solid #D4AF37;
            box-shadow: 0 0 50px rgba(212, 175, 55, 0.4);
          }
          .splash-bg { background-color: #000; background-position: center; background-size: cover; background-repeat: no-repeat; }
        `}
      </style>

      {/* SPLASH SCREEN (Optimized Loading) */}
      {gameState === 'splash' && (
        <div className="absolute inset-0 z-[500] flex flex-col items-center justify-center bg-black overflow-hidden">
          {/* Quick-loading low-res fallback or background style */}
          <div 
            className="absolute inset-0 splash-bg transition-opacity duration-1000"
            style={{ 
              backgroundImage: `url(${isMobile ? "/splash_mobile.png" : "/splash_pc.png"})`,
              opacity: 0.8
            }} 
          />
          <div className="absolute inset-0 bg-black/40" />
          <button 
            onClick={() => { setGameState('menu'); bgMusicRef.current?.play().catch(() => {}); }}
            className="group relative px-16 py-6 bg-[#800000] text-[#D4AF37] text-3xl font-black rounded-3xl shadow-[0_0_40px_rgba(128,0,0,0.6)] transition-all transform hover:scale-105 active:scale-95 border-2 border-[#D4AF37] z-[510] tracking-widest italic"
          >
            ENTER HUB
          </button>
        </div>
      )}

      {/* DASHBOARD (MENU) */}
      {gameState === 'menu' && (
        <div className="absolute inset-0 z-[100] flex flex-col items-center justify-start p-8 bg-[#F5F5DC] overflow-y-auto scroll-smooth">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 pointer-events-none scale-150">
             <div className="relative w-96 h-96 shamsa-medallion rounded-full animate-[rotateShamsa_120s_linear_infinite]" />
          </div>
          
          <div className="text-center mb-16 mt-16 relative z-10">
            <h1 className="text-7xl font-black text-[#800000] drop-shadow-sm mb-4 tracking-tighter arabic-font">Alphabet Master</h1>
            <div className="h-1 w-48 bg-[#D4AF37] mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-4 md:grid-cols-7 gap-6 w-full max-w-5xl relative z-10">
            {Object.keys(LETTER_CONFIG).map((key) => (
              <button
                key={key}
                onClick={() => startGame(key)}
                className="aspect-square bg-[#008080]/10 hover:bg-[#008080]/20 border border-[#D4AF37]/30 rounded-3xl flex flex-col items-center justify-center transition-all transform hover:scale-105 active:scale-90 group shadow-lg"
              >
                <span className="text-5xl font-bold text-[#800000] group-hover:text-[#40E0D0] transition-colors arabic-font drop-shadow-sm">
                  {LETTER_CONFIG[key].char}
                </span>
                <span className="text-[9px] text-stone-500 uppercase mt-2 font-black tracking-widest">{key}</span>
              </button>
            ))}
          </div>

          {/* EXTRA SCROLL SPACE (Prevent logo overlap) */}
          <div className="h-[60vh] w-full shrink-0" />
        </div>
      )}

      {/* GAMEPLAY */}
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

          {showLevelUp && (
            <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
              <div className="level-up-banner text-center">
                <h2 className="text-8xl font-black text-white drop-shadow-2xl tracking-tighter uppercase italic text-shadow-lg">LEVEL {currentLevel.level}</h2>
                <div className={`mt-2 px-8 py-2 rounded-full border-2 border-white/20 bg-white/10 backdrop-blur-md text-2xl font-black uppercase tracking-[0.4em] ${currentLevel.color}`}>{currentLevel.name}</div>
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
                className="letter-fall absolute cursor-pointer p-10 -ml-10 z-10"
              >
                <div className="w-24 h-24 bg-white rounded-[2rem] shadow-2xl flex items-center justify-center border-b-8 border-slate-200">
                  <span className={`text-6xl font-bold ${currentLetter.accent} arabic-font`}>{l.shape}</span>
                </div>
              </button>
            ))}
          </div>
          {floatingTexts.map((t) => (
            <div key={t.id} className="score-float absolute pointer-events-none text-5xl font-black text-white z-20" style={{ left: t.x - 20, top: t.y - 40 }}>+1</div>
          ))}
        </div>
      )}

      {/* GAME OVER */}
      {gameState === 'gameover' && (
        <div className="absolute inset-0 z-[600] flex items-center justify-center bg-black/95 backdrop-blur-3xl p-6">
          <div className="bg-white p-12 rounded-[3.5rem] text-center max-w-sm w-full shadow-2xl border-b-[12px] border-slate-200">
            <h2 className="text-5xl font-black text-slate-800 mb-6 tracking-tighter italic uppercase">GAME OVER</h2>
            <div className="bg-slate-50 p-8 rounded-[2.5rem] mb-10 shadow-inner">
              <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] mb-2">Final Score</p>
              <p className="text-7xl font-black text-slate-900 leading-none">{score}</p>
              <div className="h-px bg-slate-200 w-full my-6" />
              <p className="flex justify-center items-center gap-2 text-slate-500 font-bold">
                <Trophy size={18} className="text-amber-500 fill-amber-500" />
                Best: {highScore}
              </p>
            </div>
            <button onClick={() => startGame(selectedLetterKey)} className="w-full bg-slate-900 hover:bg-black text-white py-6 rounded-3xl text-2xl font-black shadow-xl transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-3 mb-4">
              <RotateCcw size={24} /> TRY AGAIN
            </button>
            <button onClick={backToMenu} className="w-full text-slate-400 font-black uppercase tracking-widest text-[10px] hover:text-slate-600 transition-colors">Return to Menu</button>
          </div>
        </div>
      )}

      {/* BRANDING LOGO */}
      <div className={`absolute bottom-8 left-8 z-[1000] transition-all duration-500 ${gameState === 'playing' ? 'opacity-[0.02] pointer-events-none' : 'opacity-30'}`}>
        <a href="https://api.whatsapp.com/send/?phone=201554712241&text&type=phone_number&app_absent=0" target="_blank" rel="noopener noreferrer">
          <img src="/logo.png" className="w-24 h-auto mb-2 contrast-125 hover:scale-105 transition-transform" />
        </a>
        <p className="text-stone-800 text-[10px] font-black tracking-[0.4em] uppercase">by <span className="font-bold">FarisAura</span></p>
      </div>

    </div>
  );
};

export default App;
