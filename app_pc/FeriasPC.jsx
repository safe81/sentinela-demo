/* Sentinela PC — Gestão de férias anuais */

const FeriasView = () => {
  const { useStore, ordemAntiguidade } = window.SentinelaStore;
  const ferias = useStore(s => s.ferias);
  const militares = useStore(s => s.militares);

  const fila = ordemAntiguidade(militares);

  // Year 2026 Gantt helpers
  const YEAR_START = new Date('2026-01-01');
  const YEAR_DAYS = 365;
  const dayOffset = dateStr => Math.floor((new Date(dateStr) - YEAR_START) / 86400000);

  const MONTHS = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  const MONTH_DAYS = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  const monthPct = d => (d / YEAR_DAYS) * 100;

  const totalConcluidos = ferias.concluidos.length;
  const turnoAtualMilitar = militares.find(m => m.id === ferias.turnoMilitarId);
  const formatDate = d => { if (!d) return '—'; const [y, m, day] = d.split('-'); return `${day}/${m}/${y}`; };

  const totalDiasMarcados = ferias.periodos.reduce((s, p) => s + p.dias, 0);
  const totalDiasDisponiveis = militares.reduce((s, m) => s + (m.diasFerias || 0), 0);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Sub-header KPIs */}
      <div style={{ padding: '12px 22px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 20, flexShrink: 0 }}>
        {[
          { label: 'Concluídos', value: totalConcluidos, total: militares.length, color: 'var(--success)' },
          { label: 'Aguardam', value: militares.length - totalConcluidos, color: 'var(--fg-muted)' },
          { label: 'Períodos marcados', value: ferias.periodos.length, color: 'var(--brand-green)' },
          { label: 'Dias marcados', value: totalDiasMarcados, color: 'var(--info)' },
        ].map(k => (
          <div key={k.label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: k.color, fontFamily: 'var(--font-display)', lineHeight: 1 }}>
              {k.value}{k.total ? `/${k.total}` : ''}
            </div>
            <div style={{ fontSize: 10, color: 'var(--fg-muted)', marginTop: 2, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{k.label}</div>
          </div>
        ))}
        <div style={{ flex: 1 }}/>
        {turnoAtualMilitar ? (
          <div style={{ background: 'rgba(201,162,75,0.12)', border: '1px solid var(--brand-gold)', borderRadius: 8, padding: '7px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--brand-gold)', boxShadow: '0 0 6px var(--brand-gold)', animation: 'pulse 1.5s ease-in-out infinite' }}/>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--brand-gold)', letterSpacing: '0.06em' }}>A MARCAR AGORA</div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{turnoAtualMilitar.postoAbrev} {turnoAtualMilitar.nome}</div>
            </div>
          </div>
        ) : ferias.concluidos.length > 0 ? (
          <div style={{ background: 'rgba(54,128,68,0.10)', border: '1px solid var(--success)', borderRadius: 8, padding: '7px 14px', display: 'flex', alignItems: 'center', gap: 8, color: 'var(--success)' }}>
            <Icon name="check-circle" size={16}/>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Toda a marcação concluída</div>
          </div>
        ) : null}
        <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 22 }}>

        {/* Gantt chart */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden', marginBottom: 20 }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon name="calendar" size={16} style={{ color: 'var(--brand-green)' }}/>
            <div style={{ fontWeight: 600, fontSize: 13 }}>Distribuição anual de férias — {ferias.ano}</div>
            <div style={{ flex: 1 }}/>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 11 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 12, height: 8, background: 'var(--brand-green)', borderRadius: 2, display: 'inline-block' }}/> Confirmado
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 12, height: 8, background: 'var(--brand-green)', borderRadius: 2, display: 'inline-block', opacity: 0.4 }}/> Em edição
              </span>
            </div>
          </div>

          {/* Month header row */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', background: 'var(--surface-2)', height: 30 }}>
            <div style={{ width: 190, flexShrink: 0, borderRight: '1px solid var(--border)', display: 'flex', alignItems: 'center', padding: '0 14px' }}>
              <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--fg-muted)', textTransform: 'uppercase' }}>Militar</span>
            </div>
            <div style={{ flex: 1, position: 'relative' }}>
              {MONTHS.map((m, i) => (
                <React.Fragment key={m}>
                  <div style={{ position: 'absolute', left: `${monthPct(MONTH_DAYS[i])}%`, top: 0, bottom: 0, width: 1, background: 'var(--border)' }}/>
                  <div style={{ position: 'absolute', left: `${monthPct(MONTH_DAYS[i])}%`, top: '50%', transform: 'translateY(-50%)', paddingLeft: 4, fontSize: 10, fontWeight: 600, color: 'var(--fg-muted)', pointerEvents: 'none', whiteSpace: 'nowrap' }}>{m}</div>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Military rows */}
          {fila.map((m, i) => {
            const periodos = ferias.periodos.filter(p => p.militarId === m.id);
            const concluido = ferias.concluidos.includes(m.id);
            const ativo = ferias.turnoMilitarId === m.id;
            const diasUsados = periodos.reduce((s, p) => s + p.dias, 0);

            return (
              <div key={m.id} style={{
                display: 'flex', borderBottom: '1px solid var(--border)', minHeight: 34,
                background: ativo ? 'rgba(201,162,75,0.04)' : i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.012)',
              }}>
                <div style={{ width: 190, flexShrink: 0, borderRight: '1px solid var(--border)', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span className="t-mono" style={{ fontSize: 10, color: 'var(--fg-muted)', width: 18 }}>{i + 1}.</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.postoAbrev} {m.nome}</div>
                    <div style={{ fontSize: 10, color: 'var(--fg-muted)' }}>{diasUsados}/{m.diasFerias}d</div>
                  </div>
                  {concluido
                    ? <Icon name="check-circle" size={12} style={{ color: 'var(--success)', flexShrink: 0 }}/>
                    : ativo
                    ? <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--brand-gold)', flexShrink: 0 }}/>
                    : null
                  }
                </div>
                <div style={{ flex: 1, position: 'relative' }}>
                  {/* Month grid lines */}
                  {MONTH_DAYS.map((d, j) => (
                    <div key={j} style={{ position: 'absolute', left: `${monthPct(d)}%`, top: 0, bottom: 0, width: 1, background: 'var(--border)', opacity: 0.4 }}/>
                  ))}
                  {/* Vacation bars */}
                  {periodos.map(p => {
                    const left = (dayOffset(p.inicio) / YEAR_DAYS) * 100;
                    const width = Math.max((p.dias / YEAR_DAYS) * 100, 0.3);
                    return (
                      <div key={p.id} title={`${formatDate(p.inicio)} – ${formatDate(p.fim)} (${p.dias} dias)`}
                        style={{
                          position: 'absolute', top: '18%', height: '64%',
                          left: `${left}%`, width: `${width}%`,
                          background: 'var(--brand-green)', borderRadius: 3,
                          opacity: concluido ? 0.85 : 0.45,
                          cursor: 'default',
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Queue table */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon name="users" size={16} style={{ color: 'var(--brand-green)' }}/>
            <div style={{ fontWeight: 600, fontSize: 13 }}>Ordem de antiguidade · Marcação de férias {ferias.ano}</div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: 'var(--surface-2)' }}>
                  {['#','Militar','Posto','Ano ingresso','Estado','Períodos','Dias marcados','Dias disponíveis','Detalhes'].map(h => (
                    <th key={h} style={{ padding: '8px 14px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {fila.map((m, i) => {
                  const periodos = ferias.periodos.filter(p => p.militarId === m.id);
                  const concluido = ferias.concluidos.includes(m.id);
                  const ativo = ferias.turnoMilitarId === m.id;
                  const diasUsados = periodos.reduce((s, p) => s + p.dias, 0);

                  return (
                    <tr key={m.id} style={{
                      borderBottom: '1px solid var(--border)',
                      background: ativo ? 'rgba(201,162,75,0.05)' : 'transparent',
                    }}>
                      <td className="t-mono" style={{ padding: '10px 14px', color: 'var(--fg-muted)', fontSize: 11 }}>{i + 1}</td>
                      <td style={{ padding: '10px 14px', fontWeight: 600 }}>{m.nome}</td>
                      <td style={{ padding: '10px 14px' }}>
                        <span style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 4, padding: '2px 7px', fontSize: 11, fontWeight: 600 }}>{m.postoAbrev}</span>
                      </td>
                      <td className="t-mono" style={{ padding: '10px 14px', fontSize: 12 }}>{m.anoIngresso}</td>
                      <td style={{ padding: '10px 14px' }}>
                        {concluido
                          ? <Badge tone="success" size="sm">Concluído</Badge>
                          : ativo
                          ? <Badge tone="warning" size="sm">A marcar</Badge>
                          : <Badge tone="info" size="sm">Aguarda</Badge>
                        }
                      </td>
                      <td className="t-mono" style={{ padding: '10px 14px', fontSize: 12 }}>{periodos.length}/5</td>
                      <td className="t-mono" style={{ padding: '10px 14px', fontSize: 12, fontWeight: 600 }}>{diasUsados}</td>
                      <td style={{ padding: '10px 14px' }}>
                        <span className="t-mono" style={{ fontSize: 12, color: 'var(--brand-green)', fontWeight: 700 }}>{m.diasFerias}</span>
                      </td>
                      <td style={{ padding: '10px 14px', fontSize: 11, color: 'var(--fg-muted)' }}>
                        {periodos.map(p => `${formatDate(p.inicio)}–${formatDate(p.fim)}`).join(' · ') || '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

window.FeriasView = FeriasView;
