'use client';
import { useState, useEffect } from 'react';

const CATEGORIES = [
  { value: 'birthday', label: 'Birthday', icon: '🎂' },
  { value: 'love', label: 'Love', icon: '🌹' },
  { value: 'friendship', label: 'Friendship', icon: '🫧' },
  { value: 'anniversary', label: 'Anniversary', icon: '💍' },
  { value: 'parents', label: 'Parents', icon: '🌿' },
  { value: 'colleague', label: 'Colleague', icon: '✦' },
];

const TEMPLATES = {
  birthday: `Happy Birthday, [Name] 🎂\n\nMay this day be as wonderful as you are. Wishing you joy, laughter, and everything that makes your heart smile. Here's to you!`,
  love: `My dearest [Name],\n\nEvery moment with you feels like a dream I never want to wake from. You are my favourite thought. Love, always.`,
  friendship: `Hey [Name] 🫧\n\nI just wanted to remind you how grateful I am to have you in my life. You make every ordinary day feel extraordinary.`,
  anniversary: `To [Name], with all my heart 💍\n\nAnother year of us — of laughter, adventures, and a love that only deepens. Here's to forever.`,
  parents: `Dear [Name] 🌿\n\nThank you for every sacrifice and every moment of unconditional love. You are my greatest blessing.`,
  colleague: `[Name],\n\nWorking alongside you has been an absolute pleasure. Wishing you all the success you deserve. ✦`,
};

const BGS = [
  { id: 'v1065-110', src: '/assets/v1065-110.jpg' },
  { id: '18929278', src: '/assets/18929278_rm175-noon-03b.jpg' },
  { id: '16398080', src: '/assets/16398080_v729-noon-4a.jpg' },
  { id: '119781', src: '/assets/119781.jpg' },
];

const PETALS = typeof window !== 'undefined'
  ? Array.from({ length: 12 }, (_, i) => ({ id: i, left: `${(i * 8.3) % 94}%`, delay: `${i * 0.9}s`, dur: `${10 + (i % 4) * 2.5}s`, size: 11 + (i % 4) * 4, char: ['🌸', '✦', '·', '♡', '✿'][i % 5] }))
  : [];

