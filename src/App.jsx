import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, RotateCcw, Heart, Star, Trophy, ChevronLeft, Settings, ShoppingBag, Moon, Sun, Palette, Coins, Zap, Volume2, VolumeX } from 'lucide-react';

/* ═══════════════════════════════════════════
   GOOGLE FONT LOADER
══════════════════════════════════════════════ */
const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Cinzel+Decorative:wght@400;900&family=Tajawal:wght@400;700;900&display=swap');
  `}</style>
);

/* ═══════════════════════════════════════════
   THEME SYSTEM
══════════════════════════════════════════════ */
const THEMES = {
  'golden-age': {
    name: 'Golden Age',
    icon: '✦',
    cost: 0,
    styles: {
      '--bg-main': '#1A0F00',
      '--bg-card': '#2A1A05',
      '--bg-card2': '#341F08',
      '--text-primary': '#F5E6C8',
      '--text-secondary': '#C4A96B',
      '--gold': '#D4AF37',
      '--accent': '#C8380A',
      '--accent2': '#E8A020',
      '--border': '#5A3E1B',
      '--glow': '0 0 20px rgba(212,175,55,0.3)',
      '--splash-bg': 'radial-gradient(ellipse at center, #2A1400 0%, #0D0600 100%)',
    },
  },
  'starry-night': {
    name: 'Starry Night',
    icon: '✦',
    cost: 200,
    styles: {
      '--bg-main': '#060B1F',
      '--bg-card': '#0D1530',
      '--bg-card2': '#101A38',
      '--text-primary': '#E0EAFF',
      '--text-secondary': '#7A9CC8',
      '--gold': '#88AAFF',
      '--accent': '#4F46E5',
      '--accent2': '#38BDF8',
      '--border': '#2D3F7A',
      '--glow': '0 0 20px rgba(79,70,229,0.4)',
      '--splash-bg': 'radial-gradient(ellipse at center, #0D1A4A 0%, #020510 100%)',
    },
  },
  'desert-mirage': {
    name: 'Desert Mirage',
    icon: '✦',
    cost: 200,
    styles: {
      '--bg-main': '#1F0E00',
      '--bg-card': '#2E1600',
      '--bg-card2': '#3A1C00',
      '--text-primary': '#FFE8C0',
      '--text-secondary': '#CC8844',
      '--gold': '#FF9F1C',
      '--accent': '#CC2200',
      '--accent2': '#FF6600',
      '--border': '#6B3000',
      '--glow': '0 0 20px rgba(255,159,28,0.35)',
      '--splash-bg': 'radial-gradient(ellipse at center, #3A1800 0%, #0D0400 100%)',
    },
  },
  'jade-palace': {
    name: 'Jade Palace',
    icon: '✦',
    cost: 350,
    styles: {
      '--bg-main': '#001A0E',
      '--bg-card': '#00270F',
      '--bg-card2': '#003015',
      '--text-primary': '#BFFFD8',
      '--text-secondary': '#60B880',
      '--gold': '#00E56E',
      '--accent': '#007A40',
      '--accent2': '#00FF88',
      '--border': '#005530',
      '--glow': '0 0 20px rgba(0,229,110,0.3)',
      '--splash-bg': 'radial-gradient(ellipse at center, #003A18 0%, #000E06 100%)',
    },
  },
};

/* ═══════════════════════════════════════════
   FULL LETTER CONFIG — all 28 letters
══════════════════════════════════════════════ */
const ALPHABET_KEYS = [
  'hamza','ba','ta','tha','jeem','haa','kha',
  'dal','thal','raa','zay','seen','sheen','sad',
  'dad','taa','zaa','ayn','ghayn','faa','qaf',
  'kaf','lam','meem','noon','haa2','waw','yaa'
];

const LETTER_CONFIG = {
  'hamza': { char:'أ', name:'Hamza', mode:'rain',    shapes:['ء','ئ','ئـ','ؤ','أ','إ'],           sounds:['ءا.m4a','ءو.m4a','ءي.m4a'], bg:'from-sky-900 to-indigo-950',    accent:'#60A5FA' },
  'ba':    { char:'ب', name:'Ba',    mode:'rain',    shapes:['ب','بـ','ـبـ','ـب'],                 sounds:['ب.m4a','بو.m4a','بي.m4a'],  bg:'from-emerald-900 to-teal-950',  accent:'#34D399' },
  'ta':    { char:'ت', name:'Ta',    mode:'whack',   shapes:['ت','تـ','ـتـ','ـت'],                 sounds:['تا.m4a', 'تو.m4a', 'تي.m4a'], bg:'from-rose-900 to-pink-950',     accent:'#FB7185' },
  'tha':   { char:'ث', name:'Tha',   mode:'runner',  shapes:['ث','ثـ','ـثـ','ـث'],                 sounds:['ثا.m4a', 'ثو.m4a', 'ثي.m4a'], bg:'from-violet-900 to-purple-950', accent:'#A78BFA' },
  'jeem':  { char:'ج', name:'Jeem',  mode:'rain',    shapes:['ج','جـ','ـجـ','ـج'],                 sounds:['جا.m4a', 'جو.m4a', 'جي.m4a'], bg:'from-amber-900 to-yellow-950',  accent:'#FCD34D' },
  'haa':   { char:'ح', name:'Haa',   mode:'whack',   shapes:['ح','حـ','ـحـ','ـح'],                 sounds:['حا.m4a', 'حو.m4a', 'حي.m4a'], bg:'from-cyan-900 to-sky-950',      accent:'#22D3EE' },
  'kha':   { char:'خ', name:'Kha',   mode:'runner',  shapes:['خ','خـ','ـخـ','ـخ'],                 sounds:['خا.m4a', 'خو.m4a', 'خي.m4a'], bg:'from-orange-900 to-red-950',    accent:'#FB923C' },
  'dal':   { char:'د', name:'Dal',   mode:'rain',    shapes:['د','ـد'],                           sounds:['دا.m4a', 'دو.m4a', 'دي.m4a'], bg:'from-lime-900 to-green-950',    accent:'#86EFAC' },
  'thal':  { char:'ذ', name:'Thal',  mode:'whack',   shapes:['ذ','ـذ'],                           sounds:['ذا.m4a', 'ذو.m4a', 'ذي.m4a'], bg:'from-fuchsia-900 to-violet-950',accent:'#E879F9' },
  'raa':   { char:'ر', name:'Raa',   mode:'rain',    shapes:['ر','ـر'],                           sounds:['را.m4a', 'رو.m4a', 'ري.m4a'], bg:'from-red-900 to-rose-950',      accent:'#F87171' },
  'zay':   { char:'ز', name:'Zay',   mode:'whack',   shapes:['ز','ـز'],                           sounds:['زا.m4a', 'زو.m4a', 'زي.m4a'], bg:'from-teal-900 to-emerald-950',  accent:'#2DD4BF' },
  'seen':  { char:'س', name:'Seen',  mode:'rain',    shapes:['س','سـ','ـسـ','ـس'],                 sounds:['س.m4a', 'سو.m4a', 'سي.m4a'],  bg:'from-indigo-900 to-blue-950',   accent:'#818CF8' },
  'sheen': { char:'ش', name:'Sheen', mode:'whack',   shapes:['ش','شـ','ـشـ','ـش'],                 sounds:['شا.m4a', 'شو.m4a', 'شي.m4a'], bg:'from-pink-900 to-fuchsia-950',  accent:'#F472B6' },
  'sad':   { char:'ص', name:'Sad',   mode:'rain',    shapes:['ص','صـ','ـصـ','ـص'],                 sounds:['ص.m4a', 'صو.m4a', 'صي.m4a'],  bg:'from-yellow-900 to-amber-950',  accent:'#FBBF24' },
  'dad':   { char:'ض', name:'Dad',   mode:'whack',   shapes:['ض','ضـ','ـضـ','ـض'],                 sounds:['ض.m4a', 'ضو.m4a', 'ضي.m4a'],  bg:'from-sky-900 to-cyan-950',      accent:'#38BDF8' },
  'taa':   { char:'ط', name:'Taa',   mode:'whack',   shapes:['ط','طـ','ـطـ','ـط'],                 sounds:['طا.m4a', 'طو.m4a', 'طي.m4a'], bg:'from-green-900 to-lime-950',    accent:'#4ADE80' },
  'zaa':   { char:'ظ', name:'Zaa',   mode:'runner',  shapes:['ظ','ظـ','ـظـ','ـظ'],                 sounds:['ظا.m4a', 'ظو.m4a', 'ظي.m4a'], bg:'from-purple-900 to-indigo-950', accent:'#C084FC' },
  'ayn':   { char:'ع', name:'Ayn',   mode:'runner',  shapes:['ع','عـ','ـعـ','ـع'],                 sounds:['عا.m4a', 'عو.m4a', 'عي.m4a'], bg:'from-rose-900 to-red-950',      accent:'#FDA4AF' },
  'ghayn': { char:'غ', name:'Ghayn', mode:'lantern', shapes:['غ','غـ','ـغـ','ـغ'],                 sounds:['غا.m4a', 'غو.m4a', 'غي.m4a'], bg:'from-amber-900 to-orange-950',  accent:'#FD8A10' },
  'faa':   { char:'ف', name:'Faa',   mode:'runner',  shapes:['ف','فـ','ـفـ','ـف'],                 sounds:['فا.m4a', 'فو.m4a', 'في.m4a'], bg:'from-teal-900 to-cyan-950',     accent:'#5EEAD4' },
  'qaf':   { char:'ق', name:'Qaf',   mode:'lantern', shapes:['ق','قـ','ـقـ','ـق'],                 sounds:['ققا.m4a', 'قو.m4a', 'قي.m4a'], bg:'from-violet-900 to-purple-950', accent:'#8B5CF6' },
  'kaf':   { char:'ك', name:'Kaf',   mode:'lantern', shapes:['ك','كـ','ـكـ','ـك'],                 sounds:['كا.m4a', 'كو.m4a', 'كي.m4a'], bg:'from-sky-900 to-blue-950',      accent:'#0EA5E9' },
  'lam':   { char:'ل', name:'Lam',   mode:'runner',  shapes:['ل','لـ','ـلـ','ـل'],                 sounds:['لَ.m4a', 'لو.m4a', 'لي.m4a'], bg:'from-emerald-900 to-green-950', accent:'#10B981' },
  'meem':  { char:'م', name:'Meem',  mode:'lantern', shapes:['م','مـ','ـمـ','ـم'],                 sounds:['ما.m4a', 'مو.m4a', 'مي.m4a'], bg:'from-pink-900 to-rose-950',     accent:'#EC4899' },
  'noon':  { char:'ن', name:'Noon',  mode:'runner',  shapes:['ن','نـ','ـنـ','ـن'],                 sounds:['نا.m4a', 'نو.m4a', 'ني.m4a'], bg:'from-indigo-900 to-violet-950', accent:'#6366F1' },
  'haa2':  { char:'ه', name:'Ha',    mode:'lantern', shapes:['ه','هـ','ـهـ','ه'],                 sounds:['ها.m4a', 'هو.m4a', 'هي.m4a'], bg:'from-amber-900 to-yellow-950',  accent:'#F59E0B' },
  'waw':   { char:'و', name:'Waw',   mode:'lantern', shapes:['و','ـو'],                           sounds:['وا.m4a', 'وو.m4a', 'وي.m4a'], bg:'from-red-900 to-rose-950',      accent:'#EF4444' },
  'yaa':   { char:'ي', name:'Yaa',   mode:'lantern', shapes:['ي','يـ','ـيـ','ـي'],                 sounds:['ي.m4a', 'يو.m4a', 'يي.m4a'], bg:'from-teal-900 to-emerald-950',  accent:'#14B8A6' },
};

const getLevelData = (s) => {
  if (s < 10)  return { level:1, name:"Novice",      speed:2.2,  spawnRate:1300, color:"#7DD3FC" };
  if (s < 20)  return { level:2, name:"Apprentice",  speed:1.9,  spawnRate:1150, color:"#6EE7B7" };
  if (s < 35)  return { level:3, name:"Scribe",      speed:1.65, spawnRate:1000, color:"#FCD34D" };
  if (s < 50)  return { level:4, name:"Scholar",     speed:1.4,  spawnRate:850,  color:"#FCA5A5" };
  if (s < 70)  return { level:5, name:"Calligrapher",speed:1.2,  spawnRate:700,  color:"#C084FC" };
  if (s < 90)  return { level:6, name:"Sage",        speed:1.0,  spawnRate:580,  color:"#F472B6" };
  if (s < 115) return { level:7, name:"Master",      speed:0.85, spawnRate:470,  color:"#FB923C" };
  return               { level:8, name:"Grandmaster", speed:0.7,  spawnRate:360,  color:"#D4AF37" };
};

const useParticles = () => {
  const [particles, setParticles] = useState([]);
  const spawnParticles = useCallback((x, y, color = '#D4AF37', count = 8) => {
    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: Date.now() + i + Math.random(),
      x, y,
      vx: (Math.random() - 0.5) * 200,
      vy: -Math.random() * 200 - 80,
      color,
      size: Math.random() * 8 + 4,
      life: 1,
    }));
    setParticles(prev => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(n => n.id === p.id)));
    }, 900);
  }, []);
  return { particles, spawnParticles };
};

const useCombo = () => {
  const [combo, setCombo] = useState(0);
  const [comboLabel, setComboLabel] = useState(null);
  const timerRef = useRef(null);
  const hit = useCallback(() => {
    setCombo(c => {
      const next = c + 1;
      if (next >= 3) {
        const labels = { 3:'Nice!', 5:'Great!', 8:'Awesome!', 12:'FIRE 🔥', 20:'LEGENDARY ⚡' };
        const label = Object.entries(labels).reverse().find(([k]) => next >= +k);
        if (label) {
          setComboLabel({ text: label[1], id: Date.now() });
          setTimeout(() => setComboLabel(null), 1200);
        }
      }
      return next;
    });
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCombo(0), 2000);
  }, []);
  const reset = useCallback(() => { setCombo(0); clearTimeout(timerRef.current); }, []);
  const multiplier = combo >= 20 ? 5 : combo >= 12 ? 4 : combo >= 8 ? 3 : combo >= 5 ? 2 : combo >= 3 ? 1.5 : 1;
  return { combo, comboLabel, multiplier, hit, reset };
};

const MemoryGame = ({ letterKey, onScore, onMiss, onEnd }) => {
  const letter = LETTER_CONFIG[letterKey] || LETTER_CONFIG['ba'];
  const allShapes = letter.shapes;
  const generateCards = useCallback(() => {
    const pool = allShapes.length >= 4 ? allShapes : [...allShapes, ...allShapes].slice(0, 4);
    const pairs = pool.slice(0, 4);
    const deck = [...pairs, ...pairs].map((s, i) => ({ id: i, shape: s, flipped: false, matched: false }));
    return deck.sort(() => Math.random() - 0.5);
  }, [letterKey, allShapes]);
  const [cards, setCards] = useState(generateCards);
  const [flipped, setFlipped] = useState([]);
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);
  const [matchCount, setMatchCount] = useState(0);
  const flip = (idx) => {
    if (locked || cards[idx].flipped || cards[idx].matched || flipped.length >= 2) return;
    const newCards = [...cards];
    newCards[idx] = { ...newCards[idx], flipped: true };
    const newFlipped = [...flipped, idx];
    setCards(newCards);
    setFlipped(newFlipped);
    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      setLocked(true);
      const [a, b] = newFlipped;
      if (newCards[a].shape === newCards[b].shape) {
        const matched = newCards.map((c, i) => i === a || i === b ? { ...c, matched: true } : c);
        setCards(matched); setFlipped([]); setLocked(false); onScore(3);
        const newMatch = matchCount + 1;
        setMatchCount(newMatch);
        if (newMatch >= 4) setTimeout(() => { setCards(generateCards()); setMatchCount(0); setMoves(0); }, 600);
      } else {
        setTimeout(() => {
          setCards(newCards.map((c, i) => i === a || i === b ? { ...c, flipped: false } : c));
          setFlipped([]); setLocked(false); onMiss();
        }, 900);
      }
    }
  };
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 gap-6">
      <div className="text-center">
        <p className="text-white/50 text-sm font-bold uppercase tracking-widest">Match the Forms</p>
        <p className="text-6xl arabic-font mt-1" style={{ color: letter.accent }}>{letter.char}</p>
        <p className="text-white/40 text-xs mt-1">{letter.name} • {moves} moves</p>
      </div>
      <div className="grid grid-cols-4 gap-3 w-full max-w-sm">
        {cards.map((card, i) => (
          <button key={card.id} onClick={() => flip(i)} className="aspect-square rounded-2xl flex items-center justify-center text-4xl arabic-font font-bold transition-all duration-300 active:scale-95 shadow-lg"
            style={{
              background: card.matched ? 'rgba(0,230,100,0.25)' : card.flipped ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.07)',
              border: `2px solid ${card.matched ? '#00E664' : card.flipped ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.1)'}`,
              color: card.flipped || card.matched ? letter.accent : 'transparent',
              transform: card.flipped || card.matched ? 'rotateY(0deg)' : 'rotateY(90deg)',
            }}>
            {card.flipped || card.matched ? card.shape : '?'}
          </button>
        ))}
      </div>
    </div>
  );
};

