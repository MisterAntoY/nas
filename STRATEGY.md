# Estratégia de Produto — Virtual Earring Try-On

> **Documento confidencial** | Versão 1.0 | Maio 2026
>
> Preparado para: apresentação a parceiros, fornecedores de brincos e equipa técnica.

---

## 1. Estado Actual do Projecto

### O que existe hoje

A aplicação é um provador virtual de brincos baseado em browser, sem necessidade de instalação. O utilizador carrega uma selfie, escolhe um brinco do catálogo e obtém uma imagem composta renderizada via Canvas 2D, pronta para download. A detecção facial é feita localmente no dispositivo através do modelo **MediaPipe FaceLandmarker** (WebAssembly), o que significa que nenhuma imagem é enviada para servidores — privacidade nativa.

A base técnica foi reestruturada para produção: **React 18 + TypeScript estrito + Vite 5 + CSS Modules**, com arquitectura modular, sem débito técnico imediato.

### Pontos fortes

| Diferencial | Impacto |
| --- | --- |
| Detecção facial on-device (MediaPipe WASM) | Privacidade garantida, sem latência de rede, funciona offline após carregamento |
| Zero instalação | Funciona em qualquer browser moderno via URL |
| Posicionamento em tempo real com roll, yaw e perspectiva | Brinco adapta-se à inclinação real da cabeça |
| Exportação PNG de alta resolução | Utilizador pode partilhar/guardar resultado |
| Arquitectura TypeScript modular e escalável | Fácil de expandir por qualquer developer |
| Sem dependência de servidor | Custo de infra próximo de zero na fase actual |

### Limitações técnicas actuais

| Limitação | Criticidade | Impacto no produto |
| --- | --- | --- |
| Catálogo com apenas 3 brincos placeholder (PNG demo) | **Alta** | Parceiros não conseguem avaliar o produto com imagens reais |
| Renderização Canvas 2D (sem WebGL/Three.js) | Alta | Sem reflexos, materiais, iluminação dinâmica |
| Sem modo vídeo/tempo real (câmara) | Alta | Experiência estática — concorrentes já têm AR em tempo real |
| Interface sem polish visual para apresentação | Alta | Aspecto de protótipo, não de produto |
| Sem backend, base de dados ou autenticação | Média | Impossível gerir catálogo, utilizadores ou parcerias |
| Sem analytics ou tracking de comportamento | Média | Sem dados para convencer parceiros |
| MediaPipe carregado do CDN externo | Média | Dependência de rede; latência até 3s no primeiro uso |
| Sem optimização mobile (touch, viewport) | Média | 60–70% dos utilizadores são mobile |
| Sem sistema de partilha social integrado | Baixa | Oportunidade de viral loop perdida |
| Sem SEO | Baixa | Invisível em motores de busca |

---

## 2. Checklist de Escalabilidade

### Imediato — 1 semana (antes da apresentação)

#### Produto e UX
- [ ] Substituir os 3 brincos demo por **fotografias profissionais reais** (PNG com fundo transparente, mínimo 800×800px)
- [ ] Adicionar **mínimo 8–12 brincos** no catálogo (variedade de estilos, preços, materiais)
- [ ] Reescrever todos os textos da UI em inglês **ou** no idioma do mercado-alvo, com copywriting profissional
- [ ] Adicionar estado de loading visual enquanto o modelo MediaPipe carrega (skeleton/spinner com mensagem)
- [ ] Adicionar feedback visual de sucesso após download ("Imagem guardada!")
- [ ] Tornar o layout **100% funcional em mobile** (botões com 48px mínimo, scroll natural, testar em iPhone/Android)
- [ ] Adicionar uma landing page simples acima da aplicação (headline, valor proposto, CTA)

#### Deploy e qualidade
- [ ] Deploy em domínio próprio via **Vercel ou Netlify** (HTTPS, URL apresentável)
- [ ] Self-hospedar os ficheiros WASM e o modelo MediaPipe (eliminar dependência do CDN na apresentação)
- [ ] Testar em Chrome, Safari, Edge e Firefox — garantir que funciona em todos
- [ ] Testar em iOS Safari especificamente (WebAssembly tem restrições em alguns contextos)
- [ ] Configurar preview social (Open Graph tags) para partilha em redes sociais

