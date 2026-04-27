import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, RotateCcw, Heart, Star, Trophy, Zap, ChevronLeft } from 'lucide-react';

// ==========================================
// FULL ALPHABET CONFIGURATION
// ==========================================
const LETTER_CONFIG = {
  'alif': { char: 'أ', shapes: ['أ', 'ـأ', 'إ'], sounds: ['ءا.m4a', 'ءو.m4a', 'ءي.m4a'], bg: "from-sky-400 to-blue-600", accent: "text-blue-600" },
  'ba': { char: 'ب', shapes: ['بـ', 'ـبـ', 'ـب'], sounds: ['ب.m4a', 'بو.m4a', 'بي.m4a'], bg: "from-emerald-400 to-green-600", accent: "text-green-600" },
  'ta': { char: 'ت', shapes: ['تـ', 'ـتـ', 'ـت'], sounds: ['تا.m4a', 'تو.m4a', 'تي.m4a'], bg: "from-rose-400 to-red-600", accent: "text-red-600" },
  'tha': { char: 'ث', shapes: ['ثـ', 'ـثـ', 'ـث'], sounds: ['ثا.m4a', 'ثو.m4a', 'ثي.m4a'], bg: "from-purple-400 to-indigo-600", accent: "text-indigo-600" },
  'jeem': { char: 'ج', shapes: ['جـ', 'ـجـ', 'ـج'], sounds: ['جا.m4a', 'جو.m4a', 'جي.m4a'], bg: "from-orange-400 to-amber-600", accent: "text-amber-600" },
  'haa': { char: 'ح', shapes: ['حـ', 'ـحـ', 'ـح'], sounds: ['حا.m4a', 'حو.m4a', 'حي.m4a'], bg: "from-teal-400 to-cyan-600", accent: "text-cyan-600" },
  'kha': { char: 'خ', shapes: ['خـ', 'ـخـ', 'ـخ'], sounds: ['خا.m4a', 'خو.m4a', 'خي.m4a'], bg: "from-slate-700 to-slate-900", accent: "text-slate-800" },
  'dal': { char: 'د', shapes: ['د', 'ـد', 'د'], sounds: ['دا.m4a', 'دو.m4a', 'دي.m4a'], bg: "from-red-400 to-rose-600", accent: "text-rose-600" },
  'thal': { char: 'ذ', shapes: ['ذ', 'ـذ', 'ذ'], sounds: ['ذا.m4a', 'ذو.m4a', 'ذي.m4a'], bg: "from-yellow-500 to-orange-600", accent: "text-orange-700" },
  'raa': { char: 'ر', shapes: ['ر', 'ـر', 'ر'], sounds: ['را.m4a', 'رو.m4a', 'ري.m4a'], bg: "from-lime-400 to-green-600", accent: "text-green-700" },
  'zay': { char: 'ز', shapes: ['ز', 'ـز', 'ز'], sounds: ['زا.m4a', 'زو.m4a', 'زي.m4a'], bg: "from-green-500 to-teal-700", accent: "text-teal-800" },
  'seen': { char: 'س', shapes: ['سـ', 'ـسـ', 'ـس'], sounds: ['س.m4a', 'سو.m4a', 'سي.m4a'], bg: "from-blue-400 to-indigo-600", accent: "text-indigo-700" },
  'sheen': { char: 'ش', shapes: ['شـ', 'ـشـ', 'ـش'], sounds: ['شا.m4a', 'شو.m4a', 'شي.m4a'], bg: "from-violet-400 to-purple-600", accent: "text-purple-700" },
  'sad': { char: 'ص', shapes: ['صـ', 'ـصـ', 'ـص'], sounds: ['صا.m4a', 'صو.m4a', 'صي.m4a'], bg: "from-stone-400 to-stone-600", accent: "text-stone-700" },
  'dad': { char: 'ض', shapes: ['ضـ', 'ـضـ', 'ـض'], sounds: ['ضا.m4a', 'ضو.m4a', 'ضي.m4a'], bg: "from-emerald-600 to-green-900", accent: "text-green-900" },
  'taa': { char: 'ط', shapes: ['طـ', 'ـطـ', 'ـط'], sounds: ['طا.m4a', 'طو.m4a', 'طي.m4a'], bg: "from-amber-600 to-orange-800", accent: "text-orange-900" },
  'zaa': { char: 'ظ', shapes: ['ظـ', 'ـظـ', 'ـظ'], sounds: ['ظا.m4a', 'ظو.m4a', 'ظي.m4a'], bg: "from-brown-400 to-stone-800", accent: "text-stone-900" },
  'ayn': { char: 'ع', shapes: ['عـ', 'ـعـ', 'ـع'], sounds: ['عا.m4a', 'عو.m4a', 'عي.m4a'], bg: "from-sky-500 to-blue-800", accent: "text-blue-900" },
  'ghayn': { char: 'غ', shapes: ['غـ', 'ـغـ', 'ـغ'], sounds: ['غا.m4a', 'غو.m4a', 'غي.m4a'], bg: "from-indigo-400 to-purple-800", accent: "text-purple-900" },
  'faa': { char: 'ف', shapes: ['فـ', 'ـفـ', 'ـف'], sounds: ['ف.m4a', 'فو.m4a', 'في.m4a'], bg: "from-pink-400 to-rose-600", accent: "text-rose-700" },
  'qaf': { char: 'ق', shapes: ['قـ', 'ـقـ', 'ـق'], sounds: ['ققا.m4a', 'قو.m4a', 'قي.m4a'], bg: "from-red-600 to-black", accent: "text-red-900" },
  'kaf': { char: 'ك', shapes: ['كـ', 'ـكـ', 'ـك'], sounds: ['كا.m4a', 'كو.m4a', 'كي.m4a'], bg: "from-blue-300 to-blue-500", accent: "text-blue-700" },
  'lam': { char: 'ل', shapes: ['لـ', 'ـلـ', 'ـل'], sounds: ['لا.m4a', 'لو.m4a', 'لي.m4a'], bg: "from-cyan-400 to-blue-500", accent: "text-blue-600" },
  'meem': { char: 'م', shapes: ['مـ', 'ـمـ', 'ـم'], sounds: ['ما.m4a', 'مو.m4a', 'مي.m4a'], bg: "from-violet-500 to-fuchsia-700", accent: "text-fuchsia-800" },
  'noon': { char: 'ن', shapes: ['نـ', 'ـنـ', 'ـن'], sounds: ['نا.m4a', 'نو.m4a', 'ني.m4a'], bg: "from-green-400 to-emerald-700", accent: "text-emerald-800" },
  'haa2': { char: 'ه', shapes: ['هـ', 'ـهـ', 'ـه'], sounds: ['ها.m4a', 'هو.m4a', 'هي.m4a'], bg: "from-orange-300 to-yellow-500", accent: "text-yellow-700" },
  'waw': { char: 'و', shapes: ['و', 'ـو', 'و'], sounds: ['وا.m4a', 'وو.m4a', 'وي.m4a'], bg: "from-blue-600 to-indigo-900", accent: "text-indigo-800" },
  'yaa': { char: 'ي', shapes: ['يـ', 'ـيـ', 'ـي'], sounds: ['ي.m4a', 'يو.m4a', 'يي.m4a'], bg: "from-teal-300 to-teal-600", accent: "text-teal-800" },
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
  const currentLetter = selectedLetterKey ? LETTER_CONFIG[selectedLetterKey] : null;

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

  // --- Level Logic ---
  const getLevelData = (s) => {
    if (s < 10) return { level: 1, name: "Beginner", speed: 2.5 };
    if (s < 20) return { level: 2, name: "Novice", speed: 2.2 };
    if (s < 30) return { level: 3, name: "Rookie", speed: 2.0 };
    if (s < 40) return { level: 4, name: "Fast", speed: 1.8 };
    if (s < 50) return { level: 5, name: "Expert", speed: 1.6 };
    return { level: 6, name: "Master", speed: 1.4 };
  };

  const level = getLevelData(score);

  useEffect(() => {
    if (gameState !== 'playing') return;
    const currentSpawnRate = Math.max(300, 1000 - (score * 15));
    const spawnInterval = setInterval(() => {
      setFallingLetters((prev) => [
        ...prev,
        {
          id: Date.now() + Math.random(),
          left: Math.floor(Math.random() * 80) + 10,
          duration: level.speed,
          shape: currentLetter.shapes[Math.floor(Math.random() * currentLetter.shapes.length)]
        },
      ]);
    }, currentSpawnRate);
    return () => clearInterval(spawnInterval);
  }, [gameState, score, selectedLetterKey]);

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
    <div className={`relative w-full h-screen overflow-hidden font-sans touch-none select-none transition-all duration-1000 bg-gradient-to-b ${currentLetter ? currentLetter.bg : 'from-slate-800 to-slate-950'}`}>
      
      <style>
        {`
          @keyframes fall { 0% { transform: translateY(-100px); } 100% { transform: translateY(110vh); } }
          @keyframes popOut { 0% { transform: scale(1); opacity: 1; } 100% { transform: scale(2); opacity: 0; } }
          .letter-fall { animation: fall linear forwards; }
          .score-float { animation: popOut 0.8s ease-out forwards; }
          .arabic-font { font-family: 'Amiri', serif; }
        `}
      </style>

      {/* MENU SCREEN */}
      {gameState === 'menu' && (
        <div className="absolute inset-0 z-[100] flex flex-col items-center justify-start bg-slate-900/40 backdrop-blur-md p-8 overflow-y-auto pb-20">
          <div className="text-center mb-10 mt-10">
            <h1 className="text-5xl font-black text-white drop-shadow-lg mb-2">Alphabet Master</h1>
            <p className="text-sky-300 font-bold tracking-widest uppercase">Choose a letter to start</p>
          </div>

          <div className="grid grid-cols-4 md:grid-cols-7 gap-4 w-full max-w-4xl">
            {Object.keys(LETTER_CONFIG).map((key) => (
              <button
                key={key}
                onClick={() => startGame(key)}
                className="aspect-square bg-white/10 hover:bg-white/20 border-2 border-white/20 rounded-2xl flex flex-col items-center justify-center transition-all transform hover:scale-105 active:scale-95 group"
              >
                <span className="text-4xl font-bold text-white group-hover:text-yellow-300 transition-colors arabic-font">
                  {LETTER_CONFIG[key].char}
                </span>
                <span className="text-[10px] text-white/50 uppercase mt-1 font-bold">{key}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* GAMEPLAY UI */}
      {gameState === 'playing' && (
        <>
          <button onClick={backToMenu} className="absolute top-6 left-6 z-[110] bg-white/20 hover:bg-white/40 p-3 rounded-2xl text-white transition-all backdrop-blur-md">
            <ChevronLeft size={24} />
          </button>
          
          <div className="absolute top-6 right-6 flex flex-col items-end gap-2 z-50 pointer-events-none">
            <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-2xl shadow-lg flex items-center gap-2 border-2 border-white/50">
              <Star className="text-yellow-500 fill-yellow-500 w-6 h-6" />
              <span className="text-2xl font-black text-gray-800">{score}</span>
            </div>
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <Heart key={i} className={`w-6 h-6 ${i < lives ? 'text-red-500 fill-red-500' : 'text-gray-400 opacity-30'}`} />
              ))}
            </div>
          </div>

          <div className="absolute inset-0">
            {fallingLetters.map((l) => (
              <button
                key={l.id}
                onPointerDown={(e) => handleCatch(l.id, e.clientX, e.clientY)}
                onAnimationEnd={() => handleMiss(l.id)}
                style={{ left: `${l.left}%`, animationDuration: `${l.duration}s` }}
                className="letter-fall absolute cursor-pointer p-8 -ml-8 outline-none touch-none z-10"
              >
                <div className="w-20 h-20 bg-white rounded-2xl shadow-2xl flex items-center justify-center border-b-4 border-gray-200">
                  <span className={`text-5xl font-bold ${currentLetter.accent} arabic-font`}>{l.shape}</span>
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      {/* GAME OVER */}
      {gameState === 'gameover' && (
        <div className="absolute inset-0 z-[120] flex items-center justify-center bg-black/80 backdrop-blur-xl p-6">
          <div className="bg-white p-10 rounded-[3rem] text-center max-w-sm w-full shadow-2xl">
            <h2 className="text-4xl font-black text-gray-800 mb-6">Game Over!</h2>
            <div className="bg-slate-100 p-6 rounded-3xl mb-8">
              <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-1">Total Score</p>
              <p className="text-6xl font-black text-slate-800">{score}</p>
            </div>
            <button onClick={() => startGame(selectedLetterKey)} className="w-full bg-blue-600 text-white py-5 rounded-2xl text-xl font-bold mb-3 flex items-center justify-center gap-2">
              <RotateCcw size={20} /> TRY AGAIN
            </button>
            <button onClick={backToMenu} className="w-full text-gray-500 font-bold py-2">BACK TO MENU</button>
          </div>
        </div>
      )}

      {/* BRANDING */}
      <div className="absolute bottom-6 left-6 z-[150] pointer-events-none flex flex-col items-start opacity-70">
        <img src="/logo.png" alt="LightKnight Logo" className="w-20 h-auto mb-1 drop-shadow-md" />
        <p className="text-white/80 text-[10px] font-medium tracking-widest uppercase">
          by <span className="font-bold">FarisAura</span>
        </p>
      </div>

    </div>
  );
};

export default App;