const ShapeSorterGame = ({ onScore, onMiss }) => {
  const keys = ALPHABET_KEYS;
  const [currentLetterKey, setCurrentLetterKey] = useState(() => keys[Math.floor(Math.random() * keys.length)]);
  const [options, setOptions] = useState([]);
  const [question, setQuestion] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const generate = useCallback((lk) => {
    const letter = LETTER_CONFIG[lk];
    const correctShape = letter.shapes[Math.floor(Math.random() * letter.shapes.length)];
    const wrongLetters = keys.filter(k => k !== lk).sort(() => Math.random() - 0.5).slice(0, 3);
    const wrongShapes = wrongLetters.map(k => {
      const s = LETTER_CONFIG[k].shapes;
      return s[Math.floor(Math.random() * s.length)];
    });
    const allOptions = [...wrongShapes, correctShape].sort(() => Math.random() - 0.5);
    setQuestion({ letterKey: lk, correctShape });
    setOptions(allOptions);
    setFeedback(null);
  }, [keys]);
  useEffect(() => { generate(currentLetterKey); }, [currentLetterKey, generate]);
  const pick = (shape) => {
    if (feedback) return;
    if (shape === question.correctShape) {
      setFeedback('correct'); onScore(2);
      setTimeout(() => { setCurrentLetterKey(keys[Math.floor(Math.random() * keys.length)]); }, 700);
    } else {
      setFeedback('wrong'); onMiss();
      setTimeout(() => setFeedback(null), 800);
    }
  };
  const letter = currentLetterKey ? LETTER_CONFIG[currentLetterKey] : null;
  if (!letter || !question) return null;
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 gap-8">
      <div className="text-center">
        <p className="text-white/50 text-sm font-bold uppercase tracking-widest mb-3">Which form belongs to</p>
        <div className="text-8xl arabic-font font-black" style={{ color: letter.accent }}>{letter.char}</div>
        <p className="text-white/40 text-sm mt-2">{letter.name}</p>
      </div>
      <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
        {options.map((shape, i) => (
          <button key={i} onClick={() => pick(shape)} className="aspect-square rounded-3xl flex items-center justify-center text-5xl arabic-font font-bold transition-all duration-200 active:scale-90"
            style={{
              background: feedback === 'correct' && shape === question.correctShape ? 'rgba(0,230,100,0.3)' : feedback === 'wrong' && shape !== question.correctShape ? 'rgba(255,50,50,0.2)' : 'rgba(255,255,255,0.08)',
              border: `2px solid ${feedback === 'correct' && shape === question.correctShape ? '#00E664' : 'rgba(255,255,255,0.15)'}`,
              color: letter.accent,
            }}>
            {shape}
          </button>
        ))}
      </div>
    </div>
  );
};

