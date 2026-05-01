/* Sentinela Mobile — Pânico, Auto de Notícia, Ordens, Outros */

const PanicoScreen = ({ onBack }) => {
  const { useStore, actions } = window.SentinelaStore;
  const panico = useStore(s => s.panico);
  const me = useStore(s => s.militares.find(x => x.id === s.militarLogadoId));
  const [confirming, setConfirming] = React.useState(false);
  const [holdProgress, setHoldProgress] = React.useState(0);
  const [gpsStatus, setGpsStatus] = React.useState(null); // null | 'a obter' | 'obtido' | 'sem gps'
  const holdRef = React.useRef(null);

  const activarComGPS = () => {
    if (!navigator.geolocation) {
      actions.activarPanico(null);
      return;
    }
    setGpsStatus('a obter');
    navigator.geolocation.getCurrentPosition(
      pos => {
        setGpsStatus('obtido');
        actions.activarPanico({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => {
        setGpsStatus('sem gps');
        actions.activarPanico(null);
      },
      { timeout: 6000, enableHighAccuracy: true }
    );
  };

  const startHold = () => {
    holdRef.current = setInterval(() => {
      setHoldProgress(p => {
        if (p >= 100) {
          clearInterval(holdRef.current);
          activarComGPS();
          return 100;
        }
        return p + 4;
      });
    }, 40);
  };
  const stopHold = () => {
    clearInterval(holdRef.current);
    if (holdProgress < 100) setHoldProgress(0);
  };

  if (panico) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--danger)', color: '#FFF' }}>
        <div style={{ height: 52, display: 'flex', alignItems: 'center', padding: '0 12px', gap: 10, background: 'rgba(0,0,0,0.2)' }}>
          <button onClick={onBack} style={{ background: 'transparent', border: 'none', color: '#FFF', display: 'flex', cursor: 'pointer' }}>
            <Icon name="arrow-left" size={20}/>
          </button>
          <div style={{ flex: 1, fontWeight: 700, fontSize: 14, fontFamily: 'var(--font-display)' }}>PEDIDO DE REFORÇO ATIVO</div>
        </div>
        <div style={{ flex: 1, padding: 18, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, textAlign: 'center' }}>
          <div style={{ width: 96, height: 96, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'panicPulse 1s infinite' }}>
            <Icon name="siren" size={56}/>
          </div>
          <style>{`@keyframes panicPulse{0%,100%{box-shadow:0 0 0 0 rgba(255,255,255,0.5)}50%{box-shadow:0 0 0 18px rgba(255,255,255,0)}}`}</style>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700 }}>Comando notificado</div>
          <div style={{ fontSize: 13, opacity: 0.9, display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
            <Icon name="map-pin" size={14}/>
            {panico.lat != null
              ? `${panico.lat.toFixed(5)}°N, ${Math.abs(panico.lng).toFixed(5)}°W${panico.gpsReal ? ' · GPS real' : ''}`
              : 'Localização não disponível'}
          </div>

          <div style={{ width: '100%', background: 'rgba(0,0,0,0.2)', borderRadius: 8, padding: 14, marginTop: 8 }}>
            <div className="t-overline" style={{ color: '#FFD9D6' }}>PATRULHAS A CAMINHO</div>
            <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {(panico.reforcos.length ? panico.reforcos : ['VRL-22', 'VRL-23']).map(r => (
                <div key={r} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}>
                  <Icon name="shield" size={16}/> <b>{r}</b>
                  <span style={{ marginLeft: 'auto', fontSize: 11, opacity: 0.85 }} className="t-mono">a caminho</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 'auto', width: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button onClick={() => actions.cancelarPanico()} style={{
              width: '100%', background: '#FFF', color: 'var(--danger-deep)', border: 'none',
              borderRadius: 8, padding: 14, fontWeight: 700, fontSize: 14, cursor: 'pointer',
            }}>Cancelar pedido</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      <div style={{ height: 52, background: 'var(--brand-green-deep)', color: '#FFF', display: 'flex', alignItems: 'center', padding: '0 12px', gap: 10 }}>
        <button onClick={onBack} style={{ background: 'transparent', border: 'none', color: '#FFF', display: 'flex', cursor: 'pointer' }}>
          <Icon name="arrow-left" size={20}/>
        </button>
        <div style={{ flex: 1, fontWeight: 600, fontSize: 14, fontFamily: 'var(--font-display)' }}>Pedir reforços</div>
      </div>
      <div style={{ flex: 1, padding: 22, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18, textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700 }}>Mantém premido para enviar</div>
        <div style={{ fontSize: 13, color: 'var(--fg-muted)' }}>O comando do posto e as patrulhas próximas serão notificadas com a tua localização GPS.</div>

        <button
          onMouseDown={startHold} onMouseUp={stopHold} onMouseLeave={stopHold}
          onTouchStart={startHold} onTouchEnd={stopHold}
          style={{
            width: 200, height: 200, borderRadius: '50%', background: 'var(--danger)',
            color: '#FFF', border: '6px solid rgba(199,50,43,0.25)', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8,
            position: 'relative', overflow: 'hidden',
          }}>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: `${holdProgress}%`, background: 'rgba(0,0,0,0.2)' }}/>
          <Icon name="siren" size={56} style={{ position: 'relative' }}/>
          <div style={{ fontWeight: 700, fontSize: 14, letterSpacing: '0.08em', position: 'relative' }}>MANTÉM PREMIDO</div>
        </button>

        {gpsStatus === 'a obter' && (
          <div style={{ background: 'var(--warning-soft)', color: 'var(--warning-deep)', padding: 10, borderRadius: 8, fontSize: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon name="map-pin" size={14}/> A obter localização GPS...
          </div>
        )}
        <div style={{ background: 'var(--info-soft)', color: 'var(--info-deep)', padding: 12, borderRadius: 8, fontSize: 12, maxWidth: 320 }}>
          Em caso de emergência médica, marca também 112.
        </div>
      </div>
    </div>
  );
};

const AutoNoticiaScreen = ({ onBack, onDone }) => {
  const { actions } = window.SentinelaStore;
  const [tipo, setTipo] = React.useState('contraordenacao');
  const [matricula, setMat] = React.useState('');
  const [interv, setInterv] = React.useState('');
  const [descricao, setDesc] = React.useState('');
  const [fotos, setFotos] = React.useState([]);
  const [assinado, setAssinado] = React.useState(false);
  const [step, setStep] = React.useState(1);

  const Header = ({ title }) => (
    <div style={{ height: 52, background: 'var(--brand-green-deep)', color: '#FFF', display: 'flex', alignItems: 'center', padding: '0 12px', gap: 10 }}>
      <button onClick={onBack} style={{ background: 'transparent', border: 'none', color: '#FFF', display: 'flex', cursor: 'pointer' }}><Icon name="arrow-left" size={20}/></button>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14 }}>{title}</div>
        <div style={{ fontSize: 10, color: '#C9A24B', fontWeight: 600, letterSpacing: '0.06em' }}>PASSO {step}/3</div>
      </div>
    </div>
  );

  if (step === 1) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Header title="Auto de notícia"/>
        <div style={{ flex: 1, overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <FormField label="Tipo de auto">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              {[['contraordenacao', 'Contraordenação'],['crime','Crime'],['acidente','Acidente'],['outro','Outro']].map(([v,l]) => (
                <button key={v} onClick={() => setTipo(v)} style={{
                  background: tipo === v ? 'var(--brand-green)' : 'var(--surface)',
                  color: tipo === v ? '#FFF' : 'var(--fg)',
                  border: '1px solid ' + (tipo === v ? 'var(--brand-green)' : 'var(--border-strong)'),
                  borderRadius: 8, padding: 10, cursor: 'pointer', fontSize: 12, fontWeight: 600,
                }}>{l}</button>
              ))}
            </div>
          </FormField>
          <FormField label="Matrícula envolvida (opcional)">
            <input value={matricula} onChange={e => setMat(e.target.value.toUpperCase())} placeholder="00-AA-00" className="form-input mono"/>
          </FormField>
          <FormField label="Local da ocorrência">
            <input defaultValue="Av. Carvalho Araújo, Vila Real" className="form-input"/>
          </FormField>
          <FormField label="Data/hora">
            <input defaultValue="28/04/2026 14:32" className="form-input mono"/>
          </FormField>
          <Button tone="primary" size="lg" onClick={() => setStep(2)} icon="arrow-right" style={{ width: '100%' }}>Continuar</Button>
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Header title="Intervenientes e descrição"/>
        <div style={{ flex: 1, overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <FormField label="Identificação dos intervenientes">
            <textarea value={interv} onChange={e => setInterv(e.target.value)} placeholder="Nome, NIF, morada…" className="form-input" style={{ minHeight: 70 }}/>
          </FormField>
          <FormField label="Descrição dos factos">
            <textarea value={descricao} onChange={e => setDesc(e.target.value)} placeholder="Descrição circunstanciada…" className="form-input" style={{ minHeight: 120 }}/>
          </FormField>
          <FormField label="Fotos / evidências">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {fotos.map((_, i) => (
                <div key={i} style={{ aspectRatio: '1', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="image" size={28} style={{ color: 'var(--fg-soft)' }}/>
                </div>
              ))}
              <button onClick={() => setFotos(f => [...f, {}])} style={{
                aspectRatio: '1', background: 'var(--surface)', border: '2px dashed var(--border-strong)',
                borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--fg-soft)',
              }}>
                <Icon name="plus" size={24}/>
              </button>
            </div>
          </FormField>
          <Button tone="primary" size="lg" onClick={() => setStep(3)} icon="arrow-right" style={{ width: '100%' }}>Continuar</Button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <Header title="Assinatura e submissão"/>
      <div style={{ flex: 1, overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ background: 'var(--surface-2)', borderRadius: 8, padding: 12, fontSize: 12 }}>
          <div className="t-overline" style={{ marginBottom: 6 }}>RESUMO</div>
          <div><b>Tipo:</b> {tipo}</div>
          {matricula && <div><b>Matrícula:</b> {matricula}</div>}
          <div><b>Fotos:</b> {fotos.length}</div>
        </div>
        <FormField label="Assinatura digital">
          <div onClick={() => setAssinado(!assinado)} style={{
            height: 120, background: 'var(--surface)', border: '1px dashed var(--border-strong)',
            borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            color: assinado ? 'var(--success)' : 'var(--fg-soft)',
          }}>
            {assinado ? (
              <div style={{ textAlign: 'center' }}>
                <svg width="120" height="50" viewBox="0 0 120 50">
                  <path d="M5 35 Q 15 5, 30 25 T 55 30 Q 70 15, 85 35 L 110 20" stroke="var(--brand-green)" strokeWidth="2" fill="none"/>
                </svg>
                <div style={{ fontSize: 11, fontWeight: 600 }}>Assinado</div>
              </div>
            ) : <span>Toca para assinar</span>}
          </div>
        </FormField>
        <Button tone="primary" size="lg" icon="check" disabled={!assinado} onClick={() => {
          actions.submeterAuto({ tipo, matricula, intervenientes: interv, descricao, fotos: fotos.length });
          onDone();
        }} style={{ width: '100%', opacity: assinado ? 1 : 0.5 }}>
          Submeter auto
        </Button>
      </div>
    </div>
  );
};

const OrdensScreen = ({ onBack }) => {
  const { useStore, actions } = window.SentinelaStore;
  const ordens = useStore(s => s.ordens);
  const [aberta, setAberta] = React.useState(null);

  if (aberta) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ height: 52, background: 'var(--brand-green-deep)', color: '#FFF', display: 'flex', alignItems: 'center', padding: '0 12px', gap: 10 }}>
          <button onClick={() => setAberta(null)} style={{ background: 'transparent', border: 'none', color: '#FFF', display: 'flex', cursor: 'pointer' }}><Icon name="arrow-left" size={20}/></button>
          <div style={{ flex: 1, fontWeight: 600, fontSize: 13, fontFamily: 'var(--font-display)' }}>{aberta.titulo}</div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: 14, background: 'var(--bg)' }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: 18, fontSize: 13, lineHeight: '20px' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{aberta.titulo}</div>
            <div style={{ fontSize: 11, color: 'var(--fg-muted)', marginBottom: 14 }}>{aberta.autor} · {aberta.data} · {aberta.paginas} páginas</div>
            <p style={{ margin: '0 0 10px' }}>1. Em cumprimento de despacho do Comando Territorial, é determinada a realização de Operação STOP nas saídas da A24 e EN2, no período compreendido entre as 22:00 e as 02:00.</p>
            <p style={{ margin: '0 0 10px' }}>2. Serão afetas as patrulhas VRL-21, VRL-22 e VRL-23, com reforço pedestre na zona do centro histórico.</p>
            <p style={{ margin: '0 0 10px' }}>3. O foco operacional é a fiscalização de condução sob influência, documentos de viatura e seguro.</p>
            <p style={{ margin: '0 0 10px' }}>4. Articulação com NICAV de Vila Real para os casos de presença de drogas.</p>
            <p style={{ margin: 0, color: 'var(--fg-muted)' }}>— Sarg. Costa Ribeiro, Cmdt. Posto Territorial</p>
          </div>
          <Button tone="primary" size="lg" icon="check" onClick={() => { actions.marcarOSLida(aberta.id); setAberta(null); }} style={{ width: '100%', marginTop: 14 }}>
            Confirmar leitura
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: 52, background: 'var(--brand-green-deep)', color: '#FFF', display: 'flex', alignItems: 'center', padding: '0 12px', gap: 10 }}>
        <button onClick={onBack} style={{ background: 'transparent', border: 'none', color: '#FFF', display: 'flex', cursor: 'pointer' }}><Icon name="arrow-left" size={20}/></button>
        <div style={{ flex: 1, fontWeight: 600, fontSize: 14, fontFamily: 'var(--font-display)' }}>Ordens de serviço</div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {ordens.map(o => (
          <button key={o.id} onClick={() => setAberta(o)} style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 8, padding: 12, textAlign: 'left', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{ width: 32, height: 40, background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ fontSize: 8, fontWeight: 700, color: 'var(--danger-deep)' }}>PDF</div>
              <div className="t-mono" style={{ fontSize: 9 }}>{o.paginas}p</div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{o.titulo}</span>
                {o.novo && <Badge tone="danger" size="sm">NOVA</Badge>}
              </div>
              <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{o.autor} · {o.data}</div>
            </div>
            <Icon name="chevron-right" size={16} style={{ color: 'var(--fg-soft)' }}/>
          </button>
        ))}
      </div>
    </div>
  );
};

Object.assign(window, { PanicoScreen, AutoNoticiaScreen, OrdensScreen });
