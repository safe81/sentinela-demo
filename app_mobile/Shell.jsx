/* Sentinela Mobile — Home/Shell with bottom nav */

const HomeScreen = ({ onNav }) => {
  const { useStore } = window.SentinelaStore;
  const me = useStore(s => s.militares.find(x => x.id === s.militarLogadoId));
  const patrulhaAtual = useStore(s => s.patrulhaAtual);
  const ordens = useStore(s => s.ordens);
  const notificacoes = useStore(s => s.notificacoes);
  const alertas = useStore(s => s.alertas);
  const diretivas = useStore(s => s.diretivas);

  const novasOS = ordens.filter(o => o.novo).length;
  const naoLidas = notificacoes.filter(n => !n.lida).length;
  const alertasPorConfirmar = alertas.filter(a => !a.confirmado).length;
  const diretivasPendentes = diretivas.filter(d => !d.feito).length;

  if (!me) return null;

  const StatusBanner = patrulhaAtual ? (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <button onClick={() => onNav('scanner')} style={{
        width: '100%', background: 'linear-gradient(135deg, var(--brand-green) 0%, var(--brand-green-deep) 100%)',
        color: '#FFF', border: 'none', borderRadius: 12, padding: 14, textAlign: 'left', cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{ width: 44, height: 44, background: 'rgba(255,255,255,0.15)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="radio" size={22}/>
        </div>
        <div style={{ flex: 1 }}>
          <div className="t-overline" style={{ color: '#C9A24B', marginBottom: 2 }}>EM PATRULHA · {patrulhaAtual.indicativo}</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16 }}>Scanner ANPR ativo</div>
          <div style={{ fontSize: 11, opacity: 0.85 }}>{alertasPorConfirmar} alertas por confirmar · {diretivasPendentes} diretivas</div>
        </div>
        <Icon name="chevron-right" size={18}/>
      </button>
      <button onClick={() => onNav('fecharPatrulha')} style={{
        width: '100%', background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 10, padding: '10px 14px', textAlign: 'left', cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: 10, color: 'var(--fg)',
      }}>
        <Icon name="check-square" size={18} style={{ color: 'var(--brand-green)' }}/>
        <span style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>Fechar patrulha</span>
        <Icon name="chevron-right" size={14} style={{ color: 'var(--fg-soft)' }}/>
      </button>
    </div>
  ) : (
    <button onClick={() => onNav('abrirPatrulha')} style={{
      width: '100%', background: 'var(--surface)', border: '2px dashed var(--brand-green)', color: 'var(--brand-green)',
      borderRadius: 12, padding: 16, textAlign: 'left', cursor: 'pointer',
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <div style={{ width: 44, height: 44, background: 'var(--brand-green-soft)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="play" size={22}/>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16 }}>Abrir patrulha</div>
        <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>Escolher viatura, parceiro e equipamento</div>
      </div>
      <Icon name="chevron-right" size={18}/>
    </button>
  );

  const QuickAction = ({ icon, label, badge, onClick, color = 'var(--brand-green)' }) => (
    <button onClick={onClick} style={{
      background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10,
      padding: '12px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
      cursor: 'pointer', position: 'relative',
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: 10, background: color === 'var(--danger)' ? 'rgba(199,50,43,0.10)' : 'rgba(31,77,58,0.08)',
        color, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon name={icon} size={20}/>
      </div>
      <div style={{ fontSize: 11, fontWeight: 600, textAlign: 'center', color: 'var(--fg)' }}>{label}</div>
      {badge > 0 && (
        <span style={{ position: 'absolute', top: 8, right: 8, background: 'var(--danger)', color: '#FFF', fontSize: 10, fontWeight: 700, borderRadius: 999, padding: '1px 6px', minWidth: 18, textAlign: 'center' }}>{badge}</span>
      )}
    </button>
  );

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ height: 60, background: 'var(--brand-green-deep)', color: '#FFF', display: 'flex', alignItems: 'center', padding: '0 14px', gap: 12, flexShrink: 0 }}>
        <button onClick={() => onNav('perfil')} style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}>
          <Avatar name={me.nome} size={36} style={{ border: '2px solid #C9A24B' }}/>
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14 }}>{me.postoAbrev} {me.nome.split(' ').slice(-1)[0]}</div>
          <div style={{ fontSize: 11, color: '#C9A24B' }}>{me.indicativo} · {me.secao}</div>
        </div>
        <button onClick={() => onNav('notificacoes')} style={{ background: 'transparent', border: 'none', color: '#FFF', cursor: 'pointer', position: 'relative', padding: 4 }}>
          <Icon name="bell" size={20}/>
          {naoLidas > 0 && <span style={{ position: 'absolute', top: 0, right: 0, background: 'var(--danger)', color: '#FFF', fontSize: 9, fontWeight: 700, borderRadius: 999, padding: '0 5px', minWidth: 14, textAlign: 'center' }}>{naoLidas}</span>}
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 14, background: 'var(--bg)' }}>
        {StatusBanner}

        <div>
          <div className="t-overline" style={{ marginBottom: 8 }}>AÇÕES</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
            <QuickAction icon="scan" label="Scanner" onClick={() => onNav('scanner')}/>
            <QuickAction icon="file-text" label="Auto" onClick={() => onNav('auto')}/>
            <QuickAction icon="message-square" label="Chat" badge={3} onClick={() => onNav('chats')}/>
            <QuickAction icon="siren" label="Pânico" color="var(--danger)" onClick={() => onNav('panico')}/>
          </div>
        </div>

        <div>
          <div className="t-overline" style={{ marginBottom: 8 }}>SERVIÇO</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
            <QuickAction icon="file-text" label="OS" badge={novasOS} onClick={() => onNav('ordens')}/>
            <QuickAction icon="clipboard" label="Briefing" onClick={() => onNav('briefing')}/>
            <QuickAction icon="calendar" label="Escala" onClick={() => onNav('escalas')}/>
            <QuickAction icon="users" label="Lista" onClick={() => onNav('lista')}/>
            <QuickAction icon="sun" label="Férias" onClick={() => onNav('ferias')}/>
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
            <div className="t-overline">ÚLTIMAS DETEÇÕES ANPR</div>
            <button onClick={() => onNav('scanner')} style={{ background: 'transparent', border: 'none', color: 'var(--brand-green)', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>Ver tudo</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {alertas.slice(0, 3).map(a => (
              <div key={a.id} style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderLeft: `4px solid ${a.severidade === 'critico' ? 'var(--danger)' : a.severidade === 'aviso' ? 'var(--warning)' : 'var(--info)'}`,
                borderRadius: 8, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <Plate value={a.matricula} size="sm"/>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.motivo}</div>
                  <div style={{ fontSize: 10, color: 'var(--fg-muted)' }}>{a.hora} · {a.indicativo}</div>
                </div>
                {a.confirmado && <Icon name="check" size={14} style={{ color: 'var(--success)' }}/>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const MobileShellV2 = () => {
  const { useStore } = window.SentinelaStore;
  const meId = useStore(s => s.militarLogadoId);
  const panico = useStore(s => s.panico);

  const [route, setRoute] = React.useState('home');
  const [chatId, setChatId] = React.useState(null);

  if (!meId) return <LoginScreen/>;

  // Pânico ativo overrides everything
  if (panico) return <PanicoScreen onBack={() => setRoute('home')}/>;

  const tabActive = ['home', 'scanner', 'chats', 'ordens', 'perfil'].includes(route);

  let content;
  if (route === 'home') content = <HomeScreen onNav={setRoute}/>;
  else if (route === 'scanner') content = <ScannerScreenV2/>;
  else if (route === 'abrirPatrulha') content = <AbrirPatrulhaScreen onBack={() => setRoute('home')} onDone={() => setRoute('scanner')}/>;
  else if (route === 'fecharPatrulha') content = <FecharPatrulhaScreen onBack={() => setRoute('home')} onDone={() => setRoute('home')}/>;
  else if (route === 'auto') content = <AutoNoticiaScreen onBack={() => setRoute('home')} onDone={() => setRoute('home')}/>;
  else if (route === 'panico') content = <PanicoScreen onBack={() => setRoute('home')}/>;
  else if (route === 'ordens') content = <OrdensScreen onBack={() => setRoute('home')}/>;
  else if (route === 'chats') content = chatId ? <ChatThreadScreen chatId={chatId} onBack={() => setChatId(null)}/> : <ChatListScreen onOpen={setChatId} onBack={() => setRoute('home')}/>;
  else if (route === 'lista') content = <ListaTelefonicaScreen onBack={() => setRoute('home')}/>;
  else if (route === 'briefing') content = <BriefingScreen onBack={() => setRoute('home')}/>;
  else if (route === 'escalas') content = <EscalasScreen onBack={() => setRoute('home')}/>;
  else if (route === 'notificacoes') content = <NotificacoesScreen onBack={() => setRoute('home')}/>;
  else if (route === 'perfil') content = <PerfilScreen onBack={() => setRoute('home')}/>;
  else if (route === 'ferias') content = <FeriasScreen onBack={() => setRoute('home')}/>;
  else content = <HomeScreen onNav={setRoute}/>;

  const TabBtn = ({ id, icon, label }) => {
    const ativo = route === id || (id === 'chats' && route === 'chats');
    return (
      <button onClick={() => { setRoute(id); setChatId(null); }} style={{
        flex: 1, background: 'transparent', border: 'none', cursor: 'pointer',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, padding: '6px 0',
        color: ativo ? 'var(--brand-green)' : 'var(--fg-muted)',
      }}>
        <Icon name={icon} size={20}/>
        <span style={{ fontSize: 10, fontWeight: ativo ? 700 : 500 }}>{label}</span>
      </button>
    );
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {content}
      </div>
      {tabActive && (
        <div style={{
          height: 56, background: 'var(--surface)', borderTop: '1px solid var(--border)',
          display: 'flex', flexShrink: 0, paddingBottom: 4,
        }}>
          <TabBtn id="home" icon="home" label="Início"/>
          <TabBtn id="scanner" icon="scan" label="Scanner"/>
          <TabBtn id="chats" icon="message-square" label="Chat"/>
          <TabBtn id="ordens" icon="file-text" label="OS"/>
          <TabBtn id="perfil" icon="user" label="Perfil"/>
        </div>
      )}
    </div>
  );
};

window.MobileShellV2 = MobileShellV2;
window.HomeScreen = HomeScreen;