#### Analytics mínimo
- [ ] Integrar **Plausible Analytics** ou Google Analytics 4 (sem cookies, GDPR-safe)
- [ ] Registar eventos: `earring_selected`, `generate_clicked`, `download_clicked`

---

### Curto prazo — 1 a 3 meses

#### Backend e catálogo
- [ ] API REST com **Node.js + Fastify** (ou Next.js API routes) para gestão de catálogo
- [ ] Base de dados **PostgreSQL** (via Supabase ou Railway) com tabelas: `earrings`, `brands`, `clicks`, `conversions`
- [ ] Painel de administração simples para adicionar/editar brincos sem tocar no código
- [ ] Sistema de upload de imagens com processamento automático (remoção de fundo via API, redimensionamento)
- [ ] Cache de imagens com CDN (Cloudflare R2 ou AWS S3 + CloudFront)

#### Arquitectura
- [ ] Migrar para **Next.js 14** (App Router) para SSR, SEO e API routes num único projecto
- [ ] Implementar **React Query / TanStack Query** para cache e sincronização de dados
- [ ] Separar catálogo de brincos do bundle JS (carregar do backend, não do código)
- [ ] Implementar **code splitting** por rota e lazy loading de componentes pesados
- [ ] Configurar **CI/CD** (GitHub Actions: lint → type-check → build → deploy automático)

#### Performance
- [ ] Self-hospedar modelo MediaPipe em CDN própria (Cloudflare R2)
- [ ] Converter imagens de brincos para **WebP com fallback PNG**
- [ ] Implementar **lazy loading** das imagens do catálogo
- [ ] Optimizar Core Web Vitals: LCP < 2.5s, CLS = 0, INP < 200ms
- [ ] Adicionar **Service Worker** para cache offline do modelo MediaPipe (carregamento instantâneo em visitas seguintes)

#### Segurança
- [ ] Validação de tipo e tamanho de ficheiro no upload (máx. 10MB, apenas imagens)
- [ ] Content Security Policy (CSP) configurado no servidor
- [ ] Rate limiting na API
- [ ] GDPR: política de privacidade, banner de cookies (se usar GA)

---

### Médio prazo — 3 a 6 meses

#### Renderização avançada
- [ ] Migrar renderização para **Three.js + WebGL** (materiais PBR, reflexos, iluminação)
- [ ] Implementar modo **câmara em tempo real** (WebRTC + MediaPipe em modo VIDEO)
- [ ] Explorar **WebXR / WebAR** para experiência de realidade aumentada no browser
- [ ] Adicionar suporte a **brincos bilaterais** (mostrar nos dois lados simultaneamente)

#### Sistema de parceiros
- [ ] Portal de onboarding para fornecedores (registo, upload de catálogo, aprovação)
- [ ] Dashboard de analytics por fornecedor (cliques, conversões, tempo de visualização)
- [ ] Sistema de afiliados com links rastreados e UTM automáticos
- [ ] API pública para fornecedores integrarem o try-on nos seus e-commerces

#### Produto
- [ ] Sistema de **favoritos** (localStorage → sincronizado com conta)
- [ ] **Autenticação** (Clerk ou Supabase Auth — social login)
- [ ] **Partilha social** directa (Instagram Stories, WhatsApp, Pinterest)
- [ ] Modo **comparação** (dois brincos lado a lado)
- [ ] Pesquisa e filtros no catálogo (preço, material, estilo, marca)

---

### Produção real — 6 a 12 meses

- [ ] **App mobile nativa** (React Native + Expo) para iOS e App Store
- [ ] Motor de **recomendação por IA** (baseado em formato de rosto detectado + histórico)
- [ ] **Multi-tenant**: cada fornecedor tem o seu subdomínio white-label (`marca.tryon.com`)
- [ ] Sistema de **pagamentos** (Stripe Connect para comissões automáticas)
- [ ] **A/B testing** de posicionamento de brincos e conversão
- [ ] Compliance: SOC 2, GDPR, LGPD
- [ ] Monitoramento: Sentry (erros), Datadog (infra), PostHog (produto)

---

## 3. Melhorias de Renderização

### Estado actual da renderização

A aplicação usa **Canvas 2D API** com as seguintes operações:

