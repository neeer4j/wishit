'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

const BG_MAP = {
    'v1065-110': '/assets/v1065-110.jpg',
    '18929278': '/assets/18929278_rm175-noon-03b.jpg',
    '16398080': '/assets/16398080_v729-noon-4a.jpg',
    '119781': '/assets/119781.jpg',
};

/* Fallback wallpaper index rotates if no bg set */
const ALL_BGS = Object.values(BG_MAP);

const CAT_META = {
    birthday: { icon: '🎂', accent: '#E67E22' },
    love: { icon: '🌹', accent: '#C9726B' },
    friendship: { icon: '🫧', accent: '#3B6FD4' },
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
    const [fallbackIdx, setFallbackIdx] = useState(0);
    const [bgLoaded, setBgLoaded] = useState(false);
    const [passkeyError, setPasskeyError] = useState('');
    const [unlocking, setUnlocking] = useState(false);

    useEffect(() => {
        fetch(`/api/wishes/${id}`)
            .then(r => r.json())
            .then(data => {
                if (data.error) { setStatus('error'); return; }
                setWish(data);
                setBgSrc(data.bg_image ? BG_MAP[data.bg_image] : ALL_BGS[Math.floor(Math.random() * ALL_BGS.length)]);
                if (!data.hasPasskey) { setMessage(data.message); setStatus('unlocked'); }
                else setStatus('locked');
            })
            .catch(() => setStatus('error'));
    }, [id]);

    const unlock = async (e) => {
        e.preventDefault();
        setUnlocking(true);
        setPasskeyError('');
        try {
            const res = await fetch(`/api/wishes/${id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ passkey }),
            });
            const data = await res.json();
            if (data.message) {
                setMessage(data.message);
                if (data.bg_image) setBgSrc(BG_MAP[data.bg_image]);
                setStatus('unlocked');
            } else setPasskeyError("That passkey doesn't match. Try again.");
        } finally { setUnlocking(false); }
    };

    const meta = CAT_META[wish?.category] || { icon: '✉️', accent: '#9B6E7A' };

    const pageStyles = {
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 16px 64px',
        position: 'relative',
        overflow: 'hidden',
        background: '#0f0805',
    };

    return (
        <>
            <style>{`
        @keyframes fadeUp   { from {opacity:0;transform:translateY(18px)} to {opacity:1;transform:translateY(0)} }
        @keyframes fadeIn   { from {opacity:0} to {opacity:1} }
        @keyframes slowZoom { 0%,100%{transform:scale(1)} 50%{transform:scale(1.05)} }
        @keyframes pulse    { 0%,100%{transform:scale(1)} 50%{transform:scale(1.04)} }
        @keyframes floatDown {
          0%   {transform:translateY(-40px) rotate(0deg);opacity:0}
          5%   {opacity:1}
          100% {transform:translateY(110vh) rotate(360deg);opacity:0}
        }
        * { box-sizing:border-box; margin:0; padding:0; }
        body { font-family:'DM Sans',sans-serif; -webkit-font-smoothing:antialiased; }
        input::placeholder {color:rgba(255,255,255,0.35)}
        ::-webkit-scrollbar {width:4px}
        ::-webkit-scrollbar-thumb {background:rgba(255,255,255,0.2);border-radius:99px}
      `}</style>

            {/* Full-screen wallpaper bg */}
            {bgSrc && (
                <>
                    <img src={bgSrc} alt="" onLoad={() => setBgLoaded(true)}
                        style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0, opacity: bgLoaded ? 1 : 0, transition: 'opacity 1.4s ease', animation: bgLoaded ? 'slowZoom 20s ease-in-out infinite' : 'none', pointerEvents: 'none' }} />
                    <div style={{ position: 'fixed', inset: 0, zIndex: 1, background: 'linear-gradient(160deg,rgba(10,5,3,0.55),rgba(10,5,3,0.68))', opacity: bgLoaded ? 1 : 0, transition: 'opacity 1s ease' }} />
                </>
            )}

            {/* Floating petals */}
            {['🌸', '✦', '·', '♡', '✿'].map((c, i) => (
                <div key={i} style={{ position: 'fixed', left: `${15 + i * 18}%`, top: '-30px', fontSize: `${12 + i * 3}px`, opacity: 0.25, zIndex: 0, pointerEvents: 'none', animation: `floatDown ${8 + i * 3}s ${i * 2}s linear infinite` }}>{c}</div>
            ))}

            <div style={{ ...pageStyles, background: 'transparent' }}>
                {/* Brand */}
                <div style={{ textAlign: 'center', marginBottom: 24, position: 'relative', zIndex: 2, animation: 'fadeUp 0.5s ease both' }}>
                    <p style={{ fontSize: 11, letterSpacing: '4px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', fontWeight: 500 }}>✦ wishit ✦</p>
                </div>

                {/* Loading */}
                {status === 'loading' && (
                    <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', color: 'rgba(255,255,255,0.6)' }}>
                        <div style={{ fontSize: 44, marginBottom: 14, display: 'inline-block', animation: 'pulse 1.8s ease-in-out infinite' }}>💌</div>
                        <p style={{ fontSize: 14, fontFamily: 'DM Sans, sans-serif' }}>Opening your wish…</p>
                    </div>
                )}

                {/* Error */}
                {status === 'error' && (
                    <div style={{ position: 'relative', zIndex: 2, ...glassCard }}>
                        <div style={stripBar} />
                        <div style={{ padding: '32px 28px', textAlign: 'center' }}>
                            <div style={{ fontSize: 42, marginBottom: 12 }}>🍂</div>
                            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, color: '#fff', marginBottom: 8 }}>Wish not found</h2>
                            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, lineHeight: 1.65, marginBottom: 24 }}>This link may have expired or is invalid.</p>
                            <a href="/" style={{ display: 'inline-block', padding: '11px 24px', borderRadius: 10, background: 'rgba(255,255,255,0.9)', color: '#2D2D2D', textDecoration: 'none', fontSize: 14, fontWeight: 700 }}>
                                Create a wish
                            </a>
                        </div>
                    </div>
                )}

                {/* Wish card — with bg image INSIDE the card area */}
                {(status === 'locked' || status === 'unlocked') && (
                    <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: 460, animation: 'fadeUp 0.55s 0.1s ease both' }}>

                        {/* ── Card header with bg image ─────────── */}
                        <div style={{ position: 'relative', height: 180, borderRadius: '20px 20px 0 0', overflow: 'hidden' }}>
                            {/* Bg image inside the card header */}
                            {bgSrc && (
                                <>
                                    <img src={bgSrc} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: bgLoaded ? 1 : 0, transition: 'opacity 1.2s ease', animation: 'slowZoom 20s ease-in-out infinite' }} />
                                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%)' }} />
                                </>
                            )}
                            {/* Overlay text */}
                            <div style={{ position: 'relative', padding: '20px 24px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                                <div style={{ fontSize: 32, marginBottom: 8, animation: 'pulse 3s ease-in-out infinite', display: 'inline-block' }}>{meta.icon}</div>
                                {wish?.receiver && (
                                    <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, color: '#fff', lineHeight: 1.2, margin: 0, textShadow: '0 2px 12px rgba(0,0,0,0.4)' }}>
                                        Dear {wish.receiver}
                                    </h1>
                                )}
                                {wish?.sender && (
                                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 4 }}>
                                        from <span style={{ color: 'rgba(255,230,210,0.9)', fontWeight: 600 }}>{wish.sender}</span>
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* ── Card body ────────────────────────── */}
                        <div style={{ ...glassCard, borderRadius: '0 0 20px 20px', borderTop: 'none' }}>
                            <div style={{ padding: '26px 26px 30px' }}>

                                {/* Locked */}
                                {status === 'locked' && (
                                    <div style={{ animation: 'fadeIn 0.4s ease both' }}>
                                        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '1.5px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, margin: '0 auto 16px', animation: 'pulse 2.5s ease-in-out infinite' }}>🔐</div>
                                        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, color: '#fff', textAlign: 'center', marginBottom: 8 }}>This wish is sealed</h2>
                                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, textAlign: 'center', marginBottom: 22, lineHeight: 1.65 }}>
                                            Enter the secret passkey to reveal your message
                                        </p>
                                        <form onSubmit={unlock} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                            <input type="password" placeholder="Enter passkey…" value={passkey}
                                                onChange={e => setPasskey(e.target.value)} required
                                                style={{ width: '100%', padding: '13px 14px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10, fontSize: 16, textAlign: 'center', letterSpacing: '4px', color: '#fff', outline: 'none', transition: 'border-color 0.2s' }}
                                                onFocus={e => e.target.style.borderColor = 'rgba(255,255,255,0.5)'}
                                                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'} />
                                            {passkeyError && <p style={{ color: '#FC8181', fontSize: 13, textAlign: 'center' }}>{passkeyError}</p>}
                                            <button type="submit" disabled={unlocking}
                                                style={{ width: '100%', padding: 14, border: 'none', borderRadius: 11, background: 'rgba(255,255,255,0.92)', color: '#2D2D2D', fontSize: 15, fontWeight: 700, cursor: unlocking ? 'not-allowed' : 'pointer', opacity: unlocking ? 0.6 : 1, transition: 'all 0.25s' }}>
                                                {unlocking ? 'Unlocking…' : 'Reveal Message  →'}
                                            </button>
                                        </form>
                                    </div>
                                )}

                                {/* Unlocked */}
                                {status === 'unlocked' && message && (
                                    <div style={{ animation: 'fadeIn 0.7s ease both' }}>
                                        {/* Message in a frosted panel */}
                                        <div style={{ position: 'relative', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 14, padding: '22px 20px 20px 28px' }}>
                                            <span style={{ position: 'absolute', top: 4, left: 10, fontSize: 48, color: 'rgba(255,255,255,0.15)', fontFamily: 'Playfair Display, serif', lineHeight: 1, pointerEvents: 'none' }}>"</span>
                                            <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 16, lineHeight: 1.9, color: 'rgba(255,255,255,0.9)', fontStyle: 'italic', whiteSpace: 'pre-wrap', wordBreak: 'break-word', marginTop: 10 }}>
                                                {message}
                                            </p>
                                        </div>
                                        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.35)', fontSize: 11, marginTop: 18, letterSpacing: '1px', textTransform: 'uppercase' }}>
                                            Sent with love via WishIt ♡
                                        </p>
                                        <div style={{ height: 1, background: 'rgba(255,255,255,0.1)', margin: '18px 0' }} />
                                        <a href="/"
                                            style={{ display: 'block', textAlign: 'center', padding: 12, borderRadius: 11, border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.55)', textDecoration: 'none', fontSize: 14, transition: 'all 0.2s' }}
                                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'; e.currentTarget.style.color = 'rgba(255,255,255,0.9)'; }}
                                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = 'rgba(255,255,255,0.55)'; }}>
                                            Send your own wish →
                                        </a>
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>
                )}

                <p style={{ position: 'relative', zIndex: 2, marginTop: 28, fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', textAlign: 'center' }}>
                    Made with ♡ — WishIt
                </p>
            </div>
        </>
    );
}

const glassCard = {
    background: 'rgba(20,12,8,0.6)',
    backdropFilter: 'blur(28px)',
    WebkitBackdropFilter: 'blur(28px)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 20,
    overflow: 'hidden',
};

const stripBar = {
    height: 4,
    background: 'linear-gradient(90deg,#E8C4B8,#C9726B,#9B6E7A,#8A9E8B)',
};
