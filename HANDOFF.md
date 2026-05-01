# Sentinela GNR — Handoff para Claude Code local

## Contexto
Este é o handoff de uma sessão Claude Code remota (claude.ai/code).
O projecto **Sentinela GNR** é um protótipo de plataforma operacional para o Posto Territorial de Vila Real (GNR). É uma PWA (Progressive Web App) feita com React 18 + Babel Standalone — sem build step, sem npm, sem bundler. Tudo corre directamente no browser.

**O teu objectivo:** Criar os ficheiros em falta na máquina local e fazer deploy da pasta `dist/` para o Netlify do utilizador.

---

## Stack técnica
- React 18 UMD + Babel Standalone (JSX no browser, sem compilação)
- Store pub/sub customizado (`window.SentinelaStore`) com localStorage + BroadcastChannel
- PWA: manifest.json + sw.js + ícones PNG gerados por Node.js puro
- Deploy: pasta `dist/` estática arrastada para Netlify Drop

---

## Estrutura de ficheiros
```
repo/
├── data.js                    # Dados estáticos (militares, viaturas, alertas, etc.)
├── store.js                   # Estado global + actions + React hook
├── colors_and_type.css        # Design tokens e tipografia
├── primitives.jsx             # Componentes base (Icon, Badge, KPIBig, Plate, etc.)
├── app_mobile/
│   ├── Login.jsx
│   ├── Patrulha.jsx
│   ├── Ocorrencia.jsx
│   ├── Scanner.jsx
│   ├── Comms.jsx
│   ├── Extras.jsx
│   ├── Ferias.jsx             # NOVO — marcação de férias por antiguidade
│   └── Shell.jsx              # MODIFICADO — adicionado Férias ao menu
├── app_pc/
│   ├── Dashboard.jsx          # MODIFICADO — adicionados Férias + Admin na sidebar
│   ├── Briefing.jsx
│   ├── PatrulhaRDS.jsx
│   ├── Other.jsx
│   ├── Estatisticas.jsx       # MODIFICADO — botões exportar Excel/PDF
│   ├── Cronologia.jsx
│   ├── FeriasPC.jsx           # NOVO — gestão de férias (Gantt + tabela)
│   └── AdminPC.jsx            # NOVO — painel de administração (5 tabs)
├── build.js                   # Script de build — gera dist/
├── gen-icons.js               # Gerador de ícones PNG (Node.js puro, sem deps)
├── manifest.json              # PWA manifest
├── sw.js                      # Service Worker
├── pc.html                    # Entry point PC (multi-file)
├── mobile.html                # Entry point mobile (multi-file)
└── dist/                      # PASTA A FAZER DEPLOY NO NETLIFY
    ├── app.html               # App única self-contained (321 KB)
    ├── manifest.json
    ├── sw.js
    ├── index.html             # Redirect para app.html
    └── assets/
        ├── icon-180.png       # iOS apple-touch-icon
        ├── icon-192.png       # Android PWA icon
        ├── icon-512.png       # Android PWA icon grande
        ├── splash-1290x2796.png  # iPhone 14 Pro Max
        ├── splash-1179x2556.png  # iPhone 14 Pro
        ├── splash-1170x2532.png  # iPhone 14 / 13
        ├── splash-750x1334.png   # iPhone 8 / SE
        └── *.svg              # Outros assets gráficos
```

---

## O que está implementado (funcionalidades completas)

### App Mobile (app_mobile/)
- Login com selecção de militar
- Abertura/fecho de patrulha (viatura, parceiro, KM, combustível, equipamento)
- Scanner ANPR (simulado)
- Pânico com GPS real e despacho de reforço
- Auto de notícia
- Chat (Posto Geral, Em Patrulha, Cmdt. Posto, Anúncios)
- Ordens de serviço
- **Férias** — marcação por ordem de antiguidade, até 5 períodos/ano, passa turno automaticamente

### App PC (app_pc/)
- Dashboard com KPIs, alertas live, mapa de viaturas
- Briefing diário (editável)
- Patrulhas RDS + histórico
- Estatísticas com **exportar Excel (CSV) e PDF**
- Cronologia de turno
- Ocorrências
- **Férias** — Gantt anual + tabela de antiguidade + estado de cada militar
- **Administração** — 5 tabs: Posto / Militares / Viaturas / Férias / Sistema

---

## Passos para recriar e fazer deploy

### Passo 1 — Obter os ficheiros fonte
Se tens o repositório `sentinelagnr` clonado localmente:
```bash
cd sentinelagnr   # ou o nome da pasta do teu repo
git pull          # actualiza para a versão mais recente
```

Se não tens o repo localmente, cria uma pasta e vou ajudar-te a criar os ficheiros.

### Passo 2 — Verificar que tens Node.js instalado
```bash
node --version   # deve ser >= 16
```