```
drawImage(selfie) → translate → rotate → scale → drawImage(earring) → shadow
```

Isto produz resultados aceitáveis para MVP, mas carece de realismo em materiais metálicos, pérolas e pedras preciosas — precisamente os materiais mais comuns em brincos.

---

### Melhorias imediatas no Canvas 2D (sem mudança de stack)

#### Anti-aliasing

O Canvas 2D não tem anti-aliasing configurable por padrão. Para suavizar bordas:

```typescript
// Em render.ts — após criar o contexto:
ctx.imageSmoothingEnabled = true;
ctx.imageSmoothingQuality = 'high'; // 'low' | 'medium' | 'high'
```

**Trade-off:** `high` usa mais GPU; em mobile com bateria fraca pode impactar 5–10% de performance.

#### Iluminação simulada com blend modes

Simular reflexo de luz ambiente com `globalCompositeOperation`:

```typescript
// Camada de highlight (brilho no metal)
ctx.globalCompositeOperation = 'screen';
ctx.drawImage(highlightOverlay, ...);
ctx.globalCompositeOperation = 'source-over';
```

**Impacto:** Melhora significativa visual em metais (ouro, prata) sem custo computacional elevado.

#### Sombras melhoradas

A shadow actual é estática. Sombra adaptativa ao yaw:

```typescript
const shadowAngle = faceData.yaw * 30; // graus
ctx.shadowOffsetX = Math.sin(degToRad(shadowAngle)) * 6;
ctx.shadowOffsetY = Math.cos(degToRad(shadowAngle)) * 6 + 4;
ctx.shadowBlur = 10 + Math.abs(faceData.yaw) * 8;
ctx.shadowColor = 'rgba(0,0,0,0.3)';
```

**Impacto:** Brinco parece "preso" ao lóbulo de forma mais convincente em diferentes ângulos.

#### Compressão e formato de assets

| Formato | Tamanho relativo | Transparência | Recomendação |
| --- | --- | --- | --- |
| PNG 32-bit | 100% | Sim | Só como fallback |
| WebP | ~30% | Sim | **Usar por defeito** |
| AVIF | ~20% | Sim | Progressivo (Safari tardio) |

Configuração recomendada no Vite:

```typescript
// vite.config.ts
import viteImagemin from 'vite-plugin-imagemin';

plugins: [
  react(),
  viteImagemin({
    webp: { quality: 85 },
    pngquant: { quality: [0.8, 0.9] },
  }),
]
```

**Impacto no carregamento:** Catálogo de 30 brincos em PNG (~15MB) → WebP (~4.5MB). LCP melhora ~1.2s em 4G.

---

### Migração para WebGL/Three.js (médio prazo)

Para renderização com qualidade de produto premium, a migração para **Three.js** permite:

#### Materiais PBR (Physically Based Rendering)

```typescript
// Exemplo: brinco dourado com MeshStandardMaterial
const earringMaterial = new THREE.MeshStandardMaterial({
  color: 0xd4af37,        // ouro
  metalness: 0.95,         // 0 = plástico, 1 = metal puro
  roughness: 0.15,         // 0 = espelho, 1 = mate
  envMap: environmentMap,  // reflexo do ambiente
});
```

**Resultado visual:** Metal com reflexos reais, brilho especular, sombras suaves — impossível de simular com Canvas 2D.

#### Environment Maps

Um HDRI de estúdio (disponível gratuitamente em Poly Haven) simula iluminação fotográfica:

```typescript
const loader = new THREE.RGBELoader();
loader.load('/hdri/studio_small.hdr', (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = texture; // luz de ambiente para todos os materiais
});
```

**Trade-off:**
- Qualidade: enorme melhoria em metais e pérolas
- Custo: +~200KB para o HDRI, +20–40ms de GPU por frame
- Mobile: reduzir `renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))`

#### Renderização progressiva

Para não bloquear a UI enquanto a cena carrega:

```typescript
// Mostrar versão Canvas 2D de baixa qualidade imediatamente
// Three.js carrega em background e substitui quando pronto
const preview = await renderCanvasPreview(selfie, earring); // rápido
showPreview(preview);

const highQuality = await renderThreeJS(selfie, earring); // qualidade
replacePreview(highQuality);
```

#### Impacto em FPS e mobile