export default function Home() {
  const [step, setStep] = useState(1);
  const [category, setCat] = useState('');
  const [form, setForm] = useState({ sender: '', receiver: '', message: '', passkey: '' });
  const [selBg, setSelBg] = useState(BGS[0].id);
  const [hoverBg, setHoverBg] = useState(null);
  const [bgIdx, setBgIdx] = useState(0);
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

  const selectCat = (c) => { setCat(c.value); setForm(f => ({ ...f, message: TEMPLATES[c.value] || '' })); setStep(2); };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.message.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/wishes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ category, ...form, bg_image: selBg }) });
      const data = await res.json();
      if (data.id) { setWishId(data.id); setStep(3); }
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

  const cat = CATEGORIES.find(c => c.value === category);
  const bgSrc = BGS.find(b => b.id === (hoverBg || selBg))?.src;
  const wallBg = BGS[bgIdx].src;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html,body{height:100%;overflow:hidden;font-family:'DM Sans',sans-serif;-webkit-font-smoothing:antialiased;color:#fff;background:#0d0705}
        input,textarea,button{font-family:inherit}
        input::placeholder,textarea::placeholder{color:rgba(255,255,255,0.4)}
        textarea{resize:none}
        ::-webkit-scrollbar{width:0}

        @keyframes floatDown{0%{transform:translateY(-8vh) rotate(0deg);opacity:0}8%{opacity:.6}92%{opacity:.4}100%{transform:translateY(108vh) rotate(380deg);opacity:0}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes slideUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.04)}}

        .su  { animation: slideUp 0.45s cubic-bezier(.16,1,.3,1) both }
        .su2 { animation: slideUp 0.45s .08s cubic-bezier(.16,1,.3,1) both }
        .fi  { animation: fadeIn 0.35s ease both }

        .glass{background:rgba(255,255,255,0.07);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.12);border-radius:18px;overflow:hidden}
        .strip{height:3px;background:linear-gradient(90deg,#E8C4B8,#C9726B,#9B6E7A,#8A9E8B)}

        .cat-btn{display:flex;align-items:center;gap:9px;padding:11px 13px;background:rgba(255,255,255,0.09);border:1px solid rgba(255,255,255,0.11);border-radius:13px;cursor:pointer;color:rgba(255,255,255,0.88);font-size:13px;font-weight:500;text-align:left;width:100%;transition:background .2s,transform .2s,box-shadow .2s}
        .cat-btn:hover{background:rgba(255,255,255,0.18);transform:translateY(-1px)}

        /* Inputs that sit ON TOP of the image – minimal, transparent */
        .overlay-inp{
          background:rgba(0,0,0,0.22);
          border:none;
          border-bottom:1px solid rgba(255,255,255,0.3);
          border-radius:0;
          color:#fff;
          font-size:14px;
          outline:none;
          padding:7px 2px;
          width:100%;
          transition:border-color .2s;
        }
        .overlay-inp:focus{border-bottom-color:rgba(255,255,255,0.75)}
        .overlay-inp::placeholder{color:rgba(255,255,255,0.38)}

        .overlay-msg{
          background:transparent;
          border:none;
          color:#fff;
          font-family:'Playfair Display',serif;
          font-size:15px;
          font-style:italic;
          line-height:1.8;
          outline:none;
          padding:0;
          width:100%;
          flex:1;
        }
        .overlay-msg::placeholder{color:rgba(255,255,255,0.38);font-style:italic}

        .bg-thumb{height:44px;border-radius:8px;overflow:hidden;cursor:pointer;border:2px solid transparent;padding:0;position:relative;transition:transform .2s,border-color .2s}
        .bg-thumb:hover{transform:scale(1.07)}
        .bg-thumb.sel{border-color:#fff;box-shadow:0 0 0 2px rgba(255,255,255,0.2)}

        .btn-main{width:100%;padding:13px;border:none;border-radius:12px;background:rgba(255,255,255,0.92);color:#1a0e08;font-size:15px;font-weight:700;cursor:pointer;transition:all .22s;letter-spacing:.1px}
        .btn-main:hover:not(:disabled){background:#fff;transform:translateY(-1px);box-shadow:0 6px 20px rgba(0,0,0,.35)}
        .btn-main:disabled{opacity:.5;cursor:not-allowed}
      `}</style>

      {/* ── Rotating wallpaper (step 1 only) ──────────────── */}
      {BGS.map((bg, i) => (
        <div key={bg.id} style={{ position: 'fixed', inset: 0, zIndex: 0, backgroundImage: `url(${bg.src})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: step === 1 ? (i === bgIdx ? 1 : 0) : 0, transition: 'opacity 2.5s ease', willChange: 'opacity' }} />
      ))}

      {/* Step 2: selected bg as fixed full-screen */}
      {step === 2 && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 0, backgroundImage: `url(${bgSrc})`, backgroundSize: 'cover', backgroundPosition: 'center', transition: 'background-image 0.6s ease' }} />
      )}

      {/* Dark overlay */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 1, background: step === 2 ? 'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.72) 100%)' : 'linear-gradient(160deg,rgba(12,6,3,0.55),rgba(12,6,3,0.65))' }} />

      {/* Petals */}
      {mounted && PETALS.map(p => (
        <div key={p.id} style={{ position: 'fixed', left: p.left, top: '-28px', fontSize: p.size, zIndex: 1, pointerEvents: 'none', opacity: .35, animation: `floatDown ${p.dur} ${p.delay} linear infinite` }}>{p.char}</div>
      ))}

      {/* ── Content ──────────────────────────────────────── */}
      <div style={{ position: 'relative', zIndex: 2, height: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 16px' }}>

        {/* Brand */}
        <div className="su" style={{ textAlign: 'center', marginBottom: step === 2 ? 8 : 18 }}>
          <p style={{ fontSize: 10, letterSpacing: '4px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginBottom: 7 }}>✦ wishit ✦</p>
          {step !== 2 && (
            <h1 style={{ fontFamily: 'Playfair Display,serif', fontSize: 'clamp(26px,5vw,36px)', fontWeight: 700, lineHeight: 1.15, textShadow: '0 2px 20px rgba(0,0,0,.4)' }}>
              {step === 1 && <><span>Send a wish</span><br /><em style={{ fontWeight: 400 }}>from the heart</em></>}
              {step === 3 && <em style={{ fontWeight: 400 }}>Your wish is ready</em>}
            </h1>
          )}
        </div>

        {/* ── STEP 1 ───────────────────────────────────── */}
        {step === 1 && (
          <div className="glass su2" style={{ width: '100%', maxWidth: 420 }}>
            <div className="strip" />
            <div style={{ padding: '18px 18px 20px' }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.45)', letterSpacing: '.5px', textTransform: 'uppercase', marginBottom: 12 }}>What's the occasion?</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {CATEGORIES.map(c => (
                  <button key={c.value} className="cat-btn" onClick={() => selectCat(c)}>
                    <span style={{ fontSize: 20 }}>{c.icon}</span>{c.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 2: write ON the image ───────────────── */}
        {step === 2 && (
          <div className="su" style={{ width: '100%', maxWidth: 440, display: 'flex', flexDirection: 'column', gap: 10 }}>

            {/* Bg picker row — minimal pills at top */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button onClick={() => setStep(1)} style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: 8, color: 'rgba(255,255,255,0.7)', fontSize: 12, cursor: 'pointer', padding: '5px 11px', whiteSpace: 'nowrap' }}>← Back</button>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6, flex: 1 }}>
                {BGS.map(bg => (
                  <button key={bg.id} className={`bg-thumb ${selBg === bg.id ? 'sel' : ''}`}
                    onClick={() => setSelBg(bg.id)} onMouseEnter={() => setHoverBg(bg.id)} onMouseLeave={() => setHoverBg(null)}>
                    <img src={bg.src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    {selBg === bg.id && <div style={{ position: 'absolute', inset: 0, background: 'rgba(201,114,107,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>✓</div>}
                  </button>
                ))}
              </div>
            </div>

            {/* Postcard — writing directly on image background */}
            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {/* From / To on one row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.5)', letterSpacing: '.5px', textTransform: 'uppercase', marginBottom: 4 }}>From</label>
                  <input className="overlay-inp" placeholder="Your name" value={form.sender} onChange={e => setForm(f => ({ ...f, sender: e.target.value }))} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.5)', letterSpacing: '.5px', textTransform: 'uppercase', marginBottom: 4 }}>To</label>
                  <input className="overlay-inp" placeholder="Their name" value={form.receiver} onChange={e => setForm(f => ({ ...f, receiver: e.target.value }))} />
                </div>
              </div>

              {/* Message textarea floating over image */}
              <div style={{ position: 'relative', marginBottom: 12 }}>
                <div style={{ position: 'absolute', top: -2, left: -2, fontSize: 40, color: 'rgba(255,255,255,0.12)', fontFamily: 'Playfair Display,serif', lineHeight: 1, pointerEvents: 'none' }}>"</div>
                <textarea
                  className="overlay-msg"
                  rows={6}
                  placeholder="Write your message here…"
                  value={form.message}
                  required
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  style={{ paddingLeft: 18 }}
                />
              </div>

              {/* Passkey + submit in one glass pill row */}
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input
                  type="password"
                  placeholder="🔐 Passkey (optional)"
                  value={form.passkey}
                  onChange={e => setForm(f => ({ ...f, passkey: e.target.value }))}
                  style={{ flex: 1, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10, color: '#fff', fontSize: 13, padding: '11px 13px', outline: 'none', fontFamily: 'inherit' }}
                  onFocus={e => e.target.style.borderColor = 'rgba(255,255,255,0.45)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
                />
                <button className="btn-main" type="submit" disabled={loading} style={{ width: 'auto', padding: '11px 20px', whiteSpace: 'nowrap' }}>
                  {loading ? '…' : 'Share  →'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── STEP 3 ───────────────────────────────────── */}
        {step === 3 && (
          <div className="glass su" style={{ width: '100%', maxWidth: 420, textAlign: 'center' }}>
            <div className="strip" />
            <div style={{ padding: '26px 22px 28px' }}>
              <div style={{ fontSize: 44, marginBottom: 12, display: 'inline-block', animation: 'pulse 2s ease-in-out infinite' }}>🎀</div>
              <h2 style={{ fontFamily: 'Playfair Display,serif', fontSize: 21, fontWeight: 700, marginBottom: 7 }}>Your wish is ready!</h2>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, marginBottom: 18, lineHeight: 1.6 }}>Share this link with your special someone</p>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 11, padding: '10px 12px', marginBottom: 10 }}>
                <span style={{ flex: 1, fontSize: 12, color: 'rgba(255,255,255,0.65)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'left' }}>{wishUrl}</span>
                <button onClick={copyLink} style={{ flexShrink: 0, padding: '6px 14px', borderRadius: 8, border: 'none', background: copied ? 'rgba(138,158,139,0.85)' : 'rgba(255,255,255,0.18)', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all .2s', whiteSpace: 'nowrap' }}>
                  {copied ? '✓ Copied!' : 'Copy'}
                </button>
              </div>

              {form.passkey && (
                <div style={{ background: 'rgba(255,200,130,0.1)', border: '1px solid rgba(255,200,130,0.2)', borderRadius: 9, padding: '10px 13px', marginBottom: 14, textAlign: 'left' }}>
                  <p style={{ fontSize: 12, color: 'rgba(255,220,160,0.9)', lineHeight: 1.5 }}>🔐 Share the passkey: <strong>{form.passkey}</strong></p>
                </div>
              )}

              <div style={{ height: 1, background: 'rgba(255,255,255,0.1)', margin: '14px 0' }} />
              <button style={{ padding: '10px 22px', borderRadius: 10, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.18)', color: 'rgba(255,255,255,0.75)', fontSize: 13, cursor: 'pointer' }}
                onClick={() => { setStep(1); setCat(''); setForm({ sender: '', receiver: '', message: '', passkey: '' }); setWishId(null); }}>
                + Create another wish
              </button>
            </div>
          </div>
        )}

        <p style={{ marginTop: 14, fontSize: 10, letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)' }}>Made with ♡ — WishIt</p>
      </div>
    </>
  );
}