### Passo 3 — Gerar os ícones PNG
```bash
node gen-icons.js
```
Deve criar `assets/icon-180.png`, `assets/icon-192.png`, `assets/icon-512.png`.

Para os splash screens iOS, corre este script inline:
```bash
node -e "
const fs = require('fs'), path = require('path'), zlib = require('zlib');
function createPNG(w, h, drawFn) {
  const px = new Uint8Array(w * h * 4);
  const sp = (x, y, r, g, b, a=255) => { if(x<0||x>=w||y<0||y>=h)return; const i=(y*w+x)*4; px[i]=r;px[i+1]=g;px[i+2]=b;px[i+3]=a; };
  const fr = (x0,y0,x1,y1,r,g,b,a=255) => { for(let y=Math.max(0,y0);y<Math.min(h,y1);y++) for(let x=Math.max(0,x0);x<Math.min(w,x1);x++) sp(x,y,r,g,b,a); };
  const fc = (cx,cy,radius,r,g,b,a=255) => { for(let y=cy-radius;y<=cy+radius;y++) for(let x=cx-radius;x<=cx+radius;x++) if((x-cx)**2+(y-cy)**2<=radius**2) sp(x,y,r,g,b,a); };
  drawFn({sp,fr,fc,w,h});
  const crc32 = (() => { const t=new Int32Array(256); for(let i=0;i<256;i++){let c=i;for(let j=0;j<8;j++) c=(c&1)?(0xEDB88320^(c>>>1)):(c>>>1);t[i]=c;} return (buf,o=0,l=buf.length)=>{let c=-1;for(let i=o;i<o+l;i++) c=t[(c^buf[i])&0xFF]^(c>>>8);return (c^-1)>>>0;}; })();
  const w4=(buf,o,v)=>{buf[o]=(v>>>24)&0xFF;buf[o+1]=(v>>>16)&0xFF;buf[o+2]=(v>>>8)&0xFF;buf[o+3]=v&0xFF;};
  const ck=(type,data)=>{const tb=Buffer.from(type,'ascii');const b=Buffer.alloc(12+data.length);w4(b,0,data.length);tb.copy(b,4);data.copy(b,8);w4(b,8+data.length,crc32(b,4,4+data.length));return b;};
  const ihdr=Buffer.alloc(13);w4(ihdr,0,w);w4(ihdr,4,h);ihdr[8]=8;ihdr[9]=6;
  const raw=Buffer.alloc((w*4+1)*h);
  for(let y=0;y<h;y++){raw[y*(w*4+1)]=0;for(let x=0;x<w;x++){const s=(y*w+x)*4,d=y*(w*4+1)+1+x*4;raw[d]=px[s];raw[d+1]=px[s+1];raw[d+2]=px[s+2];raw[d+3]=px[s+3];}}
  return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),ck('IHDR',ihdr),ck('IDAT',zlib.deflateSync(raw,{level:6})),ck('IEND',Buffer.alloc(0))]);
}
const splashes=[[1290,2796,'splash-1290x2796.png'],[1179,2556,'splash-1179x2556.png'],[1170,2532,'splash-1170x2532.png'],[750,1334,'splash-750x1334.png']];
for(const [sw,sh,name] of splashes){
  const png=createPNG(sw,sh,({sp,fr,fc,w,h})=>{
    fr(0,0,w,h,15,42,32);
    const cx=Math.round(w/2),cy=Math.round(h/2),s=200/96;
    fc(cx,cy,100,31,77,60);
    fr(cx-Math.round(30*s),cy-Math.round(8*s),cx+Math.round(30*s),cy+Math.round(2*s),201,162,75);
    fc(cx,cy-Math.round(22*s),Math.round(8*s),255,255,255);
  });
  fs.writeFileSync(path.join(__dirname,'assets',name),png);
  console.log('  ok '+name);
}
"
```

### Passo 4 — Fazer o build
```bash
node build.js
```
Deve gerar a pasta `dist/` com `app.html` (~322 KB), `manifest.json`, `sw.js`, `index.html`, e a pasta `assets/`.

