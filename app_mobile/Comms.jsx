/* Sentinela Mobile — Chat, Lista telefónica, Notificações, Perfil, Escalas, Briefing */

const ChatListScreen = ({ onOpen, onBack }) => {
  const { useStore } = window.SentinelaStore;
  const chats = useStore(s => s.chats);
  const D = window.SENTINELA_DATA;
  const meta = Object.fromEntries(D.chatGrupos.map(g => [g.id, g]));

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: 52, background: 'var(--brand-green-deep)', color: '#FFF', display: 'flex', alignItems: 'center', padding: '0 12px', gap: 10 }}>
        <button onClick={onBack} style={{ background: 'transparent', border: 'none', color: '#FFF', display: 'flex', cursor: 'pointer' }}><Icon name="arrow-left" size={20}/></button>
        <div style={{ flex: 1, fontWeight: 600, fontSize: 14, fontFamily: 'var(--font-display)' }}>Mensagens</div>
        <Icon name="search" size={18}/>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', background: 'var(--bg)' }}>
        {Object.values(chats).map(c => {
          const m = meta[c.id] || {};
          const last = c.mensagens[c.mensagens.length - 1];
          const naoLidas = m.naoLidas || 0;
          return (
            <button key={c.id} onClick={() => onOpen(c.id)} style={{
              width: '100%', background: 'var(--surface)', border: 'none', borderBottom: '1px solid var(--border)',
              padding: '12px 14px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                background: c.tipo === 'posto' ? 'var(--brand-green)' : c.tipo === 'patrulha' ? 'var(--info)' : c.tipo === 'comando' ? 'var(--brand-gold)' : 'var(--fg-soft)',
                color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Icon name={c.tipo === 'patrulha' ? 'shield' : c.tipo === 'comando' ? 'star' : 'users'} size={18}/>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.nome}</span>
                  <span className="t-mono" style={{ fontSize: 10, color: 'var(--fg-muted)' }}>{m.hora || (last ? last.hora : '')}</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--fg-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: 2 }}>
                  {last ? `${last.texto}` : '—'}
                </div>
              </div>
              {naoLidas > 0 && (
                <span style={{ background: 'var(--danger)', color: '#FFF', fontSize: 11, fontWeight: 700, borderRadius: 999, padding: '2px 7px', minWidth: 22, textAlign: 'center' }}>{naoLidas}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const ChatThreadScreen = ({ chatId, onBack }) => {
  const { useStore, actions } = window.SentinelaStore;
  const chat = useStore(s => s.chats[chatId]);
  const me = useStore(s => s.militarLogadoId);
  const militares = useStore(s => s.militares);
  const [texto, setTexto] = React.useState('');
  const scrollRef = React.useRef();

  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [chat?.mensagens.length]);

  const labelDe = (id) => {
    if (id === 'sistema') return 'Sistema';
    const m = militares.find(x => x.id === id);
    return m ? `${m.postoAbrev} ${m.nome.split(' ').slice(-1)[0]}` : id;
  };
  const indDe = (id) => {
    const m = militares.find(x => x.id === id);
    return m ? m.indicativo : '';
  };

  const enviar = () => {
    if (!texto.trim()) return;
    actions.enviarMensagem(chatId, texto.trim());
    setTexto('');
  };

  if (!chat) return null;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--surface-2)' }}>
      <div style={{ height: 52, background: 'var(--brand-green-deep)', color: '#FFF', display: 'flex', alignItems: 'center', padding: '0 12px', gap: 10 }}>
        <button onClick={onBack} style={{ background: 'transparent', border: 'none', color: '#FFF', display: 'flex', cursor: 'pointer' }}><Icon name="arrow-left" size={20}/></button>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: 13, fontFamily: 'var(--font-display)' }}>{chat.nome}</div>
          <div style={{ fontSize: 10, color: '#C9A24B', fontWeight: 600 }}>{chat.mensagens.length} mensagens</div>
        </div>
        <Icon name="phone" size={18}/>
      </div>
      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '12px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {chat.mensagens.map((m, i) => {
          const proprio = m.de === me;
          return (
            <div key={i} style={{ display: 'flex', justifyContent: proprio ? 'flex-end' : 'flex-start' }}>
              <div style={{
                maxWidth: '78%', background: proprio ? 'var(--brand-green)' : 'var(--surface)',
                color: proprio ? '#FFF' : 'var(--fg)',
                border: proprio ? 'none' : '1px solid var(--border)',
                borderRadius: 10, padding: '8px 12px',
                borderTopRightRadius: proprio ? 2 : 10, borderTopLeftRadius: proprio ? 10 : 2,
              }}>
                {!proprio && (
                  <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--brand-green-deep)', marginBottom: 2 }}>
                    {labelDe(m.de)} {indDe(m.de) && <span style={{ color: 'var(--fg-muted)', fontFamily: 'var(--font-mono)', fontWeight: 500 }}>· {indDe(m.de)}</span>}
                  </div>
                )}
                <div style={{ fontSize: 13, lineHeight: '18px' }}>{m.texto}</div>
                <div className="t-mono" style={{ fontSize: 10, opacity: 0.7, textAlign: 'right', marginTop: 2 }}>{m.hora}</div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ padding: 8, background: 'var(--surface)', borderTop: '1px solid var(--border)', display: 'flex', gap: 8, alignItems: 'flex-end' }}>
        <textarea value={texto} onChange={e => setTexto(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); enviar(); } }}
          placeholder="Mensagem…" rows={1} style={{
            flex: 1, border: '1px solid var(--border)', borderRadius: 18, padding: '8px 12px',
            fontSize: 13, fontFamily: 'inherit', resize: 'none', outline: 'none', background: 'var(--bg)', color: 'var(--fg)', maxHeight: 80,
          }}/>
        <MicButton onResult={t => setTexto(prev => prev ? prev + ' ' + t : t)} size="sm"/>
        <button onClick={enviar} style={{
          background: 'var(--brand-green)', color: '#FFF', border: 'none', borderRadius: '50%',
          width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        }}>
          <Icon name="send" size={16}/>
        </button>
      </div>
    </div>
  );
};

