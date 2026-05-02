/* Sentinela PC — Dashboard Operacional (Stitch redesign)
 * New layout per Stitch design — fixed sidebar + topbar + KPI grid + 2-col content + OS pendentes.
 * Reads live data from window.SentinelaStore. Coexists with original Dashboard.jsx
 * (registered as DashboardNewView so the host page can pick which one to render).
 */

const NewSideNav = ({ active = 'dashboardPc' }) => {
  const items = [
    { id: 'dashboardPc',     icon: 'activity',       label: 'Dashboard' },
    { id: 'scannerPc',       icon: 'alert-triangle', label: 'Scanner ALPR' },
    { id: 'ordensServicoPc', icon: 'file-text',      label: 'Ordens de Serviço' },
    { id: 'escalasPc',       icon: 'calendar',       label: 'Escalas' },
    { id: 'commsPc',         icon: 'message-circle', label: 'Comunicações' },
    { id: 'wikiPc',          icon: 'users',          label: 'Lista Telefónica' },
  ];
  const footer = [
    { id: 'logout', icon: 'log-out', label: 'Sair' },
  ];
  const goTo = (id) => {
    if (id === 'logout') { window.SentinelaStore.actions.logout(); return; }
    if (window.__setRedesignScreen) window.__setRedesignScreen(id);
  };
  return (
    <nav style={{
      position: 'fixed', left: 0, top: 0, height: '100vh', width: 256,
      background: 'var(--surface-2)', borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column', padding: '24px 16px', zIndex: 50,
      fontFamily: 'var(--font-ui)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32, padding: '0 8px' }}>
        <div style={{
          width: 40, height: 40, borderRadius: 999,
          background: 'var(--brand-green)', color: '#FFF',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name="shield" size={20}/>
        </div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 900, textTransform: 'uppercase', color: 'var(--brand-green)', lineHeight: 1 }}>GNR Command</div>
          <div style={{ fontSize: 10, color: 'var(--fg-muted)', fontWeight: 700, letterSpacing: '0.08em', marginTop: 4, textTransform: 'uppercase' }}>Sentinela</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
        {items.map(it => (
          <button key={it.id} onClick={() => goTo(it.id)} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '8px 12px', borderRadius: 8,
            textDecoration: 'none', fontSize: 12, fontWeight: 600, letterSpacing: '0.05em',
            color: active === it.id ? 'var(--brand-green)' : 'var(--fg-muted)',
            background: active === it.id ? 'var(--surface-3)' : 'transparent',
            borderRight: active === it.id ? '4px solid var(--brand-green)' : '4px solid transparent',
            transition: 'all 0.15s',
            cursor: 'pointer', border: 'none', borderTop: 'none', borderBottom: 'none', borderLeft: 'none',
            textAlign: 'left', width: '100%', font: 'inherit',
          }}>
            <Icon name={it.icon} size={20}/>
            <span>{it.label}</span>
          </button>
        ))}
      </div>

      <div style={{ marginTop: 'auto', paddingTop: 32, borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {footer.map(it => (
          <button key={it.id} onClick={() => goTo(it.id)} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '8px 12px', borderRadius: 8, textDecoration: 'none',
            fontSize: 12, fontWeight: 600, letterSpacing: '0.05em', color: 'var(--fg-muted)',
            background: 'transparent',
            cursor: 'pointer', border: 'none', textAlign: 'left', width: '100%', font: 'inherit',
          }}>
            <Icon name={it.icon} size={20}/>
            <span>{it.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

const NewTopBar = ({ title = 'Operational Dashboard' }) => {
  const { useStore } = window.SentinelaStore;
  const me = useStore(s => {
    const id = s.militarLogadoId;
    return s.militares.find(m => m.id === id);
  });
  const [hora, setHora] = React.useState('');
  React.useEffect(() => {
    const tick = () => setHora(new Date().toLocaleString('pt-PT', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }));
    tick(); const id = setInterval(tick, 30000); return () => clearInterval(id);
  }, []);

  return (
    <header style={{
      position: 'fixed', top: 0, right: 0, width: 'calc(100% - 256px)',
      height: 64, background: 'var(--surface)', borderBottom: '1px solid var(--border)',
      boxShadow: 'var(--shadow-sm)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 32px', zIndex: 40,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--brand-green)', margin: 0 }}>{title}</h1>
        <div style={{
          color: 'var(--fg-muted)', fontSize: 14,
          borderLeft: '1px solid var(--border)', paddingLeft: 24,
        }}>{hora}</div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--fg)', letterSpacing: '0.05em' }}>
            {me ? `${me.postoAbrev} ${me.nome.split(' ')[0]} (NIM: ${me.nim})` : 'Cabo Silva (ID: 2140051)'}
          </div>
          <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{me?.posto || 'Posto Territorial Vila Real'}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--fg-muted)', padding: 8, position: 'relative' }} aria-label="Notificações">
            <Icon name="bell" size={20}/>
            <span style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, background: 'var(--danger)', borderRadius: '50%' }}/>
          </button>
          <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--fg-muted)', padding: 8 }} aria-label="Ajuda">
            <Icon name="search" size={20}/>
          </button>
          <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--fg-muted)', padding: 8 }} aria-label="Conta">
            <Icon name="user" size={20}/>
          </button>
        </div>
      </div>
    </header>
  );
};

