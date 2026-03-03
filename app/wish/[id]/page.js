'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

const BG_MAP = {
    'v1065-110': '/assets/v1065-110.jpg',
    '18929278': '/assets/18929278_rm175-noon-03b.jpg',
    '16398080': '/assets/16398080_v729-noon-4a.jpg',
    '119781': '/assets/119781.jpg',
};
const ALL_BGS = Object.values(BG_MAP);

const CAT_META = {
    birthday: { icon: '🎂', accent: '#E67E22' },
    love: { icon: '🌹', accent: '#C9726B' },
    friendship: { icon: '🫧', accent: '#3B82F6' },
    anniversary: { icon: '💍', accent: '#8E44AD' },
    parents: { icon: '🌿', accent: '#27AE60' },
    colleague: { icon: '✦', accent: '#7F6E5D' },
};

export default function WishPage() {
    const { id } = useParams();
    const [wish, setWish] = useState(null);
    const [status, setStatus] = useState('loading');
    const [passkey, setPasskey] = useState('');
    const [message, setMessage] = useState(null);
    const [bgSrc, setBgSrc] = useState(null);
    const [bgReady, setBgReady] = useState(false);
    const [pkErr, setPkErr] = useState('');
    const [working, setWorking] = useState(false);

    useEffect(() => {
        if (!id) return;
        fetch(`/api/wishes/${id}`)
            .then(r => r.json())
            .then(data => {
                if (data.error) { setStatus('error'); return; }
                setWish(data);
                const src = data.bg_image ? BG_MAP[data.bg_image] : ALL_BGS[Math.floor(Math.random() * ALL_BGS.length)];
                setBgSrc(src);
                if (!data.hasPasskey) { setMessage(data.message); setStatus('unlocked'); }
                else setStatus('locked');
            })
            .catch(() => setStatus('error'));
    }, [id]);

    const unlock = async (e) => {
        e.preventDefault();
        setWorking(true); setPkErr('');
        try {
            const res = await fetch(`/api/wishes/${id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ passkey }),
            });
            const data = await res.json();
            if (data.message) { setMessage(data.message); if (data.bg_image) setBgSrc(BG_MAP[data.bg_image]); setStatus('unlocked'); }
            else setPkErr("That passkey doesn't match. Try again.");
        } catch { setPkErr('Network error. Try again.'); }
        finally { setWorking(false); }
    };

    const meta = CAT_META[wish?.category] || { icon: '✉️', accent: '#9B6E7A' };

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { height: 100%; overflow: hidden; font-family: 'DM Sans', sans-serif; -webkit-font-smoothing: antialiased; color: #fff; background: #0d0705; }
        input, button { font-family: inherit; }
        input::placeholder { color: rgba(255,255,255,0.35); }
        ::-webkit-scrollbar { width: 0; }
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes slideUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse   { 0%,100%{transform:scale(1)} 50%{transform:scale(1.04)} }
        @keyframes floatDown {
          0%   {transform:translateY(-8vh) rotate(0deg);opacity:0}
          8%   {opacity:0.55}
          92%  {opacity:0.4}
          100% {transform:translateY(108vh) rotate(380deg);opacity:0}
        }
        .slide-up { animation: slideUp 0.5s cubic-bezier(.16,1,.3,1) both; }
        .fade-in  { animation: fadeIn 0.4s ease both; }
        .glass {
          background: rgba(15,8,4,0.58);
          backdrop-filter: blur(26px); -webkit-backdrop-filter: blur(26px);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px; overflow: hidden;
        }
        .strip { height: 3px; background: linear-gradient(90deg,#E8C4B8,#C9726B,#9B6E7A); }
        .inp {
          width:100%; padding:12px 13px;
          background:rgba(0,0,0,0.28);
          border:1px solid rgba(255,255,255,0.14);
          border-radius:10px; color:#fff; font-size:15px;
          outline:none; transition:border-color 0.2s,box-shadow 0.2s;
          text-align:center; letter-spacing:3px;
          -webkit-appearance:none;
        }
        .inp:focus { border-color:rgba(255,255,255,0.5); box-shadow:0 0 0 2px rgba(255,255,255,0.07); }
        .btn {
          width:100%; padding:13px; border:none; border-radius:11px;
          background:rgba(255,255,255,0.92); color:#1a0e08;
          font-size:15px; font-weight:700; cursor:pointer;
          transition:all 0.22s; font-family:inherit;
        }
        .btn:hover:not(:disabled) { background:#fff; transform:translateY(-1px); box-shadow:0 6px 20px rgba(0,0,0,0.35); }
        .btn:disabled { opacity:0.5; cursor:not-allowed; }
        .message-box {
          position:relative;
          background:rgba(255,255,255,0.06);
          border:1px solid rgba(255,255,255,0.1);
          border-radius:14px; padding:20px 18px 18px 24px;
          max-height:calc(100dvh - 420px);
          overflow-y:auto;
        }
        .message-box::-webkit-scrollbar { width:3px; }
        .message-box::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.15); border-radius:99px; }
      `}</style>

            {/* Background image */}
            {bgSrc && (
                <>
                    <img src={bgSrc} alt="" onLoad={() => setBgReady(true)}
                        style={{
                            position: 'fixed', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0,
                            opacity: bgReady ? 1 : 0, transition: 'opacity 1.8s ease', pointerEvents: 'none'
                        }} />
                    <div style={{ position: 'fixed', inset: 0, zIndex: 1, background: 'linear-gradient(160deg,rgba(10,4,2,0.54),rgba(10,4,2,0.66))', opacity: bgReady ? 1 : 0, transition: 'opacity 1.5s ease' }} />
                </>
            )}

            {/* Floating petals */}
            {['🌸', '✦', '·', '♡', '✿'].map((c, i) => (
                <div key={i} style={{ position: 'fixed', left: `${12 + i * 18}%`, top: '-24px', fontSize: 13 + i * 2, zIndex: 1, pointerEvents: 'none', opacity: 0.3, animation: `floatDown ${10 + i * 3}s ${i * 1.5}s linear infinite` }}>{c}</div>
            ))}

            <div style={{ position: 'relative', zIndex: 2, height: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 16px' }}>

                {/* Brand */}
                <p style={{ fontSize: 10, letterSpacing: '4px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 16 }}>✦ wishit ✦</p>

                {/* Loading */}
                {status === 'loading' && (
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 42, marginBottom: 12, animation: 'pulse 1.8s ease-in-out infinite', display: 'inline-block' }}>💌</div>
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>Opening your wish…</p>
                    </div>
                )}

                {/* Error */}
                {status === 'error' && (
                    <div className="glass slide-up" style={{ width: '100%', maxWidth: 400 }}>
                        <div className="strip" />
                        <div style={{ padding: '32px 24px', textAlign: 'center' }}>
                            <div style={{ fontSize: 42, marginBottom: 12 }}>🍂</div>
                            <h2 style={{ fontFamily: 'Playfair Display,serif', fontSize: 20, marginBottom: 8 }}>Wish not found</h2>
                            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, lineHeight: 1.65, marginBottom: 22 }}>This link may be invalid or no longer available.</p>
                            <a href="/" style={{ display: 'inline-block', padding: '11px 24px', borderRadius: 10, background: 'rgba(255,255,255,0.9)', color: '#1a0e08', textDecoration: 'none', fontSize: 14, fontWeight: 700 }}>Create a wish</a>
                        </div>
                    </div>
                )}

                {/* Wish card */}
                {(status === 'locked' || status === 'unlocked') && (
                    <div className="glass slide-up" style={{ width: '100%', maxWidth: 440 }}>

                        {/* Card header — bg image inside card */}
                        <div style={{ position: 'relative', height: 150, overflow: 'hidden' }}>
                            {bgSrc && (
                                <>
                                    <img src={bgSrc} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: bgReady ? 1 : 0, transition: 'opacity 1.5s ease' }} />
                                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom,rgba(0,0,0,0.08),rgba(0,0,0,0.65))' }} />
                                </>
                            )}
                            <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '14px 20px' }}>
                                <div style={{ fontSize: 28, marginBottom: 6, animation: 'pulse 3s ease-in-out infinite', display: 'inline-block' }}>{meta.icon}</div>
                                {wish?.receiver && (
                                    <h1 style={{ fontFamily: 'Playfair Display,serif', fontSize: 22, lineHeight: 1.2, textShadow: '0 2px 10px rgba(0,0,0,0.5)', margin: 0 }}>
                                        Dear {wish.receiver}
                                    </h1>
                                )}
                                {wish?.sender && (
                                    <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12, marginTop: 3 }}>
                                        from <span style={{ color: 'rgba(255,220,200,0.9)', fontWeight: 600 }}>{wish.sender}</span>
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Gradient strip */}
                        <div style={{ height: 3, background: `linear-gradient(90deg,${meta.accent}88,${meta.accent})` }} />

                        {/* Card body */}
                        <div style={{ padding: '22px 22px 26px' }}>

                            {/* Locked */}
                            {status === 'locked' && (
                                <div className="fade-in">
                                    <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, margin: '0 auto 14px', animation: 'pulse 2.5s ease-in-out infinite' }}>🔐</div>
                                    <h2 style={{ fontFamily: 'Playfair Display,serif', fontSize: 18, textAlign: 'center', marginBottom: 6 }}>This wish is sealed</h2>
                                    <p style={{ color: 'rgba(255,255,255,0.48)', fontSize: 13, textAlign: 'center', marginBottom: 20, lineHeight: 1.6 }}>Enter the secret passkey to unlock your message</p>
                                    <form onSubmit={unlock} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                        <input className="inp" type="password" placeholder="Enter passkey…" value={passkey}
                                            onChange={e => setPasskey(e.target.value)} required />
                                        {pkErr && <p style={{ color: '#FC8181', fontSize: 12, textAlign: 'center' }}>{pkErr}</p>}
                                        <button className="btn" type="submit" disabled={working}>{working ? 'Unlocking…' : 'Reveal Message  →'}</button>
                                    </form>
                                </div>
                            )}

                            {/* Unlocked */}
                            {status === 'unlocked' && message && (
                                <div className="fade-in">
                                    <div className="message-box">
                                        <span style={{ position: 'absolute', top: 2, left: 10, fontSize: 44, color: 'rgba(255,255,255,0.1)', fontFamily: 'Playfair Display,serif', lineHeight: 1, pointerEvents: 'none' }}>"</span>
                                        <p style={{ fontFamily: 'Playfair Display,serif', fontSize: 16, lineHeight: 1.85, color: 'rgba(255,255,255,0.9)', fontStyle: 'italic', whiteSpace: 'pre-wrap', wordBreak: 'break-word', marginTop: 8 }}>
                                            {message}
                                        </p>
                                    </div>
                                    <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 11, marginTop: 14, letterSpacing: '1px', textTransform: 'uppercase' }}>Sent with love via WishIt ♡</p>
                                    <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '14px 0' }} />
                                    <a href="/" style={{ display: 'block', textAlign: 'center', padding: '10px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.13)', color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: 13, transition: 'all 0.2s', fontFamily: 'DM Sans,sans-serif' }}
                                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)'; e.currentTarget.style.color = 'rgba(255,255,255,0.85)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.13)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}>
                                        Send your own wish →
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <p style={{ marginTop: 14, fontSize: 10, letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)' }}>Made with ♡ — WishIt</p>
            </div>
        </>
    );
}
