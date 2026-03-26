'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';


const BG_MAP = {
    'v1065-110': '/assets/v1065-110.jpg',
    '18929278': '/assets/18929278_rm175-noon-03b.jpg',
    '16398080': '/assets/16398080_v729-noon-4a.jpg',
    '119781': '/assets/119781.jpg',
    '126893': '/assets/126893.jpg',
    '139683': '/assets/139683.jpg',
    '16340746': '/assets/16340746_v802-tang-19.jpg',
    '16351030': '/assets/16351030_v850-sasi-18.jpg',
    '169295': '/assets/169295.jpg',
    '18705968': '/assets/18705968_rm184-aum-05e.jpg',
    '18930119': '/assets/18930119_rm428-0056.jpg',
    '2150241036': '/assets/2150241036.jpg',
    '393': '/assets/393.jpg',
    '78': '/assets/78.jpg',
    'bg': '/assets/bg.jpg',
};
const ALL_BGS = Object.values(BG_MAP);

const FONT_MAP = {
    playfair: 'var(--font-playfair), serif',
    cormorant: 'var(--font-cormorant), serif',
    lora: 'var(--font-lora), serif',
    cinzel: 'var(--font-cinzel), serif',
    dancing: 'var(--font-dancing), cursive',
    sacramento: 'var(--font-sacramento), cursive',
    greatvibes: 'var(--font-great-vibes), cursive',
    dmsans: 'var(--font-dm-sans), sans-serif',
};

// Which fonts render italic in the viewer
const FONT_ITALIC = new Set(['playfair', 'cormorant', 'lora']);

const CAT_META = {
    birthday: { icon: '🎂', accent: '#E67E22' },
    love: { icon: '🌹', accent: '#C9726B' },
    friendship: { icon: '🫧', accent: '#3B82F6' },
    anniversary: { icon: '💍', accent: '#8E44AD' },
    parents: { icon: '🌿', accent: '#27AE60' },
    colleague: { icon: '✦', accent: '#7F6E5D' },
    new_year: { icon: '🎆', accent: '#F59E0B' },
    graduation: { icon: '🎓', accent: '#6366F1' },
    farewell: { icon: '🌅', accent: '#F97316' },
    get_well: { icon: '🌻', accent: '#FBBF24' },
    congratulations: { icon: '🏆', accent: '#10B981' },
    baby_shower: { icon: '🍼', accent: '#EC4899' },
};

