/* Sentinela PC — Painel de Administração */

const POSTOS_CONFIG = [
  { posto: 'Sargento',   abrev: 'Sarg.'   },
  { posto: 'Cabo-chefe', abrev: 'Cb.-Ch.' },
  { posto: 'Cabo',       abrev: 'Cb.'     },
  { posto: 'Guarda',     abrev: 'Gd.'     },
];
const SECOES_CONFIG = ['Cmdt. Posto','Cmdt. Adj.','Cmdt. 2.º','Patrulha','Patrulha Territorial','Trânsito','Investigação'];

const fldStyle = {
  width: '100%', padding: '7px 10px',
  background: 'var(--bg)', border: '1px solid var(--border)',
  borderRadius: 6, fontSize: 13, color: 'var(--fg)',
  boxSizing: 'border-box', fontFamily: 'inherit',
};
const lblStyle = {
  fontSize: 10, fontWeight: 700, color: 'var(--fg-muted)',
  textTransform: 'uppercase', letterSpacing: '0.05em',
  display: 'block', marginBottom: 5,
};

/* ---- Shared overlay modal ---- */
const AdminModal = ({ title, onClose, width = 500, children }) => (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9000, padding: 24 }}>
    <div style={{ background: 'var(--surface)', borderRadius: 12, width, maxWidth: '100%', maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 80px rgba(0,0,0,0.28)' }}>
      <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center' }}>
        <div style={{ fontWeight: 700, fontSize: 14, flex: 1 }}>{title}</div>
        <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--fg-muted)', padding: 4 }}>
          <Icon name="x" size={18}/>
        </button>
      </div>
      <div style={{ padding: 18, overflowY: 'auto', flex: 1 }}>{children}</div>
    </div>
  </div>
);

const SaveBtn = ({ saved, onClick, label = 'Guardar alterações' }) => (
  <button onClick={onClick} style={{
    background: saved ? 'var(--success)' : 'var(--brand-green)', color: '#FFF',
    border: 'none', borderRadius: 8, padding: '9px 20px', fontWeight: 700,
    cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6,
  }}>
    <Icon name={saved ? 'check' : 'save'} size={15}/>
    {saved ? 'Guardado!' : label}
  </button>
);

