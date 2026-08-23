import { describe, expect, it } from 'vitest';
import { proyectos } from '../src/data/proyectos';
import {
  formatearFechaCatalogo,
  obtenerCronologiaProyecto,
  obtenerCapaCatalogo,
  obtenerFechaReferencia,
  obtenerUltimaVerificacion,
  ordenarProyectosExpediente,
  resumirInstitucionCatalogo,
} from '../src/data/presentacion-catalogo';

describe('presentación del catálogo', () => {
  it('deriva las tres capas de una institución desde sus fichas', () => {
    const ccss = proyectos.filter((proyecto) => proyecto.institucionId === 'ccss');
    expect(resumirInstitucionCatalogo(ccss)).toEqual({
      total: 7,
      verificado: 1,
      seguimiento: 3,
      ecosistema: 3,
    });
  });

  it('usa la fecha explícita que corresponde a la fase', () => {
    const lidia = proyectos.find((proyecto) => proyecto.id === 'ccss-lidia');
    const aida = proyectos.find((proyecto) => proyecto.id === 'ccss-aida');
    expect(lidia && obtenerFechaReferencia(lidia)).toEqual({
      fecha: '2023',
      tipo: 'inicio-piloto',
    });
    expect(aida && obtenerFechaReferencia(aida)).toEqual({
      fecha: '2025-11-11',
      tipo: 'anuncio',
    });
  });

  it('clasifica sin recurrir al estado legacy', () => {
    const tribu = proyectos.find((proyecto) => proyecto.id === 'hacienda-tribu-cr');
    expect(tribu && obtenerCapaCatalogo(tribu)).toBe('ecosistema');
  });

  it('formatea fechas parciales sin inventar precisión', () => {
    expect(formatearFechaCatalogo('2026', 'es')).toBe('2026');
    expect(formatearFechaCatalogo('2026-07', 'es')).toBe('julio de 2026');
    expect(formatearFechaCatalogo('2026-07-10', 'en')).toBe('Jul 10, 2026');
  });

  it('construye una cronología solo con fechas documentadas', () => {
    const nymiz = proyectos.find((proyecto) => proyecto.id === 'pj-nymiz');
    expect(nymiz && obtenerCronologiaProyecto(nymiz)).toEqual([
      { fecha: '2024', tipo: 'inicio-operacion' },
      { fecha: '2024-03-20', tipo: 'primera-evidencia' },
      { fecha: '2026-08-19', tipo: 'ultima-verificacion' },
      { fecha: '2026-11-19', tipo: 'proxima-revision' },
    ]);
  });

  it('deriva el último corte institucional y prioriza sus capas', () => {
    const poderJudicial = proyectos.filter(
      (proyecto) => proyecto.institucionId === 'poder-judicial',
    );
    expect(obtenerUltimaVerificacion(poderJudicial)).toBe('2026-08-21');
    expect(obtenerCapaCatalogo(ordenarProyectosExpediente(poderJudicial, 'es')[0])).toBe(
      'verificado',
    );
  });
});
