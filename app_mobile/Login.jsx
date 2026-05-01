/* Sentinela Mobile — Login screen (escolher militar) */

const LoginScreen = () => {
  const { useStore, actions } = window.SentinelaStore;
  const militares = useStore(s => s.militares);
  const [filtro, setFiltro] = React.useState('');

  const visiveis = militares.filter(m =>
    m.nome.toLowerCase().includes(filtro.toLowerCase()) ||
    m.nim.includes(filtro)
  );

  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      background: 'linear-gradient(180deg, var(--brand-green-deep) 0%, var(--brand-green) 50%, var(--bg) 50%)',
    }}>
      <div style={{ padding: '32px 22px 24px', textAlign: 'center', color: '#FFF' }}>
        <img src="assets/sentinela-shield.svg" alt="" style={{ width: 56, height: 64, margin: '0 auto 12px' }}/>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, letterSpacing: '-0.01em' }}>SENTINELA</div>
        <div style={{ fontSize: 11, color: '#C9A24B', fontWeight: 600, letterSpacing: '0.14em', marginTop: 2 }}>PLATAFORMA OPERACIONAL</div>
        <div style={{ fontSize: 12, opacity: 0.85, marginTop: 14 }}>Posto Territorial de Vila Real</div>
      </div>

      <div style={{
        flex: 1, background: 'var(--bg)', borderTopLeftRadius: 20, borderTopRightRadius: 20,
        padding: '18px 14px', overflowY: 'auto',
      }}>
        <div className="t-overline" style={{ marginBottom: 8 }}>ENTRAR — ESCOLHE O TEU PERFIL</div>

        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-pill)', padding: '8px 12px', marginBottom: 12,
        }}>
          <Icon name="search" size={16} style={{ color: 'var(--fg-soft)' }}/>
          <input
            value={filtro}
            onChange={e => setFiltro(e.target.value)}
            placeholder="Pesquisar nome ou NIM"
            style={{ flex: 1, border: 'none', outline: 'none', fontSize: 13, background: 'transparent', color: 'var(--fg)' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {visiveis.map(m => (
            <button key={m.id} onClick={() => actions.login(m.id)} style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)', padding: 10, textAlign: 'left',
              display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
            }}>
              <Avatar name={m.nome} size={42}/>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{m.postoAbrev} {m.nome}</div>
                <div className="t-mono" style={{ fontSize: 11, color: 'var(--fg-muted)' }}>NIM {m.nim} · {m.indicativo}</div>
              </div>
              <Icon name="chevron-right" size={16} style={{ color: 'var(--fg-soft)' }}/>
            </button>
          ))}
        </div>

        <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--fg-muted)', marginTop: 18 }}>
          Versão demo · sem palavra-passe
        </div>
      </div>
    </div>
  );
};

window.LoginScreen = LoginScreen;
