/* Sentinela PC — Cronologia de turno + Notificações push + Ocorrências */

/* ── Browser push notifications ── */
const useNotificacoesPush = () => {
  const [permissao, setPermissao] = React.useState(() => {
    if (!('Notification' in window)) return 'unsupported';
    return Notification.permission;
  });

  const pedirPermissao = async () => {
    if (!('Notification' in window)) return;
    const result = await Notification.requestPermission();
    setPermissao(result);
  };

  const notificar = React.useCallback((titulo, opcoes = {}) => {
    if (Notification.permission !== 'granted') return;
    const n = new Notification(titulo, {
      icon: 'assets/sentinela-shield.svg',
      badge: 'assets/sentinela-shield.svg',
      ...opcoes,
    });
    setTimeout(() => n.close(), 6000);
  }, []);

  return { permissao, pedirPermissao, notificar };
};

/* Hook that fires a notification whenever a new critical alert arrives */
const useAlertasNotifier = (notificar) => {
  const alertas = window.SentinelaStore.useStore(s => s.alertas);
  const prevLen = React.useRef(alertas.length);
  React.useEffect(() => {
    if (alertas.length > prevLen.current) {
      const novo = alertas[0];
      if (novo && novo.severidade === 'critico') {
        notificar(`⚠ Alerta CRÍTICO — ${novo.matricula}`, {
          body: `${novo.motivo}\n${novo.local} · ${novo.indicativo}`,
          tag: novo.id,
        });
      } else if (novo) {
        notificar(`Alerta ANPR — ${novo.matricula}`, {
          body: `${novo.motivo} · ${novo.local}`,
          tag: novo.id,
        });
      }
    }
    prevLen.current = alertas.length;
  }, [alertas.length]);
};

const NotifBell = () => {
  const { permissao, pedirPermissao, notificar } = useNotificacoesPush();
  useAlertasNotifier(notificar);

  if (permissao === 'unsupported') return null;

  return (
    <button
      onClick={permissao === 'granted' ? undefined : pedirPermissao}
      title={permissao === 'granted' ? 'Notificações ativas' : 'Ativar notificações do browser'}
      style={{
        background: permissao === 'granted' ? 'rgba(54,128,68,0.12)' : 'var(--surface-2)',
        border: '1px solid ' + (permissao === 'granted' ? 'var(--success)' : 'var(--border)'),
        borderRadius: 6, padding: '6px 10px', cursor: permissao === 'granted' ? 'default' : 'pointer',
        display: 'flex', alignItems: 'center', gap: 6,
        fontSize: 11, fontWeight: 600,
        color: permissao === 'granted' ? 'var(--success)' : 'var(--fg-muted)',
      }}>
      <Icon name="bell" size={14}/>
      {permissao === 'granted' ? 'Notificações ativas' : permissao === 'denied' ? 'Bloqueado' : 'Ativar notificações'}
    </button>
  );
};

/* ── Cronologia ── */
const TIPO_META = {
  patrulha_aberta:   { icon: 'play',           label: 'Patrulha iniciada',    cor: 'var(--success)' },
  patrulha_fechada:  { icon: 'check-square',   label: 'Patrulha encerrada',   cor: 'var(--brand-green)' },
  alerta_anpr:       { icon: 'alert-triangle', label: 'Alerta ANPR',          cor: 'var(--warning)' },
  alerta_confirmado: { icon: 'check',          label: 'Alerta confirmado',    cor: 'var(--info)' },
  ocorrencia:        { icon: 'clipboard-list', label: 'Ocorrência registada', cor: 'var(--brand-gold)' },
  mensagem:          { icon: 'message-square', label: 'Mensagem',             cor: 'var(--fg-soft)' },
  panico_ativo:      { icon: 'siren',          label: 'PEDIDO DE REFORÇO',    cor: 'var(--danger)' },
  panico_cancelado:  { icon: 'x',             label: 'Reforço cancelado',    cor: 'var(--fg-muted)' },
};

