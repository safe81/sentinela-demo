/* Sentinela PC — Briefing diário (editável + imprimível em A4) */

const BriefingView = () => {
  const { useStore, actions } = window.SentinelaStore;
  const briefing = useStore(s => s.briefing);
  const militares = useStore(s => s.militares);
  const [editing, setEditing] = React.useState(false);

  const update = (key, value) => actions.updateBriefing({ [key]: value });

  const printar = () => {
    window.print();
  };

  const efetivoPorEstado = {
    servico: militares.filter(m => m.estado === 'servico').length,
    patrulha: militares.filter(m => m.estado === 'patrulha').length,
    folga: militares.filter(m => m.estado === 'folga').length,
    licenca: militares.filter(m => m.estado === 'licenca').length,
  };

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: 'var(--surface-2)' }}>
      {/* Print styles */}
      <style>{`
        @media print {
          @page { size: A4; margin: 14mm 14mm 18mm; }
          body * { visibility: hidden; }
          .briefing-paper, .briefing-paper * { visibility: visible; }
          .briefing-paper {
            position: absolute; left: 0; top: 0; width: 100%;
            box-shadow: none !important; border: none !important;
            background: #FFF !important; color: #000 !important;
            padding: 0 !important;
          }
          .briefing-paper .no-print { display: none !important; }
          .briefing-paper input, .briefing-paper textarea {
            border: none !important; background: transparent !important; padding: 0 !important;
            color: #000 !important;
          }
        }
        .briefing-input {
          width: 100%; border: 1px solid var(--border); background: var(--surface);
          padding: 6px 10px; border-radius: 6px; font: inherit; color: var(--fg);
          font-family: var(--font-ui); box-sizing: border-box;
        }
        .briefing-input:focus { outline: none; border-color: var(--brand-green); box-shadow: 0 0 0 3px rgba(31,77,58,0.10); }
        .briefing-input.read { border-color: transparent; background: transparent; padding: 0; }
        .briefing-input.read:hover { background: var(--surface-3); padding: 6px 10px; border: 1px dashed var(--border); }
      `}</style>

      {/* Toolbar */}
      <div className="no-print" style={{
        display: 'flex', alignItems: 'center', gap: 10, padding: '14px 22px',
        background: 'var(--surface)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 5,
      }}>
        <Icon name="megaphone" size={16} style={{ color: 'var(--brand-green)' }}/>
        <div style={{ fontSize: 13, fontWeight: 600 }}>Briefing diário · {briefing.data}</div>
        <div style={{ flex: 1 }}/>
        <Button tone={editing ? 'primary' : 'secondary'} icon={editing ? 'check' : 'edit'} onClick={() => setEditing(e => !e)}>
          {editing ? 'Concluir' : 'Editar'}
        </Button>
        <Button tone="secondary" icon="printer" onClick={printar}>Imprimir / PDF</Button>
      </div>

      {/* A4 paper */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '24px 22px 60px' }}>
        <div className="briefing-paper" style={{
          width: '210mm', minHeight: '297mm', background: '#FFFFFF', color: '#0F2A20',
          boxShadow: '0 8px 32px rgba(15,42,32,0.18)', padding: '20mm 18mm',
          fontFamily: 'var(--font-ui)', fontSize: 11, lineHeight: 1.55,
        }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, paddingBottom: 14, borderBottom: '2px solid #0F2A20' }}>
            <img src="assets/sentinela-shield.svg" alt="" style={{ height: 56 }}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 700, color: '#5A6D63' }}>
                GUARDA NACIONAL REPUBLICANA · COMANDO TERRITORIAL DE VILA REAL
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: '#0F2A20', margin: '4px 0', lineHeight: 1.1 }}>
                {editing ? (
                  <input className="briefing-input" value={briefing.cabecalho} onChange={e => update('cabecalho', e.target.value)}/>
                ) : briefing.cabecalho}
              </div>
              <div style={{ fontSize: 11, color: '#3A5044' }}>
                <b>Data:</b> {editing ? <input className="briefing-input read" style={{ display: 'inline-block', width: 110 }} value={briefing.data} onChange={e => update('data', e.target.value)}/> : briefing.data}
                {' · '}
                <b>Elaborado por:</b> {editing ? <input className="briefing-input read" style={{ display: 'inline-block', width: 200 }} value={briefing.autor} onChange={e => update('autor', e.target.value)}/> : briefing.autor}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#5A6D63' }}>BRIEFING / RDS</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 700, color: '#C9A24B' }}>VRL · 28/04</div>
            </div>
          </div>

          {/* Bloco 1 — Quadro do dia */}
          <BriefingSection num="1" title="Quadro do dia">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 8 }}>
              <BriefingField label="Meteorologia" icon="cloud-sun" value={briefing.meteo} editing={editing} onChange={v => update('meteo', v)}/>
              <BriefingField label="Efetivo" icon="users" value={briefing.efetivo} editing={editing} onChange={v => update('efetivo', v)}/>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
              <EfetivoChip n={efetivoPorEstado.servico}  label="ao serviço"  c="#1F4D3A"/>
              <EfetivoChip n={efetivoPorEstado.patrulha} label="em patrulha" c="#D88A2A"/>
              <EfetivoChip n={efetivoPorEstado.folga}    label="folga"        c="#7A847E"/>
              <EfetivoChip n={efetivoPorEstado.licenca}  label="licença"      c="#C7322B"/>
            </div>
          </BriefingSection>

          {/* Bloco 2 — Prioridades */}
          <BriefingSection num="2" title="Prioridades operacionais">
            <BriefingList items={briefing.prioridades} editing={editing} onChange={items => update('prioridades', items)} numbered/>
          </BriefingSection>

          {/* Bloco 3 — Atenção */}
          <BriefingSection num="3" title="Pontos de atenção" tone="danger">
            <BriefingList items={briefing.atencao} editing={editing} onChange={items => update('atencao', items)}/>
          </BriefingSection>

          {/* Bloco 4 — Patrulhas / sectores */}
          <BriefingSection num="4" title="Mapa operacional · patrulhas e sectores">
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 6, fontSize: 11 }}>
              <thead>
                <tr style={{ background: '#F2F0E8' }}>
                  {['Indicativo','Militares','Sector','Viatura'].map(h => (
                    <th key={h} style={{ padding: '6px 10px', textAlign: 'left', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#5A6D63', borderBottom: '1px solid #C8C2A8' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {briefing.patrulhas.map((p, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #E8E4D2' }}>
                    <td style={{ padding: '8px 10px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#1F4D3A' }}>{p.indicativo}</td>
                    <td style={{ padding: '8px 10px' }}>{p.militares}</td>
                    <td style={{ padding: '8px 10px', color: '#3A5044' }}>{p.sector}</td>
                    <td style={{ padding: '8px 10px', fontFamily: 'var(--font-mono)' }}>{p.viatura}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </BriefingSection>

          {/* Bloco 5 — Observações */}
          <BriefingSection num="5" title="Observações do comandante">
            {editing ? (
              <textarea className="briefing-input" rows={4} value={briefing.observacoes} onChange={e => update('observacoes', e.target.value)} style={{ resize: 'vertical' }}/>
            ) : (
              <div style={{ fontSize: 11, color: '#3A5044', whiteSpace: 'pre-wrap' }}>{briefing.observacoes}</div>
            )}
          </BriefingSection>

          {/* Footer / signature */}
          <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #C8C2A8', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div style={{ fontSize: 10, color: '#7A847E', maxWidth: 320 }}>
              Documento de uso interno · não difundir.<br/>
              Difundido em <b>{briefing.data}</b> às 08:00 a todo o efetivo via Sentinela.
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'cursive', fontSize: 22, color: '#0F2A20', borderBottom: '1px solid #0F2A20', padding: '8px 40px 2px' }}>Costa Ribeiro</div>
              <div style={{ fontSize: 10, color: '#5A6D63', marginTop: 4 }}><b>{briefing.autor}</b><br/>Cmdt. do Posto Territorial de Vila Real</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BriefingSection = ({ num, title, tone = 'neutral', children }) => (
  <div style={{ marginTop: 18 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
      <div style={{
        width: 22, height: 22, borderRadius: 4,
        background: tone === 'danger' ? '#C7322B' : '#1F4D3A',
        color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700,
      }}>{num}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, color: tone === 'danger' ? '#8E1F1A' : '#0F2A20', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{title}</div>
    </div>
    {children}
  </div>
);

const BriefingField = ({ label, icon, value, editing, onChange }) => (
  <div>
    <div style={{ fontSize: 9, fontWeight: 700, color: '#5A6D63', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3, display: 'flex', alignItems: 'center', gap: 5 }}>
      <Icon name={icon} size={11}/> {label}
    </div>
    {editing ? (
      <input className="briefing-input" value={value} onChange={e => onChange(e.target.value)}/>
    ) : (
      <div style={{ fontSize: 11, color: '#0F2A20' }}>{value}</div>
    )}
  </div>
);

const BriefingList = ({ items, editing, onChange, numbered }) => {
  if (!editing) {
    return (
      <ol style={{ margin: '6px 0 0', padding: '0 0 0 22px', listStyleType: numbered ? 'decimal' : 'disc' }}>
        {items.map((it, i) => (
          <li key={i} style={{ fontSize: 11, color: '#0F2A20', marginBottom: 4 }}>{it}</li>
        ))}
      </ol>
    );
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 6 }}>
      {items.map((it, i) => (
        <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <span style={{ fontSize: 10, color: '#5A6D63', width: 18, textAlign: 'right', fontFamily: 'var(--font-mono)' }}>{i + 1}.</span>
          <input className="briefing-input" value={it} onChange={e => onChange(items.map((x, j) => j === i ? e.target.value : x))}/>
          <button onClick={() => onChange(items.filter((_, j) => j !== i))} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#C7322B' }}>
            <Icon name="x" size={14}/>
          </button>
        </div>
      ))}
      <button onClick={() => onChange([...items, ''])} style={{
        border: '1px dashed var(--border-strong)', background: 'transparent', borderRadius: 6,
        padding: '6px 10px', fontSize: 11, fontWeight: 600, color: 'var(--fg-muted)', cursor: 'pointer', marginTop: 4,
        display: 'flex', alignItems: 'center', gap: 4, alignSelf: 'flex-start',
      }}>
        <Icon name="plus" size={12}/> Adicionar
      </button>
    </div>
  );
};

const EfetivoChip = ({ n, label, c }) => (
  <div style={{
    display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px',
    background: '#F2F0E8', border: '1px solid #E8E4D2', borderRadius: 999, fontSize: 10,
  }}>
    <span style={{ width: 8, height: 8, borderRadius: '50%', background: c }}/>
    <b style={{ color: '#0F2A20' }}>{n}</b> {label}
  </div>
);

window.BriefingView = BriefingView;
