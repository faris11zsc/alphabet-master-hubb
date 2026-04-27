import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, RotateCcw, Heart, Star, Trophy, Zap } from 'lucide-react';

// ==========================================
// AUDIO LINKS FOR THE KHA SOUND
// ==========================================
const KHA_SOUND_URLS = [
  "https://files.catbox.moe/ysybmx.m4a",
  "https://files.catbox.moe/a371ui.m4a",
  "https://files.catbox.moe/7cu2hw.m4a"
];

// The specific shapes requested - FIXED ARABIC ENCODING
const KHA_SHAPES = ['ـخ', 'ـخـ', 'خـ'];
// ==========================================

const App = () => {
  const [gameState, setGameState] = useState('start');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [fallingLetters, setFallingLetters] = useState([]);
  const [floatingTexts, setFloatingTexts] = useState([]);
  const [showLevelUp, setShowLevelUp] = useState(false);

  // Safe High Score handling
  const [highScore, setHighScore] = useState(() => {
    try {
      const saved = localStorage.getItem('khaaHighScore');
      return saved ? parseInt(saved, 10) : 0;
    } catch (e) {
      return 0;
    }
  });

  const audioRefs = useRef([]);

  // Setup Audio
  useEffect(() => {
    audioRefs.current = KHA_SOUND_URLS.map(url => {
      const audio = new Audio(url);
      audio.preload = "auto";
      return audio;
    });
  }, []);

  // Silent unlock for mobile browsers - runs when you click Start
  const unlockAudioEngine = useCallback(() => {
    audioRefs.current.forEach(audio => {
      audio.muted = true; // Mute it so the user hears nothing
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          audio.pause();
          audio.currentTime = 0;
          audio.muted = false; // Unmute for future cloning
        }).catch(() => {});
      }
    });
  }, []);

  const playRandomSound = useCallback(() => {
    if (audioRefs.current.length > 0) {
      const randomIndex = Math.floor(Math.random() * audioRefs.current.length);
      const playInstance = audioRefs.current[randomIndex].cloneNode();
      playInstance.muted = false; // Ensure clone isn't muted
      playInstance.play().catch(e => console.warn("Audio blocked", e));
    }
  }, []);

  const saveHighScore = (newScore) => {
    if (newScore > highScore) {
      setHighScore(newScore);
      try {
        localStorage.setItem('khaaHighScore', newScore.toString());
      } catch (e) {}
    }
  };

  const startGame = () => {
    setScore(0);
    setLives(3);
    setFallingLetters([]);
    setFloatingTexts([]);
    setGameState('playing');

    // Unlock audio silently on the first user interaction
    unlockAudioEngine();
  };

  // --- 10-TIER HARDCORE LEVEL SCALING LOGIC ---
  const getLevelData = (s) => {
    if (s < 10) return { level: 1, bg: "from-sky-100 to-sky-300", text: "text-sky-700", name: "Beginner" };
    if (s < 20) return { level: 2, bg: "from-green-100 to-green-300", text: "text-green-700", name: "Novice" };
    if (s < 30) return { level: 3, bg: "from-yellow-100 to-yellow-300", text: "text-yellow-700", name: "Rookie" };
    if (s < 40) return { level: 4, bg: "from-orange-100 to-orange-300", text: "text-orange-700", name: "Fast" };
    if (s < 50) return { level: 5, bg: "from-amber-300 to-orange-500", text: "text-amber-900", name: "Expert" };
    if (s < 60) return { level: 6, bg: "from-red-300 to-red-500", text: "text-red-900", name: "Pro" };
    if (s < 70) return { level: 7, bg: "from-rose-400 to-pink-600", text: "text-pink-100", name: "Master" };
    if (s < 80) return { level: 8, bg: "from-purple-400 to-purple-700", text: "text-purple-100", name: "Grandmaster" };
    if (s < 90) return { level: 9, bg: "from-indigo-600 to-blue-900", text: "text-indigo-100", name: "Epic" };
    return { level: 10, bg: "from-slate-900 to-black", text: "text-red-500", name: "Impossible" };
  };

  const currentLevelData = getLevelData(score);

  // Trigger level up animation at the 10-level thresholds
  useEffect(() => {
    const levelThresholds = [10, 20, 30, 40, 50, 60, 70, 80, 90];
    if (score > 0 && levelThresholds.includes(score)) {
      setShowLevelUp(true);
      setTimeout(() => setShowLevelUp(false), 2000);
    }
  }, [score]);

  // Main Spawning Loop - FAST
  useEffect(() => {
    if (gameState !== 'playing') return;

    // Harder Spawn Rate
    const currentSpawnRate = Math.max(250, 750 - Math.floor(score / 5) * 35);

    const spawnInterval = setInterval(() => {
      setFallingLetters((prev) => {
        // Harder Fall Speed
        const fallSpeed = Math.max(0.8, 2.5 - (score * 0.025));
        const randomShape = KHA_SHAPES[Math.floor(Math.random() * KHA_SHAPES.length)];

        return [
          ...prev,
          {
            id: Date.now() + Math.random(),
            left: Math.floor(Math.random() * 75) + 10,
            duration: fallSpeed,
            shape: randomShape
          },
        ];
      });
    }, currentSpawnRate);

    return () => clearInterval(spawnInterval);
  }, [gameState, Math.floor(score / 5)]);

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
        saveHighScore(score);
      }
      return newLives;
    });
  };

  return (
    <div className={`relative w-full h-screen overflow-hidden bg-gradient-to-b ${currentLevelData.bg} font-sans touch-none select-none transition-colors duration-1000`}>
      <style>
        {`
          @keyframes fall {
            0% { transform: translateY(-100px) rotate(0deg); }
            100% { transform: translateY(110vh) rotate(15deg); }
          }
          @keyframes popOut {
            0% { transform: translateY(0) scale(1); opacity: 1; }
            100% { transform: translateY(-60px) scale(1.6); opacity: 0; }
          }
          @keyframes slideInFade {
            0% { transform: scale(0.8) translateY(-20px); opacity: 0; }
            10% { transform: scale(1) translateY(0); opacity: 1; }
            90% { transform: scale(1) translateY(0); opacity: 1; }
            100% { transform: scale(1.2) translateY(-20px); opacity: 0; }
          }
          .letter-fall { animation: fall linear forwards; }
          .score-float { animation: popOut 0.8s ease-out forwards; }
          .level-up-banner { animation: slideInFade 2s ease-in-out forwards; }
        `}
      </style>

      {/* Gameplay Stats Header */}
      {gameState === 'playing' && (
        <div className="absolute top-6 left-0 w-full px-6 flex justify-between items-start z-50 pointer-events-none">
          <div className="flex flex-col gap-2">
            <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-2xl shadow-lg border-2 border-white/50 flex items-center gap-2">
              <Star className="text-yellow-500 fill-yellow-500 w-6 h-6" />
              <span className="text-2xl font-black text-gray-800">{score}</span>
            </div>
            {/* Level Indicator */}
            <div className={`px-3 py-1 rounded-xl shadow-md font-bold text-sm border-2 border-white/30 bg-white/70 backdrop-blur flex items-center gap-1 ${currentLevelData.text}`}>
              <Zap size={14} className="fill-current" />
              Lv.{currentLevelData.level} {currentLevelData.name}
            </div>
          </div>

          <div className="flex gap-2">
            {[...Array(3)].map((_, i) => (
              <Heart key={i} className={`w-8 h-8 transition-all duration-300 ${i < lives ? 'text-red-500 fill-red-500 scale-110' : 'text-gray-400 opacity-50'}`} />
            ))}
          </div>
        </div>
      )}

      {/* TRANSPARENT Level Up Banner Popup */}
      {showLevelUp && (
        <div className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none">
          <div className="level-up-banner flex flex-col items-center justify-center">
            {/* Transparent text with drop shadow so it doesn't block the view */}
            <h2 className="text-6xl md:text-8xl font-black italic tracking-widest uppercase text-white/50 drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]">
              Level {currentLevelData.level}
            </h2>
            <p className="text-3xl md:text-4xl font-bold text-yellow-300/70 drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] mt-2">
              {currentLevelData.name} Speed!
            </p>
          </div>
        </div>
      )}

      {/* Start Screen */}
      {gameState === 'start' && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/20 backdrop-blur-sm p-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border-b-8 border-orange-200 text-center max-w-sm w-full relative overflow-hidden">

            {/* Best Score Badge */}
            {highScore > 0 && (
              <div className="absolute top-4 right-4 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 border border-yellow-300">
                <Trophy size={14} className="fill-yellow-600" /> Best: {highScore}
              </div>
            )}

            <div className="flex justify-center gap-2 mb-6 mt-4">
              {KHA_SHAPES.map((shape, idx) => (
                <div key={idx} className="w-16 h-16 bg-sky-100 rounded-xl flex items-center justify-center shadow-inner border-2 border-sky-200">
                  <span className="text-4xl text-sky-600 font-bold">{shape}</span>
                </div>
              ))}
            </div>

            <h1 className="text-3xl font-black text-gray-800 mb-2">أشكال حرف الخاء</h1>
            <p className="text-gray-500 mb-8 leading-relaxed font-medium">10 Levels of Speed. Are you fast enough?</p>

            <button
              onClick={startGame}
              className="w-full bg-sky-500 hover:bg-sky-600 text-white py-5 rounded-2xl text-2xl font-black shadow-lg transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
            >
              <Play className="fill-white w-8 h-8" />
              START GAME
            </button>
          </div>
        </div>
      )}

      {/* Game Over Screen */}
      {gameState === 'gameover' && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-6">
          <div className="bg-white p-10 rounded-[3rem] shadow-2xl text-center max-w-sm w-full">
            <div className="text-6xl mb-4">💥</div>
            <h2 className="text-4xl font-black text-gray-800 mb-2">Game Over!</h2>

            <div className="bg-gray-100 rounded-2xl p-4 mb-6">
              <p className="text-gray-500 font-bold uppercase text-sm tracking-wider">Your Score</p>
              <p className="text-5xl font-black text-orange-600 my-1">{score}</p>
              <p className="text-md font-bold text-gray-400 mb-2">Reached Level {currentLevelData.level}</p>
              <div className="h-px bg-gray-300 w-full my-3"></div>
              <p className="text-gray-500 font-bold flex justify-center items-center gap-1">
                <Trophy size={18} className={score >= highScore && score > 0 ? "text-yellow-500 fill-yellow-500" : "text-gray-400"} />
                High Score: <span className="text-gray-800">{highScore}</span>
              </p>
            </div>

            {score >= highScore && score > 0 && (
              <p className="text-green-500 font-bold mb-4 animate-bounce">🆕 NEW HIGH SCORE! 🆕</p>
            )}

            <button
              onClick={startGame}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-5 rounded-2xl text-2xl font-black shadow-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-6 h-6" />
              TRY AGAIN
            </button>
          </div>
        </div>
      )}

      {/* Falling Elements Area */}
      <div className="absolute inset-0">
        {fallingLetters.map((l) => (
          <button
            key={l.id}
            onPointerDown={(e) => {
              e.preventDefault();
              e.stopPropagation(); // Forces immediate reaction bypassing DOM lag
              handleCatch(l.id, e.clientX, e.clientY);
            }}
            onAnimationEnd={() => handleMiss(l.id)}
            style={{
              left: `${l.left}%`,
              animationDuration: `${l.duration}s`,
              WebkitTapHighlightColor: 'transparent' // Prevents mobile browser highlight delay
            }}
            // NEW HITBOX LOGIC: "p-8 -ml-8" adds a massive invisible 32px hit-zone around the box.
            // It looks exactly the same, but gives the user a massive forgiveness area for fast clicks!
            className="letter-fall absolute cursor-pointer outline-none touch-none z-10 p-8 -ml-8 group"
          >
            {/* The visual box itself. "pointer-events-none" guarantees the click lands on the giant outer wrapper */}
            <div className="w-20 h-20 bg-white rounded-2xl shadow-2xl border-b-4 border-gray-200 flex items-center justify-center transition-transform group-active:scale-75 pointer-events-none">       
              <span className="text-5xl font-bold text-slate-800">{l.shape}</span>
            </div>
          </button>
        ))}

        {/* The +1 score popups */}
        {floatingTexts.map((t) => (
          <div
            key={t.id}
            className="score-float absolute pointer-events-none text-4xl font-black text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] z-20"
            style={{ left: t.x - 20, top: t.y - 40 }}
          >
            +1
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