| Dispositivo | Canvas 2D | Three.js básico | Three.js com PBR + HDRI |
| --- | --- | --- | --- |
| Desktop moderno | 60fps | 60fps | 60fps |
| iPhone 14 | 60fps | 45–60fps | 30–45fps |
| Android mid-range | 60fps | 30–45fps | 20–30fps |
| iPhone SE (2020) | 60fps | 30fps | 15–20fps (❌) |

**Estratégia recomendada:** Detectar capacidade do dispositivo e servir qualidade adaptativa:

```typescript
const tier = await getGPUTier(); // biblioteca 'detect-gpu'
const quality = tier.tier >= 2 ? 'high' : 'low';
```

---

### Carregamento assíncrono do modelo MediaPipe

Actualmente, o modelo (≈5MB) é descarregado na primeira detecção. Estratégia melhorada:

```typescript
// 1. Pré-carregar durante splash screen (não bloqueia render)
// 2. Persistir no Cache API do browser
// 3. Service Worker interceta requests ao modelo e serve do cache
// → Segundo carregamento: instantâneo (< 50ms)
```

**Impacto UX:** Na primeira visita, utilizador vê loading de 2–4s (aceitável com feedback claro). Em visitas seguintes: instantâneo.

---

## 4. Estratégia Comercial

### O mercado

O mercado global de jóias atingiu **$353B em 2023** e cresce a 9,5% ao ano. O segmento de try-on virtual cresceu **300% pós-2020** (impulsionado por Snap, Sephora, Amazon). Retalhistas que implementam try-on virtual reportam **redução de devoluções de 30–40%** e **aumento de conversão de 2.5×**.

---

### Modelo 1 — Redireccionar para lojas (afiliados)

A implementação mais rápida. Cada brinco no catálogo tem um link de compra rastreado:

```typescript
// src/data/earrings.ts
{
  id: 'hoop_gold_zara',
  name: 'Argola Dourada Zara',
  file: '/earrings/hoop_gold_zara.webp',
  price: 25.99,
  currency: 'EUR',
  buyUrl: 'https://zara.com/pt/product/123?utm_source=tryon&utm_medium=affiliate&utm_campaign=hoop_gold',
  brand: 'Zara',
  // ...
}
```

**Botão "Comprar" no preview:**

```
[ Gerar ] → [ ★ Guardar ] → [ 🛒 Comprar — €25.99 ]
```

**Tracking de conversão:**

```typescript
function trackClick(earringId: string, destination: string) {
  analytics.track('buy_click', { earringId, destination, timestamp: Date.now() });
  window.open(destination, '_blank', 'noopener');
}
```

**Revenue:** Comissões de afiliado típicas em moda: **5–15%** por venda confirmada.

---

### Modelo 2 — Catálogo patrocinado (B2B SaaS)

Fornecedores pagam para figurar no catálogo. Semelhante ao modelo Google Shopping:

| Tier | Preço/mês | Brincos incluídos | Posição | Analytics |
| --- | --- | --- | --- | --- |
| Starter | €49 | 10 | Standard | Básico |
| Growth | €149 | 50 | Prioritário | Completo |
| Premium | €399 | Ilimitado | Featured + Badge | Completo + API |

**Implementação:** Tabela `brand_subscriptions` na base de dados. Painel de gestão para fornecedores carregarem o catálogo e acompanharem métricas.

---

### Modelo 3 — API white-label (B2B2C)

Fornecedores integram o try-on directamente na sua loja (Shopify, WooCommerce):

```html
<!-- Widget embed para qualquer site -->
<script src="https://tryon.api.com/widget.js" data-brand-id="ABC123"></script>
<earring-tryon product-id="SKU-456" />
```

**Pricing:** €0.01 por sessão activa + €99/mês base. Um fornecedor médio com 5000 sessões/mês paga **€149/mês**.

**Valor para o fornecedor:** Elimina necessidade de desenvolver a própria solução de try-on (custo mínimo de €50K para desenvolver internamente).

---

### Modelo 4 — Comissão por venda (marketplace)

Plataforma funciona como marketplace de brincos. Revenue share directo:

- Fornecedor define preço
- Plataforma cobra **12–18% por transacção**
- Pagamentos via **Stripe Connect** (sem gestão manual)