const NewKpiCard = ({ label, value, icon, dot, danger }) => (
  <div style={{
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 8, padding: 24, boxShadow: 'var(--shadow-sm)',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
      <h3 style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--fg-muted)', textTransform: 'uppercase', margin: 0 }}>{label}</h3>
      {dot
        ? <span style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--brand-gold)' }}/>
        : <span style={{ color: danger ? 'var(--danger)' : 'var(--brand-green-soft)' }}><Icon name={icon} size={20}/></span>}
    </div>
    <div style={{
      fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700,
      letterSpacing: '-0.02em', lineHeight: 1.25,
      color: danger ? 'var(--danger)' : 'var(--brand-green)',
    }}>{value}</div>
  </div>
);

const NewPatrulhasTable = () => {
  const { useStore } = window.SentinelaStore;
  const patrulhas = useStore(s => s.patrulhasHistorico.filter(p => !p.fechadaEm));
  const viaturas = useStore(s => s.viaturas);
  const militares = useStore(s => s.militares);
  // fallback to demo rows if nothing in store
  const rows = patrulhas.length ? patrulhas.slice(0, 4) : [];

  const fmt = (p) => {
    const v = viaturas.find(x => x.id === p.viaturaId);
    const milNomes = (p.militares || []).map(id => {
      const m = militares.find(x => x.id === id);
      return m ? `${m.postoAbrev} ${m.nome.split(' ')[0]}` : '';
    }).filter(Boolean).join(', ');
    return {
      viatura: v ? v.matricula : '—',
      indicativo: p.indicativo || '—',
      militares: milNomes || '—',
      inicio: p.iniciadaEm ? new Date(p.iniciadaEm).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }) : '—',
      sector: p.sector || '—',
    };
  };

  const fallback = [
    { viatura: 'GNR-LX-4421', indicativo: 'PATRULHA BRAVO 1',  militares: 'Sgt. Oliveira, Cb. Silva',  inicio: '08:00', sector: 'Sintra - Centro' },
    { viatura: 'GNR-LX-4422', indicativo: 'PATRULHA CHARLIE 3', militares: 'Cb. Santos, Gd. Costa',     inicio: '09:30', sector: 'Sintra - Norte' },
  ];

  const data = rows.length ? rows.map(fmt) : fallback;

  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 8, boxShadow: 'var(--shadow-sm)',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ padding: 12, borderBottom: '1px solid var(--border)', background: 'var(--surface-2)', borderRadius: '8px 8px 0 0' }}>
        <h2 style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.05em', color: 'var(--brand-green)', margin: 0, textTransform: 'uppercase' }}>Patrulhas em Curso</h2>
      </div>
      <div style={{ padding: 12, flex: 1, overflowX: 'auto' }}>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Viatura', 'Indicativo', 'Militares', 'Início', 'Setor', 'Estado'].map((h, i) => (
                <th key={h} style={{
                  paddingBottom: 4, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
                  color: 'var(--fg-muted)', textTransform: 'uppercase',
                  textAlign: i === 5 ? 'right' : 'left',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((r, i) => (
              <tr key={i} style={{ borderBottom: i === data.length - 1 ? 'none' : '1px solid var(--surface-3)', fontSize: 14 }}>
                <td style={{ padding: '12px 0' }}>{r.viatura}</td>
                <td style={{ padding: '12px 0', fontSize: 12, fontWeight: 600, color: 'var(--brand-green)', letterSpacing: '0.05em' }}>{r.indicativo}</td>
                <td style={{ padding: '12px 0', color: 'var(--fg-muted)' }}>{r.militares}</td>
                <td style={{ padding: '12px 0' }}>{r.inicio}</td>
                <td style={{ padding: '12px 0' }}>{r.sector}</td>
                <td style={{ padding: '12px 0', textAlign: 'right' }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center',
                    padding: '4px 8px', borderRadius: 4,
                    border: '1px solid var(--brand-gold-deep)', background: 'var(--brand-gold-soft)',
                    color: 'var(--brand-gold-deep)', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
                  }}>EM SERVIÇO</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const NewAlertasFeed = () => {
  const { useStore } = window.SentinelaStore;
  const alertas = useStore(s => s.alertas);
  const list = alertas.length ? alertas.slice(0, 3) : [
    { id: 'a1', matricula: '22-AA-33', motivo: 'ROUBADO', severidade: 'critico', hora: '14:10', local: 'N249, Km 4' },
    { id: 'a2', matricula: '88-ZZ-00', motivo: 'SEM SEGURO', severidade: 'aviso', hora: '13:45', local: 'A16, Saída 7' },
    { id: 'a3', matricula: '45-RT-12', motivo: 'APREENDIDA', severidade: 'aviso', hora: '12:30', local: 'IC19, Cacém' },
  ];

  const toneColor = (sev) => {
    if (sev === 'critico') return { border: 'var(--danger)', bg: 'var(--surface)', tag: { bg: 'var(--danger)', fg: '#FFF' } };
    if (sev === 'aviso')   return { border: 'var(--border)', bg: 'var(--surface)', tag: { bg: 'var(--warning-soft)', fg: 'var(--warning-deep)', border: 'var(--warning)' } };
    return { border: 'var(--border)', bg: 'var(--surface)', tag: { bg: 'var(--info-soft)', fg: 'var(--info-deep)', border: 'var(--info)' } };
  };

  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 8, boxShadow: 'var(--shadow-sm)',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{
        padding: 12, borderBottom: '1px solid var(--border)',
        background: 'var(--surface-2)', borderRadius: '8px 8px 0 0',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <h2 style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.05em', color: 'var(--brand-green)', margin: 0, textTransform: 'uppercase' }}>
          Alertas ALPR Recentes
        </h2>
        <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--brand-green-soft)' }} aria-label="Abrir">
          <Icon name="arrow-right" size={16}/>
        </button>
      </div>
      <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {list.map(a => {
          const tc = toneColor(a.severidade);
          return (
            <div key={a.id} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: 12, border: `1px solid ${tc.border}`, background: tc.bg, borderRadius: 4,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Icon name="car" size={20} style={{ color: a.severidade === 'critico' ? 'var(--danger)' : 'var(--brand-green-soft)' }}/>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--fg)' }}>{a.matricula}</div>
                  <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{a.hora} • {a.local}</div>
                </div>
              </div>
              <span style={{
                display: 'inline-flex', alignItems: 'center', padding: '4px 8px',
                borderRadius: 4, fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
                background: tc.tag.bg, color: tc.tag.fg,
                border: tc.tag.border ? `1px solid ${tc.tag.border}` : 'none',
                textTransform: 'uppercase',
              }}>{a.motivo}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const NewOSPendentes = () => {
  const { useStore } = window.SentinelaStore;
  const ordens = useStore(s => s.ordens);
  const list = ordens.length ? ordens.slice(0, 3) : [
    { id: 'OS-2026-00128', titulo: 'Operação Verão Seguro', prioridade: 'alta', data: '14 Mai' },
    { id: 'OS-2026-00129', titulo: 'Fiscalização Trânsito N249', prioridade: 'media', data: '15 Mai' },
    { id: 'OS-2026-00130', titulo: 'Patrulhamento Centro', prioridade: 'baixa', data: '16 Mai' },
  ];

  const tagFor = (p) => {
    if (p === 'alta')  return { bg: 'var(--danger-soft)',  fg: 'var(--danger-deep)',  label: 'PRIORIDADE: ALTA' };
    if (p === 'media') return { bg: 'var(--surface-3)',    fg: 'var(--fg-muted)',     label: 'MÉDIA' };
    return                  { bg: 'var(--brand-gold-soft)',fg: 'var(--brand-gold-deep)', label: 'BAIXA' };
  };

  return (
    <div>
      <h2 style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.05em', color: 'var(--brand-green)', margin: '0 0 12px', textTransform: 'uppercase' }}>
        Ordens de Serviço Pendentes
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
        {list.map(os => {
          const t = tagFor(os.prioridade || 'media');
          return (
            <div key={os.id} style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 8, padding: 12, boxShadow: 'var(--shadow-sm)',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              cursor: 'pointer',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--fg-muted)', marginBottom: 4, textTransform: 'uppercase' }}>{os.id}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--fg)' }}>{os.titulo}</div>
                </div>
                <span style={{ color: 'var(--brand-green-soft)' }}><Icon name="file-text" size={20}/></span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', padding: '4px 8px',
                  borderRadius: 4, fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
                  background: t.bg, color: t.fg, textTransform: 'uppercase',
                }}>{t.label}</span>
                <span style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{os.data || '—'}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const DashboardPCScreen = () => {
  const { useStore } = window.SentinelaStore;
  const alertas = useStore(s => s.alertas);
  const viaturas = useStore(s => s.viaturas);
  const ordens = useStore(s => s.ordens);
  const patrulhas = useStore(s => s.patrulhasHistorico);

  const ativas = patrulhas.filter(p => !p.fechadaEm).length || 4;
  const ocorrenciasAbertas = ordens.filter(o => o.novo).length || 2;
  const viaturasServico = viaturas.filter(v => v.estado === 'patrulha').length || 6;
  const alertasHoje = alertas.length || 12;

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--surface-3)', color: 'var(--fg)',
      fontFamily: 'var(--font-ui)', display: 'flex',
    }}>
      <NewSideNav active="dashboardPc"/>

      <div style={{ flex: 1, marginLeft: 256, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <NewTopBar title="Operational Dashboard"/>

        <main style={{ flex: 1, marginTop: 64, padding: 24, overflowY: 'auto' }}>
          {/* KPI row */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 12, marginBottom: 24,
          }}>
            <NewKpiCard label="Patrulhas Ativas" value={ativas} dot/>
            <NewKpiCard label="Ocorrências Abertas" value={ocorrenciasAbertas} icon="alert-triangle"/>
            <NewKpiCard label="Viaturas em Serviço" value={viaturasServico} icon="car"/>
            <NewKpiCard label="Alertas ALPR Hoje" value={alertasHoje} icon="alert-triangle" danger/>
          </div>

          {/* 2-col main */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'minmax(0, 7fr) minmax(0, 5fr)',
            gap: 24, marginBottom: 24,
          }}>
            <NewPatrulhasTable/>
            <NewAlertasFeed/>
          </div>

          <NewOSPendentes/>
        </main>
      </div>
    </div>
  );
};

Object.assign(window, { DashboardPCScreen, NewSideNav, NewTopBar });
