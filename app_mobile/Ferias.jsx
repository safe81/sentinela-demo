/* Sentinela Mobile — Marcação de férias por ordem de antiguidade */

const FeriasScreen = ({ onBack }) => {
  const { useStore, actions, ordemAntiguidade } = window.SentinelaStore;
  const meuId = useStore(s => s.militarLogadoId);
  const ferias = useStore(s => s.ferias);
  const militares = useStore(s => s.militares);

  const eu = militares.find(m => m.id === meuId);
  const fila = ordemAntiguidade(militares);
  const minhaPosicao = fila.findIndex(m => m.id === meuId) + 1;
  const meusTurnoConcluido = ferias.concluidos.includes(meuId);
  const meuTurnoAtivo = ferias.turnoMilitarId === meuId;
  const meusPeriodos = ferias.periodos.filter(p => p.militarId === meuId);
  const diasUsados = meusPeriodos.reduce((s, p) => s + p.dias, 0);
  const diasTotais = eu ? eu.diasFerias : 0;
  const diasRestantes = diasTotais - diasUsados;
  const turnoAtualMilitar = militares.find(m => m.id === ferias.turnoMilitarId);

  const [inicio, setInicio] = React.useState('');
  const [fim, setFim] = React.useState('');
  const [erro, setErro] = React.useState('');
  const [concluido, setConcluido] = React.useState(false);

  const formatDate = d => {
    if (!d) return '—';
    const [y, m, day] = d.split('-');
    return `${day}/${m}/${y}`;
  };

  const adicionarPeriodo = () => {
    setErro('');
    if (!inicio || !fim) { setErro('Escolhe data de início e fim.'); return; }
    if (new Date(fim) < new Date(inicio)) { setErro('A data de fim não pode ser anterior ao início.'); return; }
    const dias = Math.round((new Date(fim) - new Date(inicio)) / 86400000) + 1;
    if (diasUsados + dias > diasTotais) { setErro(`Excede os ${diasTotais} dias disponíveis (${diasRestantes} restantes).`); return; }
    actions.adicionarPeriodoFerias({ militarId: meuId, inicio, fim });
    setInicio('');
    setFim('');
  };

  const concluirMarcacao = () => {
    if (meusPeriodos.length === 0) { setErro('Adiciona pelo menos um período antes de concluir.'); return; }
    actions.concluirMarcacaoFerias(meuId);
    setConcluido(true);
  };

  const todasConcluidas = ferias.turnoMilitarId === null && ferias.concluidos.length > 0;
  const quantosEmFrente = fila.slice(0, minhaPosicao - 1).filter(m => !ferias.concluidos.includes(m.id)).length;

  const inputStyle = {
    width: '100%', padding: '9px 10px', background: 'var(--bg)',
    border: '1px solid var(--border)', borderRadius: 6, fontSize: 13,
    color: 'var(--fg)', boxSizing: 'border-box', fontFamily: 'var(--font-sans)',
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ height: 56, background: 'var(--brand-green-deep)', color: '#FFF', display: 'flex', alignItems: 'center', padding: '0 14px', gap: 12, flexShrink: 0 }}>
        <button onClick={onBack} style={{ background: 'transparent', border: 'none', color: '#FFF', cursor: 'pointer', padding: 4 }}>
          <Icon name="arrow-left" size={20}/>
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16 }}>Férias {ferias.ano}</div>
          <div style={{ fontSize: 11, color: '#C9A24B' }}>Marcação por antiguidade</div>
        </div>
        <div style={{ fontSize: 11, textAlign: 'right' }}>
          <div style={{ fontWeight: 700 }}>{ferias.concluidos.length}/{militares.length}</div>
          <div style={{ color: '#C9A24B' }}>concluídos</div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 14, background: 'var(--bg)' }}>

        {/* Status banner */}
        {todasConcluidas ? (
          <div style={{ background: 'var(--success)', color: '#FFF', borderRadius: 10, padding: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Icon name="check-circle" size={24}/>
            <div>
              <div style={{ fontWeight: 700 }}>Marcação concluída</div>
              <div style={{ fontSize: 11, opacity: 0.9 }}>Todos os militares marcaram as férias de {ferias.ano}.</div>
            </div>
          </div>
        ) : meusTurnoConcluido ? (
          <div style={{ background: 'rgba(54,128,68,0.10)', border: '1px solid var(--success)', borderRadius: 10, padding: 14, display: 'flex', alignItems: 'center', gap: 10, color: 'var(--success)' }}>
            <Icon name="check-circle" size={20}/>
            <div>
              <div style={{ fontWeight: 700 }}>Marcação concluída</div>
              <div style={{ fontSize: 11 }}>
                {meusPeriodos.length} período{meusPeriodos.length !== 1 ? 's' : ''} · {diasUsados} dias marcados
              </div>
            </div>
          </div>
        ) : meuTurnoAtivo ? (
          <div style={{ background: 'linear-gradient(135deg, #b8912a 0%, var(--brand-gold) 100%)', color: '#FFF', borderRadius: 10, padding: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, background: 'rgba(255,255,255,0.20)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon name="calendar" size={22}/>
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>É a sua vez!</div>
              <div style={{ fontSize: 11, opacity: 0.9 }}>Posição {minhaPosicao}ª · até 5 períodos · {diasTotais} dias disponíveis</div>
            </div>
          </div>
        ) : (
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 14 }}>
            <div className="t-overline" style={{ marginBottom: 6 }}>A AGUARDAR</div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>
              {quantosEmFrente} militar{quantosEmFrente !== 1 ? 'es' : ''} à sua frente
            </div>
            <div style={{ fontSize: 11, color: 'var(--fg-muted)', marginTop: 4 }}>
              A marcar agora: {turnoAtualMilitar ? `${turnoAtualMilitar.postoAbrev} ${turnoAtualMilitar.nome}` : '—'} · A sua posição: {minhaPosicao}ª
            </div>
          </div>
        )}

        {/* Days summary bar */}
        {(meuTurnoAtivo || meusTurnoConcluido) && (
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 12 }}>
              <span style={{ fontWeight: 600 }}>{diasUsados} dias marcados</span>
              <span style={{ color: 'var(--fg-muted)' }}>{diasRestantes} restantes de {diasTotais}</span>
            </div>
            <div style={{ height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${Math.min((diasUsados / diasTotais) * 100, 100)}%`, background: 'var(--brand-green)', borderRadius: 3, transition: 'width 0.4s' }}/>
            </div>
          </div>
        )}

        {/* My periods */}
        {meusPeriodos.length > 0 && (
          <div>
            <div className="t-overline" style={{ marginBottom: 8 }}>OS MEUS PERÍODOS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {meusPeriodos.map((p, i) => (
                <div key={p.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 6, background: 'rgba(31,77,58,0.08)', color: 'var(--brand-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>{i + 1}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>{formatDate(p.inicio)} – {formatDate(p.fim)}</div>
                    <div style={{ fontSize: 10, color: 'var(--fg-muted)' }}>{p.dias} dia{p.dias !== 1 ? 's' : ''}</div>
                  </div>
                  {!meusTurnoConcluido && (
                    <button onClick={() => actions.removerPeriodoFerias(p.id)} style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: 4 }}>
                      <Icon name="trash-2" size={14}/>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add period form */}
        {meuTurnoAtivo && !meusTurnoConcluido && (
          <div>
            <div className="t-overline" style={{ marginBottom: 8 }}>NOVO PERÍODO ({meusPeriodos.length}/5)</div>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--fg-muted)', display: 'block', marginBottom: 4 }}>INÍCIO</label>
                  <input type="date" value={inicio} onChange={e => { setInicio(e.target.value); setErro(''); }}
                    min="2026-01-01" max="2026-12-31" style={inputStyle}/>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--fg-muted)', display: 'block', marginBottom: 4 }}>FIM</label>
                  <input type="date" value={fim} onChange={e => { setFim(e.target.value); setErro(''); }}
                    min={inicio || '2026-01-01'} max="2026-12-31" style={inputStyle}/>
                </div>
              </div>
              {erro && (
                <div style={{ fontSize: 11, color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Icon name="alert-circle" size={13}/> {erro}
                </div>
              )}
              <button onClick={adicionarPeriodo} disabled={meusPeriodos.length >= 5}
                style={{ background: meusPeriodos.length >= 5 ? 'var(--border)' : 'var(--brand-green)', color: '#FFF', border: 'none', borderRadius: 8, padding: 11, fontWeight: 700, fontSize: 13, cursor: meusPeriodos.length >= 5 ? 'not-allowed' : 'pointer' }}>
                {meusPeriodos.length >= 5 ? 'Máximo atingido (5/5)' : '+ Adicionar período'}
              </button>
            </div>
          </div>
        )}

        {/* Conclude button */}
        {meuTurnoAtivo && !meusTurnoConcluido && (
          <button onClick={concluirMarcacao} style={{
            width: '100%', background: meusPeriodos.length > 0 ? 'var(--brand-gold)' : 'var(--surface)',
            color: meusPeriodos.length > 0 ? '#FFF' : 'var(--fg-muted)',
            border: meusPeriodos.length > 0 ? 'none' : '1px solid var(--border)',
            borderRadius: 10, padding: '13px 14px', fontWeight: 700, fontSize: 14, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            <Icon name="check-circle" size={18}/>
            Concluir marcação e passar ao seguinte
          </button>
        )}

        {/* Queue overview */}
        <div>
          <div className="t-overline" style={{ marginBottom: 8 }}>ORDEM DE ANTIGUIDADE</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {fila.map((m, i) => {
              const concluido = ferias.concluidos.includes(m.id);
              const ativo = ferias.turnoMilitarId === m.id;
              const sou = m.id === meuId;
              return (
                <div key={m.id} style={{
                  background: sou ? 'rgba(201,162,75,0.07)' : 'var(--surface)',
                  border: `1px solid ${sou ? 'var(--brand-gold)' : ativo ? 'var(--brand-green)' : 'var(--border)'}`,
                  borderRadius: 8, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <span className="t-mono" style={{ fontSize: 10, color: 'var(--fg-muted)', width: 20, textAlign: 'right' }}>{i + 1}.</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ fontSize: 12, fontWeight: sou ? 700 : 600, color: sou ? 'var(--brand-gold)' : 'var(--fg)' }}>
                      {m.postoAbrev} {m.nome}
                    </span>
                  </div>
                  {concluido
                    ? <Icon name="check-circle" size={14} style={{ color: 'var(--success)', flexShrink: 0 }}/>
                    : ativo
                    ? <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--brand-green)', boxShadow: '0 0 6px var(--brand-green)', flexShrink: 0 }}/>
                    : <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--border)', flexShrink: 0 }}/>
                  }
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

window.FeriasScreen = FeriasScreen;
