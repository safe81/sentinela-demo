/* Sentinela PC — Login (Stitch design) */

const LoginPCScreen = () => {
  const { actions } = window.SentinelaStore;
  const militares = window.SentinelaStore.useStore(s => s.militares);
  const [numero, setNumero] = React.useState('');
  const [posto, setPosto] = React.useState('');
  const [unidade, setUnidade] = React.useState('Comando Territorial de Vila Real');
  const [error, setError] = React.useState('');

  const handleEntrar = (e) => {
    e && e.preventDefault();
    const m = militares.find(x => x.nim === numero);
    if (!m) {
      setError('Número de Ordem inválido. Demo: experimente um nº listado na app.');
      return;
    }
    setError('');
    actions.login(m.id);
  };

  const styles = {
    page: {
      minHeight: '100vh', width: '100%',
      background: 'var(--brand-green-deep)',
      backgroundImage: 'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)',
      backgroundSize: '32px 32px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, fontFamily: 'var(--font-ui)',
      position: 'relative', overflow: 'hidden',
    },
    main: { width: '100%', maxWidth: 450, display: 'flex', flexDirection: 'column', gap: 24, position: 'relative', zIndex: 1 },
    card: {
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 12, padding: 40,
      boxShadow: '0 4px 12px rgba(0,33,71,0.08)',
    },
    headerWrap: { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: 32 },
    shieldBox: { width: 80, height: 80, marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' },
    title: {
      fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 40,
      lineHeight: 1, color: 'var(--brand-green)', margin: '0 0 4px',
      letterSpacing: '-0.02em',
    },
    subtitle: { fontSize: 16, color: 'var(--fg-muted)', margin: 0 },
    label: {
      display: 'block', fontFamily: 'var(--font-ui)', fontWeight: 600,
      fontSize: 12, letterSpacing: '0.05em',
      color: 'var(--fg-muted)', textTransform: 'uppercase', marginBottom: 4,
    },
    input: {
      width: '100%', height: 48, padding: '0 16px', fontSize: 16,
      border: '1px solid var(--border)', borderRadius: 8,
      background: 'var(--surface-2)', color: 'var(--fg)',
      outline: 'none', boxSizing: 'border-box',
      fontFamily: 'var(--font-ui)',
    },
    select: {
      width: '100%', height: 48, padding: '0 16px', fontSize: 16,
      border: '1px solid var(--border)', borderRadius: 8,
      background: 'var(--surface-2)', color: 'var(--fg)',
      outline: 'none', boxSizing: 'border-box', cursor: 'pointer',
      fontFamily: 'var(--font-ui)', appearance: 'none',
    },
    btnPrimary: {
      width: '100%', height: 48, marginTop: 16,
      background: 'var(--brand-green)', color: '#FFF',
      border: 'none', borderRadius: 8, cursor: 'pointer',
      fontWeight: 600, fontSize: 12, letterSpacing: '0.05em',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
      textTransform: 'uppercase',
    },
    divider: {
      position: 'relative', margin: '24px 0',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    },
    dividerLine: { position: 'absolute', inset: 0, top: '50%', borderTop: '1px solid var(--border)' },
    dividerText: {
      position: 'relative', background: 'var(--surface)', padding: '0 16px',
      fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
      color: 'var(--fg-muted)', textTransform: 'uppercase',
    },
    btnGoogle: {
      width: '100%', height: 48, background: '#FFF',
      border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer',
      color: 'var(--fg)', fontWeight: 600, fontSize: 12, letterSpacing: '0.05em',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
    },
    footer: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 },
    footTagline: {
      fontSize: 11, fontWeight: 700, letterSpacing: '0.2em',
      textAlign: 'center', textTransform: 'uppercase',
      color: 'rgba(255,255,255,0.65)',
    },
    footLinks: { display: 'flex', gap: 24, marginTop: 4 },
    footLink: {
      fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.55)',
      textDecoration: 'none', letterSpacing: '0.05em',
    },
    copyright: {
      fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.4)',
      letterSpacing: '0.08em', marginTop: 16,
    },
    bgIcon: {
      position: 'fixed', bottom: 24, right: 24,
      fontSize: 320, opacity: 0.06, pointerEvents: 'none',
      color: '#FFF', fontFamily: 'var(--font-display)', lineHeight: 1,
    },
  };

  // Google "G" SVG
  const GoogleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );

  return (
    <div style={styles.page}>
      <main style={styles.main}>
        <section style={styles.card}>
          <div style={styles.headerWrap}>
            <div style={styles.shieldBox}>
              <img src="assets/sentinela-shield.svg" alt="Sentinela" style={{ height: '100%', objectFit: 'contain' }}/>
            </div>
            <h1 style={styles.title}>Sentinela</h1>
            <p style={styles.subtitle}>Sistema Operacional GNR</p>
          </div>

          <form onSubmit={handleEntrar} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div>
              <label style={styles.label}>NÚMERO DE ORDEM</label>
              <input
                type="text"
                placeholder="Ex: 2150000"
                value={numero}
                onChange={e => setNumero(e.target.value)}
                style={styles.input}
              />
            </div>
            <div>
              <label style={styles.label}>POSTO</label>
              <select value={posto} onChange={e => setPosto(e.target.value)} style={styles.select}>
                <option value="" disabled>Selecionar posto...</option>
                <option value="soldado">Soldado</option>
                <option value="cabo">Cabo</option>
                <option value="sargento">Sargento</option>
                <option value="tenente">Tenente</option>
                <option value="capitao">Capitão</option>
              </select>
            </div>
            <div>
              <label style={styles.label}>UNIDADE</label>
              <input
                type="text"
                placeholder="Ex: Comando Territorial de Lisboa"
                value={unidade}
                onChange={e => setUnidade(e.target.value)}
                style={styles.input}
              />
            </div>
            {error && (
              <div role="alert" style={{
                fontSize: 13, padding: '10px 12px', borderRadius: 6,
                background: 'var(--danger-soft)', color: 'var(--danger-deep)',
                border: '1px solid var(--danger)',
              }}>{error}</div>
            )}
            <button type="submit" style={styles.btnPrimary}>
              <span>ENTRAR</span>
              <Icon name="arrow-right" size={18}/>
            </button>
          </form>

          <div style={styles.divider}>
            <span style={styles.dividerLine}/>
            <span style={styles.dividerText}>OU</span>
          </div>

          <button onClick={() => militares[0] && actions.login(militares[0].id)} style={styles.btnGoogle}>
            <GoogleIcon/>
            <span>ENTRAR COMO DEMO</span>
          </button>
        </section>

        <footer style={styles.footer}>
          <span style={styles.footTagline}>ACESSO RESTRITO A MILITARES DA GNR</span>
          <div style={styles.footLinks}>
            <a href="#" style={styles.footLink}>Termos de Serviço</a>
            <a href="#" style={styles.footLink}>Segurança Operacional</a>
          </div>
          <p style={styles.copyright}>© 2026 GUARDA NACIONAL REPUBLICANA — PORTUGAL</p>
        </footer>
      </main>

      <div style={styles.bgIcon} aria-hidden="true">
        <Icon name="shield" size={320}/>
      </div>
    </div>
  );
};

window.LoginPCScreen = LoginPCScreen;
