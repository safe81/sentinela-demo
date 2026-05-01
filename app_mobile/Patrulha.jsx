/* Sentinela Mobile — Abertura e Fecho de Patrulha (full forms) */

const AbrirPatrulhaScreen = ({ onBack, onDone }) => {
  const { useStore, actions } = window.SentinelaStore;
  const viaturas = useStore(s => s.viaturas).filter(v => v.estado === 'disponivel');
  const militares = useStore(s => s.militares);
  const meId = useStore(s => s.militarLogadoId);
  const me = militares.find(m => m.id === meId);

  const [step, setStep] = React.useState(1);
  const [viaturaId, setViaturaId] = React.useState(null);
  const [parceiroId, setParceiroId] = React.useState(null);
  const [km, setKm] = React.useState('');
  const [comb, setComb] = React.useState('');
  const [equip, setEquip] = React.useState({
    arma: true, colete: true, radio: true, taser: false, alcoolimetro: true, primeirosocorros: true,
  });

  const viatura = viaturas.find(v => v.id === viaturaId);

  const ScreenHeader = ({ title }) => (
    <div style={{
      height: 52, background: 'var(--brand-green-deep)', color: '#FFF',
      display: 'flex', alignItems: 'center', gap: 10, padding: '0 12px', flexShrink: 0,
    }}>
      <button onClick={onBack} style={{ background: 'transparent', border: 'none', color: '#FFF', display: 'flex', cursor: 'pointer', padding: 4 }}>
        <Icon name="arrow-left" size={20}/>
      </button>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14 }}>{title}</div>
        <div style={{ fontSize: 10, color: '#C9A24B', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Passo {step} de 4</div>
      </div>
    </div>
  );

  // Step 1 — viatura
  if (step === 1) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <ScreenHeader title="Escolher viatura"/>
        <div style={{ flex: 1, overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div className="t-overline">VIATURAS DISPONÍVEIS</div>
          {viaturas.map(v => (
            <button key={v.id} onClick={() => { setViaturaId(v.id); setKm(String(v.km)); setComb(String(v.combustivel)); setStep(2); }} style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderLeft: '4px solid var(--success)',
              borderRadius: 'var(--radius-md)', padding: 12, textAlign: 'left',
              display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
            }}>
              <div style={{ width: 44, height: 44, background: 'var(--surface-2)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="car" size={22} style={{ color: 'var(--brand-green)' }}/>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                  <Plate value={v.matricula} size="sm"/>
                  <Badge tone="brand" size="sm">{v.indicativo}</Badge>
                </div>
                <div style={{ fontSize: 12, color: 'var(--fg-muted)' }}>{v.marca} {v.modelo} · {v.km.toLocaleString('pt-PT')} km · {v.combustivel}%</div>
              </div>
              <Icon name="chevron-right" size={16} style={{ color: 'var(--fg-soft)' }}/>
            </button>
          ))}
          {viaturas.length === 0 && (
            <div style={{ background: 'var(--warning-soft)', color: 'var(--warning-deep)', padding: 14, borderRadius: 'var(--radius-md)', fontSize: 13 }}>
              Sem viaturas disponíveis. Contacta o comando.
            </div>
          )}
        </div>
      </div>
    );
  }

  // Step 2 — parceiro
  if (step === 2) {
    const parceiros = militares.filter(m => m.id !== meId && m.estado !== 'patrulha');
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <ScreenHeader title="Escolher patrulheiro"/>
        <div style={{ flex: 1, overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button onClick={() => { setParceiroId(null); setStep(3); }} style={{
            background: 'var(--surface-2)', border: '1px dashed var(--border-strong)',
            borderRadius: 'var(--radius-md)', padding: 12, textAlign: 'left',
            display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
          }}>
            <Icon name="user" size={20} style={{ color: 'var(--fg-soft)' }}/>
            <div style={{ flex: 1, fontSize: 13, color: 'var(--fg-muted)' }}>Sair sozinho (sem parceiro)</div>
          </button>
          <div className="t-overline" style={{ marginTop: 8 }}>DISPONÍVEIS</div>
          {parceiros.map(m => (
            <button key={m.id} onClick={() => { setParceiroId(m.id); setStep(3); }} style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)', padding: 10, textAlign: 'left',
              display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
            }}>
              <Avatar name={m.nome} size={38}/>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{m.postoAbrev} {m.nome}</div>
                <div className="t-mono" style={{ fontSize: 11, color: 'var(--fg-muted)' }}>NIM {m.nim}</div>
              </div>
              <StatusDot tone={m.estado === 'servico' ? 'success' : 'muted'}/>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Step 3 — KM, combustível
  if (step === 3) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <ScreenHeader title="Estado da viatura"/>
        <div style={{ flex: 1, overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ background: 'var(--surface-2)', borderRadius: 'var(--radius-md)', padding: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Plate value={viatura.matricula} size="sm"/>
            <div style={{ fontSize: 12, color: 'var(--fg-muted)' }}>{viatura.marca} {viatura.modelo} · {viatura.indicativo}</div>
          </div>

          <FormField label="Quilómetros iniciais">
            <input type="number" value={km} onChange={e => setKm(e.target.value)} className="form-input mono"/>
          </FormField>
          <FormField label="Combustível inicial (%)">
            <input type="number" min="0" max="100" value={comb} onChange={e => setComb(e.target.value)} className="form-input mono"/>
            <input type="range" min="0" max="100" value={comb} onChange={e => setComb(e.target.value)} style={{ width: '100%', marginTop: 6, accentColor: 'var(--brand-green)' }}/>
          </FormField>

          <Button tone="primary" size="lg" onClick={() => setStep(4)} style={{ width: '100%' }} icon="arrow-right">Continuar</Button>
        </div>
      </div>
    );
  }

  // Step 4 — equipamento
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <ScreenHeader title="Equipamento de patrulha"/>
      <div style={{ flex: 1, overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div className="t-overline" style={{ marginBottom: 4 }}>CONFIRMA O EQUIPAMENTO LEVADO</div>
        {[
          ['arma', 'Arma de serviço'],
          ['colete', 'Colete balístico'],
          ['radio', 'Rádio SIRESP'],
          ['taser', 'Taser X26'],
          ['alcoolimetro', 'Alcoolímetro'],
          ['primeirosocorros', 'Primeiros socorros'],
        ].map(([k, label]) => (
          <button key={k} onClick={() => setEquip(e => ({ ...e, [k]: !e[k] }))} style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)', padding: 12, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', textAlign: 'left',
          }}>
            <Icon name={equip[k] ? 'check-square' : 'square'} size={20} style={{ color: equip[k] ? 'var(--success)' : 'var(--fg-soft)' }}/>
            <div style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{label}</div>
          </button>
        ))}
        <div style={{ marginTop: 14, padding: 12, background: 'var(--info-soft)', color: 'var(--info-deep)', fontSize: 12, borderRadius: 'var(--radius-md)' }}>
          <Icon name="alert-triangle" size={14} style={{ verticalAlign: 'text-bottom', marginRight: 6 }}/>
          O comando do posto será notificado da abertura.
        </div>
        <Button tone="primary" size="lg" icon="shield" onClick={() => {
          actions.abrirPatrulha({
            viaturaId, parceiroId,
            kmInicial: Number(km), combustivelInicial: Number(comb),
            equipamento: Object.keys(equip).filter(k => equip[k]),
          });
          onDone();
        }} style={{ width: '100%', marginTop: 8 }}>
          Confirmar e iniciar patrulha
        </Button>
      </div>
    </div>
  );
};

/* GPS tracking hook — runs while patrol is open */
const useGPSTracking = (ativa) => {
  React.useEffect(() => {
    if (!ativa || !navigator.geolocation) return;
    const watchId = navigator.geolocation.watchPosition(
      pos => {
        window.SentinelaStore.actions.addPontoRota({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => {},
      { enableHighAccuracy: true, maximumAge: 20000, timeout: 30000 }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, [ativa]);
};

const FecharPatrulhaScreen = ({ onBack, onDone }) => {
  const { useStore, actions } = window.SentinelaStore;
  const patrulha = useStore(s => s.patrulhaAtual);
  const viatura = useStore(s => s.viaturas).find(v => v.id === patrulha?.viaturaId);
  const rotaAtual = useStore(s => s.rotaAtual);
  const ocorrencias = useStore(s => s.ocorrencias);
  const [km, setKm] = React.useState(String((patrulha?.kmInicial || 0) + 40));
  const [comb, setComb] = React.useState(String(Math.max(0, (patrulha?.combustivelInicial || 50) - 18)));
  const [obs, setObs] = React.useState('');
  const [danos, setDanos] = React.useState(false);

  // Start GPS tracking while patrol screen is open
  useGPSTracking(!!patrulha);

  if (!patrulha) {
    return <div style={{ padding: 24 }}>Sem patrulha ativa.</div>;
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{
        height: 52, background: 'var(--brand-green-deep)', color: '#FFF',
        display: 'flex', alignItems: 'center', gap: 10, padding: '0 12px',
      }}>
        <button onClick={onBack} style={{ background: 'transparent', border: 'none', color: '#FFF', display: 'flex', cursor: 'pointer', padding: 4 }}>
          <Icon name="arrow-left" size={20}/>
        </button>
        <div style={{ flex: 1, fontWeight: 600, fontSize: 14, fontFamily: 'var(--font-display)' }}>Fechar patrulha</div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ background: 'var(--surface-2)', borderRadius: 'var(--radius-md)', padding: 12 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
            <Plate value={viatura?.matricula} size="sm"/>
            <Badge tone="brand" size="sm">{patrulha.indicativo}</Badge>
          </div>
          <div className="t-mono" style={{ fontSize: 11, color: 'var(--fg-muted)' }}>
            Início: {new Date(patrulha.abertaEm).toLocaleTimeString('pt-PT', {hour:'2-digit',minute:'2-digit'})} · KM ini.: {patrulha.kmInicial.toLocaleString('pt-PT')} · Comb. ini.: {patrulha.combustivelInicial}%
          </div>
        </div>

        <FormField label="Quilómetros finais">
          <input type="number" value={km} onChange={e => setKm(e.target.value)} className="form-input mono"/>
          <div style={{ fontSize: 11, color: 'var(--fg-muted)', marginTop: 4 }} className="t-mono">
            Percorridos: {Math.max(0, Number(km) - patrulha.kmInicial)} km
          </div>
        </FormField>
        <FormField label="Combustível final (%)">
          <input type="range" min="0" max="100" value={comb} onChange={e => setComb(e.target.value)} style={{ width: '100%', accentColor: 'var(--brand-green)' }}/>
          <div className="t-mono" style={{ fontSize: 13, fontWeight: 600 }}>{comb}%</div>
        </FormField>
        <FormField label="Houve danos na viatura?">
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setDanos(false)} style={tabBtn(!danos)}>Não</button>
            <button onClick={() => setDanos(true)} style={tabBtn(danos)}>Sim</button>
          </div>
        </FormField>
        <FormField label="Observações">
          <textarea value={obs} onChange={e => setObs(e.target.value)} placeholder="Notas sobre a patrulha…" className="form-input" style={{ minHeight: 80, fontFamily: 'var(--font-ui)' }}/>
        </FormField>

        {(rotaAtual.length > 0 || ocorrencias.length > 0) && (
          <div style={{ background: 'var(--surface-2)', borderRadius: 8, padding: '10px 12px', display: 'flex', gap: 16 }}>
            {rotaAtual.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                <Icon name="map-pin" size={14} style={{ color: 'var(--brand-green)' }}/>
                <span style={{ color: 'var(--fg-muted)' }}>{rotaAtual.length} pontos GPS gravados</span>
              </div>
            )}
            {ocorrencias.filter(o => o.indicativo === patrulha.indicativo).length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                <Icon name="clipboard-list" size={14} style={{ color: 'var(--brand-green)' }}/>
                <span style={{ color: 'var(--fg-muted)' }}>{ocorrencias.filter(o => o.indicativo === patrulha.indicativo).length} ocorrências</span>
              </div>
            )}
          </div>
        )}
        <Button tone="primary" size="lg" icon="check" onClick={() => {
          actions.fecharPatrulha({ kmFinal: Number(km), combustivelFinal: Number(comb), observacoes: obs });
          onDone();
        }} style={{ width: '100%', marginTop: 4 }}>
          Confirmar fecho · gerar relatório
        </Button>
        <button onClick={() => window.print()} style={{
          background: 'transparent', border: 'none', color: 'var(--brand-green)',
          fontSize: 12, fontWeight: 600, padding: 8, cursor: 'pointer',
          textDecoration: 'underline', textUnderlineOffset: 3,
        }}>
          Imprimir relatório de turno →
        </button>
      </div>
    </div>
  );
};

const tabBtn = (active) => ({
  flex: 1,
  background: active ? 'var(--brand-green)' : 'var(--surface)',
  color: active ? '#FFF' : 'var(--fg)',
  border: '1px solid ' + (active ? 'var(--brand-green)' : 'var(--border-strong)'),
  borderRadius: 'var(--radius-md)', padding: '10px', cursor: 'pointer',
  fontSize: 13, fontWeight: 600,
});

const FormField = ({ label, children }) => (
  <div>
    <div className="t-overline" style={{ marginBottom: 4 }}>{label}</div>
    {children}
  </div>
);

Object.assign(window, { AbrirPatrulhaScreen, FecharPatrulhaScreen, FormField });