const ListaTelefonicaScreen = ({ onBack }) => {
  const { useStore } = window.SentinelaStore;
  const militares = useStore(s => s.militares);
  const [filtro, setFiltro] = React.useState('');
  const [aberto, setAberto] = React.useState(null);

  const visiveis = militares.filter(m =>
    m.nome.toLowerCase().includes(filtro.toLowerCase()) ||
    m.nim.includes(filtro) ||
    m.secao.toLowerCase().includes(filtro.toLowerCase())
  );

  if (aberto) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
        <div style={{ height: 52, background: 'var(--brand-green-deep)', color: '#FFF', display: 'flex', alignItems: 'center', padding: '0 12px', gap: 10 }}>
          <button onClick={() => setAberto(null)} style={{ background: 'transparent', border: 'none', color: '#FFF', display: 'flex', cursor: 'pointer' }}><Icon name="arrow-left" size={20}/></button>
          <div style={{ flex: 1, fontWeight: 600, fontSize: 14, fontFamily: 'var(--font-display)' }}>Ficha do militar</div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 16, display: 'flex', alignItems: 'center', gap: 14 }}>
            <Avatar name={aberto.nome} size={64}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17 }}>{aberto.postoAbrev} {aberto.nome}</div>
              <div className="t-mono" style={{ fontSize: 11, color: 'var(--fg-muted)' }}>NIM {aberto.nim}</div>
              <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 2 }}>{aberto.secao}</div>
            </div>
            <StatusDot tone={aberto.estado === 'patrulha' ? 'warning' : aberto.estado === 'servico' ? 'success' : 'muted'}/>
          </div>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10 }}>
            {[
              ['phone', 'Telemóvel de serviço', '+351 939 ' + aberto.nim.slice(-6)],
              ['radio', 'Indicativo rádio', aberto.indicativo === '—' ? 'Sem patrulha' : aberto.indicativo],
              ['mail', 'Email', aberto.nome.toLowerCase().split(' ').slice(-1)[0] + '@gnr.pt'],
              ['shield', 'Posto', 'Vila Real'],
              ['calendar', 'Próximo turno', 'Hoje 20:00 — 08:00'],
            ].map((row, i) => (
              <div key={i} style={{ padding: '12px 14px', borderTop: i ? '1px solid var(--border)' : 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
                <Icon name={row[0]} size={16} style={{ color: 'var(--brand-green)' }}/>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{row[1]}</div>
                  <div className="t-mono" style={{ fontSize: 13, fontWeight: 600 }}>{row[2]}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <Button tone="primary" icon="phone">Ligar</Button>
            <Button tone="secondary" icon="message-square">Mensagem</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: 52, background: 'var(--brand-green-deep)', color: '#FFF', display: 'flex', alignItems: 'center', padding: '0 12px', gap: 10 }}>
        <button onClick={onBack} style={{ background: 'transparent', border: 'none', color: '#FFF', display: 'flex', cursor: 'pointer' }}><Icon name="arrow-left" size={20}/></button>
        <div style={{ flex: 1, fontWeight: 600, fontSize: 14, fontFamily: 'var(--font-display)' }}>Lista telefónica</div>
      </div>
      <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--surface-2)', borderRadius: 999, padding: '8px 12px' }}>
          <Icon name="search" size={16} style={{ color: 'var(--fg-soft)' }}/>
          <input value={filtro} onChange={e => setFiltro(e.target.value)} placeholder="Pesquisar nome, NIM, secção" style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 13, color: 'var(--fg)' }}/>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {visiveis.map(m => (
          <button key={m.id} onClick={() => setAberto(m)} style={{
            width: '100%', background: 'var(--surface)', border: 'none', borderBottom: '1px solid var(--border)',
            padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', textAlign: 'left',
          }}>
            <Avatar name={m.nome} size={38}/>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{m.postoAbrev} {m.nome}</div>
              <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{m.secao} · NIM {m.nim}</div>
            </div>
            <StatusDot tone={m.estado === 'patrulha' ? 'warning' : m.estado === 'servico' ? 'success' : 'muted'}/>
          </button>
        ))}
      </div>
    </div>
  );
};

