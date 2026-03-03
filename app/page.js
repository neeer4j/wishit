'use client';
import { useState, useEffect, useCallback } from 'react';

/* ─── Data ─────────────────────────────────────────────────────── */
const CATEGORIES = [
  { value: 'birthday', label: 'Birthday', icon: '🎂' },
  { value: 'love', label: 'Love', icon: '🌹' },
  { value: 'friendship', label: 'Friendship', icon: '🫧' },
  { value: 'anniversary', label: 'Anniversary', icon: '💍' },
  { value: 'parents', label: 'Parents', icon: '🌿' },
  { value: 'colleague', label: 'Colleague', icon: '✦' },
];

const TEMPLATES = {
  birthday: `Happy Birthday, [Name] 🎂\n\nMay this day be as wonderful and radiant as you are. Wishing you endless joy, laughter, and all the things that make your heart smile. Here's to you!`,
  love: `My dearest [Name],\n\nEvery moment with you feels like a beautiful dream I never want to wake from. You are my favourite thought, my brightest light. Love, always.`,
  friendship: `Hey [Name] 🫧\n\nI just wanted to take a moment to tell you how grateful I am to have you in my life. You make every ordinary day feel extraordinary.`,
  anniversary: `To [Name], with all my heart 💍\n\nAnother year of us — of laughter, adventures, and a love that only deepens. Here's to forever and beyond.`,
  parents: `Dear [Name] 🌿\n\nThank you for every sacrifice, every gentle word, and every moment of unconditional love. You are my foundation and my greatest blessing.`,
  colleague: `[Name],\n\nWorking alongside you has been an absolute pleasure. Your dedication, warmth, and brilliance make every day better. Wishing you all the success you deserve. ✦`,
};

const BGS = [
  { id: 'v1065-110', src: '/assets/v1065-110.jpg' },
  { id: '18929278', src: '/assets/18929278_rm175-noon-03b.jpg' },
  { id: '16398080', src: '/assets/16398080_v729-noon-4a.jpg' },
  { id: '119781', src: '/assets/119781.jpg' },
];

/* Petals rendered only client-side */
const PETALS = typeof window !== 'undefined'
  ? Array.from({ length: 14 }, (_, i) => ({
    id: i,
    left: `${(i * 7.3 + Math.random() * 6) % 95}%`,
    delay: `${(i * 0.8).toFixed(1)}s`,
    dur: `${9 + (i % 5) * 2}s`,
    size: 12 + (i % 5) * 4,
    char: ['🌸', '✦', '·', '♡', '✿', '❀'][i % 6],
  }))
  : [];

