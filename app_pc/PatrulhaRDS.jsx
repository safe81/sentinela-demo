/* Sentinela PC — Relatório Diário de Serviço (patrulha) — A4 imprimível */

const PatrulhaRDSModal = ({ patrulhaId, onClose }) => {
  const { useStore } = window.SentinelaStore;
  const patrulha = useStore(s => s.patrulhasHistorico.find(p => p.id === patrulhaId));
  const viaturas = useStore(s => s.viaturas);
  const militares = useStore(s => s.militares);
  const ocorrencias = useStore(s => s.alertas);

  if (!patrulha) return null;

  const v = viaturas.find(x => x.id === patrulha.viaturaId);
  const tripulacao = patrulha.militares.map(id => militares.find(m => m.id === id)).filter(Boolean);
  // Eventos relacionados (ANPR + ocorrências) — filtra por patrulha se possível, senão pega últimos 4
  const eventos = (ocorrencias || []).slice(0, 4);

  const printar = () => window.print();

  const fmtDT = (ts) => ts ? new Date(ts).toLocaleString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';
  const fmtT  = (ts) => ts ? new Date(ts).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }) : '—';

  const km = (patrulha.kmFinal && patrulha.kmInicial) ? (patrulha.kmFinal - patrulha.kmInicial) : null;
  const combConsumido = (patrulha.combustivelFinal != null) ? (patrulha.combustivelInicial - patrulha.combustivelFinal) : null;
  const numeroRDS = `RDS / ${patrulha.indicativo} / ${new Date(patrulha.abertaEm).toLocaleDateString('pt-PT').replace(/\//g, '')}`;

  return (
    <>
      <style>{`
        @media print {
          @page { size: A4; margin: 14mm 14mm 18mm; }
          body * { visibility: hidden; }
          .rds-paper, .rds-paper * { visibility: visible; }
          .rds-paper {
            position: absolute; left: 0; top: 0; width: 100%;
            box-shadow: none !important; border: none !important;
            margin: 0 !important; padding: 0 !important;
          }
          .rds-modal-bg { position: static !important; background: transparent !important; padding: 0 !important; }
          .rds-modal-card { box-shadow: none !important; border-radius: 0 !important; }
          .rds-no-print { display: none !important; }
        }
        .rds-grid { display: grid; gap: 0; border: 1px solid #0F2A20; }
        .rds-grid-row { display: grid; grid-template-columns: 38mm 1fr 38mm 1fr; border-bottom: 1px solid #C9C2A8; }
        .rds-grid-row:last-child { border-bottom: none; }
        .rds-grid-label {
          background: #F4F2EC; padding: 5px 8px; font-size: 9px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.06em; color: #3A5044;
          border-right: 1px solid #C9C2A8; display: flex; align-items: center;
        }
        .rds-grid-val { padding: 5px 10px; font-size: 11px; color: #0F2A20; display: flex; align-items: center; border-right: 1px solid #C9C2A8; }
        .rds-grid-val:last-child { border-right: none; }
        .rds-grid-val.mono { font-family: var(--font-mono); font-weight: 600; }
      `}</style>

      <div className="rds-modal-bg" style={{
        position: 'fixed', inset: 0, background: 'rgba(15, 26, 20, 0.65)',
        zIndex: 100, display: 'flex', flexDirection: 'column', alignItems: 'center',
        overflowY: 'auto', padding: '24px 0',
      }}>
        {/* Toolbar */}
        <div className="rds-no-print" style={{
          width: '210mm', background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: '8px 8px 0 0', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <Icon name="file-text" size={16} style={{ color: 'var(--brand-green)' }}/>
          <div style={{ fontSize: 13, fontWeight: 600 }}>RDS · {patrulha.indicativo} · {new Date(patrulha.abertaEm).toLocaleDateString('pt-PT')}</div>
          <div style={{ flex: 1 }}/>
          <button onClick={printar} style={{
            background: 'var(--brand-green)', color: '#fff', border: 'none', borderRadius: 6,
            padding: '6px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <Icon name="printer" size={13}/> Imprimir / PDF
          </button>
          <button onClick={onClose} style={{
            background: 'var(--surface-2)', color: 'var(--fg)', border: '1px solid var(--border)', borderRadius: 6,
            padding: '6px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer',
          }}>
            Fechar
          </button>
        </div>

        {/* A4 paper */}
        <div className="rds-paper rds-modal-card" style={{
          width: '210mm', minHeight: '297mm', background: '#FFFFFF', color: '#0F2A20',
          boxShadow: '0 8px 32px rgba(0,0,0,0.35)', padding: '18mm 16mm',
          fontFamily: 'var(--font-ui)', fontSize: 11, lineHeight: 1.5,
        }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, paddingBottom: 12, borderBottom: '2px solid #0F2A20' }}>
            <img src="assets/sentinela-shield.svg" alt="" style={{ height: 50 }}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 700, color: '#5A6D63' }}>
                Guarda Nacional Republicana · Comando Territorial de Vila Real
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, margin: '2px 0', lineHeight: 1.1 }}>
                Relatório Diário de Serviço
              </div>
              <div style={{ fontSize: 10, color: '#3A5044' }}>
                Posto Territorial de Vila Real · Patrulha <b>{patrulha.indicativo}</b>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: '#5A6D63' }}>NÚMERO</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: '#0F2A20' }}>{numeroRDS}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 700, color: '#C9A24B', marginTop: 2 }}>{patrulha.indicativo}</div>
            </div>
          </div>

          {/* Bloco 1 — Identificação */}
          <div style={{ marginTop: 16 }}>
            <SectionTitle num="1" title="Identificação do serviço"/>
            <div className="rds-grid" style={{ marginTop: 6 }}>
              <div className="rds-grid-row">
                <div className="rds-grid-label">Indicativo</div>
                <div className="rds-grid-val mono">{patrulha.indicativo}</div>
                <div className="rds-grid-label">Tipo</div>
                <div className="rds-grid-val">Patrulha auto · território</div>
              </div>
              <div className="rds-grid-row">
                <div className="rds-grid-label">Aberta em</div>
                <div className="rds-grid-val mono">{fmtDT(patrulha.abertaEm)}</div>
                <div className="rds-grid-label">Fechada em</div>
                <div className="rds-grid-val mono">{patrulha.fechadaEm ? fmtDT(patrulha.fechadaEm) : '— em curso —'}</div>
              </div>
              <div className="rds-grid-row">
                <div className="rds-grid-label">Sector</div>
                <div className="rds-grid-val">{patrulha.sector || '—'}</div>
                <div className="rds-grid-label">Estado</div>
                <div className="rds-grid-val">{patrulha.fechadaEm ? 'Encerrada' : 'Em curso'}</div>
              </div>
            </div>
          </div>

          {/* Bloco 2 — Tripulação */}
          <div style={{ marginTop: 14 }}>
            <SectionTitle num="2" title="Tripulação"/>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 6, fontSize: 11, border: '1px solid #0F2A20' }}>
              <thead>
                <tr style={{ background: '#F4F2EC' }}>
                  {['NIP','Posto','Nome','Função'].map(h => (
                    <th key={h} style={{ padding: '6px 10px', textAlign: 'left', fontSize: 9, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#3A5044', borderBottom: '1px solid #0F2A20', borderRight: '1px solid #C9C2A8' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tripulacao.map((m, i) => (
                  <tr key={m.id} style={{ borderBottom: i < tripulacao.length - 1 ? '1px solid #E8E4D2' : 'none' }}>
                    <td className="t-mono" style={{ padding: '6px 10px', fontWeight: 600, borderRight: '1px solid #E8E4D2' }}>{m.nip}</td>
                    <td style={{ padding: '6px 10px', borderRight: '1px solid #E8E4D2' }}>{m.postoAbrev}</td>
                    <td style={{ padding: '6px 10px', fontWeight: 600, borderRight: '1px solid #E8E4D2' }}>{m.nome}</td>
                    <td style={{ padding: '6px 10px' }}>{i === 0 ? 'Chefe de patrulha' : 'Patrulheiro'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bloco 3 — Viatura */}
          <div style={{ marginTop: 14 }}>
            <SectionTitle num="3" title="Viatura · KM e combustível"/>
            <div className="rds-grid" style={{ marginTop: 6 }}>
              <div className="rds-grid-row">
                <div className="rds-grid-label">Matrícula</div>
                <div className="rds-grid-val mono">{v?.matricula || '—'}</div>
                <div className="rds-grid-label">Modelo</div>
                <div className="rds-grid-val">{v?.modelo || '—'}</div>
              </div>
              <div className="rds-grid-row">
                <div className="rds-grid-label">KM inicial</div>
                <div className="rds-grid-val mono">{patrulha.kmInicial.toLocaleString('pt-PT')}</div>
                <div className="rds-grid-label">KM final</div>
                <div className="rds-grid-val mono">{patrulha.kmFinal ? patrulha.kmFinal.toLocaleString('pt-PT') : '—'}</div>
              </div>
              <div className="rds-grid-row">
                <div className="rds-grid-label">KM percorridos</div>
                <div className="rds-grid-val mono" style={{ fontWeight: 700, color: '#1F4D3A' }}>{km != null ? km.toLocaleString('pt-PT') + ' km' : '—'}</div>
                <div className="rds-grid-label">Combustível</div>
                <div className="rds-grid-val mono">{patrulha.combustivelInicial}% → {patrulha.combustivelFinal != null ? patrulha.combustivelFinal + '%' : '—'} {combConsumido != null && <span style={{ color: '#C7322B', marginLeft: 6 }}>(–{combConsumido}%)</span>}</div>
              </div>
            </div>
          </div>

          {/* Bloco 4 — Ocorrências */}
          <div style={{ marginTop: 14 }}>
            <SectionTitle num="4" title="Ocorrências e eventos do turno"/>
            {eventos.length === 0 ? (
              <div style={{ marginTop: 6, padding: 10, fontSize: 10, color: '#5A6D63', fontStyle: 'italic', border: '1px dashed #C9C2A8' }}>
                Sem ocorrências registadas durante o turno.
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 6, fontSize: 10, border: '1px solid #0F2A20' }}>
                <thead>
                  <tr style={{ background: '#F4F2EC' }}>
                    {['Hora','Tipo','Local','Descrição'].map(h => (
                      <th key={h} style={{ padding: '6px 10px', textAlign: 'left', fontSize: 9, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#3A5044', borderBottom: '1px solid #0F2A20', borderRight: '1px solid #C9C2A8' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {eventos.map((e, i) => (
                    <tr key={e.id || i} style={{ borderBottom: i < eventos.length - 1 ? '1px solid #E8E4D2' : 'none' }}>
                      <td className="t-mono" style={{ padding: '6px 10px', borderRight: '1px solid #E8E4D2', whiteSpace: 'nowrap' }}>{fmtT(e.timestamp || e.criadoEm || patrulha.abertaEm)}</td>
                      <td style={{ padding: '6px 10px', borderRight: '1px solid #E8E4D2', fontWeight: 600 }}>{e.tipo || 'ANPR'}</td>
                      <td style={{ padding: '6px 10px', borderRight: '1px solid #E8E4D2' }}>{e.local || e.matricula || '—'}</td>
                      <td style={{ padding: '6px 10px' }}>{e.descricao || e.motivo || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Bloco 5 — Observações */}
          <div style={{ marginTop: 14 }}>
            <SectionTitle num="5" title="Observações do chefe de patrulha"/>
            <div style={{ marginTop: 6, minHeight: 60, padding: '10px 12px', border: '1px solid #C9C2A8', fontSize: 11, color: '#3A5044', whiteSpace: 'pre-wrap' }}>
              {patrulha.observacoes || 'Serviço sem ocorrências de relevo. Patrulhamento conforme escala. Ver detalhe das leituras ANPR no sistema Sentinela.'}
            </div>
          </div>

          {/* Footer / signatures */}
          <div style={{ marginTop: 30, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30 }}>
            {[tripulacao[0], tripulacao[1] || tripulacao[0]].filter(Boolean).map((m, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ borderBottom: '1px solid #0F2A20', height: 28 }}/>
                <div style={{ fontSize: 9, color: '#5A6D63', marginTop: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {i === 0 ? 'Chefe de patrulha' : 'Patrulheiro'}
                </div>
                <div style={{ fontSize: 10, color: '#0F2A20', marginTop: 2 }}>
                  {m.postoAbrev} {m.nome}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 24, paddingTop: 10, borderTop: '1px solid #C9C2A8', fontSize: 8, color: '#7A847E', textAlign: 'center' }}>
            Documento gerado automaticamente pela plataforma Sentinela · {new Date().toLocaleString('pt-PT')} · folha 1/1 · uso interno
          </div>
        </div>
      </div>
    </>
  );
};

const SectionTitle = ({ num, title }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
    <div style={{
      width: 18, height: 18, background: '#0F2A20', color: '#fff',
      fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-mono)',
    }}>{num}</div>
    <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#0F2A20' }}>
      {title}
    </div>
    <div style={{ flex: 1, height: 1, background: '#C9C2A8' }}/>
  </div>
);

window.PatrulhaRDSModal = PatrulhaRDSModal;
