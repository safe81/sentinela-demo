/* Sentinela PC — Dashboard sincronizado, mapa, despacho, OS */

const PCSidebar = ({ active, setActive }) => {
  const { useStore } = window.SentinelaStore;
  const alertas = useStore(s => s.alertas.filter(a => !a.confirmado).length);
  const ordens = useStore(s => s.ordens.filter(o => o.novo).length);
  const panico = useStore(s => s.panico);

  const items = [
    { id: 'dashboard', icon: 'activity', label: 'Dashboard' },
    { id: 'briefing',  icon: 'megaphone',label: 'Briefing diário' },
    { id: 'mapa',      icon: 'map',      label: 'Mapa em tempo real' },
    { id: 'alertas',   icon: 'alert-triangle', label: 'Alertas ANPR', badge: alertas },
    { id: 'patrulhas', icon: 'shield',   label: 'Patrulhas' },
    { id: 'viaturas',  icon: 'car',      label: 'Viaturas' },
    { id: 'militares', icon: 'users',    label: 'Militares' },
    { id: 'ordens',    icon: 'file-text',label: 'Ordens de serviço', badge: ordens },
    { id: 'escalas',   icon: 'calendar', label: 'Escalas' },
    { id: 'chat',      icon: 'message-square', label: 'Mensagens' },
    { id: 'estatisticas',  icon: 'activity',        label: 'Estatísticas' },
    { id: 'cronologia',   icon: 'clock',           label: 'Cronologia' },
    { id: 'ocorrencias',  icon: 'clipboard-list',  label: 'Ocorrências' },
    { id: 'ferias',       icon: 'sun',             label: 'Férias' },
    { id: 'admin',        icon: 'settings',        label: 'Administração' },
  ];

  return (
    <div style={{
      width: 240, background: 'var(--brand-green-deep)', color: '#FFF',
      display: 'flex', flexDirection: 'column', flexShrink: 0,
    }}>
      <div style={{ padding: '18px 18px 12px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <img src="assets/sentinela-wordmark-dark.svg" alt="Sentinela" style={{ height: 26 }}/>
        <div style={{ fontSize: 10, color: '#C9A24B', fontWeight: 600, letterSpacing: '0.12em', marginTop: 4 }}>POSTO VRL · COMANDO</div>
      </div>
      {panico && (
        <button onClick={() => setActive('panico')} style={{
          margin: 12, background: 'var(--danger)', color: '#FFF', border: 'none',
          borderRadius: 8, padding: '10px 12px', textAlign: 'left', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 8,
          animation: 'panicGlow 1s ease-in-out infinite alternate',
        }}>
          <Icon name="siren" size={18}/>
          <div style={{ fontWeight: 700, fontSize: 12 }}>PÂNICO ATIVO<br/><span style={{ fontSize: 10, opacity: 0.85 }} className="t-mono">{panico.indicativo}</span></div>
        </button>
      )}
      <style>{`@keyframes panicGlow{from{box-shadow:0 0 0 0 rgba(199,50,43,0.6)}to{box-shadow:0 0 0 8px rgba(199,50,43,0)}}`}</style>
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 8px' }}>
        {items.map(item => (
          <button key={item.id} onClick={() => setActive(item.id)} style={{
            width: '100%', background: active === item.id ? 'rgba(201,162,75,0.15)' : 'transparent',
            border: 'none', borderLeft: '3px solid ' + (active === item.id ? '#C9A24B' : 'transparent'),
            color: active === item.id ? '#FFF' : 'rgba(255,255,255,0.75)',
            padding: '10px 12px', textAlign: 'left', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, fontWeight: active === item.id ? 600 : 500,
            borderRadius: 0, marginBottom: 1,
          }}>
            <Icon name={item.icon} size={16}/>
            <span style={{ flex: 1 }}>{item.label}</span>
            {item.badge > 0 && <span style={{ background: 'var(--danger)', color: '#FFF', fontSize: 10, fontWeight: 700, borderRadius: 999, padding: '1px 6px' }}>{item.badge}</span>}
          </button>
        ))}
      </div>
      <div style={{ padding: 12, borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <Avatar name="Costa Ribeiro" size={32}/>
        <div style={{ flex: 1, fontSize: 12 }}>
          <div style={{ fontWeight: 600 }}>Sarg. Costa</div>
          <div style={{ color: '#C9A24B', fontSize: 10 }} className="t-mono">Cmdt. Posto VRL</div>
        </div>
        <button onClick={() => { window.SentinelaStore.actions.reset(); location.reload(); }} title="Reset demo" style={{ background: 'transparent', border: 'none', color: '#FFF', cursor: 'pointer', opacity: 0.6 }}>
          <Icon name="refresh-cw" size={14}/>
        </button>
      </div>
    </div>
  );
};

const PCTopbar = ({ title, subtitle, extra }) => {
  const [hora, setHora] = React.useState('');
  React.useEffect(() => {
    const tick = () => setHora(new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id);
  }, []);
  return (
    <div style={{
      height: 64, background: 'var(--surface)', borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', padding: '0 22px', gap: 16, flexShrink: 0,
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 18 }}>{title}</div>
        <div style={{ fontSize: 12, color: 'var(--fg-muted)' }}>{subtitle}</div>
      </div>
      {extra}
      <NotifBell/>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, color: 'var(--fg-muted)', fontSize: 12 }}>
        <span className="t-mono">{hora}</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success)' }}/>
          Online
        </span>
      </div>
    </div>
  );
};

/* ---------- DASHBOARD ---------- */
const PanicoBanner = () => {
  const { useStore, actions } = window.SentinelaStore;
  const panico = useStore(s => s.panico);
  if (!panico) return null;
  const dispatchableUnits = ['VRL-22', 'VRL-23'].filter(u => !(panico.reforcos || []).includes(u));
  return (
    <div style={{
      background: 'linear-gradient(90deg, var(--danger) 0%, var(--danger-deep) 100%)',
      color: '#FFF', padding: 14, borderRadius: 10, marginBottom: 16,
      display: 'flex', alignItems: 'center', gap: 14,
      boxShadow: '0 0 0 4px rgba(199,50,43,0.2)',
      animation: 'panicGlow 1s ease-in-out infinite alternate',
    }}>
      <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon name="siren" size={32}/>
      </div>
      <div style={{ flex: 1 }}>
        <div className="t-overline" style={{ color: '#FFD9D6' }}>PEDIDO DE REFORÇO ATIVO</div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18 }}>{panico.militarNome} · {panico.indicativo}</div>
        <div style={{ fontSize: 12, opacity: 0.9 }}>GPS {panico.lat.toFixed(4)}°N, {panico.lng.toFixed(4)}°W · desde {new Date(panico.desde).toLocaleTimeString('pt-PT', {hour:'2-digit',minute:'2-digit'})}</div>
        <div style={{ fontSize: 12, opacity: 0.9, marginTop: 4 }}>
          <b>Reforços despachados:</b> {(panico.reforcos || []).join(', ') || '—'}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {dispatchableUnits.map(u => (
          <button key={u} onClick={() => actions.despacharReforco(u)} style={{
            background: '#FFF', color: 'var(--danger-deep)', border: 'none',
            borderRadius: 6, padding: '6px 12px', fontWeight: 700, fontSize: 12, cursor: 'pointer',
          }}>Despachar {u}</button>
        ))}
        <button onClick={() => actions.cancelarPanico()} style={{
          background: 'transparent', color: '#FFF', border: '1px solid rgba(255,255,255,0.4)',
          borderRadius: 6, padding: '6px 12px', fontWeight: 600, fontSize: 11, cursor: 'pointer',
        }}>Encerrar</button>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, sub, tone = 'neutral' }) => (
  <div style={{
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 10, padding: 14, display: 'flex', flexDirection: 'column', gap: 8,
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{
        width: 32, height: 32, borderRadius: 8,
        background: tone === 'danger' ? 'rgba(199,50,43,0.10)' : tone === 'warning' ? 'rgba(218,164,40,0.12)' : tone === 'success' ? 'rgba(54,128,68,0.10)' : 'rgba(31,77,58,0.08)',
        color: tone === 'danger' ? 'var(--danger)' : tone === 'warning' ? 'var(--warning-deep)' : tone === 'success' ? 'var(--success)' : 'var(--brand-green)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon name={icon} size={16}/>
      </div>
      <div className="t-overline" style={{ flex: 1 }}>{label}</div>
    </div>
    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 28, lineHeight: 1, color: 'var(--fg)' }}>{value}</div>
    <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{sub}</div>
  </div>
);

const DashboardView = () => {
  const { useStore } = window.SentinelaStore;
  const alertas = useStore(s => s.alertas);
  const viaturas = useStore(s => s.viaturas);
  const militares = useStore(s => s.militares);
  const ordens = useStore(s => s.ordens);
  const patrulhas = useStore(s => s.patrulhasHistorico);

  const ativas = patrulhas.filter(p => !p.fechadaEm).length;
  const emPatrulha = militares.filter(m => m.estado === 'patrulha').length;
  const alertasHoje = alertas.length;
  const alertasCriticos = alertas.filter(a => a.severidade === 'critico').length;

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: 22 }}>
      <PanicoBanner/>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 18 }}>
        <StatCard icon="shield" label="Patrulhas ativas" value={ativas} sub={`${emPatrulha} militares no terreno`} tone="success"/>
        <StatCard icon="alert-triangle" label="Alertas ANPR hoje" value={alertasHoje} sub={`${alertasCriticos} críticos`} tone="warning"/>
        <StatCard icon="car" label="Viaturas disponíveis" value={viaturas.filter(v => v.estado === 'disponivel').length} sub={`${viaturas.length} no posto`}/>
        <StatCard icon="file-text" label="OS por confirmar" value={ordens.filter(o => o.novo).length} sub={`${ordens.length} totais`} tone="danger"/>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 14 }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10 }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon name="alert-triangle" size={16} style={{ color: 'var(--brand-green)' }}/>
            <div style={{ fontWeight: 600, fontSize: 13, flex: 1 }}>Alertas ANPR — feed em tempo real</div>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--success)' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success)' }}/>
              Sincronizado
            </span>
          </div>
          <div style={{ maxHeight: 380, overflowY: 'auto' }}>
            {alertas.slice(0, 8).map(a => (
              <div key={a.id} style={{
                padding: '10px 16px', borderBottom: '1px solid var(--border)',
                borderLeft: `4px solid ${a.severidade === 'critico' ? 'var(--danger)' : a.severidade === 'aviso' ? 'var(--warning)' : 'var(--info)'}`,
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <Plate value={a.matricula} size="sm"/>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{a.motivo}</div>
                  <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{a.local} · {a.indicativo} · {a.hora}</div>
                </div>
                {a.confirmado ? <Badge tone="success" size="sm">Confirmado</Badge> : <Badge tone={a.severidade === 'critico' ? 'danger' : 'warning'} size="sm">Pendente</Badge>}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <PatrulhasCard/>
          <ViaturasMiniCard/>
        </div>
      </div>
    </div>
  );
};

const PatrulhasCard = () => {
  const { useStore } = window.SentinelaStore;
  const patrulhas = useStore(s => s.patrulhasHistorico.filter(p => !p.fechadaEm));
  const viaturas = useStore(s => s.viaturas);

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10 }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <Icon name="shield" size={16} style={{ color: 'var(--brand-green)' }}/>
        <div style={{ fontWeight: 600, fontSize: 13 }}>Patrulhas ativas</div>
      </div>
      <div>
        {patrulhas.map(p => {
          const v = viaturas.find(x => x.id === p.viaturaId);
          return (
            <div key={p.id} style={{ padding: '10px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success)' }}/>
              <div style={{ fontWeight: 700, fontSize: 13, fontFamily: 'var(--font-mono)' }}>{p.indicativo}</div>
              <div style={{ flex: 1, fontSize: 11, color: 'var(--fg-muted)' }}>
                {v ? `${v.marca} ${v.modelo}` : '—'} · {v?.combustivel}% comb.
              </div>
              <Plate value={v?.matricula || '—'} size="sm"/>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ViaturasMiniCard = () => {
  const { useStore } = window.SentinelaStore;
  const viaturas = useStore(s => s.viaturas);
  const stats = {
    patrulha: viaturas.filter(v => v.estado === 'patrulha').length,
    disponivel: viaturas.filter(v => v.estado === 'disponivel').length,
    manutencao: viaturas.filter(v => v.estado === 'manutencao').length,
  };
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 14 }}>
      <div className="t-overline" style={{ marginBottom: 8 }}>FROTA · {viaturas.length} VIATURAS</div>
      {[['Em patrulha', stats.patrulha, 'var(--info)'],['Disponíveis', stats.disponivel, 'var(--success)'],['Manutenção', stats.manutencao, 'var(--warning)']].map(([l, n, c]) => (
        <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: c }}/>
          <div style={{ flex: 1, fontSize: 12 }}>{l}</div>
          <div className="t-mono" style={{ fontSize: 13, fontWeight: 700 }}>{n}</div>
        </div>
      ))}
    </div>
  );
};

/* ---------- MAPA ---------- */
const MapaView = () => {
  const { useStore } = window.SentinelaStore;
  const viaturasMapa = useStore(s => s.viaturasMapa);
  const panico = useStore(s => s.panico);
  const rotaAtual = useStore(s => s.rotaAtual);

  // Animate vehicles slightly
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 1500);
    return () => clearInterval(id);
  }, []);

  // Map bounds (Vila Real area)
  const bounds = { minLat: 41.290, maxLat: 41.315, minLng: -7.760, maxLng: -7.735 };
  const project = (lat, lng) => {
    const x = ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * 100;
    const y = ((bounds.maxLat - lat) / (bounds.maxLat - bounds.minLat)) * 100;
    return { x, y };
  };

  return (
    <div style={{ flex: 1, position: 'relative', background: '#E8EBE5', overflow: 'hidden' }}>
      {/* Stylised map */}
      <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 1000 700" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)"/>
        {/* Roads */}
        <path d="M 0 350 Q 200 320, 400 360 T 800 380 L 1000 400" stroke="#FFF" strokeWidth="20" fill="none"/>
        <path d="M 0 350 Q 200 320, 400 360 T 800 380 L 1000 400" stroke="#C8B47A" strokeWidth="3" fill="none"/>
        <path d="M 500 0 L 480 700" stroke="#FFF" strokeWidth="14" fill="none"/>
        <path d="M 500 0 L 480 700" stroke="#C8B47A" strokeWidth="2" fill="none"/>
        <path d="M 100 100 Q 300 150, 500 200 T 900 280" stroke="#FFF" strokeWidth="10" fill="none"/>
        {/* River */}
        <path d="M 0 500 Q 250 480, 500 520 T 1000 530" stroke="#A8C8D8" strokeWidth="14" fill="none" opacity="0.6"/>
        {/* Buildings */}
        <rect x="430" y="320" width="80" height="60" fill="rgba(120,140,120,0.25)" stroke="rgba(120,140,120,0.5)"/>
        <rect x="450" y="280" width="50" height="40" fill="rgba(120,140,120,0.25)" stroke="rgba(120,140,120,0.5)"/>
        <rect x="380" y="380" width="60" height="60" fill="rgba(120,140,120,0.25)" stroke="rgba(120,140,120,0.5)"/>
        <text x="490" y="380" fill="rgba(0,0,0,0.4)" fontSize="11" fontFamily="serif" fontWeight="600">Vila Real centro</text>
        <text x="200" y="350" fill="rgba(0,0,0,0.35)" fontSize="10" fontFamily="serif">EN2</text>
        <text x="850" y="395" fill="rgba(0,0,0,0.35)" fontSize="10" fontFamily="serif">A24</text>
        <text x="510" y="600" fill="rgba(0,0,0,0.35)" fontSize="10" fontFamily="serif">Corgo</text>
      </svg>

      {/* GPS route trail from mobile */}
      {rotaAtual.length >= 2 && (
        <svg viewBox="0 0 100 100" preserveAspectRatio="none"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
          <polyline
            points={rotaAtual.map(p => { const pos = project(p.lat, p.lng); return `${pos.x},${pos.y}`; }).join(' ')}
            fill="none" stroke="#C9A24B" strokeWidth="0.5"
            strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1.2 0.8" opacity="0.9"
          />
          {(() => {
            const last = rotaAtual[rotaAtual.length - 1];
            const pos = project(last.lat, last.lng);
            return <circle cx={pos.x} cy={pos.y} r="1.2" fill="#C9A24B" stroke="#FFF" strokeWidth="0.4"/>;
          })()}
        </svg>
      )}

      {/* Vehicles */}
      {viaturasMapa.map(v => {
        const pos = project(v.lat + Math.sin(tick * 0.5) * 0.0005, v.lng + Math.cos(tick * 0.3) * 0.0005);
        return (
          <div key={v.id} style={{
            position: 'absolute', left: `${pos.x}%`, top: `${pos.y}%`,
            transform: 'translate(-50%, -100%)', transition: 'all 1.5s linear',
          }}>
            <div style={{
              background: 'var(--brand-green-deep)', color: '#FFF', padding: '4px 10px',
              borderRadius: 6, fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-mono)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <Icon name="car" size={12}/>
              {v.id}
              <span style={{ color: '#C9A24B', fontSize: 9 }}>{v.velocidade}km/h</span>
            </div>
            <div style={{
              width: 14, height: 14, borderRadius: '50%', background: '#C9A24B',
              border: '3px solid var(--brand-green-deep)', margin: '4px auto 0',
              boxShadow: '0 0 0 4px rgba(201,162,75,0.3)',
            }}/>
            <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--fg)', marginTop: 2, textShadow: '0 0 4px #FFF', textAlign: 'center' }}>{v.militar}</div>
          </div>
        );
      })}

      {/* Panic location */}
      {panico && (() => {
        const pos = project(panico.lat, panico.lng);
        return (
          <div style={{ position: 'absolute', left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%, -50%)' }}>
            <div style={{
              width: 60, height: 60, borderRadius: '50%', background: 'rgba(199,50,43,0.3)',
              animation: 'panicPing 1s ease-out infinite', position: 'absolute', inset: '50% 50%', transform: 'translate(-50%, -50%)',
            }}/>
            <div style={{
              width: 24, height: 24, borderRadius: '50%', background: 'var(--danger)',
              border: '3px solid #FFF', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF',
              boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
            }}>
              <Icon name="siren" size={12}/>
            </div>
            <div style={{
              background: 'var(--danger)', color: '#FFF', padding: '4px 10px',
              borderRadius: 6, fontSize: 11, fontWeight: 700, marginTop: 8, whiteSpace: 'nowrap',
            }}>{panico.indicativo} · PÂNICO</div>
            <style>{`@keyframes panicPing{0%{transform:translate(-50%,-50%) scale(0.5);opacity:1}100%{transform:translate(-50%,-50%) scale(2.5);opacity:0}}`}</style>
          </div>
        );
      })()}

      {/* Map controls */}
      <div style={{ position: 'absolute', top: 16, right: 16, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: 12, minWidth: 200 }}>
        <div className="t-overline" style={{ marginBottom: 6 }}>UNIDADES NO TERRENO</div>
        {viaturasMapa.map(v => (
          <div key={v.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0', fontSize: 12 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: v.velocidade > 0 ? 'var(--success)' : 'var(--warning)' }}/>
            <span className="t-mono" style={{ fontWeight: 600 }}>{v.id}</span>
            <span style={{ flex: 1, color: 'var(--fg-muted)' }}>{v.militar}</span>
            <span className="t-mono" style={{ fontSize: 10 }}>{v.velocidade}km/h</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ---------- ALERTAS (full table + confirm) ---------- */
const AlertasView = () => {
  const { useStore, actions } = window.SentinelaStore;
  const alertas = useStore(s => s.alertas);
  const [filter, setFilter] = React.useState('todos');

  const filtered = filter === 'todos' ? alertas : alertas.filter(a => a.severidade === filter);

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: 22 }}>
      <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
        {[['todos','Todos'],['critico','Críticos'],['aviso','Avisos'],['info','Info']].map(([v, l]) => (
          <button key={v} onClick={() => setFilter(v)} style={{
            background: filter === v ? 'var(--brand-green)' : 'var(--surface)',
            color: filter === v ? '#FFF' : 'var(--fg)',
            border: '1px solid ' + (filter === v ? 'var(--brand-green)' : 'var(--border)'),
            borderRadius: 6, padding: '6px 14px', cursor: 'pointer', fontSize: 12, fontWeight: 600,
          }}>{l}</button>
        ))}
        <div style={{ flex: 1 }}/>
        <div style={{ fontSize: 12, color: 'var(--fg-muted)', alignSelf: 'center' }}>{filtered.length} resultados</div>
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: 'var(--surface-2)' }}>
              {['Hora','Matrícula','Motivo','Origem','Local','Patrulha','Estado',''].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid var(--border)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(a => (
              <tr key={a.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td className="t-mono" style={{ padding: '10px 14px' }}>{a.hora}</td>
                <td style={{ padding: '10px 14px' }}><Plate value={a.matricula} size="sm"/></td>
                <td style={{ padding: '10px 14px', fontWeight: 600 }}>{a.motivo}</td>
                <td style={{ padding: '10px 14px', fontSize: 11, color: 'var(--fg-muted)' }}>{a.origem}</td>
                <td style={{ padding: '10px 14px', fontSize: 12 }}>{a.local}</td>
                <td className="t-mono" style={{ padding: '10px 14px', fontSize: 11 }}>{a.indicativo}</td>
                <td style={{ padding: '10px 14px' }}>
                  <Badge tone={a.severidade === 'critico' ? 'danger' : a.severidade === 'aviso' ? 'warning' : 'info'} size="sm">{a.severidade}</Badge>
                </td>
                <td style={{ padding: '10px 14px' }}>
                  {a.confirmado ? <span style={{ color: 'var(--success)', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}><Icon name="check" size={14}/> ok</span>
                                : <button onClick={() => actions.confirmarAlerta(a.id)} style={{ background: 'var(--brand-green)', color: '#FFF', border: 'none', borderRadius: 4, padding: '4px 10px', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>Confirmar</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

Object.assign(window, { PCSidebar, PCTopbar, DashboardView, MapaView, AlertasView });
