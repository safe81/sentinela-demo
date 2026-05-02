/* Sentinela Mobile — Ordens de Serviço */

const OrdensServicoScreen = ({ onBack, store }) => {
  const { useStore, actions } = window.SentinelaStore;
  const ordens = useStore(s => s.ordens);
  const me = useStore(s => s.militares.find(x => x.id === s.militarLogadoId));

  const [tabAtiva, setTabAtiva] = React.useState('recentes'); // 'recentes' | 'arquivo'
  const [filtro, setFiltro] = React.useState('');
  const [filtroLidas, setFiltroLidas] = React.useState('todas'); // 'todas' | 'lidas' | 'nao_lidas'
  const [filtroPrioritario, setFiltroPrioritario] = React.useState(false);
  const [ordemAberta, setOrdemAberta] = React.useState(null);

  const hoje = new Date().toLocaleDateString('pt-PT', { weekday: 'short', day: '2-digit', month: 'short' }).toUpperCase();

  const ordensVisiveis = ordens.filter(o => {
    const meId = me?.id;
    const lida = o.lidoPor?.includes(meId);
    if (filtroLidas === 'lidas' && !lida) return false;
    if (filtroLidas === 'nao_lidas' && lida) return false;
    if (filtroPrioritario && o.prioridade !== 'alta') return false;
    const t = filtro.toLowerCase();
    if (t && !o.titulo?.toLowerCase().includes(t) && !o.ref?.toLowerCase().includes(t)) return false;
    return tabAtiva === 'arquivo' ? o.arquivado : !o.arquivado;
  });

  const totalMes = ordens.length;
  const pendentes = ordens.filter(o => !o.lidoPor?.includes(me?.id)).length;
  const lidasCount = totalMes - pendentes;

  if (ordemAberta) {
    const lida = ordemAberta.lidoPor?.includes(me?.id);
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
        <div style={{ height: 52, background: 'var(--brand-green-deep)', color: '#FFF', display: 'flex', alignItems: 'center', padding: '0 12px', gap: 10 }}>
          <button onClick={() => setOrdemAberta(null)} style={{ background: 'transparent', border: 'none', color: '#FFF', display: 'flex', cursor: 'pointer', padding: 4 }}>
            <Icon name="arrow-left" size={20}/>
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 13, fontFamily: 'var(--font-display)' }}>{ordemAberta.titulo}</div>
            <div style={{ fontSize: 10, color: '#C9A24B' }}>{ordemAberta.ref || `OS-${ordemAberta.id}`}</div>
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              {ordemAberta.prioridade === 'alta' && (
                <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--danger)', background: 'var(--danger-soft)', borderRadius: 4, padding: '2px 7px' }}>PRIORITÁRIO</span>
              )}
              <span className="t-mono" style={{ fontSize: 10, color: 'var(--fg-muted)' }}>{ordemAberta.data}</span>
            </div>
            <div style={{ fontSize: 13, lineHeight: '20px', color: 'var(--fg)' }}>
              {ordemAberta.conteudo || ordemAberta.texto || 'Sem conteúdo disponível.'}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{
              flex: 1, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8,
              padding: '10px 0', fontSize: 12, fontWeight: 600, cursor: 'pointer', color: 'var(--fg)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}>
              <Icon name="file-text" size={15}/>
              ABRIR PDF
            </button>
            {!lida && (
              <button onClick={() => { actions.lerOrdem?.(ordemAberta.id); setOrdemAberta(null); }} style={{
                flex: 1, background: 'var(--brand-green)', color: '#FFF', border: 'none', borderRadius: 8,
                padding: '10px 0', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}>
                <Icon name="check" size={15}/>
                MARCAR LIDA
              </button>
            )}
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
          <div style={{ fontWeight: 600, fontSize: 14, fontFamily: 'var(--font-display)' }}>Ordens de Serviço</div>
          <div style={{ fontSize: 10, color: '#C9A24B' }}>Gestão e consulta de ordens operacionais</div>
        </div>
        <Icon name="file-text" size={18}/>
      </div>

      {/* Stats strip */}
      <div style={{ background: 'var(--brand-green)', color: '#FFF', padding: '10px 14px', display: 'flex', gap: 0, flexShrink: 0 }}>
        {[
          [totalMes, 'Ordens Este Mês'],
          [pendentes, 'Pendentes'],
          [lidasCount, 'Lidas'],
        ].map(([n, l], i) => (
          <div key={l} style={{ flex: 1, textAlign: 'center', borderLeft: i ? '1px solid rgba(255,255,255,0.2)' : 'none' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18 }}>{String(n).padStart(2, '0')}</div>
            <div style={{ fontSize: 10, opacity: 0.8 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', flexShrink: 0 }}>
        {[['recentes', 'Recentes'], ['arquivo', 'Arquivo']].map(([id, label]) => (
          <button key={id} onClick={() => setTabAtiva(id)} style={{
            flex: 1, background: 'transparent', border: 'none', padding: '11px 0',
            fontWeight: tabAtiva === id ? 700 : 500, fontSize: 13, cursor: 'pointer',
            color: tabAtiva === id ? 'var(--brand-green)' : 'var(--fg-muted)',
            borderBottom: `2px solid ${tabAtiva === id ? 'var(--brand-green)' : 'transparent'}`,
          }}>{label}</button>
        ))}
      </div>

      {/* Filtros */}
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '8px 12px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--surface-2)', borderRadius: 999, padding: '7px 12px' }}>
          <Icon name="search" size={15} style={{ color: 'var(--fg-soft)' }}/>
          <input value={filtro} onChange={e => setFiltro(e.target.value)} placeholder="Pesquisar ordens…" style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 13, color: 'var(--fg)' }}/>
        </div>
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto' }}>
          {[['todas', 'Todas'], ['nao_lidas', 'Não Lidas'], ['lidas', 'Lidas']].map(([id, label]) => (
            <button key={id} onClick={() => setFiltroLidas(id)} style={{
              background: filtroLidas === id ? 'var(--brand-green)' : 'var(--surface-2)',
              color: filtroLidas === id ? '#FFF' : 'var(--fg)',
              border: 'none', borderRadius: 999, padding: '5px 12px', fontSize: 11, fontWeight: 600,
              cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
            }}>{label}</button>
          ))}
          <button onClick={() => setFiltroPrioritario(p => !p)} style={{
            background: filtroPrioritario ? 'var(--danger)' : 'var(--surface-2)',
            color: filtroPrioritario ? '#FFF' : 'var(--fg)',
            border: 'none', borderRadius: 999, padding: '5px 12px', fontSize: 11, fontWeight: 600,
            cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
            display: 'flex', alignItems: 'center', gap: 4,
          }}>
            <Icon name="alert-circle" size={12}/>
            Prioritário
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 10px', background: 'var(--surface-2)', borderRadius: 999, fontSize: 11, color: 'var(--fg-muted)', flexShrink: 0 }}>
            <Icon name="calendar" size={12}/>
            {hoje}
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', background: 'var(--bg)' }}>
        {/* Ordem em destaque */}
        {tabAtiva === 'recentes' && ordens[0] && (
          <div style={{ margin: '12px 12px 0' }}>
            <div className="t-overline" style={{ marginBottom: 6 }}>EM DESTAQUE</div>
            <button onClick={() => setOrdemAberta(ordens[0])} style={{
              width: '100%', background: 'var(--surface)', border: '1px solid var(--border)',
              borderLeft: '4px solid var(--brand-green)', borderRadius: 10, padding: 14,
              textAlign: 'left', cursor: 'pointer',
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 6 }}>{ordens[0].titulo}</div>
              <div style={{ fontSize: 12, color: 'var(--fg-muted)', lineHeight: '16px', marginBottom: 10 }}>
                {ordens[0].texto?.slice(0, 100) ?? ''}…
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'var(--surface-2)', borderRadius: 6, padding: '4px 8px', fontSize: 11, color: 'var(--fg)' }}>
                  <Icon name="file-text" size={12}/>
                  ABRIR PDF
                </div>
                <span className="t-mono" style={{ fontSize: 10, color: 'var(--fg-muted)' }}>{ordens[0].ref || `OS-${ordens[0].id}`}</span>
              </div>
            </button>
          </div>
        )}

        {/* Lista */}
        <div style={{ padding: '12px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {ordensVisiveis.slice(tabAtiva === 'recentes' ? 1 : 0).map(o => {
            const lida = o.lidoPor?.includes(me?.id);
            return (
              <button key={o.id} onClick={() => setOrdemAberta(o)} style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderLeft: `3px solid ${o.prioridade === 'alta' ? 'var(--danger)' : 'var(--border)'}`,
                borderRadius: 10, padding: '11px 12px',
                display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', textAlign: 'left', width: '100%',
              }}>
                <div style={{
                  width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                  background: lida ? 'var(--fg-soft)' : 'var(--danger)',
                }}/>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: lida ? 500 : 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{o.titulo}</div>
                  <div style={{ fontSize: 11, color: 'var(--fg-muted)', marginTop: 1 }} className="t-mono">{o.data}</div>
                </div>
                {!lida && (
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#FFF', background: 'var(--danger)', borderRadius: 4, padding: '2px 6px', flexShrink: 0 }}>NOVO</span>
                )}
                <Icon name="chevron-right" size={14} style={{ color: 'var(--fg-soft)', flexShrink: 0 }}/>
              </button>
            );
          })}
          {ordensVisiveis.length === 0 && (
            <div style={{ padding: '30px 0', textAlign: 'center', color: 'var(--fg-muted)', fontSize: 13 }}>
              Sem ordens de serviço disponíveis
            </div>
          )}
        </div>

        {/* Perfil utilizador */}
        {me && (
          <div style={{ margin: '0 12px 20px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <Avatar name={me.nome} size={42}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{me.postoAbrev} {me.nome}</div>
              <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{me.secao}</div>
              <div className="t-mono" style={{ fontSize: 10, color: 'var(--fg-soft)' }}>NIM {me.nim}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

window.OrdensServicoScreen = OrdensServicoScreen;