/* ─── Component ─────────────────────────────────────────────────── */
export default function Home() {
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState('');
  const [form, setForm] = useState({ sender: '', receiver: '', message: '', passkey: '' });
  const [selectedBg, setSelectedBg] = useState(BGS[0].id);
  const [hoverBg, setHoverBg] = useState(null);
  const [bgIdx, setBgIdx] = useState(0);   // wallpaper rotation
  const [wishId, setWishId] = useState(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    if (step !== 1) return;
    const t = setInterval(() => setBgIdx(i => (i + 1) % BGS.length), 7000);
    return () => clearInterval(t);
  }, [step]);

  const selectCat = (cat) => {
    setCategory(cat.value);
    setForm(f => ({ ...f, message: TEMPLATES[cat.value] || '' }));
    setStep(2);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.message.trim()) return;
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
    } catch { alert('Network error. Please try again.'); }
    finally { setLoading(false); }
  };

  const wishUrl = wishId ? `${typeof window !== 'undefined' ? window.location.origin : ''}/wish/${wishId}` : '';
  const copyLink = async () => {
    try { await navigator.clipboard.writeText(wishUrl); }
    catch { /* fallback */ const ta = document.createElement('textarea'); ta.value = wishUrl; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta); }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const cat = CATEGORIES.find(c => c.value === category);
  const activeBgSrc = BGS.find(b => b.id === (hoverBg || selectedBg))?.src;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { height: 100%; overflow: hidden; font-family: 'DM Sans', sans-serif; -webkit-font-smoothing: antialiased; }
        body { color: #fff; background: #0d0705; }
        input, textarea, button, select { font-family: inherit; }
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.35); }
        textarea { resize: none; }
        ::-webkit-scrollbar { width: 0; }

        @keyframes floatDown {
          0%   { transform: translateY(-8vh) rotate(0deg); opacity: 0; }
          8%   { opacity: 0.7; }
          92%  { opacity: 0.5; }
          100% { transform: translateY(108vh) rotate(400deg); opacity: 0; }
        }
        @keyframes fadeIn  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse   { 0%,100% { transform: scale(1); } 50% { transform: scale(1.05); } }

        .slide-up  { animation: slideUp 0.45s cubic-bezier(.16,1,.3,1) both; }
        .slide-up2 { animation: slideUp 0.45s 0.08s cubic-bezier(.16,1,.3,1) both; }
        .fade-in   { animation: fadeIn 0.35s ease both; }

        .glass {
          background: rgba(255,255,255,0.07);
          backdrop-filter: blur(22px);
          -webkit-backdrop-filter: blur(22px);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 18px;
          overflow: hidden;
        }
        .strip { height: 3px; background: linear-gradient(90deg,#E8C4B8,#C9726B,#9B6E7A,#8A9E8B); }

        .cat-btn {
          display: flex; align-items: center; gap: 9px;
          padding: 11px 13px;
          background: rgba(255,255,255,0.09);
          border: 1px solid rgba(255,255,255,0.11);
          border-radius: 13px;
          cursor: pointer;
          color: rgba(255,255,255,0.88);
          font-size: 13px; font-weight: 500;
          text-align: left; width: 100%;
          transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
        }
        .cat-btn:hover { background: rgba(255,255,255,0.18); transform: translateY(-1px); box-shadow: 0 4px 16px rgba(0,0,0,0.2); }

        .inp {
          width: 100%; padding: 11px 13px;
          background: rgba(0,0,0,0.22);
          border: 1px solid rgba(255,255,255,0.14);
          border-radius: 10px;
          color: #fff; font-size: 14px;
          outline: none; transition: border-color 0.2s, box-shadow 0.2s;
          -webkit-appearance: none;
        }
        .inp:focus { border-color: rgba(255,255,255,0.5); box-shadow: 0 0 0 2px rgba(255,255,255,0.07); }

        .btn-main {
          width: 100%; padding: 13px;
          background: rgba(255,255,255,0.93);
          border: none; border-radius: 12px;
          color: #1a0e08; font-size: 15px; font-weight: 700;
          cursor: pointer; transition: all 0.22s ease; letter-spacing: 0.1px;
        }
        .btn-main:hover:not(:disabled) { background: #fff; box-shadow: 0 6px 20px rgba(0,0,0,0.3); transform: translateY(-1px); }
        .btn-main:disabled { opacity: 0.5; cursor: not-allowed; }

        .bg-thumb {
          height: 46px; border-radius: 9px;
          overflow: hidden; cursor: pointer;
          border: 2px solid transparent;
          padding: 0; position: relative;
          transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
        }
        .bg-thumb:hover { transform: scale(1.06); }
        .bg-thumb.active { border-color: #fff; box-shadow: 0 0 0 2px rgba(255,255,255,0.25); }
      `}</style>

      {/* ── Crossfading wallpaper backgrounds ──────────────── */}
      {BGS.map((bg, i) => (
        <div key={bg.id} style={{
          position: 'fixed', inset: 0, zIndex: 0,
          backgroundImage: `url(${bg.src})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          opacity: i === bgIdx ? 1 : 0,
          transition: 'opacity 2.5s ease',
          willChange: 'opacity',
        }} />
      ))}
      {/* Gradient overlay */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 1, background: 'linear-gradient(160deg,rgba(12,6,3,0.56),rgba(12,6,3,0.66))' }} />

      {/* Floating petals */}
      {mounted && PETALS.map(p => (
        <div key={p.id} style={{ position: 'fixed', left: p.left, top: '-30px', fontSize: p.size, zIndex: 1, pointerEvents: 'none', animation: `floatDown ${p.dur} ${p.delay} linear infinite`, opacity: 0.4 }}>{p.char}</div>
      ))}

      {/* ── Main layout: full viewport, no scroll ─────────── */}
      <div style={{ position: 'relative', zIndex: 2, height: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 16px' }}>

        {/* Brand */}
        <div className="slide-up" style={{ textAlign: 'center', marginBottom: step === 2 ? 10 : 20 }}>
          <p style={{ fontSize: 10, letterSpacing: '4px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginBottom: 8 }}>✦ wishit ✦</p>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(26px,5vw,38px)', fontWeight: 700, lineHeight: 1.15, textShadow: '0 2px 20px rgba(0,0,0,0.4)' }}>
            {step === 1 && <><span>Send a wish</span><br /><em style={{ fontWeight: 400 }}>from the heart</em></>}
            {step === 2 && <><em style={{ fontWeight: 400, fontSize: '0.85em' }}>Craft your message</em></>}
            {step === 3 && <><em style={{ fontWeight: 400 }}>Your wish is ready</em></>}
          </h1>
        </div>

        {/* ── STEP 1: category grid ──────────────────────── */}
        {step === 1 && (
          <div className="glass slide-up2" style={{ width: '100%', maxWidth: 420 }}>
            <div className="strip" />
            <div style={{ padding: '20px 20px 22px' }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 13 }}>What's the occasion?</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {CATEGORIES.map(cat => (
                  <button key={cat.value} className="cat-btn" onClick={() => selectCat(cat)}>
                    <span style={{ fontSize: 20 }}>{cat.icon}</span>
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 2: form + preview ─────────────────────── */}
        {step === 2 && (
          <div style={{ width: '100%', maxWidth: 420 }} className="slide-up">

            {/* Live preview */}
            <div style={{ position: 'relative', height: 120, borderRadius: 14, overflow: 'hidden', marginBottom: 10, boxShadow: '0 6px 24px rgba(0,0,0,0.4)' }}>
              <img src={activeBgSrc} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.5s ease' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom,rgba(0,0,0,0.15),rgba(0,0,0,0.6))' }} />
              <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '10px 14px' }}>
                <p style={{ fontSize: 9, letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: 3 }}>Preview</p>
                <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 14, fontStyle: 'italic', color: '#fff', lineHeight: 1.35, textShadow: '0 1px 6px rgba(0,0,0,0.6)', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                  {form.receiver || form.sender
                    ? `${form.receiver ? `Dear ${form.receiver}` : ''}${form.sender ? ` — from ${form.sender}` : ''}`
                    : form.message
                      ? form.message.replace(/\n/g, ' ').slice(0, 80) + (form.message.length > 80 ? '…' : '')
                      : 'Your message will appear here…'
                  }
                </p>
              </div>
              {cat && <div style={{ position: 'absolute', top: 10, right: 12, fontSize: 18 }}>{cat.icon}</div>}
            </div>

            {/* Bg thumbs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 7, marginBottom: 10 }}>
              {BGS.map(bg => (
                <button key={bg.id} className={`bg-thumb ${selectedBg === bg.id ? 'active' : ''}`}
                  onClick={() => setSelectedBg(bg.id)}
                  onMouseEnter={() => setHoverBg(bg.id)}
                  onMouseLeave={() => setHoverBg(null)}>
                  <img src={bg.src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  {selectedBg === bg.id && (
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(201,114,107,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>✓</div>
                  )}
                </button>
              ))}
            </div>

            {/* Form */}
            <div className="glass">
              <div className="strip" />
              <div style={{ padding: '16px 18px 20px' }}>
                <button onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.45)', fontSize: 12, cursor: 'pointer', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 4 }}>← Back</button>
                <form onSubmit={submit}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 9 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.45)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.4px' }}>From</label>
                      <input className="inp" placeholder="Your name" value={form.sender} onChange={e => setForm(f => ({ ...f, sender: e.target.value }))} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.45)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.4px' }}>To</label>
                      <input className="inp" placeholder="Their name" value={form.receiver} onChange={e => setForm(f => ({ ...f, receiver: e.target.value }))} />
                    </div>
                  </div>
                  <div style={{ marginBottom: 9 }}>
                    <label style={{ display: 'block', fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.45)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Message</label>
                    <textarea className="inp" rows={4} value={form.message} required onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ display: 'block', fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.45)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Passkey <span style={{ textTransform: 'none', fontWeight: 400 }}>(optional)</span></label>
                    <input className="inp" type="password" placeholder="Lock with a passkey…" value={form.passkey} onChange={e => setForm(f => ({ ...f, passkey: e.target.value }))} />
                  </div>
                  <button className="btn-main" type="submit" disabled={loading}>{loading ? 'Creating…' : 'Generate Wish Link  →'}</button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 3: share ──────────────────────────────── */}
        {step === 3 && (
          <div className="glass slide-up" style={{ width: '100%', maxWidth: 420, textAlign: 'center' }}>
            <div className="strip" />
            <div style={{ padding: '28px 22px 30px' }}>
              <div style={{ fontSize: 44, marginBottom: 12, display: 'inline-block', animation: 'pulse 2s ease-in-out infinite' }}>🎀</div>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 21, fontWeight: 700, marginBottom: 8 }}>Your wish is ready!</h2>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, marginBottom: 20, lineHeight: 1.6 }}>Share this link with your special someone</p>

              {/* URL row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 11, padding: '10px 12px', marginBottom: 10 }}>
                <span style={{ flex: 1, fontSize: 12, color: 'rgba(255,255,255,0.65)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'left' }}>{wishUrl}</span>
                <button onClick={copyLink} style={{ flexShrink: 0, padding: '6px 14px', borderRadius: 8, border: 'none', background: copied ? 'rgba(138,158,139,0.85)' : 'rgba(255,255,255,0.18)', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' }}>
                  {copied ? '✓ Copied!' : 'Copy'}
                </button>
              </div>

              {form.passkey && (
                <div style={{ background: 'rgba(255,200,130,0.1)', border: '1px solid rgba(255,200,130,0.2)', borderRadius: 9, padding: '10px 13px', marginBottom: 14, textAlign: 'left' }}>
                  <p style={{ fontSize: 12, color: 'rgba(255,220,160,0.9)', lineHeight: 1.5 }}>🔐 Share the passkey too: <strong>{form.passkey}</strong></p>
                </div>
              )}

              <div style={{ height: 1, background: 'rgba(255,255,255,0.1)', margin: '14px 0' }} />
              <button style={{ padding: '10px 22px', borderRadius: 10, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.18)', color: 'rgba(255,255,255,0.75)', fontSize: 13, cursor: 'pointer', transition: 'all 0.2s' }}
                onClick={() => { setStep(1); setCategory(''); setForm({ sender: '', receiver: '', message: '', passkey: '' }); setWishId(null); }}>
                + Create another wish
              </button>
            </div>
          </div>
        )}

        <p style={{ marginTop: 16, fontSize: 10, letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)' }}>Made with ♡ — WishIt</p>
      </div>
    </>
  );
}
