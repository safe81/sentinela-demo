/* Sentinela PC — Escalas de Serviço (Stitch design)
 * Calendar grid + right detail panel (turnos, militares, viaturas).
 */

const EscalasPCScreen = () => {
  const { useStore } = window.SentinelaStore;
  const militares = useStore(s => s.militares);

  // Build a 5-row calendar grid for the current month (May 2026)
  const today = new Date();
  const ano = today.getFullYear();
  const mes = today.getMonth();
  const primeiro = new Date(ano, mes, 1);
  const ultimo = new Date(ano, mes + 1, 0);
  // Monday-first week index: 0..6 from Mon..Sun
  const startWeekday = (primeiro.getDay() + 6) % 7;
  const totalCells = 35;

  const cells = [];
  for (let i = 0; i < totalCells; i++) {
    const dia = i - startWeekday + 1;
    if (dia < 1 || dia > ultimo.getDate()) {
      // From previous or next month — show with low opacity
      const prevD = new Date(ano, mes, dia);
      cells.push({ outOfMonth: true, label: prevD.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' }) });
    } else {
      const isToday = dia === today.getDate();
      cells.push({ outOfMonth: false, dia, isSelected: isToday });
    }
  }

  const monthLabel = primeiro.toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' }).toUpperCase();

  const navItems = [
    { id: 'ops',     icon: 'activity',         label: 'Operations' },
    { id: 'alpr',    icon: 'alert-triangle',   label: 'ALPR Alerts' },
    { id: 'patrols', icon: 'shield',           label: 'Patrols' },
    { id: 'escalas', icon: 'calendar',         label: 'Escalas de Serviço', active: true },
    { id: 'fleet',   icon: 'car',              label: 'Fleet' },
  ];

  // Tag colors (ranked by turno)
  const tagDia = { bg: 'var(--brand-gold-soft)', fg: 'var(--brand-gold-deep)' };
  const tagNoite = { bg: 'var(--brand-green)', fg: '#FFF' };
  const tagFolga = { bg: 'var(--surface-3)', fg: 'var(--fg-muted)' };

  return (
    <div style={{
      display: 'flex', height: '100vh', overflow: 'hidden',
      background: 'var(--bg)', color: 'var(--fg)', fontFamily: 'var(--font-ui)',
    }}>
      {/* Sidebar */}
      <aside style={{
        position: 'fixed', left: 0, top: 0, height: '100vh', width: 256, zIndex: 50,
        background: 'var(--surface-2)', borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column', padding: '24px 16px',
      }}>
        <div style={{ marginBottom: 40, padding: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 8,
            background: 'var(--brand-green)', color: '#FFF',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}><Icon name="shield" size={20}/></div>
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 900, color: 'var(--brand-green)', textTransform: 'uppercase', margin: 0, lineHeight: 1 }}>GNR Command</h1>
            <p style={{ fontSize: 10, color: 'var(--fg-muted)', fontWeight: 700, letterSpacing: '0.08em', marginTop: 4, textTransform: 'uppercase' }}>District Headquarters</p>
          </div>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {navItems.map(it => (
            <a key={it.id} href="#" style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: it.active ? '16px 12px' : '8px 12px',
              fontSize: 12, fontWeight: it.active ? 700 : 600, letterSpacing: '0.05em',
              textDecoration: 'none',
              color: it.active ? 'var(--brand-green)' : 'var(--fg-muted)',
              background: it.active ? 'var(--surface-3)' : 'transparent',
              borderRight: it.active ? '4px solid var(--brand-green)' : '4px solid transparent',
            }}>
              <Icon name={it.icon} size={18}/>
              <span>{it.label}</span>
            </a>
          ))}
        </nav>

        <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border)', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px', textDecoration: 'none', color: 'var(--fg-muted)', fontSize: 12, fontWeight: 600 }}>
            <Icon name="settings" size={18}/>
            <span>Settings</span>
          </a>
          <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px', textDecoration: 'none', color: 'var(--fg-muted)', fontSize: 12, fontWeight: 600 }}>
            <Icon name="log-out" size={18}/>
            <span>Logout</span>
          </a>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, marginLeft: 256, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Topbar */}
        <header style={{
          height: 64, background: 'var(--surface)',
          borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 32px', zIndex: 40,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--brand-green)', margin: 0 }}>Escalas de Serviço</h2>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'var(--surface-2)', padding: '6px 12px', borderRadius: 4,
              border: '1px solid var(--border)',
            }}>
              <Icon name="map-pin" size={14}/>
              <select style={{
                background: 'transparent', border: 'none', fontSize: 12, fontWeight: 600,
                padding: 0, outline: 'none', cursor: 'pointer', color: 'var(--fg)',
                fontFamily: 'var(--font-ui)', letterSpacing: '0.05em',
              }}>
                <option>Posto Territorial de Vila Real</option>
                <option>Posto Territorial de Sintra</option>
                <option>Posto Territorial de Mafra</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'var(--brand-green)', color: '#FFF',
              padding: '8px 16px', borderRadius: 8, border: 'none',
              cursor: 'pointer', fontSize: 12, fontWeight: 600, letterSpacing: '0.05em',
            }}>
              <Icon name="upload" size={14}/>
              Imprimir Escala
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingLeft: 16, borderLeft: '1px solid var(--border)' }}>
              <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--fg-muted)', padding: 4 }}><Icon name="bell" size={20}/></button>
              <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--fg-muted)', padding: 4 }}><Icon name="search" size={20}/></button>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(0,33,71,0.10)', color: 'var(--brand-green)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="user" size={16}/>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* Calendar */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 24, background: 'var(--bg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <h3 style={{
                  fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 600,
                  color: 'var(--brand-green)', letterSpacing: '0.16em', textTransform: 'uppercase', margin: 0,
                }}>{monthLabel}</h3>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button style={{ padding: 4, background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--fg-muted)' }}><Icon name="chevron-down" size={18} style={{ transform: 'rotate(90deg)' }}/></button>
                  <button style={{ padding: 4, background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--fg-muted)' }}><Icon name="chevron-down" size={18} style={{ transform: 'rotate(-90deg)' }}/></button>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 16 }}>
                {[
                  ['var(--brand-gold)', 'D (Dia)'],
                  ['var(--brand-green)', 'N (Noite)'],
                  ['var(--border-strong)', 'F (Folga)'],
                  ['var(--warning)', 'DES (Descanso)'],
                ].map(([c, l]) => (
                  <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: c }}/>
                    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--fg-muted)', textTransform: 'uppercase' }}>{l}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              flex: 1, display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)',
              borderTop: '1px solid var(--border)', borderLeft: '1px solid var(--border)',
            }}>
              {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'].map((d, i) => (
                <div key={d} style={{
                  background: 'var(--surface-3)',
                  borderRight: '1px solid var(--border)', borderBottom: '1px solid var(--border)',
                  padding: 8, textAlign: 'center',
                  fontSize: 11, fontWeight: i >= 5 ? 700 : 700,
                  color: i >= 5 ? 'var(--brand-green)' : 'var(--fg-muted)',
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                }}>{d}</div>
              ))}

              {cells.map((c, i) => (
                <div key={i} style={{
                  height: 96,
                  borderRight: '1px solid var(--border)', borderBottom: '1px solid var(--border)',
                  padding: 8,
                  background: c.outOfMonth ? 'var(--surface)' : 'var(--surface)',
                  opacity: c.outOfMonth ? 0.4 : 1,
                  border: c.isSelected ? '4px solid rgba(0,33,71,0.3)' : undefined,
                  position: 'relative',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span style={{
                      fontSize: 12, fontWeight: 600, letterSpacing: '0.05em',
                      color: c.outOfMonth ? 'var(--border-strong)' : 'var(--brand-green)',
                    }}>{c.outOfMonth ? c.label : String(c.dia).padStart(2, '0')}</span>
                  </div>
                  {!c.outOfMonth && c.dia % 4 === 1 && militares.length > 0 && (
                    <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <div style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '2px 6px', borderRadius: 4, fontSize: 10, fontWeight: 700,
                        background: tagDia.bg, color: tagDia.fg,
                      }}>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {militares[0]?.postoAbrev} {militares[0]?.nome.split(' ')[0]}
                        </span>
                        <span>D</span>
                      </div>
                      {c.dia % 7 === 1 && militares.length > 1 && (
                        <div style={{
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          padding: '2px 6px', borderRadius: 4, fontSize: 10, fontWeight: 700,
                          background: tagNoite.bg, color: tagNoite.fg,
                        }}>
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {militares[1]?.postoAbrev} {militares[1]?.nome.split(' ')[0]}
                          </span>
                          <span>N</span>
                        </div>
                      )}
                    </div>
                  )}
                  {!c.outOfMonth && c.dia % 7 === 3 && militares.length > 2 && (
                    <div style={{ marginTop: 8 }}>
                      <div style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '2px 6px', borderRadius: 4, fontSize: 10, fontWeight: 700,
                        background: tagFolga.bg, color: tagFolga.fg,
                      }}>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {militares[2]?.postoAbrev} {militares[2]?.nome.split(' ')[0]}
                        </span>
                        <span>F</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Detail panel */}
          <aside style={{
            width: 320, background: 'var(--surface)',
            borderLeft: '1px solid var(--border)',
            display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ padding: 24, borderBottom: '1px solid var(--border)', background: 'var(--surface-2)' }}>
              <h4 style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--fg-muted)', margin: '0 0 4px', textTransform: 'uppercase' }}>DETALHES DO DIA</h4>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: 'var(--brand-green)', margin: 0 }}>
                {today.toLocaleDateString('pt-PT', { weekday: 'long', day: '2-digit', month: 'short' })}
              </p>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>
              {/* Turno Dia */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <span style={{ width: 8, height: 24, background: 'var(--brand-gold)', borderRadius: 999 }}/>
                  <h5 style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.05em', color: 'var(--brand-green)', textTransform: 'uppercase', margin: 0 }}>
                    Turno de Dia (08:00 - 16:00)
                  </h5>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {militares.slice(0, 2).map((m, i) => (
                    <div key={m.id} style={{ padding: 12, border: '1px solid var(--border)', borderRadius: 8 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                        <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--brand-green)', margin: 0 }}>{m.postoAbrev || m.posto} {m.nome.split(' ')[0]}, {m.nome.split(' ').slice(-1)[0][0]}.</p>
                        <span style={{
                          fontSize: 10, background: i === 0 ? 'rgba(0,33,71,0.15)' : 'var(--surface-3)',
                          color: i === 0 ? 'var(--brand-green)' : 'var(--fg-muted)',
                          padding: '2px 8px', borderRadius: 4, fontWeight: 700, textTransform: 'uppercase',
                        }}>{i === 0 ? 'Comandante' : 'Condutor'}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--fg-muted)' }}>
                        <Icon name="car" size={14}/>
                        <span>Viatura {m.viatura || 'GNR-VRL-4421'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reserva */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <span style={{ width: 8, height: 24, background: 'var(--warning)', borderRadius: 999 }}/>
                  <h5 style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.05em', color: 'var(--brand-green)', textTransform: 'uppercase', margin: 0 }}>
                    Reserva / Prevenção
                  </h5>
                </div>
                <div style={{ padding: 12, background: 'var(--surface-3)', borderRadius: 8, border: '1px solid var(--border)' }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--brand-green)', margin: 0 }}>{militares[2] ? `${militares[2].postoAbrev || militares[2].posto} ${militares[2].nome.split(' ')[0]}, ${militares[2].nome.split(' ').slice(-1)[0][0]}.` : 'Sgt. Costa, M.'}</p>
                  <p style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 4, marginBottom: 0 }}>Contacto Operacional: Ext. 2231</p>
                </div>
              </div>

              {/* Map preview */}
              <div style={{ marginTop: 16 }}>
                <h5 style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--fg-muted)', margin: '0 0 12px', textTransform: 'uppercase' }}>ZONA DE PATRULHAMENTO</h5>
                <div style={{
                  position: 'relative', height: 160,
                  borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border)',
                  backgroundImage: 'radial-gradient(circle at 30% 30%, rgba(42,106,63,0.20), transparent 60%), radial-gradient(circle at 70% 70%, rgba(0,33,71,0.18), transparent 60%)',
                  backgroundColor: 'var(--surface-3)',
                }}>
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,33,71,0.10)' }}/>
                  <div style={{
                    position: 'absolute', bottom: 8, left: 8,
                    background: 'rgba(255,255,255,0.9)', padding: '4px 8px',
                    borderRadius: 4, fontSize: 10, fontWeight: 700, color: 'var(--brand-green)',
                  }}>Vila Real Sector III</div>
                </div>
              </div>
            </div>

            <div style={{ padding: 24, borderTop: '1px solid var(--border)' }}>
              <button style={{
                width: '100%', padding: 12,
                background: 'var(--surface-3)', border: '1px solid var(--border)',
                color: 'var(--brand-green)', fontSize: 12, fontWeight: 600, letterSpacing: '0.05em',
                borderRadius: 8, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}>
                <Icon name="settings" size={16}/>
                Editar Escala Diária
              </button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

window.EscalasPCScreen = EscalasPCScreen;
