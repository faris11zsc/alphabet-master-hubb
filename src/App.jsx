import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, RotateCcw, Heart, Star, Trophy, ChevronLeft, Settings, ShoppingBag, Moon, Sun, Palette, Coins, Zap, Volume2, VolumeX } from 'lucide-react';

/* ═══════════════════════════════════════════
   GOOGLE FONT LOADER
══════════════════════════════════════════════ */
const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Cinzel+Decorative:wght@700;900&family=Tajawal:wght@400;700;900&display=swap');
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
  'ta':    { char:'ت', name:'Ta',    mode:'whack',   shapes:['ت','تـ','ـتـ','ـت'],                 sounds:['ت.m4a','تو.m4a','تي.m4a'],  bg:'from-rose-900 to-pink-950',     accent:'#FB7185' },
  'tha':   { char:'ث', name:'Tha',   mode:'rain',    shapes:['ث','ثـ','ـثـ','ـث'],                 sounds:['ث.m4a','ثو.m4a','ثي.m4a'],  bg:'from-violet-900 to-purple-950', accent:'#A78BFA' },
  'jeem':  { char:'ج', name:'Jeem',  mode:'runner',  shapes:['ج','جـ','ـجـ','ـج'],                 sounds:['ج.m4a','جو.m4a','جي.m4a'],  bg:'from-amber-900 to-yellow-950',  accent:'#FCD34D' },
  'haa':   { char:'ح', name:'Haa',   mode:'whack',   shapes:['ح','حـ','ـحـ','ـح'],                 sounds:['ح.m4a','حو.m4a','حي.m4a'],  bg:'from-cyan-900 to-sky-950',      accent:'#22D3EE' },
  'kha':   { char:'خ', name:'Kha',   mode:'rain',    shapes:['خ','خـ','ـخـ','ـخ'],                 sounds:['خ.m4a','خو.m4a','خي.m4a'],  bg:'from-orange-900 to-red-950',    accent:'#FB923C' },
  'dal':   { char:'د', name:'Dal',   mode:'runner',  shapes:['د','ـد'],                           sounds:['د.m4a','دو.m4a','دي.m4a'],  bg:'from-lime-900 to-green-950',    accent:'#86EFAC' },
  'thal':  { char:'ذ', name:'Thal',  mode:'rain',    shapes:['ذ','ـذ'],                           sounds:['ذ.m4a','ذو.m4a','ذي.m4a'],  bg:'from-fuchsia-900 to-violet-950',accent:'#E879F9' },
  'raa':   { char:'ر', name:'Raa',   mode:'runner',  shapes:['ر','ـر'],                           sounds:['ر.m4a','رو.m4a','ري.m4a'],  bg:'from-red-900 to-rose-950',      accent:'#F87171' },
  'zay':   { char:'ز', name:'Zay',   mode:'rain',    shapes:['ز','ـز'],                           sounds:['ز.m4a','زو.m4a','زي.m4a'],  bg:'from-teal-900 to-emerald-950',  accent:'#2DD4BF' },
  'seen':  { char:'س', name:'Seen',  mode:'whack',   shapes:['س','سـ','ـسـ','ـس'],                 sounds:['س.m4a','سو.m4a','سي.m4a'],  bg:'from-indigo-900 to-blue-950',   accent:'#818CF8' },
  'sheen': { char:'ش', name:'Sheen', mode:'rain',    shapes:['ش','شـ','ـشـ','ـش'],                 sounds:['ش.m4a','شو.m4a','شي.m4a'],  bg:'from-pink-900 to-fuchsia-950',  accent:'#F472B6' },
  'sad':   { char:'ص', name:'Sad',   mode:'runner',  shapes:['ص','صـ','ـصـ','ـص'],                 sounds:['ص.m4a','صو.m4a','صي.m4a'],  bg:'from-yellow-900 to-amber-950',  accent:'#FBBF24' },
  'dad':   { char:'ض', name:'Dad',   mode:'whack',   shapes:['ض','ضـ','ـضـ','ـض'],                 sounds:['ض.m4a','ضو.m4a','ضي.m4a'],  bg:'from-sky-900 to-cyan-950',      accent:'#38BDF8' },
  'taa':   { char:'ط', name:'Taa',   mode:'rain',    shapes:['ط','طـ','ـطـ','ـط'],                 sounds:['ط.m4a','طو.m4a','طي.m4a'],  bg:'from-green-900 to-lime-950',    accent:'#4ADE80' },
  'zaa':   { char:'ظ', name:'Zaa',   mode:'runner',  shapes:['ظ','ظـ','ـظـ','ـظ'],                 sounds:['ظ.m4a','ظو.m4a','ظي.m4a'],  bg:'from-purple-900 to-indigo-950', accent:'#C084FC' },
  'ayn':   { char:'ع', name:'Ayn',   mode:'whack',   shapes:['ع','عـ','ـعـ','ـع'],                 sounds:['ع.m4a','عو.m4a','عي.m4a'],  bg:'from-rose-900 to-red-950',      accent:'#FDA4AF' },
  'ghayn': { char:'غ', name:'Ghayn', mode:'rain',    shapes:['غ','غـ','ـغـ','ـغ'],                 sounds:['غ.m4a','غو.m4a','غي.m4a'],  bg:'from-amber-900 to-orange-950',  accent:'#FD8A10' },
  'faa':   { char:'ف', name:'Faa',   mode:'runner',  shapes:['ف','فـ','ـفـ','ـف'],                 sounds:['ف.m4a','فو.m4a','في.m4a'],  bg:'from-teal-900 to-cyan-950',     accent:'#5EEAD4' },
  'qaf':   { char:'ق', name:'Qaf',   mode:'rain',    shapes:['ق','قـ','ـقـ','ـق'],                 sounds:['ق.m4a','قو.m4a','قي.m4a'],  bg:'from-violet-900 to-purple-950', accent:'#8B5CF6' },
  'kaf':   { char:'ك', name:'Kaf',   mode:'whack',   shapes:['ك','كـ','ـكـ','ـك'],                 sounds:['ك.m4a','كو.m4a','كي.m4a'],  bg:'from-sky-900 to-blue-950',      accent:'#0EA5E9' },
  'lam':   { char:'ل', name:'Lam',   mode:'runner',  shapes:['ل','لـ','ـلـ','ـل'],                 sounds:['ل.m4a','لو.m4a','لي.m4a'],  bg:'from-emerald-900 to-green-950', accent:'#10B981' },
  'meem':  { char:'م', name:'Meem',  mode:'rain',    shapes:['م','مـ','ـمـ','ـم'],                 sounds:['م.m4a','مو.m4a','مي.m4a'],  bg:'from-pink-900 to-rose-950',     accent:'#EC4899' },
  'noon':  { char:'ن', name:'Noon',  mode:'whack',   shapes:['ن','نـ','ـنـ','ـن'],                 sounds:['ن.m4a','نو.m4a','ني.m4a'],  bg:'from-indigo-900 to-violet-950', accent:'#6366F1' },
  'haa2':  { char:'ه', name:'Ha',    mode:'lantern', shapes:['ه','هـ','ـهـ','ـه'],                 sounds:['ه.m4a','هو.m4a','هي.m4a'],  bg:'from-amber-900 to-yellow-950',  accent:'#F59E0B' },
  'waw':   { char:'و', name:'Waw',   mode:'lantern', shapes:['و','ـو'],                           sounds:['و.m4a','وو.m4a','وي.m4a'],  bg:'from-red-900 to-rose-950',      accent:'#EF4444' },
  'yaa':   { char:'ي', name:'Yaa',   mode:'lantern', shapes:['ي','يـ','ـيـ','ـي'],                 sounds:['ي.m4a','يو.m4a','يي.m4a'],  bg:'from-teal-900 to-emerald-950',  accent:'#14B8A6' },
};

