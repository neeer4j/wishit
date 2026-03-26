'use client';
import { useState, useEffect, useRef } from 'react';

const CATEGORIES = [
  { value: 'birthday', label: 'Birthday', icon: '🎂' },
  { value: 'love', label: 'Love', icon: '🌹' },
  { value: 'friendship', label: 'Friendship', icon: '🫧' },
  { value: 'anniversary', label: 'Anniversary', icon: '💍' },
  { value: 'parents', label: 'Parents', icon: '🌿' },
  { value: 'colleague', label: 'Colleague', icon: '✦' },
  { value: 'new_year', label: 'New Year', icon: '🎆' },
  { value: 'graduation', label: 'Graduation', icon: '🎓' },
  { value: 'farewell', label: 'Farewell', icon: '🌅' },
  { value: 'get_well', label: 'Get Well', icon: '🌻' },
  { value: 'congratulations', label: 'Congrats', icon: '🏆' },
  { value: 'baby_shower', label: 'Baby Shower', icon: '🍼' },
];

const TEMPLATES = {
  birthday: `Happy Birthday, [Name] 🎂\n\nMay this day be as wonderful as you are. Wishing you joy, laughter, and everything that makes your heart smile. Here's to you!`,
  love: `My dearest [Name],\n\nEvery moment with you feels like a dream I never want to wake from. You are my favourite thought. Love, always.`,
  friendship: `Hey [Name] 🫧\n\nI just wanted to remind you how grateful I am to have you in my life. You make every ordinary day feel extraordinary.`,
  anniversary: `To [Name], with all my heart 💍\n\nAnother year of us — of laughter, adventures, and a love that only deepens. Here's to forever.`,
  parents: `Dear [Name] 🌿\n\nThank you for every sacrifice and every moment of unconditional love. You are my greatest blessing.`,
  colleague: `[Name],\n\nWorking alongside you has been an absolute pleasure. Wishing you all the success you deserve. ✦`,
  new_year: `Dear [Name] 🎆\n\nAs the new year dawns, I wish you a fresh start filled with new possibilities, great adventures, and boundless joy. Happy New Year!`,
  graduation: `Congratulations, [Name]! 🎓\n\nAll your hard work and dedication have led to this beautiful moment. The world is ready for everything you have to offer. Go shine!`,
  farewell: `Dear [Name] 🌅\n\nEvery goodbye makes way for a new hello. Wishing you all the best on this exciting new chapter — you'll be missed more than words can say.`,
  get_well: `Hey [Name] 🌻\n\nSending you healing thoughts and warm wishes. Take all the rest you need — we'll be here cheering you on every step of the way. Get well soon!`,
  congratulations: `Congratulations, [Name]! 🏆\n\nYou did it! This achievement is a testament to your passion, perseverance, and brilliance. So incredibly proud of you.`,
  baby_shower: `To the wonderful [Name] 🍼\n\nA tiny new miracle is on the way! Wishing you all the joy, love, and laughter that the next beautiful chapter of life will bring.`,
};

// All 15 backgrounds with category affinity tags
const BGS = [
  { id: 'v1065-110', src: '/assets/v1065-110.jpg', cats: ['birthday', 'love', 'congratulations'] },
  { id: '18929278', src: '/assets/18929278_rm175-noon-03b.jpg', cats: ['love', 'anniversary'] },
  { id: '16398080', src: '/assets/16398080_v729-noon-4a.jpg', cats: ['friendship', 'farewell'] },
  { id: '119781', src: '/assets/119781.jpg', cats: ['parents', 'get_well'] },
  { id: '126893', src: '/assets/126893.jpg', cats: ['birthday', 'love', 'baby_shower'] },
  { id: '139683', src: '/assets/139683.jpg', cats: ['anniversary', 'parents'] },
  { id: '16340746', src: '/assets/16340746_v802-tang-19.jpg', cats: ['new_year', 'graduation'] },
  { id: '16351030', src: '/assets/16351030_v850-sasi-18.jpg', cats: ['friendship', 'get_well'] },
  { id: '169295', src: '/assets/169295.jpg', cats: ['birthday', 'baby_shower'] },
  { id: '18705968', src: '/assets/18705968_rm184-aum-05e.jpg', cats: ['colleague', 'farewell'] },
  { id: '18930119', src: '/assets/18930119_rm428-0056.jpg', cats: ['congratulations', 'graduation'] },
  { id: '2150241036', src: '/assets/2150241036.jpg', cats: ['new_year', 'anniversary'] },
  { id: '393', src: '/assets/393.jpg', cats: ['baby_shower', 'parents'] },
  { id: '78', src: '/assets/78.jpg', cats: ['get_well', 'friendship'] },
  { id: 'bg', src: '/assets/bg.jpg', cats: ['colleague', 'graduation', 'farewell'] },
];

const FONTS = [
  { id: 'playfair', label: 'Playfair', style: 'var(--font-playfair), serif', italic: true },
  { id: 'cormorant', label: 'Cormorant', style: 'var(--font-cormorant), serif', italic: true },
  { id: 'lora', label: 'Lora', style: 'var(--font-lora), serif', italic: true },
  { id: 'cinzel', label: 'Cinzel', style: 'var(--font-cinzel), serif', italic: false },
  { id: 'dancing', label: 'Dancing', style: 'var(--font-dancing), cursive', italic: false },
  { id: 'sacramento', label: 'Sacramento', style: 'var(--font-sacramento), cursive', italic: false },
  { id: 'greatvibes', label: 'Great Vibes', style: 'var(--font-great-vibes), cursive', italic: false },
  { id: 'dmsans', label: 'Modern', style: 'var(--font-dm-sans), sans-serif', italic: false },
];

const FONT_COLORS = [
  { id: 'white', label: 'White', hex: '#FFFFFF' },
  { id: 'cream', label: 'Cream', hex: '#FFF8EE' },
  { id: 'gold', label: 'Gold', hex: '#F5D07A' },
  { id: 'rose', label: 'Rose', hex: '#F4A8B0' },
  { id: 'blush', label: 'Blush', hex: '#E8C4B8' },
  { id: 'lilac', label: 'Lilac', hex: '#C9B8E8' },
  { id: 'mint', label: 'Mint', hex: '#A8E8C4' },
  { id: 'sky', label: 'Sky', hex: '#A8D4F5' },
  { id: 'peach', label: 'Peach', hex: '#F5C4A8' },
  { id: 'silver', label: 'Silver', hex: '#C8D6E0' },
];

