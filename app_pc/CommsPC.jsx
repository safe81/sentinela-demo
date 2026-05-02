/* Sentinela PC — Centro de Comunicações (Stitch design)
 * Two-panel chat: channel list (left) + active thread (right).
 */

const CommsPCScreen = () => {
  const { useStore, actions } = window.SentinelaStore;
  const me = useStore(s => {
    const id = s.militarLogadoId;
    return s.militares.find(m => m.id === id);
  });

  const [mensagem, setMensagem] = React.useState('');
  const enviarAtual = () => {
    const txt = mensagem.trim();
    if (!txt) return;
    actions.enviarMensagem('c1', txt);
    setMensagem('');
  };

  const channels = [
    { id: 'posto-vrl',   icon: 'map-pin',  title: 'Chat de Posto - Vila Real', preview: 'Sgt. Pires: Confirmar patrulha na EN11...', meta: 'ESTÁTICO / PERMANENTE', active: true,  badge: 3 },
    { id: 'turno-a',     icon: 'clock',    title: 'Chat de Serviço - Turno A', preview: 'Cb. Silva: Rendição concluída no sector...', meta: 'TEMPORAL • 08:00 - 16:00', metaTone: 'gold', time: '14:20' },
    { id: 'distrital',   icon: 'users',    title: 'Coordenação Distrital',     preview: 'Aguardando reporte de ocorrência...' },
  ];

  const active = 'commsPc';
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

  const styles = {
    page: {
      display: 'flex', height: '100vh', overflow: 'hidden',
      background: 'var(--bg)', color: 'var(--fg)', fontFamily: 'var(--font-ui)',
    },
    sidebar: {
      position: 'fixed', left: 0, top: 0, height: '100%', width: 256,
      background: 'var(--brand-green)', color: '#FFF', zIndex: 50,
      display: 'flex', flexDirection: 'column',
      borderRight: '1px solid rgba(255,255,255,0.08)',
    },
    sideHeader: { padding: 16, display: 'flex', alignItems: 'center', gap: 12 },
    sideLogoBox: {
      width: 40, height: 40, borderRadius: 4,
      background: 'rgba(255,255,255,0.1)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
    },
    sideTitle: { fontSize: 20, fontWeight: 700, color: '#FFF', letterSpacing: '-0.01em', margin: 0 },
    sideSub: { fontSize: 11, color: 'rgba(255,255,255,0.65)', margin: 0 },
    sideNav: { flex: 1, marginTop: 24, padding: '0 4px' },
    sideLink: (isActive) => ({
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px', textDecoration: 'none',
      fontSize: 13, fontWeight: 500,
      color: isActive ? '#FFF' : 'rgba(255,255,255,0.75)',
      background: isActive ? '#001535' : 'transparent',
      borderTop: 'none', borderRight: 'none', borderBottom: 'none',
      borderLeft: isActive ? '4px solid #FFF' : '4px solid transparent',
      transition: 'all 0.2s',
      cursor: 'pointer', textAlign: 'left', width: '100%', font: 'inherit',
    }),
    sideFooter: { padding: 12, marginTop: 'auto' },
    btnNova: {
      width: '100%', background: 'rgba(255,255,255,0.1)',
      color: '#FFF', fontWeight: 600, padding: 12, borderRadius: 8,
      marginBottom: 12, border: 'none', cursor: 'pointer', fontSize: 13,
    },

    main: {
      marginLeft: 256, flex: 1,
      display: 'flex', flexDirection: 'column',
      background: 'var(--bg)', overflow: 'hidden',
    },
    topbar: {
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      width: '100%', height: 64, padding: '0 24px',
      background: 'var(--surface)', borderBottom: '1px solid var(--border)',
    },
    topTitle: {
      fontSize: 18, fontWeight: 900, letterSpacing: '0.05em',
      color: 'var(--brand-green)', textTransform: 'uppercase',
    },
    searchInput: {
      paddingLeft: 40, paddingRight: 16, paddingTop: 6, paddingBottom: 6,
      background: 'var(--surface-2)', border: '1px solid var(--border)',
      borderRadius: 999, fontSize: 14, width: 260, outline: 'none',
      color: 'var(--fg)', fontFamily: 'var(--font-ui)',
    },

    splitPanel: { display: 'flex', flex: 1, overflow: 'hidden' },
    channelsPanel: {
      width: 350, background: 'var(--surface)',
      borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column',
    },
    channelsHeader: {
      padding: 24, borderBottom: '1px solid var(--border)',
      background: 'rgba(241,244,246,0.5)',
    },
    channelsTitle: {
      fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 600,
      color: 'var(--brand-green-deep)', letterSpacing: '-0.01em', margin: 0,
    },
    channelItem: (active) => ({
      padding: 24, display: 'flex', alignItems: 'flex-start', gap: 12,
      cursor: 'pointer', transition: 'all 0.2s',
      background: active ? 'rgba(0,33,71,0.05)' : 'transparent',
      borderRight: active ? '4px solid var(--brand-green)' : '4px solid transparent',
      borderBottom: '1px solid var(--surface-3)',
    }),
    chatPanel: { flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg)' },
    chatHeader: {
      height: 56, background: 'var(--brand-green)', color: '#FFF',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 24px', boxShadow: 'var(--shadow-sm)', zIndex: 10,
    },
    messages: {
      flex: 1, overflowY: 'auto', padding: 24,
      display: 'flex', flexDirection: 'column', gap: 24,
    },
    bubbleReceived: {
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 12, borderTopLeftRadius: 0,
      padding: 12, boxShadow: 'var(--shadow-sm)',
      maxWidth: '70%',
    },
    bubbleSent: {
      background: 'var(--brand-green)', color: '#FFF',
      borderRadius: 12, borderTopRightRadius: 0,
      padding: 12, boxShadow: 'var(--shadow-sm)',
      maxWidth: '70%',
    },
    inputBar: {
      background: 'var(--surface)', borderTop: '1px solid var(--border)', padding: 24,
    },
    inputBox: {
      display: 'flex', alignItems: 'center', gap: 12,
      background: 'var(--surface-2)', borderRadius: 12,
      border: '1px solid var(--border)', padding: 4,
    },
    sendBtn: {
      background: 'var(--brand-green)', color: '#FFF',
      width: 40, height: 40, borderRadius: 8, border: 'none', cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    },
  };

  return (
    <div style={styles.page}>
      <aside style={styles.sidebar}>
        <div style={styles.sideHeader}>
          <div style={styles.sideLogoBox}>
            <Icon name="shield" size={22}/>
          </div>
          <div>
            <h1 style={styles.sideTitle}>GNR Operacional</h1>
            <p style={styles.sideSub}>Comando Territorial</p>
          </div>
        </div>
        <nav style={styles.sideNav}>
          {navItems.map(it => (
            <button key={it.id} onClick={() => goTo(it.id)} style={styles.sideLink(active === it.id)}>
              <Icon name={it.icon} size={20}/><span>{it.label}</span>
            </button>
          ))}
        </nav>
        <div style={styles.sideFooter}>
          <button onClick={() => alert('Funcionalidade demo — em breve')} style={styles.btnNova}>Nova Comunicação</button>
          {footerItems.map(it => (
            <button key={it.id} onClick={() => goTo(it.id)} style={styles.sideLink(false)}>
              <Icon name={it.icon} size={20}/><span>{it.label}</span>
            </button>
          ))}
        </div>
      </aside>

      <main style={styles.main}>
        <header style={styles.topbar}>
          <span style={styles.topTitle}>Sistema de Comunicações GNR</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 12, top: 7, color: 'var(--fg-muted)' }}><Icon name="search" size={14}/></span>
              <input type="text" placeholder="Pesquisar mensagens..." style={styles.searchInput}/>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--brand-green)' }}>
              <button onClick={() => alert('Funcionalidade demo — em breve')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'inherit', padding: 4 }}><Icon name="bell" size={20}/></button>
              <button onClick={() => alert('Funcionalidade demo — em breve')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'inherit', padding: 4 }}><Icon name="user" size={20}/></button>
            </div>
          </div>
        </header>

        <div style={styles.splitPanel}>
          {/* Channels */}
          <section style={styles.channelsPanel}>
            <div style={styles.channelsHeader}>
              <h2 style={styles.channelsTitle}>Canais de Comunicação</h2>
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {channels.map(ch => (
                <div key={ch.id} style={styles.channelItem(ch.active)}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 8,
                    background: ch.active ? 'var(--brand-green)' : (ch.metaTone === 'gold' ? 'var(--brand-gold-deep)' : 'var(--surface-3)'),
                    color: ch.active || ch.metaTone === 'gold' ? '#FFF' : 'var(--fg-muted)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <Icon name={ch.icon} size={20}/>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{
                        fontSize: 12, fontWeight: 600, letterSpacing: '0.05em',
                        color: ch.active ? 'var(--brand-green-deep)' : 'var(--fg)',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      }}>{ch.title}</span>
                      {ch.badge && (
                        <span style={{
                          background: 'var(--danger)', color: '#FFF',
                          fontSize: 10, fontWeight: 700, padding: '2px 6px',
                          borderRadius: 999,
                        }}>{ch.badge}</span>
                      )}
                      {ch.time && !ch.badge && (
                        <span style={{ fontSize: 11, color: 'var(--border-strong)' }}>{ch.time}</span>
                      )}
                    </div>
                    <p style={{
                      fontSize: 14, color: 'var(--fg-muted)', margin: '2px 0 4px',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>{ch.preview}</p>
                    {ch.meta && (
                      <span style={{
                        fontSize: 10, fontWeight: 700,
                        color: ch.metaTone === 'gold' ? 'var(--brand-gold-deep)' : 'var(--border-strong)',
                        textTransform: 'uppercase', letterSpacing: '0.08em',
                      }}>{ch.meta}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Active thread */}
          <section style={styles.chatPanel}>
            <header style={styles.chatHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Icon name="shield-check" size={20}/>
                <h3 style={{ margin: 0, fontSize: 12, fontWeight: 600, letterSpacing: '0.05em' }}>
                  Chat de Posto - Vila Real • <span style={{ fontWeight: 400, opacity: 0.8 }}>Mensagens Permanentes</span>
                </h3>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'rgba(255,255,255,0.8)' }}>
                <button onClick={() => alert('Funcionalidade demo — em breve')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'inherit' }}><Icon name="alert-triangle" size={18}/></button>
                <button onClick={() => alert('Funcionalidade demo — em breve')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'inherit' }}><Icon name="menu" size={18}/></button>
              </div>
            </header>

            <div style={styles.messages}>
              <div style={{ display: 'flex', justifyContent: 'center', margin: '12px 0' }}>
                <span style={{
                  background: 'var(--surface-3)', color: 'var(--fg-muted)',
                  padding: '4px 12px', borderRadius: 999,
                  fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.16em',
                }}>Hoje, 02 de Maio</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4, marginLeft: 4 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--brand-green)' }}>Sgt. Pires</span>
                  <span style={{ fontSize: 10, color: 'var(--border-strong)' }}>10:15</span>
                </div>
                <div style={styles.bubbleReceived}>
                  <p style={{ fontSize: 16, color: 'var(--brand-green-deep)', margin: 0 }}>
                    Confirmar patrulha na EN11 em direção ao Montijo. Reportar qualquer anomalia no pavimento ou sinalização.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', alignSelf: 'flex-end' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4, marginRight: 4 }}>
                  <span style={{ fontSize: 10, color: 'var(--border-strong)' }}>10:22</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--brand-green)' }}>Eu ({me ? me.postoAbrev + ' ' + me.nome.split(' ')[0] : 'Cb. Costa'})</span>
                </div>
                <div style={styles.bubbleSent}>
                  <p style={{ fontSize: 16, margin: 0 }}>
                    Entendido, Sargento. A patrulha 402 inicia deslocação imediata. Previsão de chegada ao local em 10 minutos.
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4, fontSize: 10, color: 'var(--brand-gold)' }}>
                  <Icon name="check" size={12}/>
                  <span style={{ fontWeight: 500 }}>Lida por 4 operacionais</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4, marginLeft: 4 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--brand-green)' }}>Cb. Silva</span>
                  <span style={{ fontSize: 10, color: 'var(--border-strong)' }}>10:30</span>
                </div>
                <div style={styles.bubbleReceived}>
                  <p style={{ fontSize: 16, color: 'var(--brand-green-deep)', margin: 0 }}>
                    Reforço necessário no entroncamento sul. Tráfego condicionado devido a transporte especial.
                  </p>
                </div>
              </div>

              {/* Operational alert banner */}
              <div style={{ width: '100%', maxWidth: 480, margin: '0 auto' }}>
                <div style={{
                  background: 'var(--danger-soft)', borderLeft: '4px solid var(--danger)',
                  padding: 12, borderRadius: 4,
                  display: 'flex', alignItems: 'flex-start', gap: 12,
                }}>
                  <span style={{ color: 'var(--danger)' }}><Icon name="alert-triangle" size={20}/></span>
                  <div>
                    <h4 style={{ fontSize: 11, fontWeight: 600, color: 'var(--danger-deep)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 4px' }}>
                      Alerta Operacional
                    </h4>
                    <p style={{ fontSize: 14, color: 'var(--danger-deep)', margin: 0 }}>
                      Viatura suspeita reportada nas imediações (AB-12-CD). Olhar atento.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <footer style={styles.inputBar}>
              <div style={styles.inputBox}>
                <button onClick={() => alert('Funcionalidade demo — em breve')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--border-strong)', padding: 4 }}>
                  <Icon name="paperclip" size={20}/>
                </button>
                <input
                  type="text"
                  placeholder="Escreva uma mensagem..."
                  value={mensagem}
                  onChange={e => setMensagem(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') enviarAtual(); }}
                  style={{
                    flex: 1, background: 'transparent', border: 'none', outline: 'none',
                    fontSize: 16, padding: 12, color: 'var(--fg)', fontFamily: 'var(--font-ui)',
                  }}
                />
                <button onClick={enviarAtual} style={styles.sendBtn} aria-label="Enviar">
                  <Icon name="send" size={18}/>
                </button>
              </div>
            </footer>
          </section>
        </div>
      </main>
    </div>
  );
};

window.CommsPCScreen = CommsPCScreen;