### Passo 5 — Deploy no Netlify
1. Abre [netlify.com](https://netlify.com) e faz login
2. Na página de Projects, arrasta a pasta **`dist/`** para a área de drop
3. O Netlify dá um URL `https://xxxxx.netlify.app`
4. No iPhone: abre esse URL no Safari → ícone de partilha → "Adicionar ao Ecrã de Início"

---

## Novas features implementadas nesta sessão

### 1. Sistema de férias por antiguidade
- Fila ordenada por: posto (Sarg > Cb-Ch > Cb > Gd) e depois ano de ingresso ascendente
- Cada militar marca até 5 períodos por ano, com validação de dias disponíveis
- Ao concluir, passa automaticamente ao seguinte (notificação + mensagem no chat geral)
- Visível na app mobile (Férias) e no PC (aba Férias com Gantt anual)

### 2. Painel de administração (PC)
- Aba **Posto**: editar nome, destacamento, comando, morada
- Aba **Militares**: tabela editável, adicionar novo militar (9 campos)
- Aba **Viaturas**: tabela editável, adicionar nova viatura (7 campos)  
- Aba **Férias**: editar dias disponíveis por militar, reiniciar ciclo para novo ano
- Aba **Sistema**: tema claro/noturno, exportar backup JSON, repor dados demo

### 3. Exportar estatísticas
- Botão "Exportar Excel" → CSV com BOM UTF-8 (abre correctamente no Excel português)
- Botão "Exportar PDF" → HTML formatado em nova janela com `window.print()` automático

### 4. PWA para iPhone
- `apple-touch-icon` → `assets/icon-180.png` (PNG 180×180)
- Meta tags: `apple-mobile-web-app-capable`, `apple-mobile-web-app-status-bar-style: black-translucent`, `apple-mobile-web-app-title: Sentinela`
- Splash screens para iPhone 14 Pro Max, 14 Pro, 14/13, 8/SE
- `manifest.json` com ícones 192px e 512px para Android

---

## Modificações em ficheiros existentes

### store.js — adições ao initialState
```js
posto: { ...D.posto },  // agora editável pelo admin
ferias: {
  ano: 2026,
  turnoMilitarId: 'm_costa',
  periodos: [],
  concluidos: [],
},
```

### store.js — novas actions
- `updatePosto(patch)` — actualiza dados do posto
- `addMilitar(dados)` / `updateMilitar(id, patch)`
- `addViatura(dados)` / `updateViatura(id, patch)`
- `resetFeriasAno(ano)` — reinicia marcação
- `setDiasFerias(militarId, dias)` — dias disponíveis por militar
- `adicionarPeriodoFerias({militarId, inicio, fim})` — valida e adiciona período
- `removerPeriodoFerias(periodoId)`
- `concluirMarcacaoFerias(militarId)` — marca como concluído, passa turno, envia notificação

### store.js — exports adicionais
```js
window.SentinelaStore = { getState, setState, subscribe, useStore, actions, reset, ordemAntiguidade };
```

### app_pc/Dashboard.jsx — sidebar (linhas 23-24)
```js
{ id: 'ferias', icon: 'sun',      label: 'Férias' },
{ id: 'admin',  icon: 'settings', label: 'Administração' },
```

### app_mobile/Shell.jsx — quick actions grid
```jsx
// gridTemplateColumns mudou de repeat(4,1fr) para repeat(5,1fr)
<QuickAction icon="sun" label="Férias" onClick={() => onNav('ferias')}/>
// rota adicionada:
else if (route === 'ferias') content = <FeriasScreen onBack={() => setRoute('home')}/>;
```

### pc.html — titles + scripts + render
```js
ferias: ['Férias', 'Marcação anual por ordem de antiguidade — 2026'],
admin:  ['Administração', 'Configuração do posto, efectivo, viaturas e sistema'],
// scripts:
<script type="text/babel" src="app_pc/FeriasPC.jsx"></script>
<script type="text/babel" src="app_pc/AdminPC.jsx"></script>
// render:
{active === 'ferias' && <FeriasView/>}
{active === 'admin'  && <AdminView/>}
```

### mobile.html — script adicionado
```html
<script type="text/babel" src="app_mobile/Ferias.jsx"></script>
```

### build.js — iOS meta tags adicionadas ao template HTML
```html
<link rel="manifest" href="manifest.json">
<link rel="apple-touch-icon" href="assets/icon-180.png">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Sentinela">
<link rel="apple-touch-startup-image" href="assets/splash-1290x2796.png" media="(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3)">
<!-- ... restantes splash screens ... -->
```

---

## Se os ficheiros novos não estiverem no repo

Se o repo local não tiver `app_mobile/Ferias.jsx`, `app_pc/FeriasPC.jsx`, `app_pc/AdminPC.jsx` — pede-me para criar cada um. Tenho o conteúdo completo de todos eles.

Os ficheiros modificados (`store.js`, `Dashboard.jsx`, `Shell.jsx`, `Estatisticas.jsx`, `pc.html`, `mobile.html`, `build.js`) — pede-me a diff/conteúdo de qualquer um deles se necessário.

---

## Dados de exemplo importantes

O ficheiro `data.js` tem `window.SENTINELA_DATA` com:
- `posto`: `{ nome, destacamento, comando, morada }`
- `militares[]`: cada um com `{ id, nim, posto, postoAbrev, nome, anoIngresso, diasFerias, estado, indicativo }`
- Os IDs de militares começam com `m_` (ex: `m_silva`, `m_costa`, `m_marques`)
- O campo `posto` nos militares é o posto hierárquico: `'Sargento'`, `'Cabo-chefe'`, `'Cabo'`, `'Guarda'`

A função `ordemAntiguidade(militares)` está disponível em `window.SentinelaStore.ordemAntiguidade`.
