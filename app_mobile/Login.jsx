/* Sentinela Mobile — Login (Stitch design — Número de Ordem + posto + unidade + Google) */

const LoginScreen = () => {
  const { actions } = window.SentinelaStore;
  const militares = window.SentinelaStore.useStore(s => s.militares);
  const [numero, setNumero] = React.useState('');
  const [posto, setPosto] = React.useState('');
  const [unidade, setUnidade] = React.useState('Posto Territorial Vila Real');
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
      flex: 1, background: 'var(--bg)', color: 'var(--fg)',
      minHeight: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, fontFamily: 'var(--font-ui)',
    },
    card: {
      width: '100%', maxWidth: 380,
      background: 'var(--surface)', border: '1px solid var(--surface-3)',
      borderRadius: 12, padding: 32,
      boxShadow: '0 4px 12px rgba(0,33,71,0.08)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
    },
    headerWrap: {
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      marginBottom: 32, textAlign: 'center',
    },
    shield: {
      color: 'var(--brand-green)', marginBottom: 12,
    },
    title: {
      fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700,
      color: 'var(--brand-green)', letterSpacing: '-0.02em', margin: '0 0 4px',
    },
    subtitle: { fontSize: 14, color: 'var(--fg-muted)', margin: 0 },
    form: { width: '100%', display: 'flex', flexDirection: 'column', gap: 24 },
    label: {
      fontSize: 12, fontWeight: 600, letterSpacing: '0.05em',
      color: 'var(--fg-muted)', textTransform: 'uppercase',
    },
    input: {
      width: '100%', padding: 12, fontSize: 16,
      border: '1px solid var(--border)', borderRadius: 4,
      background: 'var(--surface)', color: 'var(--fg)',
      outline: 'none', boxSizing: 'border-box',
      fontFamily: 'var(--font-ui)',
    },
    select: {
      width: '100%', padding: 12, paddingRight: 36, fontSize: 16,
      border: '1px solid var(--border)', borderRadius: 4,
      background: 'var(--surface)', color: 'var(--fg)',
      outline: 'none', boxSizing: 'border-box',
      appearance: 'none', cursor: 'pointer',
      fontFamily: 'var(--font-ui)',
    },
    btnPrimary: {
      width: '100%', background: 'var(--brand-green)', color: '#FFF',
      fontWeight: 600, fontSize: 12, letterSpacing: '0.05em',
      padding: 12, borderRadius: 4, border: 'none', cursor: 'pointer',
      textTransform: 'uppercase',
    },
    divider: {
      display: 'flex', alignItems: 'center', gap: 12, margin: '4px 0',
    },
    dividerLine: { height: 1, background: 'var(--surface-3)', flex: 1 },
    dividerText: {
      fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
      color: 'var(--border-strong)', textTransform: 'uppercase',
    },
    btnGoogle: {
      width: '100%', background: 'var(--surface)',
      border: '1px solid var(--border)', color: 'var(--fg)',
      fontWeight: 600, fontSize: 12, letterSpacing: '0.05em',
      padding: 12, borderRadius: 4, cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
      textTransform: 'uppercase',
    },
    footer: {
      marginTop: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
      gap: 4, color: 'var(--border-strong)',
    },
    footerText: {
      fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
    },
  };

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
      <div style={styles.card}>
        <div style={styles.headerWrap}>
          <div style={styles.shield}>
            <Icon name="shield" size={56}/>
          </div>
          <h1 style={styles.title}>Sentinela</h1>
          <p style={styles.subtitle}>Sistema Operacional GNR</p>
        </div>

        <form onSubmit={handleEntrar} style={styles.form}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label htmlFor="numero_ordem" style={styles.label}>Número de Ordem</label>
            <input
              id="numero_ordem"
              type="text"
              inputMode="numeric"
              placeholder="2060588"
              value={numero}
              onChange={e => setNumero(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label htmlFor="posto" style={styles.label}>Posto</label>
            <div style={{ position: 'relative' }}>
              <select
                id="posto"
                value={posto}
                onChange={e => setPosto(e.target.value)}
                style={styles.select}
              >
                <option value="" disabled>Selecione o posto...</option>
                <option value="guarda">Guarda</option>
                <option value="cabo">Cabo</option>
                <option value="sargento">Sargento</option>
                <option value="oficial">Oficial</option>
              </select>
              <span style={{
                position: 'absolute', right: 12, top: '50%',
                transform: 'translateY(-50%)', pointerEvents: 'none',
                color: 'var(--border-strong)',
              }}><Icon name="chevron-down" size={16}/></span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label htmlFor="unidade" style={styles.label}>Unidade</label>
            <input
              id="unidade"
              type="text"
              placeholder="Destacamento Territorial"
              value={unidade}
              onChange={e => setUnidade(e.target.value)}
              style={styles.input}
            />
          </div>

          {error && (
            <div role="alert" style={{
              fontSize: 13, padding: '10px 12px', borderRadius: 6,
              background: 'var(--danger-soft)', color: 'var(--danger-deep)',
              border: '1px solid var(--danger)', marginTop: 4,
            }}>{error}</div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 4 }}>
            <button type="submit" style={styles.btnPrimary}>Entrar</button>

            <div style={styles.divider}>
              <span style={styles.dividerLine}/>
              <span style={styles.dividerText}>OU</span>
              <span style={styles.dividerLine}/>
            </div>

            <button type="button" onClick={() => militares[0] && actions.login(militares[0].id)} style={styles.btnGoogle}>
              <GoogleIcon/>
              Entrar como demo
            </button>
          </div>
        </form>

        <div style={styles.footer}>
          <Icon name="shield" size={14}/>
          <span style={styles.footerText}>Acesso restrito a militares GNR</span>
        </div>
      </div>
    </div>
  );
};

window.LoginScreen = LoginScreen;