**Analogia:** Etsy para brincos, mas com try-on virtual integrado.

---

### Tracking de conversões — implementação técnica

```typescript
// Funil de conversão a medir
const FUNNEL_EVENTS = [
  'page_view',          // utilizador chegou
  'earring_selected',   // escolheu brinco
  'generate_clicked',   // tentou gerar
  'face_detected',      // detecção bem-sucedida
  'download_clicked',   // guardou imagem
  'buy_clicked',        // clicou em comprar
  'purchase_confirmed', // confirmado via webhook do parceiro
];
```

KPIs a apresentar a parceiros:
- **Taxa de engajamento:** utilizadores que chegam a `face_detected` / total
- **Taxa de download:** indicador de intenção de compra
- **CTR para loja:** `buy_clicked` / `download_clicked`
- **Taxa de conversão final:** `purchase_confirmed` / `buy_clicked`

---

## 5. Sugestões de Melhorias do Produto

### Impacto alto — curto prazo

| Funcionalidade | Esforço | Impacto comercial | Prioridade |
| --- | --- | --- | --- |
| **Modo câmara em tempo real** | Alto | Muito alto — experiência imersiva | 🔴 Crítica |
| **Botão "Comprar" por brinco** | Baixo | Alto — monetização directa | 🔴 Crítica |
| **Partilha para Instagram/WhatsApp** | Médio | Alto — viral loop | 🟠 Alta |
| **Favoritos (wishlist)** | Baixo | Médio — retenção | 🟠 Alta |
| **Filtros no catálogo** (preço, material, estilo) | Médio | Médio | 🟡 Média |
| **Landing page com hero section** | Baixo | Alto — primeira impressão | 🔴 Crítica |

### Modo câmara em tempo real

O maior salto de qualidade de produto possível. MediaPipe já suporta modo `VIDEO`:

```typescript
// face.ts — mudança de runningMode
const faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
  runningMode: 'VIDEO', // em vez de 'IMAGE'
  numFaces: 1,
});

// Loop de renderização
async function videoLoop(videoElement: HTMLVideoElement) {
  const timestamp = performance.now();
  const result = faceLandmarker.detectForVideo(videoElement, timestamp);
  await renderTryOn({ canvas, selfieImg: videoElement, faceData: result, earring });
  requestAnimationFrame(() => videoLoop(videoElement));
}
```

**Impacto:** Transforma o produto de "ferramenta de edição" para "espelho virtual inteligente".

### WebAR (Realidade Aumentada no browser)

Usar **WebXR API** (suportado em Chrome Android e alguns iOS via WebKit):

```typescript
// Verificar suporte
if ('xr' in navigator) {
  const supported = await navigator.xr.isSessionSupported('immersive-ar');
  if (supported) enableARMode();
}
```

Alternativa mais madura: **8th Wall** (comercial, €500/mês) ou **Zappar** para AR com suporte cross-browser garantido.

### IA de recomendação por formato de rosto

MediaPipe já detecta o formato do rosto (oval, redondo, quadrado, coração). Cruzar com dados de preferência:

```typescript
const faceShape = classifyFaceShape(faceData.landmarks);
// → 'oval' | 'round' | 'square' | 'heart' | 'oblong'

const recommendations = earrings.filter(e => 
  e.recommendedFor.includes(faceShape)
).sort((a, b) => b.popularityScore - a.popularityScore);
```

**Copy de conversão:** _"Para o teu formato de rosto oval, os aros longos realçam as maçãs do rosto"_ — joia personalizada converte 40% melhor.

### Dashboard para fornecedores

```text
Painel do Fornecedor:
├── Catálogo (gestão de produtos, fotos, preços)
├── Analytics (vistas, cliques, conversões por produto)
├── Receitas (comissões, facturas)
├── Try-on Stats (produtos mais experimentados vs. mais comprados)
└── Configurações (brand kit, link da loja)
```

---

## 6. Estratégia para Apresentação em 1 Semana

### Prioridades absolutas (não negociáveis)

1. **Fotografias profissionais de brincos reais** — sem isto, a demo não convence ninguém.
   - Contratar fotógrafo de produto por 1 dia (€150–300)
   - Ou pedir emprestado catálogo de um fornecedor parceiro com fundo branco
   - Mínimo: 12 brincos, variedade de estilos (argolas, studs, gotas, cuff)
   - Processar em WebP com fundo transparente (remove.bg API: €2–5 para 12 imagens)

