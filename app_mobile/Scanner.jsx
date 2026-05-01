/* Sentinela Mobile — Scanner ANPR (store-driven, câmera real) */

const ScannerScreenV2 = () => {
  const { useStore, actions } = window.SentinelaStore;
  const alertas = useStore(s => s.alertas);
  const me = useStore(s => s.militares.find(x => x.id === s.militarLogadoId));
  const indicativo = useStore(s => s.patrulhaAtual?.indicativo) || me?.indicativo || '—';

  const [scanned, setScanned] = React.useState(0);
  const [running, setRunning] = React.useState(true);
  const [alertaAtivo, setAlertaAtivo] = React.useState(null);
  const [detalheVisivel, setDetalhe] = React.useState(false);
  const [registarOcorrencia, setRegistarOcorrencia] = React.useState(false);
  const [cameraAtiva, setCameraAtiva] = React.useState(false);
  const [cameraErro, setCameraErro] = React.useState(null);
  const videoRef = React.useRef(null);
  const streamRef = React.useRef(null);

  // Start camera
  React.useEffect(() => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraErro('Câmera não suportada neste dispositivo.');
      return;
    }
    navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } },
    })
    .then(stream => {
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraAtiva(true);
      }
    })
    .catch(() => setCameraErro('Acesso à câmera negado. A usar modo de simulação.'));

    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    };
  }, []);

  // Pause/resume camera track when running toggles
  React.useEffect(() => {
    if (!streamRef.current) return;
    streamRef.current.getVideoTracks().forEach(t => { t.enabled = running; });
  }, [running]);

  React.useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setScanned(s => s + 1 + Math.floor(Math.random()*3)), 900);
    return () => clearInterval(t);
  }, [running]);

  const simularAlerta = () => {
    const cenarios = [
      { matricula: '12-AB-34', motivo: 'Viatura furtada', severidade: 'critico', origem: 'BNDV — Aveiro 2024-08-14', local: 'Av. Carvalho Araújo' },
      { matricula: '89-NM-22', motivo: 'Procurada — furto a estabelecimento', severidade: 'critico', origem: 'MP Vila Real', local: 'R. Direita' },
      { matricula: '57-DT-91', motivo: 'Sem seguro válido', severidade: 'aviso', origem: 'ASF — desde 2026-01-12', local: 'EN2, km 14' },
      { matricula: '44-PV-22', motivo: 'Inspeção caducada', severidade: 'aviso', origem: 'IMT — caducou 2025-11-30', local: 'R. da República' },
    ];
    const c = cenarios[Math.floor(Math.random() * cenarios.length)];
    const a = actions.addAlerta({ ...c, militar: me ? `${me.postoAbrev} ${me.nome}` : '—', indicativo });
    setAlertaAtivo(a);
  };

  const confirmar = () => {
    actions.confirmarAlerta(alertaAtivo.id);
    setDetalhe(false);
    // Keep alertaAtivo so user can register occurrence
  };

  const tone = alertaAtivo?.severidade === 'critico' ? 'var(--danger)' : 'var(--warning)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, background: '#000', color: '#FFF', position: 'relative' }}>
      {registarOcorrencia && (
        <OcorrenciaModal alerta={alertaAtivo} onClose={() => { setRegistarOcorrencia(false); setAlertaAtivo(null); }}/>
      )}
      <div style={{ position: 'relative', height: 240, overflow: 'hidden', background: '#000' }}>

        {/* Real camera feed */}
        <video ref={videoRef} autoPlay playsInline muted
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
            display: cameraAtiva ? 'block' : 'none' }}/>

        {/* Fallback simulated road view (shown when no camera) */}
        {!cameraAtiva && (
          <>
            <div style={{ position: 'absolute', inset: 0,
              background: `radial-gradient(ellipse at center bottom, rgba(80,90,85,0.4) 0%, transparent 60%),
                           linear-gradient(180deg, #0a0d0c 0%, #1f2724 50%, #2a3530 100%)` }}/>
            <svg width="100%" height="100%" viewBox="0 0 360 240" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0 }}>
              <path d="M180 240 L100 60" stroke="#3a4a44" strokeWidth="2"/>
              <path d="M180 240 L260 60" stroke="#3a4a44" strokeWidth="2"/>
              <path d="M180 240 L180 60" stroke="#5a6e64" strokeWidth="3" strokeDasharray="14 10"/>
            </svg>
            {cameraErro && (
              <div style={{ position: 'absolute', top: 8, left: 0, right: 0, textAlign: 'center',
                fontSize: 10, color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-mono)' }}>
                {cameraErro}
              </div>
            )}
          </>
        )}

        {/* Scanning overlay — always on top */}
        <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)',
          width: 220, height: 64, border: '2px solid #C9A24B', borderRadius: 6,
          boxShadow: '0 0 0 2000px rgba(0,0,0,0.45)' }}>
          <div style={{ position: 'absolute', left: 0, right: 0, height: 2, background: '#C9A24B',
            top: '50%', boxShadow: '0 0 12px #C9A24B', animation: running ? 'scanLine 2s ease-in-out infinite' : 'none' }}/>
        </div>
        <style>{`@keyframes scanLine{0%,100%{top:8%}50%{top:92%}}`}</style>

        {/* Status bar */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 14,
          background: 'rgba(0,0,0,0.55)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: running ? '#7DD896' : '#A8B0AA' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: running ? '#7DD896' : '#A8B0AA' }}/>
            {running ? 'ATIVO' : 'PAUSADO'}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: cameraAtiva ? '#A8D8B8' : '#A8B0AA', fontSize: 10 }}>
            <Icon name="camera" size={11}/>
            {cameraAtiva ? 'CÂMERA' : 'SIM'}
          </span>
          <span style={{ color: '#A8B0AA' }}>SCAN: <b style={{ color: '#FFF' }}>{scanned}</b></span>
          <span style={{ color: '#A8B0AA', marginLeft: 'auto' }}>{indicativo}</span>
        </div>
      </div>

      <div style={{ padding: 10, background: '#0a0d0c', display: 'flex', gap: 8 }}>
        <button onClick={simularAlerta} style={{
          flex: 1, background: 'var(--brand-gold)', color: '#1A1208', border: 'none',
          borderRadius: 8, padding: '10px', fontWeight: 700, fontSize: 12, cursor: 'pointer',
        }}>SIMULAR DETEÇÃO ANPR</button>
        <button onClick={() => setRunning(r => !r)} style={{
          background: 'transparent', border: '1px solid #C9A24B', color: '#C9A24B',
          borderRadius: 8, padding: '0 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer',
        }}>{running ? 'Pausar' : 'Retomar'}</button>
      </div>

      {alertaAtivo && !detalheVisivel && (
        <div style={{ margin: 10, background: tone, color: '#FFF', borderRadius: 'var(--radius-md)', flexShrink: 0,
          animation: 'alertPulse 0.8s ease-in-out infinite alternate' }}>
          <style>{`@keyframes alertPulse{from{box-shadow:0 0 0 0 rgba(199,50,43,0)}to{box-shadow:0 0 0 6px rgba(199,50,43,0.18)}}`}</style>
          <div style={{ padding: '12px 14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <Icon name={alertaAtivo.severidade === 'critico' ? 'alert-octagon' : 'alert-triangle'} size={18}/>
              <div style={{ fontWeight: 700, fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', flex: 1 }}>
                {alertaAtivo.severidade === 'critico' ? 'ALERTA CRÍTICO' : 'AVISO'}
              </div>
              <span className="t-mono" style={{ fontSize: 11 }}>{alertaAtivo.hora}</span>
            </div>
            <div style={{ marginBottom: 8 }}><Plate value={alertaAtivo.matricula} size="lg"/></div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, marginBottom: 4 }}>
              {alertaAtivo.motivo.toUpperCase()}
            </div>
            <div style={{ fontSize: 12, opacity: 0.9, marginBottom: 10 }}>{alertaAtivo.origem}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <button onClick={() => setDetalhe(true)} style={{
                background: 'rgba(255,255,255,0.15)', color: '#FFF', border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: 8, padding: 10, fontWeight: 600, fontSize: 13, cursor: 'pointer',
              }}>Ver detalhes</button>
              {alertaAtivo.confirmado ? (
                <button onClick={() => setRegistarOcorrencia(true)} style={{
                  background: '#C9A24B', color: '#1A1208', border: 'none',
                  borderRadius: 8, padding: 10, fontWeight: 700, fontSize: 12, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                }}>
                  <Icon name="clipboard-list" size={14}/> Registar ocorrência
                </button>
              ) : (
                <button onClick={confirmar} style={{
                  background: '#FFF', color: alertaAtivo.severidade === 'critico' ? 'var(--danger-deep)' : 'var(--warning-deep)',
                  border: 'none', borderRadius: 8, padding: 10, fontWeight: 700, fontSize: 13, cursor: 'pointer',
                }}>Confirmar e atuar</button>
              )}
            </div>
          </div>
        </div>
      )}

      {alertaAtivo && detalheVisivel && (
        <div style={{ flex: 1, background: 'var(--bg)', color: 'var(--fg)', overflowY: 'auto' }}>
          <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button onClick={() => setDetalhe(false)} style={{ background: 'transparent', border: 'none', color: 'var(--fg-muted)', padding: 0, display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, cursor: 'pointer' }}>
              <Icon name="arrow-left" size={14}/> Voltar ao alerta
            </button>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderLeft: `4px solid ${tone}`, borderRadius: 8, padding: 12 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8 }}>
                <Plate value={alertaAtivo.matricula} size="lg"/>
                <Badge tone={alertaAtivo.severidade === 'critico' ? 'danger' : 'warning'}>{alertaAtivo.severidade}</Badge>
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18 }}>{alertaAtivo.motivo}</div>
              <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 2 }}>{alertaAtivo.origem}</div>
            </div>
            <div className="t-overline">DETALHE BNDV</div>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <DetailRow label="Marca/modelo" value="Renault Mégane"/>
              <DetailRow label="Cor" value="Preto"/>
              <DetailRow label="Ano" value="2018"/>
              <DetailRow label="Combustível" value="Gasóleo"/>
              <DetailRow label="Proprietário" value="Particular"/>
              <DetailRow label="Furto comunicado" value="14/08/2024"/>
              <DetailRow label="Local do furto" value="Aveiro"/>
              <DetailRow label="Posto que registou" value="GNR Aveiro"/>
            </div>
            <div className="t-overline">ÚLTIMOS AVISTAMENTOS</div>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8 }}>
              {[
                ['Hoje, 14:32', 'Av. Carvalho Araújo, Vila Real', 'VRL-21'],
                ['Ontem, 22:14', 'A24, saída 18', 'VRL-23'],
                ['25/04, 09:01', 'Régua, EN2', 'RGA-12'],
              ].map((row, i) => (
                <div key={i} style={{ padding: '10px 12px', borderTop: i ? '1px solid var(--border)' : 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Icon name="map-pin" size={16} style={{ color: 'var(--fg-soft)' }}/>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>{row[1]}</div>
                    <div className="t-mono" style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{row[0]} · {row[2]}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {!alertaAtivo.confirmado && (
                <Button tone="danger" size="lg" icon="siren" onClick={confirmar} style={{ width: '100%' }}>
                  Atuar — confirmar SIIOP
                </Button>
              )}
              <button onClick={() => setRegistarOcorrencia(true)} style={{
                background: alertaAtivo.confirmado ? 'var(--brand-green)' : 'var(--surface)',
                color: alertaAtivo.confirmado ? '#FFF' : 'var(--fg)',
                border: '1px solid ' + (alertaAtivo.confirmado ? 'var(--brand-green)' : 'var(--border)'),
                borderRadius: 10, padding: '12px', fontWeight: 700, fontSize: 13, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}>
                <Icon name="clipboard-list" size={16}/> Registar ocorrência
              </button>
            </div>
          </div>
        </div>
      )}

      {!alertaAtivo && (
        <div style={{ flex: 1, background: 'var(--bg)', color: 'var(--fg)', overflowY: 'auto' }}>
          <div style={{ padding: '12px 14px 6px' }} className="t-overline">HISTÓRICO RECENTE · {alertas.length}</div>
          <div style={{ padding: '0 10px 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {alertas.slice(0, 8).map(h => (
              <div key={h.id} style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderLeft: `4px solid ${h.severidade === 'critico' ? 'var(--danger)' : h.severidade === 'aviso' ? 'var(--warning)' : 'var(--info)'}`,
                borderRadius: 8, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <Plate value={h.matricula} size="sm"/>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{h.motivo}</div>
                  <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{h.hora} · {h.local}</div>
                </div>
                {h.confirmado && <Icon name="check" size={16} style={{ color: 'var(--success)' }}/>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const DetailRow = ({ label, value }) => (
  <div>
    <div className="t-overline" style={{ fontSize: 9 }}>{label}</div>
    <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>{value}</div>
  </div>
);

window.ScannerScreenV2 = ScannerScreenV2;
