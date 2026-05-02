/* Sentinela Mobile — Escalas de Serviço */

const EscalasFullScreen = ({ onBack, store }) => {
  const { useStore } = window.SentinelaStore;
  const me = useStore(s => s.militares.find(x => x.id === s.militarLogadoId));
  const D = window.SENTINELA_DATA;

  const [tabAtiva, setTabAtiva] = React.useState('minha'); // 'minha' | 'geral'
  const [semanaOffset, setSemanaOffset] = React.useState(0);

  // Mock schedule data based on store escala
  const escala = D?.escala;
  const diasSemana = escala?.dias || ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

  const hoje = new Date();
  const inicioSemana = new Date(hoje);
  inicioSemana.setDate(hoje.getDate() - hoje.getDay() + 1 + semanaOffset * 7);
  const fimSemana = new Date(inicioSemana);
  fimSemana.setDate(inicioSemana.getDate() + 6);

  const formatarIntervalo = (d1, d2) => {
    const opts = { day: '2-digit', month: 'short' };
    return `${d1.toLocaleDateString('pt-PT', opts)} – ${d2.toLocaleDateString('pt-PT', opts)}`;
  };

  // Static upcoming shifts for "Minha Escala"
  const proximosTurnos = [
    { dia: 'Amanhã', hora: '08:00', tipo: 'Patrulha Territorial', parceiro: 'Guard. Mendes', estado: 'confirmado' },
    { dia: 'Quinta', hora: '20:00', tipo: 'Patrulha Noturna', parceiro: 'Cabo Ferreira', estado: 'confirmado' },
    { dia: 'Sexta', hora: '08:00', tipo: 'Serviço Posto', parceiro: '—', estado: 'pendente' },
  ];

  const corEstado = e => e === 'confirmado' ? 'var(--success)' : e === 'pendente' ? 'var(--warning)' : 'var(--fg-muted)';
  const bgEstado = e => e === 'confirmado' ? 'var(--success-soft)' : e === 'pendente' ? 'var(--warning-soft)' : 'var(--surface-2)';

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ height: 52, background: 'var(--brand-green-deep)', color: '#FFF', display: 'flex', alignItems: 'center', padding: '0 12px', gap: 10, flexShrink: 0 }}>
        <button onClick={onBack} style={{ background: 'transparent', border: 'none', color: '#FFF', display: 'flex', cursor: 'pointer', padding: 4 }}>
          <Icon name="arrow-left" size={20}/>
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: 14, fontFamily: 'var(--font-display)' }}>Escalas de Serviço</div>
          <div style={{ fontSize: 10, color: '#C9A24B' }}>Planeamento operacional</div>
        </div>
        <Icon name="calendar" size={18}/>
      </div>

      {/* Profile strip */}
      {me && (
        <div style={{ background: 'var(--brand-green)', color: '#FFF', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar name={me.nome} size={38} style={{ border: '2px solid #C9A24B' }}/>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 13 }}>{me.postoAbrev} {me.nome.split(' ').slice(-1)[0]}</div>
            <div style={{ fontSize: 11, color: '#C9A24B' }}>{me.secao}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="t-mono" style={{ fontSize: 13, fontWeight: 700 }}>142/160h</div>
            <div style={{ fontSize: 10, opacity: 0.8 }}>este mês</div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', flexShrink: 0 }}>
        {[['minha', 'Minha Escala'], ['geral', 'Escala Geral']].map(([id, label]) => (
          <button key={id} onClick={() => setTabAtiva(id)} style={{
            flex: 1, background: 'transparent', border: 'none', padding: '11px 0',
            fontWeight: tabAtiva === id ? 700 : 500, fontSize: 13, cursor: 'pointer',
            color: tabAtiva === id ? 'var(--brand-green)' : 'var(--fg-muted)',
            borderBottom: `2px solid ${tabAtiva === id ? 'var(--brand-green)' : 'transparent'}`,
          }}>{label}</button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', background: 'var(--bg)' }}>
        {tabAtiva === 'minha' ? (
          <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 14px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, color: 'var(--brand-green)' }}>4</div>
                <div className="t-overline" style={{ fontSize: 9 }}>DIAS DE FOLGA ACUM.</div>
              </div>
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 14px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, color: 'var(--info)' }}>3</div>
                <div className="t-overline" style={{ fontSize: 9 }}>TURNOS ESTA SEMANA</div>
              </div>
            </div>

            {/* Próximos turnos */}
            <div>
              <div className="t-overline" style={{ marginBottom: 8 }}>PRÓXIMOS TURNOS</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {proximosTurnos.map((t, i) => (
                  <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ textAlign: 'center', minWidth: 44 }}>
                      <div style={{ fontSize: 10, color: 'var(--fg-muted)' }}>{t.dia}</div>
                      <div className="t-mono" style={{ fontWeight: 700, fontSize: 14, color: 'var(--brand-green)' }}>{t.hora}</div>
                    </div>
                    <div style={{ flex: 1, borderLeft: '1px solid var(--border)', paddingLeft: 12 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{t.tipo}</div>
                      {t.parceiro !== '—' && (
                        <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>
                          <Icon name="user" size={11}/> {t.parceiro}
                        </div>
                      )}
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 700, color: corEstado(t.estado), background: bgEstado(t.estado), borderRadius: 6, padding: '3px 8px' }}>
                      {t.estado === 'confirmado' ? 'CONF.' : 'PEND.'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Alerta troca */}
            <div style={{ background: 'var(--warning-soft)', border: '1px solid var(--warning)', borderRadius: 10, padding: '12px 14px', display: 'flex', gap: 10 }}>
              <Icon name="alert-circle" size={16} style={{ color: 'var(--warning-deep)', flexShrink: 0, marginTop: 1 }}/>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--warning-deep)', marginBottom: 2 }}>Pedido de troca pendente</div>
                <div style={{ fontSize: 11, color: 'var(--warning-deep)', lineHeight: '16px' }}>Guard. Costa solicitou troca do turno de 30 Out. Responda até amanhã.</div>
              </div>
            </div>
          </div>
        ) : (
          /* Escala Geral — Tabela */
          <div style={{ padding: 12 }}>
            {/* Navegação semana */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <button onClick={() => setSemanaOffset(o => o - 1)} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', color: 'var(--fg)' }}>
                <Icon name="chevron-left" size={16}/>
              </button>
              <div style={{ flex: 1, textAlign: 'center', fontSize: 12, fontWeight: 600, color: 'var(--fg)' }}>
                {formatarIntervalo(inicioSemana, fimSemana)}
              </div>
              <button onClick={() => setSemanaOffset(o => o + 1)} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', color: 'var(--fg)' }}>
                <Icon name="chevron-right" size={16}/>
              </button>
            </div>

            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
                <thead>
                  <tr style={{ background: 'var(--surface-2)' }}>
                    <th style={{ padding: '8px 10px', textAlign: 'left', fontSize: 10, color: 'var(--fg-muted)', borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }}>Militar</th>
                    {diasSemana.map(d => (
                      <th key={d} style={{ padding: '8px 4px', fontSize: 10, color: 'var(--fg-muted)', borderBottom: '1px solid var(--border)', textAlign: 'center' }}>{d}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {escala?.linhas?.map(l => (
                    <tr key={l.militar} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '6px 10px', fontWeight: 600, fontSize: 11, whiteSpace: 'nowrap' }}>{l.militar}</td>
                      {l.turnos.map((t, i) => (
                        <td key={i} className="t-mono" style={{
                          padding: '6px 2px', textAlign: 'center', fontSize: 10, fontWeight: 600,
                          background: t === 'FOLGA' ? 'var(--surface-2)' : t === '20-08' ? 'rgba(46,92,138,0.10)' : 'rgba(31,77,58,0.08)',
                          color: t === 'FOLGA' ? 'var(--fg-soft)' : t === '20-08' ? 'var(--info-deep)' : 'var(--brand-green)',
                        }}>{t}</td>
                      ))}
                    </tr>
                  )) ?? (
                    <tr>
                      <td colSpan={diasSemana.length + 1} style={{ padding: '20px', textAlign: 'center', color: 'var(--fg-muted)', fontSize: 12 }}>
                        Sem dados de escala disponíveis
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

window.EscalasFullScreen = EscalasFullScreen;
