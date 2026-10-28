# Graph Report - nas  (2026-10-28)

## Corpus Check
- 26 files · ~11,331 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 10 file(s) not represented in the graph (top: .css 8, .example 1, (none) 1)

## Summary
- 243 nodes · 348 edges · 13 communities (10 shown, 3 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `07708e93`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- PreviewCanvas.tsx
- App.tsx
- package.json
- Estratégia de Produto — Virtual Earring Try-On
- compilerOptions
- Virtual Earring Try-On
- 2. Checklist de Escalabilidade
- 3. Melhorias de Renderização
- compilerOptions
- ErrorBoundary
- vite-env.d.ts
- tsconfig.json

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 17 edges
2. `App()` - 14 edges
3. `Virtual Earring Try-On` - 14 edges
4. `PreviewCanvas` - 11 edges
5. `compilerOptions` - 11 edges
6. `react` - 9 edges
7. `EarringSide` - 9 edges
8. `Estratégia de Produto — Virtual Earring Try-On` - 9 edges
9. `Earring` - 8 edges
10. `FaceData` - 7 edges

## Surprising Connections (you probably didn't know these)
- `Decisões arquitecturais` --references--> `App()`  [INFERRED]
  README.md → src/App.tsx
- `Fluxo de desenvolvimento` --references--> `warmupLandmarker()`  [INFERRED]
  README.md → src/utils/face.ts
- `EarringGalleryProps` --references--> `Earring`  [EXTRACTED]
  src/components/EarringGallery/EarringGallery.tsx → src/types/index.ts
- `OptionsPanelProps` --references--> `EarringSide`  [EXTRACTED]
  src/components/OptionsPanel/OptionsPanel.tsx → src/types/index.ts
- `App()` --calls--> `ErrorBoundary`  [EXTRACTED]
  src/App.tsx → src/components/ErrorBoundary/ErrorBoundary.tsx

## Import Cycles
- None detected.

## Communities (13 total, 3 thin omitted)

### Community 0 - "PreviewCanvas.tsx"
Cohesion: 0.11
Nodes (33): Fluxo de desenvolvimento, EmptyState(), GenerateIcon(), PreviewCanvas, PreviewCanvasProps, StatusKind, CANVAS_MAX_WIDTH, MEDIAPIPE_CONFIG (+25 more)

### Community 1 - "App.tsx"
Cohesion: 0.08
Nodes (25): Decisões arquitecturais, App(), handleDownload(), handleResult(), CheckIcon(), EarringGallery(), EarringGalleryProps, Hero() (+17 more)

### Community 2 - "package.json"
Cohesion: 0.07
Nodes (31): dependencies, @mediapipe/tasks-vision@^0.10.20, react@^18.3.1, react-dom@^18.3.1, devDependencies, @types/react@^19.2.14, @types/react-dom@^19.2.3, typescript@^6.0.3 (+23 more)

### Community 3 - "Estratégia de Produto — Virtual Earring Try-On"
Cohesion: 0.06
Nodes (33): 1. Estado Actual do Projecto, 4. Estratégia Comercial, 5. Sugestões de Melhorias do Produto, 6. Estratégia para Apresentação em 1 Semana, 7. Roadmap Técnico, 8. Conclusão Estratégica, Como causar boa impressão, Dashboard para fornecedores (+25 more)

### Community 4 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleDetection, moduleResolution (+10 more)

### Community 5 - "Virtual Earring Try-On"
Cohesion: 0.13
Nodes (14): Adicionar brincos ao catálogo, Boas práticas do projecto, Comandos disponíveis, Configuração do ambiente, Contribuir, Deploy, Docker, Estrutura de pastas (+6 more)

### Community 6 - "2. Checklist de Escalabilidade"
Cohesion: 0.13
Nodes (15): 2. Checklist de Escalabilidade, Analytics mínimo, Arquitectura, Backend e catálogo, Curto prazo — 1 a 3 meses, Deploy e qualidade, Imediato — 1 semana (antes da apresentação), Médio prazo — 3 a 6 meses (+7 more)

### Community 7 - "3. Melhorias de Renderização"
Cohesion: 0.15
Nodes (13): 3. Melhorias de Renderização, Anti-aliasing, Carregamento assíncrono do modelo MediaPipe, Compressão e formato de assets, Environment Maps, Estado actual da renderização, Iluminação simulada com blend modes, Impacto em FPS e mobile (+5 more)

### Community 8 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, allowImportingTsExtensions, isolatedModules, lib, module, moduleDetection, moduleResolution, noEmit (+4 more)

### Community 9 - "ErrorBoundary"
Cohesion: 0.29
Nodes (3): ErrorBoundary, Props, State

## Knowledge Gaps
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `package.json` to `PreviewCanvas.tsx`, `App.tsx`, `ErrorBoundary`?**
  _High betweenness centrality (0.101) - this node is a cross-community bridge._
- **Should `PreviewCanvas.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11097560975609756 - nodes in this community are weakly interconnected._
- **Why does `Virtual Earring Try-On` connect `Virtual Earring Try-On` to `PreviewCanvas.tsx`, `App.tsx`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._
- **Should `App.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0796221322537112 - nodes in this community are weakly interconnected._
- **Why does `App()` connect `App.tsx` to `PreviewCanvas.tsx`, `ErrorBoundary`, `package.json`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.07301587301587302 - nodes in this community are weakly interconnected._
- **Should `Estratégia de Produto — Virtual Earring Try-On` be split into smaller, more focused modules?**
  _Cohesion score 0.058823529411764705 - nodes in this community are weakly interconnected._