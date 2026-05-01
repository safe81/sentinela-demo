/* Sentinela — shared UI primitives (icons + small components) */

/* Lucide icons (subset, drawn inline for stability) */
const Icon = ({ name, size = 20, stroke = 1.75, ...rest }) => {
  const paths = {
    'scan-line':       <><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M3 12h18"/></>,
    'shield':          <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></>,
    'shield-check':    <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></>,
    'car':             <><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9L18.4 5.5C18.1 4.6 17.2 4 16.3 4H7.7c-.9 0-1.8.6-2.1 1.5L3.5 11.1C2.7 11.3 2 12.1 2 13v3c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/><path d="M5 17h8"/></>,
    'user':            <><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 0 0-16 0"/></>,
    'users':           <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
    'file-text':       <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></>,
    'clipboard-list':  <><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></>,
    'message-circle':  <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></>,
    'book-user':       <><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/><circle cx="12" cy="8" r="2"/><path d="M15 13a3 3 0 1 0-6 0"/></>,
    'map':             <><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></>,
    'map-pin':         <><path d="M20 10c0 7-8 12-8 12s-8-5-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></>,
    'siren':            <><path d="M7 18v-6a5 5 0 1 1 10 0v6"/><path d="M5 21a1 1 0 0 0 1-1v-1a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1a1 1 0 0 0 1 1Z"/><path d="M21 12h1"/><path d="M18.5 4.5 18 5"/><path d="M2 12h1"/><path d="M12 2v1"/><path d="m4.929 4.929.707.707"/></>,
    'fuel':            <><line x1="3" y1="22" x2="15" y2="22"/><line x1="4" y1="9" x2="14" y2="9"/><path d="M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18"/><path d="M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V9.83a2 2 0 0 0-.59-1.42L18 5"/></>,
    'gauge':           <><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></>,
    'alert-triangle':  <><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
    'alert-octagon':   <><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>,
    'check':           <><polyline points="20 6 9 17 4 12"/></>,
    'check-square':    <><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></>,
    'square':          <><rect x="3" y="3" width="18" height="18" rx="2"/></>,
    'x':               <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    'plus':            <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    'search':          <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
    'send':            <><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></>,
    'paperclip':       <><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></>,
    'arrow-up':        <><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></>,
    'arrow-down':      <><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></>,
    'arrow-right':     <><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>,
    'arrow-left':      <><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></>,
    'chevron-right':   <><polyline points="9 18 15 12 9 6"/></>,
    'chevron-down':    <><polyline points="6 9 12 15 18 9"/></>,
    'menu':            <><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></>,
    'bell':            <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></>,
    'phone':           <><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></>,
    'mail':            <><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="22 6 12 13 2 6"/></>,
    'log-out':         <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
    'home':            <><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>,
    'list':            <><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></>,
    'calendar':        <><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>,
    'clock':           <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    'upload':          <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></>,
    'download':        <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></>,
    'wifi-off':        <><line x1="2" y1="2" x2="22" y2="22"/><path d="M8.5 16.5a5 5 0 0 1 7 0"/><path d="M2 8.82a15 15 0 0 1 4.17-2.65"/><path d="M10.66 5c4.01-.36 8.14.9 11.34 3.76"/><path d="M16.85 11.25a10 10 0 0 1 2.22 1.68"/><path d="M5 13a10 10 0 0 1 5.24-2.76"/><line x1="12" y1="20" x2="12.01" y2="20"/></>,
    'video':           <><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></>,
    'image':           <><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></>,
    'settings':        <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.36.14.68.36.94.66"/></>,
    'flag':            <><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></>,
    'database':        <><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></>,
    'briefcase':       <><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></>,
    'activity':        <><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></>,
    'play':            <><polygon points="6 4 20 12 6 20 6 4"/></>,
    'pause':           <><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></>,
    'radio':           <><circle cx="12" cy="12" r="2"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"/></>,
    'scan':            <><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M7 12h10"/></>,
    'star':            <><polygon points="12 2 15 9 22 9.5 17 14.5 18.5 21.5 12 17.5 5.5 21.5 7 14.5 2 9.5 9 9 12 2"/></>,
    'clipboard':       <><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></>,
    'lock':            <><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>,
    'info':            <><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></>,
    'help-circle':     <><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
    'message-square':  <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></>,
    'eye':             <><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></>,
    'edit':            <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    'maximize':        <><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></>,
    'minimize':        <><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" y1="10" x2="21" y2="3"/><line x1="3" y1="21" x2="10" y2="14"/></>,
    'refresh-cw':      <><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></>,
    'filter':          <><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></>,
    'more-vertical':   <><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></>,
    'navigation':      <><polygon points="3 11 22 2 13 21 11 13 3 11"/></>,
    'moon':            <><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></>,
    'sun':             <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></>,
    'printer':         <><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></>,
    'briefcase':       <><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></>,
    'megaphone':       <><path d="M3 11l18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></>,
    'cloud-sun':       <><path d="M12 2v2M5.22 5.22l1.42 1.42M2 13h2M20 13h2M17.36 6.64l1.42-1.42M16 13a4 4 0 1 0-8 0"/><path d="M13 17H7a4 4 0 0 1 0-8 5.5 5.5 0 0 1 10.78-1H18a3 3 0 0 1 0 6h-1"/></>,
    'camera':          <><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" {...rest}>
      {paths[name] || <circle cx="12" cy="12" r="9"/>}
    </svg>
  );
};

/* Avatar with initials on brand-green */
const Avatar = ({ name, size = 32, role, style = {} }) => {
  const initials = (name || '').split(' ').filter(Boolean).slice(0, 2).map(s => s[0]).join('').toUpperCase();
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: 'var(--brand-green)', color: '#C9A24B',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-display)', fontWeight: 700,
      fontSize: size * 0.42, letterSpacing: '-0.02em',
      flexShrink: 0,
      ...style,
    }}>{initials}</div>
  );
};

