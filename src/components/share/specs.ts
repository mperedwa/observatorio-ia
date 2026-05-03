import { brechas } from '@/data/brechas';
import type { SizeKey } from './AssetFrame';

export interface AssetSpec {
  type: string;
  size: SizeKey;
  filename: string;
}

export const ASSET_SPECS: AssetSpec[] = [
  { type: 'kpi-hero', size: 'square', filename: 'kpi-hero-1080.png' },
  { type: 'timeline', size: 'square', filename: 'timeline-1080.png' },
  { type: 'ilia', size: 'square', filename: 'ilia-1080.png' },
  { type: 'mapa', size: 'square', filename: 'mapa-1080.png' },
  ...brechas.map((b) => ({
    type: `brecha-${b.id}`,
    size: 'square' as SizeKey,
    filename: `brecha-${b.id}-1080.png`,
  })),
  { type: 'og-home', size: 'horizontal', filename: 'og-home-1200x630.png' },
  { type: 'og-analisis', size: 'horizontal', filename: 'og-analisis-1200x630.png' },
  { type: 'og-brechas', size: 'horizontal', filename: 'og-brechas-1200x630.png' },
  { type: 'story-timeline', size: 'story', filename: 'story-timeline-1080x1920.png' },
  { type: 'story-brecha', size: 'story', filename: 'story-brecha-1080x1920.png' },
];
