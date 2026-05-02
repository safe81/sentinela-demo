/* Sentinela PC — Scanner ALPR / Terminal de Posto (Stitch design)
 * Live camera feed + plate display + critical alert + recent detections.
 */

const ScannerPCScreen = () => {
  const { useStore } = window.SentinelaStore;
  const alertas = useStore(s => s.alertas);

  const detecoes = alertas.length ? alertas.slice(0, 4).map(a => ({
    matricula: a.matricula,
    tipo: a.tipo || 'Ligeiro Passageiros',
    estado: a.severidade === 'critico' ? 'Roubado' : a.severidade === 'aviso' ? 'Sem Seguro' : 'Válido',
    severidade: a.severidade,
    hora: a.hora || '--:--:--',
  })) : [
    { matricula: 'AA-00-AA', tipo: 'Ligeiro Passageiros', estado: 'Roubado',    severidade: 'critico', hora: '14:22:05' },
    { matricula: '42-ZH-11', tipo: 'Ligeiro Mercadorias', estado: 'Sem Seguro', severidade: 'aviso',   hora: '14:21:48' },
    { matricula: 'BC-99-BC', tipo: 'Motociclo',           estado: 'Válido',     severidade: 'ok',      hora: '14:21:12' },
    { matricula: '01-AA-02', tipo: 'Pesado Mercadorias',  estado: 'Válido',     severidade: 'ok',      hora: '14:20:55' },
  ];

  const active = 'scannerPc';
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

  const tabs = ['Dashboard', 'Live Feeds', 'Alert History', 'Database'];

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--surface-2)',
      color: 'var(--fg)', fontFamily: 'var(--font-ui)',
    }}>
      {/* Sidebar */}
      <aside style={{
        position: 'fixed', left: 0, top: 0, height: '100%', width: 256, zIndex: 40,
        background: 'var(--bg)', borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ padding: 24, borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 4,
              background: 'var(--brand-green)', color: '#FFF',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}><Icon name="shield" size={20}/></div>
            <div>
              <h1 style={{ fontSize: 14, fontWeight: 700, color: 'var(--brand-green)', margin: 0 }}>Command Center</h1>
              <p style={{ fontSize: 10, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.16em', margin: 0 }}>Vila Real</p>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: '16px 0', overflowY: 'auto' }}>
          <div style={{ padding: '0 12px 8px', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--border-strong)', textTransform: 'uppercase' }}>NAVEGAÇÃO</div>
          {navItems.map(it => {
            const isActive = active === it.id;
            return (
              <button key={it.id} onClick={() => goTo(it.id)} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 24px', cursor: 'pointer',
                fontSize: 14, fontWeight: isActive ? 700 : 400,
                background: isActive ? 'var(--surface)' : 'transparent',
                color: isActive ? 'var(--brand-green)' : 'var(--fg-muted)',
                borderTop: 'none', borderRight: 'none', borderBottom: 'none',
                borderLeft: isActive ? '4px solid var(--brand-green)' : '4px solid transparent',
                boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
                textAlign: 'left', width: '100%', font: 'inherit',
              }}>
                <Icon name={it.icon} size={18}/>
                <span>{it.label}</span>
              </button>
            );
          })}
        </nav>

        <div style={{ padding: 16, borderTop: '1px solid var(--border)' }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: 12, background: 'var(--brand-gold-soft)', color: 'var(--brand-gold-deep)',
            borderRadius: 8, fontSize: 12, fontWeight: 700, marginBottom: 16,
          }}>
            <span>Sistema Online</span>
            <span style={{ width: 8, height: 8, background: 'var(--success)', borderRadius: '50%' }}/>
          </div>
          {footerItems.map(it => (
            <button key={it.id} onClick={() => goTo(it.id)} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 24px', cursor: 'pointer', color: 'var(--fg-muted)',
              fontSize: 14,
              background: 'transparent', border: 'none',
              textAlign: 'left', width: '100%', font: 'inherit',
            }}>
              <Icon name={it.icon} size={18}/>
              <span>{it.label}</span>
            </button>
          ))}
        </div>
      </aside>

      {/* Topbar */}
      <header style={{
        position: 'fixed', top: 0, left: 256, width: 'calc(100% - 256px)', height: 64,
        background: 'var(--surface)', borderBottom: '1px solid var(--border)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '0 24px', zIndex: 30,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <span style={{ fontSize: 20, fontWeight: 900, color: 'var(--brand-green)', letterSpacing: '-0.01em', textTransform: 'uppercase' }}>
            GNR Scanner ALPR
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, fontSize: 14 }}>
            {tabs.map((t, i) => (
              <a key={t} href="#" style={{
                color: i === 0 ? 'var(--brand-green)' : 'var(--fg-muted)',
                borderBottom: i === 0 ? '2px solid var(--brand-green)' : 'none',
                paddingBottom: 4, textDecoration: 'none',
              }}>{t}</a>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <input
            type="text"
            placeholder="Search plates..."
            style={{
              background: 'var(--surface-3)', border: 'none', borderRadius: 4,
              padding: '6px 16px', fontSize: 14, width: 256, outline: 'none',
              color: 'var(--fg)', fontFamily: 'var(--font-ui)',
            }}
          />
          <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--fg-muted)', padding: 8 }}><Icon name="bell" size={18}/></button>
          <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--fg-muted)', padding: 8 }}><Icon name="settings" size={18}/></button>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--surface-3)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="user" size={16}/>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main style={{ marginLeft: 256, paddingTop: 64, padding: '64px 24px 24px 280px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 8fr) minmax(0, 4fr)', gap: 24, marginBottom: 24 }}>
          {/* Camera + plate */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{
              background: 'var(--brand-green-deep)', borderRadius: 8,
              border: '1px solid var(--brand-green-deep)', boxShadow: 'var(--shadow-lg)',
              aspectRatio: '16/9', position: 'relative', overflow: 'hidden',
              backgroundImage: 'radial-gradient(ellipse at 30% 30%, rgba(45,71,111,0.45), transparent 60%), radial-gradient(ellipse at 70% 70%, rgba(0,10,30,0.85), transparent 60%)',
            }}>
              {/* "Live feed" stylised SVG */}
              <svg width="100%" height="100%" viewBox="0 0 800 450" preserveAspectRatio="none" style={{ opacity: 0.5 }}>
                <defs>
                  <linearGradient id="road" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0b1530"/>
                    <stop offset="100%" stopColor="#1c2c4d"/>
                  </linearGradient>
                </defs>
                <rect width="800" height="450" fill="url(#road)"/>
                <path d="M 0 280 Q 400 220, 800 280 L 800 450 L 0 450 Z" fill="#0a1428" opacity="0.7"/>
                <line x1="100" y1="350" x2="350" y2="280" stroke="#FFF" strokeWidth="2" strokeDasharray="20 30" opacity="0.4"/>
                <line x1="700" y1="350" x2="450" y2="280" stroke="#FFF" strokeWidth="2" strokeDasharray="20 30" opacity="0.4"/>
                <rect x="370" y="265" width="60" height="20" fill="rgba(201,162,75,0.6)" stroke="rgba(255,255,255,0.6)" strokeWidth="1"/>
              </svg>

              <div style={{
                position: 'absolute', top: 16, left: 16,
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
                padding: '6px 12px', borderRadius: 999,
                border: '1px solid rgba(255,255,255,0.2)',
              }}>
                <span style={{
                  width: 8, height: 8, borderRadius: '50%', background: 'var(--danger)',
                  animation: 'scannerPulse 2s ease-in-out infinite',
                }}/>
                <span style={{ color: '#FFF', fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase' }}>
                  CÂMARA ATIVA: A4-KM14-NORTE
                </span>
              </div>
              <div style={{
                position: 'absolute', bottom: 16, right: 16,
                color: 'rgba(255,255,255,0.5)', fontSize: 10, fontFamily: 'var(--font-mono)',
              }}>
                REC [00:42:15] • ISO 800 • 60FPS
              </div>
              <style>{`@keyframes scannerPulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.4); } }`}</style>
            </div>

            <div style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 4, padding: 24, display: 'flex',
              alignItems: 'center', justifyContent: 'space-between',
              boxShadow: 'var(--shadow-sm)',
            }}>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--fg-muted)', margin: '0 0 4px', textTransform: 'uppercase' }}>
                  ÚLTIMA MATRÍCULA DETETADA
                </p>
                <h2 style={{
                  fontFamily: 'var(--font-mono)', fontSize: 60, fontWeight: 700,
                  color: 'var(--brand-green)', letterSpacing: '-0.04em', margin: 0,
                }}>AA-00-AA</h2>
              </div>
              <div style={{ height: 64, width: 1, background: 'var(--surface-3)' }}/>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--fg-muted)', margin: '0 0 4px', textTransform: 'uppercase' }}>VELOCIDADE ESTIMADA</p>
                <p style={{ fontSize: 28, fontWeight: 900, color: 'var(--brand-green)', margin: 0 }}>114 <span style={{ fontSize: 14, fontWeight: 400 }}>KM/H</span></p>
              </div>
              <div style={{ height: 64, width: 1, background: 'var(--surface-3)' }}/>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--fg-muted)', margin: '0 0 4px', textTransform: 'uppercase' }}>CONFIANÇA OCR</p>
                <p style={{ fontSize: 28, fontWeight: 900, color: 'var(--brand-gold)', margin: 0 }}>99.2 <span style={{ fontSize: 14, fontWeight: 400 }}>%</span></p>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{
              background: 'var(--surface)', border: '2px solid var(--danger)',
              borderRadius: 8, overflow: 'hidden', boxShadow: 'var(--shadow-lg)',
            }}>
              <div style={{
                background: 'var(--danger)', color: '#FFF', padding: 16,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Icon name="alert-triangle" size={20}/>
                  <span style={{ fontWeight: 700, letterSpacing: '-0.01em' }}>ALERTA CRÍTICO</span>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, background: 'rgba(255,255,255,0.2)', padding: '4px 8px', borderRadius: 4 }}>AGORA</span>
              </div>
              <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ fontSize: 22, fontWeight: 900, color: 'var(--danger)', margin: 0 }}>VEÍCULO ROUBADO</h3>
                    <p style={{ fontSize: 14, color: 'var(--fg-muted)', margin: 0 }}>Toyota Corolla • Cinzento (2018)</p>
                  </div>
                  <span style={{
                    background: 'var(--danger-soft)', color: 'var(--danger-deep)',
                    padding: '4px 12px', borderRadius: 999,
                    fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
                    border: '1px solid rgba(199,50,43,0.2)', textTransform: 'uppercase',
                  }}>ROUBADO</span>
                </div>
                <div style={{ background: 'var(--surface-2)', padding: 16, borderRadius: 4, border: '1px solid var(--surface-3)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                    <span style={{ color: 'var(--border-strong)' }}>Proprietário:</span>
                    <span style={{ fontWeight: 600 }}>N/A — MANDADO ATIVO</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                    <span style={{ color: 'var(--border-strong)' }}>Origem Alerta:</span>
                    <span style={{ fontWeight: 600 }}>PSP — Comando Lisboa</span>
                  </div>
                </div>
                <button style={{
                  width: '100%', background: 'var(--brand-green)', color: '#FFF',
                  padding: 12, borderRadius: 4, border: 'none', cursor: 'pointer',
                  fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}>
                  <Icon name="radio" size={14}/>
                  COORDENAR INTERCEÇÃO
                </button>
              </div>
            </div>

            <div style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 8, padding: 16, boxShadow: 'var(--shadow-sm)',
            }}>
              <h4 style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--fg-muted)', margin: '0 0 16px', textTransform: 'uppercase' }}>OPERACIONAL HOJE</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                <div style={{ padding: 12, background: 'var(--surface-2)', borderRadius: 4, border: '1px solid var(--surface-3)' }}>
                  <p style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>1,248</p>
                  <p style={{ fontSize: 10, color: 'var(--fg-muted)', textTransform: 'uppercase', margin: 0 }}>Leituras</p>
                </div>
                <div style={{ padding: 12, background: 'var(--surface-2)', borderRadius: 4, border: '1px solid var(--surface-3)' }}>
                  <p style={{ fontSize: 22, fontWeight: 700, color: 'var(--danger)', margin: 0 }}>14</p>
                  <p style={{ fontSize: 10, color: 'var(--fg-muted)', textTransform: 'uppercase', margin: 0 }}>Alertas</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detection table */}
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 8, boxShadow: 'var(--shadow-sm)', overflow: 'hidden',
        }}>
          <div style={{
            padding: 16, borderBottom: '1px solid var(--border)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            background: 'var(--surface-2)',
          }}>
            <h3 style={{ fontWeight: 700, color: 'var(--brand-green)', margin: 0 }}>Últimas Deteções</h3>
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={{ fontSize: 12, background: 'var(--surface)', border: '1px solid var(--border)', padding: '4px 12px', borderRadius: 4, cursor: 'pointer' }}>Exportar CSV</button>
              <button style={{ fontSize: 12, background: 'var(--surface)', border: '1px solid var(--border)', padding: '4px 12px', borderRadius: 4, cursor: 'pointer' }}>Filtros</button>
            </div>
          </div>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(241,244,246,0.5)', borderBottom: '1px solid var(--border)' }}>
                {['Matrícula', 'Tipo', 'Estado', 'Hora', 'Ação'].map(h => (
                  <th key={h} style={{ padding: 16, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--fg-muted)', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {detecoes.map((d, i) => {
                const tone = d.severidade === 'critico'
                  ? { bg: 'var(--danger-soft)', fg: 'var(--danger-deep)', dot: 'var(--danger)' }
                  : d.severidade === 'aviso'
                  ? { bg: 'var(--warning-soft)', fg: 'var(--warning-deep)', dot: 'var(--warning)' }
                  : { bg: 'var(--brand-gold-soft)', fg: 'var(--brand-gold-deep)', dot: 'var(--success)' };
                return (
                  <tr key={i} style={{ borderBottom: i === detecoes.length - 1 ? 'none' : '1px solid var(--surface-3)' }}>
                    <td style={{ padding: 16 }}><span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 18 }}>{d.matricula}</span></td>
                    <td style={{ padding: 16, fontSize: 14 }}>{d.tipo}</td>
                    <td style={{ padding: 16 }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        padding: '2px 10px', borderRadius: 999,
                        fontSize: 12, fontWeight: 700, textTransform: 'uppercase',
                        background: tone.bg, color: tone.fg,
                      }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: tone.dot }}/>
                        {d.estado}
                      </span>
                    </td>
                    <td style={{ padding: 16, fontSize: 14, color: 'var(--fg-muted)' }}>{d.hora}</td>
                    <td style={{ padding: 16 }}>
                      {d.severidade === 'critico'
                        ? <button style={{ background: 'var(--danger)', color: '#FFF', fontSize: 10, fontWeight: 700, padding: '6px 12px', borderRadius: 4, border: 'none', cursor: 'pointer', letterSpacing: '0.05em' }}>INTERCETAR</button>
                        : <button style={{ background: 'var(--brand-green)', color: '#FFF', fontSize: 10, fontWeight: 700, padding: '6px 12px', borderRadius: 4, border: 'none', cursor: 'pointer', letterSpacing: '0.05em' }}>DETALHES</button>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div style={{ padding: 16, background: 'var(--surface-2)', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
            <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 700, color: 'var(--brand-green)' }}>
              Ver Histórico Completo
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

window.ScannerPCScreen = ScannerPCScreen;