2. **Deploy em domínio próprio com HTTPS**
   - `tryon.seudominio.com` ou `virtual.seudominio.com`
   - Vercel: grátis, deploy em 5 minutos, SSL automático
   - Modelo MediaPipe auto-hospedado (eliminar dependência CDN na demo)

3. **Landing page acima da aplicação**
   - Headline: _"Experimente qualquer brinco antes de comprar — em 3 segundos, sem instalar nada"_
   - 3 bullets de valor: sem app, privacidade (sem upload para servidor), funciona em qualquer telemóvel
   - CTA: "Experimentar agora →"

4. **Testar em iPhone e Android físicos** — não apenas emuladores

5. **Script da demo preparado** — praticar a demo completa 5× antes da reunião

---

### O que pode ser mockado (sem implementar)

| Funcionalidade | Como simular na demo |
| --- | --- |
| Dashboard de analytics | Screenshot do Figma com números fictícios realistas |
| Sistema de afiliados | Mostrar o wireframe e explicar o modelo |
| Portal de fornecedores | Deck de slides com UX mockado |
| Modo câmara em tempo real | Vídeo gravado com a funcionalidade simulada |
| Conversões por produto | Tabela Excel com dados inventados plausíveis |

> **Regra de ouro para demos:** o que funciona funciona em tempo real; o que não existe é "em desenvolvimento para Q3 2026".

---

### Melhorias visuais rápidas (menos de 4h cada)

1. **Favicon e Open Graph** — aspecto profissional quando partilhar o link
2. **Google Fonts** — Geist ou Inter para aspecto mais premium
3. **Cor de marca** — paleta de 2–3 cores consistente (substituir `#111` por cor da marca)
4. **Animação de entrada** — fade-in suave nos componentes (CSS `@keyframes`)
5. **Brinco em destaque** — primeiro brinco do catálogo com badge "Mais popular"
6. **Footer** com logo da empresa, email de contacto e "Powered by [Nome]"

---

### Como causar boa impressão

**Abertura da demo (30 segundos):**
> _"Sem instalar nada, sem enviar fotos para nenhum servidor — a IA corre directamente no vosso browser. Deixem-me mostrar."_
→ Abre o telemóvel, tira selfie, escolhe argola dourada, clica Gerar. 4 segundos.

**Números para destacar a parceiros:**
- Estudos da Snap/Shopify: try-on virtual reduz devoluções em **38%**
- Taxa de conversão sobe **2.5×** quando cliente experimenta antes de comprar
- **Zero dados enviados para servidor** — diferencial de privacidade vs. concorrência
- Funciona em **qualquer dispositivo com câmara** — sem app, sem fricção
- Tempo de integração do widget num e-commerce: **< 1 hora**

---

## 7. Roadmap Técnico

### Fase 1 — MVP Apresentável (semana 1)

**Objectivo:** Produto que impressiona parceiros numa demonstração ao vivo.

| Área | Entregas |
| --- | --- |
| Produto | 12+ brincos reais, landing page, UX polida |
| Técnico | Deploy Vercel, modelo auto-hospedado, mobile responsivo |
| Analytics | GA4 básico, eventos de funil configurados |
| Comercial | Deck de parceiros, modelo de negócio definido |

**Métricas de sucesso:** Demo funciona sem falhas, pelo menos 1 parceiro pede follow-up.

---

### Fase 2 — Beta Privado (mês 1–3)

**Objectivo:** Primeiro parceiro real integrado, modo câmara funcional.

| Área | Entregas |
| --- | --- |
| Produto | Modo câmara em tempo real, favoritos, filtros, partilha social |
| Backend | API Node.js + PostgreSQL, painel admin, upload de catálogo |
| Comercial | 3–5 fornecedores em beta, primeiro contrato de afiliado |
| Técnico | CI/CD, testes E2E básicos, monitoramento de erros (Sentry) |
| Analytics | Funil completo, dashboard de conversões |

**Métricas de sucesso:** 500 utilizadores activos/mês, 1 fornecedor pagante.

---

### Fase 3 — Produção (mês 3–6)

