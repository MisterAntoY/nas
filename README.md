# Virtual Earring Try-On

Aplicação web que permite experimentar brincos virtualmente através de detecção facial por IA. O utilizador faz upload de uma selfie, escolhe um brinco do catálogo e obtém um preview realista para download.

---

## Stack

| Camada | Tecnologia |
| --- | --- |
| Framework | React 18 + TypeScript |
| Build tool | Vite 5 |
| Detecção facial | MediaPipe FaceLandmarker (WASM) |
| Estilo | CSS Modules + design tokens CSS |
| Linting | ESLint + typescript-eslint |

---

## Pré-requisitos

- Node.js ≥ 18
- npm ≥ 9

---

## Instalação

```bash
# 1. Clonar o repositório
git clone <url-do-repositorio>
cd nas

# 2. Instalar dependências
npm install

# 3. Copiar ficheiro de ambiente
cp .env.example .env.local
```

---

## Configuração do ambiente

O ficheiro `.env.local` (não versionado) sobrepõe as variáveis do `.env.example`.

| Variável | Padrão | Descrição |
| --- | --- | --- |
| `VITE_MEDIAPIPE_WASM_URL` | CDN jsDelivr | URL do WASM do MediaPipe |
| `VITE_MEDIAPIPE_MODEL_URL` | Google Cloud Storage | URL do modelo de detecção facial |
| `VITE_CANVAS_MAX_WIDTH` | `900` | Largura máxima do canvas de exportação |

> Para ambientes sem acesso à internet, faça o download do modelo e sirva-o localmente.

---

## Comandos disponíveis

```bash
npm run dev          # Servidor de desenvolvimento (localhost:5173)
npm run build        # Build de produção (output: dist/)
npm run preview      # Preview do build de produção
npm run type-check   # Verificação de tipos TypeScript (sem emitir ficheiros)
npm run lint         # ESLint em todos os ficheiros .ts e .tsx
```

---

## Estrutura de pastas

```text
nas/
├── public/
│   └── earrings/          # Imagens dos brincos (PNG/WebP)
│       ├── hoop_gold.png
│       ├── stud_pearl.png
│       └── drop_silver.png
├── src/
│   ├── components/        # Componentes React (um directório por componente)
│   │   ├── EarringGallery/
│   │   ├── ErrorBoundary/
│   │   ├── OptionsPanel/
│   │   ├── PreviewCanvas/
│   │   └── Upload/
│   ├── config/
│   │   └── mediapipe.ts   # URLs e parâmetros do MediaPipe
│   ├── data/
│   │   └── earrings.ts    # Catálogo de brincos (tipado)
│   ├── styles/
│   │   └── tokens.css     # Design tokens CSS (cores, espaçamentos, raios)
│   ├── types/
│   │   └── index.ts       # Tipos partilhados (Earring, FaceData, etc.)
│   ├── utils/
│   │   ├── face.ts        # Detecção facial com MediaPipe
│   │   ├── image.ts       # Carregamento e gestão de imagens
│   │   └── render.ts      # Renderização canvas + exportação
│   ├── App.module.css
│   ├── App.tsx
│   ├── index.css          # Reset global + import de tokens
│   ├── main.tsx           # Ponto de entrada React
│   └── vite-env.d.ts      # Tipos das variáveis de ambiente Vite
├── .env.example
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

---

## Fluxo de desenvolvimento

```text
Upload selfie  →  Escolher brinco  →  Gerar preview  →  Download PNG
     ↑                  ↑                   ↑
  Upload.tsx      EarringGallery.tsx    PreviewCanvas.tsx
                                             ↓
                                    face.ts (MediaPipe)
                                    render.ts (Canvas 2D)
```

1. O utilizador faz upload de uma imagem
2. `PreviewCanvas` carrega a imagem em memória
3. Ao clicar **Gerar**, `face.ts` detecta os landmarks faciais com MediaPipe
4. `render.ts` posiciona o brinco no canvas com transformações geométricas (rotate, scale, translate)
5. O botão **Download** exporta o canvas como PNG

> O modelo MediaPipe é pré-aquecido automaticamente no arranque da aplicação (`warmupLandmarker`) para reduzir o delay na primeira detecção.

---

## Adicionar brincos ao catálogo

1. Coloque a imagem (PNG ou WebP com transparência) em `/public/earrings/`
2. Abra `src/data/earrings.ts` e adicione uma entrada:

```typescript
{
  id: 'meu_brinco',
  name: 'Nome visível',
  file: '/earrings/meu_brinco.png',
  anchorX: 0.5,   // ponto de fixação horizontal (0 = esquerda, 1 = direita)
  anchorY: 0.15,  // ponto de fixação vertical   (0 = topo, 1 = base)
  scaleFactor: 0.5, // tamanho relativo à distância entre olhos
  rotOffsetDeg: 0,  // rotação adicional em graus
}
```

---

## Boas práticas do projecto

- **TypeScript estrito** — `strict: true` no tsconfig. Sem `any` implícito.
- **CSS Modules** — cada componente tem o seu `.module.css`. Sem estilos inline.
- **Design tokens** — todas as cores, espaçamentos e raios estão em `src/styles/tokens.css`.
- **Separação de responsabilidades** — UI em componentes, lógica em utils, config em config/.
- **Sem estado global** — o estado é gerido localmente; adicionar Zustand/Jotai apenas quando necessário.
- **Sem comentários desnecessários** — o código deve ser auto-explicativo. Comentar apenas o *porquê*, nunca o *quê*.

---

## Testes

Não há testes automatizados nesta fase MVP. Para adicionar:

```bash
npm install -D vitest @testing-library/react @testing-library/user-event jsdom
```

Estrutura recomendada:

```text
src/
└── utils/
    ├── face.ts
    └── face.test.ts   # testes unitários das funções puras
```

---

## Deploy

### Vercel / Netlify (recomendado)

```bash
npm run build
# Fazer upload da pasta dist/ ou ligar ao repositório Git
```

### Docker

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
```

---

## Decisões arquitecturais

| Decisão | Justificação |
| --- | --- |
| Vite em vez de CRA | Build mais rápido, HMR nativo, melhor suporte ESM |
| CSS Modules em vez de Tailwind | Sem dependência extra, estilos colocalizados, sem purge |
| Design tokens CSS nativos | Zero runtime, compatível com qualquer ferramenta |
| `forwardRef` no PreviewCanvas | Permite ao `App` aceder ao canvas sem armazenar DOM em estado |
| MediaPipe warmup no módulo | Reduz o delay da primeira detecção sem bloquear o render |
| Dados em `.ts` em vez de `.json` | Tipagem directa, sem parsing, comentários possíveis |
| Sem store global (Zustand/Redux) | Estado simples, escala bem com hooks locais neste tamanho |

---

## Contribuir

1. Crie um branch a partir de `main`: `git checkout -b feat/nome-da-feature`
2. Faça as alterações com commits descritivos
3. Execute `npm run type-check && npm run lint` antes de abrir PR
4. Abra um Pull Request com descrição do que mudou e porquê