const EXPIRY_OPTIONS = [
  { label: '1 day', value: 1 },
  { label: '2 days', value: 2 },
  { label: '3 days', value: 3 },
  { label: '4 days', value: 4 },
  { label: '5 days', value: 5 },
  { label: '6 days', value: 6 },
  { label: '1 week', value: 7 },
  { label: '8 days', value: 8 },
  { label: '9 days', value: 9 },
  { label: '10 days', value: 10 },
  { label: '11 days', value: 11 },
  { label: '12 days', value: 12 },
  { label: '13 days', value: 13 },
  { label: '2 weeks', value: 14 },
];

const PETALS = Array.from({ length: 12 }, (_, i) => ({
  id: i, left: `${(i * 8.3) % 94}%`, delay: `${i * 0.9}s`, dur: `${10 + (i % 4) * 2.5}s`,
  size: 11 + (i % 4) * 4, char: ['🌸', '✦', '·', '♡', '✿'][i % 5],
}));

// Prebuilt royalty-free music tracks
const MUSIC_TRACKS = [
  {
    id: 'birthday',
    label: '🎂 Happy Birthday',
    src: 'https://cdn.pixabay.com/audio/2022/03/15/audio_3d0f6e52d7.mp3',
    cats: ['birthday'],
  },
  {
    id: 'love',
    label: '🎵 Romantic Piano',
    src: 'https://cdn.pixabay.com/audio/2023/09/04/audio_b1c90e5484.mp3',
    cats: ['love', 'anniversary'],
  },
  {
    id: 'cheerful',
    label: '✨ Cheerful Bells',
    src: 'https://cdn.pixabay.com/audio/2022/10/30/audio_b99e0d6d5f.mp3',
    cats: ['congratulations', 'graduation', 'baby_shower', 'new_year'],
  },
  {
    id: 'calm',
    label: '🌿 Calm Acoustic',
    src: 'https://cdn.pixabay.com/audio/2022/10/25/audio_946d33eabb.mp3',
    cats: ['parents', 'get_well', 'farewell', 'friendship'],
  },
  {
    id: 'celebration',
    label: '🎆 Fanfare',
    src: 'https://cdn.pixabay.com/audio/2022/11/22/audio_febc508520.mp3',
    cats: ['congratulations', 'new_year', 'graduation'],
  },
];