/* License plate (PT format) */
const Plate = ({ value, size = 'md' }) => {
  const sizes = {
    sm: { h: 20, fs: 11, padL: 16, padR: 8 },
    md: { h: 26, fs: 14, padL: 20, padR: 10 },
    lg: { h: 36, fs: 19, padL: 26, padR: 12 },
  };
  const s = sizes[size] || sizes.md;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'stretch', height: s.h,
      border: '1.5px solid #20251F', borderRadius: 3, overflow: 'hidden',
      background: '#FFFFFF', fontFamily: 'var(--font-mono)', fontWeight: 700,
      fontSize: s.fs, lineHeight: 1, letterSpacing: '0.06em',
      flexShrink: 0,
    }}>
      <span style={{
        background: '#003399', color: '#FFCC00', display: 'flex', alignItems: 'center',
        justifyContent: 'center', width: s.padL, fontSize: s.fs * 0.55, fontWeight: 800,
      }}>P</span>
      <span style={{ display: 'flex', alignItems: 'center', padding: `0 ${s.padR}px`, color: '#20251F' }}>
        {value}
      </span>
    </span>
  );
};

/* Status dot */
const StatusDot = ({ tone = 'success', size = 8 }) => {
  const tones = {
    success: 'var(--success)', warning: 'var(--warning)', danger: 'var(--danger)',
    info: 'var(--info)', muted: 'var(--slate-400)', brand: 'var(--brand-green)',
  };
  return <span style={{ width: size, height: size, borderRadius: '50%', background: tones[tone], display: 'inline-block', flexShrink: 0 }}/>;
};

/* Badge */
const Badge = ({ tone = 'neutral', children, size = 'md' }) => {
  const tones = {
    neutral: { bg: 'var(--slate-100)', fg: 'var(--slate-700)', bd: 'var(--border)' },
    brand:   { bg: 'rgba(31,77,58,0.10)', fg: 'var(--brand-green)', bd: 'rgba(31,77,58,0.20)' },
    danger:  { bg: 'var(--danger-soft)', fg: 'var(--danger-deep)', bd: 'rgba(199,50,43,0.22)' },
    warning: { bg: 'var(--warning-soft)', fg: 'var(--warning-deep)', bd: 'rgba(216,138,42,0.22)' },
    info:    { bg: 'var(--info-soft)', fg: 'var(--info-deep)', bd: 'rgba(46,92,138,0.22)' },
    success: { bg: 'var(--success-soft)', fg: 'var(--success)', bd: 'rgba(47,125,74,0.22)' },
    gold:    { bg: 'rgba(201,162,75,0.14)', fg: 'var(--brand-gold-deep)', bd: 'rgba(201,162,75,0.30)' },
  };
  const t = tones[tone] || tones.neutral;
  const sizes = {
    sm: { fs: 10, py: 2, px: 6, h: 18 },
    md: { fs: 11, py: 3, px: 8, h: 22 },
  };
  const sz = sizes[size] || sizes.md;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      height: sz.h, padding: `0 ${sz.px}px`,
      background: t.bg, color: t.fg, border: `1px solid ${t.bd}`,
      borderRadius: 'var(--radius-pill)',
      fontFamily: 'var(--font-ui)', fontSize: sz.fs, fontWeight: 600,
      letterSpacing: '0.02em', textTransform: 'uppercase', whiteSpace: 'nowrap',
    }}>{children}</span>
  );
};

/* Button */
const Button = ({ tone = 'primary', size = 'md', children, icon, iconRight, ...rest }) => {
  const tones = {
    primary:   { bg: 'var(--brand-green)', fg: '#FFFFFF', bd: 'var(--brand-green)' },
    secondary: { bg: 'var(--surface)', fg: 'var(--fg)', bd: 'var(--border-strong)' },
    ghost:     { bg: 'transparent', fg: 'var(--fg)', bd: 'transparent' },
    danger:    { bg: 'var(--danger)', fg: '#FFFFFF', bd: 'var(--danger)' },
    gold:      { bg: 'var(--brand-gold)', fg: 'var(--fg-on-gold)', bd: 'var(--brand-gold)' },
  };
  const t = tones[tone] || tones.primary;
  const sizes = {
    sm: { h: 28, px: 10, fs: 12, gap: 6, ic: 14 },
    md: { h: 36, px: 14, fs: 13, gap: 8, ic: 16 },
    lg: { h: 44, px: 18, fs: 15, gap: 10, ic: 18 },
  };
  const sz = sizes[size] || sizes.md;
  return (
    <button {...rest} style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: sz.gap,
      height: sz.h, padding: `0 ${sz.px}px`, background: t.bg, color: t.fg,
      border: `1px solid ${t.bd}`, borderRadius: 'var(--radius-md)',
      fontFamily: 'var(--font-ui)', fontSize: sz.fs, fontWeight: 600,
      cursor: 'pointer', letterSpacing: 0,
      transition: `background var(--motion-fast) var(--ease-out), transform var(--motion-fast) var(--ease-out)`,
      ...rest.style,
    }} onMouseDown={e=>e.currentTarget.style.transform='scale(0.98)'}
       onMouseUp={e=>e.currentTarget.style.transform=''}
       onMouseLeave={e=>e.currentTarget.style.transform=''}>
      {icon && <Icon name={icon} size={sz.ic}/>}
      {children}
      {iconRight && <Icon name={iconRight} size={sz.ic}/>}
    </button>
  );
};

Object.assign(window, { Icon, Avatar, Plate, StatusDot, Badge, Button });
