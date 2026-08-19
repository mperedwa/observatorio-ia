import data from './json/proyectos.json';
import type { Bilingual } from '@/i18n/config';
import type {
  CamposModeloEvidencia,
  EstadoProyectoLegacy,
} from './modelo-evidencia';

export type Categoria =
  | 'judicial'
  | 'salud'
  | 'educacion'
  | 'fiscal'
  | 'infraestructura'
  | 'agricultura';
export type Estado = EstadoProyectoLegacy;

export interface Proyecto extends CamposModeloEvidencia {
  id: string;
  titulo: Bilingual;
  institucionId: string;
  categoria: Categoria;
  estado: Estado;
  descripcion: Bilingual;
  resultado?: Bilingual;
  contexto?: Bilingual;
  desde?: string;
  fuenteUrl: string;
}

export const proyectos: Proyecto[] = data as Proyecto[];