const CronologiaView = () => {
  const { useStore } = window.SentinelaStore;
  const eventos = useStore(s => s.eventos);
  const [filtro, setFiltro] = React.useState('todos');

  const tipos = ['todos', 'patrulha_aberta', 'patrulha_fechada', 'alerta_anpr', 'ocorrencia', 'panico_ativo'];

  const visiveis = filtro === 'todos'
    ? eventos
    : eventos.filter(e => e.tipo === filtro);

  if (eventos.length === 0) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, color: 'var(--fg-muted)', padding: 40 }}>
        <Icon name="clock" size={40} style={{ opacity: 0.3 }}/>
        <div style={{ fontSize: 14, fontWeight: 600 }}>Sem eventos registados</div>
        <div style={{ fontSize: 12, textAlign: 'center', maxWidth: 280 }}>
          Os eventos aparecem aqui automaticamente — abre uma patrulha, gera alertas ANPR ou regista ocorrências.
        </div>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Filter bar */}
      <div style={{ padding: '12px 22px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 6, flexWrap: 'wrap', background: 'var(--surface)', flexShrink: 0 }}>
        {tipos.map(t => {
          const meta = TIPO_META[t];
          return (
            <button key={t} onClick={() => setFiltro(t)} style={{
              background: filtro === t ? 'var(--brand-green)' : 'var(--surface-2)',
              color: filtro === t ? '#FFF' : 'var(--fg)',
              border: '1px solid ' + (filtro === t ? 'var(--brand-green)' : 'var(--border)'),
              borderRadius: 6, padding: '5px 12px', fontSize: 11, fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 5,
            }}>
              {meta && <Icon name={meta.icon} size={12}/>}
              {meta ? meta.label : 'Todos'}
            </button>
          );
        })}
        <div style={{ flex: 1 }}/>
        <div style={{ fontSize: 11, color: 'var(--fg-muted)', alignSelf: 'center' }}>{visiveis.length} evento{visiveis.length !== 1 ? 's' : ''}</div>
      </div>

      {/* Timeline */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 22px' }}>
        <div style={{ position: 'relative' }}>
          {/* Vertical line */}
          <div style={{ position: 'absolute', left: 19, top: 0, bottom: 0, width: 2, background: 'var(--border)' }}/>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {visiveis.map((ev, i) => {
              const meta = TIPO_META[ev.tipo] || { icon: 'info', label: ev.tipo, cor: 'var(--fg-muted)' };
              const isPanico = ev.tipo === 'panico_ativo';
              return (
                <div key={ev.id} style={{ display: 'flex', gap: 14, paddingBottom: 20, position: 'relative' }}>
                  {/* Icon dot */}
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%', flexShrink: 0, zIndex: 1,
                    background: isPanico ? 'var(--danger)' : 'var(--surface)',
                    border: `2px solid ${meta.cor}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: isPanico ? '#FFF' : meta.cor,
                    boxShadow: isPanico ? '0 0 0 4px rgba(199,50,43,0.15)' : 'none',
                  }}>
                    <Icon name={meta.icon} size={16}/>
                  </div>

                  {/* Content */}
                  <div style={{
                    flex: 1, background: 'var(--surface)', border: '1px solid var(--border)',
                    borderLeft: `3px solid ${meta.cor}`,
                    borderRadius: 8, padding: '10px 14px', marginTop: 4,
                    background: isPanico ? 'rgba(199,50,43,0.04)' : 'var(--surface)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: isPanico ? 'var(--danger)' : 'var(--fg)' }}>
                        {ev.descricao}
                      </div>
                      <span className="t-mono" style={{ fontSize: 10, color: 'var(--fg-muted)', marginLeft: 'auto' }}>{ev.hora}</span>
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--fg-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{meta.label}</div>
                    {ev.dados?.matricula && (
                      <div style={{ marginTop: 6 }}><Plate value={ev.dados.matricula} size="sm"/></div>
                    )}
                    {ev.dados?.numero && (
                      <div style={{ marginTop: 4 }}><Badge tone="brand" size="sm">{ev.dados.numero}</Badge></div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Ocorrências view (PC) ── */
const OcorrenciasView = () => {
  const { useStore } = window.SentinelaStore;
  const ocorrencias = useStore(s => s.ocorrencias);
  const militares = useStore(s => s.militares);

  const TIPO_LABEL = {
    contraordenacao: 'Contraordenação',
    crime: 'Crime / SIIOP',
    avaria: 'Avaria / acidente',
    inspecao: 'Fiscalização',
    suspeito: 'Indivíduo suspeito',
    outro: 'Outro',
  };

  const ACAO_LABEL = {
    auto_levantado: 'Auto levantado',
    detencao: 'Detenção',
    notificacao: 'Notificação',
    comunicado_mp: 'Comunicado MP',
    sem_acao: 'Sem ação',
    reencaminhado: 'Reencaminhado',
  };

  if (ocorrencias.length === 0) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, color: 'var(--fg-muted)', padding: 40 }}>
        <Icon name="clipboard-list" size={40} style={{ opacity: 0.3 }}/>
        <div style={{ fontSize: 14, fontWeight: 600 }}>Sem ocorrências registadas</div>
        <div style={{ fontSize: 12 }}>As ocorrências registadas no móvel aparecem aqui.</div>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: 22 }}>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: 'var(--surface-2)' }}>
              {['Número','Hora','Matrícula','Tipo','Ação tomada','Local','Notas'].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid var(--border)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ocorrencias.map((oc, i) => (
              <tr key={oc.id} style={{ borderBottom: i < ocorrencias.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <td style={{ padding: '10px 14px' }}>
                  <Badge tone="brand" size="sm">{oc.numero}</Badge>
                </td>
                <td className="t-mono" style={{ padding: '10px 14px' }}>{oc.hora}</td>
                <td style={{ padding: '10px 14px' }}>
                  {oc.matricula ? <Plate value={oc.matricula} size="sm"/> : <span style={{ color: 'var(--fg-muted)' }}>—</span>}
                </td>
                <td style={{ padding: '10px 14px', fontWeight: 600 }}>{TIPO_LABEL[oc.tipo] || oc.tipo}</td>
                <td style={{ padding: '10px 14px' }}><Badge tone="neutral" size="sm">{ACAO_LABEL[oc.acao] || oc.acao}</Badge></td>
                <td style={{ padding: '10px 14px', fontSize: 11, color: 'var(--fg-muted)' }}>{oc.local}</td>
                <td style={{ padding: '10px 14px', fontSize: 11, color: 'var(--fg-muted)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{oc.notas || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

Object.assign(window, { CronologiaView, OcorrenciasView, NotifBell });