const BazaarRush = ({ onScore, onMiss }) => {
  const [target, setTarget] = useState(() => {
    const k = ALPHABET_KEYS[Math.floor(Math.random() * ALPHABET_KEYS.length)];
    return LETTER_CONFIG[k];
  });
  const [items, setItems] = useState([]);
  const [caught, setCaught] = useState(false);
  const speedRef = useRef(2.5);
  const scoreRef = useRef(0);
  useEffect(() => {
    const iv = setInterval(() => {
      const isTarget = Math.random() > 0.55;
      const key = isTarget ? Object.keys(LETTER_CONFIG).find(k => LETTER_CONFIG[k] === target) : ALPHABET_KEYS.filter(k => LETTER_CONFIG[k] !== target)[Math.floor(Math.random() * 26)];
      const letter = LETTER_CONFIG[key || 'ba'];
      const shape = letter.shapes[Math.floor(Math.random() * letter.shapes.length)];
      setItems(prev => [...prev.filter(i => i.y < 110), { id: Date.now() + Math.random(), shape, isTarget, left: Math.random() * 75 + 5, y: -8, speed: speedRef.current }]);
    }, 900);
    return () => clearInterval(iv);
  }, [target]);
  useEffect(() => {
    const raf = requestAnimationFrame(function loop() {
      setItems(prev => prev.map(i => ({ ...i, y: i.y + i.speed * 0.4 })).filter(i => { if (i.y > 105) { if (i.isTarget) onMiss(); return false; } return true; }));
      requestAnimationFrame(loop);
    });
    return () => cancelAnimationFrame(raf);
  }, [onMiss]);
  const catchItem = (id, isTarget) => {
    setItems(prev => prev.filter(i => i.id !== id));
    if (isTarget) {
      onScore(2); scoreRef.current += 1; speedRef.current = Math.min(speedRef.current + 0.08, 6); setCaught(true);
      setTimeout(() => setCaught(false), 300);
      if (scoreRef.current % 5 === 0) { setTarget(LETTER_CONFIG[ALPHABET_KEYS[Math.floor(Math.random() * ALPHABET_KEYS.length)]]); }
    } else { onMiss(); }
  };
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute top-16 left-1/2 -translate-x-1/2 text-center z-10">
        <p className="text-white/50 text-xs font-bold uppercase tracking-widest">Catch only</p>
        <div className={`text-7xl arabic-font font-black transition-transform duration-150 ${caught ? 'scale-125' : 'scale-100'}`} style={{ color: target.accent }}>{target.char}</div>
      </div>
      {items.map(item => (
        <button key={item.id} onPointerDown={() => catchItem(item.id, item.isTarget)} className="absolute text-4xl arabic-font font-bold rounded-2xl px-4 py-3 transition-none touch-none"
          style={{ left: `${item.left}%`, top: `${item.y}%`, background: item.isTarget ? 'rgba(255,255,255,0.15)' : 'rgba(255,60,60,0.12)', border: `1px solid ${item.isTarget ? 'rgba(255,255,255,0.3)' : 'rgba(255,80,80,0.3)'}`, color: item.isTarget ? '#FFFFFF' : '#FF6666' }}>
          {item.shape}
        </button>
      ))}
    </div>
  );
};

