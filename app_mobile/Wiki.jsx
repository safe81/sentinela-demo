/* Sentinela Mobile — Wiki / Lista Telefónica GNR */

const WikiScreen = ({ onBack, store }) => {
  const { useStore } = window.SentinelaStore;
  const militares = useStore(s => s.militares);

  const [filtro, setFiltro] = React.useState('');
  const [categoriaAtiva, setCategoriaAtiva] = React.useState('geral');
  const [perfilAberto, setPerfilAberto] = React.useState(null);

  const categorias = [
    { id: 'geral', icon: 'users', label: 'Geral' },
    { id: 'transito', icon: 'car', label: 'Trânsito' },
    { id: 'territorial', icon: 'shield', label: 'Territorial' },
    { id: 'sepna', icon: 'leaf', label: 'SEPNA' },
    { id: 'investigacao', icon: 'search', label: 'Invest. Crim.' },
  ];

  const filtrado = militares.filter(m => {
    const texto = filtro.toLowerCase();
    return (
      m.nome.toLowerCase().includes(texto) ||
      m.nim.includes(texto) ||
      m.secao.toLowerCase().includes(texto)
    );
  });

  if (perfilAberto) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
        <div style={{ height: 52, background: 'var(--brand-green-deep)', color: '#FFF', display: 'flex', alignItems: 'center', padding: '0 12px', gap: 10 }}>
          <button onClick={() => setPerfilAberto(null)} style={{ background: 'transparent', border: 'none', color: '#FFF', display: 'flex', cursor: 'pointer', padding: 4 }}>
            <Icon name="arrow-left" size={20}/>
          </button>
          <div style={{ flex: 1, fontWeight: 600, fontSize: 14, fontFamily: 'var(--font-display)' }}>Ficha do Militar</div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, display: 'flex', alignItems: 'center', gap: 14 }}>
            <Avatar name={perfilAberto.nome} size={64}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17 }}>{perfilAberto.postoAbrev} {perfilAberto.nome}</div>
              <div className="t-mono" style={{ fontSize: 11, color: 'var(--fg-muted)' }}>NIM {perfilAberto.nim}</div>
              <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 2 }}>{perfilAberto.secao}</div>
            </div>
          </div>

          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10 }}>
            {[
              ['hash', 'NIM', perfilAberto.nim],
              ['award', 'Posto / Patente', perfilAberto.postoAbrev],
              ['map-pin', 'Posto Territorial', 'Posto GNR — Vila Real'],
              ['radio', 'Indicativo Rádio', perfilAberto.indicativo === '—' ? 'Sem patrulha' : perfilAberto.indicativo],
              ['phone', 'Telemóvel Serviço', '+351 939 ' + perfilAberto.nim.slice(-6)],
              ['mail', 'Email Institucional', perfilAberto.nome.toLowerCase().split(' ').slice(-1)[0] + '@gnr.pt'],
            ].map(([icon, label, val], i) => (
              <div key={i} style={{ padding: '11px 14px', borderTop: i ? '1px solid var(--border)' : 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
                <Icon name={icon} size={15} style={{ color: 'var(--brand-green)', flexShrink: 0 }}/>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, color: 'var(--fg-muted)' }}>{label}</div>
                  <div className="t-mono" style={{ fontSize: 13, fontWeight: 600 }}>{val}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <Button tone="primary" icon="phone">Ligar</Button>
            <Button tone="secondary" icon="mail">Email</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ height: 52, background: 'var(--brand-green-deep)', color: '#FFF', display: 'flex', alignItems: 'center', padding: '0 12px', gap: 10, flexShrink: 0 }}>
        <button onClick={onBack} style={{ background: 'transparent', border: 'none', color: '#FFF', display: 'flex', cursor: 'pointer', padding: 4 }}>
          <Icon name="arrow-left" size={20}/>
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: 14, fontFamily: 'var(--font-display)' }}>Wiki GNR</div>
          <div style={{ fontSize: 10, color: '#C9A24B' }}>Directório operacional e lista telefónica</div>
        </div>
        <Icon name="book-open" size={18}/>
      </div>

      {/* Search bar */}
      <div style={{ padding: '10px 12px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--surface-2)', borderRadius: 999, padding: '8px 12px' }}>
          <Icon name="search" size={16} style={{ color: 'var(--fg-soft)' }}/>
          <input
            value={filtro}
            onChange={e => setFiltro(e.target.value)}
            placeholder="Pesquisar por nome, NIM ou secção…"
            style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 13, color: 'var(--fg)' }}
          />
          {filtro && (
            <button onClick={() => setFiltro('')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, color: 'var(--fg-soft)' }}>
              <Icon name="x" size={14}/>
            </button>
          )}
        </div>
      </div>

      {/* Categorias */}
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '8px 12px', display: 'flex', gap: 8, overflowX: 'auto', flexShrink: 0 }}>
        {categorias.map(c => (
          <button key={c.id} onClick={() => setCategoriaAtiva(c.id)} style={{
            display: 'flex', alignItems: 'center', gap: 5,
            background: categoriaAtiva === c.id ? 'var(--brand-green)' : 'var(--surface-2)',
            color: categoriaAtiva === c.id ? '#FFF' : 'var(--fg)',
            border: 'none', borderRadius: 999, padding: '6px 12px', fontSize: 11, fontWeight: 600,
            cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
          }}>
            <Icon name={c.icon} size={13}/>
            {c.label}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', background: 'var(--bg)' }}>

        {/* Linha de emergência */}
        <div style={{ margin: '12px 12px 0', background: 'var(--danger-soft)', border: '1px solid var(--danger)', borderRadius: 10, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon name="phone-call" size={18} style={{ color: '#FFF' }}/>
          </div>
          <div style={{ flex: 1 }}>
            <div className="t-overline" style={{ color: 'var(--danger-deep)', marginBottom: 2 }}>LINHA DE EMERGÊNCIA</div>
            <div className="t-mono" style={{ fontWeight: 700, fontSize: 16, color: 'var(--danger-deep)' }}>112 / 808 200 200</div>
          </div>
          <button onClick={() => { window.location.href = 'tel:112'; }} style={{ background: 'var(--danger)', color: '#FFF', border: 'none', borderRadius: 8, padding: '7px 12px', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
            LIGAR
          </button>
        </div>

        {/* Lista de militares */}
        <div style={{ padding: '12px 12px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div className="t-overline">{filtro ? `RESULTADOS (${filtrado.length})` : 'MILITARES'}</div>
          </div>
        </div>

        <div style={{ padding: '8px 12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtrado.map(m => (
            <button key={m.id} onClick={() => setPerfilAberto(m)} style={{
              background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10,
              padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12,
              cursor: 'pointer', textAlign: 'left', width: '100%',
            }}>
              <Avatar name={m.nome} size={42}/>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{m.postoAbrev} {m.nome}</div>
                <div style={{ fontSize: 11, color: 'var(--fg-muted)', marginTop: 1 }}>{m.secao}</div>
                <div className="t-mono" style={{ fontSize: 10, color: 'var(--fg-soft)', marginTop: 1 }}>NIM {m.nim}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
                <StatusDot tone={m.estado === 'patrulha' ? 'warning' : m.estado === 'servico' ? 'success' : 'muted'}/>
                <Icon name="chevron-right" size={14} style={{ color: 'var(--fg-soft)' }}/>
              </div>
            </button>
          ))}
          {filtrado.length === 0 && (
            <div style={{ padding: '30px 0', textAlign: 'center', color: 'var(--fg-muted)', fontSize: 13 }}>
              Nenhum militar encontrado
            </div>
          )}
        </div>

        {/* Solicitar atualização */}
        <div style={{ margin: '0 12px 20px', padding: '14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, textAlign: 'center' }}>
          <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginBottom: 8 }}>Não encontrou o que procurava?</div>
          <button onClick={() => alert('Pedido enviado: Solicitar actualização de dados')} style={{
            background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8,
            padding: '8px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer', color: 'var(--fg)',
            display: 'inline-flex', alignItems: 'center', gap: 6,
          }}>
            <Icon name="edit-2" size={13}/>
            SOLICITAR ACTUALIZAÇÃO DE DADOS
          </button>
        </div>
      </div>
    </div>
  );
};

window.WikiScreen = WikiScreen;
