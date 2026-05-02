#!/usr/bin/env node
/* Sentinela — build script
   Produces:
     dist/app.html      — single self-contained file (open directly in any browser)
     dist/mobile.html   — standalone mobile (legacy)
     dist/pc.html       — standalone PC (legacy)
     dist/relatorio.html
*/

const fs   = require('fs');
const path = require('path');

const ROOT = __dirname;
const DIST = path.join(ROOT, 'dist');

if (!fs.existsSync(DIST)) fs.mkdirSync(DIST);

function copyDir(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  for (const f of fs.readdirSync(src)) {
    const s = path.join(src, f), d = path.join(dest, f);
    fs.statSync(s).isDirectory() ? copyDir(s, d) : fs.copyFileSync(s, d);
  }
}
copyDir(path.join(ROOT, 'assets'),  path.join(DIST, 'assets'));
copyDir(path.join(ROOT, 'preview'), path.join(DIST, 'preview'));

function read(filePath) {
  return fs.readFileSync(path.join(ROOT, filePath.replace(/\?.*$/, '')), 'utf8');
}

/* ─── Inline build for the legacy multi-file dist ─── */
function buildInline(srcName, destName) {
  let html = read(srcName);
  html = html.replace(/<link rel="stylesheet" href="([^"]+)">/g, (m, href) => {
    if (href.startsWith('http')) return m;
    try { return `<style>\n${read(href)}\n</style>`; } catch { return m; }
  });
  html = html.replace(/<script src="([^"]+)"([^>]*)><\/script>/g, (m, src, attrs) => {
    if (src.startsWith('http')) return m;
    try { return `<script${attrs}>\n${read(src)}\n</script>`; } catch { return m; }
  });
  html = html.replace(/<script type="text\/babel" src="([^"]+)"([^>]*)><\/script>/g, (m, src, attrs) => {
    try { return `<script type="text/babel"${attrs}>\n${read(src)}\n</script>`; } catch { return m; }
  });
  html = html.replace(/<link rel="manifest"[^>]+>\n?/g, '');
  const dest = path.join(DIST, destName);
  fs.writeFileSync(dest, html);
  console.log(`  ✓  ${destName.padEnd(22)} ${(fs.statSync(dest).size/1024).toFixed(1)} KB`);
}

