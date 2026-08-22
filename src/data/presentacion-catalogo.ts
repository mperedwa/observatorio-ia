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

export type TipoHitoExpediente =
  | TipoFechaReferencia
  | 'ultima-verificacion'
  | 'proxima-revision';

export interface HitoExpediente {
  fecha: string;
  tipo: TipoHitoExpediente;
}

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

export function obtenerCronologiaProyecto(proyecto: Proyecto): HitoExpediente[] {
  const hitos: Array<HitoExpediente | null> = [
    proyecto.fechaPrimeraEvidencia
      ? { fecha: proyecto.fechaPrimeraEvidencia, tipo: 'primera-evidencia' }
      : null,
    proyecto.fechaAnuncio
      ? { fecha: proyecto.fechaAnuncio, tipo: 'anuncio' }
      : null,
    proyecto.fechaInicioPiloto
      ? { fecha: proyecto.fechaInicioPiloto, tipo: 'inicio-piloto' }
      : null,
    proyecto.fechaInicioOperacion
      ? { fecha: proyecto.fechaInicioOperacion, tipo: 'inicio-operacion' }
      : null,
    proyecto.fechaUltimaVerificacion
      ? { fecha: proyecto.fechaUltimaVerificacion, tipo: 'ultima-verificacion' }
      : null,
    proyecto.fechaProximaRevision
      ? { fecha: proyecto.fechaProximaRevision, tipo: 'proxima-revision' }
      : null,
  ];

  return hitos
    .filter((hito): hito is HitoExpediente => hito !== null)
    .sort((a, b) => a.fecha.localeCompare(b.fecha));
}

export function obtenerUltimaVerificacion(
  iniciativas: readonly Proyecto[],
): string | null {
  const fechas = iniciativas
    .map((iniciativa) => iniciativa.fechaUltimaVerificacion)
    .filter((fecha): fecha is string => fecha !== undefined)
    .sort((a, b) => b.localeCompare(a));
  return fechas[0] ?? null;
}

export function ordenarProyectosExpediente(
  iniciativas: readonly Proyecto[],
  locale: Locale,
): Proyecto[] {
  const prioridad: Record<CapaCatalogo, number> = {
    verificado: 0,
    seguimiento: 1,
    ecosistema: 2,
  };

  return [...iniciativas].sort((a, b) => {
    const diferenciaCapa =
      prioridad[obtenerCapaCatalogo(a)] - prioridad[obtenerCapaCatalogo(b)];
    if (diferenciaCapa !== 0) return diferenciaCapa;

    const diferenciaVerificacion = (b.fechaUltimaVerificacion ?? '').localeCompare(
      a.fechaUltimaVerificacion ?? '',
    );
    if (diferenciaVerificacion !== 0) return diferenciaVerificacion;

    return a.titulo[locale].localeCompare(b.titulo[locale], locale);
  });
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
