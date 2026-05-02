/* Sentinela Mobile — Emergência e Reforço */

const EmergenciaScreen = ({ onBack, store }) => {
  const { useStore, actions } = window.SentinelaStore;
  const patrulhaAtual = useStore(s => s.patrulhaAtual);
  const me = useStore(s => s.militares.find(x => x.id === s.militarLogadoId));

  const [modoEmergencia, setModoEmergencia] = React.useState(false);
  const [pressaoAtiva, setPressaoAtiva] = React.useState(false);
  const [progresso, setProgresso] = React.useState(0);
  const [reforcoEnviado, setReforcoEnviado] = React.useState(false);
  const [timerRef, setTimerRef] = React.useState(null);

  const DURACAO_SEGUNDOS = 2;

  const iniciarPressao = () => {
    setPressaoAtiva(true);
    setProgresso(0);
    const inicio = Date.now();
    const intervalo = setInterval(() => {
      const elapsed = (Date.now() - inicio) / 1000;
      const pct = Math.min((elapsed / DURACAO_SEGUNDOS) * 100, 100);
      setProgresso(pct);
      if (pct >= 100) {
        clearInterval(intervalo);
        setPressaoAtiva(false);
        setReforcoEnviado(true);
        setModoEmergencia(true);
      }
    }, 50);
    setTimerRef(intervalo);
  };

  const cancelarPressao = () => {
    if (timerRef) clearInterval(timerRef);
    setPressaoAtiva(false);
    setProgresso(0);
  };

  const cancelarEmergencia = () => {
    setModoEmergencia(false);
    setReforcoEnviado(false);
    setProgresso(0);
  };

  // Approximate GPS position mock
  const localizacao = {
    nome: patrulhaAtual ? 'Localização da Patrulha' : 'Posto GNR — Vila Real',
    coords: '41.2987° N, 7.7425° W',
    precisao: '± 5m',
  };

  const postoMaisProximo = 'Comando Territorial de Vila Real';

  if (reforcoEnviado && modoEmergencia) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--danger-soft)' }}>
        {/* Header vermelho */}
        <div style={{ height: 52, background: 'var(--danger)', color: '#FFF', display: 'flex', alignItems: 'center', padding: '0 12px', gap: 10 }}>
          <button onClick={onBack} style={{ background: 'transparent', border: 'none', color: '#FFF', display: 'flex', cursor: 'pointer', padding: 4 }}>
            <Icon name="arrow-left" size={20}/>
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 14, fontFamily: 'var(--font-display)' }}>ESTADO DE ALERTA</div>
            <div style={{ fontSize: 10 }}>Modo de Emergência Ativo</div>
          </div>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FFF', animation: 'pulse 1s infinite' }}/>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Confirmação */}
          <div style={{ background: 'var(--danger)', color: '#FFF', borderRadius: 12, padding: 20, textAlign: 'center' }}>
            <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="shield" size={30}/>
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, marginBottom: 6 }}>REFORÇO SOLICITADO</div>
            <div style={{ fontSize: 12, opacity: 0.9 }}>Alerta de pânico enviado para a Central de Comando</div>
          </div>

          {/* Localização */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <Icon name="map-pin" size={16} style={{ color: 'var(--danger)' }}/>
              <div className="t-overline">LOCALIZAÇÃO GPS ATUAL</div>
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{localizacao.nome}</div>
            <div className="t-mono" style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{localizacao.coords} · Precisão: {localizacao.precisao}</div>
            <div style={{ height: 100, background: 'var(--surface-2)', borderRadius: 8, marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="map" size={32} style={{ color: 'var(--fg-soft)' }}/>
            </div>
          </div>

          {/* Timer e posto */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <Icon name="clock" size={14} style={{ color: 'var(--warning)' }}/>
                <div className="t-overline" style={{ fontSize: 9 }}>TEMPO DE CONFIRMAÇÃO</div>
              </div>
              <div className="t-mono" style={{ fontSize: 18, fontWeight: 700, color: 'var(--warning)' }}>~ 45s</div>
              <div style={{ fontSize: 10, color: 'var(--fg-muted)' }}>ESTIMADO</div>
            </div>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <Icon name="radio" size={14} style={{ color: 'var(--brand-green)' }}/>
                <div className="t-overline" style={{ fontSize: 9 }}>POSTO MAIS PRÓXIMO</div>
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, lineHeight: '16px' }}>{postoMaisProximo}</div>
            </div>
          </div>

          {/* Cancelar */}
          <button onClick={cancelarEmergencia} style={{
            width: '100%', background: 'var(--surface)', border: '2px solid var(--danger)', borderRadius: 10,
            padding: '13px 0', fontSize: 14, fontWeight: 700, color: 'var(--danger)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            <Icon name="x-circle" size={18}/>
            Cancelar Alerta de Emergência
          </button>
        </div>
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
          <div style={{ fontWeight: 600, fontSize: 14, fontFamily: 'var(--font-display)' }}>Emergência e Reforço</div>
          <div style={{ fontSize: 10, color: '#C9A24B' }}>
            {patrulhaAtual ? `Patrulha ${patrulhaAtual.indicativo} · Em serviço` : 'Fora de patrulha'}
          </div>
        </div>
        <Icon name="alert-triangle" size={18}/>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', background: 'var(--bg)', padding: '16px 14px', display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Botão de pânico principal */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 20, textAlign: 'center' }}>
          <div className="t-overline" style={{ color: 'var(--danger)', marginBottom: 16 }}>PEDIDO DE REFORÇO IMEDIATO</div>

          <button
            onMouseDown={iniciarPressao}
            onMouseUp={cancelarPressao}
            onMouseLeave={cancelarPressao}
            onTouchStart={iniciarPressao}
            onTouchEnd={cancelarPressao}
            style={{
              width: 130, height: 130, borderRadius: '50%',
              background: pressaoAtiva
                ? `conic-gradient(var(--danger) ${progresso * 3.6}deg, var(--danger-soft) 0deg)`
                : 'var(--danger)',
              border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 8, color: '#FFF',
              margin: '0 auto 16px', boxShadow: 'var(--shadow-glow-danger)',
              transition: 'transform 0.1s',
              transform: pressaoAtiva ? 'scale(0.96)' : 'scale(1)',
            }}
          >
            <Icon name="shield" size={36}/>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>
              {pressaoAtiva ? `${Math.round(progresso)}%` : 'PÂNICO'}
            </span>
          </button>

          <div style={{ fontSize: 12, color: 'var(--fg-muted)', lineHeight: '17px' }}>
            Pressione e segure por {DURACAO_SEGUNDOS} segundos para confirmar o envio do alerta de pânico para a Central de Comando
          </div>
        </div>

        {/* Localização atual */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <Icon name="map-pin" size={15} style={{ color: 'var(--brand-green)' }}/>
            <div className="t-overline">LOCALIZAÇÃO GPS ATUAL</div>
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{localizacao.nome}</div>
          <div className="t-mono" style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{localizacao.coords} · Precisão: {localizacao.precisao}</div>
          <div style={{ height: 80, background: 'var(--surface-2)', borderRadius: 8, marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="map" size={28} style={{ color: 'var(--fg-soft)' }}/>
          </div>
        </div>

        {/* Info: Posto próximo */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <Icon name="radio" size={18} style={{ color: 'var(--brand-green)', flexShrink: 0 }}/>
          <div style={{ flex: 1 }}>
            <div className="t-overline" style={{ marginBottom: 2 }}>POSTO MAIS PRÓXIMO</div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{postoMaisProximo}</div>
          </div>
        </div>

        {/* Ações secundárias */}
        <div>
          <div className="t-overline" style={{ marginBottom: 8 }}>AÇÕES RÁPIDAS</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[
              { icon: 'phone-call', label: 'Ligar 112', cor: 'var(--danger)' },
              { icon: 'radio', label: 'Contactar Central', cor: 'var(--brand-green)' },
              { icon: 'users', label: 'Pedir Reforço', cor: 'var(--info)' },
              { icon: 'message-square', label: 'Enviar Localização', cor: 'var(--warning)' },
            ].map(({ icon, label, cor }) => (
              <button key={label} style={{
                background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10,
                padding: '14px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                cursor: 'pointer',
              }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: cor }}>
                  <Icon name={icon} size={20}/>
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--fg)', textAlign: 'center' }}>{label}</span>
              </button>
            ))}
          </div>
        </div>

        <div style={{ height: 8 }}/>
      </div>
    </div>
  );
};

window.EmergenciaScreen = EmergenciaScreen;
