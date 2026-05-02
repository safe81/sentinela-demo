/* Sentinela PC — Wiki / Lista Telefónica GNR (Stitch design)
 * Sidebar + emergency banner + searchable directory + detail drawer.
 */

const WikiPCScreen = () => {
  const { useStore, actions } = window.SentinelaStore;
  const militares = useStore(s => s.militares);
  const [filtro, setFiltro] = React.useState('');
  const [seccao, setSeccao] = React.useState('todos');
  const [selId, setSelId] = React.useState(militares[0]?.id);

  const visiveis = militares.filter(m => {
    const txt = (m.nome + ' ' + m.posto + ' ' + (m.nim || '')).toLowerCase();
    return txt.includes(filtro.toLowerCase());
  });
  const selecionado = militares.find(m => m.id === selId) || militares[0];

  const tabs = [
    { id: 'todos',       label: 'Todos' },
    { id: 'geral',       label: 'Geral' },
    { id: 'transito',    label: 'Trânsito' },
    { id: 'territorial', label: 'Territorial' },
    { id: 'sepna',       label: 'SEPNA' },
  ];

  const active = 'wikiPc';
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

  return (
    <div style={{
      display: 'flex', height: '100vh', overflow: 'hidden',
      background: 'var(--bg)', color: 'var(--fg)', fontFamily: 'var(--font-ui)',
    }}>
      {/* Sidebar */}
      <aside style={{
        position: 'fixed', left: 0, top: 0, height: '100vh', width: 256,
        background: 'var(--brand-green)', color: '#FFF',
        display: 'flex', flexDirection: 'column', padding: '24px 0', zIndex: 50,
        boxShadow: 'var(--shadow-lg)',
        borderRight: '1px solid rgba(255,255,255,0.1)',
      }}>
        <div style={{ padding: '0 24px', marginBottom: 32 }}>
          <h1 style={{ fontSize: 18, fontWeight: 900, color: '#FFF', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
            Wiki GNR
          </h1>
          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', fontWeight: 500, letterSpacing: '0.16em', marginTop: 4, textTransform: 'uppercase' }}>
            DIRECTÓRIO INSTITUCIONAL
          </p>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {navItems.map(it => {
            const isActive = active === it.id;
            return (
              <button key={it.id} onClick={() => goTo(it.id)} style={{
                display: 'flex', alignItems: 'center', padding: '12px 24px',
                textDecoration: 'none',
                color: isActive ? '#FFF' : 'rgba(255,255,255,0.7)',
                background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                borderTop: 'none', borderRight: 'none', borderBottom: 'none',
                borderLeft: isActive ? '4px solid #FFF' : '4px solid transparent',
                transition: 'all 0.2s',
                cursor: 'pointer', textAlign: 'left', width: '100%', font: 'inherit',
              }}>
                <span style={{ marginRight: 12 }}><Icon name={it.icon} size={18}/></span>
                <span style={{ fontSize: 14, fontFamily: 'var(--font-display)' }}>{it.label}</span>
              </button>
            );
          })}
        </nav>

        <div style={{ padding: '24px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          {footerItems.map(it => (
            <button key={it.id} onClick={() => goTo(it.id)} style={{
              display: 'flex', alignItems: 'center', padding: '8px 0',
              color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: 14,
              background: 'transparent', border: 'none',
              cursor: 'pointer', textAlign: 'left', width: '100%', font: 'inherit',
            }}>
              <span style={{ marginRight: 12 }}><Icon name={it.icon} size={18}/></span>
              <span>{it.label}</span>
            </button>
          ))}
        </div>
      </aside>

      {/* Main */}
      <main style={{
        marginLeft: 256, flex: 1, display: 'flex', flexDirection: 'column',
        height: '100vh', overflow: 'hidden',
      }}>
        {/* Emergency banner */}
        <div style={{
          background: 'var(--brand-green)', color: '#FFF',
          padding: '8px 24px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.8)' }}>
              LINHA DE EMERGÊNCIA:
            </span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, letterSpacing: '0.08em' }}>
              112 / 808 200 200
            </span>
          </div>
          <button onClick={() => actions.activarPanico()} style={{
            background: 'var(--danger)', color: '#FFF',
            fontSize: 12, fontWeight: 600, letterSpacing: '0.05em',
            padding: '4px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 8, textTransform: 'uppercase',
          }}>
            <Icon name="siren" size={14}/>
            BOTÃO DE PÂNICO
          </button>
        </div>

        {/* Top bar / search */}
        <header style={{
          background: 'var(--surface)', borderBottom: '1px solid var(--border)',
          padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 24,
        }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: 640 }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--fg-muted)' }}>
              <Icon name="search" size={18}/>
            </span>
            <input
              type="text"
              value={filtro}
              onChange={e => setFiltro(e.target.value)}
              placeholder="Pesquisar por militar, posto ou número de ordem"
              style={{
                width: '100%', background: 'var(--surface-3)', border: 'none',
                borderRadius: 8, padding: '10px 16px 10px 40px',
                fontSize: 14, outline: 'none', color: 'var(--fg)',
                fontFamily: 'var(--font-ui)',
              }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginLeft: 'auto' }}>
            <button onClick={() => alert('Funcionalidade demo — em breve')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--fg-muted)', padding: 8 }}>
              <Icon name="bell" size={20}/>
            </button>
            <div style={{
              height: 32, width: 32, borderRadius: '50%',
              background: 'var(--surface-3)', border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon name="user" size={16}/>
            </div>
          </div>
        </header>

        {/* Content */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* Table */}
          <section style={{ flex: 1, padding: 24, overflowY: 'auto' }}>
            <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--fg-muted)', textTransform: 'uppercase' }}>
                FILTRAR POR SECÇÃO:
              </span>
              <div style={{ display: 'flex', gap: 8 }}>
                {tabs.map(t => (
                  <span key={t.id} onClick={() => setSeccao(t.id)} style={{
                    padding: '4px 12px', borderRadius: 999, fontSize: 12,
                    fontWeight: seccao === t.id ? 600 : 500,
                    cursor: 'pointer', userSelect: 'none',
                    background: seccao === t.id ? 'var(--brand-green)' : 'var(--surface)',
                    color: seccao === t.id ? '#FFF' : 'var(--fg-muted)',
                    border: seccao === t.id ? '1px solid var(--brand-green)' : '1px solid var(--border)',
                  }}>{t.label}</span>
                ))}
              </div>
            </div>

            <div style={{
              background: 'var(--surface)', borderRadius: 12,
              border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)',
              overflow: 'hidden',
            }}>
              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead style={{ background: 'var(--surface-2)', borderBottom: '1px solid var(--border)' }}>
                  <tr>
                    {['N.º Ordem', 'Patente', 'Nome', 'Unidade', 'Ext. SIOP', 'Email'].map(h => (
                      <th key={h} style={{
                        padding: '16px 24px', fontSize: 12, fontWeight: 600,
                        color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.05em',
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visiveis.slice(0, 12).map(m => {
                    const sel = m.id === selId;
                    return (
                      <tr key={m.id} onClick={() => setSelId(m.id)} style={{
                        cursor: 'pointer',
                        background: sel ? 'rgba(0,33,71,0.05)' : 'transparent',
                        borderLeft: sel ? '4px solid var(--brand-green)' : '4px solid transparent',
                        borderBottom: '1px solid var(--surface-3)',
                      }}>
                        <td style={{ padding: '16px 24px', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: sel ? 'var(--brand-green)' : 'var(--fg-muted)' }}>
                          {m.nim || '—'}
                        </td>
                        <td style={{ padding: '16px 24px', fontSize: 14, fontWeight: 600 }}>{m.posto}</td>
                        <td style={{ padding: '16px 24px', fontSize: 14, fontWeight: sel ? 700 : 400, color: 'var(--fg)' }}>{m.nome}</td>
                        <td style={{ padding: '16px 24px', fontSize: 14, color: 'var(--fg-muted)' }}>{m.unidade || 'CTER Vila Real'}</td>
                        <td style={{ padding: '16px 24px', fontSize: 14, fontFamily: 'var(--font-mono)', color: 'var(--fg-muted)' }}>{m.ext || '—'}</td>
                        <td style={{ padding: '16px 24px', fontSize: 14, color: 'var(--brand-green)', textDecoration: 'underline' }}>
                          {m.email || `${m.nome.split(' ')[0].toLowerCase()}@gnr.pt`}
                        </td>
                      </tr>
                    );
                  })}
                  {visiveis.length === 0 && (
                    <tr><td colSpan="6" style={{ padding: 32, textAlign: 'center', color: 'var(--fg-muted)' }}>Sem resultados</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Detail drawer */}
          {selecionado && (
            <aside style={{
              width: 384, background: 'var(--surface)',
              borderLeft: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)',
              display: 'flex', flexDirection: 'column', zIndex: 30,
            }}>
              <div style={{
                position: 'relative', height: 192, background: 'var(--brand-green)',
                overflow: 'hidden',
              }}>
                <button onClick={() => setSelId(null)} style={{
                  position: 'absolute', top: 16, right: 16,
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  color: 'rgba(255,255,255,0.7)',
                }}><Icon name="x" size={20}/></button>
                <div style={{
                  position: 'absolute', bottom: -48, left: 24,
                  height: 96, width: 96, borderRadius: 12,
                  border: '4px solid var(--surface)',
                  background: 'var(--surface-2)', boxShadow: 'var(--shadow-md)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  overflow: 'hidden',
                }}>
                  <Avatar name={selecionado.nome} size={88}/>
                </div>
              </div>

              <div style={{ padding: '64px 24px 32px', flex: 1, overflowY: 'auto' }}>
                <div style={{ marginBottom: 24 }}>
                  <span style={{
                    fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
                    color: 'var(--brand-green)', background: 'rgba(0,33,71,0.10)',
                    padding: '2px 8px', borderRadius: 4, textTransform: 'uppercase',
                  }}>OPERATIVO ATIVO</span>
                  <h2 style={{
                    fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700,
                    margin: '4px 0 0', letterSpacing: '-0.02em',
                  }}>{selecionado.postoAbrev || selecionado.posto} {selecionado.nome.split(' ')[0]}</h2>
                  <p style={{ fontSize: 14, color: 'var(--fg-muted)', margin: 0 }}>{selecionado.nome}</p>
                </div>

                <div style={{
                  background: 'var(--surface-2)', borderRadius: 8,
                  padding: 16, border: '1px solid var(--surface-3)', marginBottom: 24,
                }}>
                  <h3 style={{
                    fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
                    color: 'var(--fg-muted)', margin: '0 0 12px', textTransform: 'uppercase',
                  }}>INFORMAÇÃO FUNCIONAL</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {[
                      ['ID de Ordem:', selecionado.nim || '—'],
                      ['Posto:',       selecionado.posto || '—'],
                      ['Especialidade:', selecionado.especialidade || 'Patrulha Territorial'],
                      ['Unidade:',     selecionado.unidade || 'CTER Vila Real - Posto VRL'],
                    ].map(([k, v]) => (
                      <div key={k} style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 12, color: 'var(--fg-muted)' }}>{k}</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg)' }}>{v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: 24 }}>
                  <h3 style={{
                    fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
                    color: 'var(--fg-muted)', margin: '0 0 12px', padding: '0 4px', textTransform: 'uppercase',
                  }}>CONTACTOS DIRECTOS</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                    <button onClick={() => { const num = '+351 939 ' + (selecionado?.nim || '000000').slice(-6); window.location.href = 'tel:' + num.replace(/\s+/g, ''); }} style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      padding: 16, background: 'var(--brand-green)', color: '#FFF',
                      borderRadius: 12, border: 'none', cursor: 'pointer', gap: 8,
                    }}>
                      <Icon name="phone" size={20}/>
                      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em' }}>LIGAR</span>
                    </button>
                    <button onClick={() => { const email = selecionado?.email || `${(selecionado?.nome || '').split(' ').slice(-1)[0].toLowerCase()}@gnr.pt`; window.location.href = 'mailto:' + email; }} style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      padding: 16, background: 'var(--surface-3)', color: 'var(--brand-green)',
                      borderRadius: 12, border: '1px solid var(--border)', cursor: 'pointer', gap: 8,
                    }}>
                      <Icon name="mail" size={20}/>
                      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em' }}>EMAIL</span>
                    </button>
                  </div>
                </div>

                <div style={{ padding: 16, border: '1px solid var(--surface-3)', borderRadius: 8 }}>
                  <h3 style={{
                    fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
                    color: 'var(--fg-muted)', margin: '0 0 12px', textTransform: 'uppercase',
                  }}>LOCALIZAÇÃO DE SERVIÇO</h3>
                  <div style={{
                    height: 128, background: 'var(--surface-3)',
                    borderRadius: 8, overflow: 'hidden', position: 'relative',
                    cursor: 'pointer',
                    backgroundImage: 'radial-gradient(circle at 30% 30%, rgba(0,33,71,0.15), transparent 60%), radial-gradient(circle at 70% 70%, rgba(42,106,63,0.15), transparent 60%)',
                  }}>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{
                        background: 'rgba(255,255,255,0.9)',
                        padding: '4px 12px', borderRadius: 999,
                        fontSize: 10, fontWeight: 700, color: 'var(--brand-green-deep)',
                        boxShadow: 'var(--shadow-sm)', textTransform: 'uppercase', letterSpacing: '-0.02em',
                      }}>Ver no Mapa</span>
                    </div>
                  </div>
                  <p style={{ marginTop: 8, fontSize: 11, color: 'var(--fg-muted)', fontStyle: 'italic', textAlign: 'center', margin: '8px 0 0' }}>
                    Último registo de presença: Posto Territorial de Vila Real
                  </p>
                </div>
              </div>

              <div style={{
                padding: 24, borderTop: '1px solid var(--surface-3)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                background: 'var(--surface-2)',
              }}>
                <span style={{ fontSize: 10, fontWeight: 500, color: 'var(--fg-muted)', letterSpacing: '0.05em' }}>DADOS ATUALIZADOS HÁ 4H</span>
                <button onClick={() => alert('Funcionalidade demo — em breve')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--brand-green)', fontSize: 12, fontWeight: 700 }}>
                  HISTÓRICO
                </button>
              </div>
            </aside>
          )}
        </div>
      </main>
    </div>
  );
};

window.WikiPCScreen = WikiPCScreen;