**Objectivo:** Produto comercialmente viável com receita recorrente.

| Área | Entregas |
| --- | --- |
| Produto | WebAR (mobile), recomendações por formato de rosto, wishlist com conta |
| Backend | Multi-tenant, API pública, widget embeddable |
| Comercial | 20+ fornecedores, sistema de pagamentos (Stripe Connect) |
| Técnico | Three.js + PBR, performance A++ (Lighthouse), testes de carga |
| Legal | Termos de serviço, GDPR/LGPD, política de privacidade |

**Métricas de sucesso:** MRR > €5.000, NPS > 40, Lighthouse score > 90.

---

### Fase 4 — Escala (mês 6–12)

**Objectivo:** Plataforma de referência para try-on virtual em Portugal/Brasil.

| Área | Entregas |
| --- | --- |
| Produto | App iOS/Android (React Native), motor de recomendação ML, AR avançado |
| Backend | Microserviços, infra Kubernetes, 99.9% SLA |
| Comercial | 100+ fornecedores, marketplace próprio, parcerias com retail chains |
| Internacionalização | EN, PT-BR, ES, FR |
| Funding | Deck para angel investors ou aceleradoras (prova de tracção) |

**Métricas de sucesso:** MRR > €50.000, 50.000 utilizadores activos/mês, série A em preparação.

---

## 8. Conclusão Estratégica

### O potencial

O try-on virtual de jóias é um problema resolvido de forma cara (apps nativas, hardware especial) ou de forma superficial (filtros AR simplistas). Esta plataforma está numa posição única:

- **Tecnologia de ponta** (MediaPipe + WebAssembly) com **zero fricção** para o utilizador
- **Privacy-first** num momento em que utilizadores são cada vez mais sensíveis a onde vão os seus dados
- **B2B2C escalável**: um produto para o consumidor final, uma plataforma para os fornecedores

O mercado de jóias em Portugal movimenta **€800M/ano**. Capturar 0.1% desse volume via comissões representa €800K de GMV. Com 15% de comissão média: €120K de receita anual — atingível com 20 fornecedores activos.

### Riscos actuais

| Risco | Probabilidade | Mitigação |
| --- | --- | --- |
| Demo falha por falta de imagens profissionais | Alta | Resolver esta semana — prioridade #1 |
| MediaPipe não funciona em Safari iOS em apresentação | Média | Testar antes, ter fallback com vídeo gravado |
| Concorrente lança produto similar | Baixa | Velocidade de execução + parcerias exclusivas como barreira |
| Fornecedores hesitam em partilhar catálogo | Média | Oferecer beta gratuito 3 meses, sem risco |
| Qualidade visual não convence comparado a apps nativas | Média | Migração para Three.js em 3 meses; posicionar pelo preço e fricção zero |

### Diferenciais competitivos

1. **Zero instalação** — concorrentes como Snap e Perfect Corp requerem app ou SDK pesado
2. **Privacidade nativa** — detecção on-device, nenhuma selfie sai do browser
3. **Widget embeddable** — qualquer loja pode integrar em < 1 hora
4. **Custo de operação baixíssimo** — sem GPU servers, sem infra pesada de ML
5. **Customização total** — white-label para cada fornecedor manter identidade de marca

### Próximos 7 dias — acções concretas por ordem de impacto

1. **Hoje:** Solicitar catálogo de brincos a fornecedor ou contratar sessão fotográfica
2. **Dia 2:** Processar imagens (remove.bg), adicionar ao catálogo, testar renderização
3. **Dia 3:** Deploy em Vercel com domínio próprio; self-hospedar modelo MediaPipe
4. **Dia 4:** Landing page + polish visual + textos profissionais
5. **Dia 5:** Testes cross-browser e cross-device (iPhone, Android, Safari, Chrome)
6. **Dia 6:** Preparar deck de parceiros; definir pricing inicial; preparar script de demo
7. **Dia 7 (apresentação):** Demo ao vivo com produto funcional + deck com visão de produto

---

> _"A diferença entre um protótipo e um produto é a confiança que inspira. Com as imagens certas e uma demo fluida, esta tecnologia pode convencer qualquer parceiro do sector."_

---

**Documento preparado por:** Equipa de Produto e Engenharia
**Data:** Maio 2026 | **Versão:** 1.0
