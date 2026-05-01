/* Sentinela PC — Outras vistas: OS (enviar), Patrulhas, Militares, Viaturas, Chat, Escalas */

const OSView = () => {
  const { useStore, actions } = window.SentinelaStore;
  const ordens = useStore(s => s.ordens);
  const [showForm, setShowForm] = React.useState(false);
  const [titulo, setTitulo] = React.useState('');
  const [paginas, setPaginas] = React.useState(2);

  const submit = () => {
    if (!titulo.trim()) return;
    actions.enviarOS({ titulo, autor: 'Sarg. Costa Ribeiro', paginas: Number(paginas) });
    setTitulo(''); setPaginas(2); setShowForm(false);
  };

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: 22 }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        <Button tone="primary" icon="plus" onClick={() => setShowForm(s => !s)}>Nova OS</Button>
        <div style={{ flex: 1 }}/>
        <div style={{ fontSize: 12, color: 'var(--fg-muted)', alignSelf: 'center' }}>{ordens.length} ordens</div>
      </div>
      {showForm && (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--brand-green)', borderRadius: 10, padding: 14, marginBottom: 14 }}>
          <div className="t-overline" style={{ marginBottom: 8 }}>NOVA ORDEM DE SERVIÇO — VAI SER ENVIADA AO MÓVEL</div>
          <input value={titulo} onChange={e => setTitulo(e.target.value)} placeholder="Título — ex: OS 047/2026 — Operação STOP" className="form-input" style={{ marginBottom: 8 }}/>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input type="number" min="1" max="20" value={paginas} onChange={e => setPaginas(e.target.value)} className="form-input mono" style={{ width: 100 }}/>
            <span style={{ fontSize: 12, color: 'var(--fg-muted)', flex: 1 }}>páginas</span>
            <Button tone="primary" icon="send" onClick={submit}>Enviar</Button>
          </div>
        </div>
      )}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10 }}>
        {ordens.map((o, i) => (
          <div key={o.id} style={{ padding: '12px 16px', borderTop: i ? '1px solid var(--border)' : 'none', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 36, height: 44, background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--danger-deep)' }}>PDF</div>
              <div className="t-mono" style={{ fontSize: 9 }}>{o.paginas}p</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, display: 'flex', gap: 6, alignItems: 'center' }}>
                {o.titulo}
                {o.novo && <Badge tone="danger" size="sm">NOVA</Badge>}
              </div>
              <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{o.autor} · {o.data} · Lido por {(o.lidoPor || []).length} militares</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ViaturasView = () => {
  const { useStore } = window.SentinelaStore;
  const viaturas = useStore(s => s.viaturas);
  const militares = useStore(s => s.militares);
  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: 22 }}>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead><tr style={{ background: 'var(--surface-2)' }}>
            {['Matrícula','Indicativo','Marca/modelo','KM','Combustível','Estado','Militares'].map(h => (
              <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid var(--border)' }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {viaturas.map(v => (
              <tr key={v.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '10px 14px' }}><Plate value={v.matricula} size="sm"/></td>
                <td className="t-mono" style={{ padding: '10px 14px', fontWeight: 600 }}>{v.indicativo}</td>
                <td style={{ padding: '10px 14px' }}>{v.marca} {v.modelo}</td>
                <td className="t-mono" style={{ padding: '10px 14px' }}>{v.km.toLocaleString('pt-PT')}</td>
                <td className="t-mono" style={{ padding: '10px 14px' }}>{v.combustivel}%</td>
                <td style={{ padding: '10px 14px' }}>
                  <Badge tone={v.estado === 'patrulha' ? 'warning' : v.estado === 'disponivel' ? 'success' : 'neutral'} size="sm">
                    {v.estado === 'patrulha' ? 'Em patrulha' : v.estado === 'disponivel' ? 'Disponível' : 'Manutenção'}
                  </Badge>
                </td>
                <td style={{ padding: '10px 14px', fontSize: 11, color: 'var(--fg-muted)' }}>
                  {(v.militares || []).map(id => militares.find(m => m.id === id)?.nome.split(' ').slice(-1)[0]).join(' / ') || '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const MilitaresView = () => {
  const { useStore } = window.SentinelaStore;
  const militares = useStore(s => s.militares);
  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: 22 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        {militares.map(m => (
          <div key={m.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
            <Avatar name={m.nome} size={42}/>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 13 }}>{m.postoAbrev} {m.nome}</div>
              <div className="t-mono" style={{ fontSize: 11, color: 'var(--fg-muted)' }}>NIM {m.nim} · {m.indicativo}</div>
              <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{m.secao}</div>
            </div>
            <StatusDot tone={m.estado === 'patrulha' ? 'warning' : m.estado === 'servico' ? 'success' : 'muted'}/>
          </div>
        ))}
      </div>
    </div>
  );
};

const PatrulhasView = () => {
  const { useStore } = window.SentinelaStore;
  const patrulhas = useStore(s => s.patrulhasHistorico);
  const viaturas = useStore(s => s.viaturas);
  const militares = useStore(s => s.militares);
  const [rdsId, setRdsId] = React.useState(null);
  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: 22 }}>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead><tr style={{ background: 'var(--surface-2)' }}>
            {['Indicativo','Viatura','Militares','KM (i/f)','Comb. (i/f)','Aberta','Estado',''].map(h => (
              <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid var(--border)' }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {patrulhas.map(p => {
              const v = viaturas.find(x => x.id === p.viaturaId);
              return (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td className="t-mono" style={{ padding: '10px 14px', fontWeight: 700 }}>{p.indicativo}</td>
                  <td style={{ padding: '10px 14px' }}><Plate value={v?.matricula || '—'} size="sm"/></td>
                  <td style={{ padding: '10px 14px', fontSize: 12 }}>
                    {p.militares.map(id => militares.find(m => m.id === id)?.nome.split(' ').slice(-1)[0]).join(' / ')}
                  </td>
                  <td className="t-mono" style={{ padding: '10px 14px', fontSize: 11 }}>{p.kmInicial.toLocaleString('pt-PT')} / {p.kmFinal ? p.kmFinal.toLocaleString('pt-PT') : '—'}</td>
                  <td className="t-mono" style={{ padding: '10px 14px', fontSize: 11 }}>{p.combustivelInicial}% / {p.combustivelFinal != null ? p.combustivelFinal + '%' : '—'}</td>
                  <td className="t-mono" style={{ padding: '10px 14px', fontSize: 11 }}>{new Date(p.abertaEm).toLocaleString('pt-PT')}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <Badge tone={p.fechadaEm ? 'neutral' : 'success'} size="sm">{p.fechadaEm ? 'Fechada' : 'Ativa'}</Badge>
                  </td>
                  <td style={{ padding: '10px 14px', textAlign: 'right' }}>
                    <button onClick={() => setRdsId(p.id)} style={{
                      background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 6,
                      padding: '5px 10px', fontSize: 11, fontWeight: 600, color: 'var(--fg)', cursor: 'pointer',
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                    }}>
                      <Icon name="file-text" size={12}/> RDS
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {rdsId && <PatrulhaRDSModal patrulhaId={rdsId} onClose={() => setRdsId(null)}/>}
    </div>
  );
};

const EscalasView = () => {
  const D = window.SENTINELA_DATA;
  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: 22 }}>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead><tr style={{ background: 'var(--surface-2)' }}>
            <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid var(--border)' }}>Militar</th>
            {D.escala.dias.map(d => (
              <th key={d} style={{ padding: '10px 8px', textAlign: 'center', fontSize: 11, fontWeight: 600, color: 'var(--fg-muted)', textTransform: 'uppercase', borderBottom: '1px solid var(--border)' }}>{d}</th>
            ))}
          </tr></thead>
          <tbody>
            {D.escala.linhas.map(l => (
              <tr key={l.militar} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '8px 14px', fontWeight: 600 }}>{l.militar}</td>
                {l.turnos.map((t, i) => (
                  <td key={i} className="t-mono" style={{ padding: '8px', textAlign: 'center', fontSize: 11, fontWeight: 600,
                      background: t === 'FOLGA' ? 'var(--surface-2)' : t === '20-08' ? 'rgba(46,92,138,0.10)' : 'rgba(31,77,58,0.08)',
                      color: t === 'FOLGA' ? 'var(--fg-soft)' : t === '20-08' ? 'var(--info-deep)' : 'var(--brand-green)' }}>{t}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ChatView = () => {
  const { useStore, actions } = window.SentinelaStore;
  const chats = useStore(s => s.chats);
  const militares = useStore(s => s.militares);
  const [active, setActive] = React.useState('c1');
  const [texto, setTexto] = React.useState('');
  const chat = chats[active];

  const labelDe = (id) => {
    if (id === 'sistema') return 'Sistema';
    if (id === 'm_costa') return 'Sarg. Costa (tu)';
    const m = militares.find(x => x.id === id);
    return m ? `${m.postoAbrev} ${m.nome.split(' ').slice(-1)[0]}` : id;
  };

  const enviar = () => {
    if (!texto.trim()) return;
    // PC sempre envia como Sarg. Costa (cmdt)
    const prevId = window.SentinelaStore.getState().militarLogadoId;
    window.SentinelaStore.setState({ militarLogadoId: 'm_costa' });
    actions.enviarMensagem(active, texto.trim());
    if (prevId) window.SentinelaStore.setState({ militarLogadoId: prevId });
    setTexto('');
  };

  return (
    <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
      <div style={{ width: 260, background: 'var(--surface)', borderRight: '1px solid var(--border)', overflowY: 'auto' }}>
        {Object.values(chats).map(c => {
          const last = c.mensagens[c.mensagens.length - 1];
          return (
            <button key={c.id} onClick={() => setActive(c.id)} style={{
              width: '100%', background: active === c.id ? 'var(--surface-2)' : 'transparent',
              border: 'none', borderBottom: '1px solid var(--border)',
              borderLeft: '3px solid ' + (active === c.id ? 'var(--brand-green)' : 'transparent'),
              padding: '12px 14px', textAlign: 'left', cursor: 'pointer',
            }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{c.nome}</div>
              <div style={{ fontSize: 11, color: 'var(--fg-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: 2 }}>
                {last ? last.texto : '—'}
              </div>
            </button>
          );
        })}
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
        <div style={{ padding: '14px 18px', background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14 }}>{chat?.nome}</div>
          <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{chat?.mensagens.length} mensagens</div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {chat?.mensagens.map((m, i) => {
            const proprio = m.de === 'm_costa';
            return (
              <div key={i} style={{ display: 'flex', justifyContent: proprio ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '70%', background: proprio ? 'var(--brand-green)' : 'var(--surface)',
                  color: proprio ? '#FFF' : 'var(--fg)', border: proprio ? 'none' : '1px solid var(--border)',
                  borderRadius: 10, padding: '8px 12px',
                }}>
                  {!proprio && <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--brand-green-deep)', marginBottom: 2 }}>{labelDe(m.de)}</div>}
                  <div style={{ fontSize: 13 }}>{m.texto}</div>
                  <div className="t-mono" style={{ fontSize: 10, opacity: 0.7, textAlign: 'right', marginTop: 2 }}>{m.hora}</div>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ padding: 12, background: 'var(--surface)', borderTop: '1px solid var(--border)', display: 'flex', gap: 8 }}>
          <input value={texto} onChange={e => setTexto(e.target.value)} onKeyDown={e => e.key === 'Enter' && enviar()} placeholder="Mensagem… (envia para o móvel)" className="form-input" style={{ flex: 1 }}/>
          <Button tone="primary" icon="send" onClick={enviar}>Enviar</Button>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { OSView, ViaturasView, MilitaresView, PatrulhasView, EscalasView, ChatView });
