'use client';
import { useState, useEffect, useRef } from 'react';

const CATEGORIES = [
  { value: 'birthday', label: 'Birthday', icon: '🎂', color: '#E67E22' },
  { value: 'love', label: 'Love', icon: '🌹', color: '#C9726B' },
  { value: 'friendship', label: 'Friendship', icon: '🫧', color: '#3B6FD4' },
  { value: 'anniversary', label: 'Anniversary', icon: '💍', color: '#8E44AD' },
  { value: 'parents', label: 'Parents', icon: '🌿', color: '#27AE60' },
  { value: 'colleague', label: 'Colleague', icon: '✦', color: '#7F6E5D' },
];

const TEMPLATES = {
  birthday: `Happy Birthday, [Name] 🎂\n\nMay this day be as wonderful and radiant as you are. Wishing you endless joy, laughter, and all the things that make your heart smile. Here's to you!`,
  love: `My dearest [Name],\n\nEvery moment with you feels like a beautiful dream I never want to wake from. You are my favourite thought, my brightest light. Love, always.`,
  friendship: `Hey [Name] 🫧\n\nI just wanted to take a moment to tell you how grateful I am to have you in my life. You make every ordinary day feel extraordinary.`,
  anniversary: `To [Name], with all my heart 💍\n\nAnother year of us — of laughter, adventures, and a love that only deepens. Here's to forever and beyond.`,
  parents: `Dear [Name] 🌿\n\nThank you for every sacrifice, every gentle word, and every moment of unconditional love. You are my foundation and my greatest blessing.`,
  colleague: `[Name],\n\nWorking alongside you has been an absolute pleasure. Your dedication, warmth, and brilliance make every day better. Wishing you all the success you deserve. ✦`,
};

const BG_OPTIONS = [
  { id: 'v1065-110', src: '/assets/v1065-110.jpg', label: 'Warm Tones' },
  { id: '18929278', src: '/assets/18929278_rm175-noon-03b.jpg', label: 'Soft Light' },
  { id: '16398080', src: '/assets/16398080_v729-noon-4a.jpg', label: 'Dreamy' },
  { id: '119781', src: '/assets/119781.jpg', label: 'Floral' },
];

/* Floating petals / sparkles */
function Petal({ x, delay, duration, size, char, opacity }) {
  return (
    <div style={{
      position: 'fixed',
      left: `${x}%`,
      top: '-40px',
      fontSize: size,
      opacity,
      pointerEvents: 'none',
      zIndex: 0,
      animation: `floatDown ${duration}s ${delay}s linear infinite`,
      userSelect: 'none',
    }}>{char}</div>
  );
}

const PETALS = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: Math.random() * 98,
  delay: Math.random() * 12,
  duration: 8 + Math.random() * 10,
  size: `${12 + Math.random() * 16}px`,
  char: ['🌸', '✦', '·', '♡', '✿', '❀'][Math.floor(Math.random() * 6)],
  opacity: 0.3 + Math.random() * 0.35,
}));

