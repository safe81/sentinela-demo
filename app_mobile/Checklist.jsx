/* Sentinela Mobile — Checklist de Diretivas Operacionais */

const ChecklistScreen = ({ onBack, store }) => {
  const { useStore, actions } = window.SentinelaStore;
  const diretivas = useStore(s => s.diretivas);
  const D = window.SENTINELA_DATA;

  const concluidas = diretivas.filter(d => d.feito).length;
  const total = diretivas.length;
  const progresso = total > 0 ? Math.round((concluidas / total) * 100) : 0;

  const hoje = new Date();
  const dataFormatada = hoje.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();

  const turno = D?.briefing?.turno || '08:00 – 16:00';
  const autor = D?.briefing?.autor || 'Cmdt. Posto';

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ height: 52, background: 'var(--brand-green-deep)', color: '#FFF', display: 'flex', alignItems: 'center', padding: '0 12px', gap: 10, flexShrink: 0 }}>
        <button onClick={onBack} style={{ background: 'transparent', border: 'none', color: '#FFF', display: 'flex', cursor: 'pointer', padding: 4 }}>
          <Icon name="arrow-left" size={20}/>
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: 14, fontFamily: 'var(--font-display)' }}>Diretivas e Ordens</div>
          <div style={{ fontSize: 10, color: '#C9A24B' }}>Comando de Posto · Turno {turno}</div>
        </div>
        <Icon name="check-square" size={18}/>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', background: 'var(--bg)', display: 'flex', flexDirection: 'column', gap: 0 }}>

        {/* Progress banner */}
        <div style={{ background: 'var(--brand-green-deep)', color: '#FFF', padding: '14px 14px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <Icon name="calendar" size={14} style={{ color: '#C9A24B' }}/>
            <span style={{ fontSize: 12, color: '#C9A24B', fontFamily: 'var(--font-mono)' }}>{dataFormatada}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
            <div style={{ fontSize: 12, opacity: 0.85 }}>Checklist Operacional</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16 }}>{concluidas}/{total} Concluído</div>
          </div>
          {/* Progress bar */}
          <div style={{ height: 6, background: 'rgba(255,255,255,0.15)', borderRadius: 999, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progresso}%`, background: progresso === 100 ? '#2F7D4A' : '#C9A24B', borderRadius: 999, transition: 'width 0.4s ease' }}/>
          </div>
        </div>

        {/* Diretivas list */}
        <div style={{ padding: '14px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div className="t-overline" style={{ marginBottom: 4 }}>DIRETIVAS PARA ESTA PATRULHA</div>

          {diretivas.map((d, i) => {
            const corBorda = d.prioridade === 'alta' ? 'var(--danger)' : d.prioridade === 'media' ? 'var(--warning)' : 'var(--info)';
            const labelPrio = d.prioridade === 'alta' ? 'PRIORITÁRIO' : d.prioridade === 'media' ? 'MÉDIO' : 'NORMAL';
            const corPrio = d.prioridade === 'alta' ? 'var(--danger)' : d.prioridade === 'media' ? 'var(--warning)' : 'var(--info)';
            return (
              <button key={d.id} onClick={() => actions.toggleDiretiva(d.id)} style={{
                background: d.feito ? 'var(--surface-2)' : 'var(--surface)',
                border: '1px solid var(--border)',
                borderLeft: `4px solid ${d.feito ? 'var(--border)' : corBorda}`,
                borderRadius: 10, padding: '12px 12px',
                display: 'flex', gap: 12, alignItems: 'flex-start',
                cursor: 'pointer', textAlign: 'left', width: '100%',
              }}>
                {/* Hora / index */}
                <div style={{ minWidth: 36, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <span className="t-mono" style={{ fontSize: 10, color: 'var(--fg-muted)' }}>{d.hora || `${8 + i}:00`}</span>
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%', border: `2px solid ${d.feito ? 'var(--success)' : 'var(--brand-green)'}`,
                    background: d.feito ? 'var(--success)' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    {d.feito && <Icon name="check" size={11} style={{ color: '#FFF' }}/>}
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, lineHeight: '18px', fontWeight: d.feito ? 400 : 600, textDecoration: d.feito ? 'line-through' : 'none', opacity: d.feito ? 0.55 : 1 }}>
                    {d.texto}
                  </div>
                  {!d.feito && (
                    <span style={{ display: 'inline-block', marginTop: 5, fontSize: 10, fontWeight: 700, color: corPrio, background: d.prioridade === 'alta' ? 'var(--danger-soft)' : d.prioridade === 'media' ? 'var(--warning-soft)' : 'var(--info-soft)', borderRadius: 4, padding: '2px 6px' }}>
                      {labelPrio}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Nota do comandante */}
        <div style={{ margin: '0 14px 14px', background: 'var(--surface)', border: '1px solid var(--border)', borderLeft: '4px solid var(--brand-gold)', borderRadius: 10, padding: '12px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Icon name="shield" size={14} style={{ color: 'var(--brand-gold)' }}/>
            <div className="t-overline">NOTA DO COMANDANTE</div>
          </div>
          <div style={{ fontSize: 12, lineHeight: '17px', fontStyle: 'italic', color: 'var(--fg-muted)' }}>
            "Atenção redobrada na saída sul devido a obras na via. Reforço de visibilidade na zona escolar entre as 11:30 e as 14:00."
          </div>
          <div style={{ fontSize: 11, color: 'var(--fg-soft)', marginTop: 8, fontWeight: 600 }}>{autor}</div>
        </div>

        <div style={{ height: 8 }}/>
      </div>
    </div>
  );
};

window.ChecklistScreen = ChecklistScreen;
