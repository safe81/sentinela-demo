/* Sentinela PC — Estatísticas e KPIs operacionais */

const DADOS_EST = {
  alertasPorTipo: [
    { label: 'Viatura furtada',       n: 8, cor: '#C7322B' },
    { label: 'Sem seguro válido',      n: 7, cor: '#DAA428' },
    { label: 'Sem inspeção/licença',   n: 5, cor: '#2E5C8A' },
    { label: 'Pesquisa SIIOP',         n: 3, cor: '#1F4D3A' },
  ],
  patrulhasPorDia: [
    { dia: 'Seg', n: 4 },
    { dia: 'Ter', n: 3 },
    { dia: 'Qua', n: 5 },
    { dia: 'Qui', n: 3 },
    { dia: 'Sex', n: 6 },
    { dia: 'Sáb', n: 4 },
    { dia: 'Dom', n: 2 },
  ],
  tendencia: [
    { mes: 'Jan', alertas: 12 },
    { mes: 'Fev', alertas: 15 },
    { mes: 'Mar', alertas: 18 },
    { mes: 'Abr', alertas: 19 },
    { mes: 'Mai', alertas: 23 },
  ],
  militares: [
    { nome: 'Cb. Silva',    nim: '11045612', patrulhas: 14, km: 124, alertas: 6, resolucao: 92 },
    { nome: 'Cb. Santos',   nim: '11052341', patrulhas: 12, km:  98, alertas: 4, resolucao: 88 },
    { nome: 'Gd. Ferreira', nim: '11063201', patrulhas: 11, km:  87, alertas: 3, resolucao: 85 },
    { nome: 'Gd. Costa',    nim: '11071234', patrulhas: 10, km:  79, alertas: 5, resolucao: 80 },
    { nome: 'Cb. Martins',  nim: '11082345', patrulhas:  9, km:  71, alertas: 2, resolucao: 90 },
  ],
};

const KPIBig = ({ icon, label, value, unit, delta, up }) => (
  <div style={{
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 12, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 10,
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{
        width: 34, height: 34, borderRadius: 8,
        background: 'rgba(31,77,58,0.08)', color: 'var(--brand-green)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <Icon name={icon} size={17}/>
      </div>
      <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--fg-muted)', lineHeight: 1.3 }}>{label}</div>
    </div>
    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 36, lineHeight: 1, color: 'var(--fg)' }}>
      {value}<span style={{ fontSize: 18, fontWeight: 600, color: 'var(--fg-muted)', marginLeft: 4 }}>{unit}</span>
    </div>
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600,
      color: up ? 'var(--success)' : 'var(--danger)',
    }}>
      <Icon name={up ? 'arrow-up' : 'arrow-down'} size={11}/> {delta}
    </div>
  </div>
);

const GraficoLinha = ({ dados }) => {
  const W = 500, H = 150;
  const pad = { top: 16, right: 36, bottom: 28, left: 36 };
  const gW = W - pad.left - pad.right;
  const gH = H - pad.top - pad.bottom;
  const n = dados.length;
  const xs = dados.map((_, i) => pad.left + (i / (n - 1)) * gW);
  // scale alertas: visible range 8–26
  const yV = v => pad.top + gH - ((v - 8) / 18) * gH;
  const pts = dados.map((d, i) => `${xs[i]},${yV(d.alertas)}`).join(' ');
  const area = `M ${xs[0]},${yV(dados[0].alertas)} ` +
    dados.slice(1).map((d, i) => `L ${xs[i+1]},${yV(d.alertas)}`).join(' ') +
    ` L ${xs[n-1]},${pad.top + gH} L ${xs[0]},${pad.top + gH} Z`;

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" style={{ display: 'block' }}>
      {[10, 15, 20, 25].map(v => {
        const y = yV(v);
        if (y < pad.top - 2 || y > pad.top + gH + 2) return null;
        return (
          <g key={v}>
            <line x1={pad.left} y1={y} x2={W - pad.right} y2={y}
              stroke="var(--border)" strokeWidth="1" strokeDasharray="4 3"/>
            <text x={pad.left - 6} y={y + 4} fill="var(--fg-muted)" fontSize="9.5"
              textAnchor="end" fontFamily="var(--font-mono)">{v}</text>
          </g>
        );
      })}

      {dados.map((d, i) => (
        <text key={i} x={xs[i]} y={H - 4} fill="var(--fg-muted)" fontSize="9.5"
          textAnchor="middle" fontFamily="var(--font-sans)">{d.mes}</text>
      ))}

      <path d={area} fill="rgba(199,50,43,0.07)"/>
      <polyline points={pts} fill="none" stroke="#C7322B" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/>

      {dados.map((d, i) => (
        <g key={i}>
          <circle cx={xs[i]} cy={yV(d.alertas)} r="4" fill="#C7322B" stroke="var(--surface)" strokeWidth="2.5"/>
          {i === n - 1 && (
            <text x={xs[i] + 10} y={yV(d.alertas) + 4} fill="#C7322B" fontSize="11" fontWeight="700"
              fontFamily="var(--font-mono)">{d.alertas}</text>
          )}
        </g>
      ))}
    </svg>
  );
};