export default function Home() {
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState('');
  const [form, setForm] = useState({ sender: '', receiver: '', message: '', passkey: '' });
  const [selectedBg, setSelectedBg] = useState(BG_OPTIONS[0].id);
  const [previewBg, setPreviewBg] = useState(null); // hover preview
  const [loading, setLoading] = useState(false);
  const [wishId, setWishId] = useState(null);
  const [copied, setCopied] = useState(false);
  const [wallpaperIdx, setWallpaperIdx] = useState(0);

  // Slowly rotate wallpaper on homepage
  useEffect(() => {
    const t = setInterval(() => setWallpaperIdx(i => (i + 1) % BG_OPTIONS.length), 8000);
    return () => clearInterval(t);
  }, []);

  const activeBg = previewBg || selectedBg;
  const activeBgSrc = BG_OPTIONS.find(b => b.id === activeBg)?.src;
  const wallpaperSrc = BG_OPTIONS[wallpaperIdx].src;

  const selectCat = (cat) => {
    setCategory(cat.value);
    setForm(f => ({ ...f, message: TEMPLATES[cat.value] || '' }));
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/wishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, ...form, bg_image: selectedBg }),
      });
      const data = await res.json();
      if (data.id) { setWishId(data.id); setStep(3); }
      else alert(data.error || 'Something went wrong');
    } finally { setLoading(false); }
  };

  const wishUrl = wishId ? `${typeof window !== 'undefined' ? window.location.origin : ''}/wish/${wishId}` : '';
  const copyLink = () => {
    navigator.clipboard.writeText(wishUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const cat = CATEGORIES.find(c => c.value === category);

  return (
    <>
      <style>{`
        @keyframes floatDown {
          0%   { transform: translateY(-40px) rotate(0deg);   opacity: 0; }
          5%   { opacity: 1; }
          90%  { opacity: 0.8; }
          100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(18px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity:0; }
          to   { opacity:1; }
        }
        @keyframes slowZoom {
          0%   { transform: scale(1);    }
          50%  { transform: scale(1.06); }
          100% { transform: scale(1);    }
        }
        @keyframes pulse {
          0%,100% { transform:scale(1); }
          50%     { transform:scale(1.04); }
        }
        @keyframes wallpaperFade {
          0%   { opacity:0; }
          15%  { opacity:1; }
          85%  { opacity:1; }
          100% { opacity:0; }
        }
        * { box-sizing:border-box; margin:0; padding:0; }
        body { font-family:'DM Sans',sans-serif; color:#2D2D2D; overflow-x:hidden; }
        input, textarea, button { font-family: inherit; }
        input::placeholder, textarea::placeholder { color:rgba(100,80,75,0.45); }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-thumb { background:#E8C4B8; border-radius:99px; }
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');
      `}</style>

      {/* ── Rotating wallpaper background ─────────────────── */}
      {BG_OPTIONS.map((bg, idx) => (
        <div key={bg.id} style={{
          position: 'fixed', inset: 0, zIndex: 0,
          backgroundImage: `url(${bg.src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: idx === wallpaperIdx ? 1 : 0,
          transition: 'opacity 2s ease',
          animation: idx === wallpaperIdx ? 'slowZoom 16s ease-in-out infinite' : 'none',
        }} />
      ))}
      {/* Dark overlay */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 1, background: 'linear-gradient(160deg, rgba(15,8,5,0.52) 0%, rgba(15,8,5,0.62) 100%)' }} />

      {/* Floating petals */}
      {PETALS.map(p => <Petal key={p.id} {...p} />)}

      {/* ── Page Content ─────────────────────────────────── */}
      <div style={{ position: 'relative', zIndex: 2, minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '44px 16px 80px' }}>

        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: 36, animation: 'fadeUp 0.6s ease both' }}>
          <p style={{ fontSize: 11, letterSpacing: '4px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', fontWeight: 500, marginBottom: 12 }}>✦ wishit ✦</p>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(30px,6vw,42px)', fontWeight: 700, color: '#fff', lineHeight: 1.15, textShadow: '0 2px 24px rgba(0,0,0,0.3)' }}>
            {step === 1 && <><span>Send a wish</span><br /><em style={{ fontWeight: 400 }}>from the heart</em></>}
            {step === 2 && <><span>Craft your</span><br /><em style={{ fontWeight: 400 }}>message</em></>}
            {step === 3 && <><span>Your wish is</span><br /><em style={{ fontWeight: 400 }}>ready</em></>}
          </h1>
          {step === 1 && <p style={{ color: 'rgba(255,255,255,0.55)', marginTop: 10, fontSize: 14, lineHeight: 1.65 }}>Choose a moment. Write something beautiful.</p>}
        </div>

        {/* ─── STEP 1: Category ───────────────────────────── */}
        {step === 1 && (
          <div style={{ ...C.glass, animation: 'fadeUp 0.6s 0.12s ease both', width: '100%', maxWidth: 440 }}>
            <div style={C.strip} />
            <div style={C.inner}>
              <p style={C.sectionLabel}>What's the occasion?</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {CATEGORIES.map(cat => (
                  <button key={cat.value} onClick={() => selectCat(cat)} style={C.catPill}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.22)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'none'; }}>
                    <span style={{ fontSize: 22 }}>{cat.icon}</span>
                    <span style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.9)' }}>{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── STEP 2: Form ───────────────────────────────── */}
        {step === 2 && (
          <div style={{ width: '100%', maxWidth: 440, animation: 'fadeUp 0.45s ease both' }}>
            {/* ── Live wish preview with selected bg ────── */}
            <div style={{ marginBottom: 16, borderRadius: 16, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.35)', position: 'relative', height: 180, transition: 'all 0.4s ease' }}>
              {/* Preview bg */}
              <img src={activeBgSrc} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'all 0.6s ease' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.55))' }} />
              {/* Preview content */}
              <div style={{ position: 'relative', padding: '20px 22px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 10, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 4 }}>Preview</p>
                {(form.receiver || form.sender) && (
                  <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 17, color: '#fff', fontStyle: 'italic', lineHeight: 1.3, textShadow: '0 1px 8px rgba(0,0,0,0.4)' }}>
                    {form.receiver ? `Dear ${form.receiver}` : ''}{form.sender ? ` — from ${form.sender}` : ''}
                  </p>
                )}
                {!form.receiver && !form.sender && (
                  <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 16, color: 'rgba(255,255,255,0.5)', fontStyle: 'italic' }}>Your wish will appear here…</p>
                )}
              </div>
              {cat && <div style={{ position: 'absolute', top: 14, right: 14, fontSize: 22 }}>{cat.icon}</div>}
            </div>

            {/* ── Background selector ───────────────── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 16 }}>
              {BG_OPTIONS.map(bg => (
                <button key={bg.id} type="button"
                  onClick={() => setSelectedBg(bg.id)}
                  onMouseEnter={() => setPreviewBg(bg.id)}
                  onMouseLeave={() => setPreviewBg(null)}
                  style={{ height: 52, borderRadius: 10, overflow: 'hidden', border: selectedBg === bg.id ? '2px solid #fff' : '2px solid transparent', cursor: 'pointer', padding: 0, position: 'relative', transition: 'all 0.2s', transform: selectedBg === bg.id ? 'scale(1.05)' : 'scale(1)', boxShadow: selectedBg === bg.id ? '0 4px 16px rgba(0,0,0,0.35)' : '0 2px 8px rgba(0,0,0,0.2)' }}>
                  <img src={bg.src} alt={bg.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  {selectedBg === bg.id && (
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(201,114,107,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 14, fontWeight: 700 }}>✓</div>
                  )}
                </button>
              ))}
            </div>

            {/* ── Card form ───────────────────────── */}
            <div style={C.glass}>
              <div style={C.strip} />
              <div style={C.inner}>
                <button onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.55)', fontSize: 13, cursor: 'pointer', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 4 }}>← Back</button>

                {cat && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 999, background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.85)', fontSize: 12, fontWeight: 600, marginBottom: 18, border: '1px solid rgba(255,255,255,0.15)' }}>
                  {cat.icon} {cat.label}
                </span>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div>
                      <label style={C.label}>From</label>
                      <input style={C.input} placeholder="Your name" value={form.sender}
                        onChange={e => setForm(f => ({ ...f, sender: e.target.value }))}
                        onFocus={e => e.target.style.borderColor = 'rgba(255,255,255,0.5)'}
                        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'} />
                    </div>
                    <div>
                      <label style={C.label}>To</label>
                      <input style={C.input} placeholder="Their name" value={form.receiver}
                        onChange={e => setForm(f => ({ ...f, receiver: e.target.value }))}
                        onFocus={e => e.target.style.borderColor = 'rgba(255,255,255,0.5)'}
                        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'} />
                    </div>
                  </div>
                  <div>
                    <label style={C.label}>Message</label>
                    <textarea style={{ ...C.input, resize: 'none', lineHeight: 1.75 }} rows={6}
                      value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} required
                      onFocus={e => e.target.style.borderColor = 'rgba(255,255,255,0.5)'}
                      onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'} />
                  </div>
                  <div>
                    <label style={C.label}>Passkey <span style={{ fontWeight: 400, letterSpacing: 0, textTransform: 'none' }}>(optional)</span></label>
                    <input style={C.input} type="password" placeholder="Lock with a secret passkey…" value={form.passkey}
                      onChange={e => setForm(f => ({ ...f, passkey: e.target.value }))}
                      onFocus={e => e.target.style.borderColor = 'rgba(255,255,255,0.5)'}
                      onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'} />
                  </div>
                  <div style={{ height: 1, background: 'rgba(255,255,255,0.12)', margin: '2px 0' }} />
                  <button type="submit" disabled={loading} style={C.btnPrimary}>
                    {loading ? 'Creating…' : 'Generate Wish Link  →'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* ─── STEP 3: Share ─────────────────────────────── */}
        {step === 3 && (
          <div style={{ ...C.glass, width: '100%', maxWidth: 440, animation: 'fadeUp 0.45s ease both' }}>
            <div style={C.strip} />
            <div style={{ ...C.inner, textAlign: 'center' }}>
              <div style={{ fontSize: 50, marginBottom: 14, animation: 'pulse 2s ease-in-out infinite', display: 'inline-block' }}>🎀</div>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, color: '#fff', marginBottom: 8 }}>All done!</h2>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, marginBottom: 24, lineHeight: 1.65 }}>
                Copy this link and share it with your special someone
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, padding: '12px 14px', marginBottom: 12 }}>
                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>{wishUrl}</span>
                <button onClick={copyLink} style={{ flexShrink: 0, padding: '7px 16px', borderRadius: 8, border: 'none', background: copied ? 'rgba(138,158,139,0.8)' : 'rgba(255,255,255,0.18)', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' }}>
                  {copied ? '✓ Copied!' : 'Copy'}
                </button>
              </div>
              {form.passkey && (
                <div style={{ background: 'rgba(255,200,150,0.12)', border: '1px solid rgba(255,200,150,0.25)', borderRadius: 10, padding: '11px 14px', marginBottom: 16, textAlign: 'left' }}>
                  <p style={{ fontSize: 13, color: 'rgba(255,220,180,0.9)', lineHeight: 1.5 }}>🔐 Remember to share the passkey: <strong>{form.passkey}</strong></p>
                </div>
              )}
              <div style={{ height: 1, background: 'rgba(255,255,255,0.1)', margin: '16px 0' }} />
              <button style={{ ...C.btnPrimary, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}
                onClick={() => { setStep(1); setCategory(''); setForm({ sender: '', receiver: '', message: '', passkey: '' }); setWishId(null); }}>
                + Create another wish
              </button>
            </div>
          </div>
        )}

        <p style={{ marginTop: 36, color: 'rgba(255,255,255,0.3)', fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase', textAlign: 'center' }}>Made with ♡ — WishIt</p>
      </div>
    </>
  );
}

/* Reusable style objects */
const C = {
  glass: {
    background: 'rgba(255,255,255,0.08)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    border: '1px solid rgba(255,255,255,0.13)',
    borderRadius: 20,
    overflow: 'hidden',
  },
  strip: {
    height: 4,
    background: 'linear-gradient(90deg,#E8C4B8,#C9726B,#9B6E7A,#8A9E8B)',
  },
  inner: {
    padding: '26px 26px 30px',
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    marginBottom: 14,
  },
  catPill: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '13px 14px',
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 14,
    cursor: 'pointer',
    textAlign: 'left',
    color: '#fff',
    transition: 'all 0.22s ease',
    width: '100%',
  },
  label: {
    display: 'block',
    fontSize: 11,
    fontWeight: 600,
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 6,
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    background: 'rgba(0,0,0,0.2)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 10,
    color: '#fff',
    fontSize: 14,
    fontFamily: 'DM Sans, sans-serif',
    transition: 'border-color 0.2s',
    outline: 'none',
    WebkitAppearance: 'none',
  },
  btnPrimary: {
    width: '100%',
    padding: '14px',
    border: 'none',
    borderRadius: 12,
    background: 'rgba(255,255,255,0.95)',
    color: '#2D2D2D',
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.25s ease',
    letterSpacing: '0.2px',
  },
};