/* ---- Tab: Posto ---- */
const AdminPosto = () => {
  const { useStore, actions } = window.SentinelaStore;
  const posto = useStore(s => s.posto);
  const [form, setForm] = React.useState({ ...posto });
  const [saved, setSaved] = React.useState(false);
  React.useEffect(() => { setForm({ ...posto }); }, [JSON.stringify(posto)]);
  const guardar = () => { actions.updatePosto(form); setSaved(true); setTimeout(() => setSaved(false), 2500); };
  return (
    <div style={{ maxWidth: 520 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {[
          { key: 'nome',         label: 'Nome do Posto' },
          { key: 'destacamento', label: 'Destacamento' },
          { key: 'comando',      label: 'Comando Territorial' },
          { key: 'morada',       label: 'Morada' },
        ].map(({ key, label }) => (
          <div key={key}>
            <label style={lblStyle}>{label}</label>
            <input value={form[key] || ''} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} style={fldStyle}/>
          </div>
        ))}
        <div style={{ paddingTop: 4 }}>
          <SaveBtn saved={saved} onClick={guardar}/>
        </div>
      </div>
    </div>
  );
};

/* ---- Tab: Militares ---- */
const AdminMilitares = () => {
  const { useStore, actions } = window.SentinelaStore;
  const militares = useStore(s => s.militares);
  const [modal, setModal] = React.useState(null);
  const empty = { nim: '', posto: 'Guarda', postoAbrev: 'Gd.', nome: '', nomeCompleto: '', secao: 'Patrulha', estado: 'servico', indicativo: '—', anoIngresso: 2024, diasFerias: 22 };
  const [form, setForm] = React.useState(empty);
  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const abrir = (m) => { setForm(m ? { ...m } : empty); setModal(m ? m.id : 'add'); };
  const guardar = () => {
    const p = POSTOS_CONFIG.find(x => x.posto === form.posto);
    const patch = { ...form, postoAbrev: p?.abrev || form.postoAbrev };
    modal === 'add' ? actions.addMilitar(patch) : actions.updateMilitar(modal, patch);
    setModal(null);
  };
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <span style={{ fontWeight: 600, fontSize: 13, flex: 1 }}>{militares.length} militares no efectivo</span>
        <button onClick={() => abrir(null)} style={{ background: 'var(--brand-green)', color: '#FFF', border: 'none', borderRadius: 7, padding: '7px 14px', fontWeight: 600, cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Icon name="plus" size={14}/> Novo militar
        </button>
      </div>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ background: 'var(--surface-2)' }}>
              {['NIM','Posto','Nome','Secção','Ingresso','Férias','Estado',''].map(h => (
                <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 10, fontWeight: 600, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {militares.map(m => (
              <tr key={m.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td className="t-mono" style={{ padding: '9px 12px', fontSize: 11, color: 'var(--fg-muted)' }}>{m.nim}</td>
                <td style={{ padding: '9px 12px' }}>
                  <span style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 4, padding: '2px 6px', fontSize: 11, fontWeight: 600 }}>{m.postoAbrev}</span>
                </td>
                <td style={{ padding: '9px 12px', fontWeight: 600 }}>{m.nome}</td>
                <td style={{ padding: '9px 12px', color: 'var(--fg-muted)' }}>{m.secao}</td>
                <td className="t-mono" style={{ padding: '9px 12px' }}>{m.anoIngresso}</td>
                <td className="t-mono" style={{ padding: '9px 12px', fontWeight: 700, color: 'var(--brand-green)' }}>{m.diasFerias}d</td>
                <td style={{ padding: '9px 12px' }}>
                  <Badge tone={m.estado === 'patrulha' ? 'info' : m.estado === 'servico' ? 'success' : 'neutral'} size="sm">{m.estado}</Badge>
                </td>
                <td style={{ padding: '9px 12px' }}>
                  <button onClick={() => abrir(m)} style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: 5, padding: '4px 10px', cursor: 'pointer', fontSize: 11, fontWeight: 600, color: 'var(--fg)' }}>Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal !== null && (
        <AdminModal title={modal === 'add' ? 'Novo militar' : 'Editar militar'} onClose={() => setModal(null)}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div><label style={lblStyle}>NIM</label><input value={form.nim} onChange={e => upd('nim', e.target.value)} style={fldStyle} placeholder="1234567"/></div>
            <div><label style={lblStyle}>Posto</label>
              <select value={form.posto} onChange={e => upd('posto', e.target.value)} style={fldStyle}>
                {POSTOS_CONFIG.map(p => <option key={p.posto} value={p.posto}>{p.posto}</option>)}
              </select>
            </div>
            <div><label style={lblStyle}>Nome / Apelido</label><input value={form.nome} onChange={e => upd('nome', e.target.value)} style={fldStyle}/></div>
            <div><label style={lblStyle}>Nome completo</label><input value={form.nomeCompleto || ''} onChange={e => upd('nomeCompleto', e.target.value)} style={fldStyle}/></div>
            <div><label style={lblStyle}>Secção</label>
              <select value={form.secao} onChange={e => upd('secao', e.target.value)} style={fldStyle}>
                {SECOES_CONFIG.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div><label style={lblStyle}>Indicativo</label><input value={form.indicativo} onChange={e => upd('indicativo', e.target.value)} style={fldStyle} placeholder="VRL-21"/></div>
            <div><label style={lblStyle}>Ano ingresso</label><input type="number" value={form.anoIngresso} onChange={e => upd('anoIngresso', Number(e.target.value))} style={fldStyle} min="1980" max="2030"/></div>
            <div><label style={lblStyle}>Dias de férias</label><input type="number" value={form.diasFerias} onChange={e => upd('diasFerias', Number(e.target.value))} style={fldStyle} min="0" max="30"/></div>
            <div><label style={lblStyle}>Estado</label>
              <select value={form.estado} onChange={e => upd('estado', e.target.value)} style={fldStyle}>
                <option value="servico">Ao serviço</option>
                <option value="patrulha">Em patrulha</option>
                <option value="folga">Folga</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
            <button onClick={() => setModal(null)} style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: 7, padding: '8px 16px', cursor: 'pointer', fontSize: 13 }}>Cancelar</button>
            <button onClick={guardar} style={{ background: 'var(--brand-green)', color: '#FFF', border: 'none', borderRadius: 7, padding: '8px 20px', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>
              {modal === 'add' ? '+ Adicionar' : 'Guardar'}
            </button>
          </div>
        </AdminModal>
      )}
    </>
  );
};

/* ---- Tab: Viaturas ---- */
const AdminViaturas = () => {
  const { useStore, actions } = window.SentinelaStore;
  const viaturas = useStore(s => s.viaturas);
  const [modal, setModal] = React.useState(null);
  const empty = { matricula: '', marca: '', modelo: '', indicativo: '', km: 0, combustivel: 100, estado: 'disponivel' };
  const [form, setForm] = React.useState(empty);
  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const abrir = (v) => { setForm(v ? { ...v } : empty); setModal(v ? v.id : 'add'); };
  const guardar = () => {
    const patch = { ...form, km: Number(form.km), combustivel: Number(form.combustivel) };
    modal === 'add' ? actions.addViatura(patch) : actions.updateViatura(modal, patch);
    setModal(null);
  };
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <span style={{ fontWeight: 600, fontSize: 13, flex: 1 }}>{viaturas.length} viaturas na frota</span>
        <button onClick={() => abrir(null)} style={{ background: 'var(--brand-green)', color: '#FFF', border: 'none', borderRadius: 7, padding: '7px 14px', fontWeight: 600, cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Icon name="plus" size={14}/> Nova viatura
        </button>
      </div>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ background: 'var(--surface-2)' }}>
              {['Matrícula','Marca','Modelo','Indicativo','KM','Comb.','Estado',''].map(h => (
                <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 10, fontWeight: 600, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {viaturas.map(v => (
              <tr key={v.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '9px 12px' }}><Plate value={v.matricula} size="sm"/></td>
                <td style={{ padding: '9px 12px', fontWeight: 600 }}>{v.marca}</td>
                <td style={{ padding: '9px 12px', color: 'var(--fg-muted)' }}>{v.modelo}</td>
                <td className="t-mono" style={{ padding: '9px 12px', fontWeight: 600 }}>{v.indicativo}</td>
                <td className="t-mono" style={{ padding: '9px 12px' }}>{v.km?.toLocaleString('pt-PT')}</td>
                <td style={{ padding: '9px 12px' }}>
                  <span className="t-mono" style={{ fontWeight: 700, color: v.combustivel < 25 ? 'var(--danger)' : v.combustivel < 50 ? 'var(--warning)' : 'var(--success)' }}>{v.combustivel}%</span>
                </td>
                <td style={{ padding: '9px 12px' }}>
                  <Badge tone={v.estado === 'patrulha' ? 'info' : v.estado === 'disponivel' ? 'success' : 'warning'} size="sm">{v.estado}</Badge>
                </td>
                <td style={{ padding: '9px 12px' }}>
                  <button onClick={() => abrir(v)} style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: 5, padding: '4px 10px', cursor: 'pointer', fontSize: 11, fontWeight: 600, color: 'var(--fg)' }}>Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal !== null && (
        <AdminModal title={modal === 'add' ? 'Nova viatura' : 'Editar viatura'} onClose={() => setModal(null)}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div><label style={lblStyle}>Matrícula</label><input value={form.matricula} onChange={e => upd('matricula', e.target.value)} style={fldStyle} placeholder="MA-00-00"/></div>
            <div><label style={lblStyle}>Indicativo</label><input value={form.indicativo} onChange={e => upd('indicativo', e.target.value)} style={fldStyle} placeholder="VRL-21"/></div>
            <div><label style={lblStyle}>Marca</label><input value={form.marca} onChange={e => upd('marca', e.target.value)} style={fldStyle}/></div>
            <div><label style={lblStyle}>Modelo</label><input value={form.modelo} onChange={e => upd('modelo', e.target.value)} style={fldStyle}/></div>
            <div><label style={lblStyle}>KM atual</label><input type="number" value={form.km} onChange={e => upd('km', e.target.value)} style={fldStyle} min="0"/></div>
            <div><label style={lblStyle}>Combustível (%)</label><input type="number" value={form.combustivel} onChange={e => upd('combustivel', e.target.value)} style={fldStyle} min="0" max="100"/></div>
            <div style={{ gridColumn: '1/-1' }}><label style={lblStyle}>Estado</label>
              <select value={form.estado} onChange={e => upd('estado', e.target.value)} style={fldStyle}>
                <option value="disponivel">Disponível</option>
                <option value="patrulha">Em patrulha</option>
                <option value="manutencao">Manutenção</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
            <button onClick={() => setModal(null)} style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: 7, padding: '8px 16px', cursor: 'pointer', fontSize: 13 }}>Cancelar</button>
            <button onClick={guardar} style={{ background: 'var(--brand-green)', color: '#FFF', border: 'none', borderRadius: 7, padding: '8px 20px', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>
              {modal === 'add' ? '+ Adicionar' : 'Guardar'}
            </button>
          </div>
        </AdminModal>
      )}
    </>
  );
};

/* ---- Tab: Férias (admin) ---- */
const AdminFeriasRow = ({ m, pos }) => {
  const { actions } = window.SentinelaStore;
  const [editing, setEditing] = React.useState(false);
  const [val, setVal] = React.useState(m.diasFerias);
  const guardar = () => { actions.setDiasFerias(m.id, val); setEditing(false); };
  return (
    <tr style={{ borderBottom: '1px solid var(--border)' }}>
      <td className="t-mono" style={{ padding: '9px 14px', color: 'var(--fg-muted)', fontSize: 11 }}>{pos}</td>
      <td style={{ padding: '9px 14px', fontWeight: 600 }}>{m.nome}</td>
      <td style={{ padding: '9px 14px' }}>
        <span style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 4, padding: '2px 6px', fontSize: 11, fontWeight: 600 }}>{m.postoAbrev}</span>
      </td>
      <td className="t-mono" style={{ padding: '9px 14px' }}>{m.anoIngresso}</td>
      <td style={{ padding: '9px 14px' }}>
        {editing ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <input type="number" value={val} onChange={e => setVal(Number(e.target.value))}
              style={{ ...fldStyle, width: 64, padding: '4px 8px' }} min="0" max="30"/>
            <button onClick={guardar} style={{ background: 'var(--brand-green)', color: '#FFF', border: 'none', borderRadius: 5, padding: '4px 10px', cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>✓</button>
            <button onClick={() => { setEditing(false); setVal(m.diasFerias); }} style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: 5, padding: '4px 10px', cursor: 'pointer', fontSize: 12 }}>✕</button>
          </div>
        ) : (
          <span className="t-mono" style={{ fontWeight: 700, color: 'var(--brand-green)' }}>{m.diasFerias} dias</span>
        )}
      </td>
      <td style={{ padding: '9px 14px' }}>
        {!editing && (
          <button onClick={() => setEditing(true)} style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: 5, padding: '4px 10px', cursor: 'pointer', fontSize: 11, fontWeight: 600, color: 'var(--fg)' }}>Editar</button>
        )}
      </td>
    </tr>
  );
};

