/* Sentinela Mobile — Registo de Patrulha (Fecho / Finalizar) */

const RegistoPatrulhaScreen = ({ onBack, store }) => {
  const { useStore, actions } = window.SentinelaStore;
  const patrulhaAtual = useStore(s => s.patrulhaAtual);
  const viaturas = useStore(s => s.viaturas);

  const viatura = patrulhaAtual ? viaturas.find(v => v.id === patrulhaAtual.viaturaId) : null;
  const matricula = viatura ? viatura.matricula : 'GNR-—-——';

  const [kmFinais, setKmFinais] = React.useState('');
  const [litros, setLitros] = React.useState('');
  const [localAbastecimento, setLocalAbastecimento] = React.useState('');
  const [temDanos, setTemDanos] = React.useState(false);
  const [descricaoDanos, setDescricaoDanos] = React.useState('');
  const [enviando, setEnviando] = React.useState(false);
  const [enviado, setEnviado] = React.useState(false);

  const handleFinalizar = () => {
    if (!kmFinais) return;
    setEnviando(true);
    setTimeout(() => {
      setEnviando(false);
      setEnviado(true);
      setTimeout(() => onBack(), 1500);
    }, 1200);
  };

  if (enviado) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', gap: 16, padding: 24 }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--success-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="check" size={32} style={{ color: 'var(--success)' }}/>
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, textAlign: 'center' }}>Relatório enviado</div>
        <div style={{ fontSize: 13, color: 'var(--fg-muted)', textAlign: 'center' }}>A patrulha foi fechada com sucesso.</div>
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
          <div style={{ fontWeight: 600, fontSize: 14, fontFamily: 'var(--font-display)' }}>Registo de Patrulha</div>
          <div style={{ fontSize: 10, color: '#C9A24B' }}>Finalizar serviço · {matricula}</div>
        </div>
        <Icon name="clipboard" size={18}/>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', background: 'var(--bg)', padding: '14px 14px', display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Viatura info */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--brand-green-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="truck" size={20} style={{ color: '#FFF' }}/>
          </div>
          <div style={{ flex: 1 }}>
            <div className="t-overline" style={{ marginBottom: 2 }}>VIATURA EM SERVIÇO</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>{matricula}</div>
            {patrulhaAtual && (
              <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>Km iniciais: {patrulhaAtual.kmInicial?.toLocaleString('pt-PT') ?? '—'} km</div>
            )}
          </div>
        </div>

        {/* Km Finais */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
          <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Icon name="gauge" size={16} style={{ color: 'var(--brand-green)' }}/>
            <div style={{ fontWeight: 600, fontSize: 13 }}>Km Finais</div>
          </div>
          <div style={{ padding: '12px 14px' }}>
            <input
              type="number"
              value={kmFinais}
              onChange={e => setKmFinais(e.target.value)}
              placeholder="Ex: 184 500"
              style={{
                width: '100%', border: '1px solid var(--border)', borderRadius: 8,
                padding: '10px 12px', fontSize: 15, fontFamily: 'var(--font-mono)',
                background: 'var(--bg)', color: 'var(--fg)', outline: 'none', boxSizing: 'border-box',
              }}
            />
            <div style={{ fontSize: 11, color: 'var(--fg-muted)', marginTop: 6 }}>
              {kmFinais && patrulhaAtual?.kmInicial ? `Percurso: ${(parseInt(kmFinais) - patrulhaAtual.kmInicial).toLocaleString('pt-PT')} km` : 'Introduza a quilometragem final do contador da viatura'}
            </div>
          </div>
        </div>

        {/* Combustível */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
          <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Icon name="fuel" size={16} style={{ color: 'var(--brand-green)' }}/>
            <div style={{ fontWeight: 600, fontSize: 13 }}>Combustível &amp; Abastecimento</div>
          </div>
          <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div>
              <label style={{ fontSize: 11, color: 'var(--fg-muted)', display: 'block', marginBottom: 4 }}>Litros de Combustível</label>
              <input
                type="number"
                value={litros}
                onChange={e => setLitros(e.target.value)}
                placeholder="Ex: 35"
                style={{
                  width: '100%', border: '1px solid var(--border)', borderRadius: 8,
                  padding: '9px 12px', fontSize: 13, fontFamily: 'var(--font-mono)',
                  background: 'var(--bg)', color: 'var(--fg)', outline: 'none', boxSizing: 'border-box',
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: 11, color: 'var(--fg-muted)', display: 'block', marginBottom: 4 }}>Local do Abastecimento</label>
              <input
                type="text"
                value={localAbastecimento}
                onChange={e => setLocalAbastecimento(e.target.value)}
                placeholder="Ex: Galp Alcochete"
                style={{
                  width: '100%', border: '1px solid var(--border)', borderRadius: 8,
                  padding: '9px 12px', fontSize: 13,
                  background: 'var(--bg)', color: 'var(--fg)', outline: 'none', boxSizing: 'border-box',
                }}
              />
            </div>
          </div>
        </div>

        {/* Danos */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
          <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Icon name="alert-triangle" size={16} style={{ color: 'var(--warning)' }}/>
            <div style={{ fontWeight: 600, fontSize: 13 }}>Existência de Danos</div>
          </div>
          <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', gap: 10 }}>
              {[false, true].map(val => (
                <button key={String(val)} onClick={() => setTemDanos(val)} style={{
                  flex: 1, padding: '10px 0', borderRadius: 8, border: `2px solid ${temDanos === val ? (val ? 'var(--danger)' : 'var(--success)') : 'var(--border)'}`,
                  background: temDanos === val ? (val ? 'var(--danger-soft)' : 'var(--success-soft)') : 'var(--bg)',
                  color: temDanos === val ? (val ? 'var(--danger-deep)' : 'var(--success)') : 'var(--fg-muted)',
                  fontWeight: 700, fontSize: 14, cursor: 'pointer',
                }}>
                  {val ? 'SIM' : 'NÃO'}
                </button>
              ))}
            </div>
            {temDanos && (
              <textarea
                value={descricaoDanos}
                onChange={e => setDescricaoDanos(e.target.value)}
                placeholder="Descreva os danos observados na viatura..."
                rows={3}
                style={{
                  width: '100%', border: '1px solid var(--danger)', borderRadius: 8,
                  padding: '9px 12px', fontSize: 13, fontFamily: 'inherit', resize: 'none',
                  background: 'var(--danger-soft)', color: 'var(--fg)', outline: 'none', boxSizing: 'border-box',
                }}
              />
            )}
          </div>
        </div>

        {/* Aviso */}
        <div style={{ background: 'var(--warning-soft)', border: '1px solid var(--warning)', borderRadius: 10, padding: '12px 14px', display: 'flex', gap: 10 }}>
          <Icon name="alert-triangle" size={16} style={{ color: 'var(--warning-deep)', flexShrink: 0, marginTop: 1 }}/>
          <div style={{ fontSize: 12, color: 'var(--warning-deep)', lineHeight: '17px' }}>
            Os dados submetidos serão enviados para o <strong>Comando Territorial</strong> e não poderão ser alterados após confirmação. Certifique-se que os valores são corretos.
          </div>
        </div>

        {/* Botão */}
        <button onClick={handleFinalizar} disabled={!kmFinais || enviando} style={{
          width: '100%', background: kmFinais ? 'var(--brand-green)' : 'var(--surface-3)',
          color: kmFinais ? '#FFF' : 'var(--fg-muted)',
          border: 'none', borderRadius: 10, padding: '14px 0',
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15,
          cursor: kmFinais ? 'pointer' : 'not-allowed',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        }}>
          <Icon name={enviando ? 'loader' : 'upload-cloud'} size={18}/>
          {enviando ? 'A enviar…' : 'Finalizar Patrulha e Enviar Relatório'}
        </button>

        <div style={{ height: 8 }}/>
      </div>
    </div>
  );
};

window.RegistoPatrulhaScreen = RegistoPatrulhaScreen;