/* ═══════════════════════════════════════════
   LEVEL DATA
══════════════════════════════════════════════ */
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

/* ═══════════════════════════════════════════
   PARTICLE SYSTEM
══════════════════════════════════════════════ */
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

/* ═══════════════════════════════════════════
   COMBO SYSTEM
══════════════════════════════════════════════ */
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

  const reset = useCallback(() => {
    setCombo(0);
    clearTimeout(timerRef.current);
  }, []);

  const multiplier = combo >= 20 ? 5 : combo >= 12 ? 4 : combo >= 8 ? 3 : combo >= 5 ? 2 : combo >= 3 ? 1.5 : 1;
  return { combo, comboLabel, multiplier, hit, reset };
};

/* ═══════════════════════════════════════════
   MEMORY GAME
══════════════════════════════════════════════ */
const MemoryGame = ({ letterKey, onScore, onMiss, onEnd }) => {
  const letter = LETTER_CONFIG[letterKey] || LETTER_CONFIG['ba'];
  const allShapes = letter.shapes;

  const generateCards = useCallback(() => {
    const pool = allShapes.length >= 4 ? allShapes : [...allShapes, ...allShapes].slice(0, 4);
    const pairs = pool.slice(0, 4);
    const deck = [...pairs, ...pairs].map((s, i) => ({ id: i, shape: s, flipped: false, matched: false }));
    return deck.sort(() => Math.random() - 0.5);
  }, [letterKey]);

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
        const matched = newCards.map((c, i) =>
          i === a || i === b ? { ...c, matched: true } : c
        );
        setCards(matched);
        setFlipped([]);
        setLocked(false);
        onScore(3);
        const newMatch = matchCount + 1;
        setMatchCount(newMatch);
        if (newMatch >= 4) setTimeout(() => { setCards(generateCards()); setMatchCount(0); setMoves(0); }, 600);
      } else {
        setTimeout(() => {
          setCards(newCards.map((c, i) =>
            i === a || i === b ? { ...c, flipped: false } : c
          ));
          setFlipped([]);
          setLocked(false);
          onMiss();
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
          <button key={card.id}
            onClick={() => flip(i)}
            className="aspect-square rounded-2xl flex items-center justify-center text-4xl arabic-font font-bold transition-all duration-300 active:scale-95 shadow-lg"
            style={{
              background: card.matched ? 'rgba(0,230,100,0.25)' : card.flipped ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.07)',
              border: `2px solid ${card.matched ? '#00E664' : card.flipped ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.1)'}`,
              color: card.flipped || card.matched ? letter.accent : 'transparent',
              transform: card.flipped || card.matched ? 'rotateY(0deg)' : 'rotateY(90deg)',
            }}
          >
            {card.flipped || card.matched ? card.shape : '?'}
          </button>
        ))}
      </div>
      <p className="text-white/30 text-xs">Find all matching pairs</p>
    </div>
  );
};

/* ═══════════════════════════════════════════
   SHAPE SORTER GAME
══════════════════════════════════════════════ */
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
  }, []);

  useEffect(() => { generate(currentLetterKey); }, [currentLetterKey]);

  const pick = (shape) => {
    if (feedback) return;
    if (shape === question.correctShape) {
      setFeedback('correct');
      onScore(2);
      setTimeout(() => {
        const newKey = keys[Math.floor(Math.random() * keys.length)];
        setCurrentLetterKey(newKey);
      }, 700);
    } else {
      setFeedback('wrong');
      onMiss();
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
          <button key={i} onClick={() => pick(shape)}
            className="aspect-square rounded-3xl flex items-center justify-center text-5xl arabic-font font-bold transition-all duration-200 active:scale-90"
            style={{
              background: feedback === 'correct' && shape === question.correctShape
                ? 'rgba(0,230,100,0.3)'
                : feedback === 'wrong' && shape !== question.correctShape
                ? 'rgba(255,50,50,0.2)'
                : 'rgba(255,255,255,0.08)',
              border: `2px solid ${feedback === 'correct' && shape === question.correctShape ? '#00E664' : 'rgba(255,255,255,0.15)'}`,
              color: letter.accent,
            }}
          >
            {shape}
          </button>
        ))}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   BAZAAR RUSH — catch the right letter falling