const AdminFerias = () => {
  const { useStore, actions, ordemAntiguidade } = window.SentinelaStore;
  const ferias = useStore(s => s.ferias);
  const militares = useStore(s => s.militares);
  const fila = ordemAntiguidade(militares);
  const [novoAno, setNovoAno] = React.useState(ferias.ano + 1);
  const [confirmar, setConfirmar] = React.useState(false);
  return (
    <div>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 16, marginBottom: 18, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14 }}>Férias {ferias.ano}</div>
          <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 2 }}>
            {ferias.concluidos.length}/{militares.length} concluídos · {ferias.periodos.length} períodos marcados
          </div>
        </div>
        <div style={{ flex: 1 }}/>
        {!confirmar ? (
          <button onClick={() => setConfirmar(true)} style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 7, padding: '8px 14px', cursor: 'pointer', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icon name="refresh-cw" size={13}/> Reiniciar para novo ano
          </button>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, color: 'var(--fg-muted)' }}>Novo ano:</span>
            <input type="number" value={novoAno} onChange={e => setNovoAno(Number(e.target.value))}
              style={{ ...fldStyle, width: 80, padding: '6px 8px' }} min="2026" max="2040"/>
            <button onClick={() => { actions.resetFeriasAno(novoAno); setConfirmar(false); }}
              style={{ background: 'var(--danger)', color: '#FFF', border: 'none', borderRadius: 7, padding: '7px 14px', cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>Confirmar</button>
            <button onClick={() => setConfirmar(false)}
              style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: 7, padding: '7px 12px', cursor: 'pointer', fontSize: 12 }}>Cancelar</button>
          </div>
        )}
      </div>
      <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 10 }}>Dias de férias por militar</div>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: 'var(--surface-2)' }}>
              {['#','Militar','Posto','Ingresso','Dias disponíveis',''].map(h => (
                <th key={h} style={{ padding: '8px 14px', textAlign: 'left', fontSize: 10, fontWeight: 600, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {fila.map((m, i) => <AdminFeriasRow key={m.id} m={m} pos={i + 1}/>)}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ---- Tab: Sistema ---- */
const AdminSistema = () => {
  const { useStore, actions, getState } = window.SentinelaStore;
  const tema = useStore(s => s.tema);
  const [resetConf, setResetConf] = React.useState(false);

  const exportarJSON = () => {
    const data = JSON.stringify(getState(), null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sentinela-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ maxWidth: 540 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 16 }}>
          <div className="t-overline" style={{ marginBottom: 12 }}>TEMA DA INTERFACE</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {[['claro', 'sun', 'Modo dia'], ['noturno', 'moon', 'Ronda noturna']].map(([t, icon, label]) => (
              <button key={t} onClick={() => actions.setTema(t)} style={{
                flex: 1, padding: '10px 14px',
                border: `1px solid ${tema === t ? 'var(--brand-green)' : 'var(--border)'}`,
                borderRadius: 8, cursor: 'pointer',
                background: tema === t ? 'rgba(31,77,58,0.08)' : 'var(--bg)',
                color: tema === t ? 'var(--brand-green)' : 'var(--fg)',
                fontWeight: tema === t ? 700 : 500, fontSize: 13,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}>
                <Icon name={icon} size={16}/> {label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 16 }}>
          <div className="t-overline" style={{ marginBottom: 12 }}>DADOS E BACKUP</div>
          <button onClick={exportarJSON} style={{
            background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8,
            padding: '10px 14px', cursor: 'pointer', fontWeight: 600, fontSize: 13,
            display: 'flex', alignItems: 'center', gap: 8, width: '100%',
          }}>
            <Icon name="download" size={16} style={{ color: 'var(--brand-green)' }}/>
            Exportar dados para JSON (backup completo)
          </button>
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid rgba(199,50,43,0.3)', borderRadius: 10, padding: 16 }}>
          <div className="t-overline" style={{ marginBottom: 12, color: 'var(--danger)' }}>ZONA DE PERIGO</div>
          {!resetConf ? (
            <button onClick={() => setResetConf(true)} style={{
              background: 'transparent', border: '1px solid var(--danger)', borderRadius: 8,
              padding: '9px 14px', cursor: 'pointer', fontWeight: 600, fontSize: 13,
              color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <Icon name="trash-2" size={15}/> Repor dados de demonstração
            </button>
          ) : (
            <div>
              <p style={{ fontSize: 12, color: 'var(--fg-muted)', margin: '0 0 12px' }}>
                Tens a certeza? Todos os dados actuais serão apagados e substituídos pelos dados de demonstração. Esta acção não pode ser desfeita.
              </p>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => { actions.reset(); setResetConf(false); }} style={{ background: 'var(--danger)', color: '#FFF', border: 'none', borderRadius: 7, padding: '8px 16px', cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>
                  Sim, repor tudo
                </button>
                <button onClick={() => setResetConf(false)} style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: 7, padding: '8px 16px', cursor: 'pointer', fontSize: 13 }}>Cancelar</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ---- Main AdminView ---- */
const AdminView = () => {
  const [tab, setTab] = React.useState('posto');
  const tabs = [
    { id: 'posto',     icon: 'building',  label: 'Posto' },
    { id: 'militares', icon: 'users',     label: 'Militares' },
    { id: 'viaturas',  icon: 'car',       label: 'Viaturas' },
    { id: 'ferias',    icon: 'sun',       label: 'Férias' },
    { id: 'sistema',   icon: 'settings',  label: 'Sistema' },
  ];
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', padding: '0 22px', flexShrink: 0 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            background: 'transparent', border: 'none', cursor: 'pointer', padding: '13px 16px',
            borderBottom: `2px solid ${tab === t.id ? 'var(--brand-green)' : 'transparent'}`,
            color: tab === t.id ? 'var(--brand-green)' : 'var(--fg-muted)',
            fontWeight: tab === t.id ? 700 : 500, fontSize: 13,
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <Icon name={t.icon} size={14}/> {t.label}
          </button>
        ))}
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 22 }}>
        {tab === 'posto'     && <AdminPosto/>}
        {tab === 'militares' && <AdminMilitares/>}
        {tab === 'viaturas'  && <AdminViaturas/>}
        {tab === 'ferias'    && <AdminFerias/>}
        {tab === 'sistema'   && <AdminSistema/>}
      </div>
    </div>
  );
};

window.AdminView = AdminView;
