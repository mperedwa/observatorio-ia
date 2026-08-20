import type { Locale } from '@/i18n/config';
import type { Proyecto } from './proyectos';
import type { EstadoCatalogo } from './modelo-evidencia';

export const CAPAS_CATALOGO = ['verificado', 'seguimiento', 'ecosistema'] as const;

export type CapaCatalogo = (typeof CAPAS_CATALOGO)[number];

export type TipoFechaReferencia =
  | 'inicio-operacion'
  | 'inicio-piloto'
  | 'anuncio'
  | 'primera-evidencia';

export interface ResumenInstitucionCatalogo {
  total: number;
  verificado: number;
  seguimiento: number;
  ecosistema: number;
}

export function obtenerCapaCatalogo(proyecto: Proyecto): CapaCatalogo {
  if (proyecto.estadoCatalogo === 'verificado') return 'verificado';
  if (proyecto.estadoCatalogo === 'ecosistema') return 'ecosistema';
  return 'seguimiento';
}

export function resumirInstitucionCatalogo(
  iniciativas: readonly Proyecto[],
): ResumenInstitucionCatalogo {
  return iniciativas.reduce<ResumenInstitucionCatalogo>(
    (resumen, iniciativa) => {
      const capa = obtenerCapaCatalogo(iniciativa);
      resumen.total += 1;
      resumen[capa] += 1;
      return resumen;
    },
    { total: 0, verificado: 0, seguimiento: 0, ecosistema: 0 },
  );
}

export function obtenerFechaReferencia(
  proyecto: Proyecto,
): { fecha: string; tipo: TipoFechaReferencia } | null {
  if (proyecto.faseImplementacion === 'operativo' && proyecto.fechaInicioOperacion) {
    return { fecha: proyecto.fechaInicioOperacion, tipo: 'inicio-operacion' };
  }
  if (proyecto.faseImplementacion === 'piloto' && proyecto.fechaInicioPiloto) {
    return { fecha: proyecto.fechaInicioPiloto, tipo: 'inicio-piloto' };
  }
  if (proyecto.fechaAnuncio) {
    return { fecha: proyecto.fechaAnuncio, tipo: 'anuncio' };
  }
  if (proyecto.fechaPrimeraEvidencia) {
    return { fecha: proyecto.fechaPrimeraEvidencia, tipo: 'primera-evidencia' };
  }
  return null;
}

export function obtenerAnioReferencia(proyecto: Proyecto): number | null {
  const referencia = obtenerFechaReferencia(proyecto);
  if (!referencia) return null;
  const year = Number(referencia.fecha.slice(0, 4));
  return Number.isFinite(year) ? year : null;
}

export function formatearFechaCatalogo(fecha: string, locale: Locale): string {
  if (/^\d{4}$/.test(fecha)) return fecha;

  const matchMes = fecha.match(/^(\d{4})-(\d{2})$/);
  if (matchMes) {
    const date = new Date(Date.UTC(Number(matchMes[1]), Number(matchMes[2]) - 1, 1));
    return new Intl.DateTimeFormat(locale === 'es' ? 'es-CR' : 'en-US', {
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(date);
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    const date = new Date(`${fecha}T12:00:00Z`);
    return new Intl.DateTimeFormat(locale === 'es' ? 'es-CR' : 'en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(date);
  }

  return fecha;
}

export function normalizarBusqueda(valor: string): string {
  return valor
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export function esEstadoCatalogoVisible(
  estado: EstadoCatalogo | undefined,
): estado is CapaCatalogo {
  return estado !== undefined && CAPAS_CATALOGO.includes(estado as CapaCatalogo);
}