const App = () => {
  const [gameState, setGameState] = useState('splash');
  const [selectedLetterKey, setSelectedLetterKey] = useState(null);
  const [currentMiniGame, setCurrentMiniGame] = useState(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [elements, setElements] = useState([]);
  const [currentTheme, setCurrentTheme] = useState('golden-age');
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [muted, setMuted] = useState(false);
  const [coins, setCoins] = useState(() => parseInt(localStorage.getItem('alphaMasterCoins') || '0'));
  const [unlockedThemes, setUnlockedThemes] = useState(() => JSON.parse(localStorage.getItem('alphaMasterThemes') || '["golden-age"]'));
  const [scores, setScores] = useState(() => JSON.parse(localStorage.getItem('alphabetMasterScores') || '{}'));
  const [dailyLetter, setDailyLetter] = useState(null);
  const [dailyDone, setDailyDone] = useState(false);
  const [streak, setStreak] = useState(() => parseInt(localStorage.getItem('alphaMasterStreak') || '0'));
  const audioRefs = useRef({});
  const bgMusicRef = useRef(null);
  const gameOverSent = useRef(false);
  const spawnRef = useRef(null);
  const { particles, spawnParticles } = useParticles();
  const { combo, comboLabel, multiplier, hit: comboHit, reset: comboReset } = useCombo();
  const currentLetter = selectedLetterKey ? LETTER_CONFIG[selectedLetterKey] : null;
  const currentLevel = getLevelData(score);
  const masteredCount = ALPHABET_KEYS.filter(k => (scores[k] || 0) >= 70).length;

  useEffect(() => {
    const root = document.documentElement;
    Object.entries(THEMES[currentTheme].styles).forEach(([k, v]) => root.style.setProperty(k, v));
  }, [currentTheme]);

  useEffect(() => {
    bgMusicRef.current = new Audio('/audio/abc_song.mp3');
    bgMusicRef.current.loop = true;
    bgMusicRef.current.volume = 0.25;
  }, []);

  const playSound = useCallback((filename) => {
    if (muted) return;
    const cached = audioRefs.current[filename];
    if (cached) { const c = cached.cloneNode(); c.volume = 0.8; c.play().catch(() => {}); }
  }, [muted]);

  const unlockAllAudio = useCallback(() => {
    ALPHABET_KEYS.forEach(key => {
      LETTER_CONFIG[key].sounds.forEach(f => {
        if (!audioRefs.current[f]) {
          const a = new Audio(`/audio/${f}`);
          a.preload = 'auto'; a.volume = 0; a.play().then(() => { a.pause(); a.currentTime = 0; a.volume = 1; }).catch(() => {});
          audioRefs.current[f] = a;
        }
      });
    });
  }, []);

  useEffect(() => {
    if (gameState === 'menu') bgMusicRef.current?.play().catch(() => {});
    else { bgMusicRef.current?.pause(); if (bgMusicRef.current) bgMusicRef.current.currentTime = 0; }
  }, [gameState]);

  const handleEnterHub = () => { setGameState('menu'); unlockAllAudio(); };

  const startLetterGame = (lk) => { setSelectedLetterKey(lk); setCurrentMiniGame(null); setScore(0); setLives(3); setElements([]); gameOverSent.current = false; comboReset(); setGameState('playing'); };
  const startMiniGame = (mk) => { setCurrentMiniGame(mk); setSelectedLetterKey(null); setScore(0); setLives(3); setElements([]); gameOverSent.current = false; comboReset(); setGameState('playing'); };
  const backToMenu = () => { clearInterval(spawnRef.current); setElements([]); setGameState('menu'); setSelectedLetterKey(null); setCurrentMiniGame(null); };

  const handleGameOver = useCallback(() => {
    if (gameOverSent.current) return;
    gameOverSent.current = true; clearInterval(spawnRef.current);
    const earnedCoins = Math.floor(score * (selectedLetterKey === dailyLetter ? 2 : 1));
    setCoins(c => c + earnedCoins);
    const key = selectedLetterKey || currentMiniGame;
    if (key) {
      setScores(prev => {
        const next = { ...prev, [key]: Math.max(prev[key] || 0, score) };
        localStorage.setItem('alphabetMasterScores', JSON.stringify(next)); return next;
      });
    }
    setGameState('gameover');
  }, [score, selectedLetterKey, currentMiniGame, dailyLetter]);

  useEffect(() => {
    if (gameState !== 'playing' || !currentLetter) return;
    spawnRef.current = setInterval(() => {
      const lvl = getLevelData(score);
      setElements(prev => {
        if (prev.length >= 15) return prev;
        const id = Date.now() + Math.random();
        const shape = currentLetter.shapes[Math.floor(Math.random() * currentLetter.shapes.length)];
        if (currentLetter.mode === 'whack') {
          const used = new Set(prev.map(e => e.holeIndex));
          const avail = [0,1,2,3,4,5,6,7,8].filter(i => !used.has(i));
          if (!avail.length) return prev;
          return [...prev, { id, holeIndex: avail[Math.floor(Math.random() * avail.length)], shape, type: 'whack', duration: lvl.speed * 1.1 }];
        } else if (currentLetter.mode === 'runner') { return [...prev, { id, top: Math.random() * 65 + 15, shape, duration: lvl.speed * 1.6, type: 'runner' }]; }
        else if (currentLetter.mode === 'lantern') { return [...prev, { id, left: Math.random() * 78 + 6, shape, duration: lvl.speed * 2.0, type: 'lantern' }]; }
        else { return [...prev, { id, left: Math.random() * 78 + 6, shape, duration: lvl.speed, type: 'rain' }]; }
      });
    }, getLevelData(score).spawnRate);
    return () => clearInterval(spawnRef.current);
  }, [gameState, selectedLetterKey, score, currentLetter]);

  const handleCatch = useCallback((id, clientX, clientY) => {
    if (gameState !== 'playing') return;
    const sounds = currentLetter.sounds;
    playSound(sounds[Math.floor(Math.random() * sounds.length)]);
    setElements(prev => prev.filter(e => e.id !== id));
    setScore(s => s + Math.ceil(multiplier)); comboHit();
    spawnParticles(clientX, clientY, currentLetter.accent, 10);
  }, [gameState, currentLetter, multiplier, comboHit, spawnParticles, playSound]);

  const handleMiss = useCallback((id) => {
    if (gameState !== 'playing') return;
    setElements(prev => {
      if (!prev.find(e => e.id === id)) return prev;
      comboReset(); setLives(l => { const next = l - 1; if (next <= 0) handleGameOver(); return next; });
      return prev.filter(e => e.id !== id);
    });
  }, [gameState, comboReset, handleGameOver]);

  const miniScore = (pts = 1) => { comboHit(); setScore(s => s + pts); };
  const miniMiss = () => { comboReset(); setLives(l => { const next = l - 1; if (next <= 0) handleGameOver(); return next; }); };

  return (
    <div className="relative w-full h-screen overflow-hidden touch-none select-none" style={{ background: 'var(--bg-main)', fontFamily: "'Tajawal', 'Amiri', sans-serif" }}>
      <FontLoader />
      <style>{`
        .arabic-font { font-family: 'Amiri', serif; }
        @keyframes fall       { 0%{transform:translateY(-120px)} 100%{transform:translateY(115vh)} }
        @keyframes riseUp     { 0%{transform:translateY(0)} 100%{transform:translateY(-115vh)} }
        @keyframes runner     { 0%{transform:translateX(-160px)} 100%{transform:translateX(115vw)} }
        @keyframes whackPop   { 0%{transform:translateY(100%)} 15%{transform:translateY(-20%)} 85%{transform:translateY(-20%)} 100%{transform:translateY(100%)} }
        @keyframes levelBang  { 0%{transform:scale(0.5);opacity:0} 20%{transform:scale(1.1);opacity:1} 80%{transform:scale(1);opacity:1} 100%{transform:scale(0.9);opacity:0} }
        .letter-fall { animation: fall linear forwards; }
        .letter-rise { animation: riseUp linear forwards; }
        .letter-runner { animation: runner linear forwards; }
        .letter-whack { animation: whackPop ease-in-out forwards; }
        .level-up-anim { animation: levelBang 2.2s ease-in-out forwards; }
      `}</style>

      {gameState === 'splash' && (
        <div className="absolute inset-0 z-[500] flex flex-col items-center justify-center bg-[#F5F5DC]">
          <div className="text-center mb-16">
            <div className="text-9xl arabic-font mb-4 text-[#800000]">الأبجدية</div>
            <h1 className="text-5xl font-black text-[#800000]">ALPHABET MASTER</h1>
          </div>
          <button onClick={handleEnterHub} className="px-20 py-10 bg-[#800000] text-[#D4AF37] text-6xl font-black rounded-[3rem] shadow-2xl active:scale-95 transition-transform">ENTER HUB</button>
        </div>
      )}

      {gameState === 'menu' && (
        <div className="absolute inset-0 z-[100] overflow-y-auto p-8 bg-[#F5F5DC]">
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-8">
               <h1 className="text-6xl font-black text-[#800000] arabic-font">Alphabet Master</h1>
               <button onClick={() => setMuted(m => !m)} className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">{muted ? <VolumeX /> : <Volume2 />}</button>
            </div>
            <div className="grid grid-cols-4 md:grid-cols-7 gap-4">
              {ALPHABET_KEYS.map(k => (
                <button key={k} onClick={() => startLetterGame(k)} className="aspect-square bg-white rounded-3xl flex items-center justify-center shadow-md active:scale-90 transition-transform">
                  <span className="text-4xl arabic-font font-bold text-[#800000]">{LETTER_CONFIG[k].char}</span>
                </button>
              ))}
            </div>
            <div className="mt-12 grid grid-cols-3 gap-4">
               {['memory', 'sorter', 'bazaar'].map(g => <button key={g} onClick={() => startMiniGame(g)} className="bg-white p-6 rounded-3xl shadow-lg font-black text-[#800000] uppercase tracking-widest">{g}</button>)}
            </div>
          </div>
        </div>
      )}

      {gameState === 'playing' && (
        <div className={`absolute inset-0 bg-gradient-to-br ${currentLetter?.bg || 'from-slate-900 to-black'}`}>
          <button onClick={backToMenu} className="absolute top-8 left-8 z-50 bg-white/20 p-4 rounded-2xl backdrop-blur-md"><ChevronLeft color="white" /></button>
          <div className="absolute top-8 right-8 flex flex-col items-end gap-2 z-50">
             <div className="bg-white/90 px-6 py-2 rounded-full font-black text-2xl flex items-center gap-2"><Star className="text-amber-500 fill-amber-500" />{score}</div>
             <div className="flex gap-1">{[...Array(3)].map((_, i) => <Heart key={i} size={24} className={i < lives ? 'text-red-500 fill-red-500' : 'text-white/20'} />)}</div>
          </div>
          {currentLetter?.mode === 'whack' && (
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <div className="grid grid-cols-3 gap-10 w-full max-w-lg aspect-square">
                {[...Array(9)].map((_, i) => {
                  const el = elements.find(e => e.holeIndex === i);
                  return (
                    <div key={i} className="relative w-full h-full rounded-full border-b-8 border-white/20 overflow-hidden flex items-end justify-center">
                      {el && (
                        <button onPointerDown={e => handleCatch(el.id, e.clientX, e.clientY)} className="letter-whack relative w-full h-[120%] bg-white rounded-t-[2.5rem] shadow-2xl flex items-center justify-center active:scale-95" style={{ animationDuration: `${el.duration}s` }}>
                          <span className="text-8xl arabic-font font-black pb-12" style={{ color: currentLetter.accent }}>{el.shape}</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {currentLetter?.mode === 'rain' && elements.map(el => (
            <button key={el.id} onPointerDown={e => handleCatch(el.id, e.clientX, e.clientY)} onAnimationEnd={() => handleMiss(el.id)} className="letter-fall absolute w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-2xl" style={{ left: `${el.left}%`, animationDuration: `${el.duration}s` }}>
              <span className="text-5xl arabic-font font-black" style={{ color: currentLetter.accent }}>{el.shape}</span>
            </button>
          ))}
          {currentLetter?.mode === 'runner' && elements.map(el => (
            <button key={el.id} onPointerDown={e => handleCatch(el.id, e.clientX, e.clientY)} onAnimationEnd={() => handleMiss(el.id)} className="letter-runner absolute w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-2xl" style={{ top: `${el.top}%`, animationDuration: `${el.duration}s` }}>
              <span className="text-5xl arabic-font font-black" style={{ color: currentLetter.accent }}>{el.shape}</span>
            </button>
          ))}
          {currentLetter?.mode === 'lantern' && elements.map(el => (
            <button key={el.id} onPointerDown={e => handleCatch(el.id, e.clientX, e.clientY)} onAnimationEnd={() => handleMiss(el.id)} className="letter-rise absolute w-24 h-32 bg-white rounded-t-full rounded-b-3xl flex flex-col items-center justify-center shadow-2xl" style={{ left: `${el.left}%`, animationDuration: `${el.duration}s` }}>
              <span className="text-4xl arabic-font font-black" style={{ color: currentLetter.accent }}>{el.shape}</span>
              <div className="w-3 h-5 bg-yellow-400 rounded-t-full mt-2" />
            </button>
          ))}
          {currentMiniGame === 'memory' && <MemoryGame onScore={miniScore} onMiss={miniMiss} />}
          {currentMiniGame === 'sorter' && <ShapeSorterGame onScore={miniScore} onMiss={miniMiss} />}
          {currentMiniGame === 'bazaar' && <BazaarRush onScore={miniScore} onMiss={miniMiss} />}
        </div>
      )}

      {gameState === 'gameover' && (
        <div className="absolute inset-0 z-[600] flex items-center justify-center bg-black/95 p-6">
          <div className="bg-white p-12 rounded-[3.5rem] text-center w-full max-w-sm">
             <h2 className="text-5xl font-black mb-6">GAME OVER</h2>
             <p className="text-7xl font-black mb-10">{score}</p>
             <button onClick={() => selectedLetterKey ? startLetterGame(selectedLetterKey) : startMiniGame(currentMiniGame)} className="w-full py-6 bg-slate-900 text-white rounded-3xl text-2xl font-black">TRY AGAIN</button>
             <button onClick={backToMenu} className="w-full mt-4 text-slate-400 font-bold uppercase tracking-widest">Back to Menu</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
