/* Sentinela Mobile — Registo rápido de ocorrência + ditado por voz */

const useSpeechRecognition = (onResult) => {
  const recRef = React.useRef(null);
  const [ouvindo, setOuvindo] = React.useState(false);
  const [suportado] = React.useState(() => !!(window.SpeechRecognition || window.webkitSpeechRecognition));

  const iniciar = React.useCallback(() => {
    if (!suportado) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    rec.lang = 'pt-PT';
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onstart = () => setOuvindo(true);
    rec.onend = () => setOuvindo(false);
    rec.onerror = () => setOuvindo(false);
    rec.onresult = (e) => {
      const texto = e.results[0][0].transcript;
      onResult(texto);
    };
    recRef.current = rec;
    rec.start();
  }, [suportado, onResult]);

  const parar = React.useCallback(() => {
    if (recRef.current) recRef.current.stop();
  }, []);

  return { ouvindo, suportado, iniciar, parar };
};

const MicButton = ({ onResult, size = 'normal' }) => {
  const [texto, setTexto] = React.useState('');
  const { ouvindo, suportado, iniciar, parar } = useSpeechRecognition(t => {
    setTexto(t);
    onResult(t);
  });

  if (!suportado) return null;

  return (
    <button
      onMouseDown={iniciar} onMouseUp={parar} onTouchStart={iniciar} onTouchEnd={parar}
      title="Manter premido para ditar"
      style={{
        background: ouvindo ? 'var(--danger)' : 'var(--brand-green)',
        color: '#FFF', border: 'none',
        borderRadius: size === 'sm' ? '50%' : 8,
        width: size === 'sm' ? 34 : 42, height: size === 'sm' ? 34 : 42,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', flexShrink: 0,
        animation: ouvindo ? 'micPulse 0.6s ease-in-out infinite alternate' : 'none',
      }}>
      <style>{`@keyframes micPulse{from{box-shadow:0 0 0 0 rgba(199,50,43,0.5)}to{box-shadow:0 0 0 8px rgba(199,50,43,0)}}`}</style>
      <Icon name={ouvindo ? 'radio' : 'phone'} size={size === 'sm' ? 14 : 18}/>
    </button>
  );
};

const OcorrenciaModal = ({ alerta, onClose }) => {
  const { actions } = window.SentinelaStore;
  const [tipo, setTipo] = React.useState('contraordenacao');
  const [notas, setNotas] = React.useState('');
  const [acao, setAcao] = React.useState('auto_levantado');
  const [submetido, setSubmetido] = React.useState(null);

  const appendVoz = React.useCallback(t => {
    setNotas(prev => prev ? prev + ' ' + t : t);
  }, []);

  const submeter = () => {
    const oc = actions.addOcorrencia({
      tipo,
      notas,
      acao,
      matricula: alerta?.matricula,
      alertaId: alerta?.id,
      local: alerta?.local || '—',
      indicativo: alerta?.indicativo || '—',
    });
    setSubmetido(oc);
  };

  if (submetido) {
    return (
      <div style={{
        position: 'absolute', inset: 0, background: 'var(--bg)', zIndex: 50,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: 24, gap: 16, textAlign: 'center',
      }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(54,128,68,0.12)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="check" size={36}/>
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20 }}>Ocorrência registada</div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--brand-green)', fontWeight: 600 }}>{submetido.numero}</div>
        <div style={{ fontSize: 13, color: 'var(--fg-muted)', lineHeight: 1.6 }}>
          Sincronizado com o posto · {submetido.hora}<br/>
          Visível na Cronologia e Ocorrências
        </div>
        <button onClick={onClose} style={{
          background: 'var(--brand-green)', color: '#FFF', border: 'none',
          borderRadius: 10, padding: '12px 32px', fontWeight: 700, fontSize: 14, cursor: 'pointer',
        }}>Concluído</button>
      </div>
    );
  }

  return (
    <div style={{ position: 'absolute', inset: 0, background: 'var(--bg)', zIndex: 50, display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: 52, background: 'var(--brand-green-deep)', color: '#FFF', display: 'flex', alignItems: 'center', gap: 10, padding: '0 12px', flexShrink: 0 }}>
        <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#FFF', display: 'flex', cursor: 'pointer', padding: 4 }}>
          <Icon name="x" size={20}/>
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14 }}>Registar ocorrência</div>
          {alerta && <div style={{ fontSize: 10, color: '#C9A24B', fontWeight: 600 }}>Associada ao alerta: {alerta.matricula}</div>}
        </div>
        <Icon name="clipboard-list" size={18}/>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 14 }}>

        {alerta && (
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderLeft: '4px solid var(--warning)', borderRadius: 8, padding: '10px 12px' }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <Plate value={alerta.matricula} size="sm"/>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600 }}>{alerta.motivo}</div>
                <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{alerta.local} · {alerta.hora}</div>
              </div>
            </div>
          </div>
        )}

        <div>
          <div className="t-overline" style={{ marginBottom: 6 }}>TIPO DE OCORRÊNCIA</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            {[
              ['contraordenacao', 'Contraordenação'],
              ['crime', 'Crime / SIIOP'],
              ['avaria', 'Avaria / acidente'],
              ['inspecao', 'Fiscalização'],
              ['suspeito', 'Indivíduo suspeito'],
              ['outro', 'Outro'],
            ].map(([v, l]) => (
              <button key={v} onClick={() => setTipo(v)} style={{
                background: tipo === v ? 'var(--brand-green)' : 'var(--surface)',
                color: tipo === v ? '#FFF' : 'var(--fg)',
                border: '1px solid ' + (tipo === v ? 'var(--brand-green)' : 'var(--border)'),
                borderRadius: 8, padding: '10px 8px', fontSize: 12, fontWeight: 600, cursor: 'pointer',
              }}>{l}</button>
            ))}
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <div className="t-overline">NOTAS E DESCRIÇÃO</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, color: 'var(--fg-muted)' }}>
              <Icon name="phone" size={11}/>
              Manter premido para ditar
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <textarea
              value={notas}
              onChange={e => setNotas(e.target.value)}
              placeholder="Descrição da ocorrência… Podes ditar por voz."
              rows={4}
              className="form-input"
              style={{ flex: 1, fontFamily: 'var(--font-sans)', fontSize: 13, resize: 'none' }}
            />
            <MicButton onResult={appendVoz}/>
          </div>
        </div>

        <div>
          <div className="t-overline" style={{ marginBottom: 6 }}>AÇÃO TOMADA</div>
          <select value={acao} onChange={e => setAcao(e.target.value)} className="form-input" style={{ fontSize: 13 }}>
            <option value="auto_levantado">Auto de contraordenação levantado</option>
            <option value="detencao">Detenção efetuada</option>
            <option value="notificacao">Notificação / contacto</option>
            <option value="comunicado_mp">Comunicado ao MP</option>
            <option value="sem_acao">Sem ação (informação)</option>
            <option value="reencaminhado">Reencaminhado para outro órgão</option>
          </select>
        </div>

        <button onClick={submeter} style={{
          background: 'var(--brand-green)', color: '#FFF', border: 'none',
          borderRadius: 10, padding: '14px', fontWeight: 700, fontSize: 14, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 4,
        }}>
          <Icon name="send" size={16}/> Submeter ocorrência
        </button>
      </div>
    </div>
  );
};

Object.assign(window, { OcorrenciaModal, MicButton, useSpeechRecognition });