const NotificacoesScreen = ({ onBack }) => {
  const { useStore, actions } = window.SentinelaStore;
  const notificacoes = useStore(s => s.notificacoes);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: 52, background: 'var(--brand-green-deep)', color: '#FFF', display: 'flex', alignItems: 'center', padding: '0 12px', gap: 10 }}>
        <button onClick={onBack} style={{ background: 'transparent', border: 'none', color: '#FFF', display: 'flex', cursor: 'pointer' }}><Icon name="arrow-left" size={20}/></button>
        <div style={{ flex: 1, fontWeight: 600, fontSize: 14, fontFamily: 'var(--font-display)' }}>Notificações</div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {notificacoes.map(n => (
          <button key={n.id} onClick={() => actions.marcarNotificacaoLida(n.id)} style={{
            width: '100%', background: n.lida ? 'var(--surface)' : 'rgba(31,77,58,0.05)', border: 'none',
            borderBottom: '1px solid var(--border)',
            borderLeft: `3px solid ${n.lida ? 'transparent' : 'var(--brand-green)'}`,
            padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', textAlign: 'left',
          }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-green)' }}>
              <Icon name={n.tipo === 'os' ? 'file-text' : n.tipo === 'chat' ? 'message-square' : 'bell'} size={16}/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: n.lida ? 500 : 700 }}>{n.texto}</div>
              <div className="t-mono" style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{n.hora}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

const PerfilScreen = ({ onBack }) => {
  const { useStore, actions } = window.SentinelaStore;
  const me = useStore(s => s.militares.find(x => x.id === s.militarLogadoId));
  if (!me) return null;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: 52, background: 'var(--brand-green-deep)', color: '#FFF', display: 'flex', alignItems: 'center', padding: '0 12px', gap: 10 }}>
        <button onClick={onBack} style={{ background: 'transparent', border: 'none', color: '#FFF', display: 'flex', cursor: 'pointer' }}><Icon name="arrow-left" size={20}/></button>
        <div style={{ flex: 1, fontWeight: 600, fontSize: 14, fontFamily: 'var(--font-display)' }}>Perfil</div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', background: 'var(--bg)' }}>
        <div style={{ padding: '20px 14px', background: 'var(--brand-green-deep)', color: '#FFF', textAlign: 'center' }}>
          <Avatar name={me.nome} size={80} style={{ margin: '0 auto 10px', border: '3px solid #C9A24B' }}/>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18 }}>{me.postoAbrev} {me.nome}</div>
          <div className="t-mono" style={{ fontSize: 11, color: '#C9A24B', marginTop: 2 }}>NIM {me.nim} · {me.indicativo}</div>
          <div style={{ fontSize: 12, opacity: 0.85 }}>{me.secao}</div>
        </div>
        <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 12 }}>
            <div className="t-overline" style={{ marginBottom: 8 }}>ESTATÍSTICAS DO MÊS</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {[['18', 'Patrulhas'], ['42', 'Autos'], ['7', 'Ocorrências']].map(([n, l]) => (
                <div key={l} style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, color: 'var(--brand-green)' }}>{n}</div>
                  <div className="t-overline" style={{ fontSize: 9 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10 }}>
            {[['user', 'Editar perfil'],['lock', 'Alterar palavra-passe'],['bell', 'Preferências de notificação'],['help-circle', 'Ajuda e contactos'],['info', 'Sobre o Sentinela']].map(([icon, label], i) => (
              <div key={label} style={{ padding: '12px 14px', borderTop: i ? '1px solid var(--border)' : 'none', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                <Icon name={icon} size={16} style={{ color: 'var(--fg-soft)' }}/>
                <div style={{ flex: 1, fontSize: 13 }}>{label}</div>
                <Icon name="chevron-right" size={14} style={{ color: 'var(--fg-soft)' }}/>
              </div>
            ))}
          </div>
          <Button tone="danger" icon="log-out" onClick={() => actions.logout()} style={{ width: '100%' }}>Terminar sessão</Button>
          <div style={{ textAlign: 'center', fontSize: 10, color: 'var(--fg-muted)', marginTop: 6 }} className="t-mono">Sentinela v2.4.1 · build 2026.04</div>
        </div>
      </div>
    </div>
  );
};

const EscalasScreen = ({ onBack }) => {
  const D = window.SENTINELA_DATA;
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: 52, background: 'var(--brand-green-deep)', color: '#FFF', display: 'flex', alignItems: 'center', padding: '0 12px', gap: 10 }}>
        <button onClick={onBack} style={{ background: 'transparent', border: 'none', color: '#FFF', display: 'flex', cursor: 'pointer' }}><Icon name="arrow-left" size={20}/></button>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: 14, fontFamily: 'var(--font-display)' }}>Escala de serviço</div>
          <div style={{ fontSize: 10, color: '#C9A24B' }}>{D.escala.semana}</div>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 12 }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
            <thead>
              <tr style={{ background: 'var(--surface-2)' }}>
                <th style={{ padding: '8px 10px', textAlign: 'left', fontSize: 10, color: 'var(--fg-muted)', borderBottom: '1px solid var(--border)' }}>Militar</th>
                {D.escala.dias.map(d => <th key={d} style={{ padding: '8px 4px', fontSize: 10, color: 'var(--fg-muted)', borderBottom: '1px solid var(--border)' }}>{d}</th>)}
              </tr>
            </thead>
            <tbody>
              {D.escala.linhas.map(l => (
                <tr key={l.militar} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '6px 10px', fontWeight: 600 }}>{l.militar}</td>
                  {l.turnos.map((t, i) => (
                    <td key={i} className="t-mono" style={{
                      padding: '6px 2px', textAlign: 'center', fontSize: 10, fontWeight: 600,
                      background: t === 'FOLGA' ? 'var(--surface-2)' : t === '20-08' ? 'rgba(46,92,138,0.10)' : 'rgba(31,77,58,0.08)',
                      color: t === 'FOLGA' ? 'var(--fg-soft)' : t === '20-08' ? 'var(--info-deep)' : 'var(--brand-green)',
                    }}>{t}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const BriefingScreen = ({ onBack }) => {
  const D = window.SENTINELA_DATA;
  const { useStore, actions } = window.SentinelaStore;
  const diretivas = useStore(s => s.diretivas);
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: 52, background: 'var(--brand-green-deep)', color: '#FFF', display: 'flex', alignItems: 'center', padding: '0 12px', gap: 10 }}>
        <button onClick={onBack} style={{ background: 'transparent', border: 'none', color: '#FFF', display: 'flex', cursor: 'pointer' }}><Icon name="arrow-left" size={20}/></button>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: 14, fontFamily: 'var(--font-display)' }}>Briefing diário</div>
          <div style={{ fontSize: 10, color: '#C9A24B' }}>{D.briefing.data} · {D.briefing.autor}</div>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderLeft: '4px solid var(--brand-gold)', borderRadius: 8, padding: 12 }}>
          <div className="t-overline" style={{ marginBottom: 8 }}>PONTOS DE BRIEFING</div>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {D.briefing.pontos.map((p, i) => (
              <li key={i} style={{ display: 'flex', gap: 10 }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--brand-gold)' }}>{i+1}.</span>
                <span style={{ fontSize: 13, lineHeight: '18px' }}>{p}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="t-overline">DIRETIVAS PARA ESTA PATRULHA</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {diretivas.map(d => (
            <button key={d.id} onClick={() => actions.toggleDiretiva(d.id)} style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderLeft: `3px solid ${d.prioridade === 'alta' ? 'var(--danger)' : d.prioridade === 'media' ? 'var(--warning)' : 'var(--info)'}`,
              borderRadius: 8, padding: 10, display: 'flex', gap: 10, alignItems: 'flex-start', cursor: 'pointer', textAlign: 'left',
            }}>
              <div style={{
                width: 18, height: 18, borderRadius: 4, border: '2px solid var(--brand-green)',
                background: d.feito ? 'var(--brand-green)' : 'transparent', flexShrink: 0, marginTop: 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {d.feito && <Icon name="check" size={12} style={{ color: '#FFF' }}/>}
              </div>
              <div style={{ fontSize: 12, lineHeight: '17px', textDecoration: d.feito ? 'line-through' : 'none', opacity: d.feito ? 0.6 : 1, flex: 1 }}>{d.texto}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { ChatListScreen, ChatThreadScreen, ListaTelefonicaScreen, NotificacoesScreen, PerfilScreen, EscalasScreen, BriefingScreen });
