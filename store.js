/* Sentinela — Shared State Store v3
   Cross-device sync via BroadcastChannel + persistence via localStorage.
   Single source of truth for both mobile.html and pc.html. */

(function() {
  const STORAGE_KEY = 'sentinela.state.v3';
  const CHANNEL_NAME = 'sentinela.sync.v3';

  /* ---------------- Initial state ---------------- */
  const D = window.SENTINELA_DATA;

  const initialState = {
    /* Auth */
    militarLogadoId: null, // null = login screen

    /* Patrulha state */
    patrulhaAtual: null, // { id, viaturaId, militares:[], kmInicial, combustivelInicial, abertaEm, parceiroId, equipamento:[] }
    patrulhasHistorico: [
      { id: 'p_001', viaturaId: 'v1', militares: ['m_silva', 'm_lopes'], kmInicial: 184142, kmFinal: 184326, combustivelInicial: 95, combustivelFinal: 78, abertaEm: '2026-04-28T08:00:00', fechadaEm: null, indicativo: 'VRL-21' },
      { id: 'p_002', viaturaId: 'v2', militares: ['m_santos', 'm_fonseca'], kmInicial: 91987, kmFinal: 92118, combustivelInicial: 60, combustivelFinal: 42, abertaEm: '2026-04-28T08:00:00', fechadaEm: null, indicativo: 'VRL-22' },
      { id: 'p_003', viaturaId: 'v3', militares: ['m_pereira', 'm_braga'], kmInicial: 211238, kmFinal: 211440, combustivelInicial: 50, combustivelFinal: 18, abertaEm: '2026-04-28T08:00:00', fechadaEm: null, indicativo: 'VRL-23' },
      { id: 'p_h1',  viaturaId: 'v4', militares: ['m_silva','m_lopes'],   kmInicial: 67050, kmFinal: 67220, combustivelInicial: 100, combustivelFinal: 95, abertaEm: '2026-04-27T08:00:00', fechadaEm: '2026-04-27T20:12:00', indicativo: 'VRL-30' },
    ],

    /* ANPR alerts (live feed) */
    alertas: D.alertasANPR.map(a => ({ ...a })),

    /* Vehicles, militares, etc — copies so we can mutate */
    viaturas: D.viaturas.map(v => ({ ...v })),
    militares: D.militares.map(m => ({ ...m })),

    /* Service orders */
    ordens: D.ordensServico.map(o => ({ ...o, lidoPor: o.novo ? [] : ['m_silva'] })),

    /* Directives for active patrol */
    diretivas: D.diretivasPatrulha.map(d => ({ ...d })),

    /* Chat threads */
    chats: {
      'c1': { id: 'c1', tipo: 'posto', nome: 'Posto VRL — Geral', mensagens: [
        { de: 'm_marques', texto: 'Bom dia. Briefing das 08:00 disponível na OS 045.', hora: '08:02' },
        { de: 'm_costa',   texto: 'Atenção ao Clio preto 89-NM-22 — ver alerta de ontem.', hora: '08:14' },
        { de: 'm_almeida', texto: 'VRL-23 com aviso de combustível — abastecer antes das 15:00.', hora: '13:45' },
        { de: 'm_marques', texto: 'Atenção ao Clio preto, possível envolvimento em furto a estabelecimento.', hora: '14:28' },
      ]},
      'c2': { id: 'c2', tipo: 'patrulha', nome: 'Em Patrulha — VRL-21/22/23', mensagens: [
        { de: 'm_santos', texto: '57-DT-91 confirmado sem seguro. Mando contraordenação.', hora: '14:19' },
        { de: 'm_silva',  texto: 'Recebido. Continuo na zona da Av. Carvalho Araújo.', hora: '14:21' },
        { de: 'm_braga',  texto: 'Sem novidade no IC5. Vou para o Cidral.', hora: '14:23' },
        { de: 'm_santos', texto: 'Combustível em 42% — passo no posto às 15:00.', hora: '14:25' },
      ]},
      'c3': { id: 'c3', tipo: 'comando', nome: 'Cmdt. Posto', mensagens: [
        { de: 'm_costa', texto: 'Silva, podes passar pela Av. Carvalho Araújo? Houve denúncia.', hora: '13:58' },
        { de: 'm_silva', texto: 'A caminho.', hora: '14:02' },
      ]},
      'c4': { id: 'c4', tipo: 'geral', nome: 'Anúncios — Comando Territorial', mensagens: [
        { de: 'sistema', texto: 'Operação STOP — saídas A24 e EN2, 22:00–02:00. Ver OS 045.', hora: '09:30' },
      ]},
    },

    /* Pânico */
    panico: null, // { militarId, indicativo, lat, lng, desde, despachadoPor, reforcos:[] }

    /* Auto de notícia (drafts + submitted) */
    autos: [],

    /* Notifications */
    notificacoes: [
      { id: 'n1', tipo: 'os', texto: 'Nova OS 045 — Operação STOP', hora: '08:02', lida: false },
      { id: 'n2', tipo: 'chat', texto: 'Sarg. Marques no Posto Geral', hora: '14:28', lida: false },
      { id: 'n3', tipo: 'briefing', texto: 'Briefing diário disponível', hora: '08:00', lida: true },
    ],

    /* Map state */
    viaturasMapa: [
      { id: 'VRL-21', viaturaId: 'v1', lat: 41.3006, lng: -7.7456, heading: 45, velocidade: 32, militar: 'Cb. Silva' },
      { id: 'VRL-22', viaturaId: 'v2', lat: 41.2950, lng: -7.7390, heading: 180, velocidade: 0, militar: 'Cb. Santos' },
      { id: 'VRL-23', viaturaId: 'v3', lat: 41.3088, lng: -7.7521, heading: 270, velocidade: 18, militar: 'Cb. Pereira' },
    ],

    /* UI */
    tema: 'claro', // 'claro' | 'noturno'

    /* Briefing diário (editável pelo Cmdt.) */
    briefing: {
      data: '28/04/2026',
      cabecalho: 'Posto Territorial de Vila Real',
      autor: 'Sarg. Costa Ribeiro',
      meteo: 'Sol, 18°C max, 7°C min · vento fraco · sem precipitação',
      efetivo: '15 militares · 8 ao serviço · 4 turno 08–20 · 4 turno 20–08 · 7 folga',
      prioridades: [
        'Operação STOP nas saídas A24 e EN2 — 22:00 às 02:00 (ver OS 045)',
        'Vigilância reforçada Av. Carvalho Araújo — denúncia anónima Cidral',
        'Apoio Festa S. Marcos — VRL-22 às 18:00 (Pç. do Município)',
      ],
      atencao: [
        'Clio preto matrícula 89-NM-22 — possível envolvimento em furto',
        'VRL-23 com aviso de combustível — abastecer antes das 15:00',
      ],
      patrulhas: [
        { indicativo: 'VRL-21', militares: 'Cb. Silva / Sd. Lopes', sector: 'Centro / Carvalho Araújo', viatura: 'MA-21-58' },
        { indicativo: 'VRL-22', militares: 'Cb. Santos / Sd. Fonseca', sector: 'EN2 / Mateus', viatura: 'MA-44-09' },
        { indicativo: 'VRL-23', militares: 'Cb. Pereira / Sd. Braga', sector: 'A24 / Vilarinho', viatura: 'MA-77-12' },
      ],
      observacoes: 'Recordo a obrigatoriedade de envio de RDO até às 21:00. Atenção a denúncias anónimas — confirmar antes de actuar.',
    },

    /* Ocorrências registadas no terreno */
    ocorrencias: [],

    /* Rota GPS da patrulha atual [{lat, lng, ts}] */
    rotaAtual: [],

    /* Cronologia de eventos do turno */
    eventos: [],

    /* Posto info (editable by admin) */
    posto: { ...D.posto },

    /* Férias — marcação anual por ordem de antiguidade */
    ferias: {
      ano: 2026,
      turnoMilitarId: 'm_costa', // first in seniority queue
      periodos: [],   // [{id, militarId, inicio, fim, dias}]
      concluidos: [], // militarIds who completed marking
    },

    /* Demo control */
    ultimaActualizacao: Date.now(),
  };

  /* ---------------- Storage ---------------- */
  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return JSON.parse(JSON.stringify(initialState));
      const parsed = JSON.parse(raw);
      // Merge to fill in any missing keys from new versions
      return { ...initialState, ...parsed };
    } catch (e) {
      return JSON.parse(JSON.stringify(initialState));
    }
  }

  function saveState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {}
  }

  /* ---------------- Store ---------------- */
  let state = loadState();
  const listeners = new Set();

  // BroadcastChannel for cross-tab/cross-device sync
  let channel = null;
  try {
    channel = new BroadcastChannel(CHANNEL_NAME);
    channel.onmessage = (ev) => {
      if (ev.data && ev.data.type === 'state') {
        state = ev.data.state;
        listeners.forEach(fn => fn(state));
      }
    };
  } catch (e) { /* not supported */ }

  // Cross-window same-origin sync via storage events
  window.addEventListener('storage', (ev) => {
    if (ev.key === STORAGE_KEY && ev.newValue) {
      try {
        state = JSON.parse(ev.newValue);
        listeners.forEach(fn => fn(state));
      } catch (e) {}
    }
  });

  function getState() { return state; }

  function setState(updater) {
    const next = typeof updater === 'function' ? updater(state) : updater;
    state = { ...state, ...next, ultimaActualizacao: Date.now() };
    saveState(state);
    listeners.forEach(fn => fn(state));
    if (channel) {
      try { channel.postMessage({ type: 'state', state }); } catch (e) {}
    }
  }

  function subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  }

  function reset() {
    state = JSON.parse(JSON.stringify(initialState));
    saveState(state);
    listeners.forEach(fn => fn(state));
    if (channel) {
      try { channel.postMessage({ type: 'state', state }); } catch (e) {}
    }
  }

  /* ---------------- Seniority helpers ---------------- */
  const RANK_ORDER = { 'Sargento': 4, 'Cabo-chefe': 3, 'Cabo': 2, 'Guarda': 1 };
  function ordemAntiguidade(militares) {
    return [...militares].sort((a, b) => {
      const ra = RANK_ORDER[a.posto] || 0, rb = RANK_ORDER[b.posto] || 0;
      if (ra !== rb) return rb - ra;
      return (a.anoIngresso || 9999) - (b.anoIngresso || 9999);
    });
  }

  /* ---------------- Internal helpers ---------------- */
  function logEvento(tipo, descricao, dados = {}) {
    const hora = new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });
    const ev = { id: 'ev_' + Date.now() + '_' + Math.random().toString(36).slice(2,5), tipo, descricao, hora, ts: Date.now(), dados };
    setState(s => ({ eventos: [ev, ...s.eventos].slice(0, 300) }));
  }

  /* ---------------- Action helpers ---------------- */
  const actions = {
    login(militarId) {
      setState({ militarLogadoId: militarId });
    },
    logout() {
      setState({ militarLogadoId: null });
    },
    abrirPatrulha({ viaturaId, parceiroId, kmInicial, combustivelInicial, equipamento }) {
      const v = state.viaturas.find(x => x.id === viaturaId);
      const id = 'p_' + Date.now();
      const patrulha = {
        id, viaturaId, parceiroId,
        militares: [state.militarLogadoId, parceiroId].filter(Boolean),
        kmInicial: Number(kmInicial), combustivelInicial: Number(combustivelInicial),
        equipamento, abertaEm: new Date().toISOString(),
        indicativo: v ? v.indicativo : '—',
      };
      setState(s => ({ patrulhaAtual: patrulha, rotaAtual: [],
        viaturas: s.viaturas.map(x => x.id === viaturaId ? { ...x, estado: 'patrulha' } : x),
      }));
      logEvento('patrulha_aberta', `Patrulha ${patrulha.indicativo} iniciada`, { indicativo: patrulha.indicativo, viaturaId });
    },
    fecharPatrulha({ kmFinal, combustivelFinal, observacoes }) {
      const p = state.patrulhaAtual;
      if (!p) return;
      const rota = state.rotaAtual;
      const fechada = { ...p, kmFinal: Number(kmFinal), combustivelFinal: Number(combustivelFinal), observacoes, fechadaEm: new Date().toISOString(), rota };
      setState(s => ({
        patrulhaAtual: null, rotaAtual: [],
        patrulhasHistorico: [fechada, ...s.patrulhasHistorico],
        viaturas: s.viaturas.map(x => x.id === p.viaturaId ? { ...x, estado: 'disponivel', km: Number(kmFinal), combustivel: Number(combustivelFinal) } : x),
      }));
      logEvento('patrulha_fechada', `Patrulha ${p.indicativo} encerrada — ${Math.max(0, Number(kmFinal) - p.kmInicial)} km percorridos`, { indicativo: p.indicativo });
    },
    addAlerta(alerta) {
      const id = 'a_' + Date.now();
      const a = { id, hora: new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }), confirmado: false, ...alerta };
      setState(s => ({ alertas: [a, ...s.alertas] }));
      logEvento('alerta_anpr', `Alerta ANPR — ${alerta.matricula} — ${alerta.motivo}`, { matricula: alerta.matricula, severidade: alerta.severidade });
      return a;
    },
    confirmarAlerta(alertaId) {
      const a = state.alertas.find(x => x.id === alertaId);
      setState(s => ({ alertas: s.alertas.map(x => x.id === alertaId ? { ...x, confirmado: true } : x) }));
      if (a) logEvento('alerta_confirmado', `Alerta confirmado — ${a.matricula}`, { alertaId });
    },
    addOcorrencia(dados) {
      const numero = 'OC-2026-' + String(state.ocorrencias.length + 1).padStart(4, '0');
      const hora = new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });
      const oc = { id: 'oc_' + Date.now(), numero, hora, ts: Date.now(), militarId: state.militarLogadoId, ...dados };
      setState(s => ({ ocorrencias: [oc, ...s.ocorrencias] }));
      logEvento('ocorrencia', `Ocorrência ${numero} registada — ${dados.tipo}`, { numero, tipo: dados.tipo });
      return oc;
    },
    addPontoRota({ lat, lng }) {
      setState(s => ({ rotaAtual: [...s.rotaAtual, { lat, lng, ts: Date.now() }].slice(-150) }));
    },
    enviarMensagem(chatId, texto) {
      const hora = new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });
      setState(s => ({
        chats: { ...s.chats, [chatId]: { ...s.chats[chatId], mensagens: [...s.chats[chatId].mensagens, { de: s.militarLogadoId, texto, hora }] } }
      }));
    },
    marcarOSLida(osId) {
      const mid = state.militarLogadoId;
      setState(s => ({
        ordens: s.ordens.map(o => o.id === osId ? { ...o, novo: false, lidoPor: [...new Set([...(o.lidoPor||[]), mid])] } : o),
      }));
    },
    enviarOS(os) {
      setState(s => ({ ordens: [{ ...os, id: 'os_' + Date.now(), data: new Date().toLocaleDateString('pt-PT'), novo: true, lidoPor: [] }, ...s.ordens] }));
    },
    enviarMensagemLogged(chatId, texto) {
      const hora = new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });
      setState(s => ({
        chats: { ...s.chats, [chatId]: { ...s.chats[chatId], mensagens: [...s.chats[chatId].mensagens, { de: s.militarLogadoId, texto, hora }] } }
      }));
      logEvento('mensagem', `Mensagem enviada em "${state.chats[chatId]?.nome}"`, { chatId });
    },
    activarPanico(coords) {
      const m = state.militares.find(x => x.id === state.militarLogadoId);
      // Use real GPS coords if provided, otherwise fall back to Vila Real centre
      const lat = (coords && coords.lat != null) ? coords.lat : 41.3006 + (Math.random() - 0.5) * 0.005;
      const lng = (coords && coords.lng != null) ? coords.lng : -7.7456 + (Math.random() - 0.5) * 0.005;
      setState({
        panico: {
          militarId: state.militarLogadoId,
          indicativo: m ? m.indicativo : '—',
          militarNome: m ? `${m.postoAbrev} ${m.nome}` : '—',
          lat, lng,
          gpsReal: !!(coords && coords.lat != null),
          desde: new Date().toISOString(),
          reforcos: [],
        }
      });
      logEvento('panico_ativo', `PEDIDO DE REFORÇO — ${m ? m.indicativo : '—'}`, { lat, lng });
    },
    despacharReforco(indicativo) {
      setState(s => ({
        panico: s.panico ? { ...s.panico, reforcos: [...new Set([...(s.panico.reforcos||[]), indicativo])] } : null,
      }));
    },
    cancelarPanico() {
      logEvento('panico_cancelado', 'Pedido de reforço cancelado', {});
      setState({ panico: null });
    },
    submeterAuto(auto) {
      setState(s => ({ autos: [{ ...auto, id: 'auto_' + Date.now(), data: new Date().toISOString() }, ...s.autos] }));
    },
    marcarNotificacaoLida(nId) {
      setState(s => ({ notificacoes: s.notificacoes.map(n => n.id === nId ? { ...n, lida: true } : n) }));
    },
    toggleDiretiva(dId) {
      setState(s => ({ diretivas: s.diretivas.map(d => d.id === dId ? { ...d, feito: !d.feito } : d) }));
    },
    updatePosto(patch) {
      setState(s => ({ posto: { ...s.posto, ...patch } }));
    },
    addMilitar(dados) {
      const id = 'm_' + Date.now();
      const m = { id, estado: 'servico', indicativo: '—', foto: null, ...dados };
      setState(s => ({ militares: [...s.militares, m] }));
      logEvento('militar_adicionado', `Novo militar adicionado: ${dados.nome}`, { id });
      return m;
    },
    updateMilitar(id, patch) {
      setState(s => ({ militares: s.militares.map(m => m.id === id ? { ...m, ...patch } : m) }));
    },
    addViatura(dados) {
      const id = 'v_' + Date.now();
      const v = { id, estado: 'disponivel', militares: [], ...dados };
      setState(s => ({ viaturas: [...s.viaturas, v] }));
      logEvento('viatura_adicionada', `Nova viatura: ${dados.matricula}`, { id });
      return v;
    },
    updateViatura(id, patch) {
      setState(s => ({ viaturas: s.viaturas.map(v => v.id === id ? { ...v, ...patch } : v) }));
    },
    resetFeriasAno(ano) {
      const primeiroId = ordemAntiguidade(state.militares)[0]?.id || null;
      setState(s => ({ ferias: { ano, turnoMilitarId: primeiroId, periodos: [], concluidos: [] } }));
      logEvento('ferias_reset', `Marcação de férias reiniciada para ${ano}`, { ano });
    },
    setDiasFerias(militarId, dias) {
      setState(s => ({ militares: s.militares.map(m => m.id === militarId ? { ...m, diasFerias: Number(dias) } : m) }));
    },
    adicionarPeriodoFerias({ militarId, inicio, fim }) {
      const meusPeriodos = state.ferias.periodos.filter(p => p.militarId === militarId);
      if (meusPeriodos.length >= 5) return null;
      const d1 = new Date(inicio), d2 = new Date(fim);
      const dias = Math.max(1, Math.round((d2 - d1) / (1000 * 60 * 60 * 24)) + 1);
      const periodo = { id: 'fp_' + Date.now(), militarId, inicio, fim, dias };
      setState(s => ({ ferias: { ...s.ferias, periodos: [...s.ferias.periodos, periodo] } }));
      logEvento('ferias_periodo', `Período de férias adicionado — ${dias} dias`, { militarId, inicio, fim });
      return periodo;
    },
    removerPeriodoFerias(periodoId) {
      setState(s => ({ ferias: { ...s.ferias, periodos: s.ferias.periodos.filter(p => p.id !== periodoId) } }));
    },
    concluirMarcacaoFerias(militarId) {
      const fila = ordemAntiguidade(state.militares).map(m => m.id);
      const concluidos = [...new Set([...state.ferias.concluidos, militarId])];
      const proxIdx = fila.indexOf(militarId) + 1;
      const proximo = fila.slice(proxIdx).find(id => !concluidos.includes(id)) || null;
      setState(s => ({ ferias: { ...s.ferias, concluidos, turnoMilitarId: proximo } }));
      if (proximo) {
        const atual = state.militares.find(m => m.id === militarId);
        const proxMilitar = state.militares.find(m => m.id === proximo);
        const hora = new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });
        const texto = `${atual ? `${atual.postoAbrev} ${atual.nome}` : '—'} concluiu a marcação de férias. ${proxMilitar ? `${proxMilitar.postoAbrev} ${proxMilitar.nome}` : '—'}, é agora a sua vez de marcar.`;
        setState(s => ({
          notificacoes: [{ id: 'n_f_' + Date.now(), tipo: 'ferias', texto: 'Férias 2026 — é a sua vez de marcar', hora, lida: false }, ...s.notificacoes],
          chats: { ...s.chats, 'c1': { ...s.chats['c1'], mensagens: [...s.chats['c1'].mensagens, { de: 'sistema', texto, hora }] } },
        }));
        logEvento('ferias_turno', `Férias: ${proxMilitar ? `${proxMilitar.postoAbrev} ${proxMilitar.nome}` : '—'} pode agora marcar`, { militarId: proximo });
      }
    },
    setTema(tema) {
      setState({ tema });
    },
    updateBriefing(patch) {
      setState(s => ({ briefing: { ...s.briefing, ...patch } }));
    },
    reset,
  };

  /* ---------------- React hook ---------------- */
  function useStore(selector) {
    const [, setTick] = React.useState(0);
    React.useEffect(() => {
      return subscribe(() => setTick(t => t + 1));
    }, []);
    return selector ? selector(state) : state;
  }

  window.SentinelaStore = { getState, setState, subscribe, useStore, actions, reset, ordemAntiguidade };
})();
