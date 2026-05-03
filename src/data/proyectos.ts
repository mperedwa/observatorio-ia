import data from './json/proyectos.json';
import type { Bilingual } from '@/i18n/config';

export type Categoria = 'judicial' | 'salud' | 'educacion' | 'fiscal' | 'infraestructura';
export type Estado = 'operativo' | 'piloto' | 'planificado';

export interface Proyecto {
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
