/* Sentinela PC — Gestão de Ordens de Serviço (Stitch design)
 * Sidebar + topbar + stats + split list/detail viewer.
 */

const OrdensServicoPCScreen = () => {
  const { useStore, actions } = window.SentinelaStore;
  const ordens = useStore(s => s.ordens);
  const [selId, setSelId] = React.useState(ordens[0]?.id);
  const [filter, setFilter] = React.useState('todas');

  const lista = ordens.length ? ordens : [
    { id: 'OS-2026-00128', titulo: 'Operação Verão Seguro',           prioridade: 'alta',   data: '12 Mai 2026', novo: true },
    { id: 'OS-2026-00125', titulo: 'Reforço de Patrulhamento Urbano', prioridade: 'media',  data: '10 Mai 2026' },
    { id: 'OS-2026-00119', titulo: 'Controlo de Velocidade - A4',     prioridade: 'baixa',  data: '08 Mai 2026' },
    { id: 'OS-2026-00112', titulo: 'Escolta de Transporte Especial',  prioridade: 'media',  data: '05 Mai 2026' },
  ];
  const filtrada = filter === 'todas' ? lista
                 : filter === 'naoLidas' ? lista.filter(o => o.novo)
                 : lista.filter(o => o.prioridade === 'alta');
  const sel = filtrada.find(o => o.id === selId) || filtrada[0] || lista[0];

  const active = 'ordensServicoPc';
  const navItems = [
    { id: 'dashboardPc',     icon: 'activity',       label: 'Dashboard' },
    { id: 'scannerPc',       icon: 'alert-triangle', label: 'Scanner ALPR' },
    { id: 'ordensServicoPc', icon: 'file-text',      label: 'Ordens de Serviço' },
    { id: 'escalasPc',       icon: 'calendar',       label: 'Escalas' },
    { id: 'commsPc',         icon: 'message-circle', label: 'Comunicações' },
    { id: 'wikiPc',          icon: 'users',          label: 'Lista Telefónica' },
  ];
  const footerItems = [
    { id: 'logout', icon: 'log-out', label: 'Sair' },
  ];
  const goTo = (id) => {
    if (id === 'logout') { window.SentinelaStore.actions.logout(); return; }
    if (window.__setRedesignScreen) window.__setRedesignScreen(id);
  };

  const tagFor = (p) => {
    if (p === 'alta') return { bg: 'var(--danger)', fg: '#FFF', label: 'Alta' };
    if (p === 'baixa') return { bg: 'var(--brand-gold)', fg: '#FFF', label: 'Baixa' };
    return { bg: 'transparent', fg: 'var(--fg-muted)', label: 'Média', border: '1px solid var(--border)' };
  };

  return (
    <div style={{
      display: 'flex', minHeight: '100vh',
      background: 'var(--bg)', color: 'var(--fg)', fontFamily: 'var(--font-ui)',
    }}>
      {/* Sidebar */}
      <nav style={{
        position: 'fixed', left: 0, top: 0, height: '100%', zIndex: 50,
        display: 'flex', flexDirection: 'column',
        background: 'var(--surface-2)',
        width: 256,
        borderRight: '1px solid var(--border)',
      }}>
        <div style={{ padding: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            height: 40, width: 40, borderRadius: 4,
            background: 'var(--brand-green)', color: '#FFF',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}><Icon name="shield" size={20}/></div>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 900, color: 'var(--brand-green)', margin: 0, letterSpacing: '-0.02em' }}>GNR</h1>
            <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.16em', margin: 0 }}>Comando Operacional</p>
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginTop: 24, padding: '0 12px', gap: 4 }}>
          {navItems.map(it => {
            const isActive = active === it.id;
            return (
              <button key={it.id} onClick={() => goTo(it.id)} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: 12,
                fontSize: 14, fontWeight: isActive ? 700 : 600, textDecoration: 'none',
                color: isActive ? 'var(--brand-green)' : 'var(--fg-muted)',
                background: isActive ? 'var(--surface)' : 'transparent',
                borderTop: 'none', borderRight: 'none', borderBottom: 'none',
                borderLeft: isActive ? '4px solid var(--brand-green)' : '4px solid transparent',
                boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
                cursor: 'pointer', textAlign: 'left', width: '100%', font: 'inherit',
              }}>
                <Icon name={it.icon} size={18}/>
                <span>{it.label}</span>
              </button>
            );
          })}

          <div style={{ marginTop: 'auto', marginBottom: 24 }}>
            {footerItems.map(it => (
              <button key={it.id} onClick={() => goTo(it.id)} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: 12,
                fontSize: 14, fontWeight: 600, textDecoration: 'none', color: 'var(--fg-muted)',
                background: 'transparent', border: 'none',
                cursor: 'pointer', textAlign: 'left', width: '100%', font: 'inherit',
              }}>
                <Icon name={it.icon} size={18}/>
                <span>{it.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div style={{ padding: 12, borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar name="Cap. Silva Duarte" size={32}/>
          <div style={{ overflow: 'hidden' }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--brand-green-deep)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Cap. Silva Duarte</p>
            <p style={{ fontSize: 10, color: 'var(--fg-muted)', margin: 0 }}>Comando Distrital</p>
          </div>
        </div>
      </nav>

      {/* Main */}
      <main style={{ marginLeft: 256, flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Topbar */}
        <header style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 24px', position: 'sticky', top: 0, width: '100%', zIndex: 40,
          background: 'var(--surface)', height: 64,
          borderBottom: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--brand-green)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Gestão de Ordens
            </span>
          </div>
          <div style={{ flex: 1, maxWidth: 480, margin: '0 40px' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <span style={{ position: 'absolute', left: 12, color: 'var(--fg-muted)' }}><Icon name="search" size={16}/></span>
              <input
                type="text"
                placeholder="Pesquisar ordens, números ou assuntos..."
                style={{
                  width: '100%', background: 'var(--surface-2)', border: 'none',
                  borderRadius: 8, padding: '8px 16px 8px 40px',
                  fontSize: 14, outline: 'none', color: 'var(--fg)',
                  fontFamily: 'var(--font-ui)',
                }}
              />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => alert('Funcionalidade demo — em breve')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--fg-muted)' }}><Icon name="bell" size={20}/></button>
            <button onClick={() => alert('Funcionalidade demo — em breve')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--fg-muted)' }}><Icon name="search" size={20}/></button>
            <button onClick={() => alert('Funcionalidade demo — em breve')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--fg-muted)' }}><Icon name="user" size={20}/></button>
          </div>
        </header>

        {/* Content */}
        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24, flex: 1 }}>
          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: 12, borderRadius: 8, display: 'flex', alignItems: 'center', gap: 24 }}>
              <div style={{ background: 'rgba(0,33,71,0.10)', padding: 12, borderRadius: 4, color: 'var(--brand-green)' }}>
                <Icon name="list" size={20}/>
              </div>
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '-0.02em', margin: 0 }}>{lista.length} Ordens Totais</p>
                <p style={{ fontSize: 24, fontWeight: 600, color: 'var(--brand-green-deep)', margin: 0, fontFamily: 'var(--font-display)' }}>Arquivo Geral</p>
              </div>
            </div>
            <div style={{ background: 'var(--surface)', borderLeft: '4px solid var(--danger)', padding: 12, borderRadius: 8, display: 'flex', alignItems: 'center', gap: 24, boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ background: 'var(--danger-soft)', padding: 12, borderRadius: 4, color: 'var(--danger)' }}>
                <Icon name="alert-triangle" size={20}/>
              </div>
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '-0.02em', margin: 0 }}>{lista.filter(o => o.prioridade === 'alta').length} Pendentes</p>
                <p style={{ fontSize: 24, fontWeight: 600, color: 'var(--danger)', margin: 0, fontFamily: 'var(--font-display)' }}>Ação Imediata</p>
              </div>
            </div>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: 12, borderRadius: 8, display: 'flex', alignItems: 'center', gap: 24 }}>
              <div style={{ background: 'rgba(42,106,63,0.10)', padding: 12, borderRadius: 4, color: 'var(--brand-gold)' }}>
                <Icon name="check-square" size={20}/>
              </div>
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '-0.02em', margin: 0 }}>{lista.length - lista.filter(o => o.prioridade === 'alta').length} Lidas</p>
                <p style={{ fontSize: 24, fontWeight: 600, color: 'var(--brand-gold)', margin: 0, fontFamily: 'var(--font-display)' }}>Concluídas</p>
              </div>
            </div>
          </div>

          {/* Split panel */}
          <div style={{ flex: 1, display: 'flex', gap: 24, minHeight: 0 }}>
            {/* List */}
            <div style={{
              width: '33%', minWidth: 320,
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 8, display: 'flex', flexDirection: 'column', overflow: 'hidden',
            }}>
              <div style={{
                padding: 12, borderBottom: '1px solid var(--border)',
                background: 'rgba(241,244,246,0.3)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <h2 style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.05em', color: 'var(--brand-green)', textTransform: 'uppercase', margin: 0 }}>LISTA DE ORDENS</h2>
                  <Icon name="list" size={14} style={{ color: 'var(--border-strong)' }}/>
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  {[
                    ['todas', 'Todas'],
                    ['naoLidas', 'Não Lidas'],
                    ['prioritarias', 'Prioritárias'],
                  ].map(([k, l]) => (
                    <button key={k} onClick={() => setFilter(k)} style={{
                      padding: '6px 12px', fontSize: 12, fontWeight: 700, borderRadius: 4,
                      cursor: 'pointer',
                      background: filter === k ? 'var(--brand-green)' : 'transparent',
                      color: filter === k ? '#FFF' : 'var(--fg-muted)',
                      border: filter === k ? '1px solid var(--brand-green)' : '1px solid transparent',
                    }}>{l}</button>
                  ))}
                </div>
              </div>

              <div style={{ flex: 1, overflowY: 'auto' }}>
                {filtrada.map((os, i) => {
                  const isSel = sel && os.id === sel.id;
                  const t = tagFor(os.prioridade || 'media');
                  return (
                    <div key={os.id} onClick={() => setSelId(os.id)} style={{
                      padding: 24, cursor: 'pointer', borderBottom: '1px solid var(--border)', position: 'relative',
                      background: isSel ? 'rgba(0,33,71,0.06)' : 'transparent',
                      borderLeft: isSel ? '4px solid var(--brand-green)' : '4px solid transparent',
                    }}>
                      {os.novo && (
                        <div style={{
                          position: 'absolute', right: 24, top: 24,
                          height: 10, width: 10, background: 'var(--brand-green-soft)',
                          borderRadius: '50%',
                        }}/>
                      )}
                      <p style={{ fontSize: 12, fontWeight: 700, color: isSel ? 'var(--brand-green)' : 'var(--border-strong)', margin: '0 0 4px' }}>{os.id}</p>
                      <h3 style={{ fontSize: 14, fontWeight: 700, color: isSel ? 'var(--brand-green-deep)' : 'var(--fg-muted)', margin: '0 0 8px' }}>{os.titulo}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 10, fontWeight: 500, color: 'var(--fg-muted)' }}>{(os.data || '').toUpperCase()}</span>
                        <span style={{
                          padding: '2px 8px', fontSize: 9, fontWeight: 900, letterSpacing: '0.05em', borderRadius: 4,
                          background: t.bg, color: t.fg, border: t.border, textTransform: 'uppercase',
                        }}>{t.label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Detail */}
            <div style={{ flex: 1, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
              {sel && (
                <>
                  <div style={{
                    padding: 24, borderBottom: '1px solid var(--border)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                  }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{
                          padding: '2px 8px', background: 'var(--danger)', color: '#FFF',
                          fontSize: 10, fontWeight: 900, letterSpacing: '0.05em',
                          borderRadius: 4, textTransform: 'uppercase',
                        }}>Prioridade {tagFor(sel.prioridade || 'media').label}</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--border-strong)', textTransform: 'uppercase', letterSpacing: '0.16em' }}>{sel.id}</span>
                      </div>
                      <h2 style={{
                        fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 600,
                        color: 'var(--brand-green)', letterSpacing: '-0.01em', margin: 0,
                      }}>{sel.titulo}</h2>
                    </div>
                    <div style={{ display: 'flex', gap: 12 }}>
                      <button onClick={() => window.print()} style={{
                        display: 'flex', alignItems: 'center', gap: 4,
                        padding: '8px 12px', border: '1px solid var(--border)',
                        color: 'var(--fg)', fontSize: 12, fontWeight: 700,
                        background: 'transparent', borderRadius: 4, cursor: 'pointer',
                      }}>
                        <Icon name="upload" size={14}/>
                        Imprimir
                      </button>
                      <button onClick={() => sel && actions.marcarOSLida(sel.id)} style={{
                        display: 'flex', alignItems: 'center', gap: 4,
                        padding: '8px 24px', background: 'var(--brand-green)', color: '#FFF',
                        fontSize: 12, fontWeight: 700, borderRadius: 4, border: 'none', cursor: 'pointer',
                      }}>
                        <Icon name="check" size={14}/>
                        Marcar como Lida
                      </button>
                    </div>
                  </div>

                  <div style={{ flex: 1, padding: 24, display: 'flex', flexDirection: 'column', gap: 24, overflowY: 'auto', minHeight: 0 }}>
                    <div style={{
                      display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24,
                      background: 'var(--surface-2)', padding: 24, borderRadius: 4,
                      border: '1px solid var(--border)',
                    }}>
                      <div>
                        <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--fg-muted)', textTransform: 'uppercase', margin: '0 0 4px' }}>Emitido por:</p>
                        <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--brand-green-deep)', margin: 0 }}>Comando Geral — Secção de Operações</p>
                      </div>
                      <div>
                        <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--fg-muted)', textTransform: 'uppercase', margin: '0 0 4px' }}>Data de Emissão:</p>
                        <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--brand-green-deep)', margin: 0 }}>{sel.data} às 09:30</p>
                      </div>
                    </div>

                    <div style={{ color: 'var(--fg-muted)', fontSize: 14, lineHeight: 1.6 }}>
                      <p style={{ fontWeight: 700, margin: '0 0 8px', color: 'var(--fg)' }}>1. OBJETO</p>
                      <p style={{ marginBottom: 24 }}>
                        Determinar a execução da '{sel.titulo}' em todas as subunidades territoriais, com foco especial nas zonas costeiras e eixos rodoviários de acesso às praias.
                      </p>
                      <p style={{ fontWeight: 700, margin: '0 0 8px', color: 'var(--fg)' }}>2. EXECUÇÃO</p>
                      <p style={{ marginBottom: 24 }}>
                        As patrulhas devem priorizar a visibilidade preventiva, o controlo rodoviário e o apoio a turistas. O regime de empenhamento será de 24h, com reforço nos períodos críticos (09h00-11h00 e 17h00-20h00).
                      </p>
                    </div>

                    {/* PDF placeholder */}
                    <div style={{
                      flex: 1, minHeight: 320, background: 'var(--surface-3)',
                      borderRadius: 8, position: 'relative',
                      border: '2px dashed var(--border)',
                      overflow: 'hidden', cursor: 'zoom-in',
                    }}>
                      <div style={{
                        position: 'absolute', inset: 0,
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center',
                        color: 'var(--border-strong)',
                        background: 'rgba(241,244,246,0.8)', backdropFilter: 'blur(4px)',
                      }}>
                        <Icon name="file-text" size={48} style={{ marginBottom: 12, color: 'var(--border-strong)' }}/>
                        <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.16em', margin: '0 0 4px' }}>Visualizador de Documento Oficial</p>
                        <p style={{ fontSize: 10, margin: 0 }}>Clique para expandir o anexo PDF completo</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

window.OrdensServicoPCScreen = OrdensServicoPCScreen;