const GraficoBarras = ({ dados }) => {
  const W = 300, H = 130;
  const max = Math.max(...dados.map(d => d.n));
  const barW = 26;
  const step = (W - 10) / dados.length;
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" style={{ display: 'block' }}>
      {dados.map((d, i) => {
        const x = 5 + i * step + (step - barW) / 2;
        const barH = (d.n / (max + 1)) * 95;
        const y = 100 - barH;
        const isMax = d.n === max;
        return (
          <g key={d.dia}>
            <rect x={x} y={y} width={barW} height={barH} rx="5"
              fill={isMax ? 'var(--brand-green)' : 'rgba(31,77,58,0.15)'}/>
            <text x={x + barW / 2} y={y - 5} fill={isMax ? 'var(--brand-green)' : 'var(--fg-muted)'}
              fontSize="9.5" fontWeight="700" textAnchor="middle" fontFamily="var(--font-mono)">{d.n}</text>
            <text x={x + barW / 2} y={118} fill="var(--fg-muted)" fontSize="9.5"
              textAnchor="middle" fontFamily="var(--font-sans)">{d.dia}</text>
          </g>
        );
      })}
    </svg>
  );
};

const AlertasPorTipo = ({ dados }) => {
  const max = Math.max(...dados.map(d => d.n));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {dados.map((d, i) => (
        <div key={i}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
            <span style={{ fontSize: 12, color: 'var(--fg)' }}>{d.label}</span>
            <span style={{ fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{d.n}</span>
          </div>
          <div style={{ height: 9, background: 'var(--surface-2)', borderRadius: 5, overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${(d.n / max) * 100}%`,
              background: d.cor, borderRadius: 5, transition: 'width 0.8s ease',
            }}/>
          </div>
        </div>
      ))}
    </div>
  );
};

const BarraResolucao = ({ valor }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
    <div style={{ flex: 1, height: 6, background: 'var(--surface-2)', borderRadius: 3, overflow: 'hidden' }}>
      <div style={{
        height: '100%', width: `${valor}%`, borderRadius: 3,
        background: valor >= 90 ? 'var(--success)' : valor >= 80 ? 'var(--warning)' : 'var(--danger)',
      }}/>
    </div>
    <span style={{ fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--fg-muted)', minWidth: 34, textAlign: 'right' }}>{valor}%</span>
  </div>
);

const EstatisticasView = () => {
  const D = DADOS_EST;
  const { useStore } = window.SentinelaStore;
  const alertas = useStore(s => s.alertas);
  const totalAlertasVivos = alertas.length;
  const totalKmVivos = useStore(s => s.patrulhasHistorico.reduce((acc, p) => {
    if (p.kmFinal && p.kmInicial) return acc + (p.kmFinal - p.kmInicial);
    return acc;
  }, 0));

  const exportarCSV = () => {
    const v = totalAlertasVivos || 23;
    const total = D.alertasPorTipo.reduce((s, d) => s + d.n, 0);
    const rows = [
      ['SENTINELA — ESTATÍSTICAS OPERACIONAIS'],
      ['Posto Territorial de Vila Real — Maio 2026'],
      ['Gerado em:', new Date().toLocaleString('pt-PT')],
      [],
      ['KPIs OPERACIONAIS', 'Valor', 'Variação'],
      ['KM Patrulhados (maio)', '342 km', '+12% vs abril'],
      ['Taxa de Resolução', '87%', '+3 pp vs abril'],
      ['Tempo Médio Resposta', '4.2 min', '-0.8 min'],
      ['Alertas ANPR (maio)', v, '+4 vs abril'],
      [],
      ['TENDÊNCIA ALERTAS ANPR 2026', '', ''],
      ['Mês', 'Alertas'],
      ...D.tendencia.map(d => [d.mes, d.alertas]),
      [],
      ['PATRULHAS POR DIA DA SEMANA', '', ''],
      ['Dia', 'Patrulhas'],
      ...D.patrulhasPorDia.map(d => [d.dia, d.n]),
      [],
      ['ALERTAS ANPR POR MOTIVO', '', ''],
      ['Motivo', 'Total', '% total'],
      ...D.alertasPorTipo.map(d => [d.label, d.n, `${Math.round((d.n / total) * 100)}%`]),
      [],
      ['DESEMPENHO POR MILITAR — MAIO 2026', '', '', '', '', ''],
      ['Militar', 'NIM', 'Patrulhas', 'KM', 'Alertas', 'Taxa Resolução'],
      ...D.militares.map(m => [m.nome, m.nim, m.patrulhas, m.km, m.alertas, `${m.resolucao}%`]),
    ];
    const csv = rows.map(r => r.map(c => `"${String(c ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'sentinela-estatisticas.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const exportarPDF = () => {
    const v = totalAlertasVivos || 23;
    const total = D.alertasPorTipo.reduce((s, d) => s + d.n, 0);
    const data = new Date().toLocaleString('pt-PT');
    const html = `<!DOCTYPE html>
<html lang="pt-PT"><head><meta charset="UTF-8"><title>Estatísticas Sentinela GNR</title>
<style>
*{box-sizing:border-box}body{font-family:Arial,sans-serif;margin:0;padding:24px 32px;color:#1a1a1a;font-size:12px}
.hdr{border-bottom:3px solid #1F4D3A;padding-bottom:12px;margin-bottom:18px;display:flex;align-items:flex-end}
.hdr h1{margin:0;font-size:19px;color:#1F4D3A}.hdr p{margin:4px 0 0;color:#666;font-size:11px}
.hdr-r{margin-left:auto;text-align:right;color:#666;font-size:11px}
.kpi-row{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:18px}
.kpi{border:1px solid #ddd;border-radius:7px;padding:12px;text-align:center}
.kpi-v{font-size:26px;font-weight:700;color:#1F4D3A;line-height:1.1}
.kpi-l{font-size:10px;color:#888;text-transform:uppercase;letter-spacing:.05em;margin-top:3px}
.kpi-d{font-size:11px;color:#367a44;margin-top:2px}
.two{display:grid;grid-template-columns:1fr 1fr;gap:14px}
h2{font-size:12px;color:#1F4D3A;margin:16px 0 6px;border-left:3px solid #1F4D3A;padding-left:7px;text-transform:uppercase;letter-spacing:.04em}
table{width:100%;border-collapse:collapse;margin-bottom:14px}
th{background:#1F4D3A;color:#fff;padding:6px 10px;text-align:left;font-size:11px}
td{padding:5px 10px;border-bottom:1px solid #eee;font-size:12px}
tr:nth-child(even) td{background:#f9f9f9}
footer{margin-top:28px;padding-top:10px;border-top:1px solid #ddd;font-size:10px;color:#aaa;text-align:center}
@media print{@page{margin:12mm}.no-print{display:none}}
</style></head><body>
<div class="hdr"><div><h1>SENTINELA — Estatísticas Operacionais</h1><p>Posto Territorial de Vila Real · Período: Maio 2026</p></div>
<div class="hdr-r">Gerado em: ${data}<br>Dados de demonstração</div></div>
<div class="kpi-row">
<div class="kpi"><div class="kpi-v">342 km</div><div class="kpi-l">KM Patrulhados</div><div class="kpi-d">↑ +12% vs abril</div></div>
<div class="kpi"><div class="kpi-v">87%</div><div class="kpi-l">Taxa Resolução</div><div class="kpi-d">↑ +3 pp vs abril</div></div>
<div class="kpi"><div class="kpi-v">4.2 min</div><div class="kpi-l">Tempo Médio Resposta</div><div class="kpi-d">↓ −0.8 min</div></div>
<div class="kpi"><div class="kpi-v">${v}</div><div class="kpi-l">Alertas ANPR</div><div class="kpi-d">↑ +4 vs abril</div></div>
</div>
<div class="two">
<div><h2>Tendência de Alertas ANPR 2026</h2><table><tr><th>Mês</th><th>Alertas</th></tr>
${D.tendencia.map(d => `<tr><td>${d.mes}</td><td>${d.alertas}</td></tr>`).join('')}</table></div>
<div><h2>Patrulhas por dia da semana</h2><table><tr><th>Dia</th><th>Patrulhas</th></tr>
${D.patrulhasPorDia.map(d => `<tr><td>${d.dia}</td><td>${d.n}</td></tr>`).join('')}</table></div>
</div>
<h2>Alertas ANPR por motivo</h2><table><tr><th>Motivo</th><th>Total</th><th>% total</th></tr>
${D.alertasPorTipo.map(d => `<tr><td>${d.label}</td><td>${d.n}</td><td>${Math.round((d.n/total)*100)}%</td></tr>`).join('')}</table>
<h2>Desempenho por militar — Maio 2026</h2>
<table><tr><th>Militar</th><th>NIM</th><th>Patrulhas</th><th>KM</th><th>Alertas</th><th>Taxa Resolução</th></tr>
${D.militares.map(m => `<tr><td><strong>${m.nome}</strong></td><td>${m.nim}</td><td>${m.patrulhas}</td><td>${m.km}</td><td>${m.alertas}</td><td>${m.resolucao}%</td></tr>`).join('')}</table>
<footer>Sentinela · GNR · Posto Territorial de Vila Real · Protótipo de demonstração · Dados fictícios</footer>
<script>window.onload=()=>window.print();<\/script>
</body></html>`;
    const w = window.open('', '_blank');
    if (w) { w.document.write(html); w.document.close(); }
  };

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: 22, display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Export toolbar */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <button onClick={exportarCSV} style={{
          background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 7,
          padding: '7px 14px', cursor: 'pointer', fontSize: 12, fontWeight: 600, color: 'var(--fg)',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <Icon name="download" size={14} style={{ color: 'var(--success)' }}/> Exportar Excel
        </button>
        <button onClick={exportarPDF} style={{
          background: 'var(--brand-green)', color: '#FFF', border: 'none', borderRadius: 7,
          padding: '7px 14px', cursor: 'pointer', fontSize: 12, fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <Icon name="file-text" size={14}/> Exportar PDF
        </button>
      </div>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        <KPIBig icon="map-pin"      label="KM patrulhados — maio"  value="342"  unit="km"  delta="+12% vs abril"    up={true}/>
        <KPIBig icon="shield-check" label="Taxa de resolução"       value="87"   unit="%"   delta="+3 pp vs abril"   up={true}/>
        <KPIBig icon="clock"        label="Tempo médio resposta"    value="4.2"  unit="min" delta="−0.8 min melhoria" up={true}/>
        <KPIBig icon="eye"          label="Alertas ANPR — maio"     value={totalAlertasVivos || 23} unit="" delta="+4 vs abril" up={false}/>
      </div>

      {/* Row 2 — charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 14 }}>

        {/* Line chart */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Icon name="activity" size={15} style={{ color: '#C7322B' }}/>
            <div style={{ fontWeight: 600, fontSize: 13, flex: 1 }}>Tendência de alertas ANPR — 2026</div>
            <span style={{ fontSize: 10, color: 'var(--fg-muted)', fontFamily: 'var(--font-mono)' }}>jan – mai</span>
          </div>
          <GraficoLinha dados={D.tendencia}/>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
            <div style={{ width: 22, height: 3, background: '#C7322B', borderRadius: 2 }}/>
            <span style={{ fontSize: 10, color: 'var(--fg-muted)' }}>Alertas ANPR confirmados por mês</span>
          </div>
        </div>

        {/* Bar chart */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Icon name="shield" size={15} style={{ color: 'var(--brand-green)' }}/>
            <div style={{ fontWeight: 600, fontSize: 13, flex: 1 }}>Patrulhas por dia da semana</div>
            <Badge tone="neutral" size="sm">última semana</Badge>
          </div>
          <GraficoBarras dados={D.patrulhasPorDia}/>
          <div style={{ fontSize: 10, color: 'var(--fg-muted)', marginTop: 2 }}>
            Total: {D.patrulhasPorDia.reduce((s, d) => s + d.n, 0)} patrulhas · média {(D.patrulhasPorDia.reduce((s, d) => s + d.n, 0) / 7).toFixed(1)}/dia
          </div>
        </div>
      </div>

      {/* Row 3 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 14 }}>

        {/* Alertas por tipo */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <Icon name="alert-triangle" size={15} style={{ color: 'var(--warning)' }}/>
            <div style={{ fontWeight: 600, fontSize: 13 }}>Alertas ANPR por motivo</div>
          </div>
          <AlertasPorTipo dados={D.alertasPorTipo}/>
          <div style={{ marginTop: 14, paddingTop: 10, borderTop: '1px solid var(--border)', fontSize: 11, color: 'var(--fg-muted)', display: 'flex', justifyContent: 'space-between' }}>
            <span>Total registado</span>
            <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--fg)' }}>{D.alertasPorTipo.reduce((s, d) => s + d.n, 0)}</span>
          </div>
        </div>

        {/* Performance por militar */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon name="users" size={15} style={{ color: 'var(--brand-green)' }}/>
            <div style={{ fontWeight: 600, fontSize: 13, flex: 1 }}>Desempenho por militar — maio 2026</div>
            <span style={{ fontSize: 10, color: 'var(--fg-muted)' }}>patrulhas · km · resolução</span>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ background: 'var(--surface-2)' }}>
                {['Militar', 'Patrulhas', 'KM', 'Alertas', 'Resolução'].map((h, i) => (
                  <th key={h} style={{
                    padding: '8px 12px', textAlign: i === 0 || i === 4 ? 'left' : 'right',
                    fontSize: 10, fontWeight: 600, color: 'var(--fg-muted)',
                    textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid var(--border)',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {D.militares.map((m, i) => (
                <tr key={i} style={{ borderBottom: i < D.militares.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <td style={{ padding: '9px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Avatar name={m.nome.replace(/^(Cb\.|Gd\.) /, '')} size={26}/>
                      <div>
                        <div style={{ fontWeight: 600 }}>{m.nome}</div>
                        <div style={{ fontSize: 10, color: 'var(--fg-muted)', fontFamily: 'var(--font-mono)' }}>NIM {m.nim}</div>
                      </div>
                    </div>
                  </td>
                  <td className="t-mono" style={{ padding: '9px 12px', textAlign: 'right', fontWeight: 700 }}>{m.patrulhas}</td>
                  <td className="t-mono" style={{ padding: '9px 12px', textAlign: 'right', color: 'var(--fg-muted)' }}>{m.km}</td>
                  <td className="t-mono" style={{ padding: '9px 12px', textAlign: 'right' }}>{m.alertas}</td>
                  <td style={{ padding: '9px 12px', minWidth: 130 }}>
                    <BarraResolucao valor={m.resolucao}/>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { EstatisticasView });
