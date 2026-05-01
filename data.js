/* Sentinela — Mock data shared between mobile and PC */

window.SENTINELA_DATA = {
  posto: {
    nome: "Posto Territorial de Vila Real",
    destacamento: "Destacamento Territorial de Vila Real",
    comando: "Comando Territorial de Vila Real",
    morada: "Av. da Igreja, 5000-001 Vila Real",
  },

  militarAtual: {
    id: "m_silva",
    nim: "1873542",
    posto: "Cabo",
    postoAbrev: "Cb.",
    nome: "Silva",
    nomeCompleto: "João Pedro Silva",
    foto: null,
    indicativo: "VRL-21",
    secao: "Patrulha Territorial",
  },

  militares: [
    { id: "m_costa",    nim: "1654211", posto: "Sargento",    postoAbrev: "Sarg.",    nome: "Costa Ribeiro",  secao: "Cmdt. Posto",  estado: "servico",  indicativo: "—",     anoIngresso: 1999, diasFerias: 27 },
    { id: "m_marques",  nim: "1701229", posto: "Sargento",    postoAbrev: "Sarg.",    nome: "Helena Marques", secao: "Cmdt. Adj.",   estado: "servico",  indicativo: "—",     anoIngresso: 2001, diasFerias: 27 },
    { id: "m_almeida",  nim: "1769214", posto: "Cabo-chefe",  postoAbrev: "Cb.-Ch.",  nome: "Vítor Almeida",  secao: "Cmdt. 2.º",   estado: "servico",  indicativo: "—",     anoIngresso: 2003, diasFerias: 26 },
    { id: "m_torres",   nim: "1812047", posto: "Cabo",        postoAbrev: "Cb.",      nome: "Pedro Torres",   secao: "Investigação", estado: "folga",    indicativo: "—",     anoIngresso: 2004, diasFerias: 25 },
    { id: "m_silva",    nim: "1873542", posto: "Cabo",        postoAbrev: "Cb.",      nome: "João Silva",     secao: "Patrulha",    estado: "patrulha", indicativo: "VRL-21", anoIngresso: 2005, diasFerias: 25 },
    { id: "m_pereira",  nim: "1748930", posto: "Cabo",        postoAbrev: "Cb.",      nome: "Hugo Pereira",   secao: "Patrulha",    estado: "patrulha", indicativo: "VRL-23", anoIngresso: 2007, diasFerias: 24 },
    { id: "m_santos",   nim: "1922104", posto: "Cabo",        postoAbrev: "Cb.",      nome: "Marta Santos",   secao: "Patrulha",    estado: "patrulha", indicativo: "VRL-22", anoIngresso: 2008, diasFerias: 24 },
    { id: "m_lopes",    nim: "1845003", posto: "Guarda",      postoAbrev: "Gd.",      nome: "Rui Lopes",      secao: "Patrulha",    estado: "patrulha", indicativo: "VRL-21", anoIngresso: 2006, diasFerias: 24 },
    { id: "m_rocha",    nim: "1885514", posto: "Guarda",      postoAbrev: "Gd.",      nome: "Miguel Rocha",   secao: "Trânsito",    estado: "servico",  indicativo: "—",     anoIngresso: 2009, diasFerias: 23 },
    { id: "m_braga",    nim: "1934455", posto: "Guarda",      postoAbrev: "Gd.",      nome: "Diogo Braga",    secao: "Patrulha",    estado: "patrulha", indicativo: "VRL-23", anoIngresso: 2010, diasFerias: 23 },
    { id: "m_vieira",   nim: "2003108", posto: "Guarda",      postoAbrev: "Gd.",      nome: "Sofia Vieira",   secao: "Patrulha",    estado: "folga",    indicativo: "—",     anoIngresso: 2011, diasFerias: 23 },
    { id: "m_dias",     nim: "1991872", posto: "Guarda",      postoAbrev: "Gd.",      nome: "Ana Dias",       secao: "Patrulha",    estado: "folga",    indicativo: "—",     anoIngresso: 2012, diasFerias: 23 },
    { id: "m_fonseca",  nim: "1899321", posto: "Guarda",      postoAbrev: "Gd.",      nome: "Inês Fonseca",   secao: "Patrulha",    estado: "patrulha", indicativo: "VRL-22", anoIngresso: 2013, diasFerias: 22 },
    { id: "m_carvalho", nim: "1965003", posto: "Guarda",      postoAbrev: "Gd.",      nome: "Tiago Carvalho", secao: "Patrulha",    estado: "folga",    indicativo: "—",     anoIngresso: 2018, diasFerias: 22 },
    { id: "m_neves",    nim: "2014778", posto: "Guarda",      postoAbrev: "Gd.",      nome: "Carla Neves",    secao: "Patrulha",    estado: "servico",  indicativo: "—",     anoIngresso: 2020, diasFerias: 22 },
  ],

  viaturas: [
    { id: "v1", matricula: "MA-21-58", marca: "Mercedes", modelo: "Vito",      indicativo: "VRL-21", km: 184326, combustivel: 78, estado: "patrulha", militares: ["m_silva", "m_lopes"] },
    { id: "v2", matricula: "MA-44-09", marca: "VW",       modelo: "T-Roc",     indicativo: "VRL-22", km: 92118,  combustivel: 42, estado: "patrulha", militares: ["m_santos", "m_fonseca"] },
    { id: "v3", matricula: "MA-77-12", marca: "Peugeot",  modelo: "Partner",   indicativo: "VRL-23", km: 211440, combustivel: 18, estado: "patrulha", militares: ["m_pereira", "m_braga"] },
    { id: "v4", matricula: "MA-12-77", marca: "Peugeot",  modelo: "508",       indicativo: "VRL-30", km: 67220,  combustivel: 95, estado: "disponivel", militares: [] },
    { id: "v5", matricula: "MA-66-31", marca: "Land Rover", modelo: "Defender", indicativo: "VRL-40", km: 142880, combustivel: 60, estado: "disponivel", militares: [] },
    { id: "v6", matricula: "MA-09-44", marca: "Renault",  modelo: "Mégane",    indicativo: "VRL-50", km: 198003, combustivel: 33, estado: "manutencao", militares: [] },
    { id: "v7", matricula: "MA-55-88", marca: "Toyota",   modelo: "Hilux",     indicativo: "VRL-60", km: 224119, combustivel: 70, estado: "disponivel", militares: [] },
  ],

  alertasANPR: [
    { id: "a1", matricula: "12-AB-34", motivo: "Viatura furtada",         severidade: "critico", local: "Av. Carvalho Araújo", km: 184318, hora: "14:32", militar: "Cb. Silva", indicativo: "VRL-21", origem: "BNDV — Aveiro 2024-08-14", confirmado: false },
    { id: "a2", matricula: "57-DT-91", motivo: "Sem seguro válido",       severidade: "aviso",   local: "EN2, km 14",          km: 92102,  hora: "14:18", militar: "Cb. Santos", indicativo: "VRL-22", origem: "ASF — desde 2026-01-12", confirmado: true },
    { id: "a3", matricula: "44-PV-22", motivo: "Inspeção caducada",       severidade: "aviso",   local: "R. da República",     km: 211412, hora: "13:55", militar: "Gd. Braga",  indicativo: "VRL-23", origem: "IMT — caducou 2025-11-30", confirmado: true },
    { id: "a4", matricula: "98-XR-04", motivo: "Mandado de detenção",     severidade: "critico", local: "A24, saída 18",       km: 184290, hora: "13:20", militar: "Cb. Silva",  indicativo: "VRL-21", origem: "MP Vila Real",         confirmado: true },
    { id: "a5", matricula: "33-LM-67", motivo: "Cancelada — abate",       severidade: "info",    local: "Rotunda do Cidral",   km: 92085,  hora: "12:48", militar: "Gd. Fonseca",indicativo: "VRL-22", origem: "IMT 2025-09",          confirmado: true },
  ],

  ordensServico: [
    { id: "os1", titulo: "OS 045/2026 — Operação STOP", autor: "Sarg. Costa Ribeiro", data: "28/04/2026", paginas: 3, novo: true },
    { id: "os2", titulo: "OS 044/2026 — Reforço noturno",                autor: "Sarg. Costa Ribeiro", data: "27/04/2026", paginas: 2, novo: true },
    { id: "os3", titulo: "OS 043/2026 — Festa de S. Marcos (segurança)", autor: "Cb.-Ch. Almeida",     data: "24/04/2026", paginas: 5, novo: false },
    { id: "os4", titulo: "OS 042/2026 — Patrulhamento escolas",          autor: "Sarg. Costa Ribeiro", data: "20/04/2026", paginas: 2, novo: false },
    { id: "os5", titulo: "Diretiva 09/2026 — Procedimentos ANPR",        autor: "Comando Territorial", data: "15/04/2026", paginas: 8, novo: false },
  ],

  diretivasPatrulha: [
    { id: "d1", texto: "Reforçar presença na Av. Carvalho Araújo entre 22:00 e 02:00 (denúncias de ruído)", feito: false, prioridade: "alta" },
    { id: "d2", texto: "Verificar viatura abandonada — Audi A4 cinzento, R. de Santa Iria",                  feito: true,  prioridade: "media" },
    { id: "d3", texto: "Visita ao IPSS Lar S. Domingos antes das 18:00",                                       feito: false, prioridade: "media" },
    { id: "d4", texto: "Atenção a Renault Clio preto 89-NM-22 — possível envolvimento em furto a estabelecimento", feito: false, prioridade: "alta" },
    { id: "d5", texto: "Confirmar sinalética nova na rotunda do Cidral",                                      feito: false, prioridade: "baixa" },
  ],

  chatGrupos: [
    { id: "c1", tipo: "posto",    nome: "Posto VRL — Geral",      ultimo: "Marques: Atenção ao Clio preto…", hora: "14:28", naoLidas: 3 },
    { id: "c2", tipo: "patrulha", nome: "Em Patrulha — VRL-21/22/23", ultimo: "Santos: 57-DT-91 confirmado sem seguro", hora: "14:19", naoLidas: 0, ativo: true },
    { id: "c3", tipo: "comando",  nome: "Cmdt. Posto",            ultimo: "Tu: A caminho do Cidral.",         hora: "14:02", naoLidas: 0 },
    { id: "c4", tipo: "geral",    nome: "Anúncios — Comando Territorial", ultimo: "Operação STOP — ver OS 045", hora: "09:30", naoLidas: 1 },
  ],

  mensagensPatrulha: [
    { de: "Cb. Santos", indicativo: "VRL-22", texto: "57-DT-91 confirmado sem seguro. Mando contraordenação.", hora: "14:19", proprio: false },
    { de: "Cb. Silva",  indicativo: "VRL-21", texto: "Recebido. Continuo na zona da Av. Carvalho Araújo.",      hora: "14:21", proprio: true  },
    { de: "Gd. Braga",  indicativo: "VRL-23", texto: "Sem novidade no IC5. Vou para o Cidral.",                  hora: "14:23", proprio: false },
    { de: "Cb. Santos", indicativo: "VRL-22", texto: "Combustível em 42% — passo no posto às 15:00.",            hora: "14:25", proprio: false },
  ],

  briefing: {
    data: "Ter, 28 abr 2026",
    autor: "Sarg. Costa Ribeiro",
    pontos: [
      "Operação STOP em vigor das 22:00 às 02:00 — saídas A24 e EN2.",
      "Atenção a Renault Clio preto 89-NM-22, possível envolvimento em furto.",
      "Festas de S. Marcos: reforço pedestre no centro histórico após as 21:00.",
      "VRL-23 com aviso de combustível baixo — abastecer antes das 15:00.",
    ],
  },

  escala: {
    semana: "Semana 18 — 27 abr a 03 mai",
    dias: ["Seg 27","Ter 28","Qua 29","Qui 30","Sex 01","Sáb 02","Dom 03"],
    linhas: [
      { militar: "Sarg. Costa Ribeiro", turnos: ["08-20","08-20","08-20","FOLGA","08-20","FOLGA","FOLGA"] },
      { militar: "Cb.-Ch. Almeida",     turnos: ["20-08","20-08","FOLGA","FOLGA","20-08","20-08","20-08"] },
      { militar: "Cb. Silva",           turnos: ["08-20","08-20","08-20","08-20","FOLGA","FOLGA","08-20"] },
      { militar: "Cb. Santos",          turnos: ["08-20","08-20","FOLGA","08-20","08-20","08-20","FOLGA"] },
      { militar: "Cb. Pereira",         turnos: ["20-08","FOLGA","20-08","20-08","20-08","FOLGA","20-08"] },
      { militar: "Gd. Lopes",           turnos: ["08-20","08-20","08-20","FOLGA","FOLGA","08-20","08-20"] },
      { militar: "Gd. Fonseca",         turnos: ["08-20","08-20","FOLGA","08-20","08-20","FOLGA","08-20"] },
      { militar: "Gd. Braga",           turnos: ["20-08","20-08","20-08","FOLGA","20-08","20-08","FOLGA"] },
      { militar: "Gd. Neves",           turnos: ["FOLGA","08-20","08-20","08-20","08-20","08-20","FOLGA"] },
      { militar: "Gd. Dias",            turnos: ["FOLGA","FOLGA","08-20","08-20","08-20","20-08","20-08"] },
    ],
  },
};