// Countdown helper
function Countdown({ target }) {
    const [timeLeft, setTimeLeft] = useState('');
    useEffect(() => {
        const tick = () => {
            const diff = new Date(target) - new Date();
            if (diff <= 0) { setTimeLeft('Now!'); return; }
            const d = Math.floor(diff / 86400000);
            const h = Math.floor((diff % 86400000) / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            const s = Math.floor((diff % 60000) / 1000);
            setTimeLeft(d > 0 ? `${d}d ${h}h ${m}m` : `${h}h ${m}m ${s}s`);
        };
        tick();
        const iv = setInterval(tick, 1000);
        return () => clearInterval(iv);
    }, [target]);
    return <span>{timeLeft}</span>;
}

export default function WishPage() {
    const { id } = useParams();
    const [wish, setWish] = useState(null);
    const [status, setStatus] = useState('loading'); // loading | locked | unlocked | error | expired | scheduled
    const [passkey, setPasskey] = useState('');
    const [message, setMessage] = useState(null);
    const [bgSrc, setBgSrc] = useState(null);
    const [bgReady, setBgReady] = useState(false);
    const [pkErr, setPkErr] = useState('');
    const [working, setWorking] = useState(false);
    const [font, setFont] = useState('playfair');
    const [overlayOpacity, setOverlayOpacity] = useState(0.55);
    const [openedMarked, setOpenedMarked] = useState(false);
    const [fontColor, setFontColor] = useState('#ffffff');
    useEffect(() => {
        if (!id) return;
        fetch(`/api/wishes/${id}`)
            .then(r => r.json())
            .then(data => {
                if (data.error) { setStatus('error'); return; }

                if (data.expired) { setStatus('expired'); return; }

                if (data.scheduled) {
                    setWish(data);
                    setStatus('scheduled');
                    return;
                }

                setWish(data);
                if (data.font) setFont(data.font);
                if (data.overlay_opacity != null) setOverlayOpacity(data.overlay_opacity);
                if (data.font_color) setFontColor(data.font_color);
                const src = data.bg_image ? BG_MAP[data.bg_image] : ALL_BGS[Math.floor(Math.random() * ALL_BGS.length)];
                setBgSrc(src);
                if (!data.hasPasskey) {
                    setMessage(data.message);
                    setStatus('unlocked');
                } else {
                    setStatus('locked');
                }
            })
            .catch(() => setStatus('error'));
    }, [id]);

    // Mark as opened once unlocked
    useEffect(() => {
        if (status === 'unlocked' && !openedMarked && id) {
            setOpenedMarked(true);
            fetch(`/api/wishes/${id}`, { method: 'PATCH' }).catch(() => { });
        }
    }, [status, openedMarked, id]);


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
            if (data.message) {
                setMessage(data.message);
                if (data.bg_image) setBgSrc(BG_MAP[data.bg_image]);
                if (data.font) setFont(data.font);
                if (data.overlay_opacity != null) setOverlayOpacity(data.overlay_opacity);
                setStatus('unlocked');
            } else {
                setPkErr("That passkey doesn't match. Try again.");
            }
        } catch { setPkErr('Network error. Try again.'); }
        finally { setWorking(false); }
    };

    const shareWish = async () => {
        const url = window.location.href;
        if (navigator.share) {
            try { await navigator.share({ title: 'A wish for you 💌', url }); }
            catch { /* cancelled */ }
        } else {
            await navigator.clipboard.writeText(url).catch(() => { });
        }
    };

    const meta = CAT_META[wish?.category] || { icon: '✉️', accent: '#9B6E7A' };
    const fontStyle = FONT_MAP[font] || FONT_MAP.playfair;
    const fontIsItalic = FONT_ITALIC.has(font);


    // Reply CTA — links back to home with pre-fill params
    const replyUrl = wish
        ? `/?reply=${id}&to=${encodeURIComponent(wish.sender || '')}&category=${wish.category}`
        : '/';

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent('💌 A heartfelt wish for you — ' + (typeof window !== 'undefined' ? window.location.href : ''))}`;

    return (
        <>
            <style>{`
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
        @keyframes spin { to { transform: rotate(360deg); } }
        .slide-up { animation: slideUp 0.5s cubic-bezier(.16,1,.3,1) both; }
        .fade-in  { animation: fadeIn 0.4s ease both; }
        .glass {
          background: rgba(15,8,4,0.58);
          backdrop-filter: blur(26px); -webkit-backdrop-filter: blur(26px);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px; overflow: hidden;
        }
        .strip { height: 3px; }
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
          max-height:calc(100dvh - 440px);
          overflow-y:auto;
        }
        .message-box::-webkit-scrollbar { width:3px; }
        .message-box::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.15); border-radius:99px; }
        .action-btn {
          display:flex; align-items:center; justify-content:center; gap:6px;
          padding:10px; border-radius:10px;
          border:1px solid rgba(255,255,255,0.13);
          color:rgba(255,255,255,0.55); text-decoration:none;
          font-size:13px; cursor:pointer; transition:all 0.2s;
          background:transparent; font-family:inherit; width:100%;
        }
        .action-btn:hover { border-color:rgba(255,255,255,0.35); color:rgba(255,255,255,0.9); background:rgba(255,255,255,0.05); transform:translateY(-1px); }
        .action-btn.reply { border-color:rgba(201,114,107,0.35); color:rgba(232,196,184,0.8); }
        .action-btn.reply:hover { border-color:rgba(201,114,107,0.7); background:rgba(201,114,107,0.1); color:#fff; }
        .action-btn.wa { border-color:rgba(37,211,102,0.25); color:rgba(150,255,180,0.7); }
        .action-btn.wa:hover { border-color:rgba(37,211,102,0.5); background:rgba(37,211,102,0.1); color:rgba(180,255,200,0.95); }
      `}</style>

            {/* Background image */}
            {bgSrc && (
                <>
                    <div style={{ position: 'fixed', inset: 0, zIndex: 0, opacity: bgReady ? 1 : 0, transition: 'opacity 1.8s ease', pointerEvents: 'none' }}>
                        <Image src={bgSrc} alt="" fill priority onLoad={() => setBgReady(true)} style={{ objectFit: 'cover' }} quality={85} />
                    </div>
                    <div style={{ position: 'fixed', inset: 0, zIndex: 1, background: `linear-gradient(160deg,rgba(10,4,2,${overlayOpacity * 0.9}),rgba(10,4,2,${overlayOpacity}))`, opacity: bgReady ? 1 : 0, transition: 'opacity 1.5s ease' }} />
                </>
            )}


            {/* Floating petals */}
            {['🌸', '✦', '·', '♡', '✿'].map((c, i) => (
                <div key={i} style={{ position: 'fixed', left: `${12 + i * 18}%`, top: '-24px', fontSize: 13 + i * 2, zIndex: 1, pointerEvents: 'none', opacity: 0.3, animation: `floatDown ${10 + i * 3}s ${i * 1.5}s linear infinite`, willChange: 'transform' }}>{c}</div>
            ))}

            <div style={{ position: 'relative', zIndex: 2, height: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 16px' }}>

                {/* Brand */}
                <p style={{ fontSize: 10, letterSpacing: '4px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 16 }}>✦ wishit ✦</p>

                {/* Loading */}
                {status === 'loading' && (
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 42, marginBottom: 12, animation: 'pulse 1.8s ease-in-out infinite', display: 'inline-block', willChange: 'transform' }}>💌</div>
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>Opening your wish…</p>
                    </div>
                )}

                {/* Error */}
                {status === 'error' && (
                    <div className="glass slide-up" style={{ width: '100%', maxWidth: 400 }}>
                        <div className="strip" style={{ background: 'linear-gradient(90deg,#E8C4B8,#C9726B,#9B6E7A)' }} />
                        <div style={{ padding: '32px 24px', textAlign: 'center' }}>
                            <div style={{ fontSize: 42, marginBottom: 12 }}>🍂</div>
                            <h2 style={{ fontFamily: 'Playfair Display,serif', fontSize: 20, marginBottom: 8 }}>Wish not found</h2>
                            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, lineHeight: 1.65, marginBottom: 22 }}>This link may be invalid or no longer available.</p>
                            <a href="/" style={{ display: 'inline-block', padding: '11px 24px', borderRadius: 10, background: 'rgba(255,255,255,0.9)', color: '#1a0e08', textDecoration: 'none', fontSize: 14, fontWeight: 700 }}>Create a wish</a>
                        </div>
                    </div>
                )}

                {/* Expired */}
                {status === 'expired' && (
                    <div className="glass slide-up" style={{ width: '100%', maxWidth: 400 }}>
                        <div className="strip" style={{ background: 'linear-gradient(90deg,#78350F,#B45309,#D97706)' }} />
                        <div style={{ padding: '32px 24px', textAlign: 'center' }}>
                            <div style={{ fontSize: 42, marginBottom: 12 }}>⌛</div>
                            <h2 style={{ fontFamily: 'Playfair Display,serif', fontSize: 20, marginBottom: 8 }}>This wish has expired</h2>
                            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, lineHeight: 1.65, marginBottom: 22 }}>The sender chose to set an expiry on this wish. It is no longer available.</p>
                            <a href="/" style={{ display: 'inline-block', padding: '11px 24px', borderRadius: 10, background: 'rgba(255,255,255,0.9)', color: '#1a0e08', textDecoration: 'none', fontSize: 14, fontWeight: 700 }}>Send your own wish</a>
                        </div>
                    </div>
                )}

                {/* Scheduled — not unlocked yet */}
                {status === 'scheduled' && wish && (
                    <div className="glass slide-up" style={{ width: '100%', maxWidth: 400 }}>
                        <div className="strip" style={{ background: 'linear-gradient(90deg,#1E3A5F,#3B82F6,#60A5FA)' }} />
                        <div style={{ padding: '32px 24px', textAlign: 'center' }}>
                            <div style={{ fontSize: 42, marginBottom: 12, animation: 'pulse 2.5s ease-in-out infinite', display: 'inline-block', willChange: 'transform' }}>⏰</div>
                            <h2 style={{ fontFamily: 'Playfair Display,serif', fontSize: 20, marginBottom: 8 }}>
                                {wish.sender ? `${wish.sender} has a wish for you` : 'A wish is waiting for you'}
                            </h2>
                            {wish.receiver && <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, marginBottom: 16 }}>Dear {wish.receiver},</p>}
                            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, lineHeight: 1.65, marginBottom: 10 }}>This wish unlocks in</p>
                            <div style={{ fontSize: 28, fontFamily: 'Playfair Display,serif', fontWeight: 700, color: '#93C5FD', marginBottom: 18 }}>
                                <Countdown target={wish.scheduled_at} />
                            </div>
                            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.5px' }}>
                                {new Date(wish.scheduled_at).toLocaleString()}
                            </p>
                        </div>
                    </div>
                )}

                {/* Wish card */}
                {(status === 'locked' || status === 'unlocked') && (
                    <div className="glass slide-up" style={{ width: '100%', maxWidth: 440 }}>

                        {/* Card header */}
                        <div style={{ position: 'relative', height: 150, overflow: 'hidden' }}>
                            {bgSrc && (
                                <>
                                    <Image src={bgSrc} alt="" fill sizes="440px" style={{ objectFit: 'cover', opacity: bgReady ? 1 : 0, transition: 'opacity 1.5s ease' }} quality={60} />
                                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom,rgba(0,0,0,0.08),rgba(0,0,0,0.65))' }} />
                                </>
                            )}
                            <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '14px 20px' }}>
                                <div style={{ fontSize: 28, marginBottom: 6, animation: 'pulse 3s ease-in-out infinite', display: 'inline-block', willChange: 'transform' }}>{meta.icon}</div>
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
                                    <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, margin: '0 auto 14px', animation: 'pulse 2.5s ease-in-out infinite', willChange: 'transform' }}>🔐</div>
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
                                        <p style={{ fontFamily: fontStyle, fontSize: 16, lineHeight: 1.85, color: fontColor, fontStyle: fontIsItalic ? 'italic' : 'normal', whiteSpace: 'pre-wrap', wordBreak: 'break-word', marginTop: 8 }}>
                                            {message}
                                        </p>
                                    </div>
                                    <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 11, marginTop: 14, letterSpacing: '1px', textTransform: 'uppercase' }}>Sent with love via WishIt ♡</p>

                                    <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '14px 0' }} />

                                    {/* Action buttons */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                        {/* Reply */}
                                        <a href={replyUrl} className="action-btn reply">
                                            💌 Send a reply
                                        </a>

                                        {/* Share row */}
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                                            <button className="action-btn" onClick={shareWish}>
                                                ⬆ Share this wish
                                            </button>
                                            <a className="action-btn wa" href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                                                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /><path d="M11.999 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.975-1.305A9.944 9.944 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" /></svg>
                                                WhatsApp
                                            </a>
                                        </div>

                                        {/* Create own */}
                                        <a href="/" className="action-btn" style={{ textAlign: 'center' }}>
                                            Send your own wish →
                                        </a>
                                    </div>
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