/* ─── Single-file app.html ─── */
function buildSingleApp() {
  const css      = read('colors_and_type.css');
  const dataJs   = read('data.js');
  const storeJs  = read('store.js');

  // PC inline logic: rename App → PCApp, strip ReactDOM bootstrap call
  const pcInline = read('pc.html')
    .match(/<script type="text\/babel">\n([\s\S]+)\n<\/script>\n<\/body>/)[1]
    .replace(/^const App = /m, 'const PCApp = ')
    .replace(/\nReactDOM\.createRoot[\s\S]+$/, '');

  const CDN = `
<script src="https://unpkg.com/react@18.3.1/umd/react.development.js" integrity="sha384-hD6/rw4ppMLGNu3tX5cjIb+uRZ7UkRJ6BPkLpg4hAu/6onKUg4lLsHAs9EBPT82L" crossorigin="anonymous"></script>
<script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js" integrity="sha384-u6aeetuaXnQ38mYT8rp6sbXaQe3NL9t+IBXmnYxwkUI2Hw4bsp2Wvmx4yRQF1uAm" crossorigin="anonymous"></script>
<script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js" integrity="sha384-m08KidiNqLdpJqLq95G/LEi8Qvjl/xUYll3QILypMoQ65QorJ9Lvtp2RXYGBFj1y" crossorigin="anonymous"></script>`.trim();

  const inlineJsx = (...files) =>
    files.map(f => `<script type="text/babel">\n${read(f)}\n</script>`).join('\n');

  // The top-level AppShell + Launcher that ties everything together
  const appShell = `
const { useState, useEffect } = React;

/* ── Apply theme globally ── */
const useGlobalTheme = () => {
  const tema = window.SentinelaStore.useStore(s => s.tema);
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', tema === 'noturno' ? 'dark' : 'light');
  }, [tema]);
};

/* ── Mobile wrapper ── */
const MobileView = ({ onBack }) => {
  const me = window.SentinelaStore.useStore(s => s.militarLogadoId);
  const tema = window.SentinelaStore.useStore(s => s.tema);
  useEffect(() => {
    const el = document.getElementById('statusTime');
    if (!el) return;
    const tick = () => { el.textContent = new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }); };
    tick(); const id = setInterval(tick, 30000); return () => clearInterval(id);
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Topbar — desktop only */}
      <div className="hub-topbar">
        <button onClick={onBack} className="hub-back-btn">
          <Icon name="arrow-left" size={14}/> Hub
        </button>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, opacity: 0.6 }}>Sentinela · App do Militar</span>
        <div style={{ flex: 1 }}/>
        <button onClick={() => { window.SentinelaStore.actions.reset(); }} title="Reset demo" style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer', opacity: 0.5, fontSize: 11 }}>↻ reset</button>
      </div>

      {/* Phone frame on desktop, fullscreen on mobile */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="phone-outer">
          <div className="phone-notch-el"></div>
          <div className="phone-screen-el">
            <div className="phone-statusbar-el">
              <span id="statusTime">14:32</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span id="statusInd">GNR</span>
                <span>●●●●</span><span>4G</span><span>87%</span>
              </span>
            </div>
            <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <MobileShellV2/>
            </div>
          </div>
          <div className="phone-home-el"></div>
        </div>
      </div>
    </div>
  );
};

/* ── PC wrapper ── */
const PCView = ({ onBack }) => (
  <div style={{ width: '100vw', height: '100vh', display: 'flex', position: 'relative', overflow: 'hidden' }}>
    <PCApp/>
    <button onClick={onBack} title="Voltar ao hub"
      style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 9999,
        background: 'var(--brand-green-deep)', color: '#C9A24B', border: 'none',
        borderRadius: 999, padding: '8px 16px', fontWeight: 700, fontSize: 12,
        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
        boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
      }}>
      <Icon name="arrow-left" size={13}/> Hub
    </button>
  </div>
);

/* ── Launcher ── */
const Launcher = ({ onSelect }) => {
  const patrulhas = window.SentinelaStore.useStore(s => s.patrulhasHistorico.length + (s.patrulhaAtual ? 1 : 0));
  const alertas   = window.SentinelaStore.useStore(s => s.alertas.filter(a => !a.confirmado).length);
  const tema      = window.SentinelaStore.useStore(s => s.tema);

  const scenario = (kind) => {
    const s = window.SentinelaStore;
    if (kind === 'alerta-critico') s.actions.addAlerta({ matricula: '12-AB-34', motivo: 'Viatura furtada', severidade: 'critico', origem: 'BNDV — Aveiro 2024-08-14', local: 'Av. Carvalho Araújo', militar: 'Cb. Silva', indicativo: 'VRL-21' });
    else if (kind === 'alerta-aviso') s.actions.addAlerta({ matricula: '57-DT-91', motivo: 'Sem seguro válido', severidade: 'aviso', origem: 'ASF — desde 2026-01-12', local: 'EN2, km 14', militar: 'Cb. Silva', indicativo: 'VRL-21' });
    else if (kind === 'os-nova') s.actions.enviarOS({ titulo: 'OS 046/2026 — Reforço fim de semana', autor: 'Sarg. Costa Ribeiro', paginas: 2 });
    else if (kind === 'panico') s.actions.activarPanico(null);
    else if (kind === 'tema') s.actions.setTema(s.getState().tema === 'noturno' ? 'claro' : 'noturno');
    else if (kind === 'reset') { s.actions.reset(); }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', overflowY: 'auto' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px 60px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 40 }}>
          <img src="assets/sentinela-shield.svg" style={{ height: 52 }} alt=""/>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em' }}>SENTINELA</div>
            <div style={{ fontSize: 12, color: 'var(--brand-gold)', fontWeight: 600, letterSpacing: '0.12em' }}>PLATAFORMA OPERACIONAL · GNR</div>
          </div>
          <div style={{ flex: 1 }}/>
          <button onClick={() => scenario('tema')} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '7px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: 'var(--fg)' }}>
            <Icon name={tema === 'noturno' ? 'sun' : 'moon'} size={14}/>
            {tema === 'noturno' ? 'Modo dia' : 'Ronda noturna'}
          </button>
        </div>

        {/* Main cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginBottom: 28 }}>

          <button onClick={() => onSelect('mobile')} style={{
            background: 'var(--brand-green)', color: '#FFF', border: 'none',
            borderRadius: 16, padding: 28, textAlign: 'left', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', gap: 14,
            boxShadow: '0 8px 32px rgba(15,42,32,0.18)',
            transition: 'transform 120ms, box-shadow 120ms',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 12px 40px rgba(15,42,32,0.26)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='0 8px 32px rgba(15,42,32,0.18)'; }}>
            <div style={{ width: 52, height: 52, background: 'rgba(255,255,255,0.15)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="shield" size={28}/>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, marginBottom: 6 }}>App do Militar</div>
              <div style={{ fontSize: 13, opacity: 0.85, lineHeight: 1.5 }}>Login, abertura de patrulha, scanner ANPR, pânico, auto de notícia, chat e ordens de serviço.</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: '#C9A24B', marginTop: 'auto' }}>
              Abrir <Icon name="arrow-right" size={14}/>
            </div>
          </button>

          <button onClick={() => onSelect('pc')} style={{
            background: 'var(--surface)', color: 'var(--fg)',
            border: '1px solid var(--border)', borderRadius: 16, padding: 28, textAlign: 'left', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', gap: 14,
            boxShadow: 'var(--shadow-md)',
            transition: 'transform 120ms, box-shadow 120ms, border-color 120ms',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.borderColor='var(--brand-green)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.borderColor='var(--border)'; }}>
            <div style={{ width: 52, height: 52, background: 'var(--brand-green-deep)', color: '#C9A24B', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="activity" size={28}/>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Comando do Posto</div>
              <div style={{ fontSize: 13, color: 'var(--fg-muted)', lineHeight: 1.5 }}>Dashboard, alertas ANPR em tempo real, mapa de viaturas, ordens de serviço, escalas e briefing.</div>
            </div>
            {alertas > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--danger-soft)', color: 'var(--danger)', borderRadius: 8, padding: '6px 10px', fontSize: 12, fontWeight: 600, width: 'fit-content' }}>
                <Icon name="alert-octagon" size={14}/> {alertas} alerta{alertas > 1 ? 's' : ''} por confirmar
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: 'var(--brand-green)', marginTop: 'auto' }}>
              Abrir <Icon name="arrow-right" size={14}/>
            </div>
          </button>
        </div>

        {/* Scenario bar */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '18px 20px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-muted)', marginBottom: 12 }}>
            Cenários demo — clica para simular eventos em tempo real
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[
              ['alerta-critico', 'alert-octagon', 'Alerta crítico (furto)', 'var(--danger)'],
              ['alerta-aviso',   'alert-triangle','Aviso (sem seguro)',    'var(--warning)'],
              ['os-nova',        'file-text',     'Nova OS',               'var(--info)'],
              ['panico',         'siren',         'Ativar pânico',         'var(--danger)'],
            ].map(([k, icon, label, color]) => (
              <button key={k} onClick={() => scenario(k)} style={{
                background: 'var(--surface-2)', border: '1px solid var(--border)',
                borderRadius: 8, padding: '7px 12px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: 'var(--fg)',
              }}>
                <Icon name={icon} size={14} style={{ color }}/>
                {label}
              </button>
            ))}
            <button onClick={() => scenario('reset')} style={{
              marginLeft: 'auto', background: 'transparent', border: '1px solid var(--danger-soft)',
              borderRadius: 8, padding: '7px 12px', cursor: 'pointer', fontSize: 12, fontWeight: 600, color: 'var(--danger)',
            }}>↻ Reset demo</button>
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--fg-soft)', marginTop: 32 }}>
          Posto Territorial de Vila Real · Protótipo de demonstração · Dados fictícios
        </p>
      </div>
    </div>
  );
};

/* ── Root ── */
const AppShell = () => {
  const [view, setView] = React.useState('launcher');
  useGlobalTheme();
  if (view === 'mobile') return <MobileView onBack={() => setView('launcher')}/>;
  if (view === 'pc')     return <PCView     onBack={() => setView('launcher')}/>;
  return <Launcher onSelect={setView}/>;
};

ReactDOM.createRoot(document.getElementById('root')).render(<AppShell/>);
`;

  const html = `<!DOCTYPE html>
<html lang="pt-PT">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Sentinela — GNR</title>
<meta name="theme-color" content="#1F4D3A">
<link rel="manifest" href="manifest.json">
<link rel="apple-touch-icon" href="assets/icon-180.png">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Sentinela">
<link rel="apple-touch-startup-image" href="assets/splash-1290x2796.png" media="(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3)">
<link rel="apple-touch-startup-image" href="assets/splash-1179x2556.png" media="(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3)">
<link rel="apple-touch-startup-image" href="assets/splash-1170x2532.png" media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)">
<link rel="apple-touch-startup-image" href="assets/splash-750x1334.png"  media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)">
<style>
${css}

/* ── Single-file app shell ── */
html, body { height: 100%; margin: 0; overflow: hidden; }
#root { height: 100vh; }

.hub-topbar {
  height: 40px; background: var(--brand-green-deep); color: rgba(255,255,255,0.8);
  display: flex; align-items: center; padding: 0 16px; gap: 12; flex-shrink: 0;
  font-size: 12px;
}
.hub-back-btn {
  background: transparent; border: none; color: rgba(255,255,255,0.9); cursor: pointer;
  display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600;
  padding: 4px 8px; border-radius: 6px;
}
.hub-back-btn:hover { background: rgba(255,255,255,0.10); }

/* Phone frame — shown on desktop */
.phone-outer {
  width: 380px; height: calc(100vh - 80px); max-height: 780px;
  background: #0a0d0c; border-radius: 44px; padding: 12px;
  position: relative; border: 1.5px solid #2a3a35;
  box-shadow: 0 24px 60px rgba(15,42,32,0.22), 0 4px 12px rgba(15,42,32,0.12);
  display: flex; flex-direction: column;
}
.phone-notch-el {
  position: absolute; top: 14px; left: 50%; transform: translateX(-50%);
  width: 90px; height: 22px; background: #0a0d0c; border-radius: 16px; z-index: 5;
}
.phone-screen-el {
  flex: 1; background: var(--bg); border-radius: 32px; overflow: hidden;
  display: flex; flex-direction: column;
}
.phone-statusbar-el {
  height: 28px; background: var(--brand-green-deep); color: #FFF;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 22px; font-family: var(--font-mono); font-size: 11px; font-weight: 600;
  flex-shrink: 0;
}
.phone-home-el {
  position: absolute; bottom: 6px; left: 50%; transform: translateX(-50%);
  width: 120px; height: 4px; background: #FFF; opacity: 0.4; border-radius: 4px;
}

/* On real mobile: phone frame becomes fullscreen */
@media (max-width: 500px) {
  .hub-topbar { display: none; }
  .phone-outer {
    width: 100vw; height: 100vh; max-height: none; border-radius: 0; padding: 0;
    border: none; box-shadow: none; background: transparent;
  }
  .phone-notch-el, .phone-home-el { display: none; }
  .phone-screen-el { border-radius: 0; }
}
</style>
</head>
<body>
<div id="root"></div>

${CDN}

<script>
${dataJs}
</script>
<script>
${storeJs}
</script>
${inlineJsx('primitives.jsx')}
${inlineJsx(
    'app_mobile/Login.jsx',
    'app_mobile/Patrulha.jsx',
    'app_mobile/Ocorrencia.jsx',
    'app_mobile/Scanner.jsx',
    'app_mobile/Comms.jsx',
    'app_mobile/Extras.jsx',
    'app_mobile/Ferias.jsx',
    'app_mobile/RegistoPatrulha.jsx',
    'app_mobile/Checklist.jsx',
    'app_mobile/Escalas.jsx',
    'app_mobile/Wiki.jsx',
    'app_mobile/OrdensServico.jsx',
    'app_mobile/Emergencia.jsx',
    'app_mobile/Shell.jsx'
  )}
${inlineJsx(
    'app_pc/Dashboard.jsx',
    'app_pc/Briefing.jsx',
    'app_pc/PatrulhaRDS.jsx',
    'app_pc/Other.jsx',
    'app_pc/Estatisticas.jsx',
    'app_pc/Cronologia.jsx',
    'app_pc/FeriasPC.jsx',
    'app_pc/AdminPC.jsx',
    'app_pc/LoginPC.jsx',
    'app_pc/DashboardNew.jsx',
    'app_pc/CommsPC.jsx',
    'app_pc/WikiPC.jsx',
    'app_pc/ScannerPC.jsx',
    'app_pc/EscalasPC.jsx',
    'app_pc/OrdensServicoPC.jsx'
  )}
<script type="text/babel">
${pcInline}
</script>
<script type="text/babel">
${appShell}
</script>
</body>
</html>`;

  const dest = path.join(DIST, 'app.html');
  fs.writeFileSync(dest, html);
  console.log(`  ✓  ${'app.html'.padEnd(22)} ${(fs.statSync(dest).size/1024).toFixed(1)} KB  ← abre este`);
}

/* ─── Run ─── */
console.log('\nSentinela — build\n');
buildSingleApp();
buildInline('mobile.html',    'mobile.html');
buildInline('pc.html',        'pc.html');
buildInline('relatorio.html', 'relatorio.html');
console.log('\nPronto. Abre dist/app.html em qualquer browser.\n');
