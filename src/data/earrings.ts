import type { Earring } from '@/types';

/**
 * Catálogo de brincos disponíveis para o try-on.
 *
 * Para adicionar brincos reais:
 * 1. Coloque o ficheiro de imagem em /public/earrings/ (PNG ou WebP)
 * 2. Adicione a entrada abaixo com o caminho "/earrings/nome.png"
 * 3. Ajuste anchorX/anchorY para o ponto de fixação no lóbulo da orelha
 * 4. Ajuste scaleFactor para o tamanho relativo ao rosto (0.1 = pequeno, 1.0 = grande)
 */
export const earrings: Earring[] = [
  {
    id: 'hoop_gold',
    name: 'Argola Dourada',
    file: '/earrings/hoop_gold.png',
    anchorX: 0.5,
    anchorY: 0.22,
    scaleFactor: 0.55,
    rotOffsetDeg: 0,
  },
  {
    id: 'stud_pearl',
    name: 'Pérola',
    file: '/earrings/stud_pearl.png',
    anchorX: 0.5,
    anchorY: 0.5,
    scaleFactor: 0.22,
    rotOffsetDeg: 0,
  },
  {
    id: 'drop_silver',
    name: 'Gota Prata',
    file: '/earrings/drop_silver.png',
    anchorX: 0.5,
    anchorY: 0.14,
    scaleFactor: 0.7,
    rotOffsetDeg: 0,
  },
];