export default function Home() {
  const [step, setStep] = useState(1);
  const [category, setCat] = useState('');
  const [form, setForm] = useState({ sender: '', receiver: '', message: '', passkey: '' });
  const [selBg, setSelBg] = useState(BGS[0].id);
  const [hoverBg, setHoverBg] = useState(null);
  const [bgIdx, setBgIdx] = useState(0);
  const [loadedBgs, setLoadedBgs] = useState([0, 1]); // Only load first 2 images
  const [wishId, setWishId] = useState(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [font, setFont] = useState('playfair');
  const [overlayOpacity, setOverlayOpacity] = useState(0.55);
  const [expiryDays, setExpiryDays] = useState(1);
  const [scheduledAt, setScheduledAt] = useState('');
  const [showQr, setShowQr] = useState(false);
  const [selMusic, setSelMusic] = useState(null);
  const [fontColor, setFontColor] = useState('#FFFFFF'); // default white
  const qrCanvasRef = useRef(null);
  const [playingPreview, setPlayingPreview] = useState(false);
  const previewAudioRef = useRef(null);

  // Auth state
  const [session, setSession] = useState(null); // { userId, username }
  const [authTab, setAuthTab] = useState('login');
  const [authForm, setAuthForm] = useState({ username: '', password: '' });
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authDone, setAuthDone] = useState(false);
  const [myWishes, setMyWishes] = useState([]);
  const [myWishesLoading, setMyWishesLoading] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Stop playing if they change the track
  useEffect(() => {
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
      setPlayingPreview(false);
    }
  }, [selMusic]);

  const togglePreview = () => {
    if (!previewAudioRef.current) return;
    if (playingPreview) {
      previewAudioRef.current.pause();
      setPlayingPreview(false);
    } else {
      previewAudioRef.current.play().then(() => setPlayingPreview(true)).catch(() => {});
    }
  };

  // Restore session from localStorage
  useEffect(() => {
    try { const s = localStorage.getItem('wishit_session'); if (s) setSession(JSON.parse(s)); } catch { }
  }, []);

  useEffect(() => {
    if (step !== 1) return;
    const t = setInterval(() => {
      setBgIdx(i => {
        const nextIdx = (i + 1) % BGS.length;
        // Preload the next image so it's ready for next rotation
        setLoadedBgs(prev => {
          const toAdd = (nextIdx + 1) % BGS.length;
          return prev.includes(toAdd) ? prev : [...prev, toAdd];
        });
        return nextIdx;
      });
    }, 7000);
    return () => clearInterval(t);
  }, [step]);

  // Auto-generate QR code when step 3 loads
  useEffect(() => {
    if (step !== 3 || !wishId) return;
    (async () => {
      try {
        const QRCode = (await import('qrcode')).default;
        const url = `${window.location.origin}/wish/${wishId}`;
        await QRCode.toCanvas(qrCanvasRef.current, url, {
          width: 200, margin: 2,
          color: { dark: '#1a0e08', light: '#FFFBF7' },
        });
        setShowQr(true);
      } catch (e) { console.error('QR error', e); }
    })();
  }, [step, wishId]);

  // Handle URL reply params — if coming back from a wish with ?reply=...
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const to = params.get('to');
    const cat = params.get('category');
    const replyTo = params.get('reply');
    if (to || cat) {
      if (cat && CATEGORIES.find(c => c.value === cat)) {
        const found = CATEGORIES.find(c => c.value === cat);
        setCat(found.value);
        setForm(f => ({ ...f, receiver: to || '', message: TEMPLATES[found.value] || '' }));
        // auto-select best bg
        const catBg = BGS.find(b => b.cats.includes(found.value));
        if (catBg) setSelBg(catBg.id);
        setStep(2);
      }
    }
  }, []);

  const selectCat = (c) => {
    setCat(c.value);
    setForm(f => ({ ...f, message: TEMPLATES[c.value] || '' }));
    // Auto-select best matching background
    const catBg = BGS.find(b => b.cats.includes(c.value));
    if (catBg) setSelBg(catBg.id);
    // Auto-suggest music for this category
    const catTrack = MUSIC_TRACKS.find(t => t.cats.includes(c.value));
    setSelMusic(catTrack ? catTrack.id : null);
    setStep(2);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.message.trim()) return;
    setLoading(true);
    try {
      let expires_at = null;
      if (expiryDays) {
        const d = new Date();
        d.setDate(d.getDate() + expiryDays);
        expires_at = d.toISOString();
      }
      const scheduled_at = scheduledAt ? new Date(scheduledAt).toISOString() : null;

      const res = await fetch('/api/wishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category, ...form, bg_image: selBg,
          font, overlay_opacity: overlayOpacity,
          expires_at, scheduled_at,
          user_id: session?.userId || null,
          music: selMusic || null,
          font_color: fontColor || null,
        }),
      });
      const data = await res.json();
      if (data.id) { setWishId(data.id); setStep(3); if (session?.userId) setAuthDone(true); }
      else alert(data.error || 'Something went wrong');
    } catch { alert('Network error. Please try again.'); }
    finally { setLoading(false); }
  };

  const wishUrl = wishId && typeof window !== 'undefined' ? `${window.location.origin}/wish/${wishId}` : '';

  const copyLink = async () => {
    try { await navigator.clipboard.writeText(wishUrl); }
    catch { const el = document.createElement('textarea'); el.value = wishUrl; document.body.appendChild(el); el.select(); document.execCommand('copy'); document.body.removeChild(el); }
    setCopied(true); setTimeout(() => setCopied(false), 2500);
  };

  const nativeShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: 'A wish for you 💌', text: 'Someone sent you a heartfelt wish!', url: wishUrl }); }
      catch { /* cancelled */ }
    }
  };

  const downloadQr = () => {
    const canvas = qrCanvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'wish-qr.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const saveSession = (s) => {
    setSession(s);
    localStorage.setItem('wishit_session', JSON.stringify(s));
  };

  const logout = () => {
    setSession(null);
    localStorage.removeItem('wishit_session');
    setAuthDone(false);
    setAuthForm({ username: '', password: '' });
    setAuthError('');
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    if (!authForm.username.trim() || !authForm.password) return;
    setAuthLoading(true);
    setAuthError('');
    try {
      const endpoint = authTab === 'signup' ? '/api/auth/signup' : '/api/auth/login';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: authForm.username.trim(), password: authForm.password }),
      });
      const data = await res.json();
      if (!res.ok) { setAuthError(data.error || 'Something went wrong'); return; }
      saveSession({ userId: data.userId, username: data.username });
      if (wishId) {
        await fetch('/api/auth/claim', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ wishId, userId: data.userId }),
        });
        setAuthDone(true);
      }
    } catch { setAuthError('Network error. Please try again.'); }
    finally { setAuthLoading(false); }
  };

  const loadMyWishes = async (userId) => {
    setMyWishesLoading(true);
    try {
      const res = await fetch(`/api/user/wishes?userId=${userId}`);
      const data = await res.json();
      setMyWishes(data.wishes || []);
    } catch { }
    finally { setMyWishesLoading(false); }
  };

  const cat = CATEGORIES.find(c => c.value === category);
  const activeBgId = hoverBg || selBg;
  const bgSrc = BGS.find(b => b.id === activeBgId)?.src;
  const wallBg = BGS[bgIdx].src;
  const fontStyle = FONTS.find(f => f.id === font)?.style || FONTS[0].style;
  const fontItalic = FONTS.find(f => f.id === font)?.italic ?? true;

  // Filtered and sorted backgrounds for the picker (category matches first)
  const sortedBgs = category
    ? [...BGS].sort((a, b) => {
      const aM = a.cats.includes(category) ? 0 : 1;
      const bM = b.cats.includes(category) ? 0 : 1;
      return aM - bM;
    })
    : BGS;

  return (
    <>
      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html,body{height:100%;overflow:hidden;font-family:'DM Sans',sans-serif;-webkit-font-smoothing:antialiased;color:#fff;background:#0d0705}
        input,textarea,button,select{font-family:inherit}
        input::placeholder,textarea::placeholder{color:rgba(255,255,255,0.4)}
        textarea{resize:none}
        ::-webkit-scrollbar{width:0}
        input[type="datetime-local"]::-webkit-calendar-picker-indicator{filter:invert(1);opacity:0.5;cursor:pointer}

        @keyframes floatDown{0%{transform:translateY(-8vh) rotate(0deg);opacity:0}8%{opacity:.6}92%{opacity:.4}100%{transform:translateY(108vh) rotate(380deg);opacity:0}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes slideUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.04)}}

        .su  { animation: slideUp 0.45s cubic-bezier(.16,1,.3,1) both }
        .su2 { animation: slideUp 0.45s .08s cubic-bezier(.16,1,.3,1) both }
        .fi  { animation: fadeIn 0.35s ease both }

        .glass{background:rgba(255,255,255,0.07);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.12);border-radius:18px;overflow:hidden}
        .strip{height:3px;background:linear-gradient(90deg,#E8C4B8,#C9726B,#9B6E7A,#8A9E8B)}

        .cat-btn{display:flex;align-items:center;gap:10px;padding:12px 14px;background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.1);border-radius:14px;cursor:pointer;color:rgba(255,255,255,0.85);font-size:13px;font-weight:500;text-align:left;width:100%;transition:all .25s cubic-bezier(.16,1,.3,1);position:relative;overflow:hidden}
        .cat-btn::before{content:'';position:absolute;inset:0;border-radius:14px;opacity:0;background:linear-gradient(135deg,rgba(232,196,184,0.15),rgba(201,114,107,0.15),rgba(155,110,122,0.15));transition:opacity .25s}
        .cat-btn:hover{border-color:rgba(232,196,184,0.4);transform:translateY(-2px);box-shadow:0 6px 24px rgba(0,0,0,0.25),0 0 0 1px rgba(232,196,184,0.15)}
        .cat-btn:hover::before{opacity:1}
        .cat-btn:active{transform:translateY(0) scale(0.98)}
        .cat-icon{width:34px;height:34px;border-radius:10px;background:rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;transition:background .25s}
        .cat-btn:hover .cat-icon{background:rgba(232,196,184,0.2)}
        @keyframes shimmer{0%{background-position:200% center}100%{background-position:-200% center}}
        @keyframes heartbeat{0%,100%{transform:scale(1)}15%{transform:scale(1.2)}30%{transform:scale(1)}45%{transform:scale(1.1)}60%{transform:scale(1)}}
        .credit-pill{display:inline-flex;align-items:center;gap:6px;padding:7px 16px;border-radius:999px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);backdrop-filter:blur(10px);font-size:11px;letter-spacing:.5px;color:transparent;background-clip:text;-webkit-background-clip:text;background-image:linear-gradient(90deg,rgba(255,255,255,0.35),rgba(232,196,184,0.7),rgba(201,114,107,0.7),rgba(232,196,184,0.7),rgba(255,255,255,0.35));background-size:200%;animation:shimmer 4s linear infinite}
        .credit-heart{animation:heartbeat 2.2s ease-in-out infinite;display:inline-block;color:rgba(201,114,107,0.9);-webkit-background-clip:unset;background-clip:unset}

        .overlay-inp{background:rgba(0,0,0,0.22);border:none;border-bottom:1px solid rgba(255,255,255,0.3);border-radius:0;color:#fff;font-size:14px;outline:none;padding:7px 2px;width:100%;transition:border-color .2s}
        .overlay-inp:focus{border-bottom-color:rgba(255,255,255,0.75)}
        .overlay-inp::placeholder{color:rgba(255,255,255,0.38)}

        /* Premium From/To card inputs */
        .name-card{background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.14);border-radius:12px;padding:10px 13px;display:flex;flex-direction:column;gap:3px;transition:border-color .22s,background .22s,box-shadow .22s;cursor:text}
        .name-card:focus-within{background:rgba(255,255,255,0.1);border-color:rgba(255,255,255,0.38);box-shadow:0 0 0 3px rgba(255,255,255,0.06)}
        .name-card-label{font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:rgba(255,255,255,0.4);line-height:1}
        .name-card-inp{background:transparent;border:none;outline:none;color:#fff;font-size:14px;font-family:inherit;width:100%;padding:0;line-height:1.4}
        .name-card-inp::placeholder{color:rgba(255,255,255,0.3)}

        .overlay-msg{background:transparent;border:none;color:#fff;font-size:15px;font-style:italic;line-height:1.8;outline:none;padding:0;width:100%;flex:1}
        .overlay-msg::placeholder{color:rgba(255,255,255,0.38);font-style:italic}

        .bg-thumb{height:52px;border-radius:8px;overflow:hidden;cursor:pointer;border:2px solid transparent;padding:0;position:relative;transition:transform .18s,border-color .18s,box-shadow .18s;background:#111}
        .bg-thumb:hover{transform:scale(1.05);border-color:rgba(255,255,255,0.45)}
        .bg-thumb.sel{border-color:#fff;box-shadow:0 0 0 3px rgba(255,255,255,0.25)}
        .bg-thumb.cat-match{border-color:rgba(201,114,107,0.7);box-shadow:0 0 0 2px rgba(201,114,107,0.25)}

        .font-btn{padding:6px 12px;border-radius:8px;border:1px solid rgba(255,255,255,0.15);background:rgba(255,255,255,0.07);color:rgba(255,255,255,0.7);font-size:12px;cursor:pointer;transition:all .2s;white-space:nowrap}
        .font-btn.sel{border-color:rgba(255,255,255,0.55);background:rgba(255,255,255,0.15);color:#fff}

        .btn-main{width:100%;padding:13px;border:none;border-radius:12px;background:rgba(255,255,255,0.92);color:#1a0e08;font-size:15px;font-weight:700;cursor:pointer;transition:all .22s;letter-spacing:.1px}
        .btn-main:hover:not(:disabled){background:#fff;transform:translateY(-1px);box-shadow:0 6px 20px rgba(0,0,0,.35)}
        .btn-main:disabled{opacity:.5;cursor:not-allowed}

        .share-btn{display:flex;align-items:center;justify-content:center;gap:7px;padding:11px;border-radius:11px;border:1px solid rgba(255,255,255,0.15);background:rgba(255,255,255,0.08);color:rgba(255,255,255,0.8);font-size:13px;font-weight:600;cursor:pointer;transition:all .2s;text-decoration:none;width:100%}
        .share-btn:hover{background:rgba(255,255,255,0.15);border-color:rgba(255,255,255,0.3);color:#fff;transform:translateY(-1px)}
        .share-btn.wa{background:rgba(37,211,102,0.15);border-color:rgba(37,211,102,0.3);color:rgba(150,255,180,0.9)}
        .share-btn.wa:hover{background:rgba(37,211,102,0.25)}

        .slider{-webkit-appearance:none;appearance:none;width:100%;height:4px;border-radius:2px;background:rgba(255,255,255,0.18);outline:none;cursor:pointer}
        .slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:16px;height:16px;border-radius:50%;background:#fff;cursor:pointer;box-shadow:0 0 6px rgba(0,0,0,0.4)}
        .slider::-moz-range-thumb{width:16px;height:16px;border-radius:50%;background:#fff;cursor:pointer;border:none}

        .option-inp{background:rgba(0,0,0,0.3);border:1px solid rgba(255,255,255,0.15);border-radius:9px;color:#fff;font-size:13px;padding:9px 11px;outline:none;width:100%;transition:border-color .2s}
        .option-inp:focus{border-color:rgba(255,255,255,0.4)}
        .option-inp option{background:#1a0e08;color:#fff}

        .auth-tab{flex:1;padding:8px;text-align:center;font-size:13px;font-weight:600;color:rgba(255,255,255,0.4);border-bottom:2px solid transparent;cursor:pointer;transition:all .2s}
        .auth-tab.active{color:#fff;border-bottom-color:rgba(201,114,107,0.8)}
        .auth-inp{background:rgba(0,0,0,0.2);border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:10px 12px;color:#fff;font-size:13px;width:100%;margin-bottom:8px;outline:none;transition:border-color .2s}
        .auth-inp:focus{border-color:rgba(255,255,255,0.3)}

        .bg-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:5px;width:100%}
        .bg-thumb{height:40px;border-radius:7px;overflow:hidden;cursor:pointer;border:2px solid transparent;padding:0;position:relative;transition:transform .18s,border-color .18s,box-shadow .18s;background:#111}
        .bg-thumb:hover{transform:scale(1.06);border-color:rgba(255,255,255,0.45)}
        .bg-thumb.sel{border-color:#fff;box-shadow:0 0 0 3px rgba(255,255,255,0.25)}
        .bg-thumb.cat-match{border-color:rgba(201,114,107,0.7);box-shadow:0 0 0 2px rgba(201,114,107,0.25)}

        /* Step 2 two-panel layout */
        .step2-shell{width:100%;max-width:900px;display:flex;flex-direction:column;gap:10px;padding:0 12px;overflow-y:auto;max-height:calc(100dvh - 80px);scrollbar-width:none}
        .step2-shell::-webkit-scrollbar{display:none}
        .step2-panels{display:grid;grid-template-columns:1fr;gap:10px}
        .step2-left{display:flex;flex-direction:column;gap:8px}
        .step2-right{display:flex;flex-direction:column;gap:8px}
        @media(min-width:640px){
          .step2-shell{overflow:hidden;max-height:none;padding:0 16px}
          .step2-panels{grid-template-columns:190px 1fr;align-items:start;gap:14px}
          .step2-right{gap:7px}
        }
        .scroll-content{overflow-y:auto;max-height:calc(100dvh - 120px);padding:0 16px 16px;display:flex;flex-direction:column;gap:10px;scrollbar-width:none}
        .scroll-content::-webkit-scrollbar{display:none}
      `}</style>

      {/* ── Rotating wallpaper (step 1 only) */}
      {BGS.map((bg, i) => loadedBgs.includes(i) ? (
        <div key={bg.id} style={{ position: 'fixed', inset: 0, zIndex: 0, backgroundImage: `url(${bg.src})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: step === 1 ? (i === bgIdx ? 1 : 0) : 0, transition: 'opacity 2.5s ease', willChange: 'opacity' }} />
      ) : null)}

      {/* Step 2: selected bg as fixed full-screen */}
      {step === 2 && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 0, backgroundImage: `url(${bgSrc})`, backgroundSize: 'cover', backgroundPosition: 'center', transition: 'background-image 0.6s ease' }} />
      )}

      {/* Dark overlay — adjustable in step 2 */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 1, background: step === 2
          ? `linear-gradient(to bottom, rgba(0,0,0,${overlayOpacity * 0.5}) 0%, rgba(0,0,0,${overlayOpacity}) 60%, rgba(0,0,0,${Math.min(overlayOpacity + 0.15, 0.9)}) 100%)`
          : 'linear-gradient(160deg,rgba(12,6,3,0.55),rgba(12,6,3,0.65))',
        transition: 'background 0.3s'
      }} />

      {/* Petals */}
      {mounted && PETALS.map(p => (
        <div key={p.id} style={{ position: 'fixed', left: p.left, top: '-28px', fontSize: p.size, zIndex: 1, pointerEvents: 'none', opacity: .35, animation: `floatDown ${p.dur} ${p.delay} linear infinite`, willChange: 'transform' }}>{p.char}</div>
      ))}

      {/* ── Content */}
      <div style={{ position: 'relative', zIndex: 2, height: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: step === 2 ? '0' : '0 16px' }}>

        {/* Brand / Header */}
        <div className="su" style={{ textAlign: 'center', marginBottom: step === 2 ? 6 : 18, padding: step === 2 ? '12px 0 0' : '0', position: 'relative', width: '100%', maxWidth: 440 }}>
          {step === 1 && (
            <button
              onClick={() => { setStep('mine'); if (session?.userId) loadMyWishes(session.userId); }}
              style={{ position: 'absolute', right: 0, top: 0, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 20, padding: '6px 14px', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center', gap: 6 }}
            >
              {session ? `👤 ${session.username}` : 'My Wishes'}
            </button>
          )}

          <p style={{ fontSize: 10, letterSpacing: '4px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginBottom: 7 }}>✦ wishit ✦</p>
          {step !== 2 && step !== 'mine' && (
            <h1 style={{ fontFamily: 'Playfair Display,serif', fontSize: 'clamp(26px,5vw,36px)', fontWeight: 700, lineHeight: 1.15, textShadow: '0 2px 20px rgba(0,0,0,.4)' }}>
              {step === 1 && <><span>Send a wish</span><br /><em style={{ fontWeight: 400 }}>from the heart</em></>}
              {step === 3 && <em style={{ fontWeight: 400 }}>Your wish is ready</em>}
            </h1>
          )}
          {step === 'mine' && (
            <h1 style={{ fontFamily: 'Playfair Display,serif', fontSize: 'clamp(26px,5vw,36px)', fontWeight: 700, lineHeight: 1.15, textShadow: '0 2px 20px rgba(0,0,0,.4)' }}>
              <em style={{ fontWeight: 400 }}>My Wishes</em>
            </h1>
          )}
        </div>

        {/* ── STEP 1 ── */}
        {step === 1 && (
          <div className="glass su2" style={{ width: '100%', maxWidth: 440 }}>
            <div className="strip" />
            <div style={{ padding: '18px 18px 20px' }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.45)', letterSpacing: '.5px', textTransform: 'uppercase', marginBottom: 12 }}>What's the occasion?</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {CATEGORIES.map(c => (
                  <button key={c.value} className="cat-btn" onClick={() => selectCat(c)}>
                    <span className="cat-icon">{c.icon}</span>
                    <span style={{ lineHeight: 1.2 }}>{c.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 2: two-panel layout ── */}
        {step === 2 && (
          <div className="su step2-shell">

            {/* Top bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 10, flexShrink: 0 }}>
              <button onClick={() => setStep(1)} style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: 8, color: 'rgba(255,255,255,0.7)', fontSize: 12, cursor: 'pointer', padding: '5px 11px', whiteSpace: 'nowrap', flexShrink: 0 }}>← Back</button>
              <p style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.4)', letterSpacing: '.5px', textTransform: 'uppercase' }}>Background — <span style={{ color: 'rgba(201,114,107,0.8)' }}>pink = best match</span></p>
            </div>

            {/* Two-panel area */}
            <div className="step2-panels">

              {/* LEFT: background picker */}
              <div className="step2-left">
                <div className="bg-grid">
                  {sortedBgs.map(bg => (
                    <button key={bg.id} className={`bg-thumb${selBg === bg.id ? ' sel' : ''}${bg.cats.includes(category) && selBg !== bg.id ? ' cat-match' : ''}`}
                      onClick={() => setSelBg(bg.id)} onMouseEnter={() => setHoverBg(bg.id)} onMouseLeave={() => setHoverBg(null)}>
                      <img src={bg.src} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      {selBg === bg.id && <div style={{ position: 'absolute', inset: 0, background: 'rgba(201,114,107,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700 }}>✓</div>}
                    </button>
                  ))}
                </div>
              </div>

              {/* RIGHT: form fields */}
              <div className="step2-right">
                <form onSubmit={submit} style={{ display: 'contents' }}>

                  {/* From / To — premium card inputs */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div className="name-card" onClick={e => e.currentTarget.querySelector('input').focus()}>
                      <span className="name-card-label">✦ From</span>
                      <input
                        className="name-card-inp"
                        placeholder="Your name"
                        value={form.sender}
                        onChange={e => setForm(f => ({ ...f, sender: e.target.value }))}
                      />
                    </div>
                    <div className="name-card" onClick={e => e.currentTarget.querySelector('input').focus()}>
                      <span className="name-card-label">✦ To</span>
                      <input
                        className="name-card-inp"
                        placeholder="Their name"
                        value={form.receiver}
                        onChange={e => setForm(f => ({ ...f, receiver: e.target.value }))}
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', top: -2, left: -2, fontSize: 36, color: 'rgba(255,255,255,0.08)', fontFamily: 'Playfair Display,serif', lineHeight: 1, pointerEvents: 'none' }}>"</div>
                    <textarea
                      className="overlay-msg"
                      rows={4}
                      placeholder="Write your message here…"
                      value={form.message}
                      required
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      style={{ paddingLeft: 18, fontFamily: fontStyle, color: fontColor, fontStyle: fontItalic ? 'italic' : 'normal' }}
                    />
                  </div>

                  {/* Font + Colour + Overlay */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                    {/* Font label + pills */}
                    <div>
                      <p style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.4)', letterSpacing: '.5px', textTransform: 'uppercase', marginBottom: 5 }}>Font</p>
                      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                        {FONTS.map(f => (
                          <button key={f.id} type="button"
                            onClick={() => setFont(f.id)}
                            style={{
                              padding: '5px 10px', borderRadius: 8, border: '1px solid',
                              borderColor: font === f.id ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.15)',
                              background: font === f.id ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.05)',
                              color: font === f.id ? '#fff' : 'rgba(255,255,255,0.6)',
                              fontSize: 12, cursor: 'pointer', transition: 'all .2s', fontFamily: f.style,
                              fontStyle: f.italic ? 'italic' : 'normal',
                              boxShadow: font === f.id ? '0 0 0 2px rgba(255,255,255,0.12)' : 'none',
                            }}>
                            {f.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    {/* Colour swatches */}
                    <div>
                      <p style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.4)', letterSpacing: '.5px', textTransform: 'uppercase', marginBottom: 5 }}>Text colour</p>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                        {FONT_COLORS.map(c => (
                          <button key={c.id} type="button" title={c.label}
                            onClick={() => setFontColor(c.hex)}
                            style={{
                              width: 20, height: 20, borderRadius: '50%',
                              background: c.hex,
                              border: fontColor === c.hex ? '2px solid #fff' : '2px solid rgba(255,255,255,0.18)',
                              cursor: 'pointer', padding: 0, flexShrink: 0,
                              boxShadow: fontColor === c.hex ? `0 0 0 3px rgba(255,255,255,0.25), 0 0 8px ${c.hex}55` : 'none',
                              transition: 'all .15s',
                            }} />
                        ))}
                      </div>
                    </div>
                    {/* Darkness slider */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                        <p style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.4)', letterSpacing: '.5px', textTransform: 'uppercase' }}>Darkness</p>
                        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>{Math.round(overlayOpacity * 100)}%</span>
                      </div>
                      <input type="range" className="slider" min="0.15" max="0.85" step="0.05"
                        value={overlayOpacity} onChange={e => setOverlayOpacity(parseFloat(e.target.value))} />
                    </div>
                  </div>

                  {/* Passkey + Expiry */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.4)', letterSpacing: '.5px', textTransform: 'uppercase', marginBottom: 4 }}>Passkey (optional)</label>
                      <input type="password" className="option-inp" placeholder="🔐 Secret" style={{ padding: '7px 10px', fontSize: 12 }}
                        value={form.passkey} onChange={e => setForm(f => ({ ...f, passkey: e.target.value }))} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.4)', letterSpacing: '.5px', textTransform: 'uppercase', marginBottom: 4 }}>Link expires</label>
                      <select className="option-inp" style={{ padding: '7px 10px', fontSize: 12 }} value={expiryDays} onChange={e => setExpiryDays(parseInt(e.target.value))}>
                        {EXPIRY_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Schedule */}
                  <div>
                    <label style={{ display: 'block', fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.4)', letterSpacing: '.5px', textTransform: 'uppercase', marginBottom: 4 }}>Schedule unlock (optional)</label>
                    <input type="datetime-local" className="option-inp"
                      value={scheduledAt}
                      min={new Date().toISOString().slice(0, 16)}
                      onChange={e => setScheduledAt(e.target.value)}
                      style={{ padding: '7px 10px', fontSize: 12, colorScheme: 'dark' }} />
                  </div>

                  {/* Music picker */}
                  <div>
                    <p style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.4)', letterSpacing: '.5px', textTransform: 'uppercase', marginBottom: 5 }}>🎵 Music</p>
                    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                      <button type="button" onClick={() => setSelMusic(null)}
                        style={{
                          padding: '5px 10px', borderRadius: 20, border: '1px solid',
                          borderColor: selMusic === null ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.15)',
                          background: selMusic === null ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.06)',
                          color: selMusic === null ? '#fff' : 'rgba(255,255,255,0.55)',
                          fontSize: 11, cursor: 'pointer', transition: 'all .2s', fontFamily: 'inherit',
                        }}>🔇 None</button>
                      {MUSIC_TRACKS.map(t => {
                        const isSel = selMusic === t.id;
                        const isSugg = !selMusic && t.cats.includes(category);
                        return (
                          <button key={t.id} type="button" onClick={() => setSelMusic(t.id)}
                            style={{
                              padding: '5px 10px', borderRadius: 20, border: '1px solid',
                              borderColor: isSel ? '#fff' : isSugg ? 'rgba(201,114,107,0.6)' : 'rgba(255,255,255,0.15)',
                              background: isSel ? 'rgba(255,255,255,0.18)' : isSugg ? 'rgba(201,114,107,0.12)' : 'rgba(255,255,255,0.06)',
                              color: isSel ? '#fff' : isSugg ? 'rgba(255,210,195,0.9)' : 'rgba(255,255,255,0.55)',
                              fontSize: 11, cursor: 'pointer', transition: 'all .2s', fontFamily: 'inherit',
                              boxShadow: isSel ? '0 0 0 2px rgba(255,255,255,0.2)' : 'none',
                            }}>{t.label}</button>
                        );
                      })}
                    </div>
                    {selMusic && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
                        <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', margin: 0 }}>✓ Music plays when wish opens</p>
                        <button type="button" onClick={togglePreview} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 12, padding: '4px 10px', color: '#fff', fontSize: 11, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, transition: 'all 0.2s' }}>
                          {playingPreview ? '⏸ Pause' : '▶ Preview'}
                        </button>
                        <audio ref={previewAudioRef} src={MUSIC_TRACKS.find(t => t.id === selMusic)?.src} onEnded={() => setPlayingPreview(false)} style={{ display: 'none' }} />
                      </div>
                    )}
                  </div>

                  {/* Submit */}
                  <button className="btn-main" type="submit" disabled={loading} style={{ marginTop: 2 }}>
                    {loading ? '…' : 'Create Wish  →'}
                  </button>

                </form>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 3 ── */}
        {step === 3 && (
          <div className="glass su" style={{ width: '100%', maxWidth: 420, textAlign: 'center' }}>
            <div className="strip" />
            <div style={{ padding: '26px 22px 28px' }}>
              <div style={{ fontSize: 44, marginBottom: 12, display: 'inline-block', animation: 'pulse 2s ease-in-out infinite', willChange: 'transform' }}>🎀</div>
              <h2 style={{ fontFamily: 'Playfair Display,serif', fontSize: 21, fontWeight: 700, marginBottom: 7 }}>Your wish is ready!</h2>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, marginBottom: 18, lineHeight: 1.6 }}>
                Share this link with your special someone
                {scheduledAt && <><br /><span style={{ color: 'rgba(255,200,130,0.8)', fontSize: 12 }}>⏰ Unlocks {new Date(scheduledAt).toLocaleString()}</span></>}
                {expiryDays && <><br /><span style={{ color: 'rgba(255,180,130,0.7)', fontSize: 12 }}>⌛ Expires in {expiryDays} day{expiryDays > 1 ? 's' : ''}</span></>}
              </p>

              {/* Link copy row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 11, padding: '10px 12px', marginBottom: 12 }}>
                <span style={{ flex: 1, fontSize: 12, color: 'rgba(255,255,255,0.65)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'left' }}>{wishUrl}</span>
                <button onClick={copyLink} style={{ flexShrink: 0, padding: '6px 14px', borderRadius: 8, border: 'none', background: copied ? 'rgba(138,158,139,0.85)' : 'rgba(255,255,255,0.18)', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all .2s', whiteSpace: 'nowrap' }}>
                  {copied ? '✓ Copied!' : 'Copy'}
                </button>
              </div>

              {/* Share buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
                {typeof navigator !== 'undefined' && navigator.share && (
                  <button className="share-btn" onClick={nativeShare}>
                    <span>⬆️</span> Share
                  </button>
                )}
                <a
                  className="share-btn wa"
                  href={`https://wa.me/?text=${encodeURIComponent('💌 A heartfelt wish for you — ' + wishUrl)}`}
                  target="_blank" rel="noopener noreferrer"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /><path d="M11.999 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.975-1.305A9.944 9.944 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" fillRule="evenodd" clipRule="evenodd" opacity=".4" /></svg>
                  WhatsApp
                </a>
              </div>

              {/* QR Code */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
                  <canvas ref={qrCanvasRef} style={{ borderRadius: 10, display: showQr ? 'block' : 'none' }} />
                  {!showQr && <div style={{ width: 200, height: 200, borderRadius: 10, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>Generating QR…</div>}
                </div>
                {showQr && (
                  <button onClick={downloadQr} className="share-btn" style={{ maxWidth: 200, margin: '0 auto' }}>
                    ⬇ Download QR Code
                  </button>
                )}
              </div>

              {form.passkey && (
                <div style={{ background: 'rgba(255,200,130,0.1)', border: '1px solid rgba(255,200,130,0.2)', borderRadius: 9, padding: '10px 13px', marginBottom: 14, textAlign: 'left' }}>
                  <p style={{ fontSize: 12, color: 'rgba(255,220,160,0.9)', lineHeight: 1.5 }}>🔐 Share the passkey: <strong>{form.passkey}</strong></p>
                </div>
              )}

              <div style={{ height: 1, background: 'rgba(255,255,255,0.1)', margin: '14px 0' }} />

              {/* AUTH PANEL (Step 3 optional signup) */}
              <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 14, textAlign: 'left', marginBottom: 14 }}>
                {authDone || session?.userId ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <p style={{ fontSize: 13, color: 'rgba(150,255,180,0.9)', margin: 0 }}>✓ Saved to <strong>{session?.username}</strong>'s profile</p>
                    <button onClick={logout} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: 12, cursor: 'pointer', textDecoration: 'underline' }}>Logout</button>
                  </div>
                ) : (
                  <>
                    <p style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.8)', marginBottom: 10, textAlign: 'center' }}>💾 Save this wish to your profile</p>
                    <div style={{ display: 'flex', marginBottom: 10, background: 'rgba(255,255,255,0.05)', borderRadius: 8, padding: 4 }}>
                      <div className={`auth-tab ${authTab === 'login' ? 'active' : ''}`} onClick={() => { setAuthTab('login'); setAuthError(''); }}>Log In</div>
                      <div className={`auth-tab ${authTab === 'signup' ? 'active' : ''}`} onClick={() => { setAuthTab('signup'); setAuthError(''); }}>Sign Up</div>
                    </div>
                    <form onSubmit={handleAuth}>
                      <input type="text" className="auth-inp" placeholder="Username" value={authForm.username} onChange={e => setAuthForm(f => ({ ...f, username: e.target.value }))} required minLength={3} />
                      <input type="password" className="auth-inp" placeholder="Password" value={authForm.password} onChange={e => setAuthForm(f => ({ ...f, password: e.target.value }))} required minLength={6} />
                      {authError && <p style={{ color: 'rgba(255,100,100,0.9)', fontSize: 11, marginBottom: 8, textAlign: 'center' }}>{authError}</p>}
                      <button type="submit" disabled={authLoading} style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.9)', color: '#000', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer', opacity: authLoading ? 0.7 : 1 }}>
                        {authLoading ? '...' : (authTab === 'login' ? 'Log In' : 'Create Account')}
                      </button>
                    </form>
                  </>
                )}
              </div>

              <button style={{ padding: '10px 22px', borderRadius: 10, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.18)', color: 'rgba(255,255,255,0.75)', fontSize: 13, cursor: 'pointer' }}
                onClick={() => { setStep(1); setCat(''); setForm({ sender: '', receiver: '', message: '', passkey: '' }); setWishId(null); setExpiryDays(1); setScheduledAt(''); setShowQr(false); setFont('playfair'); setOverlayOpacity(0.55); setAuthDone(false); setSelMusic(null); setFontColor('#FFFFFF'); setPlayingPreview(false); }}>
                + Create another wish
              </button>
            </div>
          </div>
        )}

        {/* ── STEP MINE (My Wishes) ── */}
        {step === 'mine' && (
          <div className="glass su" style={{ width: '100%', maxWidth: 440, minHeight: 400, display: 'flex', flexDirection: 'column' }}>
            <div className="strip" />
            <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <button onClick={() => setStep(1)} style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: 8, color: 'rgba(255,255,255,0.7)', fontSize: 12, cursor: 'pointer', padding: '5px 11px' }}>← Back</button>
              {session && <button onClick={logout} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: 12, cursor: 'pointer', textDecoration: 'underline' }}>Logout</button>}
            </div>

            <div style={{ padding: 20, flex: 1, overflowY: 'auto' }}>
              {!session ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, marginBottom: 20 }}>Log in to see your past wishes.</p>
                  <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 16, textAlign: 'left' }}>
                    <div style={{ display: 'flex', marginBottom: 12, background: 'rgba(255,255,255,0.05)', borderRadius: 8, padding: 4 }}>
                      <div className={`auth-tab ${authTab === 'login' ? 'active' : ''}`} onClick={() => { setAuthTab('login'); setAuthError(''); }}>Log In</div>
                      <div className={`auth-tab ${authTab === 'signup' ? 'active' : ''}`} onClick={() => { setAuthTab('signup'); setAuthError(''); }}>Sign Up</div>
                    </div>
                    <form onSubmit={async (e) => { await handleAuth(e); if (session?.userId) loadMyWishes(session.userId); }}>
                      <input type="text" className="auth-inp" placeholder="Username" value={authForm.username} onChange={e => setAuthForm(f => ({ ...f, username: e.target.value }))} required minLength={3} />
                      <input type="password" className="auth-inp" placeholder="Password" value={authForm.password} onChange={e => setAuthForm(f => ({ ...f, password: e.target.value }))} required minLength={6} />
                      {authError && <p style={{ color: 'rgba(255,100,100,0.9)', fontSize: 11, marginBottom: 8, textAlign: 'center' }}>{authError}</p>}
                      <button type="submit" disabled={authLoading} style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.9)', color: '#000', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
                        {authLoading ? '...' : (authTab === 'login' ? 'Log In' : 'Create Account')}
                      </button>
                    </form>
                  </div>
                </div>
              ) : myWishesLoading ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>Loading wishes...</div>
              ) : myWishes.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>✨</div>
                  You haven't made any wishes yet.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {myWishes.map(w => {
                    const isExpired = w.expires_at && new Date(w.expires_at) < new Date();
                    const icon = CATEGORIES.find(c => c.value === w.category)?.icon || '💌';
                    return (
                      <div key={w.id} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 14, display: 'flex', gap: 14, alignItems: 'center' }}>
                        <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
                          {icon}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontWeight: 600, fontSize: 15, marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>To: {w.receiver || 'Someone special'}</p>
                          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{new Date(w.created_at).toLocaleDateString()}</p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                          {isExpired ? (
                            <span style={{ fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 6, background: 'rgba(255,100,100,0.15)', color: 'rgba(255,150,150,0.9)', border: '1px solid rgba(255,100,100,0.2)' }}>EXPIRED</span>
                          ) : (
                            <button onClick={() => {
                              const url = `${window.location.origin}/wish/${w.id}`;
                              navigator.clipboard.writeText(url);
                              alert('Link copied!');
                            }} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 6, padding: '6px 12px', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                              Copy Link
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {step === 1 && (
          <div style={{ marginTop: 20, textAlign: 'center' }}>
            <span className="credit-pill">
              <span className="credit-heart" style={{ fontSize: 13 }}>♡</span>
              made with love by <strong style={{ fontWeight: 600, letterSpacing: '.3px' }}>neeer4j</strong>
            </span>
          </div>
        )}
      </div>
    </>
  );
}