══════════════════════════════════════════════ */
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
      const key = isTarget
        ? Object.keys(LETTER_CONFIG).find(k => LETTER_CONFIG[k] === target)
        : ALPHABET_KEYS.filter(k => LETTER_CONFIG[k] !== target)[Math.floor(Math.random() * 26)];
      const letter = LETTER_CONFIG[key || 'ba'];
      const shape = letter.shapes[Math.floor(Math.random() * letter.shapes.length)];
      setItems(prev => [
        ...prev.filter(i => i.y < 110),
        { id: Date.now() + Math.random(), shape, isTarget, left: Math.random() * 75 + 5, y: -8, speed: speedRef.current, char: letter.char }
      ]);
    }, 900);
    return () => clearInterval(iv);
  }, [target]);

  useEffect(() => {
    const raf = requestAnimationFrame(function loop() {
      setItems(prev =>
        prev.map(i => ({ ...i, y: i.y + i.speed * 0.4 })).filter(i => {
          if (i.y > 105) { if (i.isTarget) onMiss(); return false; }
          return true;
        })
      );
      requestAnimationFrame(loop);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  const catchItem = (id, isTarget) => {
    setItems(prev => prev.filter(i => i.id !== id));
    if (isTarget) {
      onScore(2);
      scoreRef.current += 1;
      speedRef.current = Math.min(speedRef.current + 0.08, 6);
      setCaught(true);
      setTimeout(() => setCaught(false), 300);
      if (scoreRef.current % 5 === 0) {
        const newKey = ALPHABET_KEYS[Math.floor(Math.random() * ALPHABET_KEYS.length)];
        setTarget(LETTER_CONFIG[newKey]);
      }
    } else {
      onMiss();
    }
  };

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute top-16 left-1/2 -translate-x-1/2 text-center z-10">
        <p className="text-white/50 text-xs font-bold uppercase tracking-widest">Catch only</p>
        <div className={`text-7xl arabic-font font-black transition-transform duration-150 ${caught ? 'scale-125' : 'scale-100'}`}
          style={{ color: target.accent }}>{target.char}</div>
        <p className="text-white/40 text-xs">{target.name}</p>
      </div>
      {items.map(item => (
        <button key={item.id}
          onPointerDown={() => catchItem(item.id, item.isTarget)}
          className="absolute text-4xl arabic-font font-bold rounded-2xl px-4 py-3 transition-none touch-none"
          style={{
            left: `${item.left}%`,
            top: `${item.y}%`,
            background: item.isTarget ? 'rgba(255,255,255,0.15)' : 'rgba(255,60,60,0.12)',
            border: `1px solid ${item.isTarget ? 'rgba(255,255,255,0.3)' : 'rgba(255,80,80,0.3)'}`,
            color: item.isTarget ? '#FFFFFF' : '#FF6666',
            pointerEvents: 'auto',
          }}
        >
          {item.shape}
        </button>
      ))}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/50 to-transparent pointer-events-none z-10" />
    </div>
  );
};

/* ═══════════════════════════════════════════
   MAIN APP
══════════════════════════════════════════════ */
const App = () => {
  const [gameState, setGameState]           = useState('splash');
  const [selectedLetterKey, setSelectedLetterKey] = useState(null);
  const [currentMiniGame, setCurrentMiniGame]     = useState(null);
  const [score, setScore]                   = useState(0);
  const [lives, setLives]                   = useState(3);
  const [elements, setElements]             = useState([]);
  const [currentTheme, setCurrentTheme]     = useState('golden-age');
  const [showLevelUp, setShowLevelUp]       = useState(false);
  const [muted, setMuted]                   = useState(false);
  const [coins, setCoins]                   = useState(() => { try { return parseInt(localStorage.getItem('alphaMasterCoins') || '0'); } catch { return 0; } });
  const [unlockedThemes, setUnlockedThemes] = useState(() => { try { return JSON.parse(localStorage.getItem('alphaMasterThemes') || '["golden-age"]'); } catch { return ['golden-age']; } });
  const [scores, setScores]                 = useState(() => { try { return JSON.parse(localStorage.getItem('alphabetMasterScores') || '{}'); } catch { return {}; } });
  const [dailyLetter, setDailyLetter]       = useState(null);
  const [dailyDone, setDailyDone]           = useState(false);
  const [streak, setStreak]                 = useState(() => { try { return parseInt(localStorage.getItem('alphaMasterStreak') || '0'); } catch { return 0; } });

  const audioRefs    = useRef({});
  const bgMusicRef   = useRef(null);
  const gameOverSent = useRef(false);
  const spawnRef     = useRef(null);

  const { particles, spawnParticles } = useParticles();
  const { combo, comboLabel, multiplier, hit: comboHit, reset: comboReset } = useCombo();

  const currentLetter = selectedLetterKey ? LETTER_CONFIG[selectedLetterKey] : null;
  const currentLevel  = getLevelData(score);
  const masteredCount = ALPHABET_KEYS.filter(k => (scores[k] || 0) >= 70).length;
  const themeStyles   = THEMES[currentTheme].styles;

  /* ── apply theme CSS vars ── */
  useEffect(() => {
    const root = document.documentElement;
    Object.entries(themeStyles).forEach(([k, v]) => root.style.setProperty(k, v));
  }, [themeStyles]);

  /* ── daily challenge ── */
  useEffect(() => {
    const today = new Date().toDateString();
    const savedDay = localStorage.getItem('dailyLetterDay');
    if (savedDay === today) {
      setDailyLetter(localStorage.getItem('dailyLetter'));
      setDailyDone(localStorage.getItem('dailyDone') === 'true');
    } else {
      const k = ALPHABET_KEYS[Math.floor(Math.random() * ALPHABET_KEYS.length)];
      localStorage.setItem('dailyLetterDay', today);
      localStorage.setItem('dailyLetter', k);
      localStorage.setItem('dailyDone', 'false');
      setDailyLetter(k);
      setDailyDone(false);
    }
  }, []);

  /* ── persist coins / themes ── */
  useEffect(() => { localStorage.setItem('alphaMasterCoins', coins.toString()); }, [coins]);
  useEffect(() => { localStorage.setItem('alphaMasterThemes', JSON.stringify(unlockedThemes)); }, [unlockedThemes]);

  /* ── audio setup ── */
  useEffect(() => {
    bgMusicRef.current = new Audio('/audio/abc_song.mp3');
    bgMusicRef.current.loop = true;
    bgMusicRef.current.volume = 0.25;
    return () => bgMusicRef.current?.pause();
  }, []);

  useEffect(() => {
    if (bgMusicRef.current) bgMusicRef.current.muted = muted;
    Object.values(audioRefs.current).forEach(a => { if (a) a.muted = muted; });
  }, [muted]);

  useEffect(() => {
    if (gameState === 'menu') bgMusicRef.current?.play().catch(() => {});
    else bgMusicRef.current?.pause();
  }, [gameState]);

  const playSound = useCallback((filename) => {
    if (muted) return;
    const cached = audioRefs.current[filename];
    if (cached) { const c = cached.cloneNode(); c.volume = 0.8; c.play().catch(() => {}); }
  }, [muted]);

  const preloadSounds = useCallback(async () => {
    for (const k of ALPHABET_KEYS) {
      for (const f of LETTER_CONFIG[k].sounds) {
        if (audioRefs.current[f]) continue;
        const a = new Audio(`/audio/${f}`);
        a.preload = 'auto';
        try { await a.load(); } catch {}
        audioRefs.current[f] = a;
        await new Promise(r => setTimeout(r, 8));
      }
    }
  }, []);

  useEffect(() => { if (gameState === 'splash') preloadSounds(); }, [gameState]);

  /* ── level-up banner ── */
  useEffect(() => {
    const thresholds = [10, 20, 35, 50, 70, 90, 115];
    if (score > 0 && thresholds.includes(score)) {
      setShowLevelUp(true);
      setTimeout(() => setShowLevelUp(false), 2200);
    }
  }, [score]);

  /* ── game starters ── */
  const startLetterGame = (lk) => {
    setSelectedLetterKey(lk);
    setCurrentMiniGame(null);
    setScore(0); setLives(3); setElements([]);
    gameOverSent.current = false;
    comboReset();
    setGameState('playing');
  };

  const startMiniGame = (mk) => {
    setCurrentMiniGame(mk);
    setSelectedLetterKey(null);
    setScore(0); setLives(3); setElements([]);
    gameOverSent.current = false;
    comboReset();
    setGameState('playing');
  };

  const backToMenu = () => {
    clearInterval(spawnRef.current);
    setElements([]);
    setGameState('menu');
    setSelectedLetterKey(null);
    setCurrentMiniGame(null);
  };

  /* ── game over handler ── */
  const handleGameOver = useCallback(() => {
    if (gameOverSent.current) return;
    gameOverSent.current = true;
    clearInterval(spawnRef.current);

    const earnedCoins = Math.floor(score * (selectedLetterKey === dailyLetter ? 2 : 1));
    setCoins(c => c + earnedCoins);

    const key = selectedLetterKey || currentMiniGame;
    if (key) {
      setScores(prev => {
        const best = prev[key] || 0;
        if (score > best) {
          const next = { ...prev, [key]: score };
          localStorage.setItem('alphabetMasterScores', JSON.stringify(next));
          return next;
        }
        return prev;
      });
    }

    if (selectedLetterKey === dailyLetter && !dailyDone) {
      setDailyDone(true);
      localStorage.setItem('dailyDone', 'true');
      const newStreak = streak + 1;
      setStreak(newStreak);
      localStorage.setItem('alphaMasterStreak', newStreak.toString());
    }

    setTimeout(() => setGameState('gameover'), 200);
  }, [score, selectedLetterKey, currentMiniGame, dailyLetter, dailyDone, streak]);

  /* ── letter game spawning ── */
  useEffect(() => {
    if (gameState !== 'playing' || !currentLetter) return;
    clearInterval(spawnRef.current);
    const mode = currentLetter.mode;

    spawnRef.current = setInterval(() => {
      const lvl = getLevelData(score);
      setElements(prev => {
        if (prev.length >= 18) return prev;
        const id  = Date.now() + Math.random();
        const shape = currentLetter.shapes[Math.floor(Math.random() * currentLetter.shapes.length)];

        if (mode === 'whack') {
          const usedHoles = new Set(prev.map(e => e.holeIndex));
          const available = [...Array(9).keys()].filter(i => !usedHoles.has(i));
          if (!available.length) return prev;
          const holeIndex = available[Math.floor(Math.random() * available.length)];
          return [...prev, { id, holeIndex, shape, type: 'whack', duration: lvl.speed * 1.1 }];
        } else if (mode === 'runner') {
          return [...prev, { id, top: Math.random() * 65 + 15, shape, duration: lvl.speed * 1.6, type: 'runner' }];
        } else if (mode === 'lantern') {
          return [...prev, { id, left: Math.random() * 78 + 6, shape, duration: lvl.speed * 2.0, type: 'lantern' }];
        } else {
          return [...prev, { id, left: Math.random() * 78 + 6, shape, duration: lvl.speed, type: 'rain' }];
        }
      });
    }, getLevelData(score).spawnRate);

    return () => clearInterval(spawnRef.current);
  }, [gameState, selectedLetterKey, score, currentLetter]);

  /* ── whack timeout ── */
  useEffect(() => {
    if (gameState !== 'playing' || currentLetter?.mode !== 'whack') return;
    const timers = new Map();
    elements.filter(e => e.type === 'whack').forEach(el => {
      if (!timers.has(el.id)) {
        const t = setTimeout(() => handleMiss(el.id), el.duration * 1000);
        timers.set(el.id, t);
      }
    });
    return () => timers.forEach(t => clearTimeout(t));
  }, [elements, gameState]);

  /* ── catch / miss ── */
  const handleCatch = useCallback((id, clientX, clientY) => {
    if (gameState !== 'playing') return;
    const letter = LETTER_CONFIG[selectedLetterKey];
    if (letter?.sounds?.length) {
      playSound(letter.sounds[Math.floor(Math.random() * letter.sounds.length)]);
    }
    setElements(prev => prev.filter(e => e.id !== id));
    const points = Math.ceil(multiplier);
    setScore(s => s + points);
    comboHit();
    spawnParticles(clientX, clientY, letter?.accent || '#D4AF37', 10);
  }, [gameState, selectedLetterKey, multiplier, comboHit, spawnParticles, playSound]);

  const handleMiss = useCallback((id) => {
    if (gameState !== 'playing') return;
    setElements(prev => {
      if (!prev.find(e => e.id === id)) return prev;
      comboReset();
      setLives(l => {
        const next = l - 1;
        if (next <= 0) handleGameOver();
        return next;
      });
      return prev.filter(e => e.id !== id);
    });
  }, [gameState, comboReset, handleGameOver]);

  /* ── mini-game score/miss bridges ── */
  const miniScore = useCallback((pts = 1) => {
    comboHit();
    setScore(s => s + pts);
  }, [comboHit]);

  const miniMiss = useCallback(() => {
    comboReset();
    setLives(l => {
      const next = l - 1;
      if (next <= 0) handleGameOver();
      return next;
    });
  }, [comboReset, handleGameOver]);

  /* ═════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════ */
  return (
    <div className="relative w-full h-screen overflow-hidden touch-none select-none"
      style={{ background: 'var(--bg-main)', fontFamily: "'Tajawal', 'Amiri', sans-serif" }}>
      <FontLoader />
      <style>{`
        :root { font-size: 16px; }
        .arabic-font { font-family: 'Amiri', serif; }
        .display-font { font-family: 'Cinzel Decorative', serif; }
        @keyframes fall       { 0%{transform:translateY(-120px) rotate(0deg)} 100%{transform:translateY(115vh) rotate(15deg)} }
        @keyframes riseUp     { 0%{transform:translateY(0)} 100%{transform:translateY(-115vh)} }
        @keyframes runner     { 0%{transform:translateX(-160px)} 100%{transform:translateX(115vw)} }
        @keyframes whackPop   { 0%{clip-path:inset(100% 0 0 0)} 20%{clip-path:inset(0% 0 0 0)} 80%{clip-path:inset(0% 0 0 0)} 100%{clip-path:inset(100% 0 0 0)} }
        @keyframes floatUp    { 0%{transform:translateY(0) scale(1);opacity:1} 100%{transform:translateY(-80px) scale(1.4);opacity:0} }
        @keyframes levelBang  { 0%{transform:scale(0.5) translateY(40px);opacity:0} 20%{transform:scale(1.1) translateY(0);opacity:1} 80%{transform:scale(1) translateY(0);opacity:1} 100%{transform:scale(0.9) translateY(-30px);opacity:0} }
        @keyframes pulse-glow { 0%,100%{box-shadow:0 0 0 0 rgba(212,175,55,0.4)} 50%{box-shadow:0 0 0 12px rgba(212,175,55,0)} }
        @keyframes shimmer    { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @keyframes orbDrift   { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(30px,-20px) scale(1.05)} 66%{transform:translate(-20px,15px) scale(0.97)} }
        @keyframes particleFly { 0%{transform:translate(0,0) scale(1);opacity:1} 100%{transform:translate(var(--vx),var(--vy)) scale(0);opacity:0} }
        @keyframes comboSlide { 0%{transform:translateY(20px);opacity:0} 20%{transform:translateY(0);opacity:1} 70%{opacity:1} 100%{opacity:0;transform:translateY(-20px)} }
        .letter-fall    { animation: fall linear forwards; }
        .letter-rise    { animation: riseUp linear forwards; }
        .letter-runner  { animation: runner linear forwards; }
        .letter-whack   { animation: whackPop ease-in-out forwards; overflow:hidden; }
        .float-text     { animation: floatUp 0.7s ease-out forwards; }
        .level-up-anim  { animation: levelBang 2.2s ease-in-out forwards; }
        .combo-anim     { animation: comboSlide 1.2s ease-in-out forwards; }
        .orb            { animation: orbDrift 8s ease-in-out infinite; }
        .particle-fly   { animation: particleFly 0.85s ease-out forwards; }
      `}</style>

      {/* ────── AMBIENT ORBS (menu + splash) ────── */}
      {(gameState === 'splash' || gameState === 'menu') && (
        <>
          <div className="orb absolute w-96 h-96 rounded-full pointer-events-none opacity-20"
            style={{ background: `radial-gradient(circle, var(--accent2) 0%, transparent 70%)`, top: '-10%', left: '-10%' }} />
          <div className="orb absolute w-80 h-80 rounded-full pointer-events-none opacity-15"
            style={{ background: `radial-gradient(circle, var(--accent) 0%, transparent 70%)`, bottom: '5%', right: '-5%', animationDelay: '-4s' }} />
        </>
      )}

      {/* ────── PARTICLES ────── */}
      {particles.map(p => (
        <div key={p.id} className="particle-fly absolute pointer-events-none rounded-full z-[999]"
          style={{
            left: p.x - p.size / 2, top: p.y - p.size / 2,
            width: p.size, height: p.size,
            background: p.color,
            '--vx': `${p.vx}px`, '--vy': `${p.vy}px`,
          }} />
      ))}

      {/* ────── COMBO LABEL ────── */}
      {comboLabel && (
        <div className="combo-anim absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[990] text-5xl font-black pointer-events-none"
          style={{ color: 'var(--gold)', textShadow: '0 0 30px var(--gold)' }}>
          {comboLabel.text}
        </div>
      )}

      {/* ────── LEVEL UP ────── */}
      {showLevelUp && (
        <div className="level-up-anim absolute top-1/3 left-1/2 -translate-x-1/2 z-[980] pointer-events-none text-center">
          <p className="text-4xl font-black tracking-widest" style={{ color: 'var(--gold)', textShadow: '0 0 20px var(--gold)' }}>
            LEVEL UP ✦
          </p>
          <p className="text-lg font-bold mt-1" style={{ color: 'var(--text-secondary)' }}>{currentLevel.name}</p>
        </div>
      )}

      {/* ══════════════ SPLASH ══════════════ */}
      {gameState === 'splash' && (
        <div className="absolute inset-0 z-[500] flex flex-col items-center justify-center"
          style={{ background: 'var(--splash-bg)' }}>
          <div className="text-center mb-16 z-10">
            <div className="text-9xl arabic-font mb-4" style={{ color: 'var(--gold)', textShadow: '0 0 60px var(--gold)' }}>الأبجدية</div>
            <h1 className="display-font text-5xl font-black tracking-wider" style={{ color: 'var(--text-primary)' }}>ALPHABET MASTER</h1>
            <div className="h-px w-64 mx-auto mt-4" style={{ background: `linear-gradient(90deg, transparent, var(--gold), transparent)` }} />
          </div>
          <button
            onClick={() => { bgMusicRef.current?.play().catch(() => {}); setGameState('menu'); }}
            className="relative z-10 px-16 py-7 rounded-[2rem] font-black text-2xl tracking-widest uppercase transition-all active:scale-95"
            style={{
              background: `linear-gradient(135deg, var(--accent), var(--accent2))`,
              color: '#FFF',
              boxShadow: '0 0 40px var(--accent), 0 8px 32px rgba(0,0,0,0.5)',
              animation: 'pulse-glow 2s infinite',
            }}>
            Enter ✦
          </button>
          <p className="mt-8 text-sm tracking-widest" style={{ color: 'var(--text-secondary)' }}>TAP TO BEGIN YOUR JOURNEY</p>
        </div>
      )}

      {/* ══════════════ MENU ══════════════ */}
      {gameState === 'menu' && (
        <div className="absolute inset-0 z-[100] overflow-y-auto">
          <div className="max-w-2xl mx-auto px-4 pb-20 pt-6">
            {/* Top Bar */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--gold)' }}>🪙</span>
                <span className="font-black text-lg" style={{ color: 'var(--text-primary)' }}>{coins}</span>
              </div>
              <div className="display-font text-2xl font-black" style={{ color: 'var(--gold)' }}>✦ A M ✦</div>
              <div className="flex gap-2">
                <button onClick={() => setMuted(m => !m)}
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  {muted ? <VolumeX size={18} color="var(--text-secondary)" /> : <Volume2 size={18} color="var(--gold)" />}
                </button>
                <button onClick={() => setGameState('shop')}
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <ShoppingBag size={18} color="var(--gold)" />
                </button>
              </div>
            </div>

            {/* Progress Overview */}
            <div className="rounded-3xl p-5 mb-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div className="flex justify-between items-center mb-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>Mastered</p>
                  <p className="text-3xl font-black" style={{ color: 'var(--text-primary)' }}>{masteredCount}<span className="text-base font-bold" style={{ color: 'var(--text-secondary)' }}>/28</span></p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>Streak</p>
                  <p className="text-3xl font-black" style={{ color: 'var(--gold)' }}>🔥 {streak}</p>
                </div>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-main)' }}>
                <div className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${(masteredCount / 28) * 100}%`, background: `linear-gradient(90deg, var(--accent), var(--gold))` }} />
              </div>
            </div>

            {/* Daily Challenge */}
            {dailyLetter && (
              <div className="rounded-3xl p-5 mb-6"
                style={{ background: `linear-gradient(135deg, var(--bg-card2), var(--bg-card))`, border: `1px solid var(--gold)`, boxShadow: 'var(--glow)' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--gold)' }}>✦ Daily Challenge</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-5xl arabic-font" style={{ color: LETTER_CONFIG[dailyLetter]?.accent }}>
                        {LETTER_CONFIG[dailyLetter]?.char}
                      </span>
                      <div>
                        <p className="font-black" style={{ color: 'var(--text-primary)' }}>{LETTER_CONFIG[dailyLetter]?.name}</p>
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>2× coins reward</p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => !dailyDone && startLetterGame(dailyLetter)}
                    disabled={dailyDone}
                    className="px-5 py-3 rounded-2xl font-black text-sm transition active:scale-95"
                    style={{
                      background: dailyDone ? 'rgba(255,255,255,0.05)' : `linear-gradient(135deg, var(--accent), var(--accent2))`,
                      color: dailyDone ? 'var(--text-secondary)' : '#FFF',
                      opacity: dailyDone ? 0.6 : 1,
                    }}>
                    {dailyDone ? '✓ Done' : 'Play'}
                  </button>
                </div>
              </div>
            )}

            {/* Letter Grid */}
            <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: 'var(--text-secondary)' }}>Letters</p>
            <div className="grid grid-cols-7 gap-2 mb-8">
              {ALPHABET_KEYS.map(k => {
                const mastered = (scores[k] || 0) >= 70;
                const started  = (scores[k] || 0) > 0;
                return (
                  <button key={k} onClick={() => startLetterGame(k)}
                    className="aspect-square rounded-2xl flex flex-col items-center justify-center transition-all active:scale-90 relative"
                    style={{
                      background: mastered
                        ? `linear-gradient(135deg, var(--accent)22, var(--gold)22)`
                        : 'var(--bg-card)',
                      border: mastered
                        ? `1px solid var(--gold)`
                        : started
                        ? `1px solid var(--accent)`
                        : `1px solid var(--border)`,
                      boxShadow: mastered ? 'var(--glow)' : 'none',
                    }}>
                    {mastered && <div className="absolute top-0.5 right-0.5 text-[10px]">⭐</div>}
                    <span className="text-2xl arabic-font font-bold" style={{ color: mastered ? 'var(--gold)' : 'var(--text-primary)' }}>
                      {LETTER_CONFIG[k].char}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Mini Games */}
            <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: 'var(--text-secondary)' }}>Mini Games</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'memory',   icon: '🏮', title: 'Lantern Memory',  desc: 'Match the letter shapes',    cost: 0 },
                { id: 'sorter',   icon: '🔤', title: 'Shape Sorter',    desc: 'Identify connected forms',   cost: 0 },
                { id: 'bazaar',   icon: '🏃', title: 'Bazaar Rush',     desc: 'Catch the correct letter',   cost: 0 },
              ].map(g => (
                <button key={g.id} onClick={() => startMiniGame(g.id)}
                  className="rounded-3xl p-4 text-left transition-all active:scale-95"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <span className="text-3xl">{g.icon}</span>
                  <p className="font-black mt-2 text-sm" style={{ color: 'var(--text-primary)' }}>{g.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{g.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════ SHOP ══════════════ */}
      {gameState === 'shop' && (
        <div className="absolute inset-0 z-[400] overflow-y-auto" style={{ background: 'var(--bg-main)' }}>
          <div className="max-w-lg mx-auto px-4 pt-6 pb-20">
            <div className="flex items-center gap-4 mb-8">
              <button onClick={() => setGameState('menu')}
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <ChevronLeft size={20} color="var(--text-primary)" />
              </button>
              <h2 className="display-font text-3xl font-black" style={{ color: 'var(--gold)' }}>Shop</h2>
              <div className="ml-auto flex items-center gap-1 px-4 py-2 rounded-full"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <span>🪙</span>
                <span className="font-black" style={{ color: 'var(--text-primary)' }}>{coins}</span>
              </div>
            </div>
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--text-secondary)' }}>Themes</p>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(THEMES).map(([key, theme]) => {
                const owned = unlockedThemes.includes(key);
                const active = currentTheme === key;
                return (
                  <div key={key} className="rounded-3xl p-5 flex flex-col"
                    style={{
                      background: 'var(--bg-card)',
                      border: `1px solid ${active ? 'var(--gold)' : 'var(--border)'}`,
                      boxShadow: active ? 'var(--glow)' : 'none',
                    }}>
                    <div className="w-full h-16 rounded-2xl mb-3" style={{ background: theme.styles['--splash-bg'] }} />
                    <p className="font-black text-sm" style={{ color: 'var(--text-primary)' }}>{theme.name}</p>
                    <button
                      onClick={() => {
                        if (owned) { setCurrentTheme(key); setGameState('menu'); }
                        else if (coins >= theme.cost) {
                          setCoins(c => c - theme.cost);
                          setUnlockedThemes(p => [...p, key]);
                          setCurrentTheme(key);
                          setGameState('menu');
                        }
                      }}
                      disabled={!owned && coins < theme.cost}
                      className="mt-3 py-2 rounded-xl text-xs font-black uppercase tracking-wide transition active:scale-95"
                      style={{
                        background: active ? 'var(--gold)' : owned ? 'var(--accent)' : 'var(--bg-card2)',
                        color: active ? '#000' : '#FFF',
                        opacity: !owned && coins < theme.cost ? 0.4 : 1,
                        border: `1px solid ${active ? 'var(--gold)' : 'var(--border)'}`,
                      }}>
                      {active ? '✓ Active' : owned ? 'Select' : `🪙 ${theme.cost}`}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════ PLAYING ══════════════ */}
      {gameState === 'playing' && (
        <div className={`absolute inset-0 bg-gradient-to-br ${currentLetter?.bg || 'from-slate-900 to-black'}`}>

          {/* HUD */}
          <div className="absolute top-0 left-0 right-0 flex justify-between items-start p-4 z-50 pointer-events-none">
            <button onClick={backToMenu}
              className="pointer-events-auto w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-md"
              style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.15)' }}>
              <ChevronLeft size={24} color="white" />
            </button>

            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md"
                style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.15)' }}>
                <Star size={18} className="fill-amber-400 text-amber-400" />
                <span className="font-black text-xl text-white">{score}</span>
                {combo >= 3 && <span className="text-xs font-black" style={{ color: 'var(--gold)' }}>×{multiplier.toFixed(1)}</span>}
              </div>
              <div className="flex gap-1.5">
                {[...Array(3)].map((_, i) => (
                  <Heart key={i} size={22} className={i < lives ? 'text-red-400 fill-red-400' : 'text-white/20'} />
                ))}
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.4)' }}>{currentLevel.name}</p>
              </div>
            </div>
          </div>

          {/* Letter Name Banner */}
          {currentLetter && (
            <div className="absolute top-20 left-1/2 -translate-x-1/2 text-center z-40 pointer-events-none">
              <span className="text-6xl arabic-font font-black" style={{ color: currentLetter.accent, textShadow: `0 0 30px ${currentLetter.accent}` }}>
                {currentLetter.char}
              </span>
            </div>
          )}

          {/* RAIN MODE */}
          {currentLetter?.mode === 'rain' && elements.map(el => (
            <button key={el.id}
              onPointerDown={e => { e.stopPropagation(); handleCatch(el.id, e.clientX, e.clientY); }}
              className="letter-fall absolute touch-none pointer-events-auto rounded-3xl flex items-center justify-center backdrop-blur-sm"
              style={{
                left: `${el.left}%`,
                top: 0,
                width: 72, height: 72,
                animationDuration: `${el.duration}s`,
                background: 'rgba(255,255,255,0.12)',
                border: `2px solid ${currentLetter.accent}44`,
                zIndex: 30,
              }}>
              <span className="text-4xl arabic-font font-black" style={{ color: currentLetter.accent }}>{el.shape}</span>
            </button>
          ))}

          {/* RUNNER MODE */}
          {currentLetter?.mode === 'runner' && elements.map(el => (
            <button key={el.id}
              onPointerDown={e => { e.stopPropagation(); handleCatch(el.id, e.clientX, e.clientY); }}
              className="letter-runner absolute touch-none pointer-events-auto rounded-3xl flex items-center justify-center"
              style={{
                top: `${el.top}%`,
                left: 0,
                width: 80, height: 80,
                animationDuration: `${el.duration}s`,
                background: 'rgba(255,255,255,0.12)',
                border: `2px solid ${currentLetter.accent}44`,
                zIndex: 30,
              }}
              onAnimationEnd={() => handleMiss(el.id)}>
              <span className="text-4xl arabic-font font-black" style={{ color: currentLetter.accent }}>{el.shape}</span>
            </button>
          ))}

          {/* LANTERN MODE (rise from bottom) */}
          {currentLetter?.mode === 'lantern' && elements.map(el => (
            <button key={el.id}
              onPointerDown={e => { e.stopPropagation(); handleCatch(el.id, e.clientX, e.clientY); }}
              className="letter-rise absolute touch-none pointer-events-auto rounded-full flex flex-col items-center justify-center"
              style={{
                left: `${el.left}%`,
                bottom: -80,
                width: 68, height: 90,
                animationDuration: `${el.duration}s`,
                background: 'rgba(255,200,50,0.15)',
                border: `2px solid rgba(255,200,50,0.4)`,
                zIndex: 30,
              }}
              onAnimationEnd={() => handleMiss(el.id)}>
              <span className="text-3xl">🏮</span>
              <span className="text-2xl arabic-font font-black" style={{ color: currentLetter.accent }}>{el.shape}</span>
            </button>
          ))}

          {/* WHACK MODE */}
          {currentLetter?.mode === 'whack' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="grid grid-cols-3 gap-5 w-full max-w-xs px-4 mt-20">
                {[...Array(9)].map((_, i) => {
                  const el = elements.find(e => e.holeIndex === i);
                  return (
                    <div key={i} className="relative aspect-square flex items-end justify-center">
                      <div className="w-full h-5 rounded-full" style={{ background: 'rgba(0,0,0,0.4)' }} />
                      {el && (
                        <button
                          onPointerDown={e => { e.stopPropagation(); handleCatch(el.id, e.clientX, e.clientY); }}
                          className="letter-whack absolute inset-0 rounded-3xl flex items-center justify-center touch-none pointer-events-auto"
                          style={{
                            animationDuration: `${el.duration}s`,
                            background: `linear-gradient(180deg, ${currentLetter.accent}30, rgba(255,255,255,0.1))`,
                            border: `2px solid ${currentLetter.accent}66`,
                            zIndex: 30,
                          }}>
                          <span className="text-5xl arabic-font font-black" style={{ color: currentLetter.accent }}>{el.shape}</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* MINI GAMES */}
          {currentMiniGame === 'memory' && (
            <MemoryGame
              letterKey={ALPHABET_KEYS[Math.floor(Math.random() * ALPHABET_KEYS.length)]}
              onScore={miniScore} onMiss={miniMiss} onEnd={handleGameOver} />
          )}
          {currentMiniGame === 'sorter' && (
            <ShapeSorterGame onScore={miniScore} onMiss={miniMiss} />
          )}
          {currentMiniGame === 'bazaar' && (
            <BazaarRush onScore={miniScore} onMiss={miniMiss} />
          )}
        </div>
      )}

      {/* ══════════════ GAME OVER ══════════════ */}
      {gameState === 'gameover' && (
        <div className="absolute inset-0 z-[600] flex items-center justify-center p-6"
          style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(20px)' }}>
          <div className="w-full max-w-sm rounded-[3rem] overflow-hidden"
            style={{ background: 'var(--bg-card)', border: `1px solid var(--gold)`, boxShadow: '0 0 60px rgba(0,0,0,0.6)' }}>
            <div className="p-8 text-center">
              {/* Trophy */}
              <div className="text-7xl mb-2">
                {score >= 50 ? '🏆' : score >= 20 ? '🥈' : '🔄'}
              </div>
              <h2 className="display-font text-3xl font-black mb-1" style={{ color: 'var(--text-primary)' }}>
                {score >= 50 ? 'Excellent!' : score >= 20 ? 'Well Done' : 'Game Over'}
              </h2>
              <p className="text-sm font-bold" style={{ color: 'var(--text-secondary)' }}>{currentLevel.name}</p>

              {/* Score Box */}
              <div className="mt-6 p-6 rounded-2xl" style={{ background: 'var(--bg-main)' }}>
                <p className="text-xs font-black uppercase tracking-widest mb-1" style={{ color: 'var(--text-secondary)' }}>Score</p>
                <p className="text-6xl font-black" style={{ color: 'var(--text-primary)' }}>{score}</p>
                <div className="h-px w-full my-4" style={{ background: 'var(--border)' }} />
                <div className="flex justify-around text-center">
                  <div>
                    <p className="text-2xl font-black" style={{ color: 'var(--gold)' }}>
                      {scores[selectedLetterKey || currentMiniGame || ''] || score}
                    </p>
                    <p className="text-[10px] font-bold uppercase" style={{ color: 'var(--text-secondary)' }}>Best</p>
                  </div>
                  <div>
                    <p className="text-2xl font-black" style={{ color: 'var(--accent2)' }}>+{Math.floor(score * (selectedLetterKey === dailyLetter ? 2 : 1))} 🪙</p>
                    <p className="text-[10px] font-bold uppercase" style={{ color: 'var(--text-secondary)' }}>Earned</p>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <button
                onClick={() => selectedLetterKey ? startLetterGame(selectedLetterKey) : startMiniGame(currentMiniGame)}
                className="w-full mt-5 py-5 rounded-2xl font-black text-xl transition active:scale-95"
                style={{ background: `linear-gradient(135deg, var(--accent), var(--accent2))`, color: '#FFF' }}>
                Try Again
              </button>
              <button onClick={backToMenu}
                className="w-full mt-3 py-3 rounded-2xl text-sm font-black uppercase tracking-widest transition active:scale-95"
                style={{ color: 'var(--text-secondary)' }}>
                Back to Menu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;